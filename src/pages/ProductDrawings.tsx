import { FileText, Download } from 'lucide-react';

export default function ProductDrawings() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">제품 도면</h1>
                <p className="text-sm text-gray-500 mt-1">제품 도면 및 기술 문서를 관리합니다.</p>
            </div>

            <div className="bg-white p-12 rounded-xl border border-gray-200 shadow-sm text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">등록된 도면이 없습니다</h3>
                <p className="text-gray-500 mb-6">아직 등록된 제품 도면이 없습니다. 관리자에게 문의하세요.</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
                    <Download size={18} />
                    도면 업로드 (준비중)
                </button>
            </div>
        </div>
    );
}
