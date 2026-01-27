import { motion } from 'framer-motion'
import { Key } from 'lucide-react'

export interface BlurOverlayProps {
  method: 'section-blur' | 'preview-then-blur' | 'keyword-blackout' | 'random-text-highlight'
  intensity: 'light' | 'medium' | 'strong'
  preset?: 'top' | 'middle' | 'bottom'
  position?: number
  primaryColor?: string
  textHighlightRatio?: number // 가릴 단어 비율 (0-100)
  onKeyClick?: () => void // 열쇠 아이콘 클릭 핸들러
}

/**
 * PRD 디자인 가이드 기준 블러 오버레이
 * - 단순 blur + 아주 얇은 그라데이션 (위쪽 투명 → 아래쪽 진해짐)
 * - 중앙에 작은 카드 (Checkpoint Card) 배치
 */

export default function BlurOverlay({
  method,
  intensity,
  preset = 'middle',
  position,
  primaryColor = '#FF5A1F',
  textHighlightRatio = 30,
  onKeyClick,
}: BlurOverlayProps) {
  // 블러 강도 설정
  const blurValues = {
    light: 'blur(5px)',
    medium: 'blur(10px)',
    strong: 'blur(15px)',
  }

  // 위치 설정
  const positionMap = {
    top: 30,
    middle: 50,
    bottom: 70,
  }

  const startPosition = positionMap[preset] || position || 50

  // Section Blur: 전체 하단 영역 블러
  if (method === 'section-blur') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 z-20"
        style={{
          top: `${startPosition}%`,
          // PRD: rgba(0, 0, 0, 0.3) + mask-image gradient
          background: 'rgba(0, 0, 0, 0.3)',
          backdropFilter: blurValues[intensity],
          WebkitBackdropFilter: blurValues[intensity],
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
          pointerEvents: 'none', // 클릭/스크롤 통과
        }}
      />
    )
  }

  // Preview-Then-Blur: 상단 프리뷰 + 하단 블러
  if (method === 'preview-then-blur') {
    // 체크포인트 박스 위치 계산 - 블러 시작 지점 바로 아래에 위치
    // overflow-hidden으로 잘리지 않도록 최대 70%까지만 허용
    const cardTopPosition = Math.min(startPosition + 10, 70)
    
    return (
      <>
        {/* 그라데이션 오버레이 - PRD 기준 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-20"
          style={{
            top: `${Math.max(startPosition - 10, 0)}%`,
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: blurValues[intensity],
            WebkitBackdropFilter: blurValues[intensity],
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
            pointerEvents: 'none', // 클릭/스크롤 통과
          }}
        />

        {/* Checkpoint Card - PRD 기준 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="absolute left-0 right-0 z-30 flex justify-center px-4"
          style={{ 
            top: `${cardTopPosition}%`,
            transform: 'translateY(-50%)', // 박스 중앙 정렬
            pointerEvents: 'auto', // 카드는 클릭 가능해야 함
          }}
        >
          <div
            className="bg-white rounded-[16px] shadow-modal p-6 text-center max-w-sm w-full cursor-pointer hover:shadow-lg transition-shadow"
            onClick={onKeyClick}
          >
            {/* 아이콘 - 열쇠 아이콘 (핵심 내용 접근) */}
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-glow bg-white"
              style={{
                border: `2px solid ${primaryColor}`,
              }}
            >
              <Key className="w-7 h-7" style={{ color: primaryColor }} />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              여기서부터 핵심 내용이에요
            </h3>
            <p className="text-sm text-text-secondary">
              이메일 입력하면 전체 내용이 바로 열립니다
            </p>
          </div>
        </motion.div>
      </>
    )
  }

  // Random Text Highlight: 랜덤 텍스트 형광펜 효과
  if (method === 'random-text-highlight') {
    // 비율에 따라 형광펜 스팟 개수 계산 (100개 기준)
    const spotCount = Math.floor((textHighlightRatio || 30) / 100 * 100)
    
    // 랜덤 형광펜 스팟 생성
    const generateSpots = () => {
      const spots = []
      for (let i = 0; i < spotCount; i++) {
        spots.push({
          top: Math.random() * 100,
          left: Math.random() * 100,
          width: 40 + Math.random() * 80, // 40-120px
          height: 20 + Math.random() * 10, // 20-30px (텍스트 라인 높이)
          rotation: (Math.random() - 0.5) * 10, // -5 ~ 5도
        })
      }
      return spots
    }

    const spots = generateSpots()
    const highlightColor = `${primaryColor}40` // 25% 투명도

    return (
      <>
        {/* 형광펜 오버레이 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-20 pointer-events-none"
        >
          {spots.map((spot, index) => (
            <div
              key={index}
              className="absolute"
              style={{
                top: `${spot.top}%`,
                left: `${spot.left}%`,
                width: `${spot.width}px`,
                height: `${spot.height}px`,
                backgroundColor: highlightColor,
                transform: `rotate(${spot.rotation}deg)`,
                borderRadius: '2px',
                pointerEvents: 'none',
              }}
            />
          ))}
        </motion.div>


        {/* Checkpoint Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="absolute left-0 right-0 z-30 flex justify-center px-4"
          style={{
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'auto',
          }}
        >
          <div className="bg-white rounded-[16px] shadow-modal p-6 text-center max-w-sm w-full">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-glow bg-white"
              style={{
                border: `2px solid ${primaryColor}`,
              }}
            >
              <Key className="w-7 h-7" style={{ color: primaryColor }} />
            </div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              여기서부터 핵심 내용이에요
            </h3>
            <p className="text-sm text-text-secondary">
              이메일 입력하면 전체 내용이 바로 열립니다
            </p>
          </div>
        </motion.div>
      </>
    )
  }

  // 기본 (폴백) - PRD 기준
  return (
    <div
      className="absolute inset-0 z-20"
      style={{
        top: `${startPosition}%`,
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: blurValues[intensity],
        WebkitBackdropFilter: blurValues[intensity],
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 100%)',
        pointerEvents: 'none', // 클릭/스크롤 통과
      }}
    />
  )
}
