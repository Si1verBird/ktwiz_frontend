'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Filter, X } from 'lucide-react'
import Layout from '../../components/Layout'
import { gameAPI, teamAPI } from '../../lib/api'
import { useRouter } from 'next/navigation'

export default function SchedulePage() {
  const [games, setGames] = useState([])
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  
  // 새로운 필터 상태
  const [showKtWizOnly, setShowKtWizOnly] = useState(true)
  const [showPastGamesOnly, setShowPastGamesOnly] = useState(true)
  
  // 사용자 정보
  const [user, setUser] = useState(null)
  
  // 삭제 확인 상태
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, gameId: null, gameName: '' })

  // KT Wiz ID
  const KT_WIZ_ID = '20000000-0000-0000-0000-000000000008'

  const router = useRouter()

  useEffect(() => {
    // 사용자 정보 로드
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    
    fetchTeams()
    fetchGamesWithFilter()
  }, [showKtWizOnly, showPastGamesOnly])

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
      
      // 필터 조건 설정
      const teamsToFilter = showKtWizOnly ? [KT_WIZ_ID] : []
      const statusesToFilter = showPastGamesOnly ? ['ended'] : []
      
      const data = await gameAPI.getGamesByFilter(teamsToFilter, statusesToFilter)
      setGames(data || [])
    } catch (error) {
      console.error('경기 정보를 가져오는데 실패했습니다:', error)
      setGames([])
    } finally {
      setLoading(false)
    }
  }

  const toggleKtWizOnly = () => {
    setShowKtWizOnly(!showKtWizOnly)
  }

  const togglePastGamesOnly = () => {
    setShowPastGamesOnly(!showPastGamesOnly)
  }

  const handleDeleteGame = (gameId, gameName) => {
    setDeleteConfirm({ show: true, gameId, gameName })
  }

  const confirmDelete = async () => {
    try {
      await gameAPI.deleteGame(deleteConfirm.gameId)
      // 삭제 후 경기 목록 새로고침
      fetchGamesWithFilter()
      setDeleteConfirm({ show: false, gameId: null, gameName: '' })
    } catch (error) {
      console.error('경기 삭제 실패:', error)
      alert('경기 삭제에 실패했습니다.')
    }
  }

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, gameId: null, gameName: '' })
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
            <div className="flex items-center space-x-3">
              {/* 관리자 경기 추가 버튼 */}
              {user?.is_admin && (
                <button
                  onClick={() => router.push('/admin/add-game')}
                  className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-600 transition-colors"
                >
                  경기 추가
                </button>
              )}
              
              {/* KT Wiz만 보기 토글 */}
              <button
                onClick={toggleKtWizOnly}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  showKtWizOnly 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                KT wiz만 보기
              </button>
              
              {/* 지난 경기만 보기 토글 */}
              <button
                onClick={togglePastGamesOnly}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  showPastGamesOnly 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                }`}
              >
                지난 경기만 보기
              </button>
            </div>
          </div>
        </div>



        {/* Games List */}
        <div className="px-4 pt-4">
          {games.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {(!showKtWizOnly || !showPastGamesOnly)
                ? '필터 조건에 맞는 경기가 없습니다' 
                : '등록된 경기가 없습니다'}
            </div>
          ) : (
            games.map((game) => {
              const dateInfo = formatDate(game.dateTime)
              const statusBadge = getStatusBadge(game.status)
              const resultText = getResultText(game)
              
              return (
                <div key={game.id} className="bg-white rounded-2xl p-4 mb-4 shadow-sm relative">
                  {/* 관리자 버튼들 */}
                  {user?.is_admin && (
                    <div className="absolute top-3 right-3 flex space-x-2">
                      {/* 수정 버튼 */}
                      <button
                        onClick={() => router.push(`/admin/games/${game.id}/edit`)}
                        className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                        title="경기 수정"
                      >
                        ✎
                      </button>
                      {/* 삭제 버튼 */}
                      <button
                        onClick={() => handleDeleteGame(game.id, `${game.awayTeam.name} vs ${game.homeTeam.name}`)}
                        className="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        title="경기 삭제"
                      >
                        ×
                      </button>
                    </div>
                  )}
                  
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

      {/* 삭제 확인 다이얼로그 */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">경기 삭제 확인</h3>
            <p className="text-gray-600 mb-6">
              <strong>{deleteConfirm.gameName}</strong> 경기를 삭제하시겠습니까?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
              >
                삭제
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
