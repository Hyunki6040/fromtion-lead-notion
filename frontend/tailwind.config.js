/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // FORMTION 브랜드 컬러 - PRD 디자인 가이드 기준
        // primary를 기본 색상으로 설정하여 --tw-ring-color 등이 오렌지를 사용하도록 함
        primary: {
          DEFAULT: '#FF5A1F', // 기본값을 오렌지로 설정
          50: '#FFF1EA',   // Orange Soft (배경 하이라이트)
          100: '#FFE4D6',
          200: '#FFC9AD',
          300: '#FFAD85',
          400: '#FF825C',
          500: '#FF5A1F',   // Formtion Orange (포인트/행동/언락)
          600: '#E64510',   // Orange Deep (hover/active)
          700: '#CC3A0D',
          800: '#A32F0A',
          900: '#7A2308',
        },
        // Tailwind 기본 색상들을 오렌지로 오버라이드 (blue, indigo 등)
        blue: {
          DEFAULT: '#FF5A1F',
          50: '#FFF1EA',
          100: '#FFE4D6',
          200: '#FFC9AD',
          300: '#FFAD85',
          400: '#FF825C',
          500: '#FF5A1F',
          600: '#E64510',
          700: '#CC3A0D',
          800: '#A32F0A',
          900: '#7A2308',
        },
        indigo: {
          DEFAULT: '#FF5A1F',
          50: '#FFF1EA',
          100: '#FFE4D6',
          200: '#FFC9AD',
          300: '#FFAD85',
          400: '#FF825C',
          500: '#FF5A1F',
          600: '#E64510',
          700: '#CC3A0D',
          800: '#A32F0A',
          900: '#7A2308',
        },
        // 액센트 컬러 (오렌지 계열 - primary와 동일)
        accent: {
          DEFAULT: '#FF5A1F', // 기본값을 오렌지로 설정
          50: '#FFF1EA',   // Orange Soft
          100: '#FFE4D6',
          200: '#FFC9AD',
          300: '#FFAD85',
          400: '#FF825C',
          500: '#FF5A1F',   // Formtion Orange
          600: '#E64510',   // Orange Deep
          700: '#CC3A0D',
          800: '#A32F0A',
          900: '#7A2308',
        },
        // 베이스 컬러
        surface: {
          light: '#FFFFFF',   // Background
          DEFAULT: '#F7F7F8', // Surface
          dark: '#F1F5F9',
        },
        // 보더 컬러
        border: {
          DEFAULT: '#E9E9EC',
          light: '#F1F5F9',
          dark: '#D1D5DB',
        },
        // 텍스트 컬러
        text: {
          primary: '#111111',   // Text Primary
          secondary: '#666A73', // Text Secondary
          muted: '#9CA3AF',
        },
        // 상태 컬러
        success: {
          50: '#ECFDF5',
          500: '#10B981',
          600: '#059669',
        },
        warning: {
          50: '#FFFBEB',
          500: '#F59E0B',
          600: '#D97706',
        },
        error: {
          50: '#FEF2F2',
          500: '#EF4444',
          600: '#DC2626',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'Pretendard', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'button': '14px',    // CTA 버튼 (캡슐 느낌)
        'input': '8px',      // 입력 필드
        'modal': '16px',     // 모달/카드
        'service': '8px',    // 서비스 로고 버튼
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'glow': '0 0 20px rgba(255, 90, 31, 0.3)',  // 오렌지 glow
        'modal': '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'blur-in': 'blurIn 0.5s ease-out',
        'bounce-subtle': 'bounceSubtle 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blurIn: {
          '0%': { filter: 'blur(10px)', opacity: '0' },
          '100%': { filter: 'blur(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
  plugins: [],
}
