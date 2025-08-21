'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronRight, Ticket, ChevronLeft, Search, LogIn } from 'lucide-react'
import Layout from '../components/Layout'
import { ImageWithFallback } from '../components/ImageWithFallback'
import { gameAPI, standingAPI, postAPI } from '../lib/api'

export default function HomePage() {
  const router = useRouter()
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
    if (!mounted) return // 마운트 후에만 데이터 로드
    fetchData()
  }, [mounted])

  const fetchData = async () => {
    console.log('🔍 [DEBUG] 데이터 로딩 시작')
    setLoading(true)
    try {
      console.log('🔍 [DEBUG] API 호출 시작...')
      await Promise.all([
        fetchNextGame(),
        fetchKtWizLatestGame(),
        fetchTeamStanding(),
        fetchRecentPosts()
      ])
      console.log('🔍 [DEBUG] API 호출 완료')
      // 기본 슬라이드 설정
      // setNewsSlides(getDefaultSlides()) 
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
    console.log('🔍 [DEBUG] KT Wiz 최근 경기 조회 시작 - 현재 시간:', new Date().toISOString())
    try {
      // 캐시 버스팅을 위해 타임스탬프 추가
      const data = await gameAPI.getKtWizLatestGame()
      console.log('🔍 [DEBUG] KT Wiz 최근 경기 조회 성공:', data)
      console.log('🔍 [DEBUG] 경기 날짜:', data?.dateTime)
      console.log('🔍 [DEBUG] 경기 상태:', data?.status)
      console.log('🔍 [DEBUG] 홈팀:', data?.homeTeam?.name, '로고:', data?.homeTeam?.logoUrl)
      console.log('🔍 [DEBUG] 원정팀:', data?.awayTeam?.name, '로고:', data?.awayTeam?.logoUrl)
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
      const data = await postAPI.getRecentPosts(3)
      // 게시물이 있으면 슬라이드 생성
      if (data && data.length > 0) {
        const slides = data.map((post, index) => ({
          id: post.id,
          title: post.title,
          content: post.body?.substring(0, 100) + '...' || '',
          image: post.thumbnail || `bg-gradient-to-r ${index % 3 === 0 ? 'from-red-400 to-pink-400' : index % 3 === 1 ? 'from-blue-400 to-purple-400' : 'from-green-400 to-blue-400'}`,
          tag: post.category === 'news' ? '뉴스' : post.category === 'highlight' ? '하이라이트' : post.category === 'story' ? '일반' : '소식'
        }))
        setNewsSlides(slides)
      } else {
        // 게시물이 없으면 빈 배열
        setNewsSlides([])
      }
    } catch (error) {
      console.error('게시물 정보를 가져오는데 실패했습니다:', error)
      setNewsSlides([])
    }
  }

  const getDefaultSlides = () => []

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }

  if (!mounted || loading) {
    return (
      <Layout>
        <div className="bg-gray-50 pb-24 flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{!mounted ? "로딩 중..." : "데이터를 불러오는 중..."}</p>
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
            {user ? (
              <div className="flex flex-col items-end space-y-1">
                <button 
                  onClick={handleLogout}
                  className="text-xs px-3 py-1 rounded bg-white/20 backdrop-blur-sm hover:bg-white/30"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button 
                onClick={() => router.push('/login')}
                className="flex items-center text-xs px-3 py-1 rounded bg-white/20 backdrop-blur-sm hover:bg-white/30"
              >
                <LogIn className="w-3 h-3 mr-1" />
                로그인
              </button>
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
            {user ? (
              user.is_admin ? (
                <button 
                  onClick={() => router.push("/schedule")}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center space-x-2"
                >
                  <Search className="w-6 h-6 text-white" />
                  <span className="text-sm">경기 관리(관리자용)</span>
                </button>
              ) : (
                <button 
                  onClick={() => router.push("/my-wiz")}
                  className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center space-x-2"
                >
                  <Search className="w-6 h-6 text-white" />
                  <span className="text-sm">MY위즈</span>
                </button>
              )
            ) : (
              <button 
                onClick={() => router.push("/login")}
                className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center space-x-2"
              >
                <LogIn className="w-6 h-6 text-white" />
                <span className="text-sm">로그인</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Season Status Section */}
      <div className="px-4 pt-4">
        <div className="relative rounded-2xl h-54 overflow-hidden">
          {/* 배경 이미지 */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: 'url(https://cdnweb01.wikitree.co.kr/webdata/editor/202410/03/img_20241003174617_400e0cfe.webp)',
              backgroundPosition: 'center 30%'
            }}
          ></div>
          
          {/* 어두운 필터 */}
          <div className="absolute inset-0 bg-black/60"></div>
          
          {/* 컨텐츠 */}
          <div className="relative h-full flex items-center p-6 text-white">
            <div className="flex items-center justify-between w-full">
              {/* Left Side - Baseball (스위치됨) */}
              <div className="w-20 h-20 flex items-center justify-center">
                <img 
                  src="https://i.namu.wiki/i/1I_O46xxWGvTC-arPbfuBwaYgmd0I9gOCfTSchy5Hf5zZ-blf38j7boUFED_abbT5R8Qsj_Ynb-b7x4zxPk4HQ.svg" 
                  alt="Baseball Icon"
                  className="w-16 h-16 filter invert"
                />
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

              {/* Right Side - Team Ranking (스위치됨) */}
              <div className="flex flex-col">
                <div className="text-sm text-white/80 mb-2">팀 순위</div>
                <div className="flex items-baseline space-x-1">
                  <div className="text-5xl font-bold">{teamStanding?.rank || '-'}</div>
                  <div className="text-lg">위</div>
                </div>
              </div>
            </div>
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
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2">
                    {ktWizLatestGame.awayTeam?.logoUrl ? (
                      <img 
                        src={ktWizLatestGame.awayTeam.logoUrl} 
                        alt={ktWizLatestGame.awayTeam.name}
                        className="w-14 h-14 object-contain"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                        <div className="text-white font-bold text-xs text-center">
                          {ktWizLatestGame.awayTeam?.shortName || ktWizLatestGame.awayTeam?.name?.slice(0, 3) || 'TBD'}
                        </div>
                      </div>
                    )}
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
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2">
                    {ktWizLatestGame.homeTeam?.logoUrl ? (
                      <img 
                        src={ktWizLatestGame.homeTeam.logoUrl} 
                        alt={ktWizLatestGame.homeTeam.name}
                        className="w-14 h-14 object-contain"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                        <div className="text-white font-bold text-xs text-center">
                          {ktWizLatestGame.homeTeam?.shortName || ktWizLatestGame.homeTeam?.name?.slice(0, 3) || 'TBD'}
                        </div>
                      </div>
                    )}
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
            {user?.is_admin && (
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



      {/* News Slider Section */}
      <div className="px-4 pt-6 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">wiz 소식</h3>
          <button 
            onClick={() => router.push("/wiz-talk")}
            className="flex items-center text-gray-500 text-sm hover:text-gray-700 transition-colors"
          >
            더보기 <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {newsSlides.length > 0 ? (
          <div className="space-y-4">
            {newsSlides.map((slide) => (
              <div key={slide.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-start space-x-4">
                  {/* 썸네일 이미지 또는 기본 아이콘 */}
                  <div className="flex-shrink-0">
                    {slide.image && slide.image.startsWith('http') ? (
                      <img 
                        src={slide.image} 
                        alt={slide.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className={`w-16 h-16 ${slide.image} rounded-lg flex items-center justify-center`}>
                        <div className="text-white font-bold text-xs text-center">
                          {slide.tag?.charAt(0) || 'W'}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* 게시물 내용 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        slide.tag === '뉴스' ? 'bg-blue-100 text-blue-800' :
                        slide.tag === '하이라이트' ? 'bg-red-100 text-red-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {slide.tag}
                      </span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {slide.title}
                    </h4>
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                      {slide.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="text-gray-500 text-lg">아직 게시물이 없습니다.</div>
            <p className="text-gray-400 text-sm mt-2">새로운 소식을 기다려주세요!</p>
          </div>
        )}
      </div>
      </div>
    </Layout>
  )
}
