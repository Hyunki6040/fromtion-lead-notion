import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// 클래스명 병합 유틸리티
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// 날짜 포맷팅
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions) {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options,
  }
  return new Intl.DateTimeFormat('ko-KR', defaultOptions).format(new Date(date))
}

// 상대 시간 포맷팅
export function formatRelativeTime(date: string | Date) {
  const now = new Date()
  const target = new Date(date)
  const diff = now.getTime() - target.getTime()

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}일 전`
  if (hours > 0) return `${hours}시간 전`
  if (minutes > 0) return `${minutes}분 전`
  return '방금 전'
}

// 슬러그 생성
export function generateSlug(length: number = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// UTM 파라미터 추출
export function extractUTMParams(searchParams: URLSearchParams) {
  return {
    utm_source: searchParams.get('utm_source') || undefined,
    utm_medium: searchParams.get('utm_medium') || undefined,
    utm_campaign: searchParams.get('utm_campaign') || undefined,
    utm_term: searchParams.get('utm_term') || undefined,
    utm_content: searchParams.get('utm_content') || undefined,
  }
}

// 이메일 유효성 검사
export function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// URL 유효성 검사
export function isValidUrl(url: string) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Notion URL 유효성 검사
export function isValidNotionUrl(url: string) {
  if (!isValidUrl(url)) return false
  const parsed = new URL(url)
  return parsed.hostname.includes('notion.so') || parsed.hostname.includes('notion.site')
}

// localStorage 유틸리티
export const storage = {
  get: <T>(key: string, defaultValue?: T): T | undefined => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },
  set: <T>(key: string, value: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // localStorage 사용 불가 시 무시
    }
  },
  remove: (key: string) => {
    try {
      localStorage.removeItem(key)
    } catch {
      // localStorage 사용 불가 시 무시
    }
  },
}

// Cookie 유틸리티
export const cookie = {
  get: (name: string): string | undefined => {
    try {
      const value = `; ${document.cookie}`
      const parts = value.split(`; ${name}=`)
      if (parts.length === 2) return parts.pop()?.split(';').shift()
      return undefined
    } catch {
      return undefined
    }
  },
  set: (name: string, value: string, days: number = 30) => {
    try {
      const expires = new Date()
      expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
      // SameSite=Lax for better mobile Safari compatibility
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
    } catch {
      // Cookie 설정 실패 시 무시
    }
  },
  remove: (name: string) => {
    try {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`
    } catch {
      // Cookie 삭제 실패 시 무시
    }
  },
}

// Unlock 상태 관리
export const unlockStorage = {
  isUnlocked: (projectId: string): boolean => {
    // localStorage 확인
    const unlocked = storage.get(`unlocked_${projectId}`)
    if (unlocked === 'true' || unlocked === true) {
      // 만료 확인
      const expiresAt = storage.get<number>(`unlock_expires_${projectId}`)
      if (expiresAt && Date.now() < expiresAt) {
        return true
      }
    }
    // Cookie 확인
    return cookie.get(`unlocked_${projectId}`) === 'true'
  },
  setUnlocked: (projectId: string, durationDays: number = 30) => {
    const expiresAt = Date.now() + durationDays * 24 * 60 * 60 * 1000
    storage.set(`unlocked_${projectId}`, 'true')
    storage.set(`unlocked_at_${projectId}`, Date.now())
    storage.set(`unlock_expires_${projectId}`, expiresAt)
    cookie.set(`unlocked_${projectId}`, 'true', durationDays)
  },
  clearUnlocked: (projectId: string) => {
    storage.remove(`unlocked_${projectId}`)
    storage.remove(`unlocked_at_${projectId}`)
    storage.remove(`unlock_expires_${projectId}`)
    cookie.remove(`unlocked_${projectId}`)
  },
}






