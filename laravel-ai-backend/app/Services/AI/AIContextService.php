<?php

namespace App\Services\AI;

use Illuminate\Support\Facades\DB;
use Exception;

class AIContextService
{
    /**
     * Retrieve and sanitize client context ensuring user ownership.
     */
    public function getSanitizedClientContext(int $userId, int $clientId): ?array
    {
        $client = DB::table('clients')
            ->where('id', $clientId)
            ->where('user_id', $userId)
            ->first();

        if (!$client) {
            return null;
        }

        // Return only safe fields
        return [
            'id' => $client->id,
            'name' => $client->name ?? $client->company_name,
            'company_name' => $client->company_name ?? '',
            'industry' => $client->industry ?? 'Technology',
            'email' => $client->email ?? '',
        ];
    }

    /**
     * Retrieve and sanitize proposal reference ensuring user ownership.
     */
    public function getSanitizedProposalContext(int $userId, int $proposalId): ?array
    {
        $proposal = DB::table('proposals')
            ->where('id', $proposalId)
            ->where('user_id', $userId)
            ->first();

        if (!$proposal) {
            return null;
        }

        return [
            'id' => $proposal->id,
            'title' => $proposal->title,
            'proposal_type' => $proposal->proposal_type ?? 'direct',
            'status' => $proposal->status,
            'currency' => $proposal->currency ?? 'INR',
        ];
    }
}
