<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Services\AI\AIChatService;
use App\Services\AI\AIProposalService;
use App\Services\AI\AIUsageService;
use Illuminate\Support\Facades\DB;

class AIController extends Controller
{
    protected AIChatService $chatService;
    protected AIProposalService $proposalService;
    protected AIUsageService $usageService;

    public function __construct(
        AIChatService $chatService,
        AIProposalService $proposalService,
        AIUsageService $usageService
    ) {
        $this->chatService = $chatService;
        $this->proposalService = $proposalService;
        $this->usageService = $usageService;
    }

    /**
     * POST /api/ai/chat
     */
    public function chat(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'message' => 'required|string|max:10000',
            'conversation_id' => 'nullable|integer',
            'model' => 'nullable|string',
            'provider' => 'nullable|string',
            'context' => 'nullable|array',
        ]);

        $userId = $request->user()?->id ?? 1;
        $result = $this->chatService->sendMessage($userId, $validated);

        return response()->json($result);
    }

    /**
     * GET /api/ai/conversations
     */
    public function getConversations(Request $request): JsonResponse
    {
        $userId = $request->user()?->id ?? 1;

        $conversations = DB::table('ai_conversations')
            ->where('user_id', $userId)
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json($conversations);
    }

    /**
     * POST /api/ai/conversations
     */
    public function createConversation(Request $request): JsonResponse
    {
        $userId = $request->user()?->id ?? 1;

        $id = DB::table('ai_conversations')->insertGetId([
            'user_id' => $userId,
            'title' => $request->input('title', 'New Proposal Chat'),
            'model' => $request->input('model', 'gpt-4o'),
            'provider' => $request->input('provider', 'openai'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $conv = DB::table('ai_conversations')->where('id', $id)->first();
        return response()->json($conv, 201);
    }

    /**
     * GET /api/ai/conversations/{id}
     */
    public function getConversation(Request $request, int $id): JsonResponse
    {
        $userId = $request->user()?->id ?? 1;

        $conv = DB::table('ai_conversations')
            ->where('id', $id)
            ->where('user_id', $userId)
            ->first();

        if (!$conv) {
            return response()->json(['error' => 'Conversation not found'], 404);
        }

        $messages = DB::table('ai_messages')
            ->where('conversation_id', $id)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json([
            'conversation' => $conv,
            'messages' => $messages,
        ]);
    }

    /**
     * PATCH /api/ai/conversations/{id}
     */
    public function updateConversation(Request $request, int $id): JsonResponse
    {
        $userId = $request->user()?->id ?? 1;

        $updated = DB::table('ai_conversations')
            ->where('id', $id)
            ->where('user_id', $userId)
            ->update([
                'title' => $request->input('title'),
                'updated_at' => now(),
            ]);

        return response()->json(['success' => (bool)$updated]);
    }

    /**
     * DELETE /api/ai/conversations/{id}
     */
    public function deleteConversation(Request $request, int $id): JsonResponse
    {
        $userId = $request->user()?->id ?? 1;

        DB::table('ai_messages')->where('conversation_id', $id)->delete();
        DB::table('ai_conversations')
            ->where('id', $id)
            ->where('user_id', $userId)
            ->delete();

        return response()->json(['success' => true]);
    }

    /**
     * POST /api/ai/generate-proposal
     */
    public function generateProposal(Request $request): JsonResponse
    {
        $userId = $request->user()?->id ?? 1;
        $result = $this->proposalService->generateProposal($userId, $request->all());

        return response()->json($result);
    }

    /**
     * POST /api/ai/improve-content
     */
    public function improveContent(Request $request): JsonResponse
    {
        $userId = $request->user()?->id ?? 1;
        $content = $request->input('content', '');
        $mode = $request->input('mode', 'professional');

        $result = $this->proposalService->improveContent($userId, $content, $mode);
        return response()->json($result);
    }

    /**
     * POST /api/ai/analyse-proposal
     */
    public function analyseProposal(Request $request): JsonResponse
    {
        $userId = $request->user()?->id ?? 1;
        $result = $this->proposalService->analyseProposal($userId, $request->all());

        return response()->json($result);
    }

    /**
     * GET /api/ai/usage
     */
    public function getUsage(Request $request): JsonResponse
    {
        $userId = $request->user()?->id ?? 1;
        $summary = $this->usageService->getUsageSummary($userId);

        return response()->json($summary);
    }
}
