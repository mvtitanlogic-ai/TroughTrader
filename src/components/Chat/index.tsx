import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, User, Trash2, ChevronDown, AlertCircle, Loader2 } from 'lucide-react'
import { useAppStore } from '@/stores/useAppStore'
import { sendMessage, getModels, checkOllama } from '@/services/ollamaService'
import { generateId } from '@/lib/utils'
import type { ChatMessage } from '@/types'

export function ChatPanel() {
  const { chatMessages, addChatMessage, clearChat, chatModel, setChatModel } = useAppStore()
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [models, setModels] = useState<string[]>([])
  const [ollamaOnline, setOllamaOnline] = useState<boolean | null>(null)
  const [showModelMenu, setShowModelMenu] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    checkOllama().then(setOllamaOnline)
    getModels().then(setModels)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, streamingContent])

  async function handleSend() {
    const text = input.trim()
    if (!text || streaming) return

    const userMsg: ChatMessage = { id: generateId(), role: 'user', content: text, timestamp: Date.now() }
    addChatMessage(userMsg)
    setInput('')
    setStreaming(true)
    setStreamingContent('')

    try {
      let full = ''
      await sendMessage([...chatMessages, userMsg], chatModel, (token) => {
        full += token
        setStreamingContent(full)
      })

      const assistantMsg: ChatMessage = {
        id: generateId(), role: 'assistant', content: full, timestamp: Date.now(),
      }
      addChatMessage(assistantMsg)
    } catch (err) {
      const errMsg: ChatMessage = {
        id: generateId(), role: 'assistant',
        content: `Error: ${err instanceof Error ? err.message : 'Something went wrong'}`,
        timestamp: Date.now(),
      }
      addChatMessage(errMsg)
    } finally {
      setStreaming(false)
      setStreamingContent('')
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-trough-border">
        <div className="flex items-center gap-2">
          <Bot size={18} className="text-purple-400" />
          <span className="text-sm font-semibold">TroughBot</span>
          {ollamaOnline !== null && (
            <span className={`flex items-center gap-1 text-xs ${ollamaOnline ? 'text-emerald-400' : 'text-red-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${ollamaOnline ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
              {ollamaOnline ? 'Online' : 'Offline'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Model selector */}
          <div className="relative">
            <button
              onClick={() => setShowModelMenu((v) => !v)}
              className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-trough-card border border-trough-border text-xs text-trough-muted hover:text-trough-text transition-colors"
            >
              <span className="max-w-[100px] truncate">{chatModel}</span>
              <ChevronDown size={12} />
            </button>
            {showModelMenu && models.length > 0 && (
              <div className="absolute right-0 top-full mt-1 bg-trough-card border border-trough-border rounded-lg shadow-xl z-50 min-w-[180px] overflow-hidden">
                {models.map((m) => (
                  <button
                    key={m}
                    onClick={() => { setChatModel(m); setShowModelMenu(false) }}
                    className={`w-full text-left px-3 py-2 text-xs hover:bg-trough-surface transition-colors ${m === chatModel ? 'text-purple-400' : 'text-trough-text'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={clearChat}
            className="p-1.5 text-trough-muted hover:text-red-400 rounded-md hover:bg-red-500/10 transition-all"
            title="Clear chat"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Offline warning */}
      {ollamaOnline === false && (
        <div className="mx-4 mt-3 flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          <AlertCircle size={14} className="text-red-400 shrink-0" />
          <p className="text-xs text-red-400">Ollama offline. Run: <code className="font-mono">ollama serve</code></p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 && !streaming && (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-8">
            <Bot size={40} className="text-trough-border" />
            <div>
              <p className="text-sm text-trough-text-dim font-medium">TroughBot is ready</p>
              <p className="text-xs text-trough-muted mt-1">Ask about stocks, strategies, or just cope together</p>
            </div>
            <div className="grid grid-cols-1 gap-2 mt-2 w-full max-w-xs">
              {['Why is GME down today?', 'Explain support/resistance', 'How do I stop revenge trading?'].map((s) => (
                <button
                  key={s}
                  onClick={() => { setInput(s); textareaRef.current?.focus() }}
                  className="text-left text-xs px-3 py-2 bg-trough-card border border-trough-border rounded-lg hover:border-purple-500/40 transition-colors text-trough-muted hover:text-trough-text"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence initial={false}>
          {chatMessages.map((msg) => (
            <MessageBubble key={msg.id} msg={msg} />
          ))}
        </AnimatePresence>

        {streaming && streamingContent && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-purple-600/20 border border-purple-600/30 flex items-center justify-center shrink-0 mt-0.5">
              <Bot size={14} className="text-purple-400" />
            </div>
            <div className="flex-1 bg-trough-card border border-trough-border rounded-xl px-4 py-3">
              <p className="text-sm text-trough-text whitespace-pre-wrap leading-relaxed">{streamingContent}</p>
              <Loader2 size={12} className="animate-spin text-purple-400 mt-2" />
            </div>
          </motion.div>
        )}

        {streaming && !streamingContent && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-purple-600/20 border border-purple-600/30 flex items-center justify-center shrink-0">
              <Bot size={14} className="text-purple-400" />
            </div>
            <div className="flex items-center gap-1.5 bg-trough-card border border-trough-border rounded-xl px-4 py-3">
              {[0, 1, 2].map((i) => (
                <motion.span key={i} className="w-1.5 h-1.5 bg-purple-400 rounded-full"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-trough-border">
        <div className="flex items-end gap-2 bg-trough-card border border-trough-border rounded-xl px-4 py-2 focus-within:border-purple-500/50 transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask TroughBot... (Shift+Enter for newline)"
            rows={1}
            className="flex-1 bg-transparent text-sm text-trough-text placeholder-trough-muted outline-none resize-none min-h-[24px] max-h-32 overflow-y-auto"
            style={{ scrollbarWidth: 'none' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || streaming}
            className="p-1.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all shrink-0 mb-0.5"
          >
            <Send size={14} className="text-white" />
          </button>
        </div>
        <p className="text-xs text-trough-muted/50 text-center mt-1.5">
          Using {chatModel} via Ollama • Not financial advice
        </p>
      </div>
    </div>
  )
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5
        ${isUser
          ? 'bg-purple-600/20 border border-purple-600/30'
          : 'bg-trough-surface border border-trough-border'}`}>
        {isUser ? <User size={14} className="text-purple-400" /> : <Bot size={14} className="text-trough-text-dim" />}
      </div>
      <div className={`max-w-[85%] px-4 py-3 rounded-xl text-sm text-trough-text whitespace-pre-wrap leading-relaxed
        ${isUser
          ? 'bg-purple-600/15 border border-purple-600/25'
          : 'bg-trough-card border border-trough-border'}`}>
        {msg.content}
      </div>
    </motion.div>
  )
}
