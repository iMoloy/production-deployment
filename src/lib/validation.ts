import { z } from 'zod'

const MAX_PROMPT_CHARS = parseInt(process.env.MAX_PROMPT_CHARS || '2000', 10)
const MAX_MESSAGE_HISTORY = parseInt(process.env.MAX_MESSAGE_HISTORY || '30', 10)

/**
 * Message schema for chat requests.
 */
export const ChatMessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system'], {
    errorMap: () => ({ message: "Role must be 'user', 'assistant', or 'system'." }),
  }),
  content: z
    .string()
    .trim()
    .min(1, 'Message cannot be empty.')
    .max(
      MAX_PROMPT_CHARS,
      `Prompt exceeds maximum limit of ${MAX_PROMPT_CHARS} characters.`
    ),
})

/**
 * Chat request payload schema.
 */
export const ChatPayloadSchema = z.object({
  messages: z
    .array(ChatMessageSchema)
    .min(1, 'Conversation must contain at least one message.')
    .max(
      MAX_MESSAGE_HISTORY,
      `Conversation history exceeds maximum of ${MAX_MESSAGE_HISTORY} messages.`
    ),
})

export type ChatPayload = z.infer<typeof ChatPayloadSchema>
export type ChatMessage = z.infer<typeof ChatMessageSchema>

export interface ValidationSuccess {
  success: true
  data: ChatPayload
}

export interface ValidationError {
  success: false
  status: 400
  error: string
  details?: string[]
}

export function validateChatPayload(payload: unknown): ValidationSuccess | ValidationError {
  const result = ChatPayloadSchema.safeParse(payload)
  if (!result.success) {
    const formattedErrors = result.error.errors.map((err) => `${err.path.join('.')}: ${err.message}`)
    return {
      success: false,
      status: 400,
      error: 'Invalid request payload. Please review input caps.',
      details: formattedErrors,
    }
  }

  return {
    success: true,
    data: result.data,
  }
}
