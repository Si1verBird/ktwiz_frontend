'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Bot, Send } from 'lucide-react'
import { chatAPI } from '../../lib/api'

export default function ChatPage() {
  const router = useRouter()
  const [chatMessages, setChatMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [sessionId, setSessionId] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeChat()
  }, [])

  const initializeChat = async () => {
    try {
      // 사용자 정보 로드
      const userData = localStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      }

      // 기존 세션 ID 확인 (24시간 내)
      const storedSession = localStorage.getItem('chatSession')
      const now = new Date().getTime()
      
      let currentSessionId = null
      
      if (storedSession) {
        const { sessionId: stored, timestamp } = JSON.parse(storedSession)
        // 24시간(86400000ms) 이내인지 확인
        if (now - timestamp < 86400000) {
          currentSessionId = stored
        } else {
          localStorage.removeItem('chatSession')
        }
      }
      
      // 새로운 세션 생성 또는 기존 세션 사용
      if (!currentSessionId) {
        const response = await chatAPI.createSession()
        currentSessionId = response.sessionId
        localStorage.setItem('chatSession', JSON.stringify({
          sessionId: currentSessionId,
          timestamp: now
        }))
      }
      
      setSessionId(currentSessionId)
      
      // 기존 채팅 내역 로드
      await loadChatHistory(currentSessionId)
      
    } catch (error) {
      console.error('채팅 초기화 실패:', error)
      // 오류 발생시 기본 메시지 표시
      setChatMessages([{
        id: 'welcome',
        message: "안녕하세요! 빅또리 비서입니다. 어떻게 도와드릴까요?",
        role: 'ASSISTANT',
        createdAt: new Date().toISOString()
      }])
    } finally {
      setLoading(false)
    }
  }

  const loadChatHistory = async (sessionId) => {
    try {
      const history = await chatAPI.getChatHistory(sessionId)
      
      // 채팅 내역이 비어있다면 환영 메시지 추가
      if (history.length === 0) {
        setChatMessages([{
          id: 'welcome',
          message: "안녕하세요! 빅또리 비서입니다. 어떻게 도와드릴까요?",
          role: 'ASSISTANT',
          createdAt: new Date().toISOString()
        }])
      } else {
        setChatMessages(history)
      }
    } catch (error) {
      console.error('채팅 내역 로드 실패:', error)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !sessionId) return

    const tempUserMessage = {
      id: `temp-${Date.now()}`,
      message: newMessage,
      role: 'USER',
      createdAt: new Date().toISOString()
    }
    
    // UI에 즉시 사용자 메시지 표시
    setChatMessages(prev => [...prev, tempUserMessage])
    const messageToSend = newMessage
    setNewMessage("")

    try {
      // 백엔드에 메시지 전송
      await chatAPI.sendMessage(sessionId, user?.id || null, messageToSend)
      
      // 전체 채팅 내역 다시 로드 (봇 응답 포함)
      await loadChatHistory(sessionId)
      
    } catch (error) {
      console.error('메시지 전송 실패:', error)
      // 오류 발생시 임시 메시지 제거하고 에러 메시지 표시
      setChatMessages(prev => prev.filter(msg => msg.id !== tempUserMessage.id))
      alert('메시지 전송에 실패했습니다. 다시 시도해주세요.')
    }
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-white max-w-md mx-auto items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        <p className="mt-4 text-gray-600">채팅을 로딩 중...</p>
      </div>
    )
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
        {chatMessages.map((message) => {
          const isBot = message.role === 'ASSISTANT'
          return (
            <div
              key={message.id}
              className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                isBot 
                  ? 'bg-gray-100 text-gray-800' 
                  : 'bg-red-500 text-white'
              }`}>
                <div className="text-sm">{message.message}</div>
                <div className={`text-xs mt-1 ${
                  isBot ? 'text-gray-500' : 'text-white/70'
                }`}>
                  {formatTime(message.createdAt)}
                </div>
              </div>
            </div>
          )
        })}
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
