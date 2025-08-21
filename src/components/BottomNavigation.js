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
    <div className="bg-black px-4 py-2">
      <div className="flex justify-around">
        {navItems.map(({ key, icon: Icon, label, path }) => (
          <button
            key={key}
            onClick={() => router.push(path)}
            className={`flex flex-col items-center py-1 px-2 ${
              pathname === path ? "text-white" : "text-gray-500"
            }`}
          >
            <Icon className="w-5 h-5 mb-1" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
