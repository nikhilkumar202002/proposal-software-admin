<?php

namespace App\Services\AI;

use Illuminate\Support\Facades\DB;

class AIUsageService
{
    /**
     * Log token usage and estimated cost into database.
     */
    public function logUsage(int $userId, array $params): void
    {
        $inputTokens = $params['input_tokens'] ?? 0;
        $outputTokens = $params['output_tokens'] ?? 0;
        $provider = $params['provider'] ?? 'openai';
        $model = $params['model'] ?? 'gpt-4o';
        $operation = $params['operation'] ?? 'chat';

        // Calculate estimated cost in USD
        $ratePerMillionInput = 2.50;
        $ratePerMillionOutput = 10.00;

        $cost = (($inputTokens / 1000000) * $ratePerMillionInput) + (($outputTokens / 1000000) * $ratePerMillionOutput);

        DB::table('ai_usage_logs')->insert([
            'user_id' => $userId,
            'provider' => $provider,
            'model' => $model,
            'operation' => $operation,
            'input_tokens' => $inputTokens,
            'output_tokens' => $outputTokens,
            'total_tokens' => $inputTokens + $outputTokens,
            'cost_usd' => $cost,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Get aggregated usage metrics for user.
     */
    public function getUsageSummary(int $userId): array
    {
        $stats = DB::table('ai_usage_logs')
            ->where('user_id', $userId)
            ->selectRaw('SUM(input_tokens) as total_input, SUM(output_tokens) as total_output, SUM(cost_usd) as total_cost, COUNT(*) as request_count')
            ->first();

        return [
            'total_tokens' => ($stats->total_input ?? 0) + ($stats->total_output ?? 0),
            'input_tokens' => $stats->total_input ?? 0,
            'output_tokens' => $stats->total_output ?? 0,
            'estimated_cost_usd' => round($stats->total_cost ?? 0, 4),
            'request_count' => $stats->request_count ?? 0,
            'monthly_quota' => 500000,
        ];
    }
}
