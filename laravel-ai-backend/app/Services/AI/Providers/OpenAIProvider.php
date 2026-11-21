<?php

namespace App\Services\AI\Providers;

use App\Services\AI\Contracts\AIProviderInterface;
use Illuminate\Support\Facades\Http;
use Exception;

class OpenAIProvider implements AIProviderInterface
{
    protected string $apiKey;
    protected string $baseUrl;
    protected string $defaultModel;

    public function __construct()
    {
        $this->apiKey = config('services.ai.openai.api_key', env('OPENAI_API_KEY', ''));
        $this->baseUrl = config('services.ai.openai.base_url', 'https://api.openai.com/v1');
        $this->defaultModel = config('services.ai.openai.default_model', 'gpt-4o');

        if (empty($this->apiKey)) {
            throw new Exception('OpenAI API Key is missing. Please set OPENAI_API_KEY in your .env file.');
        }
    }

    public function chat(array $messages, array $options = []): array
    {
        $model = $options['model'] ?? $this->defaultModel;

        $response = Http::withToken($this->apiKey)
            ->timeout(60)
            ->post("{$this->baseUrl}/chat/completions", [
                'model' => $model,
                'messages' => $messages,
                'temperature' => $options['temperature'] ?? 0.7,
                'max_tokens' => $options['max_tokens'] ?? 4000,
            ]);

        if ($response->failed()) {
            throw new Exception("OpenAI API request failed: " . $response->body());
        }

        $data = $response->json();
        $content = $data['choices'][0]['message']['content'] ?? '';
        $usage = $data['usage'] ?? ['prompt_tokens' => 0, 'completion_tokens' => 0];

        return [
            'content' => $content,
            'tokens' => [
                'input' => $usage['prompt_tokens'] ?? 0,
                'output' => $usage['completion_tokens'] ?? 0,
            ],
            'model' => $model,
            'provider' => 'openai',
        ];
    }

    public function generateStructured(string $systemPrompt, string $userPrompt, array $schema = []): array
    {
        $messages = [
            ['role' => 'system', 'content' => $systemPrompt],
            ['role' => 'user', 'content' => $userPrompt],
        ];

        $payload = [
            'model' => $this->defaultModel,
            'messages' => $messages,
            'response_format' => ['type' => 'json_object'],
            'temperature' => 0.3,
        ];

        $response = Http::withToken($this->apiKey)
            ->timeout(60)
            ->post("{$this->baseUrl}/chat/completions", $payload);

        if ($response->failed()) {
            throw new Exception("OpenAI Structured output failed: " . $response->body());
        }

        $rawJson = $response->json()['choices'][0]['message']['content'] ?? '{}';
        $decoded = json_decode($rawJson, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Failed to parse JSON response from OpenAI: " . json_last_error_msg());
        }

        return $decoded;
    }

    public function getIdentifier(): string
    {
        return 'openai';
    }
}
