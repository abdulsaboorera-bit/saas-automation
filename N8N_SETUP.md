# n8n Integration Setup Guide

## Complete Step-by-Step Connection Guide

---

## STEP 1: Environment Variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

Then fill in ALL values:

```env
# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# MongoDB (local or Atlas)
MONGODB_URI=mongodb://localhost:27017/socialpilot

# JWT (generate a random 32+ char string)
JWT_SECRET=your_random_32plus_char_secret_here

# Meta (Instagram + Facebook) - Get from developers.facebook.com
META_CLIENT_ID=your_meta_app_id
META_CLIENT_SECRET=your_meta_app_secret

# LinkedIn - Get from linkedin.com/developers
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

# n8n Integration
N8N_WEBHOOK_URL=http://localhost:5678/webhook/social-publish
N8N_CALLBACK_SECRET=any_random_string_here_make_it_long
N8N_API_KEY=any_random_api_key_here

# Encryption key (generate a random 32+ char string)
ENCRYPTION_KEY=your_32_char_encryption_key_here

# Storage
NEXT_PUBLIC_STORAGE_URL=http://localhost:3000
```

---

## STEP 2: Get OAuth Credentials

### Meta (Instagram + Facebook)
1. Go to https://developers.facebook.com
2. Create a new App → Select "Business" type
3. Add "Facebook Login" product
4. In Settings → Basic, copy App ID and App Secret
5. In Facebook Login → Settings, add Valid OAuth Redirect URIs:
   - `http://localhost:3000/api/social/instagram/callback`
   - `http://localhost:3000/api/social/facebook/callback`
6. Go to App Review → Add permissions:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_show_list`
   - `pages_read_engagement`
   - `pages_manage_posts`

### LinkedIn
1. Go to https://www.linkedin.com/developers/
2. Create a new App
3. In Auth tab, copy Client ID and Client Secret
4. Add Authorized Redirect URL: `http://localhost:3000/api/social/linkedin/callback`
5. In Products tab, request access to:
   - `Share on LinkedIn`
   - `Sign In with LinkedIn using OpenID Connect`

---

## STEP 3: Configure n8n

### 3a. Set n8n Environment Variables

In n8n, go to Settings → Environment Variables and add:

```
APP_URL = http://localhost:3000
N8N_CALLBACK_SECRET = any_random_string_here_make_it_long
N8N_API_KEY = any_random_api_key_here
```

**IMPORTANT**: The `N8N_CALLBACK_SECRET` and `N8N_API_KEY` must match your Next.js `.env` file exactly.

### 3b. Activate the Workflow

1. Open your workflow in n8n
2. Click "Execute workflow" to test
3. Click the toggle to "Active" the workflow
4. Copy the webhook URL (usually `http://localhost:5678/webhook/social-publish`)

### 3c. Set the Webhook URL

Update your Next.js `.env`:
```
N8N_WEBHOOK_URL=http://localhost:5678/webhook/social-publish
```

---

## STEP 4: Configure n8n Nodes

### Webhook Node
- Method: POST
- Path: `social-publish`
- Response Mode: `Last Node` (important - returns 200 immediately)

### Token Fetch Node (HTTP Request)
- Method: GET
- URL: `={{$env.APP_URL}}/api/n8n/token?social_account_id={{$json.social_account_id}}&post_id={{$json.post_id}}`
- Headers:
  - `x-n8n-api-key`: `={{$env.N8N_API_KEY}}`

### Callback Nodes (HTTP Request)
For each platform's success/failure callback:
- Method: POST
- URL: `={{$env.APP_URL}}/api/n8n`
- Headers:
  - `Content-Type`: `application/json`
  - `x-n8n-signature`: (use a Code node to compute HMAC)

### HMAC Signature Code Node
```javascript
const crypto = require('crypto');
const secret = $env.N8N_CALLBACK_SECRET;

const body = JSON.stringify({
  job_id: $json.job_id,
  post_id: $json.post_id,
  platform: $json.platform,
  status: $json.status,
  platform_post_id: $json.platform_post_id || undefined,
  error: $json.error || undefined
});

const signature = crypto
  .createHmac('sha256', secret)
  .update(body)
  .digest('hex');

return [{
  json: {
    body: body,
    signature: signature
  }
}];
```

Then in the HTTP Request node:
- Set body to raw JSON: `={{$json.body}}`
- Set header `x-n8n-signature` to: `={{$json.signature}}`

---

## STEP 5: Start Everything

### Terminal 1 - Start MongoDB
```bash
mongod
```
Or use MongoDB Atlas cloud database.

### Terminal 2 - Start Next.js
```bash
cd socialmediaautomation
npm run dev
```

### Terminal 3 - Start n8n
```bash
n8n start
```

---

## STEP 6: Test the Full Flow

### 6a. Create a Test User
1. Go to `http://localhost:3000/register`
2. Create an account

### 6b. Connect a Social Account
1. Go to Dashboard → Accounts
2. Click "Connect Instagram" (or Facebook/LinkedIn)
3. Complete the OAuth flow
4. Account should appear as "Connected"

### 6c. Create a Post
1. Go to Dashboard → Create Post
2. Write a caption
3. Optionally add an image URL
4. Select the connected account
5. Click "Publish Now"

### 6d. Watch n8n Process
1. Go to n8n execution log
2. You should see the webhook received
3. Watch it process through each node
4. Check if callbacks are sent

### 6e. Verify in App
1. Go to Dashboard → Posts
2. The post should show "Published" status
3. Check the platform_post_id is populated

---

## STEP 7: Troubleshooting

### Issue: Webhook not receiving
- Check n8n workflow is "Active"
- Check `N8N_WEBHOOK_URL` matches the n8n webhook path
- Check n8n is running on the expected port

### Issue: Token fetch fails
- Check `N8N_API_KEY` matches in both .env files
- Check the token endpoint is accessible: `curl http://localhost:3000/api/n8n/token?social_account_id=xxx&post_id=xxx -H "x-n8n-api-key: your_key"`
- Check MongoDB has the SocialAccount document

### Issue: Publishing fails on platform
- Instagram: Token may lack `instagram_content_publish` scope
- Facebook: Must use Page Access Token, not User Token
- LinkedIn: Token may lack `w_member_social` scope

### Issue: Callback not updating status
- Check `N8N_CALLBACK_SECRET` matches in both .env files
- Check the HMAC signature is computed correctly
- Check the callback URL is correct: `http://localhost:3000/api/n8n`

### Issue: Posts stuck in "processing"
- n8n is not calling back
- Check n8n execution log for errors
- Check the callback HTTP Request node configuration

---

## API Endpoints Reference

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/auth/register` | POST | Create user | Public |
| `/api/auth/login` | POST | Login user | Public |
| `/api/auth/me` | GET | Get current user | Cookie |
| `/api/posts` | GET/POST | List/Create posts | Cookie |
| `/api/posts/[id]/publish` | POST | Trigger publish | Cookie |
| `/api/social/accounts` | GET/DELETE | List/Disconnect accounts | Cookie |
| `/api/social/instagram/connect` | GET | Start IG OAuth | Cookie |
| `/api/social/instagram/callback` | GET | IG OAuth callback | Public |
| `/api/social/facebook/connect` | GET | Start FB OAuth | Cookie |
| `/api/social/facebook/callback` | GET | FB OAuth callback | Public |
| `/api/social/linkedin/connect` | GET | Start LI OAuth | Cookie |
| `/api/social/linkedin/callback` | GET | LI OAuth callback | Public |
| `/api/n8n` | POST | n8n callback | HMAC signature |
| `/api/n8n/token` | GET | Fetch token for n8n | API key |

---

## Data Flow Diagram

```
User clicks "Publish"
        │
        ▼
Next.js POST /api/posts/[id]/publish
        │
        ├── Updates Post status → "processing"
        │
        ▼
Next.js POST {N8N_WEBHOOK_URL}
        │
        ▼
n8n Webhook receives payload
        │
        ├── Split platforms array
        │
        ├── FOR EACH platform:
        │       │
        │       ├── GET /api/n8n/token?social_account_id=xxx
        │       │       └── Returns decrypted access_token
        │       │
        │       ├── Publish to Platform API
        │       │       ├── Instagram: Graph API v19.0
        │       │       ├── Facebook: Graph API v19.0
        │       │       └── LinkedIn: Marketing API
        │       │
        │       └── POST /api/n8n (callback)
        │               ├── x-n8n-signature header
        │               └── { post_id, platform, status, platform_post_id }
        │
        ▼
Next.js POST /api/n8n
        │
        ├── Validates HMAC signature
        ├── Updates PostPlatform status
        ├── Recalculates Post status
        │       ├── All published → "published"
        │       ├── All failed → "failed"
        │       └── Mixed → "partial"
        │
        ▼
Dashboard shows updated status
```

---

## Production Deployment

### 1. Deploy Next.js
- Deploy to Vercel, Railway, or your own server
- Set all environment variables in the hosting platform

### 2. Deploy n8n
- Use n8n.cloud (easiest)
- Or deploy to your own server with Docker:
  ```bash
  docker run -d --name n8n -p 5678:5678 \
    -e N8N_BASIC_AUTH_ACTIVE=true \
    -e N8N_BASIC_AUTH_USER=admin \
    -e N8N_BASIC_AUTH_PASSWORD=your_password \
    -v n8n_data:/home/node/.n8n \
    n8nio/n8n
  ```

### 3. Update URLs
- Set `NEXT_PUBLIC_APP_URL` to your production domain
- Set `N8N_WEBHOOK_URL` to your n8n production webhook URL
- Update OAuth redirect URIs in Meta and LinkedIn developer consoles

### 4. Enable HTTPS
- Both app and n8n must use HTTPS in production
- OAuth providers require HTTPS redirect URIs
