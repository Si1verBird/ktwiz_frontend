const API_BASE_URL = 'http://localhost:8080/api'

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
    
    return await response.json()
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
  
  // 경기 생성
  createGame: (gameData) => apiRequest('/games', {
    method: 'POST',
    body: JSON.stringify(gameData),
  }),
  
  // 경기 수정
  updateGame: (id, gameData) => apiRequest(`/games/${id}`, {
    method: 'PUT',
    body: JSON.stringify(gameData),
  }),
  
  // 경기 삭제
  deleteGame: (id) => apiRequest(`/games/${id}`, {
    method: 'DELETE',
  }),
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
  
  // 최근 관리자 게시물 조회 (메인페이지용)
  getRecentAdminPosts: (limit = 3) => apiRequest(`/posts/admin-recent?limit=${limit}`),
}

export default {
  gameAPI,
  venueAPI,
  teamAPI,
  standingAPI,
  userAPI,
  postAPI,
}
