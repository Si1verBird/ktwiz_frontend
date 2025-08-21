'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Bot, Send } from 'lucide-react'

export default function ChatPage() {
  const router = useRouter()
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "안녕하세요! 빅또리 비서입니다. 어떻게 도와드릴까요?", isBot: true, time: "14:30" }
  ])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage = {
        id: chatMessages.length + 1,
        text: newMessage,
        isBot: false,
        time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
      }
      
      setChatMessages([...chatMessages, userMessage])
      setNewMessage("")
      
      // Bot response simulation
      setTimeout(() => {
        const botResponse = {
          id: chatMessages.length + 2,
          text: "네, 무엇을 도와드릴까요? KT wiz 관련 정보, 티켓 예매, 경기 일정 등 궁금한 것이 있으시면 언제든 말씀해주세요!",
          isBot: true,
          time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        }
        setChatMessages(prev => [...prev, botResponse])
      }, 1000)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-red-500 to-pink-500 px-4 py-4 text-white">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => router.push("/")}
            className="p-1"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="font-medium">빅또리 비서</div>
            <div className="text-sm text-white/80">온라인</div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
              message.isBot 
                ? 'bg-gray-100 text-gray-800' 
                : 'bg-red-500 text-white'
            }`}>
              <div className="text-sm">{message.text}</div>
              <div className={`text-xs mt-1 ${
                message.isBot ? 'text-gray-500' : 'text-white/70'
              }`}>
                {message.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="메시지를 입력하세요..."
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-red-500"
          />
          <button
            onClick={handleSendMessage}
            className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
