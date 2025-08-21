'use client'

import { Ticket } from 'lucide-react'
import Layout from '../../components/Layout'

export default function TicketBookingPage() {
  return (
    <Layout>
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
