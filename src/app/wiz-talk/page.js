'use client'

import { useState, useEffect } from 'react'
import Layout from '../../components/Layout'
import { postAPI } from '../../lib/api'

export default function WizTalkPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAllPosts()
  }, [])

  const fetchAllPosts = async () => {
    try {
      setLoading(true)
      const data = await postAPI.getAllPosts()
      setPosts(data || [])
    } catch (error) {
      console.error('게시물을 가져오는데 실패했습니다:', error)
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return '방금 전'
    if (diffInHours < 24) return `${diffInHours}시간 전`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}일 전`
    
    return date.toLocaleDateString('ko-KR')
  }

  const getCategoryText = (category) => {
    switch (category) {
      case 'news': return '뉴스'
      case 'highlight': return '하이라이트'
      case 'story': return '일반'
      case 'photo': return '사진'
      case 'live': return '라이브'
      default: return category
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'news': return 'bg-blue-500'
      case 'highlight': return 'bg-red-500'
      case 'story': return 'bg-green-500'
      case 'photo': return 'bg-purple-500'
      case 'live': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">게시물을 불러오는 중...</p>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">위즈톡</h1>
          
          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">아직 게시물이 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full ${getCategoryColor(post.category)} flex items-center justify-center text-white text-sm font-medium`}>
                        {getCategoryText(post.category).charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {post.author?.name || '알 수 없음'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatTime(post.createdAt)}
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)} text-white`}>
                      {getCategoryText(post.category)}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {post.body}
                  </p>
                  
                  {post.thumbnail && (
                    <div className="mb-4">
                      <img 
                        src={post.thumbnail} 
                        alt={post.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      <span>좋아요 0</span>
                      <span>댓글 0</span>
                    </div>
                    <div className="text-xs">
                      {post.updatedAt && post.updatedAt !== post.createdAt && '수정됨'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
