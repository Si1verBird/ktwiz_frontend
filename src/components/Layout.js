'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Header from './Header'
import BottomNavigation from './BottomNavigation'
import FloatingChatButton from './FloatingChatButton'

export default function Layout({ children }) {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const isChat = pathname === '/chat'

  // 컴포넌트 마운트 확인 (Hydration 오류 방지)
  useEffect(() => {
    setMounted(true)
  }, [])

  // 마운트되기 전에도 전체 레이아웃 표시 (Hydration 문제 해결)
  if (!mounted) {
    return (
      <div className="flex flex-col h-screen bg-white max-w-md mx-auto relative">
        {/* Header - Hidden for chat screen */}
        {!isChat && <Header />}

        {/* Content with bottom padding for fixed navigation */}
        <div className={`flex-1 overflow-y-auto overflow-x-hidden ${!isChat ? 'pb-20' : ''}`}>
          {children}
        </div>

        {/* Floating Action Button - Hidden for chat screen */}
        {!isChat && <FloatingChatButton />}

        {/* Bottom Navigation - Hidden for chat screen */}
        {!isChat && <BottomNavigation />}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto relative">
      {/* Header - Hidden for chat screen */}
      {!isChat && <Header />}

      {/* Content with bottom padding for fixed navigation */}
      <div className={`flex-1 overflow-y-auto overflow-x-hidden ${!isChat ? 'pb-20' : ''}`}>
        {children}
      </div>

      {/* Floating Action Button - Victory Assistant - Hidden for chat screen */}
      {!isChat && <FloatingChatButton />}

      {/* Bottom Navigation - Hidden for chat screen */}
      {!isChat && <BottomNavigation />}
    </div>
  )
}
