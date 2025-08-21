'use client'

import { User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Header() {
  const router = useRouter()

  const handleMyWiz = () => {
    router.push('/my-wiz')
  }

  const handleLogoClick = () => {
    router.push('/')
  }

  return (
    <div className="bg-white px-4 py-3 border-b border-gray-200">
      <div className="flex items-center justify-between">
        {/* KT Wiz Logo */}
        <button 
          onClick={handleLogoClick}
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <Image
            src="https://i.namu.wiki/i/8yNpIyxIFYAE5wS7YduLoiNs-UjgbhhAb9DyIwm65CLwJC-Pk1lnHIyEMfXbmuaVXbxG9h2_EbdGw7qxkIJXMA.svg"
            alt="KT wiz"
            width={80}
            height={32}
            className="h-8 w-auto"
          />
        </button>
        
        {/* MY위즈 Button */}
        <button 
          onClick={handleMyWiz}
          className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
        >
          <User className="w-5 h-5 text-gray-600" />
          <span className="text-sm text-gray-700">MY위즈</span>
        </button>
      </div>
    </div>
  )
}
