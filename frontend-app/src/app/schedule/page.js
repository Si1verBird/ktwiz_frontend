'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'
import Layout from '../../components/Layout'

export default function SchedulePage() {
  return (
    <Layout>
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        {/* Month Navigation */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <ChevronLeft className="w-6 h-6 text-gray-400" />
            <div className="text-xl font-medium">2025.8</div>
            <ChevronRight className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        {/* Week 1 */}
        <div className="px-4 pt-4">
          <div className="text-gray-600 text-sm mb-4">8월 1주</div>

          {/* Game 1 */}
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-gray-600 text-sm">1(금) 오후 06:30</div>
                <div className="text-xs text-gray-500 mt-1">창원</div>
              </div>
              <div className="bg-cyan-500 text-white px-2 py-1 rounded text-xs">경기종료</div>
            </div>

            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mr-3">
                  <div className="text-white text-xs font-bold">KT</div>
                </div>
                <div className="text-2xl font-bold mr-4">3</div>
              </div>

              <div className="px-4">
                <div className="text-gray-500 text-sm">패배</div>
              </div>

              <div className="flex items-center">
                <div className="text-2xl font-bold ml-4">5</div>
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center ml-3">
                  <div className="text-white text-xs font-bold">NC</div>
                </div>
              </div>
            </div>
          </div>

          {/* Game 2 */}
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-gray-600 text-sm">13(수) 오후 06:30</div>
                <div className="text-xs text-gray-500 mt-1">수원</div>
              </div>
              <div className="bg-red-500 text-white px-2 py-1 rounded text-xs">경기예정</div>
            </div>

            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mr-3 opacity-50">
                  <div className="text-white text-xs font-bold">LG</div>
                </div>
                <div className="text-2xl font-bold mr-4 text-gray-400">0</div>
              </div>

              <div className="px-4">
                <div className="text-gray-500 text-sm">vs</div>
              </div>

              <div className="flex items-center">
                <div className="text-2xl font-bold ml-4 text-gray-400">0</div>
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center ml-3 opacity-50">
                  <div className="text-white text-xs font-bold">KT</div>
                </div>
              </div>
            </div>
          </div>

          {/* Game 3 */}
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-gray-600 text-sm">15(금) 오후 06:00</div>
                <div className="text-xs text-gray-500 mt-1">고척</div>
              </div>
              <div className="bg-cyan-500 text-white px-2 py-1 rounded text-xs">경기종료</div>
            </div>

            <div className="flex items-center justify-center">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center mr-3">
                  <div className="text-white text-xs font-bold">KT</div>
                </div>
                <div className="text-2xl font-bold mr-4">3</div>
              </div>

              <div className="px-4">
                <div className="text-gray-500 text-sm">패배</div>
              </div>

              <div className="flex items-center">
                <div className="text-2xl font-bold ml-4">5</div>
                <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center ml-3">
                  <div className="text-white text-xs font-bold">키움</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
