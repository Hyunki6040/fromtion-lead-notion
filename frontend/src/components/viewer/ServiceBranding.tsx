import { motion } from 'framer-motion'

/**
 * PRD 디자인 가이드 기준 서비스 브랜딩 로고 버튼
 * - 위치: 우측 하단, Floating CTA 위 (80px 위)
 * - 배경: 화이트 (#FFFFFF)
 * - 테두리: 얇은 테두리 (#E9E9EC)
 * - 둥근 모서리: 8px
 * - 크기: 44x44px
 */
export default function ServiceBranding() {
  return (
    <motion.a
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8 }}
      whileHover={{ scale: 1.05 }}
      href="https://formtion.io"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed z-40 flex items-center justify-center transition-all duration-200"
      style={{
        // PRD: 우측 하단 80px 위
        bottom: '80px',
        right: '20px',
        // PRD: 44x44px
        width: '44px',
        height: '44px',
        // PRD: 배경 화이트, 테두리 #E9E9EC, 둥근 모서리 8px
        backgroundColor: '#FFFFFF',
        border: '1px solid #E9E9EC',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
      }}
      title="Powered by FORMTION"
    >
      {/* 로고 - 오렌지 그라데이션 */}
      <div 
        className="w-7 h-7 rounded flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #FF5A1F 0%, #E64510 100%)',
          borderRadius: '6px',
        }}
      >
        <span className="text-white text-xs font-bold">F</span>
      </div>
    </motion.a>
  )
}
