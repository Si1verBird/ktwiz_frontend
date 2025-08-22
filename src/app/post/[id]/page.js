'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import Layout from '../../../components/Layout'
import { postAPI } from '../../../lib/api'

export default function PostDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchPost(params.id)
    }
  }, [params.id])

  const fetchPost = async (postId) => {
    try {
      setLoading(true)
      // 실제로는 postAPI.getPostById 등의 API가 있어야 하지만
      // 현재는 목업 데이터로 표시
      const mockPost = {
        id: postId,
        title: "KT Wiz 시즌 하이라이트",
        content: "이번 시즌 KT Wiz의 주요 경기들을 돌아보며, 팬들에게 감동을 선사했던 순간들을 함께 나누고자 합니다.\n\n올 시즌 우리 팀은 많은 도전과 성장을 경험했습니다. 선수들의 열정적인 플레이와 팬들의 뜨거운 응원이 있었기에 가능했던 소중한 순간들이었습니다.\n\n앞으로도 더 나은 경기력으로 팬 여러분께 보답하겠습니다.",
        category: "news",
        createdAt: "2025-08-22T10:00:00",
        thumbnail: null
      }
      setPost(mockPost)
    } catch (error) {
      console.error('게시물 조회 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
        </div>
      </Layout>
    )
  }

  if (!post) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center py-20">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">게시물을 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-4">요청하신 게시물이 존재하지 않거나 삭제되었습니다.</p>
          <button
            onClick={() => router.push('/')}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => router.back()}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">게시물</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Post Header */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              post.category === 'news' ? 'bg-blue-100 text-blue-800' :
              post.category === 'highlight' ? 'bg-red-100 text-red-800' :
              'bg-green-100 text-green-800'
            }`}>
              {post.category === 'news' ? '뉴스' : 
               post.category === 'highlight' ? '하이라이트' : '소식'}
            </span>
            <span className="text-sm text-gray-500">{formatDate(post.createdAt)}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            {post.title}
          </h1>
        </div>

        {/* Thumbnail */}
        {post.thumbnail && (
          <div className="rounded-xl overflow-hidden">
            <img 
              src={post.thumbnail} 
              alt={post.title}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        {/* Post Content */}
        <div className="prose prose-lg max-w-none">
          <div className="text-gray-800 leading-relaxed whitespace-pre-line">
            {post.content}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex space-x-3">
            <button
              onClick={() => router.back()}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              뒤로가기
            </button>
            <button
              onClick={() => router.push('/wiz-talk')}
              className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              WIZ TALK 가기
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
