import { useState, useEffect, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, Package, BarChart3, ArrowUpDown, ChevronUp, ChevronDown, AlertTriangle, Target, Sparkles, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SalesRecord {
    id: string;
    shipment_date: string;
    distributor_name: string;
    company_name: string;
    sales_rep: string;
    product_name: string;
    model_number: string;
    quantity: number;
    unit_price: number;
    sales_amount: number;
}

interface ModelAnalysis {
    model_number: string;
    product_name: string;
    total_quantity: number;
    total_sales: number;
    avg_unit_price: number;
    transaction_count: number;
    top_companies: { name: string; amount: number }[];
    monthly_trend: { month: string; quantity: number; amount: number }[];
    growth_rate: number;
    rank: number;
}

export default function ProductModelAnalysis() {
    const [salesData, setSalesData] = useState<SalesRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'total_sales', direction: 'desc' });
    const [selectedModel, setSelectedModel] = useState<ModelAnalysis | null>(null);
    const [yearFilter, setYearFilter] = useState('2025');

    useEffect(() => {
        fetchSalesData();
    }, [yearFilter]);

    const fetchSalesData = async () => {
        try {
            setIsLoading(true);
            let query = supabase
                .from('sales_performance')
                .select('*');

            if (yearFilter !== 'all') {
                const startYear = `${yearFilter}-01-01`;
                const endYear = `${yearFilter}-12-31`;
                query = query.gte('shipment_date', startYear).lte('shipment_date', endYear);
            }

            const { data, error } = await query;
            if (error) throw error;
            setSalesData(data || []);
        } catch (err: any) {
            console.error('Error fetching sales data:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // 형번별 분석 데이터 생성
    const modelAnalysisData = useMemo(() => {
        if (!salesData.length) return [];

        const modelMap = new Map<string, {
            model_number: string;
            product_name: string;
            total_quantity: number;
            total_sales: number;
            prices: number[];
            transaction_count: number;
            companies: Map<string, number>;
            monthly: Map<string, { quantity: number; amount: number }>;
        }>();

        salesData.forEach(record => {
            if (!record.model_number) return;

            const key = record.model_number;
            const existing = modelMap.get(key);
            const month = record.shipment_date?.substring(0, 7) || '';

            if (existing) {
                existing.total_quantity += record.quantity || 0;
                existing.total_sales += record.sales_amount || 0;
                existing.prices.push(record.unit_price || 0);
                existing.transaction_count += 1;

                // 업체별 집계
                const companyAmt = existing.companies.get(record.company_name) || 0;
                existing.companies.set(record.company_name, companyAmt + (record.sales_amount || 0));

                // 월별 집계
                if (month) {
                    const monthData = existing.monthly.get(month) || { quantity: 0, amount: 0 };
                    monthData.quantity += record.quantity || 0;
                    monthData.amount += record.sales_amount || 0;
                    existing.monthly.set(month, monthData);
                }
            } else {
                const companies = new Map<string, number>();
                companies.set(record.company_name, record.sales_amount || 0);

                const monthly = new Map<string, { quantity: number; amount: number }>();
                if (month) {
                    monthly.set(month, { quantity: record.quantity || 0, amount: record.sales_amount || 0 });
                }

                modelMap.set(key, {
                    model_number: record.model_number,
                    product_name: record.product_name || '',
                    total_quantity: record.quantity || 0,
                    total_sales: record.sales_amount || 0,
                    prices: [record.unit_price || 0],
                    transaction_count: 1,
                    companies,
                    monthly,
                });
            }
        });

        // 분석 데이터로 변환
        const analysisArray: ModelAnalysis[] = [];
        modelMap.forEach((value, _key) => {
            const topCompanies = Array.from(value.companies.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([name, amount]) => ({ name, amount }));

            const monthlyTrend = Array.from(value.monthly.entries())
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([month, data]) => ({ month, ...data }));

            // 성장률 계산 (최근 3개월 vs 이전 3개월)
            let growthRate = 0;
            if (monthlyTrend.length >= 6) {
                const recent = monthlyTrend.slice(-3).reduce((sum, m) => sum + m.amount, 0);
                const previous = monthlyTrend.slice(-6, -3).reduce((sum, m) => sum + m.amount, 0);
                if (previous > 0) {
                    growthRate = ((recent - previous) / previous) * 100;
                }
            }

            analysisArray.push({
                model_number: value.model_number,
                product_name: value.product_name,
                total_quantity: value.total_quantity,
                total_sales: value.total_sales,
                avg_unit_price: value.prices.length > 0 ? value.prices.reduce((a, b) => a + b, 0) / value.prices.length : 0,
                transaction_count: value.transaction_count,
                top_companies: topCompanies,
                monthly_trend: monthlyTrend,
                growth_rate: growthRate,
                rank: 0,
            });
        });

        // 매출순 정렬 및 순위 부여
        analysisArray.sort((a, b) => b.total_sales - a.total_sales);
        analysisArray.forEach((item, index) => {
            item.rank = index + 1;
        });

        return analysisArray;
    }, [salesData]);

    // 검색 필터링
    const filteredData = useMemo(() => {
        let data = [...modelAnalysisData];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            data = data.filter(item =>
                item.model_number.toLowerCase().includes(term) ||
                item.product_name.toLowerCase().includes(term)
            );
        }

        // 정렬
        if (sortConfig) {
            data.sort((a, b) => {
                const aValue = a[sortConfig.key as keyof ModelAnalysis];
                const bValue = b[sortConfig.key as keyof ModelAnalysis];
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
                }
                return 0;
            });
        }

        return data;
    }, [modelAnalysisData, searchTerm, sortConfig]);

    // 통계 요약
    const summary = useMemo(() => {
        const totalModels = modelAnalysisData.length;
        const totalSales = modelAnalysisData.reduce((sum, m) => sum + m.total_sales, 0);
        const totalQuantity = modelAnalysisData.reduce((sum, m) => sum + m.total_quantity, 0);
        const topPerformers = modelAnalysisData.filter(m => m.growth_rate > 20).length;
        const declining = modelAnalysisData.filter(m => m.growth_rate < -20).length;

        return { totalModels, totalSales, totalQuantity, topPerformers, declining };
    }, [modelAnalysisData]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(amount);
    };

    const handleSort = (key: string) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    const SortIcon = ({ columnKey }: { columnKey: string }) => {
        if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} className="text-muted-foreground/50" />;
        return sortConfig.direction === 'asc' ?
            <ChevronUp size={14} className="text-accent" /> :
            <ChevronDown size={14} className="text-accent" />;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="animate-spin text-accent" size={40} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertTriangle size={20} />
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-300 text-sm">총 제품 형번</p>
                            <p className="text-2xl font-bold text-white mt-1">{summary.totalModels.toLocaleString()}개</p>
                        </div>
                        <Package className="text-blue-400" size={32} />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border border-emerald-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-emerald-300 text-sm">총 매출액</p>
                            <p className="text-2xl font-bold text-white mt-1">{formatCurrency(summary.totalSales)}</p>
                        </div>
                        <BarChart3 className="text-emerald-400" size={32} />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-300 text-sm">총 판매 수량</p>
                            <p className="text-2xl font-bold text-white mt-1">{summary.totalQuantity.toLocaleString()}대</p>
                        </div>
                        <Target className="text-purple-400" size={32} />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 border border-amber-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-amber-300 text-sm">성장 제품 (20%↑)</p>
                            <p className="text-2xl font-bold text-white mt-1">{summary.topPerformers}개</p>
                        </div>
                        <TrendingUp className="text-amber-400" size={32} />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 border border-red-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-red-300 text-sm">하락 제품 (20%↓)</p>
                            <p className="text-2xl font-bold text-white mt-1">{summary.declining}개</p>
                        </div>
                        <TrendingDown className="text-red-400" size={32} />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <input
                            type="text"
                            placeholder="형번 또는 상품군으로 검색..."
                            className="w-full pl-10 pr-4 py-2 bg-secondary text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                        <option value="all">전체 연도</option>
                        <option value="2025">2025년</option>
                        <option value="2024">2024년</option>
                        <option value="2023">2023년</option>
                    </select>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gradient-to-r from-secondary/50 to-secondary/30 border-b border-border">
                            <tr>
                                <th className="px-4 py-3 font-bold text-muted-foreground cursor-pointer hover:bg-secondary/50" onClick={() => handleSort('rank')}>
                                    <div className="flex items-center gap-1">순위 <SortIcon columnKey="rank" /></div>
                                </th>
                                <th className="px-4 py-3 font-bold text-muted-foreground cursor-pointer hover:bg-secondary/50" onClick={() => handleSort('model_number')}>
                                    <div className="flex items-center gap-1">형번 <SortIcon columnKey="model_number" /></div>
                                </th>
                                <th className="px-4 py-3 font-bold text-muted-foreground">상품군</th>
                                <th className="px-4 py-3 font-bold text-muted-foreground text-right cursor-pointer hover:bg-secondary/50" onClick={() => handleSort('total_quantity')}>
                                    <div className="flex items-center justify-end gap-1">판매 수량 <SortIcon columnKey="total_quantity" /></div>
                                </th>
                                <th className="px-4 py-3 font-bold text-muted-foreground text-right cursor-pointer hover:bg-secondary/50" onClick={() => handleSort('total_sales')}>
                                    <div className="flex items-center justify-end gap-1">총 매출 <SortIcon columnKey="total_sales" /></div>
                                </th>
                                <th className="px-4 py-3 font-bold text-muted-foreground text-right cursor-pointer hover:bg-secondary/50" onClick={() => handleSort('avg_unit_price')}>
                                    <div className="flex items-center justify-end gap-1">평균 단가 <SortIcon columnKey="avg_unit_price" /></div>
                                </th>
                                <th className="px-4 py-3 font-bold text-muted-foreground text-right cursor-pointer hover:bg-secondary/50" onClick={() => handleSort('transaction_count')}>
                                    <div className="flex items-center justify-end gap-1">거래 건수 <SortIcon columnKey="transaction_count" /></div>
                                </th>
                                <th className="px-4 py-3 font-bold text-muted-foreground text-right cursor-pointer hover:bg-secondary/50" onClick={() => handleSort('growth_rate')}>
                                    <div className="flex items-center justify-end gap-1">성장률 <SortIcon columnKey="growth_rate" /></div>
                                </th>
                                <th className="px-4 py-3 font-bold text-muted-foreground">주요 거래처</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredData.length > 0 ? (
                                filteredData.slice(0, 50).map((item) => (
                                    <tr
                                        key={item.model_number}
                                        className="hover:bg-secondary/30 transition-colors cursor-pointer"
                                        onClick={() => setSelectedModel(selectedModel?.model_number === item.model_number ? null : item)}
                                    >
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${item.rank <= 3 ? 'bg-gradient-to-br from-amber-500 to-yellow-600 text-white' :
                                                item.rank <= 10 ? 'bg-accent/20 text-accent' :
                                                    'bg-secondary text-muted-foreground'
                                                }`}>
                                                {item.rank}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-medium text-white">{item.model_number}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{item.product_name}</td>
                                        <td className="px-4 py-3 text-right font-medium">{item.total_quantity.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right font-bold text-accent">{formatCurrency(item.total_sales)}</td>
                                        <td className="px-4 py-3 text-right">{formatCurrency(item.avg_unit_price)}</td>
                                        <td className="px-4 py-3 text-right">{item.transaction_count.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right">
                                            {item.growth_rate !== 0 && (
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${item.growth_rate > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {item.growth_rate > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                    {item.growth_rate > 0 ? '+' : ''}{item.growth_rate.toFixed(1)}%
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {item.top_companies.slice(0, 2).map((company, idx) => (
                                                    <span key={idx} className="text-xs bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">
                                                        {company.name?.substring(0, 10)}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">
                                        데이터가 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-4 py-3 border-t border-border text-sm text-muted-foreground">
                    총 {filteredData.length}개 형번 중 상위 50개 표시
                </div>
            </div>

            {/* Detail Modal */}
            {selectedModel && (
                <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent/20 to-accent/40 flex items-center justify-center">
                                <Sparkles className="text-accent" size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">{selectedModel.model_number}</h3>
                                <p className="text-muted-foreground">{selectedModel.product_name}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedModel(null)}
                            className="text-muted-foreground hover:text-white"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        <div className="bg-secondary/30 rounded-lg p-4">
                            <p className="text-muted-foreground text-sm">총 매출</p>
                            <p className="text-xl font-bold text-accent">{formatCurrency(selectedModel.total_sales)}</p>
                        </div>
                        <div className="bg-secondary/30 rounded-lg p-4">
                            <p className="text-muted-foreground text-sm">판매 수량</p>
                            <p className="text-xl font-bold text-white">{selectedModel.total_quantity.toLocaleString()}대</p>
                        </div>
                        <div className="bg-secondary/30 rounded-lg p-4">
                            <p className="text-muted-foreground text-sm">평균 단가</p>
                            <p className="text-xl font-bold text-white">{formatCurrency(selectedModel.avg_unit_price)}</p>
                        </div>
                        <div className="bg-secondary/30 rounded-lg p-4">
                            <p className="text-muted-foreground text-sm">성장률</p>
                            <p className={`text-xl font-bold ${selectedModel.growth_rate >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {selectedModel.growth_rate > 0 ? '+' : ''}{selectedModel.growth_rate.toFixed(1)}%
                            </p>
                        </div>
                    </div>

                    {/* Monthly Trend */}
                    <div className="mb-6">
                        <h4 className="font-bold text-white mb-3">📊 월별 매출 추이</h4>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            {selectedModel.monthly_trend.map((m, idx) => {
                                const maxAmount = Math.max(...selectedModel.monthly_trend.map(t => t.amount));
                                const heightPercent = maxAmount > 0 ? (m.amount / maxAmount) * 100 : 0;
                                return (
                                    <div key={idx} className="flex flex-col items-center min-w-[60px]">
                                        <div className="h-24 w-8 bg-secondary/30 rounded-t-lg flex items-end">
                                            <div
                                                className="w-full bg-gradient-to-t from-accent to-accent/50 rounded-t-lg transition-all"
                                                style={{ height: `${heightPercent}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">{m.month.substring(5)}</p>
                                        <p className="text-xs font-medium text-white">{(m.amount / 1000000).toFixed(0)}M</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Top Companies */}
                    <div>
                        <h4 className="font-bold text-white mb-3">🏢 주요 거래처 TOP 5</h4>
                        <div className="space-y-2">
                            {selectedModel.top_companies.map((company, idx) => {
                                const maxAmount = selectedModel.top_companies[0]?.amount || 1;
                                const widthPercent = (company.amount / maxAmount) * 100;
                                return (
                                    <div key={idx} className="flex items-center gap-3">
                                        <span className="w-6 text-sm text-muted-foreground">{idx + 1}</span>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm text-white">{company.name}</span>
                                                <span className="text-sm font-medium text-accent">{formatCurrency(company.amount)}</span>
                                            </div>
                                            <div className="h-2 bg-secondary/30 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-accent/50 to-accent rounded-full transition-all"
                                                    style={{ width: `${widthPercent}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
