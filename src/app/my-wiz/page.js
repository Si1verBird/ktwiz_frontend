'use client'

import { useRouter } from 'next/navigation'
import { ChevronRight, Ticket, Calendar } from 'lucide-react'
import Layout from '../../components/Layout'

export default function MyWizPage() {
  const router = useRouter()

  return (
    <Layout>
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        <div className="px-4 pt-4 pb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg">티켓 보관함</h3>
            <button className="flex items-center text-gray-500 text-sm">
              전체보기 <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Active Tickets */}
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-3">사용 가능한 티켓</div>
            
            <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border-l-4 border-red-500">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-red-500 font-medium">KT wiz vs LG 트윈스</div>
                <div className="bg-red-500 text-white px-2 py-1 rounded text-xs">사용가능</div>
              </div>
              <div className="text-gray-600 text-sm mb-1">2025.08.23 (금) 18:30</div>
              <div className="text-gray-500 text-xs mb-3">수원 KT위즈파크 • 1루 응원석 207구역</div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">좌석번호: 207구역 15열 23번</div>
                <button className="bg-black text-white px-3 py-1 rounded text-xs">QR코드</button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border-l-4 border-red-500">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-red-500 font-medium">KT wiz vs 키움 히어로즈</div>
                <div className="bg-red-500 text-white px-2 py-1 rounded text-xs">사용가능</div>
              </div>
              <div className="text-gray-600 text-sm mb-1">2025.08.25 (일) 17:00</div>
              <div className="text-gray-500 text-xs mb-3">수원 KT위즈파크 • 3루 일반석 301구역</div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">좌석번호: 301구역 8열 12번</div>
                <button className="bg-black text-white px-3 py-1 rounded text-xs">QR코드</button>
              </div>
            </div>
          </div>

          {/* Used Tickets */}
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-3">사용된 티켓</div>
            
            <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border-l-4 border-gray-300">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-500 font-medium">KT wiz vs NC 다이노스</div>
                <div className="bg-gray-400 text-white px-2 py-1 rounded text-xs">사용완료</div>
              </div>
              <div className="text-gray-500 text-sm mb-1">2025.08.16 (금) 18:30</div>
              <div className="text-gray-400 text-xs mb-3">수원 KT위즈파크 • 1루 응원석 207구역</div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400">좌석번호: 207구역 12열 15번</div>
                <div className="text-xs text-green-600">입장완료</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            <button 
              onClick={() => router.push("/ticket-booking")}
              className="bg-white rounded-xl p-4 flex flex-col items-center shadow-sm"
            >
              <Ticket className="w-8 h-8 text-red-500 mb-2" />
              <span className="text-sm text-gray-700">티켓 구매</span>
            </button>
            <button 
              onClick={() => router.push("/schedule")}
              className="bg-white rounded-xl p-4 flex flex-col items-center shadow-sm"
            >
              <Calendar className="w-8 h-8 text-red-500 mb-2" />
              <span className="text-sm text-gray-700">경기 일정</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
