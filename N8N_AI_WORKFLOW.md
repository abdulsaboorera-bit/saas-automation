# n8n AI Content Generation Workflow

## Overview

This is **Workflow A: AI Content Generator**. It generates social media content using AI and feeds results into your existing **Workflow B: Publisher**.

```
┌──────────────────────────────────────────┐
│         WORKFLOW A: AI GENERATOR         │
│                                          │
│  ┌──────────┐    ┌──────────┐           │
│  │ Schedule  │    │ Webhook  │           │
│  │ (cron)    │    │ (manual) │           │
│  └────┬─────┘    └────┬─────┘           │
│       └───────┬───────┘                  │
│               ▼                          │
│     ┌─────────────────┐                  │
│     │  Merge Trigger  │                  │
│     └────────┬────────┘                  │
│              ▼                           │
│     ┌─────────────────┐                  │
│     │  Fetch Topics   │                  │
│     │  (RSS/Keywords) │                  │
│     └────────┬────────┘                  │
│              ▼                           │
│     ┌─────────────────┐                  │
│     │  Generate with  │                  │
│     │  OpenAI/Claude  │                  │
│     └────────┬────────┘                  │
│              ▼                           │
│     ┌─────────────────┐                  │
│     │  Format Output  │                  │
│     └────────┬────────┘                  │
│              ▼                           │
│     ┌─────────────────┐                  │
│     │  Save as Draft  │                  │
│     │  via App API    │                  │
│     └────────┬────────┘                  │
│              ▼                           │
│     ┌─────────────────┐                  │
│     │  Optional: Auto │──► Workflow B    │
│     │  Publish        │   (Publisher)    │
│     └─────────────────┘                  │
└──────────────────────────────────────────┘
```

---

## WORKFLOW NODES

### NODE 1: Schedule Trigger (for auto-generation)

**Node Type:** Schedule Trigger
**Settings:**
- Rule: Cron expression
- Cron: `0 9 * * *` (every day at 9:00 AM)
- Or: `0 9 * * 1-5` (weekdays only at 9:00 AM)

This triggers automatic content generation on a schedule.

---

### NODE 2: Webhook Trigger (for manual generation)

**Node Type:** Webhook
**Settings:**
- Method: POST
- Path: `/ai-generate`
- Response Mode: Last Node
- Authentication: Header Auth (optional)

**Incoming payload from the app:**
```json
{
  "user_id": "mongo ObjectId",
  "topic": "10 tips for social media growth in 2024",
  "platforms": ["instagram", "facebook", "linkedin"],
  "tone": "professional",
  "keywords": ["social media", "growth", "marketing"],
  "triggered_by": "manual",
  "timestamp": "2024-01-15T09:00:00.000Z"
}
```

---

### NODE 3: Merge Triggers

**Node Type:** Merge
**Settings:**
- Mode: Choose Branch (or Combine)
- Both triggers feed into the same pipeline

This unifies the schedule and webhook triggers into one flow.

---

### NODE 4: Code - Set Default Values

**Node Type:** Code
**Code:**
```javascript
// Normalize input from either trigger
const input = $json.body || $json;

return [{
  json: {
    user_id: input.user_id || 'system',
    topic: input.topic || 'social media tips and trends',
    platforms: input.platforms || ['instagram', 'facebook', 'linkedin'],
    tone: input.tone || 'professional',
    keywords: input.keywords || [],
    auto_publish: input.auto_publish || false,
    triggered_by: input.triggered_by || 'schedule',
    // For schedule trigger, generate a default topic
    prompt_context: input.triggered_by === 'manual'
      ? `User wants content about: ${input.topic}`
      : `Generate trending social media content about current topics in: ${input.keywords.join(', ') || 'social media marketing, digital trends, business growth'}`
  }
}];
```

---

### NODE 5: HTTP Request - Trending Topics (Optional)

**Node Type:** HTTP Request
**Settings:**
- Method: GET
- URL: `https://newsapi.org/v2/top-headlines?q={{$json.keywords}}&apiKey={{$env.NEWS_API_KEY}}`
- OR use RSS feed: `https://rss.app/feeds/v1.1/{{$json.keywords}}.json`

**Purpose:** Fetch trending topics to enrich the AI prompt (optional - can skip if you don't have NewsAPI key)

**Fallback:** If this fails or is skipped, proceed with the user-provided topic.

---

### NODE 6: Code - Build AI Prompt

**Node Type:** Code
**Code:**
```javascript
const input = $json;

const platformGuides = {
  instagram: 'Instagram: Use emojis, 5-10 hashtags at the end, visual language, 2200 char max caption',
  facebook: 'Facebook: Conversational tone, ask questions to drive engagement, 6320 char max',
  linkedin: 'LinkedIn: Professional tone, thought leadership, use line breaks for readability, 3000 char max'
};

const platformText = input.platforms
  .map(p => platformGuides[p])
  .join('\n');

const prompt = `You are a social media content expert. Create a high-quality social media post.

TOPIC: ${input.topic}
TONE: ${input.tone}
KEYWORDS: ${input.keywords.join(', ')}

PLATFORM GUIDELINES:
${platformText}

REQUIREMENTS:
1. Write a compelling caption that drives engagement
2. Include a clear call-to-action
3. Make it shareable and relatable
4. For Instagram: include relevant hashtag suggestions at the end
5. Keep the tone ${input.tone} throughout
6. Make the first line hook the reader

OUTPUT FORMAT (JSON):
{
  "caption": "The main post caption text",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "platform_variants": {
    "instagram": "Instagram-optimized version with hashtags",
    "facebook": "Facebook-optimized version",
    "linkedin": "LinkedIn-optimized professional version"
  },
  "suggested_media_type": "image" | "video" | "carousel",
  "best_posting_time": "suggested time in EST"
}`;

return [{
  json: {
    ...input,
    ai_prompt: prompt
  }
}];
```

---

### NODE 7: OpenAI - Generate Content

**Node Type:** OpenAI (or HTTP Request to OpenAI API)
**Settings:**
- Model: `gpt-4o` (or `gpt-4o-mini` for cheaper option)
- Temperature: 0.8
- Max Tokens: 1500

**Option A: Using n8n OpenAI Node**
- Resource: Chat
- Operation: Message
- Model: gpt-4o
- Messages:
  - Role: System, Content: "You are a social media content expert. Always respond with valid JSON."
  - Role: User, Content: `{{$json.ai_prompt}}`

**Option B: Using HTTP Request Node**
```json
{
  "method": "POST",
  "url": "https://api.openai.com/v1/chat/completions",
  "headers": {
    "Authorization": "Bearer {{OPENAI_API_KEY}}",
    "Content-Type": "application/json"
  },
  "body": {
    "model": "gpt-4o",
    "messages": [
      {"role": "system", "content": "You are a social media content expert. Always respond with valid JSON."},
      {"role": "user", "content": "={{$json.ai_prompt}}"}
    ],
    "temperature": 0.8,
    "max_tokens": 1500
  }
}
```

---

### NODE 8: Code - Parse AI Response

**Node Type:** Code
**Code:**
```javascript
const input = $json;

// Extract the AI response content
let content;
try {
  // If using OpenAI node
  const aiResponse = input.choices?.[0]?.message?.content || input.text || input.content;

  // Try to parse as JSON
  const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    content = JSON.parse(jsonMatch[0]);
  } else {
    // Fallback: use raw text as caption
    content = {
      caption: aiResponse,
      hashtags: [],
      platform_variants: {},
      suggested_media_type: 'image'
    };
  }
} catch (e) {
  // Fallback if JSON parsing fails
  content = {
    caption: input.choices?.[0]?.message?.content || input.text || 'Generated content',
    hashtags: [],
    platform_variants: {},
    suggested_media_type: 'image'
  };
}

// Use the platform-specific variant if available, otherwise use main caption
const getCaption = (platform) => {
  if (content.platform_variants?.[platform]) {
    return content.platform_variants[platform];
  }
  // Append hashtags for Instagram
  if (platform === 'instagram' && content.hashtags?.length > 0) {
    return `${content.caption}\n\n${content.hashtags.map(h => `#${h}`).join(' ')}`;
  }
  return content.caption;
};

return [{
  json: {
    user_id: input.user_id,
    platforms: input.platforms,
    caption: content.caption,
    caption_instagram: getCaption('instagram'),
    caption_facebook: getCaption('facebook'),
    caption_linkedin: getCaption('linkedin'),
    hashtags: content.hashtags || [],
    suggested_media_type: content.suggested_media_type || 'image',
    best_posting_time: content.best_posting_time || null,
    auto_publish: input.auto_publish || false,
    original_topic: input.topic
  }
}];
```

---

### NODE 9: HTTP Request - Save Draft to App

**Node Type:** HTTP Request
**Settings:**
- Method: POST
- URL: `={{$env.APP_URL}}/api/ai/callback`
- Headers:
  - `Content-Type`: application/json
  - `x-n8n-signature`: (use Code node to compute HMAC)
- Body:
```json
{
  "user_id": "={{$json.user_id}}",
  "caption": "={{$json.caption_instagram}}",
  "media_url": null,
  "platforms": "={{$json.platforms}}",
  "auto_publish": false
}
```

---

### NODE 10: Code - Generate HMAC Signature

**Node Type:** Code
**Code:**
```javascript
const crypto = require('crypto');
const secret = $env.N8N_CALLBACK_SECRET;

const body = JSON.stringify({
  user_id: $json.user_id,
  caption: $json.caption_instagram,
  media_url: null,
  platforms: $json.platforms,
  auto_publish: $json.auto_publish
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

Then in the HTTP Request node (NODE 9), set:
- Body Content Type: Raw/JSON
- Body: `={{$json.body}}`
- Header `x-n8n-signature`: `={{$json.signature}}`

---

### NODE 11: IF - Auto Publish?

**Node Type:** IF
**Settings:**
- Condition: `{{$json.auto_publish}}` equals `true`

**TRUE branch** → NODE 12: Forward to Publisher
**FALSE branch** → End (content saved as draft)

---

### NODE 12: HTTP Request - Forward to Publisher Workflow

**Node Type:** HTTP Request
**Settings:**
- Method: POST
- URL: `={{$env.APP_URL}}/api/posts/{{post_id}}/publish`
- Headers:
  - `Content-Type`: application/json
  - `Cookie`: `auth_token={{SERVICE_TOKEN}}`

**Alternative:** Directly call the publisher webhook:
- URL: `={{$env.N8N_WEBHOOK_URL}}` (your existing publisher webhook)
- Body:
```json
{
  "job_id": "ai-gen-{{$runId}}",
  "user_id": "={{$json.user_id}}",
  "post_id": "={{$json.post_id}}",
  "caption": "={{$json.caption}}",
  "media_url": null,
  "scheduled_at": null,
  "platforms": "={{$json.platforms}}"
}
```

---

### NODE 13: Set - Return Success

**Node Type:** Set
**Settings:**
- Values:
  - `success`: true
  - `message`: "Content generated and saved as draft"
  - `post_id`: from NODE 9 response

---

## ENVIRONMENT VARIABLES

Add to n8n environment:

```
APP_URL = http://localhost:3000
N8N_CALLBACK_SECRET = same_as_in_nextjs_app
N8N_WEBHOOK_URL = http://localhost:5678/webhook/social-publish
OPENAI_API_KEY = sk-your-openai-key
NEWS_API_KEY = your-newsapi-key (optional)
```

---

## COMPLETE WORKFLOW JSON

```json
{
  "nodes": [
    {
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "parameters": {
        "rule": {
          "interval": [{ "field": "cronExpression", "expression": "0 9 * * 1-5" }]
        }
      }
    },
    {
      "name": "Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "httpMethod": "POST",
        "path": "ai-generate",
        "responseMode": "lastNode"
      }
    },
    {
      "name": "Merge",
      "type": "n8n-nodes-base.merge",
      "parameters": { "mode": "combine" }
    },
    {
      "name": "Set Defaults",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// See NODE 4 code above"
      }
    },
    {
      "name": "Build Prompt",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// See NODE 6 code above"
      }
    },
    {
      "name": "OpenAI Generate",
      "type": "n8n-nodes-base.openAi",
      "parameters": {
        "resource": "chat",
        "operation": "message",
        "model": "gpt-4o",
        "messages": {
          "values": [
            { "role": "system", "content": "You are a social media content expert. Always respond with valid JSON." },
            { "role": "user", "content": "={{$json.ai_prompt}}" }
          ]
        },
        "options": { "temperature": 0.8 }
      }
    },
    {
      "name": "Parse Response",
      "type": "n8n-nodes-base.code",
      "parameters": {
        "jsCode": "// See NODE 8 code above"
      }
    },
    {
      "name": "Save Draft",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "method": "POST",
        "url": "={{$env.APP_URL}}/api/ai/callback",
        "sendHeaders": true,
        "headerParameters": {
          "parameters": [
            { "name": "Content-Type", "value": "application/json" }
          ]
        },
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            { "name": "user_id", "value": "={{$json.user_id}}" },
            { "name": "caption", "value": "={{$json.caption_instagram}}" },
            { "name": "platforms", "value": "={{JSON.stringify($json.platforms)}}" }
          ]
        }
      }
    }
  ],
  "connections": {
    "Schedule Trigger": { "main": [[{ "node": "Merge", "type": "main", "index": 0 }]] },
    "Webhook Trigger": { "main": [[{ "node": "Merge", "type": "main", "index": 1 }]] },
    "Merge": { "main": [[{ "node": "Set Defaults", "type": "main", "index": 0 }]] },
    "Set Defaults": { "main": [[{ "node": "Build Prompt", "type": "main", "index": 0 }]] },
    "Build Prompt": { "main": [[{ "node": "OpenAI Generate", "type": "main", "index": 0 }]] },
    "OpenAI Generate": { "main": [[{ "node": "Parse Response", "type": "main", "index": 0 }]] },
    "Parse Response": { "main": [[{ "node": "Save Draft", "type": "main", "index": 0 }]] }
  }
}
```

---

## TESTING

### Test with Webhook (Manual Trigger)

```bash
curl -X POST http://localhost:5678/webhook/ai-generate \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "your_user_id",
    "topic": "10 proven ways to grow your Instagram following in 2024",
    "platforms": ["instagram", "facebook", "linkedin"],
    "tone": "professional",
    "keywords": ["instagram", "growth", "social media", "marketing"],
    "auto_publish": false
  }'
```

### Expected Result

1. Webhook receives the request
2. AI generates content
3. Draft is saved in the app via `/api/ai/callback`
4. Response shows success with post_id

### Verify in App

1. Go to Dashboard → Posts
2. You should see the AI-generated post as a "Draft"
3. Click to edit if needed
4. Click "Publish" to send to the publisher workflow

---

## INTEGRATION WITH EXISTING WORKFLOWS

```
┌─────────────────────────────────────────────────────────┐
│                    YOUR APP                              │
│                                                         │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐       │
│  │ Manual   │     │ Schedule │     │ AI Gen   │       │
│  │ Create   │     │ (cron)   │     │ Button   │       │
│  └────┬─────┘     └────┬─────┘     └────┬─────┘       │
│       │                │                │               │
│       ▼                ▼                ▼               │
│  ┌──────────┐     ┌──────────┐     ┌──────────┐       │
│  │ POST     │     │ POST     │     │ POST     │       │
│  │ /api/    │     │ /api/    │     │ /api/    │       │
│  │ posts    │     │ posts    │     │ ai/      │       │
│  └────┬─────┘     └────┬─────┘     │ generate │       │
│       │                │            └────┬─────┘       │
│       │                │                 │               │
│       ▼                ▼                 ▼               │
│  ┌──────────────────────────────────────────┐          │
│  │         POST /api/posts/[id]/publish     │          │
│  │              (or directly)               │          │
│  └──────────────────┬───────────────────────┘          │
└─────────────────────┼───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│              n8n WORKFLOW B: PUBLISHER                   │
│                                                         │
│  Webhook → Fetch Tokens → Publish IG/FB/LI → Callback  │
└─────────────────────────────────────────────────────────┘
```

**Three ways content enters the pipeline:**
1. **Manual** → User creates post in dashboard → Publish button → n8n Publisher
2. **Scheduled** → n8n Schedule Trigger → AI Generator → Save Draft → User reviews → Publish → n8n Publisher
3. **AI + Auto** → AI Generator → Save Draft → Auto-forward to n8n Publisher
