'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Send, MessageCircle, User, Clock } from 'lucide-react'
import { chatAPI } from '../../../lib/api'

export default function ChatManagementPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState(null)
  const [chatSessions, setChatSessions] = useState([])
  const [selectedSession, setSelectedSession] = useState(null)
  const [chatMessages, setChatMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)

  // 컴포넌트 마운트 확인
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      initializeAdmin()
    }
  }, [mounted])

  const initializeAdmin = async () => {
    if (!mounted) return
    
    try {
      // 관리자 권한 확인
      const userData = localStorage?.getItem('user')
      if (!userData) {
        router.push('/login')
        return
      }
      
      const parsedUser = JSON.parse(userData)
      if (!parsedUser.is_admin) {
        alert('관리자 권한이 필요합니다.')
        router.push('/')
        return
      }
      
      setUser(parsedUser)
      // TODO: 채팅 세션 목록 로드 (향후 API 구현)
      
    } catch (error) {
      console.error('관리자 초기화 실패:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const loadChatHistory = async (sessionId) => {
    try {
      const history = await chatAPI.getChatHistory(sessionId)
      setChatMessages(history)
    } catch (error) {
      console.error('채팅 내역 로드 실패:', error)
    }
  }

  const handleSendAdminMessage = async () => {
    if (!newMessage.trim() || !selectedSession || !user) return

    try {
      await chatAPI.sendAdminMessage(selectedSession, user.id, newMessage)
      setNewMessage("")
      
      // 채팅 내역 다시 로드
      await loadChatHistory(selectedSession)
      
    } catch (error) {
      console.error('관리자 메시지 전송 실패:', error)
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
      <div className="flex flex-col h-screen bg-white max-w-6xl mx-auto items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        <p className="mt-4 text-gray-600">채팅 관리 로딩 중...</p>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-white max-w-6xl mx-auto">
      {/* Left Sidebar - Chat Sessions List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 px-4 py-4 text-white">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => router.push("/")}
              className="p-1"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="font-medium">채팅 관리</div>
              <div className="text-sm text-white/80">관리자 모드</div>
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 text-center text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">채팅 세션 목록</p>
            <p className="text-xs text-gray-400 mt-1">향후 업데이트 예정</p>
          </div>
          
          {/* 임시 테스트용 세션 */}
          <div className="px-4">
            <div className="border rounded-lg p-3 mb-2 cursor-pointer hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <User className="w-8 h-8 text-gray-400" />
                <div className="flex-1">
                  <div className="text-sm font-medium">테스트 사용자</div>
                  <div className="text-xs text-gray-500">최근 메시지 미리보기...</div>
                </div>
                <Clock className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Chat View */}
      <div className="flex-1 flex flex-col">
        {selectedSession ? (
          <>
            {/* Chat Header */}
            <div className="border-b border-gray-200 px-4 py-3">
              <div className="flex items-center space-x-3">
                <User className="w-8 h-8 text-gray-400" />
                <div>
                  <div className="font-medium">사용자와의 대화</div>
                  <div className="text-sm text-gray-500">세션 ID: {selectedSession}</div>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => {
                const isUser = message.role === 'USER'
                const isAdmin = message.role === 'ADMIN'
                const isBot = message.role === 'ASSISTANT'
                
                return (
                  <div
                    key={message.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="space-y-1">
                      {/* 발신자 표시 */}
                      {(isAdmin || isBot || isUser) && (
                        <div className="text-xs text-gray-500 ml-1">
                          {isUser ? '사용자' : isAdmin ? `관리자 ${message.user?.nickname || ''}` : '빅또리 비서'}
                        </div>
                      )}
                      
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        isUser 
                          ? 'bg-gray-100 text-gray-800' 
                          : isAdmin
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        <div className="text-sm">{message.message}</div>
                        <div className={`text-xs mt-1 ${
                          isUser 
                            ? 'text-gray-500' 
                            : isAdmin 
                            ? 'text-white/70' 
                            : 'text-gray-500'
                        }`}>
                          {formatTime(message.createdAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Admin Reply Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSendAdminMessage()
                    }
                  }}
                  placeholder="관리자 답변을 입력하세요..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleSendAdminMessage}
                  className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          /* No Session Selected */
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">채팅 세션을 선택하세요</p>
              <p className="text-sm text-gray-400 mt-1">왼쪽에서 관리할 채팅을 선택해주세요</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
