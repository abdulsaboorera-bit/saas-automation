# SocialPilot - Social Media Automation SaaS

A production-ready multi-user SaaS web application for managing social media accounts, creating posts, scheduling content, and publishing through a fully self-contained built-in automation engine.

## Tech Stack

- **Frontend:** Next.js 16, TypeScript, React, Tailwind CSS
- **Backend:** Next.js API Routes (Node.js)
- **Database:** MongoDB with Mongoose
- **Auth:** JWT (jsonwebtoken + bcryptjs)
- **Automation:** Built-in background worker (AutomationEngine)
- **AI Content Generation:** OpenAI API

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

# OpenAI (for AI content generation)
OPENAI_API_KEY=sk-your-openai-api-key

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

### Required (For AI content generation)

| Item | How to get it |
|------|--------------|
| **OPENAI_API_KEY** | [platform.openai.com](https://platform.openai.com) > API Keys > Create new secret key |

---

## OAuth Redirect URIs

Add these to your Meta and LinkedIn app settings:

**Meta (Facebook/Instagram):**
- `http://localhost:3000/api/social/instagram/callback`
- `http://localhost:3000/api/social/facebook/callback`

**LinkedIn:**
- `http://localhost:3000/api/social/linkedin/callback`

---

## How Automation Works

The application includes a built-in `AutomationEngine` that runs as a background worker inside the Next.js process. There are no external webhook services or third-party automation platforms required.

### Scheduling Flow

1. User creates a post and schedules it for a future time
2. The post is saved to the database with a `scheduled_at` timestamp
3. The `AutomationEngine` polls for due posts on a configurable interval
4. When a post is due, the engine publishes directly to each target platform's API:
   - **Instagram/Facebook** via the Meta Graph API
   - **LinkedIn** via the LinkedIn Marketing API
5. Results (success/failure) are written back to the database in real time

### AI Content Generation

When a user requests AI-generated content, the app calls the OpenAI API directly from the server — no intermediary services involved.

---

## Project Structure

```
src/
  app/
    (auth)/login, register, forgot-password
    dashboard/page, accounts, create, posts, calendar, settings
    api/auth/, social/, posts/, upload/
  models/User.ts, SocialAccount.ts, Post.ts, PostPlatform.ts, OAuthState.ts
  lib/
    auth/session.ts              # JWT auth
    db/mongodb.ts                # MongoDB connection
    oauth/index.ts               # OAuth flows + social account management
    automation/engine.ts         # Built-in background scheduling engine
    ai/generate.ts               # OpenAI content generation
    social/instagram.ts          # Instagram Graph API publishing
    social/facebook.ts           # Facebook Graph API publishing
    social/linkedin.ts           # LinkedIn API publishing
    security/encryption.ts       # Token encryption
  components/ui/                 # Reusable UI components
  types/index.ts
```

---

## Deployment

### Vercel
1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

> **Note:** The `AutomationEngine` runs inside the Next.js serverless functions. For persistent background scheduling on Vercel, consider using Vercel Cron Jobs or deploying the worker as a separate long-running process.

### Self-Hosted
You can deploy anywhere that runs Node.js. The automation engine runs as part of the application process — no separate worker deployment needed.

### MongoDB
Use MongoDB Atlas (free tier) - no database hosting needed on your end.
