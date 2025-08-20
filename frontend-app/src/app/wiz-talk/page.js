'use client'

import { Search, Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react'
import Layout from '../../components/Layout'

export default function WizTalkPage() {
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
    },
    {
      id: 3,
      author: "KT wiz 공식",
      isOfficial: true,
      time: "6시간 전",
      content: "📢 내일 경기 티켓 예매가 시작됩니다! 오전 10시부터 온라인 예매 가능하니 놓치지 마세요!",
      likes: 156,
      comments: 34,
      image: "bg-blue-500"
    },
    {
      id: 4,
      author: "위즈팬",
      isOfficial: false,
      time: "8시간 전",
      content: "위즈파크 새로운 치킨 먹어봤는데 정말 맛있어요! 추천합니다 👍",
      likes: 42,
      comments: 12,
      image: "bg-yellow-500"
    }
  ]

  return (
    <Layout>
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
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors">
                      <Heart className="w-4 h-4" />
                      <span className="text-xs">{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500 transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-xs">{post.comments}</span>
                    </button>
                  </div>
                  <button className="text-gray-500 hover:text-green-500 transition-colors">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
