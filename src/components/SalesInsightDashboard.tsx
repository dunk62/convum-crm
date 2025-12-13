import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell
} from 'recharts';
import { supabase } from '../lib/supabase';
import {
    Search,
    TrendingUp,
    TrendingDown,
    Package,
    BarChart3,
    Users,
    ChevronUp,
    ChevronDown,
    ArrowUpDown,
    Loader2,
    AlertTriangle,
    X,
    Sparkles,
    Filter
} from 'lucide-react';

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
    sales_rep: string;
    total_quantity: number;
    total_sales: number;
    avg_unit_price: number;
    transaction_count: number;
    top_companies: { name: string; amount: number }[];
    monthly_trend: { month: string; quantity: number; amount: number }[];
    sparkline_data: number[];
    growth_rate: number;
    rank: number;
}

interface RepRanking {
    name: string;
    total_sales: number;
    total_quantity: number;
    model_count: number;
}

// Mini Sparkline Component
const Sparkline = ({ data, width = 60, height = 20 }: { data: number[]; width?: number; height?: number }) => {
    if (!data || data.length < 2) return <span className="text-muted-foreground text-xs">-</span>;

    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
        const x = (index / (data.length - 1)) * width;
        const y = height - ((value - min) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    const trend = data[data.length - 1] >= data[0];

    return (
        <svg width={width} height={height} className="inline-block">
            <polyline
                points={points}
                fill="none"
                stroke={trend ? '#10b981' : '#ef4444'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

export default function SalesInsightDashboard() {
    const [salesData, setSalesData] = useState<SalesRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDept, setSelectedDept] = useState<string>('전체');
    const [selectedRep, setSelectedRep] = useState<string>('전체');
    const [selectedCategory, setSelectedCategory] = useState<string>('전체');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'total_sales', direction: 'desc' });
    const [selectedModel, setSelectedModel] = useState<ModelAnalysis | null>(null);
    const [yearFilter, setYearFilter] = useState('2025');

    // 부서별 담당자 그룹 정의
    const deptGroups: { [key: string]: string[] } = {
        '전체': [],
        '북부': ['김광중'],
        '남부': ['탁현호', '임성렬'],
        'CS': ['윤회승', '이다경'],
        '수출': ['윤회승(수출)', '이다경(수출)']
    };

    // Fetch data with pagination to get all records
    const fetchSalesData = useCallback(async () => {
        try {
            setIsLoading(true);
            const pageSize = 1000;
            let allData: SalesRecord[] = [];
            let page = 0;
            let hasMore = true;

            while (hasMore) {
                let query = supabase
                    .from('sales_performance')
                    .select('*')
                    .range(page * pageSize, (page + 1) * pageSize - 1);

                if (yearFilter !== 'all') {
                    const startYear = `${yearFilter}-01-01`;
                    const endYear = `${yearFilter}-12-31`;
                    query = query.gte('shipment_date', startYear).lte('shipment_date', endYear);
                }

                const { data, error } = await query;
                if (error) throw error;

                if (data && data.length > 0) {
                    allData = [...allData, ...data];
                    if (data.length < pageSize) {
                        hasMore = false;
                    } else {
                        page++;
                    }
                } else {
                    hasMore = false;
                }
            }

            setSalesData(allData);
            console.log(`Loaded ${allData.length} records for ${yearFilter}`);
        } catch (err: any) {
            console.error('Error fetching sales data:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [yearFilter]);

    useEffect(() => {
        fetchSalesData();
    }, [fetchSalesData]);

    // Real-time subscription
    useEffect(() => {
        const channel = supabase
            .channel('sales_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'sales_performance' }, () => {
                fetchSalesData();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchSalesData]);

    // Backfill product names (상품군 결측치 보정)
    const backfilledData = useMemo(() => {
        const productNameMap = new Map<string, string>();

        // First pass: collect known product names for each model
        salesData.forEach(record => {
            if (record.model_number && record.product_name) {
                if (!productNameMap.has(record.model_number)) {
                    productNameMap.set(record.model_number, record.product_name);
                }
            }
        });

        // Second pass: backfill missing product names
        return salesData.map(record => {
            if (!record.product_name && record.model_number) {
                const knownName = productNameMap.get(record.model_number);
                return { ...record, product_name: knownName || '기타' };
            }
            return record;
        });
    }, [salesData]);

    // Filter by selected department, rep, and category
    const filteredByRep = useMemo(() => {
        let data = backfilledData;

        // First filter by department
        if (selectedDept !== '전체') {
            const repsInDept = deptGroups[selectedDept] || [];
            data = data.filter(d => repsInDept.includes(d.sales_rep));
        }

        // Then filter by individual rep if selected
        if (selectedRep !== '전체') {
            data = data.filter(d => d.sales_rep === selectedRep);
        }

        // Then filter by category if selected
        if (selectedCategory !== '전체') {
            data = data.filter(d => d.product_name === selectedCategory);
        }

        return data;
    }, [backfilledData, selectedDept, selectedRep, selectedCategory]);

    // Get available categories from backfilled data
    const availableCategories = useMemo(() => {
        const categories = Array.from(new Set(backfilledData.map(d => d.product_name).filter(Boolean))).sort();
        return ['전체', ...categories];
    }, [backfilledData]);

    // Get available reps based on selected department
    const availableReps = useMemo(() => {
        if (selectedDept === '전체') {
            // Show all reps from all departments
            const allReps: string[] = [];
            Object.values(deptGroups).forEach(reps => {
                allReps.push(...reps);
            });
            return ['전체', ...allReps];
        }
        // Show only reps from selected department
        return ['전체', ...(deptGroups[selectedDept] || [])];
    }, [selectedDept]);

    // Model analysis data
    const modelAnalysisData = useMemo(() => {
        if (!filteredByRep.length) return [];

        const modelMap = new Map<string, {
            model_number: string;
            product_name: string;
            sales_rep: string;
            total_quantity: number;
            total_sales: number;
            prices: number[];
            transaction_count: number;
            companies: Map<string, number>;
            monthly: Map<string, { quantity: number; amount: number }>;
        }>();

        filteredByRep.forEach(record => {
            if (!record.model_number) return;

            const key = record.model_number;
            const existing = modelMap.get(key);
            const month = record.shipment_date?.substring(0, 7) || '';

            if (existing) {
                existing.total_quantity += record.quantity || 0;
                existing.total_sales += record.sales_amount || 0;
                existing.prices.push(record.unit_price || 0);
                existing.transaction_count += 1;

                const companyAmt = existing.companies.get(record.company_name) || 0;
                existing.companies.set(record.company_name, companyAmt + (record.sales_amount || 0));

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
                    product_name: record.product_name || '기타',
                    sales_rep: record.sales_rep || '',
                    total_quantity: record.quantity || 0,
                    total_sales: record.sales_amount || 0,
                    prices: [record.unit_price || 0],
                    transaction_count: 1,
                    companies,
                    monthly,
                });
            }
        });

        const analysisArray: ModelAnalysis[] = [];
        modelMap.forEach((value) => {
            const topCompanies = Array.from(value.companies.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([name, amount]) => ({ name, amount }));

            const monthlyTrend = Array.from(value.monthly.entries())
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([month, data]) => ({ month, ...data }));

            // Sparkline data (last 3 months)
            const sparkline_data = monthlyTrend.slice(-3).map(m => m.amount);

            // Growth rate calculation
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
                sales_rep: value.sales_rep,
                total_quantity: value.total_quantity,
                total_sales: value.total_sales,
                avg_unit_price: value.prices.length > 0 ? value.prices.reduce((a, b) => a + b, 0) / value.prices.length : 0,
                transaction_count: value.transaction_count,
                top_companies: topCompanies,
                monthly_trend: monthlyTrend,
                sparkline_data,
                growth_rate: growthRate,
                rank: 0,
            });
        });

        // Sort by sales and assign ranks
        analysisArray.sort((a, b) => b.total_sales - a.total_sales);
        analysisArray.forEach((item, index) => {
            item.rank = index + 1;
        });

        return analysisArray;
    }, [filteredByRep]);

    // Rep ranking data (for "전체" mode) - filtered by category
    const repRankingData = useMemo((): RepRanking[] => {
        if (selectedDept !== '전체') return [];

        // Apply category filter to the data for ranking
        let dataForRanking = backfilledData;
        if (selectedCategory !== '전체') {
            dataForRanking = dataForRanking.filter(d => d.product_name === selectedCategory);
        }

        const repMap = new Map<string, { total_sales: number; total_quantity: number; models: Set<string> }>();

        dataForRanking.forEach(record => {
            if (!record.sales_rep) return;
            const existing = repMap.get(record.sales_rep);
            if (existing) {
                existing.total_sales += record.sales_amount || 0;
                existing.total_quantity += record.quantity || 0;
                if (record.model_number) existing.models.add(record.model_number);
            } else {
                repMap.set(record.sales_rep, {
                    total_sales: record.sales_amount || 0,
                    total_quantity: record.quantity || 0,
                    models: new Set(record.model_number ? [record.model_number] : []),
                });
            }
        });

        return Array.from(repMap.entries())
            .map(([name, data]) => ({
                name,
                total_sales: data.total_sales,
                total_quantity: data.total_quantity,
                model_count: data.models.size,
            }))
            .sort((a, b) => b.total_sales - a.total_sales);
    }, [backfilledData, selectedDept, selectedCategory]);

    // Scatter plot data
    const scatterData = useMemo(() => {
        return modelAnalysisData.map(item => ({
            x: item.total_quantity,
            y: item.avg_unit_price,
            z: item.total_sales,
            name: item.model_number,
            product: item.product_name,
        }));
    }, [modelAnalysisData]);

    // Search filtered data
    const searchFilteredData = useMemo(() => {
        let data = [...modelAnalysisData];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            data = data.filter(item =>
                item.model_number.toLowerCase().includes(term) ||
                item.product_name.toLowerCase().includes(term)
            );
        }

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

    // Summary stats
    const summary = useMemo(() => {
        const totalModels = modelAnalysisData.length;
        const totalSales = modelAnalysisData.reduce((sum, m) => sum + m.total_sales, 0);
        const totalQuantity = modelAnalysisData.reduce((sum, m) => sum + m.total_quantity, 0);
        const avgPrice = totalQuantity > 0 ? totalSales / totalQuantity : 0;
        return { totalModels, totalSales, totalQuantity, avgPrice };
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

    const barColors = ['#5a8fd4', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899', '#14b8a6', '#f97316'];

    // Custom Scatter Tooltip
    const ScatterTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-gray-900 text-white p-3 rounded-lg shadow-xl border border-gray-700 text-sm">
                    <p className="font-bold text-accent">{data.name}</p>
                    <p className="text-muted-foreground">{data.product}</p>
                    <p>수량: {data.x.toLocaleString()}</p>
                    <p>평균단가: {formatCurrency(data.y)}</p>
                    <p>매출: {formatCurrency(data.z)}</p>
                </div>
            );
        }
        return null;
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
            {/* Control Panel */}
            <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent/20 to-accent/40 flex items-center justify-center">
                            <BarChart3 className="text-accent" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">매출 인사이트 대시보드</h2>
                            <p className="text-sm text-muted-foreground">상품 포트폴리오 분석 및 담당자별 성과</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center">
                        {/* Department Filter */}
                        <div className="flex items-center gap-2">
                            <Filter size={16} className="text-muted-foreground" />
                            <select
                                value={selectedDept}
                                onChange={(e) => {
                                    setSelectedDept(e.target.value);
                                    setSelectedRep('전체'); // Reset rep when department changes
                                }}
                                className="px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white"
                            >
                                {Object.keys(deptGroups).map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                        </div>

                        {/* Sales Rep Filter */}
                        <select
                            value={selectedRep}
                            onChange={(e) => setSelectedRep(e.target.value)}
                            className="px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white"
                        >
                            {availableReps.map(rep => (
                                <option key={rep} value={rep}>{rep}</option>
                            ))}
                        </select>

                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white"
                        >
                            {availableCategories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        {/* Year Filter */}
                        <select
                            value={yearFilter}
                            onChange={(e) => setYearFilter(e.target.value)}
                            className="px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white"
                        >
                            <option value="all">전체 연도</option>
                            <option value="2025">2025년</option>
                            <option value="2024">2024년</option>
                            <option value="2023">2023년</option>
                            <option value="2022">2022년</option>
                        </select>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                            <input
                                type="text"
                                placeholder="형번/상품군 검색..."
                                className="pl-9 pr-4 py-2 bg-secondary text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent w-48"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                        <TrendingUp className="text-purple-400" size={32} />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 border border-amber-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-amber-300 text-sm">평균 단가</p>
                            <p className="text-2xl font-bold text-white mt-1">{formatCurrency(summary.avgPrice)}</p>
                        </div>
                        <Users className="text-amber-400" size={32} />
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className={`grid gap-6 ${selectedDept === '전체' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                {/* Scatter Plot - Product Portfolio */}
                <div className="bg-card border border-border rounded-xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Sparkles className="text-accent" size={20} />
                        제품 포트폴리오 분석
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">X: 판매수량, Y: 평균단가, 크기: 매출액</p>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis
                                    type="number"
                                    dataKey="x"
                                    name="수량"
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    tickFormatter={(v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}
                                />
                                <YAxis
                                    type="number"
                                    dataKey="y"
                                    name="단가"
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    tickFormatter={(v) => v >= 1000000 ? `${(v / 1000000).toFixed(0)}M` : v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}
                                />
                                <ZAxis type="number" dataKey="z" range={[50, 400]} />
                                <Tooltip content={<ScatterTooltip />} />
                                <Scatter
                                    data={scatterData}
                                    fill="#5a8fd4"
                                    fillOpacity={0.7}
                                    onClick={(data) => {
                                        const model = modelAnalysisData.find(m => m.model_number === data.name);
                                        if (model) setSelectedModel(model);
                                    }}
                                    cursor="pointer"
                                />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Rep Ranking Bar Chart (전체 mode only) */}
                {selectedDept === '전체' && repRankingData.length > 0 && (
                    <div className="bg-card border border-border rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Users className="text-accent" size={20} />
                            담당자별 매출 랭킹
                        </h3>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={repRankingData.slice(0, 8)} layout="vertical" margin={{ left: 80, right: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
                                    <XAxis
                                        type="number"
                                        tick={{ fill: '#9ca3af', fontSize: 12 }}
                                        tickFormatter={(v) => v >= 1000000000 ? `${(v / 1000000000).toFixed(0)}B` : v >= 1000000 ? `${(v / 1000000).toFixed(0)}M` : v}
                                    />
                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        tick={{ fill: '#fff', fontSize: 12 }}
                                        width={75}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => [formatCurrency(value), '매출']}
                                        contentStyle={{
                                            backgroundColor: '#1f2937',
                                            border: '1px solid #374151',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                        labelStyle={{ color: '#fff', fontWeight: 'bold', marginBottom: '4px' }}
                                        itemStyle={{ color: '#5a8fd4', fontWeight: 'bold', fontSize: '14px' }}
                                    />
                                    <Bar dataKey="total_sales" radius={[0, 4, 4, 0]}>
                                        {repRankingData.slice(0, 8).map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}
            </div>

            {/* Smart Grid Table */}
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
                                <th className="px-4 py-3 font-bold text-muted-foreground">추이</th>
                                <th className="px-4 py-3 font-bold text-muted-foreground">상품군</th>
                                {selectedDept !== '전체' && <th className="px-4 py-3 font-bold text-muted-foreground">담당자</th>}
                                <th className="px-4 py-3 font-bold text-muted-foreground text-right cursor-pointer hover:bg-secondary/50" onClick={() => handleSort('total_quantity')}>
                                    <div className="flex items-center justify-end gap-1">판매수량 <SortIcon columnKey="total_quantity" /></div>
                                </th>
                                <th className="px-4 py-3 font-bold text-muted-foreground text-right cursor-pointer hover:bg-secondary/50" onClick={() => handleSort('total_sales')}>
                                    <div className="flex items-center justify-end gap-1">매출액 <SortIcon columnKey="total_sales" /></div>
                                </th>
                                <th className="px-4 py-3 font-bold text-muted-foreground text-right cursor-pointer hover:bg-secondary/50" onClick={() => handleSort('avg_unit_price')}>
                                    <div className="flex items-center justify-end gap-1">평균단가 <SortIcon columnKey="avg_unit_price" /></div>
                                </th>
                                <th className="px-4 py-3 font-bold text-muted-foreground">주요 거래처</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {searchFilteredData.length > 0 ? (
                                searchFilteredData.slice(0, 50).map((item) => (
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
                                        <td className="px-4 py-3">
                                            <Sparkline data={item.sparkline_data} />
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">{item.product_name}</td>
                                        {selectedDept !== '전체' && <td className="px-4 py-3 text-muted-foreground">{item.sales_rep}</td>}
                                        <td className="px-4 py-3 text-right font-medium">{item.total_quantity.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right font-bold text-accent">{formatCurrency(item.total_sales)}</td>
                                        <td className="px-4 py-3 text-right">{formatCurrency(item.avg_unit_price)}</td>
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
                                    <td colSpan={selectedDept !== '전체' ? 9 : 8} className="px-4 py-8 text-center text-muted-foreground">
                                        데이터가 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-4 py-3 border-t border-border text-sm text-muted-foreground">
                    총 {searchFilteredData.length}개 형번 중 상위 50개 표시
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
                                <p className="text-muted-foreground">{selectedModel.product_name} • {selectedModel.sales_rep}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setSelectedModel(null)}
                            className="p-2 text-muted-foreground hover:text-white hover:bg-secondary/50 rounded-lg transition-colors"
                        >
                            <X size={20} />
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
                            <p className={`text-xl font-bold flex items-center gap-1 ${selectedModel.growth_rate >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {selectedModel.growth_rate > 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                                {selectedModel.growth_rate > 0 ? '+' : ''}{selectedModel.growth_rate.toFixed(1)}%
                            </p>
                        </div>
                    </div>

                    {/* Monthly Trend Chart */}
                    <div className="mb-6">
                        <h4 className="font-bold text-white mb-4">📊 월별 매출 추이</h4>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={selectedModel.monthly_trend} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                    <XAxis
                                        dataKey="month"
                                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                                        tickFormatter={(v) => v.substring(5)}
                                    />
                                    <YAxis
                                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                                        tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => [formatCurrency(value), '매출']}
                                        contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                                        labelStyle={{ color: '#fff' }}
                                    />
                                    <Bar dataKey="amount" fill="#5a8fd4" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Top Companies */}
                    <div>
                        <h4 className="font-bold text-white mb-4">🏢 주요 거래처 TOP 5</h4>
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
