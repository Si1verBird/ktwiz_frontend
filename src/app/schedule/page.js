'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Filter, X } from 'lucide-react'
import Layout from '../../components/Layout'
import { gameAPI, teamAPI } from '../../lib/api'

export default function SchedulePage() {
  const [games, setGames] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  // 필터 상태
  const [selectedTeams, setSelectedTeams] = useState([])
  const [selectedStatuses, setSelectedStatuses] = useState([])
  const [showFilters, setShowFilters] = useState(false)

  // KT Wiz ID
  const KT_WIZ_ID = '20000000-0000-0000-0000-000000000008'

  useEffect(() => {
    fetchTeams()
    fetchGamesWithFilter()
  }, [selectedTeams, selectedStatuses])

  const fetchTeams = async () => {
    try {
      const data = await teamAPI.getAllTeams()
      setTeams(data)
    } catch (error) {
      console.error('팀 정보를 가져오는데 실패했습니다:', error)
    }
  }

  const fetchGamesWithFilter = async () => {
    try {
      setLoading(true)
      let data
      
      // 기본값: KT Wiz가 참여하는 경기
      if (selectedTeams.length === 0 && selectedStatuses.length === 0) {
        data = await gameAPI.getGamesByFilter([KT_WIZ_ID], [])
      } else {
        data = await gameAPI.getGamesByFilter(selectedTeams, selectedStatuses)
      }
      
      setGames(data)
    } catch (error) {
      console.error('경기 정보를 가져오는데 실패했습니다:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTeamToggle = (teamId) => {
    setSelectedTeams(prev => {
      if (prev.includes(teamId)) {
        return prev.filter(id => id !== teamId)
      } else if (prev.length < 2) {
        return [...prev, teamId]
      }
      return prev
    })
  }

  const handleStatusToggle = (status) => {
    setSelectedStatuses(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status)
      } else {
        return [...prev, status]
      }
    })
  }

  const clearFilters = () => {
    setSelectedTeams([])
    setSelectedStatuses([])
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return {
      day: date.getDate(),
      weekday: ['일', '월', '화', '수', '목', '금', '토'][date.getDay()],
      time: date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      fullDate: date.toLocaleDateString('ko-KR')
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ended':
        return { text: '경기종료', color: 'bg-cyan-500' }
      case 'scheduled':
        return { text: '경기예정', color: 'bg-red-500' }
      case 'in_progress':
        return { text: '경기중', color: 'bg-green-500' }
      case 'postponed':
        return { text: '연기', color: 'bg-yellow-500' }
      case 'cancelled':
        return { text: '취소', color: 'bg-gray-500' }
      default:
        return { text: '알 수 없음', color: 'bg-gray-400' }
    }
  }

  const getResultText = (game) => {
    if (game.status !== 'ended') return 'vs'
    
    const ktWizId = '20000000-0000-0000-0000-000000000008'
    const isKtWizHome = game.homeTeam.id === ktWizId
    const ktWizScore = isKtWizHome ? game.homeScore : game.awayScore
    const opponentScore = isKtWizHome ? game.awayScore : game.homeScore
    
    if (ktWizScore > opponentScore) return '승리'
    else if (ktWizScore < opponentScore) return '패배'
    else return '무승부'
  }

  const getTeamColor = (teamName) => {
    const teamColors = {
      'KT Wiz': 'bg-black',
      'LG Twins': 'bg-red-600',
      'SSG Landers': 'bg-red-500',
      'Samsung Lions': 'bg-blue-600',
      'Doosan Bears': 'bg-green-600',
      'KIA Tigers': 'bg-red-700',
      'Lotte Giants': 'bg-red-400',
      'Hanwha Eagles': 'bg-orange-500',
      'NC Dinos': 'bg-blue-600',
      'Kiwoom Heroes': 'bg-yellow-600'
    }
    return teamColors[teamName] || 'bg-gray-500'
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex-1 bg-gray-50 overflow-y-auto flex items-center justify-center">
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
      <div className="flex-1 bg-gray-50 overflow-y-auto">
        {/* Header with Filter Button */}
        <div className="bg-white px-4 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ChevronLeft className="w-6 h-6 text-gray-400" />
              <div className="text-xl font-medium">
                {currentMonth.getFullYear()}.{currentMonth.getMonth() + 1}
              </div>
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm"
            >
              <Filter className="w-4 h-4" />
              <span>필터</span>
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white px-4 py-4 border-b border-gray-200">
            <div className="space-y-4">
              {/* Team Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  참여 팀 선택 (최대 2개)
                </h3>
                <div className="flex flex-wrap gap-2">
                  {teams.map((team) => (
                    <button
                      key={team.id}
                      onClick={() => handleTeamToggle(team.id)}
                      className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                        selectedTeams.includes(team.id)
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                      }`}
                      disabled={!selectedTeams.includes(team.id) && selectedTeams.length >= 2}
                    >
                      {team.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status Selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  경기 상태 선택
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'scheduled', label: '경기예정' },
                    { value: 'in_progress', label: '경기중' },
                    { value: 'ended', label: '경기종료' }
                  ].map((status) => (
                    <button
                      key={status.value}
                      onClick={() => handleStatusToggle(status.value)}
                      className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                        selectedStatuses.includes(status.value)
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-green-300'
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex items-center justify-between">
                <button
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  필터 초기화
                </button>
                <div className="text-sm text-gray-500">
                  {selectedTeams.length > 0 && `팀 ${selectedTeams.length}개 선택`}
                  {selectedTeams.length > 0 && selectedStatuses.length > 0 && ' / '}
                  {selectedStatuses.length > 0 && `상태 ${selectedStatuses.length}개 선택`}
                  {selectedTeams.length === 0 && selectedStatuses.length === 0 && 'KT Wiz 경기 표시 중'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Games List */}
        <div className="px-4 pt-4">
          {games.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {selectedTeams.length > 0 || selectedStatuses.length > 0 
                ? '필터 조건에 맞는 경기가 없습니다' 
                : '등록된 경기가 없습니다'}
            </div>
          ) : (
            games.map((game) => {
              const dateInfo = formatDate(game.dateTime)
              const statusBadge = getStatusBadge(game.status)
              const resultText = getResultText(game)
              
              return (
                <div key={game.id} className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-gray-600 text-sm">
                        {dateInfo.day}({dateInfo.weekday}) {dateInfo.time}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {game.venue?.name || '경기장 정보 없음'}
                      </div>
                    </div>
                    <div className={`${statusBadge.color} text-white px-2 py-1 rounded text-xs`}>
                      {statusBadge.text}
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 ${getTeamColor(game.awayTeam.name)} rounded-full flex items-center justify-center mr-3`}>
                        <div className="text-white text-xs font-bold">
                          {game.awayTeam.shortName || game.awayTeam.name.slice(0, 2)}
                        </div>
                      </div>
                      <div className={`text-2xl font-bold mr-4 ${game.status === 'ended' ? '' : 'text-gray-400'}`}>
                        {game.status === 'ended' ? game.awayScore : '0'}
                      </div>
                    </div>

                    <div className="px-4">
                      <div className="text-gray-500 text-sm">{resultText}</div>
                    </div>

                    <div className="flex items-center">
                      <div className={`text-2xl font-bold ml-4 ${game.status === 'ended' ? '' : 'text-gray-400'}`}>
                        {game.status === 'ended' ? game.homeScore : '0'}
                      </div>
                      <div className={`w-12 h-12 ${getTeamColor(game.homeTeam.name)} rounded-full flex items-center justify-center ml-3`}>
                        <div className="text-white text-xs font-bold">
                          {game.homeTeam.shortName || game.homeTeam.name.slice(0, 2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </Layout>
  )
}
