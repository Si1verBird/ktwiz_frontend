'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import BottomNavigation from './BottomNavigation'
import FloatingChatButton from './FloatingChatButton'

export default function Layout({ children }) {
  const pathname = usePathname()
  const isChat = pathname === '/chat'

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto relative">
      {/* Header - Hidden for chat screen */}
      {!isChat && <Header />}

      {/* Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </div>

      {/* Floating Action Button - Victory Assistant - Hidden for chat screen */}
      {!isChat && <FloatingChatButton />}

      {/* Bottom Navigation - Hidden for chat screen */}
      {!isChat && <BottomNavigation />}
    </div>
  )
}
