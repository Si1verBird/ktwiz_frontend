'use client'

import { Ticket } from 'lucide-react'
import Layout from '../../components/Layout'

export default function TicketBookingPage() {
  return (
    <Layout>
      {/* 예시 페이지 안내 */}
      <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mx-4 mt-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-amber-700 font-medium">
              이 페이지는 예시 페이지로 아직 동작하지 않습니다!!
            </p>
            <p className="text-sm text-amber-600 mt-1">
              실제 티켓 예매 기능은 개발 중입니다.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <Ticket className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <div className="text-lg mb-2">티켓 예매</div>
          <div className="text-sm">준비 중입니다</div>
        </div>
      </div>
    </Layout>
  )
}
