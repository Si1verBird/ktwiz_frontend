'use client'

import { useState } from 'react'
import axios from 'axios'

export default function Home() {
  const [message, setMessage] = useState('')
  const [response, setResponse] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      // 예시 API 호출 (실제 사용 시 적절한 엔드포인트로 변경)
      const result = await axios.post('/api/example', { message })
      setResponse(result.data.message)
    } catch (error) {
      setResponse('API 호출 중 오류가 발생했습니다.')
      console.error('API Error:', error)
    }
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Frontend App
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              프로젝트 정보
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li>• 프레임워크: Next.js 14</li>
              <li>• 패키지 매니저: npm</li>
              <li>• 스타일링: Tailwind CSS</li>
              <li>• API 통신: Axios</li>
              <li>• 라우팅: App Router</li>
              <li>• 번들러: TurboPack</li>
            </ul>
          </div>

          <div className="card">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">
              API 테스트
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  메시지
                </label>
                <input
                  type="text"
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="테스트 메시지를 입력하세요"
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                API 호출
              </button>
            </form>
            
            {response && (
              <div className="mt-4 p-3 bg-gray-100 rounded-md">
                <p className="text-sm text-gray-700">
                  <strong>응답:</strong> {response}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500">
            개발 서버를 시작하려면 <code className="bg-gray-200 px-2 py-1 rounded">npm run dev</code> 명령어를 실행하세요
          </p>
        </div>
      </div>
    </main>
  )
}
