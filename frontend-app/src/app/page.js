'use client'

import { useState } from 'react'
import { 
  Home, 
  Calendar, 
  MessageCircle, 
  Bell, 
  Menu, 
  ChevronRight, 
  Bot, 
  Ticket, 
  ChevronLeft, 
  User,
  Search,
  Send,
  Heart,
  Share2,
  MoreHorizontal
} from 'lucide-react'
import { ImageWithFallback } from '../components/ImageWithFallback'

export default function KTWizApp() {
  const [activeTab, setActiveTab] = useState("메인")
  const [currentSlide, setCurrentSlide] = useState(0)
  const [chatMessages, setChatMessages] = useState([
    { id: 1, text: "안녕하세요! 빅또리 비서입니다. 어떻게 도와드릴까요?", isBot: true, time: "14:30" }
  ])
  const [newMessage, setNewMessage] = useState("")

  // Mock data for news slides
  const newsSlides = [
    {
      id: 1,
      title: "KT wiz 8월 홈경기 티켓 오픈!",
      content: "8월 홈경기 티켓이 오픈되었습니다. 지금 바로 예매하세요!",
      image: "bg-red-500",
      tag: "티켓 오픈"
    },
    {
      id: 2,
      title: "선수단 응원 이벤트",
      content: "우리 선수들을 위한 특별한 응원 이벤트에 참여해보세요.",
      image: "bg-blue-500",
      tag: "이벤트"
    },
    {
      id: 3,
      title: "위즈파크 새로운 먹거리",
      content: "위즈파크에 새로운 먹거리가 추가되었습니다.",
      image: "bg-green-500",
      tag: "맛집"
    }
  ]

  // Mock posts for WizTalk
  const posts = [
    {
      id: 1,
      author: "KT wiz 공식",
      isOfficial: true,
      time: "2시간 전",
      content: "🏆 KT wiz가 오늘 경기에서 승리했습니다! 팬 여러분의 응원 덕분입니다. 다음 경기도 많은 응원 부탁드립니다! #KTwiz #승리 #감사",
      likes: 245,
      comments: 67,
      image: "bg-gradient-to-r from-red-400 to-pink-400"
    },
    {
      id: 2,
      author: "야구사랑",
      isOfficial: false,
      time: "4시간 전",
      content: "오늘 경기 정말 짜릿했어요! 9회 역전승 너무 감동적이었습니다 ㅠㅠ 위즈 파이팅!",
      likes: 89,
      comments: 23,
      image: "bg-gray-600"
    }
  ]

  const MainScreen = () => (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      {/* KT Wiz Banner */}
      <div className="px-4 pt-4">
        <div className="bg-black rounded-2xl p-4 flex items-center">
          <div className="flex-1">
            <div className="text-white text-xs mb-1">
              지금 바로 100원 고객센터!
            </div>
            <div className="text-red-500 font-bold text-lg">
              Y덤석 예매권 제공!
            </div>
          </div>
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Gradient Card */}
      <div className="px-4 pt-4">
        <div className="bg-gradient-to-r from-pink-400 via-purple-500 to-blue-400 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-2xl mb-2">허은세님</div>
            <div className="text-lg">오늘도 함께 응원해요!</div>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 opacity-20">
            <div className="w-full h-full bg-white rounded-full transform translate-x-8 -translate-y-8"></div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            <button 
              onClick={() => setActiveTab("티켓예매")}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center space-x-2"
            >
              <Ticket className="w-6 h-6 text-white" />
              <span className="text-sm">티켓예매</span>
            </button>
            <button 
              onClick={() => setActiveTab("MY위즈")}
              className="bg-white/20 backdrop-blur-sm rounded-xl p-3 flex items-center space-x-2"
            >
              <Search className="w-6 h-6 text-white" />
              <span className="text-sm">예매확인</span>
            </button>
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
              <div className="text-lg font-medium">2025.8.19</div>
              <div className="text-sm text-gray-500">수일 18:30</div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>

          {/* Teams and Score */}
          <div className="flex items-center justify-center mb-6">
            {/* SSG Team */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mb-2">
                <div className="text-white font-bold text-sm">SSG</div>
              </div>
              <div className="text-sm text-gray-600">SSG</div>
            </div>

            {/* Score */}
            <div className="flex items-center mx-8">
              <div className="text-4xl font-bold text-gray-800">0</div>
              <div className="text-2xl text-gray-400 mx-3">:</div>
              <div className="text-4xl font-bold text-gray-800">0</div>
            </div>

            {/* KT Team */}
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mb-2">
                <div className="text-white font-bold text-sm">KT</div>
              </div>
              <div className="text-sm text-gray-600">KT</div>
            </div>
          </div>

          {/* Game Status Button */}
          <div className="flex justify-center">
            <button 
              onClick={() => setActiveTab("일정/결과")}
              className="bg-gray-400 text-white px-6 py-2 rounded-lg text-sm"
            >
              경기보기 &gt;
              </button>
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
                <div className="text-5xl font-bold">5</div>
                <div className="text-lg">위</div>
              </div>
            </div>

            {/* Center - Season Record */}
            <div className="flex-1 text-center px-4">
              <div className="text-xl font-medium mb-2">55승 55패 4무</div>
              <div className="text-sm text-white/90">총 114경기, 승률 0.500</div>
            </div>

            {/* Right Side - Baseball */}
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <div className="w-12 h-12 bg-white rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* News Slider Section */}
      <div className="px-4 pt-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg">wiz 소식</h3>
          <button 
            onClick={() => setActiveTab("위즈톡")}
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
  )

  const TicketBookingScreen = () => (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center text-gray-500">
        <Ticket className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <div className="text-lg mb-2">티켓 예매</div>
        <div className="text-sm">준비 중입니다</div>
      </div>
    </div>
  )

  const ChatScreen = () => {
    const handleSendMessage = () => {
      if (newMessage.trim()) {
        const userMessage = {
          id: chatMessages.length + 1,
          text: newMessage,
          isBot: false,
          time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
        }
        
        setChatMessages([...chatMessages, userMessage])
        setNewMessage("")
        
        // Bot response simulation
        setTimeout(() => {
          const botResponse = {
            id: chatMessages.length + 2,
            text: "네, 무엇을 도와드릴까요? KT wiz 관련 정보, 티켓 예매, 경기 일정 등 궁금한 것이 있으시면 언제든 말씀해주세요!",
            isBot: true,
            time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
          }
          setChatMessages(prev => [...prev, botResponse])
        }, 1000)
      }
    }

    return (
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-red-500 to-pink-500 px-4 py-4 text-white">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setActiveTab("메인")}
              className="p-1"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="font-medium">빅또리 비서</div>
              <div className="text-sm text-white/80">온라인</div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.isBot 
                  ? 'bg-gray-100 text-gray-800' 
                  : 'bg-red-500 text-white'
              }`}>
                <div className="text-sm">{message.text}</div>
                <div className={`text-xs mt-1 ${
                  message.isBot ? 'text-gray-500' : 'text-white/70'
                }`}>
                  {message.time}
                </div>
              </div>
            </div>
          ))}
          </div>

        {/* Chat Input */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center space-x-2">
                <input
                  type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="메시지를 입력하세요..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-red-500"
            />
            <button
              onClick={handleSendMessage}
              className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  const MyWizScreen = () => (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="px-4 pt-4 pb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg">티켓 보관함</h3>
          <button className="flex items-center text-gray-500 text-sm">
            전체보기 <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Active Tickets */}
        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-3">사용 가능한 티켓</div>
          
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-red-500 font-medium">KT wiz vs LG 트윈스</div>
              <div className="bg-red-500 text-white px-2 py-1 rounded text-xs">사용가능</div>
            </div>
            <div className="text-gray-600 text-sm mb-1">2025.08.23 (금) 18:30</div>
            <div className="text-gray-500 text-xs mb-3">수원 KT위즈파크 • 1루 응원석 207구역</div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">좌석번호: 207구역 15열 23번</div>
              <button className="bg-black text-white px-3 py-1 rounded text-xs">QR코드</button>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-red-500 font-medium">KT wiz vs 키움 히어로즈</div>
              <div className="bg-red-500 text-white px-2 py-1 rounded text-xs">사용가능</div>
            </div>
            <div className="text-gray-600 text-sm mb-1">2025.08.25 (일) 17:00</div>
            <div className="text-gray-500 text-xs mb-3">수원 KT위즈파크 • 3루 일반석 301구역</div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">좌석번호: 301구역 8열 12번</div>
              <button className="bg-black text-white px-3 py-1 rounded text-xs">QR코드</button>
            </div>
          </div>
        </div>

        {/* Used Tickets */}
        <div className="mb-6">
          <div className="text-sm text-gray-600 mb-3">사용된 티켓</div>
          
          <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm border-l-4 border-gray-300">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-500 font-medium">KT wiz vs NC 다이노스</div>
              <div className="bg-gray-400 text-white px-2 py-1 rounded text-xs">사용완료</div>
            </div>
            <div className="text-gray-500 text-sm mb-1">2025.08.16 (금) 18:30</div>
            <div className="text-gray-400 text-xs mb-3">수원 KT위즈파크 • 1루 응원석 207구역</div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-400">좌석번호: 207구역 12열 15번</div>
              <div className="text-xs text-green-600">입장완료</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <button 
            onClick={() => setActiveTab("티켓예매")}
            className="bg-white rounded-xl p-4 flex flex-col items-center shadow-sm"
          >
            <Ticket className="w-8 h-8 text-red-500 mb-2" />
            <span className="text-sm text-gray-700">티켓 구매</span>
          </button>
          <button 
            onClick={() => setActiveTab("일정/결과")}
            className="bg-white rounded-xl p-4 flex flex-col items-center shadow-sm"
          >
            <Calendar className="w-8 h-8 text-red-500 mb-2" />
            <span className="text-sm text-gray-700">경기 일정</span>
          </button>
        </div>
      </div>
    </div>
  )

  const ScheduleScreen = () => (
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
      </div>
    </div>
  )

  const WizStoryScreen = () => (
    <div className="flex-1 bg-gray-50 overflow-y-auto">
      <div className="px-4 pt-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg">위즈톡</h3>
          <button className="flex items-center text-gray-500 text-sm">
            <Search className="w-4 h-4 mr-1" />
            검색
          </button>
        </div>

        {/* Posts Feed */}
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-2xl p-4 shadow-sm">
              {/* Post Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 ${post.image} rounded-full flex items-center justify-center`}>
                    <div className="text-white text-xs font-bold">
                      {post.isOfficial ? "KT" : post.author[0]}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{post.author}</span>
                      {post.isOfficial && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">공식</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{post.time}</div>
                  </div>
                </div>
                <button>
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-sm text-gray-800">{post.content}</p>
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-1 text-gray-500">
                    <Heart className="w-4 h-4" />
                    <span className="text-xs">{post.likes}</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-500">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs">{post.comments}</span>
                  </button>
                </div>
                <button className="text-gray-500">
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const handleVictoryAssistant = () => {
    setActiveTab("채팅")
  }

  const handleMyWiz = () => {
    setActiveTab("MY위즈")
  }

  return (
    <div className="flex flex-col h-screen bg-white max-w-md mx-auto relative">
      {/* Header - Hidden for chat screen */}
      {activeTab !== "채팅" && (
        <div className="bg-white px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {/* KT Wiz Logo */}
            <div className="flex items-center">
              <div className="text-2xl font-bold text-red-600">KT wiz</div>
            </div>
            
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
      )}

      {/* Content */}
      {activeTab === "메인" && <MainScreen />}
      {activeTab === "티켓예매" && <TicketBookingScreen />}
      {activeTab === "MY위즈" && <MyWizScreen />}
      {activeTab === "일정/결과" && <ScheduleScreen />}
      {activeTab === "위즈톡" && <WizStoryScreen />}
      {activeTab === "채팅" && <ChatScreen />}
      {activeTab !== "메인" &&
        activeTab !== "티켓예매" &&
        activeTab !== "MY위즈" &&
        activeTab !== "일정/결과" &&
        activeTab !== "위즈톡" &&
        activeTab !== "채팅" && (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <div className="text-lg mb-2">{activeTab}</div>
              <div className="text-sm">준비 중입니다</div>
            </div>
          </div>
        )}

      {/* Floating Action Button - Victory Assistant - Hidden for chat screen */}
      {activeTab !== "채팅" && (
        <button
          onClick={handleVictoryAssistant}
          className="absolute bottom-20 right-4 z-50 w-14 h-14 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex flex-col items-center justify-center text-white"
        >
          <Bot className="w-6 h-6 mb-1" />
          <span className="text-xs leading-none">비서</span>
        </button>
      )}

      {/* Bottom Navigation - Hidden for chat screen */}
      {activeTab !== "채팅" && (
        <div className="bg-black px-4 py-2">
          <div className="flex justify-around">
            {[
              { key: "메인", icon: Home, label: "메인" },
              { key: "일정/결과", icon: Calendar, label: "일정/결과" },
              { key: "위즈톡", icon: MessageCircle, label: "위즈톡" },
              { key: "알림", icon: Bell, label: "알림" },
              { key: "메뉴", icon: Menu, label: "메뉴" },
            ].map(({ key, icon: Icon, label }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex flex-col items-center py-1 px-2 ${
                  activeTab === key ? "text-white" : "text-gray-500"
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
