import Anthropic from '@anthropic-ai/sdk'
import { buildSystemPrompt, buildUserPrompt } from '@/lib/prompt'
import { UserInput } from '@/lib/types'

export const runtime = 'nodejs'
export const maxDuration = 120

export async function POST(req: Request) {
  const { userInput }: { userInput: UserInput } = await req.json()

  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY ?? process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY,
  })

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const anthropicStream = await client.messages.stream({
          model: 'claude-opus-4-6',
          max_tokens: 8000,
          system: buildSystemPrompt(),
          messages: [
            {
              role: 'user',
              content: buildUserPrompt(userInput),
            },
          ],
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
        const message =
          error instanceof Error ? error.message : 'Unknown error'
        controller.enqueue(encoder.encode(`\n\nエラーが発生しました: ${message}`))
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
