import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

/**
 * 마케팅 수신동의 안내 페이지
 * 정보통신망법 준수
 * 무료 버전 표기 포함
 */
export default function MarketingConsentPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #FF5A1F 0%, #E64510 100%)',
                }}
              >
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="font-display font-bold text-xl text-text-primary">
                FORMTION
              </span>
            </Link>
            <Link
              to="/"
              className="ml-auto flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              홈으로
            </Link>
          </div>
        </div>
      </header>

      {/* 본문 */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-slate max-w-none">
          <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
            마케팅 수신동의 안내
          </h1>
          <p className="text-text-muted mb-8">
            최종 수정일: {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="space-y-8 text-text-secondary leading-relaxed">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>※ 무료 버전 이용 시:</strong> 마케팅 수신동의는 선택 사항이며, 동의하지 않아도 서비스를 이용하실 수 있습니다.
              </p>
            </div>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">1. 마케팅 수신동의의 목적</h2>
              <p className="mb-3">
                FORMTION(이하 "회사")은 정보통신망법 제50조에 따라 이용자의 마케팅 정보 수신에 대한 동의를 받고 있습니다. 
                마케팅 수신동의는 선택 사항이며, 동의하지 않아도 서비스 이용에는 제한이 없습니다.
              </p>
              <p>
                마케팅 수신동의를 하시면 다음의 정보를 받아보실 수 있습니다:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>FORMTION 서비스 업데이트 및 신규 기능 안내</li>
                <li>새로운 템플릿 및 콘텐츠 소식</li>
                <li>이벤트 및 프로모션 정보</li>
                <li>서비스 이용 팁 및 가이드</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">2. 마케팅 정보 수신 방법</h2>
              <p className="mb-3">
                회사는 다음과 같은 방법으로 마케팅 정보를 발송합니다:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>이메일 (이메일 주소로 발송)</li>
                <li>서비스 내 알림 (서비스 이용 시 알림 표시)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">3. 마케팅 수신동의 철회</h2>
              <p className="mb-3">
                마케팅 수신동의는 언제든지 철회하실 수 있습니다. 동의 철회 방법은 다음과 같습니다:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>이메일 수신 거부:</strong> 발송된 이메일 하단의 "수신거부" 링크를 클릭하시면 즉시 수신이 중단됩니다.
                </li>
                <li>
                  <strong>서비스 내 설정:</strong> 마이페이지에서 마케팅 수신 설정을 변경하실 수 있습니다.
                </li>
                <li>
                  <strong>고객센터 문의:</strong> 이메일(<a href="mailto:privacy@formtion.app" className="text-primary-500 hover:underline">privacy@formtion.app</a>)로 동의 철회를 요청하실 수 있습니다.
                </li>
              </ul>
              <p className="mt-3">
                동의 철회 후에도 서비스 이용에는 제한이 없으며, 마케팅 정보 수신만 중단됩니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">4. 마케팅 정보 수신 거부 시 불이익</h2>
              <p>
                마케팅 수신동의를 하지 않으셔도 서비스 이용에는 전혀 제한이 없습니다. 
                다만, 마케팅 정보 수신을 원하시는 경우에만 동의해 주시면 됩니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">5. 마케팅 정보 수신 동의 보유기간</h2>
              <p className="mb-3">
                마케팅 수신동의는 동의일로부터 유효하며, 동의 철회 시까지 보유합니다. 
                동의 철회 시 즉시 마케팅 정보 수신이 중단되며, 관련 정보는 삭제됩니다.
              </p>
              <p>
                단, 법령에 따라 보관이 필요한 경우 해당 기간 동안 보관할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">6. 마케팅 정보 수신 동의 처리 현황</h2>
              <p className="mb-3">
                회사는 마케팅 수신동의를 받은 이용자에 한하여 마케팅 정보를 발송하며, 
                동의하지 않은 이용자에게는 마케팅 정보를 발송하지 않습니다.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm">
                  <strong>처리 현황:</strong> 마케팅 수신동의 여부는 서비스 이용 시 확인하실 수 있으며, 
                  언제든지 변경하실 수 있습니다.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">7. 문의처</h2>
              <p className="mb-3">
                마케팅 수신동의와 관련하여 궁금한 사항이 있으시면 아래로 문의해 주시기 바랍니다.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <ul className="text-sm space-y-1">
                  <li>이메일: <a href="mailto:privacy@formtion.app" className="text-primary-500 hover:underline">privacy@formtion.app</a></li>
                </ul>
              </div>
            </section>
          </div>

          {/* 하단 링크 */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Link
              to="/privacy"
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              ← 개인정보 처리방침
            </Link>
            <Link
              to="/"
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              홈으로 돌아가기 →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}



