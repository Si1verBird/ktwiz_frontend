'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, MapPin, DollarSign, Save, AlertCircle } from 'lucide-react'
import Layout from '../../../../../components/Layout'
import { gameAPI } from '../../../../../lib/api'

export default function EditGamePage() {
  const router = useRouter()
  const params = useParams()
  const gameId = params.id

  const [formData, setFormData] = useState({
    date: '',
    hour: '',
    minute: '00',
    homeTeamId: '',
    awayTeamId: '', 
    status: 'scheduled',
    inning: 0,
    homeScore: 0,
    awayScore: 0,
    ticketPrice: 0
  })
  
  const [originalGame, setOriginalGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (gameId) {
      fetchGame()
    }
  }, [gameId])

  const fetchGame = async () => {
    try {
      setLoading(true)
      const game = await gameAPI.getGameById(gameId)
      
      // 날짜 형식 변환 (YYYY-MM-DDTHH:mm 형식으로)
      const gameDate = new Date(game.dateTime)
      const date = gameDate.toISOString().slice(0, 10) // YYYY-MM-DD
      const hour = gameDate.getHours().toString().padStart(2, '0')
      const minute = gameDate.getMinutes().toString().padStart(2, '0')
      
      setOriginalGame(game)
      setFormData({
        date,
        hour,
        minute,
        homeTeamId: game.homeTeam?.id || '',
        awayTeamId: game.awayTeam?.id || '',
        status: game.status || 'scheduled',
        inning: game.inning || 0,
        homeScore: game.homeScore || 0,
        awayScore: game.awayScore || 0,
        ticketPrice: game.ticketPrice || 0
      })
    } catch (error) {
      console.error('경기 정보 조회 실패:', error)
      setError('경기 정보를 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.date || !formData.hour) {
      setError('경기 일시를 입력해주세요.')
      return
    }

    try {
      setSaving(true)
      setError('')

      // ISO 형식으로 변환
      const gameData = {
        ...formData,
        dateTime: new Date(`${formData.date}T${formData.hour}:${formData.minute}:00`).toISOString(),
        inning: parseInt(formData.inning) || 0,
        homeScore: parseInt(formData.homeScore) || 0,
        awayScore: parseInt(formData.awayScore) || 0,
        ticketPrice: parseInt(formData.ticketPrice) || 0
      }

      await gameAPI.updateGame(gameId, gameData)
      
      alert('경기 정보가 성공적으로 수정되었습니다.')
      router.push('/admin/games')
      
    } catch (error) {
      console.error('경기 수정 실패:', error)
      setError('경기 수정에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSaving(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading) {
    return (
      <Layout>
        <div className="h-full bg-gray-50 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">경기 정보를 불러오는 중...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 */}
          <div className="mb-8">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              돌아가기
            </button>
            <h1 className="text-3xl font-bold text-gray-900">경기 수정</h1>
            <p className="mt-2 text-gray-600">경기 정보를 수정하세요</p>
          </div>

          {/* 기존 경기 정보 */}
          {originalGame && (
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-blue-900 mb-2">현재 경기 정보</h3>
              <p className="text-blue-800">
                {originalGame.homeTeam?.name} vs {originalGame.awayTeam?.name}
              </p>
              <p className="text-blue-700 text-sm">
                {new Date(originalGame.dateTime).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          )}

          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* 수정 폼 */}
          <div className="bg-white shadow-sm rounded-lg">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* 경기 일시 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4 inline mr-2" />
                  경기 일시
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {/* 날짜 */}
                  <div>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  
                  {/* 시간 */}
                  <div>
                    <select
                      name="hour"
                      value={formData.hour}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="">시간</option>
                      {Array.from({ length: 24 }, (_, i) => {
                        const hour = i.toString().padStart(2, '0')
                        return (
                          <option key={hour} value={hour}>
                            {hour}시
                          </option>
                        )
                      })}
                    </select>
                  </div>
                  
                  {/* 분 */}
                  <div>
                    <select
                      name="minute"
                      value={formData.minute}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="00">00분</option>
                      <option value="30">30분</option>
                    </select>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">시간은 00분 또는 30분만 선택 가능합니다</p>
              </div>

              {/* 경기 상태 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  경기 상태
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="scheduled">예정</option>
                  <option value="live">진행중</option>
                  <option value="ended">종료</option>
                </select>
              </div>

              {/* 이닝 정보 (진행중/종료인 경우만) */}
              {(formData.status === 'live' || formData.status === 'ended') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    이닝
                  </label>
                  <input
                    type="number"
                    name="inning"
                    value={formData.inning}
                    onChange={handleInputChange}
                    min="1"
                    max="15"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              )}

              {/* 점수 정보 (진행중/종료인 경우만) */}
              {(formData.status === 'live' || formData.status === 'ended') && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      홈팀 점수
                    </label>
                    <input
                      type="number"
                      name="homeScore"
                      value={formData.homeScore}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      원정팀 점수
                    </label>
                    <input
                      type="number"
                      name="awayScore"
                      value={formData.awayScore}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>
              )}

              {/* 티켓 가격 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="h-4 w-4 inline mr-2" />
                  티켓 가격 (원)
                </label>
                <input
                  type="number"
                  name="ticketPrice"
                  value={formData.ticketPrice}
                  onChange={handleInputChange}
                  min="0"
                  step="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* 버튼 */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      저장 중...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      수정 완료
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
