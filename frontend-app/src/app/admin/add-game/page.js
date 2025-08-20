'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Clock, MapPin, DollarSign } from 'lucide-react'
import Layout from '../../../components/Layout'
import { gameAPI, venueAPI } from '../../../lib/api'

export default function AddGamePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    dateTime: '',
    homeTeamId: '',
    awayTeamId: '',
    ticketPrice: '',
    status: 'scheduled',
    inning: 0,
    homeScore: 0,
    awayScore: 0
  })
  const [teams, setTeams] = useState([])
  
  // 팀 목록 가져오기
  useEffect(() => {
    fetchTeams()
  }, [])

  const fetchTeams = async () => {
    try {
      // 실제 백엔드에서 팀 목록을 가져와야 하지만, 임시로 DB에 있는 팀들로 설정
      const mockTeams = [
        { id: '1', name: 'KT wiz', shortName: 'kt' },
        { id: '2', name: 'LG 트윈스', shortName: 'LG' },
        { id: '3', name: '두산 베어스', shortName: '두산' },
        { id: '4', name: '삼성 라이온즈', shortName: '삼성' },
        { id: '5', name: '롯데 자이언츠', shortName: '롯데' },
        { id: '6', name: 'KIA 타이거즈', shortName: 'KIA' },
        { id: '7', name: 'SSG 랜더스', shortName: 'SSG' },
        { id: '8', name: 'NC 다이노스', shortName: 'NC' },
        { id: '9', name: '키움 히어로즈', shortName: '키움' },
        { id: '10', name: '한화 이글스', shortName: '한화' }
      ]
      setTeams(mockTeams)
    } catch (error) {
      console.error('팀 목록을 가져오는데 실패했습니다:', error)
    }
  }
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 팀과 경기장 매핑
  const teamVenueMapping = {
    '두산 베어스': '서울종합운동장 야구장',
    '삼성 라이온즈': '대구삼성라이온즈파크',
    'LG 트윈스': '서울종합운동장 야구장',
    'KIA 타이거즈': '광주기아챔피언스필드',
    '롯데 자이언츠': '사직야구장',
    'SSG 랜더스': '인천SSG랜더스필드',
    'NC 다이노스': '창원NC파크',
    '키움 히어로즈': '고척스카이돔',
    'kt 위즈': '수원kt위즈파크',
    'KT wiz': '수원kt위즈파크', // 별칭
    '한화 이글스': '대전한화생명이글스파크'
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    
    // 홈팀이 변경되면 자동으로 경기장 선택
    if (name === 'homeTeamName') {
      const homeVenueName = teamVenueMapping[value]
      const homeVenue = venues.find(venue => venue.name === homeVenueName)
      
      setFormData(prev => ({
        ...prev,
        [name]: value,
        venueId: homeVenue ? homeVenue.id : ''
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 날짜와 시간을 ISO 형식으로 변환
      const dateTimeValue = new Date(formData.dateTime).toISOString()
      
      const gameData = {
        dateTime: dateTimeValue,
        homeTeamName: formData.homeTeamName,
        awayTeamName: formData.awayTeamName,
        venueId: formData.venueId,
        ticketPrice: parseInt(formData.ticketPrice),
        status: formData.status
      }

      // 경기가 종료된 경우에만 점수와 이닝 정보 포함
      if (formData.status === 'ENDED') {
        gameData.inning = parseInt(formData.inning) || 9
        gameData.homeScore = parseInt(formData.homeScore) || 0
        gameData.awayScore = parseInt(formData.awayScore) || 0
      }

      await gameAPI.createGame(gameData)

      router.push('/')
    } catch (error) {
      setError('경기 생성 중 오류가 발생했습니다.')
      console.error('Error creating game:', error)
    } finally {
      setLoading(false)
    }
  }

  // teams 배열은 useState로 관리됨 (위에서 선언)

  const gameStatuses = [
    { value: 'SCHEDULED', label: '예정' },
    { value: 'LIVE', label: '진행중' },
    { value: 'ENDED', label: '종료' }
  ]

  return (
    <Layout>
      <div className="flex-1 bg-gray-50 overflow-y-auto min-h-0">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-4">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">경기 추가</h1>
          </div>
        </div>

        {/* Form */}
        <div className="p-4 pb-24">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 경기 일시 */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  경기 일시
                </label>
                <input
                  type="datetime-local"
                  name="dateTime"
                  value={formData.dateTime}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* 홈팀 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  홈팀
                </label>
                <select
                  name="homeTeamId"
                  value={formData.homeTeamId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">팀을 선택하세요</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </div>

              {/* 어웨이팀 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  어웨이팀
                </label>
                <select
                  name="awayTeamId"
                  value={formData.awayTeamId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">팀을 선택하세요</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
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
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  {gameStatuses.map(status => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 티켓 가격 */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 mr-2" />
                  티켓 가격 (원)
                </label>
                <input
                  type="number"
                  name="ticketPrice"
                  value={formData.ticketPrice}
                  onChange={handleInputChange}
                  required
                  min="0"
                  placeholder="예: 15000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {/* 경기 종료시에만 표시되는 필드들 */}
              {formData.status === 'ENDED' && (
                <>
                  {/* 이닝 */}
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
                      max="20"
                      placeholder="9"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">기본값: 9이닝</p>
                  </div>

                  {/* 점수 입력 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        어웨이팀 점수
                      </label>
                      <input
                        type="number"
                        name="awayScore"
                        value={formData.awayScore}
                        onChange={handleInputChange}
                        min="0"
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
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
                        placeholder="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* 오류 메시지 */}
              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* 제출 버튼 */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 py-3 px-4 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? '생성 중...' : '경기 생성'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  )
}
