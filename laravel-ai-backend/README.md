# ProposalOS AI Backend Architecture (Laravel)

This directory provides the complete Laravel architecture for ProposalOS AI module integration.

## Architecture Highlights
- **Provider-Agnostic Engine**: Supports OpenAI (`gpt-4o`, `o3-mini`), Google Gemini (`gemini-2.0-flash`), and Anthropic Claude (`claude-3-7-sonnet`).
- **Zero-Trust Key Management**: All API keys are loaded via Laravel environment variables (`.env`). No API keys are ever passed to the frontend.
- **Ownership & Authorization**: All conversations, messages, and proposal generation tasks are scoped to the authenticated user ID (`$request->user()->id`).
- **Telemetry & Guardrails**: Automatic token accounting and cost tracking in `ai_usage_logs`.

## Setup Instructions

### 1. Copy Files to Your Laravel Application
- Copy `app/Services/AI/` into your Laravel `app/Services/AI/`.
- Copy `app/Http/Controllers/AIController.php` into `app/Http/Controllers/`.
- Add the routes in `routes/api.php` into your Laravel `routes/api.php`.
- Copy the migration files in `database/migrations/` into your Laravel `database/migrations/`.

### 2. Configure `.env`
Add your AI keys to your Laravel `.env`:

```env
# ProposalOS AI Provider Configuration
OPENAI_API_KEY=sk-...
OPENAI_DEFAULT_MODEL=gpt-4o

GEMINI_API_KEY=AIzaSy...
GEMINI_DEFAULT_MODEL=gemini-2.0-flash

ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_DEFAULT_MODEL=claude-3-7-sonnet-20250219
```

### 3. Run Migrations
```bash
php artisan migrate
```

## API Endpoints Prepared
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/chat` | Send message and receive AI response |
| `GET` | `/api/ai/conversations` | List user conversation threads |
| `POST` | `/api/ai/conversations` | Create a new conversation |
| `GET` | `/api/ai/conversations/{id}` | Get messages for a thread |
| `PATCH` | `/api/ai/conversations/{id}` | Rename thread |
| `DELETE` | `/api/ai/conversations/{id}` | Delete thread and messages |
| `POST` | `/api/ai/generate-proposal` | Generate structured proposal JSON |
| `POST` | `/api/ai/improve-content` | Refine proposal text / translate |
| `POST` | `/api/ai/analyse-proposal` | Win probability audit |
| `GET` | `/api/ai/usage` | Aggregated user token telemetry |
