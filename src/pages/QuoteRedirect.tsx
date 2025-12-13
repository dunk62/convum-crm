import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { FileText, Loader2, AlertCircle } from 'lucide-react';

export default function QuoteRedirect() {
    const { shortCode } = useParams<{ shortCode: string }>();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchAndRedirect = async () => {
            if (!shortCode) {
                setStatus('error');
                setErrorMessage('견적서 코드가 없습니다.');
                return;
            }

            try {
                // quote_links 테이블에서 short_code로 조회
                const { data: linkData, error: linkError } = await supabase
                    .from('quote_links')
                    .select('*')
                    .eq('short_code', shortCode)
                    .eq('is_active', true)
                    .single();

                if (linkError || !linkData) {
                    setStatus('error');
                    setErrorMessage('견적서를 찾을 수 없거나 만료되었습니다.');
                    return;
                }

                // 만료 확인
                if (linkData.expires_at && new Date(linkData.expires_at) < new Date()) {
                    setStatus('error');
                    setErrorMessage('견적서 링크가 만료되었습니다.');
                    return;
                }

                // 열람 기록 저장
                await supabase.from('quote_views').insert({
                    quote_link_id: linkData.id,
                    viewer_ip: '', // 클라이언트에서는 IP를 알 수 없음
                    user_agent: navigator.userAgent,
                    referrer: document.referrer || ''
                });

                setStatus('success');

                // PDF URL로 리디렉트
                setTimeout(() => {
                    window.location.href = linkData.public_url;
                }, 1500);

            } catch (err: any) {
                console.error('Redirect error:', err);
                setStatus('error');
                setErrorMessage('견적서를 불러오는 중 오류가 발생했습니다.');
            }
        };

        fetchAndRedirect();
    }, [shortCode]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 max-w-md w-full text-center">
                {/* 로고 */}
                <div className="w-16 h-16 mx-auto mb-6 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center">
                    <FileText size={32} className="text-white" />
                </div>

                {status === 'loading' && (
                    <>
                        <Loader2 size={48} className="mx-auto mb-4 text-purple-400 animate-spin" />
                        <h1 className="text-2xl font-bold text-white mb-2">견적서 불러오는 중...</h1>
                        <p className="text-slate-400">잠시만 기다려주세요.</p>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                            <FileText size={24} className="text-green-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">견적서 열람 확인!</h1>
                        <p className="text-slate-400 mb-4">PDF 파일로 이동합니다...</p>
                        <Loader2 size={24} className="mx-auto text-green-400 animate-spin" />
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                            <AlertCircle size={24} className="text-red-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">오류 발생</h1>
                        <p className="text-red-400">{errorMessage}</p>
                    </>
                )}

                {/* 회사 정보 */}
                <div className="mt-8 pt-6 border-t border-slate-700/50">
                    <p className="text-sm text-slate-500">CONVUM KOREA CO., LTD.</p>
                    <p className="text-xs text-slate-600">남부전략영업소</p>
                </div>
            </div>
        </div>
    );
}
