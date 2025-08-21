'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, Ticket, ChevronLeft, Search, LogIn } from 'lucide-react'
import Layout from '../components/Layout'
import { ImageWithFallback } from '../components/ImageWithFallback'
import { gameAPI, standingAPI, postAPI } from '../lib/api'

export default function HomePage() {
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [user, setUser] = useState(null) // 로그인한 사용자 정보
  const [nextGame, setNextGame] = useState(null)
  const [ktWizLatestGame, setKtWizLatestGame] = useState(null) // KT Wiz 최근 종료된 경기
  const [teamStanding, setTeamStanding] = useState(null)
  const [newsSlides, setNewsSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false) // Hydration 에러 방지용

  // 컴포넌트 마운트 확인 (Hydration 에러 방지)
  useEffect(() => {
    setMounted(true)
    console.log('🔍 [DEBUG] 컴포넌트 마운트 완료')
  }, [])

  // 로그인 상태 확인
  useEffect(() => {
    if (!mounted) return // 마운트 전에는 실행하지 않음
    
    console.log('🔍 [DEBUG] 로그인 상태 확인 시작')
    try {
      const userData = localStorage.getItem('user')
      console.log('🔍 [DEBUG] localStorage userData:', userData)
      if (userData) {
        const parsedUser = JSON.parse(userData)
        console.log('🔍 [DEBUG] 파싱된 사용자 정보:', parsedUser)
        setUser(parsedUser)
      } else {
        console.log('🔍 [DEBUG] 로그인된 사용자 없음')
      }
    } catch (error) {
      console.error('🔍 [DEBUG] 로그인 상태 확인 오류:', error)
    }
  }, [mounted])

  // 데이터 로드
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    console.log('🔍 [DEBUG] 데이터 로딩 시작')
    setLoading(true)
    try {
      console.log('🔍 [DEBUG] API 호출 시작...')
      await Promise.all([
        fetchNextGame(),
        fetchKtWizLatestGame(),
        fetchTeamStanding(),
        // fetchRecentPosts() // 임시로 비활성화
      ])
      console.log('🔍 [DEBUG] API 호출 완료')
      // 기본 슬라이드 설정
      setNewsSlides(getDefaultSlides())
      console.log('🔍 [DEBUG] 기본 슬라이드 설정 완료')
    } catch (error) {
      console.error('🔍 [DEBUG] 데이터 로딩 실패:', error)
    } finally {
      setLoading(false)
      console.log('🔍 [DEBUG] 로딩 상태 해제')
    }
  }

  const fetchNextGame = async () => {
    console.log('🔍 [DEBUG] 다음 경기 정보 조회 시작')
    try {
      const data = await gameAPI.getNextGame()
      console.log('🔍 [DEBUG] 다음 경기 정보 조회 성공:', data)
      setNextGame(data)
    } catch (error) {
      console.error('🔍 [DEBUG] 경기 정보를 가져오는데 실패했습니다:', error)
      setNextGame(null)
    }
  }

  const fetchKtWizLatestGame = async () => {
    console.log('🔍 [DEBUG] KT Wiz 최근 경기 조회 시작')
    try {
      const data = await gameAPI.getKtWizLatestGame()
      console.log('🔍 [DEBUG] KT Wiz 최근 경기 조회 성공:', data)
      setKtWizLatestGame(data)
    } catch (error) {
      console.error('🔍 [DEBUG] KT Wiz 최근 경기 정보를 가져오는데 실패했습니다:', error)
      setKtWizLatestGame(null)
    }
  }

  const fetchTeamStanding = async () => {
    console.log('🔍 [DEBUG] KT Wiz 팀 순위 조회 시작')
    try {
      const data = await standingAPI.getKtWizStanding()
      console.log('🔍 [DEBUG] KT Wiz 팀 순위 조회 성공:', data)
      setTeamStanding(data)
    } catch (error) {
      console.error('🔍 [DEBUG] 팀 순위 정보를 가져오는데 실패했습니다:', error)
    }
  }

  const fetchRecentPosts = async () => {
    try {
      const data = await postAPI.getRecentAdminPosts(3)
      // 게시물이 없으면 기본 슬라이드 사용
      if (data && data.length > 0) {
        const slides = data.map((post, index) => ({
          id: post.id,
          title: post.title,
          content: post.body?.substring(0, 100) + '...' || '',
          image: `bg-gradient-to-r ${index % 3 === 0 ? 'from-red-400 to-pink-400' : index % 3 === 1 ? 'from-blue-400 to-purple-400' : 'from-green-400 to-blue-400'}`,
          tag: post.category === 'news' ? '뉴스' : post.category === 'highlight' ? '하이라이트' : '소식'
        }))
        setNewsSlides(slides)
      } else {
        // 기본 슬라이드 설정
        setNewsSlides(getDefaultSlides())
      }
    } catch (error) {
      console.error('게시물 정보를 가져오는데 실패했습니다:', error)
      setNewsSlides(getDefaultSlides())
    }
  }

  const getDefaultSlides = () => [
    {
      id: 1,
      title: "KT wiz 8월 홈경기 티켓 오픈!",
      content: "8월 홈경기 티켓이 오픈되었습니다. 지금 바로 예매하세요!",
      image: "bg-gradient-to-r from-red-400 to-pink-400",
      tag: "티켓 오픈"
    },
    {
      id: 2,
      title: "선수단 응원 이벤트",
      content: "우리 선수들을 위한 특별한 응원 이벤트에 참여해보세요.",
      image: "bg-gradient-to-r from-blue-400 to-purple-400",
      tag: "이벤트"
    },
    {
      id: 3,
      title: "위즈파크 새로운 먹거리",
      content: "위즈파크에 새로운 먹거리가 추가되었습니다.",
      image: "bg-gradient-to-r from-green-400 to-blue-400",
      tag: "맛집"
    }
  ]

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }

  if (loading) {
    return (
      <Layout>
        <div className="bg-gray-50 pb-24 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="bg-gray-50 pb-24">      {/* Gradient Card */}
      <div className="px-4 pt-4">
        <div className="bg-gradient-to-r from-pink-400 via-purple-500 to-blue-400 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-2xl mb-2">
                  {user ? `${user.nickname}님` : '게스트님'}
                </div>
                <div className="text-lg">오늘도 함께 응원해요!</div>
              </div>
                          {/* 로그인/로그아웃 버튼 */}
            {mounted && user ? (
              <div className="flex flex-col items-end space-y-1">
                {user.isAdmin && (
                  <span className="text-xs px-2 py-1 rounded bg-white/30 backdrop-blur-sm">
                    관리자
                  </span>
                )}
                <button 
                  onClick={handleLogout}
                  className="text-xs px-3 py-1 rounded bg-white/20 backdrop-blur-sm hover:bg-white/30"
                >
                  로그아웃
                </button>
              </div>
            ) : mounted ? (
              <button 
                onClick={() => router.push('/login')}
                className="flex items-center text-xs px-3 py-1 rounded bg-white/20 backdrop-blur-sm hover:bg-white/30"
              >
                <LogIn className="w-3 h-3 mr-1" />
                로그인
              </button>
            ) : (
              <div className="text-xs px-3 py-1 text-white/50">로딩중...</div>
            )}
            </div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
            <div className="w-full h-full bg-white rounded-full transform translate-x-8 -translate-y-8"></div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button 
              onClick={() => router.push("/ticket-booking")}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center space-x-2"
            >
              <Ticket className="w-6 h-6 text-white" />
              <span className="text-sm">티켓예매</span>
            </button>
            
            {/* 로그인 상태에 따라 다른 버튼 표시 */}
            {mounted && user ? (
              <button 
                onClick={() => router.push("/my-wiz")}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center space-x-2"
              >
                <Search className="w-6 h-6 text-white" />
                <span className="text-sm">MY위즈</span>
              </button>
            ) : mounted ? (
              <button 
                onClick={() => router.push("/login")}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center space-x-2"
              >
                <LogIn className="w-6 h-6 text-white" />
                <span className="text-sm">로그인</span>
              </button>
            ) : (
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center space-x-2">
                <div className="w-6 h-6 bg-white/30 rounded animate-pulse"></div>
                <div className="w-12 h-4 bg-white/30 rounded animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Game Schedule Section */}
      <div className="px-4 pt-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
          {/* Gradient Title */}
          <div className="mb-4">
            <h3 className="text-2xl bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent italic">
              game schedule
            </h3>
          </div>

          {/* Date and Time */}
          <div className="flex items-center justify-between mb-6">
            <ChevronLeft className="w-5 h-5 text-gray-400" />
            <div className="text-center">
              {ktWizLatestGame ? (
                <>
                  <div className="text-lg font-medium">
                    {new Date(ktWizLatestGame.dateTime).toLocaleDateString('ko-KR')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(ktWizLatestGame.dateTime).toLocaleDateString('ko-KR', { weekday: 'short' })} {' '}
                    {new Date(ktWizLatestGame.dateTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-xs text-red-500 mt-1">종료된 경기</div>
                </>
              ) : (
                <>
                  <div className="text-lg font-medium">경기 정보 없음</div>
                  <div className="text-sm text-gray-500">KT Wiz 경기 기록을 확인해주세요</div>
                </>
              )}
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          {/* Teams and Score */}
          <div className="flex items-center justify-center mb-6">
            {ktWizLatestGame ? (
              <>
                {/* Away Team */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-2">
                    <div className="text-white font-bold text-xs text-center">
                      {ktWizLatestGame.awayTeam?.shortName || ktWizLatestGame.awayTeam?.name?.slice(0, 3) || 'TBD'}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{ktWizLatestGame.awayTeam?.name || 'TBD'}</div>
                </div>

                {/* Score */}
                <div className="flex items-center mx-8">
                  <div className="text-4xl font-bold text-gray-800">{ktWizLatestGame.awayScore}</div>
                  <div className="text-2xl text-gray-400 mx-3">:</div>
                  <div className="text-4xl font-bold text-gray-800">{ktWizLatestGame.homeScore}</div>
                </div>

                {/* Home Team */}
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-2">
                    <div className="text-white font-bold text-xs text-center">
                      {ktWizLatestGame.homeTeam?.shortName || ktWizLatestGame.homeTeam?.name?.slice(0, 3) || 'TBD'}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">{ktWizLatestGame.homeTeam?.name || 'TBD'}</div>
                </div>
              </>
            ) : (
              <div className="text-gray-500">경기 정보가 없습니다</div>
            )}
          </div>

          {/* Game Status Button */}
          <div className="flex justify-center space-x-3">
            <button 
              onClick={() => router.push("/schedule")}
              className="bg-gray-400 text-white px-6 py-2 rounded-lg text-sm"
            >
              경기보기 &gt;
            </button>
            
            {/* 관리자 경기 추가 버튼 */}
            {mounted && user?.isAdmin && (
              <button 
                onClick={() => router.push("/admin/add-game")}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg text-sm transition-colors"
              >
                경기 추가
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Season Status Section */}
      <div className="px-4 pt-4">
        <div className="bg-gradient-to-r from-red-400 via-purple-500 to-blue-400 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="flex items-center justify-between">
            {/* Left Side - Team Ranking */}
            <div className="flex flex-col">
              <div className="text-sm text-white/80 mb-2">팀 순위</div>
              <div className="flex items-baseline space-x-1">
                <div className="text-5xl font-bold">{teamStanding?.rank || '-'}</div>
                <div className="text-lg">위</div>
              </div>
            </div>

            {/* Center - Season Record */}
            <div className="flex-1 text-center px-4">
              {teamStanding ? (
                <>
                  <div className="text-xl font-medium mb-2">
                    {teamStanding.wins}승 {teamStanding.losses}패
                  </div>
                  <div className="text-sm text-white/90">
                    총 {teamStanding.gamesPlayed}경기, 승률 {teamStanding.winRate.toFixed(3)}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xl font-medium mb-2">시즌 기록</div>
                  <div className="text-sm text-white/90">데이터 로딩 중...</div>
                </>
              )}
            </div>

            {/* Right Side - Baseball */}
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* News Slider Section */}
      <div className="px-4 pt-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg">wiz 소식</h3>
          <button 
            onClick={() => router.push("/wiz-talk")}
            className="flex items-center text-gray-500 text-sm"
          >
            더보기 <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {newsSlides.map((slide, index) => (
                <div key={slide.id} className="w-full flex-shrink-0">
                  <div className={`${slide.image} rounded-2xl h-48 flex items-center justify-center relative overflow-hidden`}>
                    <div className="text-center text-white relative z-10">
                      <div className="bg-white/20 text-white px-3 py-1 rounded text-xs mb-4 inline-block">
                        {slide.tag}
                      </div>
                      <div className="text-xl font-bold mb-2">{slide.title}</div>
                      <div className="text-sm px-4">{slide.content}</div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

          {/* Slide indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {newsSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  currentSlide === index ? 'bg-red-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      </div>
    </Layout>
  )
}
