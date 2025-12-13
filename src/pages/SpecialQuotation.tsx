import { useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { FileSpreadsheet, Plus, Save, Calculator, RefreshCw, X, Mail, FileText } from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

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
    costPriceLot: number;   // 판매원가 로트
    userPrice: number;      // 유저가
    moq: number;            // MOQ
    negoRate: number;       // 네고율
    expectedDelivery: string; // 예상 납기
}

interface QuoteHeader {
    storeName: string;         // 판매점명
    contactName: string;       // 담당자명
    finalDestination: string;  // 최종 납품처
    projectName: string;       // 프로젝트명
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

// 수신 필드 조합: 판매점명 / 담당자명
const getRecipient = (storeName: string, contactName: string): string => {
    if (storeName && contactName) return `${storeName} / ${contactName}`;
    return storeName || contactName || '';
};

// 참조 필드 조합: 최종 납품처 / 프로젝트명
const getReference = (finalDestination: string, projectName: string): string => {
    if (finalDestination && projectName) return `${finalDestination} / ${projectName}`;
    return finalDestination || projectName || '';
};

export default function SpecialQuotation() {
    const today = new Date();
    const validityDefault = new Date(today);
    validityDefault.setMonth(validityDefault.getMonth() + 1); // 한달 후

    const [header, setHeader] = useState<QuoteHeader>({
        storeName: '',
        contactName: '',
        finalDestination: '',
        projectName: '',
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
            costPriceLot: 0,
            userPrice: 0,
            moq: 0,
            negoRate: 0,
            expectedDelivery: ''
        }
    ]);

    const [isSaving, setIsSaving] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [savedQuoteNumber, setSavedQuoteNumber] = useState<string | null>(null);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [emailTo, setEmailTo] = useState('');
    const [emailSubject, setEmailSubject] = useState('');
    const [emailBody, setEmailBody] = useState('');
    const [isSendingEmail, setIsSendingEmail] = useState(false);
    const [_quoteLink, setQuoteLink] = useState<string | null>(null);
    const [_isUploadingPDF, setIsUploadingPDF] = useState(false);

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
            costPriceLot: 0,
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
        if (!header.storeName) {
            alert('판매점명을 입력해주세요.');
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
                    recipient: getRecipient(header.storeName, header.contactName),
                    reference: getReference(header.finalDestination, header.projectName),
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
                .map(item => {
                    // 당사이익률 계산: (특가 - 판매원가) / 판매원가 * 100
                    const companyProfitRate = item.costPrice > 0
                        ? ((item.specialPrice - item.costPrice) / item.costPrice) * 100
                        : 0;
                    // 판매점가이익률 계산: (판매점가 - 특가) / 판매점가 * 100
                    const storeProfitRate = item.standardPrice > 0
                        ? ((item.standardPrice - item.specialPrice) / item.standardPrice) * 100
                        : 0;

                    return {
                        quote_id: quoteData.id,
                        seq_no: item.seqNo,
                        product_category: item.productCategory,
                        description: item.description,
                        quantity: item.quantity,
                        standard_price: item.standardPrice,
                        special_price: item.specialPrice,
                        discount_rate: item.discountRate,
                        cost_price: item.costPrice || 0,
                        cost_price_lot: item.costPriceLot || 0,
                        user_price: item.userPrice || 0,
                        moq: item.moq || 0,
                        company_profit_rate: companyProfitRate,
                        store_profit_rate: storeProfitRate,
                        nego_rate: item.negoRate || 0,
                        expected_delivery: item.expectedDelivery || ''
                    };
                });

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

    // 엑셀 출력 (현재 사용 안함, 나중에 사용 예정)
    // @ts-expect-error - Function reserved for future use
    const _handleExportExcel = async () => {
        if (!header.storeName) {
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
            worksheet.getCell('D11').value = getRecipient(header.storeName, header.contactName);
            worksheet.getCell('D12').value = getReference(header.finalDestination, header.projectName);
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
            saveAs(blob, `견적서_${getRecipient(header.storeName, header.contactName)}_${formatDate(new Date())}.xlsx`);

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
            storeName: '',
            contactName: '',
            finalDestination: '',
            projectName: '',
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
            costPriceLot: 0,
            userPrice: 0,
            moq: 0,
            negoRate: 0,
            expectedDelivery: ''
        }]);
        setSavedQuoteNumber(null);
    };

    // PDF 견적서 발행 (html2canvas 사용)
    const handleExportPDF = async () => {
        if (!header.storeName) {
            alert('수신처를 입력해주세요.');
            return;
        }

        setIsExporting(true);
        try {
            // 견적번호 형식: YYYY-MMDD-01
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const quoteNumber = savedQuoteNumber || `${year}-${month}${day}-01`;
            const validItems = items.filter(item => item.description);

            // Create hidden div for PDF content
            const pdfContent = document.createElement('div');
            pdfContent.style.cssText = 'position: absolute; left: -9999px; width: 800px; padding: 40px; background: white; font-family: "Malgun Gothic", "맑은 고딕", sans-serif;';

            pdfContent.innerHTML = `
                <div style="border: 2px solid #000; padding: 35px;">
                    <!-- 헤더 -->
                    <div style="text-align: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 2px solid #000;">
                        <h1 style="font-size: 36px; color: #000; margin: 0; letter-spacing: 8px; font-weight: 800;">견 적 서</h1>
                        <p style="font-size: 12px; color: #333; margin: 8px 0 0; letter-spacing: 3px;">QUOTATION</p>
                    </div>
                    
                    <!-- 회사 정보 -->
                    <div style="display: flex; justify-content: flex-end; margin-bottom: 25px;">
                        <div style="text-align: right; font-size: 13px; color: #000; padding: 15px 20px; border: 1px solid #333;">
                            <p style="margin: 4px 0; font-weight: bold; font-size: 15px; color: #000;">(주) 컨범코리아</p>
                            <p style="margin: 4px 0; color: #333;">남부전략영업소</p>
                            <p style="margin: 4px 0; color: #333;">탁현호 소장</p>
                            <p style="margin: 4px 0; color: #000; font-weight: 500;">Tel. 010-4981-8390</p>
                        </div>
                    </div>
                    
                    <!-- 견적 정보 -->
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; border: 1px solid #333;">
                        <tr>
                            <td style="padding: 10px 16px; width: 50%; border-bottom: 1px solid #ccc; border-right: 1px solid #ccc;"><strong style="color: #000;">• 견적번호</strong>&nbsp;&nbsp;<span style="color: #000;">${quoteNumber}</span></td>
                            <td style="padding: 10px 16px; width: 50%; border-bottom: 1px solid #ccc;"><strong style="color: #000;">• 견적일</strong>&nbsp;&nbsp;<span style="color: #000;">${header.quoteDate}</span></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 16px; border-bottom: 1px solid #ccc; border-right: 1px solid #ccc;"><strong style="color: #000;">• 수신</strong>&nbsp;&nbsp;<span style="color: #000; font-weight: 600;">${getRecipient(header.storeName, header.contactName)}</span></td>
                            <td style="padding: 10px 16px; border-bottom: 1px solid #ccc;"><strong style="color: #000;">• 유효기간</strong>&nbsp;&nbsp;<span style="color: #000;">${header.validityDate}</span></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 16px; border-bottom: 1px solid #ccc; border-right: 1px solid #ccc;"><strong style="color: #000;">• 참조</strong>&nbsp;&nbsp;<span style="color: #000;">${getReference(header.finalDestination, header.projectName) || '-'}</span></td>
                            <td style="padding: 10px 16px; border-bottom: 1px solid #ccc;"><strong style="color: #000;">• 결제조건</strong>&nbsp;&nbsp;<span style="color: #000;">${header.paymentTerms}</span></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 16px; border-right: 1px solid #ccc;"></td>
                            <td style="padding: 10px 16px;"><strong style="color: #000;">• 납기</strong>&nbsp;&nbsp;<span style="color: #000;">${header.deliveryDate}</span></td>
                        </tr>
                    </table>
                    
                    <!-- 품목 테이블 -->
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; border: 1px solid #000;">
                        <thead>
                            <tr style="background: #333; color: white;">
                                <th style="padding: 12px 10px; text-align: center; border: 1px solid #000; font-weight: 600; width: 8%;">#</th>
                                <th style="padding: 12px 10px; text-align: center; border: 1px solid #000; font-weight: 600; width: 15%;">제품군</th>
                                <th style="padding: 12px 10px; text-align: center; border: 1px solid #000; font-weight: 600; width: 32%;">품번(형번)</th>
                                <th style="padding: 12px 10px; text-align: center; border: 1px solid #000; font-weight: 600; width: 10%;">수량</th>
                                <th style="padding: 12px 10px; text-align: center; border: 1px solid #000; font-weight: 600; width: 17%;">단가</th>
                                <th style="padding: 12px 10px; text-align: center; border: 1px solid #000; font-weight: 600; width: 18%;">금액</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${validItems.map((item, i) => `
                                <tr style="background: ${i % 2 === 0 ? '#fff' : '#f5f5f5'};">
                                    <td style="padding: 12px 10px; text-align: center; vertical-align: middle; border: 1px solid #ccc; color: #000; font-weight: 500;">${item.seqNo}</td>
                                    <td style="padding: 12px 10px; text-align: center; vertical-align: middle; border: 1px solid #ccc; color: #000;">${item.productCategory || '-'}</td>
                                    <td style="padding: 12px 10px; text-align: center; vertical-align: middle; border: 1px solid #ccc; color: #000; font-weight: 500;">${item.description}</td>
                                    <td style="padding: 12px 10px; text-align: center; vertical-align: middle; border: 1px solid #ccc; color: #000; font-weight: 600;">${item.quantity}</td>
                                    <td style="padding: 12px 10px; text-align: center; vertical-align: middle; border: 1px solid #ccc; color: #000;">${formatCurrency(item.specialPrice)}원</td>
                                    <td style="padding: 12px 10px; text-align: center; vertical-align: middle; border: 1px solid #ccc; color: #000; font-weight: 700;">${formatCurrency(item.quantity * item.specialPrice)}원</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    
                    <!-- 합계 -->
                    <div style="background: #f5f5f5; padding: 20px 25px; display: flex; justify-content: flex-end; align-items: center; margin-bottom: 25px; border: 2px solid #000;">
                        <span style="font-size: 16px; color: #333; margin-right: 15px;">합계 금액</span>
                        <span style="font-size: 28px; font-weight: 800; color: #000; letter-spacing: 1px;">${formatCurrency(totalAmount)}원</span>
                    </div>
                    
                    ${header.notes ? `
                        <div style="background: #f5f5f5; padding: 15px 20px; margin-bottom: 20px; border-left: 4px solid #000;">
                            <strong style="color: #000;">• 비고</strong>
                            <p style="color: #333; margin: 8px 0 0; font-size: 13px; line-height: 1.6;">${header.notes}</p>
                        </div>
                    ` : ''}
                    
                    <!-- 푸터 -->
                    <div style="text-align: center; padding-top: 20px; border-top: 1px solid #ccc;">
                        <p style="font-size: 11px; color: #333; margin: 0;">※ 상기 가격은 부가세 별도입니다.</p>
                        <p style="font-size: 10px; color: #666; margin: 5px 0 0;">(주) 컨범코리아 | 남부전략영업소</p>
                    </div>
                </div>
            `;

            document.body.appendChild(pdfContent);

            // Import html2canvas dynamically
            const html2canvas = (await import('html2canvas')).default;

            // Capture as canvas
            const canvas = await html2canvas(pdfContent, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff'
            });

            document.body.removeChild(pdfContent);

            // Create PDF
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`견적서_${getRecipient(header.storeName, header.contactName)}_${formatDate(new Date())}.pdf`);

            alert('PDF 견적서가 다운로드되었습니다.');

        } catch (err: any) {
            console.error('Error exporting PDF:', err);
            alert('PDF 출력 중 오류가 발생했습니다: ' + err.message);
        } finally {
            setIsExporting(false);
        }
    };

    // PDF를 Supabase Storage에 업로드하고 공유 링크 생성
    const uploadPDFAndGetLink = async (): Promise<string | null> => {
        if (!header.storeName) {
            alert('수신처를 입력해주세요.');
            return null;
        }

        setIsUploadingPDF(true);
        try {
            // 견적번호 생성
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const quoteNumber = savedQuoteNumber || `${year}-${month}${day}-01`;
            const validItems = items.filter(item => item.description);
            const totalAmount = validItems.reduce((sum, item) => sum + (item.specialPrice * item.quantity), 0);

            // PDF 콘텐츠 생성 (handleExportPDF와 동일한 방식)
            const pdfContent = document.createElement('div');
            pdfContent.style.cssText = 'position: absolute; left: -9999px; width: 800px; padding: 40px; background: white; font-family: "Malgun Gothic", "맑은 고딕", sans-serif;';

            pdfContent.innerHTML = `
                <div style="border: 2px solid #000; padding: 35px;">
                    <div style="text-align: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 2px solid #000;">
                        <h1 style="font-size: 36px; color: #000; margin: 0; letter-spacing: 8px; font-weight: 800;">견 적 서</h1>
                        <p style="font-size: 12px; color: #333; margin: 8px 0 0; letter-spacing: 3px;">QUOTATION</p>
                    </div>
                    <div style="display: flex; justify-content: flex-end; margin-bottom: 25px;">
                        <div style="text-align: right; font-size: 13px; color: #000; padding: 15px 20px; border: 1px solid #333;">
                            <p style="margin: 4px 0; font-weight: bold; font-size: 15px; color: #000;">(주) 컨범코리아</p>
                            <p style="margin: 4px 0; color: #333;">남부전략영업소</p>
                            <p style="margin: 4px 0; color: #333;">탁현호 소장</p>
                            <p style="margin: 4px 0; color: #000; font-weight: 500;">Tel. 010-4981-8390</p>
                        </div>
                    </div>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; border: 1px solid #333;">
                        <tr>
                            <td style="padding: 10px 16px; width: 50%; border-bottom: 1px solid #ccc; border-right: 1px solid #ccc;"><strong style="color: #000;">• 견적번호</strong>&nbsp;&nbsp;<span style="color: #000;">${quoteNumber}</span></td>
                            <td style="padding: 10px 16px; width: 50%; border-bottom: 1px solid #ccc;"><strong style="color: #000;">• 견적일</strong>&nbsp;&nbsp;<span style="color: #000;">${header.quoteDate}</span></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 16px; border-bottom: 1px solid #ccc; border-right: 1px solid #ccc;"><strong style="color: #000;">• 수신</strong>&nbsp;&nbsp;<span style="color: #000; font-weight: 600;">${getRecipient(header.storeName, header.contactName)}</span></td>
                            <td style="padding: 10px 16px; border-bottom: 1px solid #ccc;"><strong style="color: #000;">• 유효기간</strong>&nbsp;&nbsp;<span style="color: #000;">${header.validityDate}</span></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 16px; border-bottom: 1px solid #ccc; border-right: 1px solid #ccc;"><strong style="color: #000;">• 참조</strong>&nbsp;&nbsp;<span style="color: #000;">${getReference(header.finalDestination, header.projectName) || '-'}</span></td>
                            <td style="padding: 10px 16px; border-bottom: 1px solid #ccc;"><strong style="color: #000;">• 결제조건</strong>&nbsp;&nbsp;<span style="color: #000;">${header.paymentTerms}</span></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 16px; border-right: 1px solid #ccc;"></td>
                            <td style="padding: 10px 16px;"><strong style="color: #000;">• 납기</strong>&nbsp;&nbsp;<span style="color: #000;">${header.deliveryDate}</span></td>
                        </tr>
                    </table>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px; border: 1px solid #000;">
                        <thead>
                            <tr style="background: #333; color: white;">
                                <th style="padding: 12px 10px; text-align: center; border: 1px solid #000; font-weight: 600; width: 8%;">#</th>
                                <th style="padding: 12px 10px; text-align: center; border: 1px solid #000; font-weight: 600; width: 15%;">제품군</th>
                                <th style="padding: 12px 10px; text-align: center; border: 1px solid #000; font-weight: 600; width: 32%;">품번(형번)</th>
                                <th style="padding: 12px 10px; text-align: center; border: 1px solid #000; font-weight: 600; width: 10%;">수량</th>
                                <th style="padding: 12px 10px; text-align: center; border: 1px solid #000; font-weight: 600; width: 17%;">단가</th>
                                <th style="padding: 12px 10px; text-align: center; border: 1px solid #000; font-weight: 600; width: 18%;">금액</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${validItems.map((item, i) => `
                                <tr style="background: ${i % 2 === 0 ? '#fff' : '#f5f5f5'};">
                                    <td style="padding: 12px 10px; text-align: center; vertical-align: middle; border: 1px solid #ccc; color: #000; font-weight: 500;">${item.seqNo}</td>
                                    <td style="padding: 12px 10px; text-align: center; vertical-align: middle; border: 1px solid #ccc; color: #000;">${item.productCategory || '-'}</td>
                                    <td style="padding: 12px 10px; text-align: center; vertical-align: middle; border: 1px solid #ccc; color: #000; font-weight: 500;">${item.description}</td>
                                    <td style="padding: 12px 10px; text-align: center; vertical-align: middle; border: 1px solid #ccc; color: #000; font-weight: 600;">${item.quantity}</td>
                                    <td style="padding: 12px 10px; text-align: center; vertical-align: middle; border: 1px solid #ccc; color: #000;">${formatCurrency(item.specialPrice)}원</td>
                                    <td style="padding: 12px 10px; text-align: center; vertical-align: middle; border: 1px solid #ccc; color: #000; font-weight: 700;">${formatCurrency(item.quantity * item.specialPrice)}원</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                    <div style="background: #f5f5f5; padding: 20px 25px; display: flex; justify-content: flex-end; align-items: center; margin-bottom: 25px; border: 2px solid #000;">
                        <span style="font-size: 16px; color: #333; margin-right: 15px;">합계 금액</span>
                        <span style="font-size: 28px; font-weight: 800; color: #000; letter-spacing: 1px;">${formatCurrency(totalAmount)}원</span>
                    </div>
                    ${header.notes ? `
                        <div style="background: #f5f5f5; padding: 15px 20px; margin-bottom: 20px; border-left: 4px solid #000;">
                            <strong style="color: #000;">• 비고</strong>
                            <p style="color: #333; margin: 8px 0 0; font-size: 13px; line-height: 1.6;">${header.notes}</p>
                        </div>
                    ` : ''}
                    <div style="text-align: center; padding-top: 20px; border-top: 1px solid #ccc;">
                        <p style="font-size: 11px; color: #333; margin: 0;">※ 상기 가격은 부가세 별도입니다.</p>
                        <p style="font-size: 10px; color: #666; margin: 5px 0 0;">(주) 컨범코리아 | 남부전략영업소</p>
                    </div>
                </div>
            `;

            document.body.appendChild(pdfContent);

            const html2canvas = (await import('html2canvas')).default;
            const { jsPDF } = await import('jspdf');

            const canvas = await html2canvas(pdfContent, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff'
            });

            document.body.removeChild(pdfContent);

            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgData = canvas.toDataURL('image/png');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            // PDF를 Blob으로 변환
            const pdfBlob = pdf.output('blob');

            // 파일명 생성 (한글 제거, ASCII만 사용)
            const safeRecipient = getRecipient(header.storeName, header.contactName).replace(/[^a-zA-Z0-9]/g, '') || 'quote';
            const fileName = `${quoteNumber.replace(/-/g, '')}_${safeRecipient}_${Date.now()}.pdf`;

            // Supabase Storage에 업로드
            const { data: _uploadData, error: uploadError } = await supabase.storage
                .from('quotes')
                .upload(fileName, pdfBlob, {
                    contentType: 'application/pdf',
                    upsert: true
                });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                throw new Error('PDF 업로드 실패: ' + uploadError.message);
            }

            // 공개 URL 생성 (1시간 동안 유효한 signed URL)
            const { data: signedUrlData, error: signedUrlError } = await supabase.storage
                .from('quotes')
                .createSignedUrl(fileName, 60 * 60 * 24 * 30); // 30일 유효

            if (signedUrlError) {
                throw new Error('URL 생성 실패: ' + signedUrlError.message);
            }

            const publicUrl = signedUrlData.signedUrl;

            // short_code 생성 (랜덤 8자리)
            const shortCode = Math.random().toString(36).substring(2, 10);

            // quote_links 테이블에 기록
            const { error: linkError } = await supabase
                .from('quote_links')
                .insert({
                    quote_number: quoteNumber,
                    recipient: getRecipient(header.storeName, header.contactName),
                    file_path: fileName,
                    public_url: publicUrl,
                    short_code: shortCode
                });

            if (linkError) {
                console.error('Link creation error:', linkError);
                // 링크 생성 실패해도 URL은 반환
            }

            // 짧은 URL 생성 (앱 도메인 + /q/shortCode)
            const baseUrl = window.location.origin;
            const shortUrl = `${baseUrl}/q/${shortCode}`;

            setQuoteLink(shortUrl);
            return shortUrl;

        } catch (err: any) {
            console.error('Error uploading PDF:', err);
            alert('PDF 업로드 중 오류가 발생했습니다: ' + err.message);
            return null;
        } finally {
            setIsUploadingPDF(false);
        }
    };

    // 이메일 발송 모달 열기
    const openEmailModal = async () => {
        if (!header.storeName) {
            alert('수신처를 입력해주세요.');
            return;
        }

        // 견적번호 형식: YYYY-MMDD-01
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const quoteNumber = savedQuoteNumber || `${year}-${month}${day}-01`;

        setEmailSubject(`[컨범코리아] ${getRecipient(header.storeName, header.contactName)} / ${getReference(header.finalDestination, header.projectName) || ''}님 견적서 (${quoteNumber})`);
        setEmailBody(`안녕하세요,

컨범코리아 남부전략영업소입니다.

요청하신 견적서를 첨부 드립니다.

■ 견적번호: ${quoteNumber}
■ 유효기간: ${header.validityDate}
■ 결제조건: ${header.paymentTerms}

문의사항 있으시면 연락 부탁드립니다.

감사합니다.

**********************************************
CONVUM KOREA CO., LTD.
Southern Strategic Sales Office / 남부전략영업소 탁현호 (TAK HYEON HO) 소장
우46721 부산광역시 강서구 유통단지1로 41 (대저2동) 부산티플렉스 128동 208호
FAX) 051-987-2352
H.P) 010-4981-8390
E-mail : thh0222@convum.co.kr
Home page : http://www.convum.co.kr
CONVUM은 CONVUM Ltd.의 브랜드명입니다.
**********************************************`);
        setShowEmailModal(true);
    };

    // 이메일 발송 - PDF 업로드 후 링크와 함께 Gmail 열기
    const handleSendEmail = async () => {
        if (!emailTo) {
            alert('수신자 이메일을 입력해주세요.');
            return;
        }

        setIsSendingEmail(true);
        try {
            // PDF를 Supabase Storage에 업로드하고 링크 받기
            const pdfLink = await uploadPDFAndGetLink();

            if (!pdfLink) {
                throw new Error('PDF 링크 생성에 실패했습니다.');
            }

            // 견적번호 생성
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const quoteNumber = savedQuoteNumber || `${year}-${month}${day}-01`;

            // 링크 텍스트
            const linkName = '견적서 다운로드 링크';

            // 이메일 본문 재구성 (링크가 "요청하신 견적서를 첨부 드립니다." 바로 아래)
            const emailBodyWithLink = `안녕하세요,

컨범코리아 남부전략영업소입니다.

요청하신 견적서를 첨부 드립니다.

📎 ${linkName}: ${pdfLink}

■ 견적번호: ${quoteNumber}
■ 유효기간: ${header.validityDate}
■ 결제조건: ${header.paymentTerms}

문의사항 있으시면 연락 부탁드립니다.

감사합니다.

**********************************************
CONVUM KOREA CO., LTD.
Southern Strategic Sales Office / 남부전략영업소 탁현호 (TAK HYEON HO) 소장
우46721 부산광역시 강서구 유통단지1로 41 (대저2동) 부산티플렉스 128동 208호
FAX) 051-987-2352
H.P) 010-4981-8390
E-mail : thh0222@convum.co.kr
Home page : http://www.convum.co.kr
CONVUM은 CONVUM Ltd.의 브랜드명입니다.
**********************************************`;

            // Gmail 새 메일 창 열기 (수신자, 제목, 본문+링크 포함)
            const gmailUrl = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${encodeURIComponent(emailTo)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBodyWithLink)}`;
            window.open(gmailUrl, '_blank');

            alert('PDF가 업로드되었고 Gmail이 열렸습니다.\n견적서 링크가 이메일 본문에 포함되어 있습니다.');
            setShowEmailModal(false);
        } catch (error: any) {
            console.error('Email send error:', error);
            alert('이메일 발송 준비 중 오류가 발생했습니다: ' + error.message);
        } finally {
            setIsSendingEmail(false);
        }
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
                        onClick={handleExportPDF}
                        disabled={isExporting}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-lg hover:from-orange-600 hover:to-amber-700 transition-all shadow-lg hover:shadow-orange-500/25 disabled:opacity-50"
                    >
                        <FileText size={18} />
                        {isExporting ? '출력 중...' : 'PDF 발행'}
                    </button>
                    <button
                        onClick={openEmailModal}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg hover:shadow-emerald-500/25"
                    >
                        <Mail size={18} />
                        견적서 발송
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
                    <table className="min-w-full border-collapse">
                        <thead className="bg-purple-500/20 border-b-2 border-purple-500/30">
                            <tr>
                                <th className="px-3 py-3 text-center text-xs font-bold text-white/80 w-12">순번</th>
                                <th className="px-3 py-3 text-left text-xs font-bold text-white/80 w-20">제품군</th>
                                <th className="px-3 py-3 text-left text-xs font-bold text-white/80 w-[280px]">품번(형번)</th>
                                <th className="px-3 py-3 text-center text-xs font-bold text-white/80 w-14">수량</th>
                                <th className="px-3 py-3 text-center text-xs font-bold text-white/80 w-14">LOT</th>
                                <th className="px-3 py-3 text-right text-xs font-bold text-white/80 w-20">판매원가</th>
                                <th className="px-3 py-3 text-right text-xs font-bold text-white/80 w-20">판매점가</th>
                                <th className="px-3 py-3 text-center text-xs font-bold text-white/80 w-12">MOQ</th>
                                <th className="px-3 py-3 text-right text-xs font-bold text-purple-300 w-20 bg-purple-500/10">특가</th>
                                <th className="px-3 py-3 text-right text-xs font-bold text-white/80 w-20">유저가</th>
                                <th className="px-1 py-3 text-center text-xs font-bold text-green-400 w-16 bg-green-500/10">당사이익률</th>
                                <th className="px-1 py-3 text-center text-xs font-bold text-blue-400 w-[72px] bg-blue-500/10">판매점이익률</th>
                                <th className="px-1 py-3 text-center text-xs font-bold text-amber-400 w-[88px] bg-amber-500/10">판매점가이익률</th>
                                <th className="px-3 py-3 text-center text-xs font-bold text-cyan-400 w-12 bg-cyan-500/10">네고율</th>
                                <th className="px-3 py-3 text-left text-xs font-bold text-white/80 w-14">예상납기</th>
                                <th className="px-3 py-3 w-8"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {items.map((item) => {
                                const companyMargin = item.specialPrice > 0 ? ((item.specialPrice - item.costPrice) / item.specialPrice * 100) : 0;
                                const distributorMargin = item.userPrice > 0 ? ((item.userPrice - item.specialPrice) / item.userPrice * 100) : 0;
                                const standardMargin = item.standardPrice > 0 ? ((item.standardPrice - item.costPrice) / item.standardPrice * 100) : 0;
                                const negoRate = item.standardPrice > 0 ? ((item.standardPrice - item.specialPrice) / item.standardPrice * 100) : 0;

                                return (
                                    <tr key={`analysis-${item.id}`} className="hover:bg-purple-500/5 transition-colors">
                                        <td className="px-3 py-2 text-center text-white font-semibold text-sm">{item.seqNo}</td>
                                        <td className="px-2 py-2">
                                            <input type="text" value={item.productCategory} onChange={(e) => updateItem(item.id, 'productCategory', e.target.value)} placeholder="센서" className="w-full px-2 py-1.5 bg-slate-800/50 text-white text-sm border border-slate-600/50 hover:border-purple-500/50 focus:border-purple-500 focus:bg-slate-800 rounded transition-colors focus:outline-none" />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input type="text" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} placeholder="모델명 또는 형번 입력" className="w-full px-2 py-1.5 bg-slate-800/50 text-white text-sm border border-slate-600/50 hover:border-purple-500/50 focus:border-purple-500 focus:bg-slate-800 rounded transition-colors focus:outline-none" />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input type="number" value={item.quantity || ''} onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)} placeholder="" className="w-full px-1 py-1.5 bg-slate-800/50 text-white text-center text-sm border border-slate-600/50 hover:border-purple-500/50 focus:border-purple-500 focus:bg-slate-800 rounded transition-colors focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input type="number" value={item.costPriceLot || ''} onChange={(e) => updateItem(item.id, 'costPriceLot', parseInt(e.target.value) || 0)} placeholder="" className="w-full px-1 py-1.5 bg-slate-800/50 text-white text-center text-sm border border-slate-600/50 hover:border-purple-500/50 focus:border-purple-500 focus:bg-slate-800 rounded transition-colors focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input type="number" value={item.costPrice || ''} onChange={(e) => updateItem(item.id, 'costPrice', parseFloat(e.target.value) || 0)} placeholder="" className="w-full px-1 py-1.5 bg-slate-800/50 text-white text-right text-sm border border-slate-600/50 hover:border-purple-500/50 focus:border-purple-500 focus:bg-slate-800 rounded transition-colors focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input type="number" value={item.standardPrice || ''} onChange={(e) => updateItem(item.id, 'standardPrice', parseFloat(e.target.value) || 0)} placeholder="" className="w-full px-1 py-1.5 bg-slate-800/50 text-white text-right text-sm border border-slate-600/50 hover:border-purple-500/50 focus:border-purple-500 focus:bg-slate-800 rounded transition-colors focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input type="number" value={item.moq || ''} onChange={(e) => updateItem(item.id, 'moq', parseInt(e.target.value) || 0)} placeholder="" className="w-full px-1 py-1.5 bg-slate-800/50 text-white text-center text-sm border border-slate-600/50 hover:border-purple-500/50 focus:border-purple-500 focus:bg-slate-800 rounded transition-colors focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                        </td>
                                        <td className="px-2 py-2 bg-purple-500/5">
                                            <input type="number" value={item.specialPrice || ''} onChange={(e) => updateItem(item.id, 'specialPrice', parseFloat(e.target.value) || 0)} placeholder="" className="w-full px-1 py-1.5 bg-purple-900/30 text-purple-300 font-bold text-right text-sm border border-purple-500/30 hover:border-purple-500/60 focus:border-purple-400 focus:bg-purple-900/50 rounded transition-colors focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                        </td>
                                        <td className="px-2 py-2">
                                            <input type="number" value={item.userPrice || ''} onChange={(e) => updateItem(item.id, 'userPrice', parseFloat(e.target.value) || 0)} placeholder="" className="w-full px-1 py-1.5 bg-slate-800/50 text-white text-right text-sm border border-slate-600/50 hover:border-purple-500/50 focus:border-purple-500 focus:bg-slate-800 rounded transition-colors focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
                                        </td>
                                        <td className="px-1 py-2 text-center bg-green-500/5">
                                            <span className={`text-sm font-bold ${companyMargin > 0 ? 'text-green-400' : companyMargin < 0 ? 'text-red-400' : 'text-slate-500'}`}>{companyMargin !== 0 ? `${companyMargin.toFixed(1)}` : '-'}</span>
                                        </td>
                                        <td className="px-1 py-2 text-center bg-blue-500/5">
                                            <span className={`text-sm font-bold ${distributorMargin > 0 ? 'text-blue-400' : distributorMargin < 0 ? 'text-red-400' : 'text-slate-500'}`}>{distributorMargin !== 0 ? `${distributorMargin.toFixed(1)}` : '-'}</span>
                                        </td>
                                        <td className="px-1 py-2 text-center bg-amber-500/5">
                                            <span className={`text-sm font-bold ${standardMargin > 0 ? 'text-amber-400' : standardMargin < 0 ? 'text-red-400' : 'text-slate-500'}`}>{standardMargin !== 0 ? `${standardMargin.toFixed(1)}` : '-'}</span>
                                        </td>
                                        <td className="px-1 py-2 text-center bg-cyan-500/5">
                                            <span className={`text-sm font-bold ${negoRate > 0 ? 'text-cyan-400' : negoRate < 0 ? 'text-red-400' : 'text-slate-500'}`}>{negoRate !== 0 ? `${negoRate.toFixed(1)}` : '-'}</span>
                                        </td>
                                        <td className="px-2 py-2">
                                            <input type="text" value={item.expectedDelivery} onChange={(e) => updateItem(item.id, 'expectedDelivery', e.target.value)} placeholder="4주" className="w-full px-1 py-1.5 bg-slate-800/50 text-white text-sm border border-slate-600/50 hover:border-purple-500/50 focus:border-purple-500 focus:bg-slate-800 rounded transition-colors focus:outline-none" />
                                        </td>
                                        <td className="px-2 py-2">
                                            {items.length > 1 && (
                                                <button onClick={() => removeItem(item.id)} className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded transition-colors">
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
                        <label className="block text-sm font-medium text-muted-foreground mb-1.5">판매점명 *</label>
                        <input
                            type="text"
                            value={header.storeName}
                            onChange={(e) => setHeader(prev => ({ ...prev, storeName: e.target.value }))}
                            placeholder="판매점명"
                            className="w-full px-4 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1.5">담당자명</label>
                        <input
                            type="text"
                            value={header.contactName}
                            onChange={(e) => setHeader(prev => ({ ...prev, contactName: e.target.value }))}
                            placeholder="담당자명"
                            className="w-full px-4 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1.5">최종 납품처</label>
                        <input
                            type="text"
                            value={header.finalDestination}
                            onChange={(e) => setHeader(prev => ({ ...prev, finalDestination: e.target.value }))}
                            placeholder="최종 납품처"
                            className="w-full px-4 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1.5">프로젝트명</label>
                        <input
                            type="text"
                            value={header.projectName}
                            onChange={(e) => setHeader(prev => ({ ...prev, projectName: e.target.value }))}
                            placeholder="프로젝트명"
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
                                    <td className="px-4 py-3 text-center text-white">{item.costPriceLot || '-'}</td>
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

            {/* 이메일 발송 모달 */}
            {showEmailModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl">
                        <div className="p-6 border-b border-border flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                    <Mail size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">견적서 이메일 발송</h3>
                                    <p className="text-sm text-muted-foreground">PDF 견적서를 이메일로 발송합니다</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowEmailModal(false)}
                                className="p-2 hover:bg-secondary rounded-lg transition-colors"
                            >
                                <X size={20} className="text-muted-foreground" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">
                                    수신자 이메일 *
                                </label>
                                <input
                                    type="email"
                                    value={emailTo}
                                    onChange={(e) => setEmailTo(e.target.value)}
                                    placeholder="example@company.com"
                                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">
                                    제목
                                </label>
                                <input
                                    type="text"
                                    value={emailSubject}
                                    onChange={(e) => setEmailSubject(e.target.value)}
                                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">
                                    본문
                                </label>
                                <textarea
                                    value={emailBody}
                                    onChange={(e) => setEmailBody(e.target.value)}
                                    rows={8}
                                    className="w-full px-4 py-3 bg-secondary/50 border border-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all resize-none"
                                />
                            </div>

                            <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-3 flex items-start gap-2">
                                <span className="text-amber-400 mt-0.5">💡</span>
                                <p className="text-sm text-amber-400/80">
                                    '발송하기' 클릭 시 Gmail이 열리고 견적서 링크가 자동으로 포함됩니다.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 border-t border-border flex justify-end gap-3">
                            <button
                                onClick={() => setShowEmailModal(false)}
                                className="px-5 py-2.5 text-muted-foreground hover:text-white hover:bg-secondary rounded-lg transition-colors"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSendEmail}
                                disabled={isSendingEmail || !emailTo}
                                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg hover:from-emerald-600 hover:to-teal-700 transition-all shadow-lg disabled:opacity-50"
                            >
                                <Mail size={18} />
                                {isSendingEmail ? '발송 중...' : '발송하기'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
