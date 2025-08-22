'use client'

import { Home, Calendar, MessageCircle, Bell, Menu } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

export default function BottomNavigation() {
  const router = useRouter()
  const pathname = usePathname()

  const navItems = [
    { key: "/", icon: Home, label: "메인", path: "/" },
    { key: "/schedule", icon: Calendar, label: "일정/결과", path: "/schedule" },
    { key: "/wiz-talk", icon: MessageCircle, label: "위즈톡", path: "/wiz-talk" },
    { key: "/notifications", icon: Bell, label: "알림", path: "/notifications" },
    { key: "/menu", icon: Menu, label: "메뉴", path: "/menu" },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-50">
      {/* 모바일 Safe Area 지원 */}
      <div className="px-4 py-2 pb-safe">
        <div className="flex justify-around max-w-md mx-auto">
          {navItems.map(({ key, icon: Icon, label, path }) => (
            <button
              key={key}
              onClick={() => router.push(path)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                pathname === path 
                  ? "text-white bg-gray-800" 
                  : "text-gray-400 hover:text-gray-200 hover:bg-gray-900"
              }`}
            >
              <Icon className="w-5 h-5 mb-1 flex-shrink-0" />
              <span className="text-xs font-medium truncate">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
