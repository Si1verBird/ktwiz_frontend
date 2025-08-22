// 모든 기기에서 접근 가능하도록 고정 IP 사용
const API_BASE_URL = 'http://172.30.1.29:8080/api'

// 공통 fetch 함수
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  
  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  }
  
  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    // DELETE 요청이나 204 No Content 응답의 경우 JSON 파싱하지 않음
    if (config.method === 'DELETE' || response.status === 204) {
      return null
    }
    
    // 응답 본문이 비어있는지 확인
    const text = await response.text()
    if (!text) {
      return null
    }
    
    return JSON.parse(text)
  } catch (error) {
    console.error('API request failed:', error)
    throw error
  }
}

// 경기 관련 API
export const gameAPI = {
  // 모든 경기 조회
  getAllGames: () => apiRequest('/games'),
  
  // 특정 상태의 경기 조회
  getGamesByStatus: (status) => apiRequest(`/games/status/${status}`),
  
  // 기간별 경기 조회
  getGamesByDateRange: (start, end) => apiRequest(`/games/date-range?start=${start}&end=${end}`),
  
  // 경기 상세 조회
  getGameById: (id) => apiRequest(`/games/${id}`),
  
  // 가장 가까운 경기 조회 (메인페이지용)
  getNextGame: () => apiRequest('/games/next'),
  
  // KT Wiz의 최근 종료된 경기 조회 (메인페이지 game schedule용)
  getKtWizLatestEndedGame: () => apiRequest('/games/kt-wiz/latest-ended'),
  getKtWizLatestGame: () => apiRequest('/games/kt-wiz/latest-ended'),
  
  // 팀과 상태로 경기 필터링
  getGamesByFilter: (teamIds, statuses) => {
    const params = new URLSearchParams()
    if (teamIds && teamIds.length > 0) {
      teamIds.forEach(id => params.append('teamIds', id))
    }
    if (statuses && statuses.length > 0) {
      statuses.forEach(status => params.append('statuses', status))
    }
    const queryString = params.toString()
    return apiRequest(`/games/filter${queryString ? '?' + queryString : ''}`)
  },
  
  // 경기 생성
  createGame: (gameData) => apiRequest('/games', {
    method: 'POST',
    body: JSON.stringify(gameData),
  }),
  
  // 경기 수정
  updateGame: (id, gameData) => {
    console.log('🔍 [API] 경기 수정 요청:', id, gameData)
    return apiRequest(`/games/${id}`, {
      method: 'PUT',
      body: JSON.stringify(gameData),
    })
  },
  
  // 경기 삭제
  deleteGame: (id) => apiRequest(`/games/${id}`, {
    method: 'DELETE',
  }),
  
  // 경기 상세 조회
  getGameById: (id) => {
    console.log('🔍 [API] 경기 상세 조회 요청:', id)
    return apiRequest(`/games/${id}`)
  },
}

// 경기장 관련 API
export const venueAPI = {
  // 모든 경기장 조회
  getAllVenues: () => apiRequest('/venues'),
}

// 팀 관련 API
export const teamAPI = {
  // 모든 팀 조회
  getAllTeams: () => apiRequest('/teams'),
}

// 팀 순위 관련 API
export const standingAPI = {
  // 모든 팀 순위 조회
  getAllStandings: () => apiRequest('/standings'),
  
  // 특정 팀 순위 조회
  getTeamStanding: (teamName) => apiRequest(`/standings/team/${teamName}`),
  
  // KT Wiz 순위 조회 (메인페이지용)
  getKtWizStanding: () => apiRequest('/standings/kt-wiz'),
  
  // 팀 통계 수동 업데이트 (관리자용)
  refreshStandings: () => apiRequest('/standings/refresh', {
    method: 'POST',
  }),
}

// 사용자 관련 API
export const userAPI = {
  // 로그인
  login: (email, password) => apiRequest('/users/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
}

// 게시물 관련 API
export const postAPI = {
  // 모든 게시물 조회
  getAllPosts: () => apiRequest('/posts'),
  
  // 최근 게시물 조회 (최신순)
  getRecentPosts: (limit = 3) => apiRequest(`/posts/recent?limit=${limit}`),
  
  // 최근 관리자 게시물 조회 (메인페이지용)
  getRecentAdminPosts: (limit = 3) => apiRequest(`/posts/admin-recent?limit=${limit}`),
}

// 채팅 관련 API
export const chatAPI = {
  // 새로운 채팅 세션 생성
  createSession: () => apiRequest('/chats/session', {
    method: 'POST',
  }),
  
  // 세션별 채팅 내역 조회
  getChatHistory: (sessionId) => apiRequest(`/chats/session/${sessionId}`),
  
  // 메시지 전송
  sendMessage: (sessionId, userId, message) => apiRequest('/chats/message', {
    method: 'POST',
    body: JSON.stringify({
      sessionId,
      userId,
      message
    }),
  }),
  
  // 관리자 메시지 전송
  sendAdminMessage: (sessionId, adminId, message) => apiRequest('/chats/admin-message', {
    method: 'POST',
    body: JSON.stringify({
      sessionId,
      adminId,
      message
    }),
  }),
}

export default {
  gameAPI,
  venueAPI,
  teamAPI,
  standingAPI,
  userAPI,
  postAPI,
  chatAPI,
}
