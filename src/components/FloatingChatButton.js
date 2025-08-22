'use client'

import { Bot } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function FloatingChatButton() {
  const router = useRouter()

  const handleVictoryAssistant = () => {
    router.push('/chat')
  }

  return (
    <button
      onClick={handleVictoryAssistant}
      className="fixed bottom-24 right-4 z-50 w-14 h-14 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex flex-col items-center justify-center text-white pb-safe"
    >
      <Bot className="w-6 h-6 mb-1" />
      <span className="text-xs leading-none">비서</span>
    </button>
  )
}
