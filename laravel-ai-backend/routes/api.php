<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AIController;

/*
|--------------------------------------------------------------------------
| ProposalOS AI API Routes
|--------------------------------------------------------------------------
|
| Authenticated endpoints for ProposalOS AI Chat, Proposal Generation,
| and Telemetry Services.
|
*/

Route::prefix('ai')->middleware(['auth:sanctum'])->group(function () {
    // Chat & Conversations
    Route::post('/chat', [AIController::class, 'chat']);
    Route::get('/conversations', [AIController::class, 'getConversations']);
    Route::post('/conversations', [AIController::class, 'createConversation']);
    Route::get('/conversations/{id}', [AIController::class, 'getConversation']);
    Route::patch('/conversations/{id}', [AIController::class, 'updateConversation']);
    Route::delete('/conversations/{id}', [AIController::class, 'deleteConversation']);

    // Proposal Actions
    Route::post('/generate-proposal', [AIController::class, 'generateProposal']);
    Route::post('/improve-content', [AIController::class, 'improveContent']);
    Route::post('/analyse-proposal', [AIController::class, 'analyseProposal']);

    // Usage & Quotas
    Route::get('/usage', [AIController::class, 'getUsage']);
});
