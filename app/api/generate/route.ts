import Anthropic from '@anthropic-ai/sdk'
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompt'
import { UserInput } from '@/lib/types'

export const runtime = 'nodejs'
export const maxDuration = 120

export async function POST(req: Request) {
  // APIキーをストリーム開始前に確認し、未設定なら即 400 を返す
  const apiKey =
    process.env.ANTHROPIC_API_KEY ?? process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error:
          'APIキーが設定されていません。Vercel の環境変数 ANTHROPIC_API_KEY を確認してください。',
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const { userInput }: { userInput: UserInput } = await req.json()
  const client = new Anthropic({ apiKey })
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = client.messages.stream({
          model: 'claude-opus-4-6',
          max_tokens: 8000,
          system: buildSystemPrompt(),
          messages: [{ role: 'user', content: buildUserPrompt(userInput) }],
        })

        for await (const event of anthropicStream) {
          if (
            event.type === 'content_block_delta' &&
            event.delta.type === 'text_delta'
          ) {
            controller.enqueue(encoder.encode(event.delta.text))
          }
        }
        controller.close()
      } catch (error) {
        // ストリーム中のエラーは特殊ヘッダーで通知
        const message = error instanceof Error ? error.message : 'Unknown error'
        controller.enqueue(
          encoder.encode(`\x00ERROR:${message}`)  // null byte をエラーの目印に使用
        )
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  })
}
