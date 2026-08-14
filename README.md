# SocialPilot - Social Media Automation SaaS

A production-ready multi-user SaaS web application for managing social media accounts, creating posts, scheduling content, and publishing through an existing n8n automation system.

## Tech Stack

- **Frontend:** Next.js 16, TypeScript, React, Tailwind CSS
- **Backend:** Next.js API Routes (Node.js)
- **Database:** MongoDB with Mongoose
- **Auth:** JWT (jsonwebtoken + bcryptjs)
- **Automation:** n8n webhooks

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up MongoDB

You need a MongoDB instance. Options:

- **Local:** Install MongoDB Community Edition
- **Cloud (free):** [MongoDB Atlas](https://www.mongodb.com/atlas) - create a free account and cluster

### 3. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

```env
# MongoDB (from MongoDB Atlas or local)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/socialpilot

# JWT Secret (any random string, 32+ chars)
JWT_SECRET=my_random_secret_key_1234567890123456

# Your App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Meta (Facebook/Instagram) - from developers.facebook.com
META_CLIENT_ID=your_meta_app_id
META_CLIENT_SECRET=your_meta_app_secret

# LinkedIn - from linkedin.com/developers
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# n8n Webhook URL (from your n8n workflow)
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
N8N_CALLBACK_SECRET=any_random_secret_string

# Encryption key (32+ random characters)
ENCRYPTION_KEY=your_32_character_encryption_key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## What You Need To Provide

### Required (Minimum to run)

| Item | How to get it |
|------|--------------|
| **MongoDB URI** | MongoDB Atlas (free) or local MongoDB |
| **JWT_SECRET** | Any random string 32+ characters |
| **ENCRYPTION_KEY** | Any random string 32+ characters |

### Required (For social media connections)

| Item | How to get it |
|------|--------------|
| **META_CLIENT_ID** | [developers.facebook.com](https://developers.facebook.com) > Create Business App > Settings > Basic > App ID |
| **META_CLIENT_SECRET** | Same location > App Secret |
| **LINKEDIN_CLIENT_ID** | [linkedin.com/developers](https://www.linkedin.com/developers/) > Create App > Auth > Client ID |
| **LINKEDIN_CLIENT_SECRET** | Same location > Client Secret |

### Required (For n8n integration)

| Item | Description |
|------|------------|
| **N8N_WEBHOOK_URL** | The webhook URL from your existing n8n workflow |
| **N8N_CALLBACK_SECRET** | Any random string you choose |

---

## OAuth Redirect URIs

Add these to your Meta and LinkedIn app settings:

**Meta (Facebook/Instagram):**
- `http://localhost:3000/api/social/instagram/callback`
- `http://localhost:3000/api/social/facebook/callback`

**LinkedIn:**
- `http://localhost:3000/api/social/linkedin/callback`

---

## n8n Integration

### Payload sent to your n8n webhook

```json
{
  "job_id": "uuid",
  "user_id": "user-id",
  "post_id": "post-id",
  "caption": "Your caption",
  "media_url": "https://.../image.jpg",
  "scheduled_at": "2026-08-15T15:00:00Z",
  "platforms": [
    {
      "platform": "instagram",
      "social_account_id": "ig-user-id",
      "account_name": "My Instagram",
      "username": "myusername"
    }
  ]
}
```

### Callback format (n8n sends back to /api/n8n/callback)

```json
{
  "job_id": "uuid-from-payload",
  "post_id": "post-id",
  "platform": "instagram",
  "status": "published",
  "platform_post_id": "optional-id",
  "error": null
}
```

Set header `X-N8N-SIGNATURE` = HMAC-SHA256(body, N8N_CALLBACK_SECRET).

---

## Excel / Google Sheets Integration

Your n8n workflow already has a Google Sheets trigger. Two options:

1. **SaaS sends jobs to n8n → n8n writes to Google Sheets** (your existing flow)
2. **SaaS writes topics to Google Sheets directly** (I can add this)

Tell me your preferred approach and your Google Sheet column structure.

---

## Project Structure

```
src/
  app/
    (auth)/login, register, forgot-password
    dashboard/page, accounts, create, posts, calendar, settings
    api/auth/, social/, posts/, n8n/, upload/
  models/User.ts, SocialAccount.ts, Post.ts, PostPlatform.ts, OAuthState.ts
  lib/
    auth/session.ts          # JWT auth
    db/mongodb.ts            # MongoDB connection
    oauth/index.ts           # OAuth flows + social account management
    n8n/index.ts             # n8n webhook integration
    security/encryption.ts   # Token encryption
  components/ui/             # Reusable UI components
  types/index.ts
```

---

## Deployment

### Vercel
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### MongoDB
Use MongoDB Atlas (free tier) - no database hosting needed on your end.
