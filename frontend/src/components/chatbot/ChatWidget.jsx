import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const initialMessages = [
  { role: 'assistant', content: 'Hello! I\'m SentinelAI Assistant. How can I help you stay safe from cyber fraud today?' },
]

const botResponses = {
  default: 'I can help you verify UPI IDs, phone numbers, QR codes, and report scams. What would you like to check?',
  upi: 'To verify a UPI ID, go to the Citizen Dashboard and use the "Verify UPI" tool. Never share OTPs with anyone claiming to be from your bank.',
  scam: 'If you\'ve been scammed, immediately report it through the "Report Scam" feature. Block your cards and change passwords. I\'ve flagged this for our fraud team.',
  safe: 'Stay safe by: 1) Never sharing OTPs 2) Verifying UPI requests 3) Checking URLs before clicking 4) Using official bank apps only.',
}

function getResponse(input) {
  const lower = input.toLowerCase()
  if (lower.includes('upi')) return botResponses.upi
  if (lower.includes('scam') || lower.includes('fraud')) return botResponses.scam
  if (lower.includes('safe') || lower.includes('tip')) return botResponses.safe
  return botResponses.default
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return
    const userMsg = { role: 'user', content: input }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTyping(true)

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'assistant', content: getResponse(userMsg.content) }])
      setTyping(false)
    }, 1000)
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] rounded-2xl border bg-card shadow-2xl overflow-hidden"
          >
            <div className="gradient-primary px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Bot className="h-5 w-5" />
                <span className="font-semibold">SentinelAI Assistant</span>
              </div>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div ref={scrollRef} className="h-[320px] overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div
                    className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-2 text-sm',
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-muted rounded-bl-md'
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex gap-1 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.1s]" />
                  <span className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0.2s]" />
                </div>
              )}
            </div>

            <div className="border-t p-3 flex gap-2">
              <Input
                placeholder="Ask about fraud prevention..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button size="icon" onClick={sendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full gradient-primary text-white shadow-2xl"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </motion.button>
    </>
  )
}
