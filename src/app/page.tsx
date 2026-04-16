import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">마주봄</h1>
        <p className="text-gray-500">회복적 상담 및 성찰문 통합 관리 시스템</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-blue-600 mb-4">상담 프로그램</h2>
          <p className="text-gray-600 text-sm mb-6">
            일반 상담 및 회복적 상담 일지를 작성하고 관리합니다.
          </p>
          <div className="space-y-3">
            <Link
              href="/counseling"
              className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              상담 작성
            </Link>
            <Link
              href="/counseling/manage"
              className="block w-full text-center border border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
            >
              상담 관리
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-blue-600 mb-4">성찰문 관리</h2>
          <p className="text-gray-600 text-sm mb-6">
            학생 성찰문을 등록하고, 지도 기록을 관리합니다.
          </p>
          <div className="space-y-3">
            <Link
              href="/reflection"
              className="block w-full text-center bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              성찰문 등록
            </Link>
            <Link
              href="/reflection/view"
              className="block w-full text-center border border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
            >
              조회 및 지도
            </Link>
            <Link
              href="/reflection/stats"
              className="block w-full text-center border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition"
            >
              통계 현황
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border-2 border-dashed border-blue-300 rounded-xl p-5 text-center">
        <a
          href="https://drive.google.com/file/d/179bm-MjqtOp3hUHGziv1PXedRZZSh8d2/view?usp=drive_link"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 font-bold hover:underline"
        >
          회복적 성찰문 양식 다운로드
        </a>
      </div>
    </div>
  );
}
