'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, Eye, Calendar, Users, Trophy, AlertCircle, CheckCircle } from 'lucide-react'
import Layout from '../../../components/Layout'
import { gameAPI, standingAPI } from '../../../lib/api'

export default function GameManagementPage() {
  const router = useRouter()
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [statusFilter, setStatusFilter] = useState('all')

  useEffect(() => {
    fetchGames()
  }, [])

  const fetchGames = async () => {
    try {
      setLoading(true)
      const data = await gameAPI.getAllGames()
      setGames(data || [])
    } catch (error) {
      console.error('게임 목록 조회 실패:', error)
      setError('게임 목록을 불러오는데 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteGame = async (gameId) => {
    try {
      await gameAPI.deleteGame(gameId)
      await fetchGames() // 목록 새로고침
      
      // 통계 업데이트
      await standingAPI.refreshStandings()
      
      setDeleteConfirm(null)
      alert('경기가 성공적으로 삭제되었습니다.')
    } catch (error) {
      console.error('게임 삭제 실패:', error)
      alert('경기 삭제에 실패했습니다.')
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      scheduled: { text: '예정', color: 'bg-blue-100 text-blue-800' },
      live: { text: '진행중', color: 'bg-green-100 text-green-800' },
      ended: { text: '종료', color: 'bg-gray-100 text-gray-800' }
    }
    
    const badge = badges[status] || badges.scheduled
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        {badge.text}
      </span>
    )
  }

  const formatDateTime = (dateTime) => {
    return new Date(dateTime).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredGames = games.filter(game => {
    if (statusFilter === 'all') return true
    return game.status === statusFilter
  })

  if (loading) {
    return (
      <Layout>
        <div className="h-full bg-gray-50 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">경기 목록을 불러오는 중...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 */}
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">경기 관리</h1>
                <p className="mt-2 text-gray-600">경기 일정을 관리하고 결과를 업데이트하세요</p>
              </div>
              <button
                onClick={() => router.push('/admin/add-game')}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                새 경기 추가
              </button>
            </div>
          </div>

          {/* 필터 */}
          <div className="mb-6">
            <div className="flex space-x-4">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  statusFilter === 'all' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setStatusFilter('scheduled')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  statusFilter === 'scheduled' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                예정
              </button>
              <button
                onClick={() => setStatusFilter('live')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  statusFilter === 'live' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                진행중
              </button>
              <button
                onClick={() => setStatusFilter('ended')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  statusFilter === 'ended' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                종료
              </button>
            </div>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* 경기 목록 */}
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            {filteredGames.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">경기가 없습니다</h3>
                <p className="text-gray-500">새로운 경기를 추가해보세요.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        일시
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        경기
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        점수
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        티켓가격
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        관리
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredGames.map((game) => (
                      <tr key={game.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDateTime(game.dateTime)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <Users className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">
                                {game.homeTeam?.name} vs {game.awayTeam?.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {game.homeTeam?.shortName} vs {game.awayTeam?.shortName}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {game.status === 'ended' ? (
                            <span className="font-medium">
                              {game.homeScore} : {game.awayScore}
                            </span>
                          ) : game.status === 'live' ? (
                            <span className="font-medium text-green-600">
                              {game.homeScore} : {game.awayScore} ({game.inning}회)
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(game.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {game.ticketPrice?.toLocaleString()}원
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => router.push(`/admin/games/${game.id}`)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded"
                              title="상세보기"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => router.push(`/admin/games/${game.id}/edit`)}
                              className="text-indigo-600 hover:text-indigo-900 p-1 rounded"
                              title="수정"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(game)}
                              className="text-red-600 hover:text-red-900 p-1 rounded"
                              title="삭제"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <AlertCircle className="h-6 w-6 text-red-600 mr-3" />
              <h3 className="text-lg font-medium text-gray-900">경기 삭제</h3>
            </div>
            <p className="text-gray-600 mb-6">
              정말로 이 경기를 삭제하시겠습니까?<br />
              <strong>{deleteConfirm.homeTeam?.name} vs {deleteConfirm.awayTeam?.name}</strong><br />
              <span className="text-sm text-gray-500">
                {formatDateTime(deleteConfirm.dateTime)}
              </span>
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => handleDeleteGame(deleteConfirm.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}
