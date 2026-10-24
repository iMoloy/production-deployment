import { Navbar } from '@/components/navigation/navbar'
import { ChatInterface } from '@/components/chat/chat-interface'

export const metadata = {
  title: 'Agent Studio | NexusAgent Production (FE-11)',
  description: 'Interactive autonomous AI agent studio with Generative UI streaming tools and rate limiting.',
}

export default function ChatPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#090d16] text-white">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <ChatInterface />
      </main>
    </div>
  )
}
