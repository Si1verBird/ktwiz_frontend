'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Menu, 
  Calendar, 
  Plus, 
  Settings, 
  BarChart3, 
  MessageCircle, 
  Bell,
  Ticket,
  User,
  ChevronRight
} from 'lucide-react'
import Layout from '../../components/Layout'

export default function MenuPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)

  // 로그인 상태 확인
  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const menuItems = [
    {
      title: '경기 일정',
      description: '경기 스케줄 확인',
      icon: Calendar,
      path: '/schedule',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: '위즈톡',
      description: '팬들과 소통하기',
      icon: MessageCircle,
      path: '/wiz-talk',
      color: 'bg-green-50 text-green-600'
    },
    {
      title: '채팅',
      description: 'AI와 대화하기',
      icon: MessageCircle,
      path: '/chat',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: '티켓 예매',
      description: '경기 티켓 예매',
      icon: Ticket,
      path: '/ticket-booking',
      color: 'bg-orange-50 text-orange-600'
    },
    {
      title: '알림',
      description: '새로운 소식 확인',
      icon: Bell,
      path: '/notifications',
      color: 'bg-yellow-50 text-yellow-600'
    },
    {
      title: '마이 위즈',
      description: '내 정보 관리',
      icon: User,
      path: '/my-wiz',
      color: 'bg-indigo-50 text-indigo-600'
    }
  ]

  const adminItems = [
    {
      title: '경기 관리',
      description: '경기 생성, 수정, 삭제',
      icon: Settings,
      path: '/admin/games',
      color: 'bg-red-50 text-red-600'
    },
    {
      title: '새 경기 추가',
      description: '새로운 경기 등록',
      icon: Plus,
      path: '/admin/add-game',
      color: 'bg-red-50 text-red-600'
    },
    {
      title: '통계 관리',
      description: '팀 순위 및 통계',
      icon: BarChart3,
      path: '/admin/standings',
      color: 'bg-red-50 text-red-600'
    }
  ]

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 */}
          <div className="text-center mb-8">
            <Menu className="w-16 h-16 mx-auto mb-4 text-red-600" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">메뉴</h1>
            <p className="text-gray-600">KT Wiz 앱의 모든 기능을 확인하세요</p>
          </div>

          {/* 일반 메뉴 */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">일반 메뉴</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => router.push(item.path)}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-3 rounded-lg ${item.color} mr-4`}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 관리자 메뉴 - 관리자인 경우에만 표시 */}
          {user?.isAdmin && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">관리자 메뉴</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {adminItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => router.push(item.path)}
                    className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow text-left border-2 border-red-100"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`p-3 rounded-lg ${item.color} mr-4`}>
                          <item.icon className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{item.title}</h3>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="mt-4 p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600">
                  <strong>관리자 전용:</strong> 이 메뉴들은 관리자만 접근할 수 있습니다.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
