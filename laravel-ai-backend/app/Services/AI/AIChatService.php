<?php

namespace App\Services\AI;

use App\Services\AI\Contracts\AIProviderInterface;
use App\Services\AI\Providers\OpenAIProvider;
use App\Services\AI\Providers\GeminiProvider;
use App\Services\AI\Providers\ClaudeProvider;
use Illuminate\Support\Facades\DB;
use Exception;

class AIChatService
{
    protected AIUsageService $usageService;

    public function __construct(AIUsageService $usageService)
    {
        $this->usageService = $usageService;
    }

    /**
     * Resolve the requested AI provider instance.
     */
    public function resolveProvider(string $providerName = 'openai'): AIProviderInterface
    {
        return match (strtolower($providerName)) {
            'gemini' => new GeminiProvider(),
            'claude' => new ClaudeProvider(),
            default => new OpenAIProvider(),
        };
    }

    /**
     * Process an incoming user chat message within a conversation.
     */
    public function sendMessage(int $userId, array $params): array
    {
        $conversationId = $params['conversation_id'] ?? null;
        $userMessage = $params['message'] ?? '';
        $model = $params['model'] ?? 'gpt-4o';
        $providerName = $params['provider'] ?? 'openai';
        $context = $params['context'] ?? [];

        // Verify or create conversation
        if ($conversationId) {
            $conversation = DB::table('ai_conversations')
                ->where('id', $conversationId)
                ->where('user_id', $userId)
                ->first();

            if (!$conversation) {
                throw new Exception('Conversation not found or access denied.');
            }
        } else {
            $conversationId = DB::table('ai_conversations')->insertGetId([
                'user_id' => $userId,
                'title' => substr($userMessage, 0, 50) . '...',
                'provider' => $providerName,
                'model' => $model,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Store user message
        DB::table('ai_messages')->insert([
            'conversation_id' => $conversationId,
            'role' => 'user',
            'content' => $userMessage,
            'metadata' => json_encode(['context' => $context]),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Load conversation history for context
        $history = DB::table('ai_messages')
            ->where('conversation_id', $conversationId)
            ->orderBy('id', 'asc')
            ->limit(20)
            ->get()
            ->map(fn($m) => ['role' => $m->role, 'content' => $m->content])
            ->toArray();

        // System Prompt injection
        $systemPrompt = "You are ProposalOS AI, an elite enterprise proposal and sales engineering copilot. Provide structured, authoritative responses.";
        array_unshift($history, ['role' => 'system', 'content' => $systemPrompt]);

        // Execute LLM request
        $provider = $this->resolveProvider($providerName);
        $result = $provider->chat($history, ['model' => $model]);

        // Store assistant response
        $msgId = DB::table('ai_messages')->insertGetId([
            'conversation_id' => $conversationId,
            'role' => 'assistant',
            'content' => $result['content'],
            'tokens_input' => $result['tokens']['input'] ?? 0,
            'tokens_output' => $result['tokens']['output'] ?? 0,
            'model' => $result['model'],
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Track usage & costs
        $this->usageService->logUsage($userId, [
            'provider' => $providerName,
            'model' => $result['model'],
            'input_tokens' => $result['tokens']['input'] ?? 0,
            'output_tokens' => $result['tokens']['output'] ?? 0,
            'operation' => 'chat',
        ]);

        return [
            'id' => (string)$msgId,
            'conversation_id' => (string)$conversationId,
            'role' => 'assistant',
            'content' => $result['content'],
            'model' => $result['model'],
            'tokens' => $result['tokens'],
            'created_at' => now()->toIso8601String(),
        ];
    }
}
