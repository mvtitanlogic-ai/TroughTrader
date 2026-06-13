import type { ChatMessage } from '@/types'

const API = '/api/chat'

export async function sendMessage(
  messages: ChatMessage[],
  model: string,
  onChunk?: (token: string) => void
): Promise<string> {
  const payload = { messages: messages.map(({ role, content }) => ({ role, content })), model, stream: !!onChunk }

  if (onChunk) {
    const res = await fetch(`${API}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error('Stream failed')
    if (!res.body) throw new Error('No response body')

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let fullText = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const lines = decoder.decode(value).split('\n').filter((l) => l.startsWith('data: '))
      for (const line of lines) {
        try {
          const data = JSON.parse(line.slice(6))
          const token = data?.message?.content || ''
          if (token) {
            fullText += token
            onChunk(token)
          }
        } catch {}
      }
    }
    return fullText
  } else {
    const res = await fetch(`${API}/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    return data?.message?.content || ''
  }
}

export async function getModels(): Promise<string[]> {
  try {
    const res = await fetch(`${API}/models`)
    const data: Array<{ name: string }> = await res.json()
    return data.map((m) => m.name)
  } catch {
    return []
  }
}

export async function checkOllama(): Promise<boolean> {
  try {
    const res = await fetch(`${API}/health`)
    const data = await res.json()
    return data.ollama === true
  } catch {
    return false
  }
}
