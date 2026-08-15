import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export interface GenerateContentInput {
  topic: string;
  brandName?: string;
  industry?: string;
  tone?: string;
  targetAudience?: string;
  keywords?: string[];
  platform: string;
}

export interface GenerateContentResult {
  caption: string;
  hashtags: string[];
  tokens: number;
  estimatedCost: number;
}

export async function generateContent(input: GenerateContentInput): Promise<GenerateContentResult> {
  if (!openai) {
    throw new Error('AI service not configured');
  }

  const systemPrompt = `You are a professional social media content writer. Create engaging, platform-optimized content for the given topic. Always include relevant hashtags. Write in a ${input.tone || 'professional'} tone. Target audience: ${input.targetAudience || 'general audience'}.`;

  const userPrompt = `Create a social media post for ${input.platform} about: "${input.topic}"
${input.brandName ? `Brand: ${input.brandName}` : ''}
${input.industry ? `Industry: ${input.industry}` : ''}
${input.keywords?.length ? `Keywords to include: ${input.keywords.join(', ')}` : ''}

Return ONLY valid JSON with this exact structure:
{
  "caption": "the post caption",
  "hashtags": ["hashtag1", "hashtag2"]
}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No content generated');

  const parsed = JSON.parse(content);
  const tokens = response.usage?.total_tokens || 0;

  return {
    caption: parsed.caption,
    hashtags: parsed.hashtags || [],
    tokens,
    estimatedCost: tokens * 0.0000015,
  };
}

export interface GenerateImageInput {
  prompt: string;
  size?: '1024x1024' | '1792x1024' | '1024x1792';
  style?: 'vivid' | 'natural';
}

export interface GenerateImageResult {
  url: string;
  revisedPrompt: string;
  estimatedCost: number;
}

export async function generateImage(input: GenerateImageInput): Promise<GenerateImageResult> {
  if (!openai) {
    throw new Error('Image generation service not configured');
  }

  const response = await openai.images.generate({
    model: 'dall-e-3',
    prompt: input.prompt,
    size: input.size || '1024x1024',
    style: input.style || 'vivid',
    n: 1,
  });

  return {
    url: response.data?.[0]?.url || '',
    revisedPrompt: response.data?.[0]?.revised_prompt || '',
    estimatedCost: 0.04,
  };
}
