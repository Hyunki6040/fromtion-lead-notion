import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

/**
 * 개인정보 처리방침 페이지
 * 개인정보보호법, 정보통신망법 준수
 * FORMTION이 수집한 정보를 활용할 수 있도록 조항 포함
 */
export default function PrivacyPolicyPage() {
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
            개인정보 처리방침
          </h1>
          <p className="text-text-muted mb-8">
            최종 수정일: {new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <div className="space-y-8 text-text-secondary leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">1. 개인정보의 처리 목적</h2>
              <p className="mb-3">
                FORMTION(이하 "회사")은 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>서비스 제공:</strong> 콘텐츠 공유 및 리드 수집 서비스 제공, 본인 확인, 콘텐츠 접근 권한 관리
                </li>
                <li>
                  <strong>서비스 개선:</strong> 서비스 이용 통계 분석, 신규 서비스 개발, 맞춤형 서비스 제공
                </li>
                <li>
                  <strong>고객 지원:</strong> 문의사항 응대, 불만 처리, 공지사항 전달
                </li>
                <li>
                  <strong>마케팅 활용:</strong> 이벤트 및 프로모션 정보 제공, 신규 서비스 안내 (마케팅 수신 동의 시)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">2. 개인정보의 처리 및 보유기간</h2>
              <p className="mb-3">
                회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은 개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>서비스 이용 기간:</strong> 회원 탈퇴 시까지 (단, 관계 법령 위반에 따른 수사·조사 등이 진행중인 경우에는 해당 수사·조사 종료 시까지)
                </li>
                <li>
                  <strong>리드 정보:</strong> 수집일로부터 3년간 보관 (단, 정보주체가 삭제를 요청하는 경우 즉시 삭제)
                </li>
                <li>
                  <strong>계약 또는 청약철회 등에 관한 기록:</strong> 5년 (전자상거래법)
                </li>
                <li>
                  <strong>대금결제 및 재화 등의 공급에 관한 기록:</strong> 5년 (전자상거래법)
                </li>
                <li>
                  <strong>소비자의 불만 또는 분쟁처리에 관한 기록:</strong> 3년 (전자상거래법)
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">3. 처리하는 개인정보의 항목</h2>
              <p className="mb-3">회사는 다음의 개인정보 항목을 처리하고 있습니다:</p>
              <div className="bg-gray-50 rounded-lg p-4 mb-3">
                <p className="font-medium mb-2">필수 항목:</p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>이메일 주소</li>
                  <li>이름 (선택 시)</li>
                  <li>회사명 (선택 시)</li>
                  <li>직무 (선택 시)</li>
                  <li>서비스 이용 기록, 접속 로그, 쿠키, 접속 IP 정보</li>
                </ul>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium mb-2">선택 항목:</p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>마케팅 수신 동의 시: 이메일 주소 (마케팅 목적)</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">4. 개인정보의 제3자 제공</h2>
              <p className="mb-3">
                회사는 정보주체의 개인정보를 제1조(개인정보의 처리 목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="font-medium text-yellow-800 mb-2">FORMTION 서비스 제공을 위한 정보 활용</p>
                <p className="text-sm text-yellow-700">
                  회사는 수집한 리드 정보를 FORMTION 서비스를 통해 콘텐츠를 공유한 운영자(프로젝트 소유자)에게 제공합니다. 
                  이는 서비스 제공을 위한 필수적인 사항이며, 운영자는 제공받은 정보를 본인의 콘텐츠 마케팅 목적으로만 활용할 수 있습니다.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">5. 개인정보처리의 위탁</h2>
              <p className="mb-3">
                회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 font-medium">위탁업체</th>
                      <th className="text-left py-2 font-medium">위탁업무 내용</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">클라우드 호스팅 서비스</td>
                      <td className="py-2">서버 운영 및 데이터 저장</td>
                    </tr>
                    <tr>
                      <td className="py-2">이메일 발송 서비스</td>
                      <td className="py-2">이메일 발송 (마케팅 수신 동의 시)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">6. 정보주체의 권리·의무 및 그 행사방법</h2>
              <p className="mb-3">
                정보주체는 개인정보주체로서 다음과 같은 권리를 행사할 수 있습니다:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>개인정보 열람 요구</li>
                <li>개인정보 정정·삭제 요구</li>
                <li>개인정보 처리정지 요구</li>
                <li>마케팅 수신 동의 철회</li>
              </ul>
              <p className="mt-3">
                권리 행사는 회사에 대해 서면, 전자우편, 모사전송(FAX) 등을 통하여 하실 수 있으며 회사는 이에 대해 지체 없이 조치하겠습니다.
              </p>
              <p className="mt-3">
                문의: <a href="mailto:privacy@formtion.app" className="text-primary-500 hover:underline">privacy@formtion.app</a>
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">7. 개인정보의 파기</h2>
              <p className="mb-3">
                회사는 개인정보 보유기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
              </p>
              <p className="mb-3">
                파기의 절차 및 방법은 다음과 같습니다:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>파기절차:</strong> 회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.
                </li>
                <li>
                  <strong>파기방법:</strong> 전자적 파일 형태의 정보는 기록을 재생할 수 없는 기술적 방법을 사용합니다. 종이에 출력된 개인정보는 분쇄기로 분쇄하거나 소각을 통하여 파기합니다.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">8. 개인정보 보호책임자</h2>
              <p className="mb-3">
                회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="font-medium mb-2">개인정보 보호책임자</p>
                <ul className="text-sm space-y-1">
                  <li>이메일: <a href="mailto:privacy@formtion.app" className="text-primary-500 hover:underline">privacy@formtion.app</a></li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">9. 개인정보의 안전성 확보 조치</h2>
              <p className="mb-3">
                회사는 개인정보보호법 제29조에 따라 다음과 같이 안전성 확보에 필요한 기술적/관리적 및 물리적 조치를 하고 있습니다:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>개인정보의 암호화</li>
                <li>해킹 등에 대비한 기술적 대책</li>
                <li>개인정보처리시스템 등의 접근권한 관리</li>
                <li>개인정보에 대한 접근 제한</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-text-primary mb-4">10. 개인정보 처리방침 변경</h2>
              <p>
                이 개인정보 처리방침은 법령·정책 또는 보안기술의 변경에 따라 내용의 추가·삭제 및 수정이 있을 시에는 변경사항의 시행 7일 전부터 홈페이지의 공지사항을 통하여 고지할 것입니다.
              </p>
            </section>
          </div>

          {/* 하단 링크 */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Link
              to="/"
              className="text-sm text-text-muted hover:text-text-primary transition-colors"
            >
              ← 홈으로 돌아가기
            </Link>
            <Link
              to="/marketing-consent"
              className="text-sm text-primary-500 hover:text-primary-600 transition-colors"
            >
              마케팅 수신동의 안내 →
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}



