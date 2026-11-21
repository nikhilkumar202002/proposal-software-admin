<?php

namespace App\Services\AI\Providers;

use App\Services\AI\Contracts\AIProviderInterface;
use Illuminate\Support\Facades\Http;
use Exception;

class ClaudeProvider implements AIProviderInterface
{
    protected string $apiKey;
    protected string $baseUrl;
    protected string $defaultModel;

    public function __construct()
    {
        $this->apiKey = config('services.ai.claude.api_key', env('ANTHROPIC_API_KEY', ''));
        $this->baseUrl = 'https://api.anthropic.com/v1';
        $this->defaultModel = config('services.ai.claude.default_model', 'claude-3-7-sonnet-20250219');

        if (empty($this->apiKey)) {
            throw new Exception('Anthropic API Key is missing. Set ANTHROPIC_API_KEY in your .env file.');
        }
    }

    public function chat(array $messages, array $options = []): array
    {
        $model = $options['model'] ?? $this->defaultModel;

        // Extract system prompt if present
        $system = '';
        $filteredMessages = [];

        foreach ($messages as $msg) {
            if ($msg['role'] === 'system') {
                $system .= $msg['content'] . "\n";
            } else {
                $filteredMessages[] = [
                    'role' => $msg['role'],
                    'content' => $msg['content'],
                ];
            }
        }

        $payload = [
            'model' => $model,
            'messages' => $filteredMessages,
            'max_tokens' => $options['max_tokens'] ?? 4000,
            'temperature' => $options['temperature'] ?? 0.7,
        ];

        if (!empty($system)) {
            $payload['system'] = trim($system);
        }

        $response = Http::withHeaders([
            'x-api-key' => $this->apiKey,
            'anthropic-version' => '2023-06-01',
            'content-type' => 'application/json',
        ])->timeout(60)->post("{$this->baseUrl}/messages", $payload);

        if ($response->failed()) {
            throw new Exception("Anthropic Claude request failed: " . $response->body());
        }

        $data = $response->json();
        $text = $data['content'][0]['text'] ?? '';
        $usage = $data['usage'] ?? ['input_tokens' => 0, 'output_tokens' => 0];

        return [
            'content' => $text,
            'tokens' => [
                'input' => $usage['input_tokens'] ?? 0,
                'output' => $usage['output_tokens'] ?? 0,
            ],
            'model' => $model,
            'provider' => 'claude',
        ];
    }

    public function generateStructured(string $systemPrompt, string $userPrompt, array $schema = []): array
    {
        $system = $systemPrompt . "\nStrict Requirement: Return ONLY a valid JSON object matching the requested schema. Do not include markdown codeblocks or preamble.";

        $result = $this->chat([
            ['role' => 'system', 'content' => $system],
            ['role' => 'user', 'content' => $userPrompt],
        ], ['temperature' => 0.2]);

        $raw = trim($result['content']);
        // Strip markdown blocks if Claude included them
        $raw = preg_replace('/^```(?:json)?\s*/i', '', $raw);
        $raw = preg_replace('/\s*```$/i', '', $raw);

        $decoded = json_decode($raw, true);
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Claude structured JSON parsing failed: " . json_last_error_msg());
        }

        return $decoded;
    }

    public function getIdentifier(): string
    {
        return 'claude';
    }
}
