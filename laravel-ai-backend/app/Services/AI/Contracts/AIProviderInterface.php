<?php

namespace App\Services\AI\Contracts;

interface AIProviderInterface
{
    /**
     * Send a chat completion request to the AI provider.
     *
     * @param array $messages Array of ['role' => 'user'|'assistant'|'system', 'content' => string]
     * @param array $options Model parameters such as temperature, max_tokens, response_format
     * @return array Standardized response ['content' => string, 'tokens' => ['input' => int, 'output' => int], 'model' => string]
     */
    public function chat(array $messages, array $options = []): array;

    /**
     * Generate structured JSON output for proposals.
     *
     * @param string $systemPrompt
     * @param string $userPrompt
     * @param array $schema JSON schema definition or response format
     * @return array Parsed JSON data
     */
    public function generateStructured(string $systemPrompt, string $userPrompt, array $schema = []): array;

    /**
     * Get provider identifier.
     *
     * @return string e.g. 'openai', 'gemini', 'claude'
     */
    public function getIdentifier(): string;
}
