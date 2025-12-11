import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { FileSpreadsheet, Plus, Download, Save, Calculator, RefreshCw, X } from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

interface QuoteItem {
    id: string;
    seqNo: number;
    productCategory: string;
    description: string;
    quantity: number;
    standardPrice: number;  // 판매점가
    specialPrice: number;   // 특가
    discountRate: number;
    // 원가 분석 필드
    costPrice: number;      // 판매원가
    userPrice: number;      // 유저가
    moq: number;            // MOQ
    negoRate: number;       // 네고율
    expectedDelivery: string; // 예상 납기
}

interface QuoteHeader {
    recipient: string;
    reference: string;
    quoteDate: string;
    validityDate: string;
    deliveryDate: string;
    paymentTerms: string;
    notes: string;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('ko-KR').format(value);
};

export default function SpecialQuotation() {
    const today = new Date();
    const validityDefault = new Date(today);
    validityDefault.setDate(validityDefault.getDate() + 60);

    const [header, setHeader] = useState<QuoteHeader>({
        recipient: '',
        reference: '',
        quoteDate: formatDate(today),
        validityDate: formatDate(validityDefault),
        deliveryDate: '협의',
        paymentTerms: '정기결제',
        notes: '상기 가격은 해당 프로젝트에만 적용되는 특가입니다.'
    });

    const [items, setItems] = useState<QuoteItem[]>([
        {
            id: generateId(),
            seqNo: 1,
            productCategory: '',
            description: '',
            quantity: 1,
            standardPrice: 0,
            specialPrice: 0,
            discountRate: 0,
            costPrice: 0,
            userPrice: 0,
            moq: 0,
            negoRate: 0,
            expectedDelivery: ''
        }
    ]);

    const [isSaving, setIsSaving] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [savedQuoteNumber, setSavedQuoteNumber] = useState<string | null>(null);

    // 품목 추가
    const addItem = useCallback(() => {
        const newSeqNo = items.length + 1;
        setItems(prev => [...prev, {
            id: generateId(),
            seqNo: newSeqNo,
            productCategory: '',
            description: '',
            quantity: 1,
            standardPrice: 0,
            specialPrice: 0,
            discountRate: 0,
            costPrice: 0,
            userPrice: 0,
            moq: 0,
            negoRate: 0,
            expectedDelivery: ''
        }]);
    }, [items.length]);

    // 품목 삭제
    const removeItem = useCallback((id: string) => {
        setItems(prev => {
            const filtered = prev.filter(item => item.id !== id);
            return filtered.map((item, index) => ({ ...item, seqNo: index + 1 }));
        });
    }, []);

    // 품목 수정
    const updateItem = useCallback((id: string, field: keyof QuoteItem, value: string | number) => {
        setItems(prev => prev.map(item => {
            if (item.id !== id) return item;

            const updated = { ...item, [field]: value };

            // 할인율 자동 계산 (판매점가와 특가단가가 모두 있을 때 참고용으로 표시)
            if (field === 'standardPrice' || field === 'specialPrice') {
                const standardPrice = field === 'standardPrice' ? Number(value) : item.standardPrice;
                const specialPrice = field === 'specialPrice' ? Number(value) : item.specialPrice;

                if (standardPrice > 0 && specialPrice > 0) {
                    const calculatedRate = ((standardPrice - specialPrice) / standardPrice) * 100;
                    // 할인율이 이미 입력되어 있지 않으면 자동 계산값 표시
                    if (item.discountRate === 0 || field === 'standardPrice' || field === 'specialPrice') {
                        updated.discountRate = Math.round(calculatedRate * 10) / 10;
                    }
                }
            }

            return updated;
        }));
    }, []);

    // 총액 계산
    const totalAmount = items.reduce((sum, item) => sum + (item.specialPrice * item.quantity), 0);

    // 견적 저장
    const handleSave = async () => {
        if (!header.recipient) {
            alert('수신처를 입력해주세요.');
            return;
        }

        if (items.every(item => !item.description)) {
            alert('최소 1개 이상의 품목을 입력해주세요.');
            return;
        }

        setIsSaving(true);
        try {
            // 견적번호 생성
            const { data: quoteNumberData, error: quoteNumberError } = await supabase
                .rpc('generate_quote_number');

            if (quoteNumberError) throw quoteNumberError;

            const quoteNumber = quoteNumberData;

            // 견적 헤더 저장
            const { data: quoteData, error: quoteError } = await supabase
                .from('quote_history')
                .insert([{
                    quote_number: quoteNumber,
                    recipient: header.recipient,
                    reference: header.reference,
                    quote_date: header.quoteDate,
                    validity_date: header.validityDate,
                    delivery_date: header.deliveryDate,
                    payment_terms: header.paymentTerms,
                    total_amount: totalAmount,
                    notes: header.notes,
                    created_by: '남부전략영업소'
                }])
                .select()
                .single();

            if (quoteError) throw quoteError;

            // 견적 품목 저장
            const itemsToInsert = items
                .filter(item => item.description)
                .map(item => ({
                    quote_id: quoteData.id,
                    seq_no: item.seqNo,
                    product_category: item.productCategory,
                    description: item.description,
                    quantity: item.quantity,
                    standard_price: item.standardPrice,
                    special_price: item.specialPrice,
                    discount_rate: item.discountRate
                }));

            const { error: itemsError } = await supabase
                .from('quote_items')
                .insert(itemsToInsert);

            if (itemsError) throw itemsError;

            setSavedQuoteNumber(quoteNumber);
            alert(`견적서가 저장되었습니다.\n견적번호: ${quoteNumber}`);

        } catch (err: any) {
            console.error('Error saving quote:', err);
            alert('견적서 저장 중 오류가 발생했습니다: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    // 엑셀 출력
    const handleExportExcel = async () => {
        if (!header.recipient) {
            alert('수신처를 입력해주세요.');
            return;
        }

        setIsExporting(true);
        try {
            // 템플릿 파일 로드
            const response = await fetch('/원가 분석표_엠텍FA_피엠씨_25825.xlsx');
            const arrayBuffer = await response.arrayBuffer();

            const workbook = new ExcelJS.Workbook();
            await workbook.xlsx.load(arrayBuffer);

            const worksheet = workbook.getWorksheet('견적서');
            if (!worksheet) {
                throw new Error('견적서 시트를 찾을 수 없습니다.');
            }

            // 헤더 데이터 입력
            const quoteNumber = savedQuoteNumber || `${formatDate(new Date()).replace(/-/g, '')}-DRAFT`;
            worksheet.getCell('D10').value = quoteNumber;
            worksheet.getCell('D11').value = header.recipient;
            worksheet.getCell('D12').value = header.reference;
            worksheet.getCell('D13').value = new Date(header.quoteDate);
            worksheet.getCell('D14').value = new Date(header.validityDate);
            worksheet.getCell('D15').value = header.deliveryDate;
            worksheet.getCell('D17').value = header.paymentTerms;

            // 품목 데이터 입력 (Row 24부터 시작)
            const startRow = 24;
            items.filter(item => item.description).forEach((item, index) => {
                const rowIndex = startRow + index;
                worksheet.getCell(`A${rowIndex}`).value = item.seqNo;
                worksheet.getCell(`B${rowIndex}`).value = item.productCategory;
                worksheet.getCell(`E${rowIndex}`).value = item.description;
                worksheet.getCell(`G${rowIndex}`).value = item.quantity;
                worksheet.getCell(`H${rowIndex}`).value = item.specialPrice;
                worksheet.getCell(`I${rowIndex}`).value = item.standardPrice;
            });

            // 비고 입력
            if (header.notes) {
                worksheet.getCell('D29').value = header.notes;
            }

            // 견적서 시트만 남기고 나머지 시트 삭제
            const sheetsToRemove: string[] = [];
            workbook.eachSheet((sheet) => {
                if (sheet.name !== '견적서') {
                    sheetsToRemove.push(sheet.name);
                }
            });
            sheetsToRemove.forEach(sheetName => {
                workbook.removeWorksheet(sheetName);
            });

            // 파일 다운로드
            const buffer = await workbook.xlsx.writeBuffer();
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, `견적서_${header.recipient}_${formatDate(new Date())}.xlsx`);

        } catch (err: any) {
            console.error('Error exporting Excel:', err);
            alert('엑셀 출력 중 오류가 발생했습니다: ' + err.message);
        } finally {
            setIsExporting(false);
        }
    };

    // 새 견적 시작
    const handleReset = () => {
        if (!confirm('현재 작성 중인 내용이 삭제됩니다. 계속하시겠습니까?')) return;

        setHeader({
            recipient: '',
            reference: '',
            quoteDate: formatDate(today),
            validityDate: formatDate(validityDefault),
            deliveryDate: '협의',
            paymentTerms: '정기결제',
            notes: ''
        });
        setItems([{
            id: generateId(),
            seqNo: 1,
            productCategory: '',
            description: '',
            quantity: 1,
            standardPrice: 0,
            specialPrice: 0,
            discountRate: 0,
            costPrice: 0,
            userPrice: 0,
            moq: 0,
            negoRate: 0,
            expectedDelivery: ''
        }]);
        setSavedQuoteNumber(null);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                            <FileSpreadsheet size={20} className="text-white" />
                        </div>
                        특가 견적서
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        B2B 특가 승인을 위한 견적서를 작성합니다.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2.5 text-muted-foreground hover:text-white hover:bg-secondary/50 rounded-lg transition-colors"
                    >
                        <RefreshCw size={18} />
                        새로 작성
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                        <Save size={18} />
                        {isSaving ? '저장 중...' : '저장'}
                    </button>
                    <button
                        onClick={handleExportExcel}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg hover:from-orange-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-orange-500/25 disabled:opacity-50"
                    >
                        <Download size={18} />
                        {isExporting ? '출력 중...' : '견적서 발행'}
                    </button>
                </div>
            </div>

            {/* 원가 분석표 (메인 입력 영역) */}
            <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-purple-500/30 overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-purple-500/10 to-pink-500/10">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <Calculator size={20} className="text-purple-400" />
                        원가 분석표 <span className="text-xs text-purple-400/70 font-normal">(내부 분석용 - 출력 미포함)</span>
                    </h2>
                    <button
                        onClick={addItem}
                        className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors text-sm"
                    >
                        <Plus size={16} />
                        품목 추가
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-purple-500/10 border-b border-border">
                            <tr>
                                <th className="px-2 py-2 text-center text-xs font-bold text-muted-foreground w-10">순번</th>
                                <th className="px-2 py-2 text-left text-xs font-bold text-muted-foreground w-24">제품군</th>
                                <th className="px-2 py-2 text-left text-xs font-bold text-muted-foreground w-20">품번(형번)</th>
                                <th className="px-2 py-2 text-center text-xs font-bold text-muted-foreground w-16">수량</th>
                                <th className="px-2 py-2 text-right text-xs font-bold text-muted-foreground w-20">판매원가</th>
                                <th className="px-2 py-2 text-right text-xs font-bold text-muted-foreground w-20">판매점가</th>
                                <th className="px-2 py-2 text-center text-xs font-bold text-muted-foreground w-14">MOQ</th>
                                <th className="px-2 py-2 text-right text-xs font-bold text-purple-400 w-20 bg-purple-500/5">특가</th>
                                <th className="px-2 py-2 text-right text-xs font-bold text-muted-foreground w-20">유저가</th>
                                <th className="px-2 py-2 text-center text-xs font-bold text-green-400 w-16">당사이익률</th>
                                <th className="px-2 py-2 text-center text-xs font-bold text-blue-400 w-18">판매점이익률</th>
                                <th className="px-2 py-2 text-center text-xs font-bold text-amber-400 w-20">판매점가이익률</th>
                                <th className="px-2 py-2 text-center text-xs font-bold text-muted-foreground w-14">네고율</th>
                                <th className="px-2 py-2 text-left text-xs font-bold text-muted-foreground w-16">예상납기</th>
                                <th className="px-2 py-2 w-8"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {items.map((item) => {
                                const companyMargin = item.specialPrice > 0 ? ((item.specialPrice - item.costPrice) / item.specialPrice * 100) : 0;
                                const distributorMargin = item.userPrice > 0 ? ((item.userPrice - item.specialPrice) / item.userPrice * 100) : 0;
                                const standardMargin = item.standardPrice > 0 ? ((item.standardPrice - item.costPrice) / item.standardPrice * 100) : 0;
                                const negoRate = item.standardPrice > 0 ? ((item.standardPrice - item.specialPrice) / item.standardPrice * 100) : 0;

                                return (
                                    <tr key={`analysis-${item.id}`} className="hover:bg-purple-500/5 transition-colors">
                                        <td className="px-2 py-2 text-center text-white text-sm">{item.seqNo}</td>
                                        <td className="px-2 py-2">
                                            <input type="text" value={item.productCategory} onChange={(e) => updateItem(item.id, 'productCategory', e.target.value)} placeholder="센서" className="w-full px-1 py-1 bg-transparent text-white text-sm border border-transparent hover:border-border focus:border-purple-500 rounded transition-colors focus:outline-none" />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input type="text" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} placeholder="모델명/형번" className="w-full px-1 py-1 bg-transparent text-white text-sm border border-transparent hover:border-border focus:border-purple-500 rounded transition-colors focus:outline-none" />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input type="number" value={item.quantity || ''} onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} placeholder="1" className="w-full px-1 py-1 bg-transparent text-white text-center text-sm border border-transparent hover:border-border focus:border-purple-500 rounded transition-colors focus:outline-none" />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input type="number" value={item.costPrice || ''} onChange={(e) => updateItem(item.id, 'costPrice', parseFloat(e.target.value) || 0)} placeholder="0" className="w-full px-1 py-1 bg-transparent text-white text-right text-sm border border-transparent hover:border-border focus:border-purple-500 rounded transition-colors focus:outline-none" />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input type="number" value={item.standardPrice || ''} onChange={(e) => updateItem(item.id, 'standardPrice', parseFloat(e.target.value) || 0)} placeholder="0" className="w-full px-1 py-1 bg-transparent text-white text-right text-sm border border-transparent hover:border-border focus:border-purple-500 rounded transition-colors focus:outline-none" />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input type="number" value={item.moq || ''} onChange={(e) => updateItem(item.id, 'moq', parseInt(e.target.value) || 0)} placeholder="0" className="w-full px-1 py-1 bg-transparent text-white text-center text-sm border border-transparent hover:border-border focus:border-purple-500 rounded transition-colors focus:outline-none" />
                                        </td>
                                        <td className="px-2 py-2 bg-purple-500/5">
                                            <input type="number" value={item.specialPrice || ''} onChange={(e) => updateItem(item.id, 'specialPrice', parseFloat(e.target.value) || 0)} placeholder="0" className="w-full px-1 py-1 bg-transparent text-purple-400 font-bold text-right text-sm border border-transparent hover:border-purple-500/50 focus:border-purple-500 rounded transition-colors focus:outline-none" />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input type="number" value={item.userPrice || ''} onChange={(e) => updateItem(item.id, 'userPrice', parseFloat(e.target.value) || 0)} placeholder="0" className="w-full px-1 py-1 bg-transparent text-white text-right text-sm border border-transparent hover:border-border focus:border-purple-500 rounded transition-colors focus:outline-none" />
                                        </td>
                                        <td className="px-2 py-2 text-center">
                                            <span className={`text-xs font-medium ${companyMargin > 0 ? 'text-green-400' : companyMargin < 0 ? 'text-red-400' : 'text-muted-foreground'}`}>{companyMargin !== 0 ? `${companyMargin.toFixed(1)}%` : '-'}</span>
                                        </td>
                                        <td className="px-2 py-2 text-center">
                                            <span className={`text-xs font-medium ${distributorMargin > 0 ? 'text-blue-400' : distributorMargin < 0 ? 'text-red-400' : 'text-muted-foreground'}`}>{distributorMargin !== 0 ? `${distributorMargin.toFixed(1)}%` : '-'}</span>
                                        </td>
                                        <td className="px-2 py-2 text-center">
                                            <span className={`text-xs font-medium ${standardMargin > 0 ? 'text-amber-400' : standardMargin < 0 ? 'text-red-400' : 'text-muted-foreground'}`}>{standardMargin !== 0 ? `${standardMargin.toFixed(1)}%` : '-'}</span>
                                        </td>
                                        <td className="px-2 py-2 text-center">
                                            <span className={`text-xs font-medium ${negoRate > 0 ? 'text-cyan-400' : negoRate < 0 ? 'text-red-400' : 'text-muted-foreground'}`}>{negoRate !== 0 ? `${negoRate.toFixed(1)}%` : '-'}</span>
                                        </td>
                                        <td className="px-2 py-2">
                                            <input type="text" value={item.expectedDelivery} onChange={(e) => updateItem(item.id, 'expectedDelivery', e.target.value)} placeholder="4주" className="w-full px-1 py-1 bg-transparent text-white text-sm border border-transparent hover:border-border focus:border-purple-500 rounded transition-colors focus:outline-none" />
                                        </td>
                                        <td className="px-2 py-2">
                                            {items.length > 1 && (
                                                <button onClick={() => removeItem(item.id)} className="p-1 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded transition-colors">
                                                    <X size={14} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 견적 정보 카드 */}
            <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Calculator size={20} className="text-orange-400" />
                    견적 정보
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1.5">수신 *</label>
                        <input
                            type="text"
                            value={header.recipient}
                            onChange={(e) => setHeader(prev => ({ ...prev, recipient: e.target.value }))}
                            placeholder="판매점명 / 담당자명"
                            className="w-full px-4 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1.5">참조</label>
                        <input
                            type="text"
                            value={header.reference}
                            onChange={(e) => setHeader(prev => ({ ...prev, reference: e.target.value }))}
                            placeholder="최종 납품처 / 프로젝트명"
                            className="w-full px-4 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1.5">견적일자</label>
                        <input
                            type="date"
                            value={header.quoteDate}
                            onChange={(e) => setHeader(prev => ({ ...prev, quoteDate: e.target.value }))}
                            className="w-full px-4 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1.5">유효기간</label>
                        <input
                            type="date"
                            value={header.validityDate}
                            onChange={(e) => setHeader(prev => ({ ...prev, validityDate: e.target.value }))}
                            className="w-full px-4 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1.5">납품일자</label>
                        <input
                            type="text"
                            value={header.deliveryDate}
                            onChange={(e) => setHeader(prev => ({ ...prev, deliveryDate: e.target.value }))}
                            placeholder="협의"
                            className="w-full px-4 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1.5">결제조건</label>
                        <input
                            type="text"
                            value={header.paymentTerms}
                            onChange={(e) => setHeader(prev => ({ ...prev, paymentTerms: e.target.value }))}
                            placeholder="정기결제"
                            className="w-full px-4 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-muted-foreground mb-1.5">비고</label>
                        <input
                            type="text"
                            value={header.notes}
                            onChange={(e) => setHeader(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="◆ 상기 가격은 해당 프로젝트에만 적용되는 특가입니다."
                            className="w-full px-4 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        />
                    </div>
                </div>
            </div>

            {/* 품목 리스트 - 견적서 미리보기 (읽기 전용) */}
            <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border overflow-hidden">
                <div className="p-4 border-b border-border bg-gradient-to-r from-orange-500/5 to-amber-500/5">
                    <h2 className="text-lg font-bold text-white flex items-center gap-2">
                        <FileSpreadsheet size={20} className="text-orange-400" />
                        견적서 미리보기 <span className="text-xs text-orange-400/70 font-normal">(엑셀 출력용)</span>
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-secondary/30 border-b border-border">
                            <tr>
                                <th className="px-4 py-3 text-center text-sm font-bold text-muted-foreground w-16">순번</th>
                                <th className="px-4 py-3 text-left text-sm font-bold text-muted-foreground w-32">제품군</th>
                                <th className="px-4 py-3 text-left text-sm font-bold text-muted-foreground min-w-[200px]">내용(형번)</th>
                                <th className="px-4 py-3 text-center text-sm font-bold text-muted-foreground w-24">판매로트</th>
                                <th className="px-4 py-3 text-right text-sm font-bold text-muted-foreground w-32">판매점가</th>
                                <th className="px-4 py-3 text-right text-sm font-bold text-orange-400 w-32 bg-orange-500/5">특가단가</th>
                                <th className="px-4 py-3 text-center text-sm font-bold text-muted-foreground w-24">할인율</th>
                                <th className="px-4 py-3 text-right text-sm font-bold text-muted-foreground w-32">금액</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {items.filter(item => item.description).map((item) => (
                                <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                                    <td className="px-4 py-3 text-center text-white">{item.seqNo}</td>
                                    <td className="px-4 py-3 text-white">{item.productCategory || '-'}</td>
                                    <td className="px-4 py-3 text-white">{item.description || '-'}</td>
                                    <td className="px-4 py-3 text-center text-white">{item.quantity}</td>
                                    <td className="px-4 py-3 text-right text-white">{formatCurrency(item.standardPrice)}</td>
                                    <td className="px-4 py-3 text-right text-orange-400 font-bold bg-orange-500/5">{formatCurrency(item.specialPrice)}</td>
                                    <td className="px-4 py-3 text-center">
                                        <span className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${item.discountRate > 0 ? 'bg-green-500/10 text-green-400' : 'text-muted-foreground'}`}>
                                            {item.discountRate > 0 ? `📉 ${item.discountRate.toFixed(1)}%` : '-'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-right text-white font-medium">{formatCurrency(item.specialPrice * item.quantity)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {items.filter(i => i.description).length === 0 && (
                    <div className="p-8 text-center text-muted-foreground">
                        원가 분석표에 품목을 입력하면 미리보기가 표시됩니다.
                    </div>
                )}

                {/* 합계 */}
                <div className="px-6 py-4 border-t border-border bg-gradient-to-r from-orange-500/5 to-amber-500/5 flex items-center justify-between">
                    <span className="text-muted-foreground">
                        총 {items.filter(i => i.description).length}개 품목
                    </span>
                    <div className="flex items-center gap-4">
                        <span className="text-muted-foreground">합계:</span>
                        <span className="text-2xl font-bold text-orange-400">
                            ₩ {formatCurrency(totalAmount)}
                        </span>
                    </div>
                </div>
            </div>

            {/* 저장된 견적번호 표시 */}
            {savedQuoteNumber && (
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <Save size={16} className="text-green-400" />
                    </div>
                    <div>
                        <p className="text-green-400 font-medium">견적서가 저장되었습니다</p>
                        <p className="text-sm text-green-400/70">견적번호: {savedQuoteNumber}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
