'use client'

import { useRouter } from 'next/navigation'
import { Home, ArrowLeft, Search } from 'lucide-react'
import Layout from '../components/Layout'

export default function NotFound() {
  const router = useRouter()

  return (
    <Layout>
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-gray-50 to-gray-100">
        {/* 404 숫자 */}
        <div className="text-center mb-8">
          <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500 mb-4">
            404
          </div>
          <div className="text-2xl font-semibold text-gray-800 mb-2">
            페이지를 찾을 수 없습니다
          </div>
          <div className="text-gray-600 text-lg">
            요청하신 페이지가 존재하지 않거나 이동되었습니다
          </div>
        </div>

        {/* KT Wiz 로고/이미지 영역 */}
        <div className="mb-8">
          <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white text-4xl font-bold">KT</span>
          </div>
        </div>

        {/* 안내 메시지 */}
        <div className="text-center mb-8 max-w-md">
          <p className="text-gray-600 leading-relaxed">
            찾으시는 페이지가 없거나 일시적으로 접근할 수 없습니다.<br/>
            홈페이지로 돌아가거나 다른 페이지를 탐색해보세요.
          </p>
        </div>

        {/* 액션 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button
            onClick={() => router.push('/')}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Home className="w-5 h-5" />
            홈으로 가기
          </button>
          
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center gap-2 bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            이전 페이지
          </button>
        </div>

        {/* 추천 링크들 */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm mb-4">다른 페이지 둘러보기</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => router.push('/schedule')}
              className="px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-200 hover:border-red-300 hover:text-red-600 transition-colors text-sm"
            >
              경기 일정
            </button>
            <button
              onClick={() => router.push('/wiz-talk')}
              className="px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-200 hover:border-red-300 hover:text-red-600 transition-colors text-sm"
            >
              WIZ TALK
            </button>
            <button
              onClick={() => router.push('/my-wiz')}
              className="px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-200 hover:border-red-300 hover:text-red-600 transition-colors text-sm"
            >
              MY WIZ
            </button>
            <button
              onClick={() => router.push('/chat')}
              className="px-4 py-2 bg-white text-gray-700 rounded-full border border-gray-200 hover:border-red-300 hover:text-red-600 transition-colors text-sm"
            >
              빅또리 비서
            </button>
          </div>
        </div>

        {/* 도움말 */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-xs">
            문제가 지속되면 관리자에게 문의해주세요
          </p>
        </div>
      </div>
    </Layout>
  )
}
