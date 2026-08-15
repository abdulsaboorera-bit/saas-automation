# SocialPilot Architecture

## Where Everything Lives

### Database (MongoDB)

| Collection | What It Stores | Key Fields |
|------------|----------------|------------|
| **users** | User accounts | email, password_hash, full_name |
| **posts** | Every post (draft, scheduled, published) | caption, media_url, status, scheduled_at |
| **post_platforms** | Per-platform status for each post | platform, status, platform_post_id, error_message |
| **social_accounts** | Connected IG/FB/LI accounts | platform, access_token_encrypted, status |
| **oauth_states** | Temporary OAuth flow tokens | state_token, platform, expires_at |

### Post Status Values

```
draft → scheduled → processing → published
                           ↓
                        failed
                           ↓
                        partial (some platforms succeeded)
```

---

## Complete Data Flow

### Flow 1: Manual Post (Publish Now)

```
User clicks "Publish Now" in dashboard
        │
        ▼
POST /api/posts
  Creates: Post (status: draft) + PostPlatform records
  Returns: { post: { id: "abc123" } }
        │
        ▼
POST /api/posts/abc123/publish
  Updates: Post status → "processing"
  Calls: sendJobToN8n()
  Sends to n8n: { job_id, post_id, caption, media_url, platforms[] }
        │
        ▼
n8n Webhook receives payload
  For each platform:
    GET /api/n8n/token?social_account_id=xxx&post_id=abc123
      Returns: { access_token, platform, platform_account_id }
    Publish to platform API (Instagram/Facebook/LinkedIn)
    POST /api/n8n
      Body: { post_id, platform, status, platform_post_id }
      Header: x-n8n-signature (HMAC-SHA256)
        │
        ▼
POST /api/n8n (callback)
  Updates: PostPlatform status → "published" or "failed"
  Recalculates: Post status based on all platforms
```

### Flow 2: Scheduled Post

```
User selects date/time and clicks "Schedule"
        │
        ▼
POST /api/posts
  Creates: Post (status: draft)
        │
        ▼
POST /api/posts/abc123/schedule
  Updates: Post status → "scheduled", scheduled_at = future date
  Calls: sendJobToN8n() WITH scheduled_at included in payload
  n8n receives: { ..., scheduled_at: "2024-01-15T14:00:00Z" }
        │
        ▼
n8n WAIT node holds the job until scheduled_at time
        │
        ▼
(At scheduled time) n8n proceeds to publish
  Same as Flow 1 from here
```

### Flow 3: AI-Generated Post

```
User enters topic, clicks "Generate with AI"
        │
        ▼
POST /api/ai/generate
  Sends to n8n: { user_id, topic, platforms, tone }
        │
        ▼
n8n AI Workflow
  Generates caption with OpenAI
  POST /api/ai/callback
    Body: { user_id, caption, platforms }
    Creates: Post (status: draft) + PostPlatform records
        │
        ▼
User sees draft in Dashboard → Posts
  Can edit, then Publish or Schedule (Flow 1 or 2)
```

---

## API Endpoints

| Endpoint | Method | Auth | Purpose |
|----------|--------|------|---------|
| `/api/auth/register` | POST | Public | Create account |
| `/api/auth/login` | POST | Public | Login |
| `/api/auth/me` | GET | Cookie | Get current user |
| `/api/posts` | GET | Cookie | List posts |
| `/api/posts` | POST | Cookie | Create post |
| `/api/posts/[id]/publish` | POST | Cookie | Trigger publish to n8n |
| `/api/posts/[id]/schedule` | POST | Cookie | Schedule post via n8n |
| `/api/social/accounts` | GET | Cookie | List connected accounts |
| `/api/social/accounts` | DELETE | Cookie | Disconnect account |
| `/api/social/instagram/connect` | GET | Cookie | Start IG OAuth |
| `/api/social/instagram/callback` | GET | Public | IG OAuth callback |
| `/api/social/facebook/connect` | GET | Cookie | Start FB OAuth |
| `/api/social/facebook/callback` | GET | Public | FB OAuth callback |
| `/api/social/linkedin/connect` | GET | Cookie | Start LI OAuth |
| `/api/social/linkedin/callback` | GET | Public | LI OAuth callback |
| `/api/ai/generate` | POST | Cookie | Trigger AI generation |
| `/api/ai/callback` | POST | HMAC | AI callback to save draft |
| `/api/n8n` | POST | HMAC | n8n publish callback |
| `/api/n8n/token` | GET | API Key | n8n fetches access tokens |

---

## n8n Workflow A: AI Content Generator

**Trigger:** POST `/webhook/ai-generate` (from app) or Schedule (cron)

**Flow:**
1. Receive topic + tone + platforms
2. Build prompt for OpenAI
3. Generate caption with GPT-4o
4. Parse response
5. POST to `/api/ai/callback` with HMAC signature
6. Content saved as draft in MongoDB

**n8n Environment Variables:**
```
APP_URL = http://localhost:3000
N8N_CALLBACK_SECRET = (same as app)
OPENAI_API_KEY = sk-...
```

---

## n8n Workflow B: Publisher

**Trigger:** POST `/webhook/social-publish` (from app)

**Flow:**
1. Receive payload: { job_id, user_id, post_id, caption, media_url, scheduled_at, platforms[] }
2. If scheduled_at is set → Wait node holds until that time
3. Split platforms array
4. For each platform:
   a. GET `/api/n8n/token?social_account_id=xxx&post_id=xxx` (with API key)
   b. Publish to platform API
   c. POST to `/api/n8n` with HMAC signature (per platform)
5. Callback updates PostPlatform status
6. App recalculates Post status

**n8n Environment Variables:**
```
APP_URL = http://localhost:3000
N8N_CALLBACK_SECRET = (same as app)
N8N_API_KEY = (same as app)
```

---

## Environment Variables

### Next.js App (.env)

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/socialpilot
JWT_SECRET=random_32plus_chars

META_CLIENT_ID=from_developers.facebook.com
META_CLIENT_SECRET=from_developers.facebook.com
LINKEDIN_CLIENT_ID=from_linkedin.com/developers
LINKEDIN_CLIENT_SECRET=from_linkedin.com/developers

N8N_WEBHOOK_URL=http://localhost:5678/webhook/social-publish
N8N_AI_WEBHOOK_URL=http://localhost:5678/webhook/ai-generate
N8N_CALLBACK_SECRET=any_random_string
N8N_API_KEY=any_random_string

OPENAI_API_KEY=sk-...
ENCRYPTION_KEY=random_32plus_chars
```

### n8n (Environment Variables)

```
APP_URL = http://localhost:3000
N8N_CALLBACK_SECRET = (same as app)
N8N_API_KEY = (same as app)
N8N_WEBHOOK_URL = http://localhost:5678/webhook/social-publish
OPENAI_API_KEY = sk-... (only for AI workflow)
```

---

## Key Design Decisions

1. **Data storage:** All post data and schedules live in MongoDB. n8n is stateless — it receives a job, processes it, and calls back.

2. **Scheduling:** The app sends the post to n8n immediately with `scheduled_at`. n8n's Wait node holds the job until that time. This is simpler than having the app poll for due posts.

3. **AI generation:** The AI workflow is separate from the publisher. It generates content and saves it as a draft. The user reviews and manually triggers publish. This gives control over what gets posted.

4. **Token security:** Tokens are encrypted in MongoDB. n8n fetches them on-demand via `/api/n8n/token` instead of receiving them in the webhook payload.

5. **Callback validation:** All n8n callbacks use HMAC-SHA256 signatures to prevent unauthorized requests.
