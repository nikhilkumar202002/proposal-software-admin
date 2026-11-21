<?php

namespace App\Services\AI\Providers;

use App\Services\AI\Contracts\AIProviderInterface;
use Illuminate\Support\Facades\Http;
use Exception;

class GeminiProvider implements AIProviderInterface
{
    protected string $apiKey;
    protected string $baseUrl;
    protected string $defaultModel;

    public function __construct()
    {
        $this->apiKey = config('services.ai.gemini.api_key', env('GEMINI_API_KEY', ''));
        $this->baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
        $this->defaultModel = config('services.ai.gemini.default_model', 'gemini-2.0-flash');

        if (empty($this->apiKey)) {
            throw new Exception('Gemini API Key is missing. Set GEMINI_API_KEY in your .env file.');
        }
    }

    public function chat(array $messages, array $options = []): array
    {
        $model = $options['model'] ?? $this->defaultModel;
        $url = "{$this->baseUrl}/models/{$model}:generateContent?key={$this->apiKey}";

        // Format contents for Gemini
        $contents = [];
        foreach ($messages as $msg) {
            $role = ($msg['role'] === 'assistant') ? 'model' : 'user';
            $contents[] = [
                'role' => $role,
                'parts' => [['text' => $msg['content']]],
            ];
        }

        $response = Http::timeout(60)->post($url, [
            'contents' => $contents,
            'generationConfig' => [
                'temperature' => $options['temperature'] ?? 0.7,
                'maxOutputTokens' => $options['max_tokens'] ?? 4096,
            ],
        ]);

        if ($response->failed()) {
            throw new Exception("Gemini API request failed: " . $response->body());
        }

        $data = $response->json();
        $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';
        $usage = $data['usageMetadata'] ?? ['promptTokenCount' => 0, 'candidatesTokenCount' => 0];

        return [
            'content' => $text,
            'tokens' => [
                'input' => $usage['promptTokenCount'] ?? 0,
                'output' => $usage['candidatesTokenCount'] ?? 0,
            ],
            'model' => $model,
            'provider' => 'gemini',
        ];
    }

    public function generateStructured(string $systemPrompt, string $userPrompt, array $schema = []): array
    {
        $url = "{$this->baseUrl}/models/{$this->defaultModel}:generateContent?key={$this->apiKey}";

        $response = Http::timeout(60)->post($url, [
            'systemInstruction' => [
                'parts' => [['text' => $systemPrompt]],
            ],
            'contents' => [
                [
                    'role' => 'user',
                    'parts' => [['text' => $userPrompt . "\nRespond with valid JSON only."]],
                ],
            ],
            'generationConfig' => [
                'responseMimeType' => 'application/json',
                'temperature' => 0.2,
            ],
        ]);

        if ($response->failed()) {
            throw new Exception("Gemini Structured Output failed: " . $response->body());
        }

        $text = $response->json()['candidates'][0]['content']['parts'][0]['text'] ?? '{}';
        $decoded = json_decode($text, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Invalid JSON returned by Gemini: " . json_last_error_msg());
        }

        return $decoded;
    }

    public function getIdentifier(): string
    {
        return 'gemini';
    }
}
