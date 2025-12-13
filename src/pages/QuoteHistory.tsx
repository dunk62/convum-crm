import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { FileText, Search, Eye, ExternalLink, ChevronDown, ChevronUp, Calendar, Building2, User, Calculator, Link2, Download } from 'lucide-react';

interface QuoteHistory {
    id: string;
    quote_number: string;
    recipient: string;
    reference: string;
    quote_date: string;
    validity_date: string;
    delivery_date: string;
    payment_terms: string;
    total_amount: number;
    notes: string;
    created_at: string;
    items?: QuoteItem[];
    links?: QuoteLink[];
}

interface QuoteItem {
    id: string;
    seq_no: number;
    product_category: string;
    description: string;
    quantity: number;
    standard_price: number;
    special_price: number;
    discount_rate: number;
    cost_price: number;
    cost_price_lot: number;
    user_price: number;
    moq: number;
    company_profit_rate: number;   // 당사이익률
    store_profit_rate: number;     // 판매점가이익률
    nego_rate: number;             // 네고율
    expected_delivery: string;     // 예상납기
}

interface QuoteLink {
    id: string;
    short_code: string;
    public_url: string;
    created_at: string;
    view_count: number;
}

export default function QuoteHistory() {
    const [quotes, setQuotes] = useState<QuoteHistory[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedQuote, setExpandedQuote] = useState<string | null>(null);

    useEffect(() => {
        fetchQuotes();
    }, []);

    const fetchQuotes = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('quote_history')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // 각 견적서의 품목과 링크 정보 가져오기
            const quotesWithDetails = await Promise.all(
                (data || []).map(async (quote: QuoteHistory) => {
                    // 품목 가져오기
                    const { data: items } = await supabase
                        .from('quote_items')
                        .select('*')
                        .eq('quote_id', quote.id)
                        .order('seq_no');

                    // 링크 및 열람 횟수 가져오기
                    const { data: links } = await supabase
                        .from('quote_links')
                        .select('*')
                        .eq('quote_number', quote.quote_number);

                    // 각 링크의 열람 횟수 계산
                    const linksWithViewCount = await Promise.all(
                        (links || []).map(async (link: any) => {
                            const { count } = await supabase
                                .from('quote_views')
                                .select('*', { count: 'exact', head: true })
                                .eq('quote_link_id', link.id);
                            return { ...link, view_count: count || 0 };
                        })
                    );

                    return { ...quote, items: items || [], links: linksWithViewCount };
                })
            );

            setQuotes(quotesWithDetails);
        } catch (err) {
            console.error('Error fetching quotes:', err);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('ko-KR');
    };

    const formatDate = (dateStr: string) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('ko-KR');
    };

    const filteredQuotes = quotes.filter(quote =>
        quote.quote_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quote.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (quote.reference && quote.reference.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const toggleExpand = (quoteId: string) => {
        setExpandedQuote(expandedQuote === quoteId ? null : quoteId);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                            <FileText size={20} className="text-white" />
                        </div>
                        견적서 이력
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        저장된 견적서와 원가 분석 데이터를 확인합니다.
                    </p>
                </div>

                {/* 검색 */}
                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="견적번호, 업체명, 담당자 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500/50 w-64"
                    />
                </div>
            </div>

            {/* 견적서 목록 */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-slate-400">
                        로딩 중...
                    </div>
                ) : filteredQuotes.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                        저장된 견적서가 없습니다.
                    </div>
                ) : (
                    <div className="divide-y divide-slate-700/50">
                        {filteredQuotes.map((quote) => (
                            <div key={quote.id} className="hover:bg-slate-700/20 transition-colors">
                                {/* 견적서 요약 */}
                                <div
                                    className="p-4 cursor-pointer"
                                    onClick={() => toggleExpand(quote.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500/20 to-amber-600/20 flex items-center justify-center">
                                                <FileText size={24} className="text-orange-400" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-white">{quote.quote_number}</span>
                                                    {quote.links && quote.links.length > 0 && (
                                                        <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full flex items-center gap-1">
                                                            <Eye size={12} />
                                                            {quote.links.reduce((sum, l) => sum + l.view_count, 0)}회 열람
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Building2 size={14} />
                                                        {quote.recipient}
                                                    </span>
                                                    {quote.reference && (
                                                        <span className="flex items-center gap-1">
                                                            <User size={14} />
                                                            {quote.reference}
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={14} />
                                                        {formatDate(quote.quote_date)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-xs text-slate-500">합계</div>
                                                <div className="font-bold text-lg text-amber-400">
                                                    {formatCurrency(quote.total_amount)}원
                                                </div>
                                            </div>
                                            {expandedQuote === quote.id ? (
                                                <ChevronUp size={20} className="text-slate-400" />
                                            ) : (
                                                <ChevronDown size={20} className="text-slate-400" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* 상세 정보 */}
                                {expandedQuote === quote.id && (
                                    <div className="px-4 pb-4 space-y-4">
                                        {/* 기본 정보 */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-800/40 rounded-lg">
                                            <div>
                                                <div className="text-xs text-slate-500">유효기간</div>
                                                <div className="text-white">{formatDate(quote.validity_date)}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500">납기</div>
                                                <div className="text-white">{quote.delivery_date || '-'}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500">결제조건</div>
                                                <div className="text-white">{quote.payment_terms}</div>
                                            </div>
                                            <div>
                                                <div className="text-xs text-slate-500">품목 수</div>
                                                <div className="text-white">{quote.items?.length || 0}개</div>
                                            </div>
                                        </div>

                                        {/* 원가 분석표 */}
                                        {quote.items && quote.items.length > 0 && (
                                            <div className="bg-slate-800/40 rounded-lg overflow-hidden">
                                                <div className="p-3 bg-purple-500/20 border-b border-purple-500/30 flex items-center gap-2">
                                                    <Calculator size={16} className="text-purple-400" />
                                                    <span className="font-semibold text-purple-300">원가 분석표</span>
                                                </div>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm">
                                                        <thead className="bg-slate-700/50">
                                                            <tr>
                                                                <th className="px-3 py-2 text-center text-slate-400 font-medium">순번</th>
                                                                <th className="px-3 py-2 text-left text-slate-400 font-medium">제품군</th>
                                                                <th className="px-3 py-2 text-left text-slate-400 font-medium">품번(형번)</th>
                                                                <th className="px-3 py-2 text-center text-slate-400 font-medium">수량</th>
                                                                <th className="px-3 py-2 text-center text-slate-400 font-medium">LOT</th>
                                                                <th className="px-3 py-2 text-right text-slate-400 font-medium">판매원가</th>
                                                                <th className="px-3 py-2 text-right text-slate-400 font-medium">판매점가</th>
                                                                <th className="px-3 py-2 text-center text-slate-400 font-medium">MOQ</th>
                                                                <th className="px-3 py-2 text-right text-purple-400 font-medium bg-purple-500/10">특가</th>
                                                                <th className="px-3 py-2 text-right text-slate-400 font-medium">유저가</th>
                                                                <th className="px-3 py-2 text-right text-cyan-400 font-medium bg-cyan-500/10">당사이익률</th>
                                                                <th className="px-3 py-2 text-right text-green-400 font-medium bg-green-500/10">판매점가이익률</th>
                                                                <th className="px-3 py-2 text-right text-amber-400 font-medium bg-amber-500/10">네고율</th>
                                                                <th className="px-3 py-2 text-center text-slate-400 font-medium">예상납기</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-700/30">
                                                            {quote.items.map((item) => (
                                                                <tr key={item.id} className="hover:bg-slate-700/20">
                                                                    <td className="px-3 py-2 text-center text-slate-300">{item.seq_no}</td>
                                                                    <td className="px-3 py-2 text-slate-300">{item.product_category || '-'}</td>
                                                                    <td className="px-3 py-2 text-white font-medium">{item.description}</td>
                                                                    <td className="px-3 py-2 text-center text-slate-300">{item.quantity}</td>
                                                                    <td className="px-3 py-2 text-center text-slate-300">{item.cost_price_lot || '-'}</td>
                                                                    <td className="px-3 py-2 text-right text-slate-300">{formatCurrency(item.cost_price || 0)}원</td>
                                                                    <td className="px-3 py-2 text-right text-slate-300">{formatCurrency(item.standard_price || 0)}원</td>
                                                                    <td className="px-3 py-2 text-center text-slate-300">{item.moq || '-'}</td>
                                                                    <td className="px-3 py-2 text-right text-purple-300 font-bold bg-purple-500/5">{formatCurrency(item.special_price || 0)}원</td>
                                                                    <td className="px-3 py-2 text-right text-slate-300">{formatCurrency(item.user_price || 0)}원</td>
                                                                    <td className="px-3 py-2 text-right text-cyan-300 bg-cyan-500/5">{item.company_profit_rate?.toFixed(1) || '0.0'}%</td>
                                                                    <td className="px-3 py-2 text-right text-green-300 bg-green-500/5">{item.store_profit_rate?.toFixed(1) || '0.0'}%</td>
                                                                    <td className="px-3 py-2 text-right text-amber-300 bg-amber-500/5">{item.nego_rate?.toFixed(1) || '0.0'}%</td>
                                                                    <td className="px-3 py-2 text-center text-slate-300">{item.expected_delivery || '-'}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}

                                        {/* 공유 링크 정보 */}
                                        {quote.links && quote.links.length > 0 && (
                                            <div className="bg-slate-800/40 rounded-lg overflow-hidden">
                                                <div className="p-3 bg-green-500/20 border-b border-green-500/30 flex items-center gap-2">
                                                    <Link2 size={16} className="text-green-400" />
                                                    <span className="font-semibold text-green-300">공유 링크 및 열람 기록</span>
                                                </div>
                                                <div className="p-4 space-y-2">
                                                    {quote.links.map((link) => (
                                                        <div key={link.id} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <code className="text-sm bg-slate-700/50 px-2 py-1 rounded text-green-400">
                                                                    /q/{link.short_code}
                                                                </code>
                                                                <span className="text-xs text-slate-500">
                                                                    {formatDate(link.created_at)} 생성
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="flex items-center gap-1 text-sm text-amber-400">
                                                                    <Eye size={14} />
                                                                    {link.view_count}회 열람
                                                                </span>
                                                                <a
                                                                    href={link.public_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="p-1.5 hover:bg-slate-600/50 rounded transition-colors"
                                                                >
                                                                    <Download size={14} className="text-slate-400" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* 비고 */}
                                        {quote.notes && (
                                            <div className="p-4 bg-slate-800/40 rounded-lg">
                                                <div className="text-xs text-slate-500 mb-1">비고</div>
                                                <div className="text-slate-300 text-sm">{quote.notes}</div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 통계 요약 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border border-blue-500/20 rounded-xl p-4">
                    <div className="text-sm text-blue-400">총 견적서</div>
                    <div className="text-2xl font-bold text-white">{quotes.length}건</div>
                </div>
                <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-500/20 rounded-xl p-4">
                    <div className="text-sm text-green-400">총 열람 횟수</div>
                    <div className="text-2xl font-bold text-white">
                        {quotes.reduce((sum, q) => sum + (q.links?.reduce((s, l) => s + l.view_count, 0) || 0), 0)}회
                    </div>
                </div>
                <div className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 border border-amber-500/20 rounded-xl p-4">
                    <div className="text-sm text-amber-400">총 견적 금액</div>
                    <div className="text-2xl font-bold text-white">
                        {formatCurrency(quotes.reduce((sum, q) => sum + q.total_amount, 0))}원
                    </div>
                </div>
            </div>
        </div>
    );
}
