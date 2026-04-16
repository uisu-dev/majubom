import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-[24px] font-bold text-text-primary mb-1">마주봄</h1>
        <p className="text-[14px] text-text-tertiary">
          회복적 상담 및 성찰문 통합 관리 시스템
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 상담 프로그램 카드 */}
        <div className="bg-surface-card rounded-[12px] shadow-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="size-7 rounded-lg bg-brand-tint flex items-center justify-center">
              <svg className="size-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h2 className="text-[18px] font-bold text-text-primary">상담 프로그램</h2>
          </div>
          <p className="text-[13px] text-text-tertiary mb-5 leading-relaxed">
            일반 상담 및 회복적 상담 일지를 작성하고 관리합니다.
          </p>
          <div className="space-y-3">
            <Link
              href="/counseling"
              className="block w-full text-center bg-brand text-white py-3 rounded-[8px] text-[14px] font-medium hover:bg-brand-hover transition min-h-[44px] flex items-center justify-center"
            >
              상담 작성
            </Link>
            <Link
              href="/counseling/manage"
              className="block w-full text-center border border-border-strong text-text-secondary py-3 rounded-[8px] text-[14px] font-medium hover:bg-surface-subtle transition min-h-[44px] flex items-center justify-center"
            >
              상담 관리
            </Link>
          </div>
        </div>

        {/* 성찰문 관리 카드 */}
        <div className="bg-surface-card rounded-[12px] shadow-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="size-7 rounded-lg bg-brand-tint flex items-center justify-center">
              <svg className="size-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-[18px] font-bold text-text-primary">성찰문 관리</h2>
          </div>
          <p className="text-[13px] text-text-tertiary mb-5 leading-relaxed">
            학생 성찰문을 등록하고, 지도 기록을 관리합니다.
          </p>
          <div className="space-y-3">
            <Link
              href="/reflection"
              className="block w-full text-center bg-brand text-white py-3 rounded-[8px] text-[14px] font-medium hover:bg-brand-hover transition min-h-[44px] flex items-center justify-center"
            >
              성찰문 등록
            </Link>
            <Link
              href="/reflection/view"
              className="block w-full text-center border border-border-strong text-text-secondary py-3 rounded-[8px] text-[14px] font-medium hover:bg-surface-subtle transition min-h-[44px] flex items-center justify-center"
            >
              조회 및 지도
            </Link>
            <Link
              href="/reflection/stats"
              className="block w-full text-center border border-border text-text-tertiary py-3 rounded-[8px] text-[14px] font-medium hover:bg-surface-subtle transition min-h-[44px] flex items-center justify-center"
            >
              통계 현황
            </Link>
          </div>
        </div>
      </div>

      {/* 다운로드 배너 */}
      <div className="bg-surface-subtle rounded-[12px] p-5 text-center border border-border">
        <a
          href="https://drive.google.com/file/d/179bm-MjqtOp3hUHGziv1PXedRZZSh8d2/view?usp=drive_link"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[14px] text-brand font-bold hover:underline"
        >
          회복적 성찰문 양식 다운로드
        </a>
      </div>
    </div>
  );
}
