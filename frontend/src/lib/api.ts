import axios from 'axios'

// API 인스턴스 생성
export const api = axios.create({
  baseURL: '',  // Vite proxy 사용
  headers: {
    'Content-Type': 'application/json',
  },
})

// 응답 인터셉터
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // 401 에러 시 토큰 제거 및 로그인 페이지로 이동
    if (error.response?.status === 401) {
      localStorage.removeItem('formtion_token')
      localStorage.removeItem('formtion_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// 초기화 시 저장된 토큰 설정
const storedToken = localStorage.getItem('formtion_token')
if (storedToken) {
  api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
}

// API 함수들
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  register: (email: string, password: string, name?: string) =>
    api.post('/api/auth/register', { email, password, name }),
  me: () => api.get('/api/auth/me'),
}

export const projectApi = {
  list: () => api.get('/api/projects'),
  get: (projectId: string) => api.get(`/api/projects/${projectId}`),
  create: (data: any) => api.post('/api/projects', data),
  update: (projectId: string, data: any) => api.put(`/api/projects/${projectId}`, data),
  delete: (projectId: string) => api.delete(`/api/projects/${projectId}`),
  getPublic: (slug: string) => api.get(`/api/public/projects/${slug}`),
  checkSlug: (slug: string) => api.get(`/api/projects/slug/check/${slug}`),
  checkUrl: (notionUrl: string) => api.get(`/api/public/projects/check-url`, { params: { notion_url: notionUrl } }),
}

export const leadApi = {
  list: (projectId: string, params?: { page?: number; limit?: number; search?: string }) =>
    api.get(`/api/projects/${projectId}/leads`, { params }),
  create: (data: any) => api.post('/api/leads', data),
  export: (projectId: string) =>
    api.get(`/api/projects/${projectId}/leads/export`, { responseType: 'blob' }),
}

export const webhookApi = {
  test: (projectId: string, webhookUrl: string, webhookType: 'general' | 'slack' | 'discord' = 'general') =>
    api.post('/api/webhooks/test', { project_id: projectId, webhook_url: webhookUrl, webhook_type: webhookType }),
}

export const eventApi = {
  track: (eventType: string, projectId: string, data?: any) =>
    api.post('/api/events', { event_type: eventType, project_id: projectId, data }),
  trackBatch: (events: Array<{ event_type: string; project_id: string; data?: any }>) =>
    api.post('/api/events/batch', { events }),
}

export const notionApi = {
  getPage: (url: string) => api.post('/api/notion/page', { url }),
  getPageById: (pageId: string) => api.get(`/api/notion/page/${pageId}`),
}

export const bookmarkApi = {
  // 폴더
  listFolders: () => api.get('/api/bookmarks/folders'),
  createFolder: (data: { name: string; description?: string }) =>
    api.post('/api/bookmarks/folders', data),
  updateFolder: (folderId: string, data: { name?: string; description?: string; order_index?: number }) =>
    api.put(`/api/bookmarks/folders/${folderId}`, data),
  deleteFolder: (folderId: string) => api.delete(`/api/bookmarks/folders/${folderId}`),

  // 북마크
  list: (folderId?: string) =>
    api.get('/api/bookmarks', { params: folderId ? { folder_id: folderId } : undefined }),
  create: (data: { project_id: string; folder_id?: string; name?: string; memo?: string }) =>
    api.post('/api/bookmarks', data),
  check: (projectId: string) => api.get(`/api/bookmarks/check/${projectId}`),
  update: (bookmarkId: string, data: { folder_id?: string; name?: string; memo?: string }) =>
    api.put(`/api/bookmarks/${bookmarkId}`, data),
  delete: (bookmarkId: string) => api.delete(`/api/bookmarks/${bookmarkId}`),
  deleteByProject: (projectId: string) => api.delete(`/api/bookmarks/project/${projectId}`),
}


