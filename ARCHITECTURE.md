# SocialPilot Architecture

## Where Everything Lives

### Database (MongoDB)

| Collection | What It Stores | Key Fields |
|------------|----------------|------------|
| **users** | User accounts | email, password_hash, full_name |
| **organizations** | Multi-tenant orgs | name, status |
| **posts** | Every post (draft, scheduled, published) | caption, media_url, status, scheduled_at |
| **post_platforms** | Per-platform status for each post | platform, status, platform_post_id, error_message |
| **social_accounts** | Connected IG/FB/LI accounts | platform, access_token_encrypted, status |
| **oauth_states** | Temporary OAuth flow tokens | state_token, platform, expires_at |
| **automation_jobs** | Jobs for the internal scheduler | type, status, scheduled_at, attempts |
| **content_topics** | Topics queued for AI generation | topic, status, postId |

### Post Status Values

```
draft → scheduled → processing → published
                           ↓
                        failed
                           ↓
                        partial (some platforms succeeded)
```

### Automation Job Types

```
TOPIC_PROCESSING → CONTENT_GENERATION → IMAGE_GENERATION → PUBLISH_POST
```

### Automation Job Status Values

```
QUEUED → PROCESSING → COMPLETED
  ↓          ↓
RETRYING   FAILED
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
  Creates: AutomationJob (type: PUBLISH_POST, status: QUEUED)
        │
        ▼
AutomationEngine picks up job on next 60s tick
  Reads Post + SocialAccount records
  Decrypts access tokens from MongoDB
  Calls platform APIs directly:
    - Instagram Graph API v19.0
    - Facebook Graph API v19.0
    - LinkedIn API v2
  Updates: PostPlatform status per platform
  Updates: Post status → "published" or "failed"
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
  Creates: AutomationJob (type: PUBLISH_POST, scheduled_at: future)
        │
        ▼
AutomationEngine polls every 60 seconds
  Finds jobs where scheduled_at <= now AND status IN (QUEUED, RETRYING)
  Processes them in order of scheduledAt
        │
        ▼
Same as Flow 1 from here
```

### Flow 3: AI-Generated Post

```
User enters topic, clicks "Generate with AI"
        │
        ▼
POST /api/ai/generate
  Creates: ContentTopic (status: PENDING)
  Creates: AutomationJob (type: TOPIC_PROCESSING)
        │
        ▼
AutomationEngine picks up job
  Reads ContentTopic + BrandProfile
  Calls OpenAI via lib/ai module:
    - generateContent() → caption + hashtags
    - generateImage() → media URL (optional)
  Creates: Post (status: draft) + PostPlatform records
  Updates: ContentTopic (status: COMPLETED, postId)
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
| `/api/posts/[id]/publish` | POST | Cookie | Queue publish job |
| `/api/posts/[id]/schedule` | POST | Cookie | Schedule publish job |
| `/api/social/accounts` | GET | Cookie | List connected accounts |
| `/api/social/accounts` | DELETE | Cookie | Disconnect account |
| `/api/social/instagram/connect` | GET | Cookie | Start IG OAuth |
| `/api/social/instagram/callback` | GET | Public | IG OAuth callback |
| `/api/social/facebook/connect` | GET | Cookie | Start FB OAuth |
| `/api/social/facebook/callback` | GET | Public | FB OAuth callback |
| `/api/social/linkedin/connect` | GET | Cookie | Start LI OAuth |
| `/api/social/linkedin/callback` | GET | Public | LI OAuth callback |
| `/api/ai/generate` | POST | Cookie | Trigger AI generation |

---

## Automation Engine

**Location:** `src/lib/automation/engine.ts`

The app runs an internal `AutomationEngine` singleton that acts as a background scheduler within the Next.js process. No external workflow tools are used.

### How It Works

1. **Singleton:** `AutomationEngine.getInstance()` returns the single instance
2. **Start:** Called at app startup, runs `setInterval` every 60 seconds
3. **Poll:** Each tick queries MongoDB for due `AutomationJob` records (status QUEUED/RETRYING, scheduledAt ≤ now)
4. **Process:** Handles jobs by type (see below)
5. **Retry:** Failed jobs retry with exponential backoff up to `maxAttempts`
6. **Stop:** `stop()` clears the interval and halts processing

### Job Processing by Type

| Job Type | What It Does | Key Dependencies |
|----------|--------------|------------------|
| **TOPIC_PROCESSING** | Reads a ContentTopic, calls OpenAI to generate caption + hashtags, creates a Post | `lib/ai/generateContent`, BrandProfile |
| **CONTENT_GENERATION** | Generates AI content for a specific Post (regenerate) | `lib/ai/generateContent`, BrandProfile |
| **IMAGE_GENERATION** | Generates an image for a Post via DALL-E 3 | `lib/ai/generateImage` |
| **PUBLISH_POST** | Decrypts tokens, calls platform APIs directly | `SocialAccount`, platform Graph APIs |

### Platform API Calls

| Platform | API Endpoint | Auth Method |
|----------|-------------|-------------|
| Instagram | `graph.facebook.com/v19.0/{ig_id}/media` + `media_publish` | access_token in body |
| Facebook | `graph.facebook.com/v19.0/{page_id}/feed` | access_token in body |
| LinkedIn | `api.linkedin.com/v2/ugcPosts` | Bearer token header |

All tokens are decrypted from MongoDB at publish time via `lib/security/encryption`.

### Kill Switches

| Switch | Function | Effect |
|--------|----------|--------|
| Global automation pause | `isGlobalAutomationPaused()` | Engine skips all job processing |
| Global publishing stop | `isGlobalPublishingStopped()` | PUBLISH_POST jobs fail immediately; other jobs still run |

---

## Environment Variables

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/socialpilot
JWT_SECRET=random_32plus_chars

META_CLIENT_ID=from_developers.facebook.com
META_CLIENT_SECRET=from_developers.facebook.com
LINKEDIN_CLIENT_ID=from_linkedin.com/developers
LINKEDIN_CLIENT_SECRET=from_linkedin.com/developers

OPENAI_API_KEY=sk-...
ENCRYPTION_KEY=random_32plus_chars
```

No external workflow URLs, callback secrets, or API keys for third-party automation tools are needed.

---

## Key Design Decisions

1. **Self-contained system:** All automation runs inside the Next.js process via the `AutomationEngine` singleton. No external tools, webhooks, or callbacks.

2. **Polling scheduler:** The engine polls MongoDB every 60 seconds for due jobs. This is simpler and more reliable than webhook-based scheduling — no waiting for external services to call back.

3. **Job queue in MongoDB:** `AutomationJob` collection acts as the job queue. Jobs have types, statuses, retry logic, and scheduled times. No separate message broker needed.

4. **AI generation:** The AI workflow is part of the engine pipeline. Topics flow through `TOPIC_PROCESSING` → `CONTENT_GENERATION` → `IMAGE_GENERATION` before becoming drafts. The user reviews before publishing.

5. **Token security:** Tokens are encrypted in MongoDB and decrypted only at publish time. No tokens are ever sent to external services or stored in logs.

6. **Direct API calls:** Platform publishing uses direct HTTP calls to Instagram/Facebook/LinkedIn Graph APIs. No intermediary services or callback endpoints.

7. **Error handling:** Failed jobs classify errors (AUTH_ERROR, RATE_LIMIT, AI_ERROR, etc.) and retry with exponential backoff. Auth errors fail immediately without retry.
