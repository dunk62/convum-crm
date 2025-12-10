import { useState, useEffect, useMemo, useCallback } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend
} from 'recharts';
import { supabase } from '../lib/supabase';
import {
    TrendingUp,
    TrendingDown,
    Package,
    BarChart3,
    AlertTriangle,
    Download,
    Star,
    Filter,
    Loader2,
    ChevronRight
} from 'lucide-react';

interface SalesRecord {
    id: string;
    shipment_date: string;
    sales_rep: string;
    product_name: string;
    model_number: string;
    quantity: number;
    unit_price: number;
    sales_amount: number;
}

interface ForecastItem {
    model_number: string;
    product_name: string;
    sales_rep: string;
    predicted_qty_2026: number;
    predicted_sales_2026: number;
    prev_year_qty: number;
    prev_year_sales: number;
    yoy_growth_rate: number;
    is_growth_star: boolean;
    monthly_2025: { month: string; qty: number; sales: number }[];
    monthly_2026: { month: string; qty: number; sales: number }[];
}

interface MonthlyData {
    month: string;
    actual_2025: number;
    predicted_2026: number;
}

// 부서별 담당자 그룹
const deptGroups: { [key: string]: string[] } = {
    '전체': [],
    '북부': ['김광중'],
    '남부': ['탁현호', '임성렬'],
    'CS': ['윤회승', '이다경'],
    '수출': ['윤회승(수출)', '이다경(수출)']
};

export default function SalesForecastDashboard() {
    const [salesData2025, setSalesData2025] = useState<SalesRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDept, setSelectedDept] = useState<string>('전체');
    const [selectedRep, setSelectedRep] = useState<string>('전체');
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

    // Fetch all required data
    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);

            const pageSize = 1000;
            let all2025: SalesRecord[] = [];
            let page = 0;
            let hasMore = true;

            // Fetch 2025 data
            while (hasMore) {
                const { data, error } = await supabase
                    .from('sales_performance')
                    .select('*')
                    .gte('shipment_date', '2025-01-01')
                    .lte('shipment_date', '2025-12-31')
                    .range(page * pageSize, (page + 1) * pageSize - 1);

                if (error) throw error;
                if (data && data.length > 0) {
                    all2025 = [...all2025, ...data];
                    hasMore = data.length === pageSize;
                    page++;
                } else {
                    hasMore = false;
                }
            }

            setSalesData2025(all2025);


        } catch (err: any) {
            console.error('Error fetching data:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();

        // Real-time subscription for automatic updates
        const subscription = supabase
            .channel('forecast_sales_changes')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'sales_performance' },
                () => {
                    console.log('Sales data changed, refreshing forecast...');
                    fetchData();
                }
            )
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [fetchData]);

    // Get available reps based on selected department
    const availableReps = useMemo(() => {
        if (selectedDept === '전체') {
            const allReps: string[] = [];
            Object.values(deptGroups).forEach(reps => allReps.push(...reps));
            return ['전체', ...allReps];
        }
        return ['전체', ...(deptGroups[selectedDept] || [])];
    }, [selectedDept]);

    // Filter data by dept/rep
    const filteredData2025 = useMemo(() => {
        let data = salesData2025;
        if (selectedDept !== '전체') {
            const repsInDept = deptGroups[selectedDept] || [];
            data = data.filter(d => repsInDept.includes(d.sales_rep));
        }
        if (selectedRep !== '전체') {
            data = data.filter(d => d.sales_rep === selectedRep);
        }
        return data;
    }, [salesData2025, selectedDept, selectedRep]);

    // Calculate forecast data
    const forecastData = useMemo((): ForecastItem[] => {
        if (!salesData2025.length) return [];

        // Get recent 3 months
        const sortedDates = [...new Set(salesData2025.map(d => d.shipment_date))].sort().reverse();
        const recentMonths = sortedDates.slice(0, 3).map(d => d.substring(0, 7));

        // Group by model
        const modelMap = new Map<string, {
            model_number: string;
            product_name: string;
            sales_rep: string;
            qty_2025_by_month: Map<string, number>;
            sales_2025_by_month: Map<string, number>;
            total_qty_2025: number;
            total_sales_2025: number;
            recent_3m_qty: number;
            recent_3m_sales: number;
            avg_unit_price: number;
        }>();

        // Process 2025 data
        filteredData2025.forEach(record => {
            if (!record.model_number) return;
            const month = record.shipment_date.substring(0, 7);
            const existing = modelMap.get(record.model_number);

            if (existing) {
                existing.qty_2025_by_month.set(month, (existing.qty_2025_by_month.get(month) || 0) + (record.quantity || 0));
                existing.sales_2025_by_month.set(month, (existing.sales_2025_by_month.get(month) || 0) + (record.sales_amount || 0));
                existing.total_qty_2025 += record.quantity || 0;
                existing.total_sales_2025 += record.sales_amount || 0;
                if (recentMonths.some(m => record.shipment_date.startsWith(m))) {
                    existing.recent_3m_qty += record.quantity || 0;
                    existing.recent_3m_sales += record.sales_amount || 0;
                }
            } else {
                const qty_by_month = new Map<string, number>();
                const sales_by_month = new Map<string, number>();
                qty_by_month.set(month, record.quantity || 0);
                sales_by_month.set(month, record.sales_amount || 0);

                modelMap.set(record.model_number, {
                    model_number: record.model_number,
                    product_name: record.product_name || '기타',
                    sales_rep: record.sales_rep || '',
                    qty_2025_by_month: qty_by_month,
                    sales_2025_by_month: sales_by_month,
                    total_qty_2025: record.quantity || 0,
                    total_sales_2025: record.sales_amount || 0,
                    recent_3m_qty: recentMonths.some(m => record.shipment_date.startsWith(m)) ? (record.quantity || 0) : 0,
                    recent_3m_sales: recentMonths.some(m => record.shipment_date.startsWith(m)) ? (record.sales_amount || 0) : 0,
                    avg_unit_price: record.unit_price || 0,
                });
            }
        });

        // Calculate forecasts
        const forecasts: ForecastItem[] = [];

        modelMap.forEach((data, modelNumber) => {
            const recent3mAvgQty = data.recent_3m_qty / 3;
            const recent3mAvgSales = data.recent_3m_sales / 3;

            // Monthly forecast for 2026
            const monthly_2025: { month: string; qty: number; sales: number }[] = [];
            const monthly_2026: { month: string; qty: number; sales: number }[] = [];
            let total_predicted_qty = 0;
            let total_predicted_sales = 0;

            for (let m = 1; m <= 12; m++) {
                const monthStr = m.toString().padStart(2, '0');
                const month2025 = `2025-${monthStr}`;
                const month2026 = `2026-${monthStr}`;

                const qty2025 = data.qty_2025_by_month.get(month2025) || 0;
                const sales2025 = data.sales_2025_by_month.get(month2025) || 0;

                // Forecast: (prev year same month * 0.4) + (recent 3 months avg * 0.6)
                const predictedQty = Math.round((qty2025 * 0.4) + (recent3mAvgQty * 0.6));
                const predictedSales = Math.round((sales2025 * 0.4) + (recent3mAvgSales * 0.6));

                monthly_2025.push({ month: month2025, qty: qty2025, sales: sales2025 });
                monthly_2026.push({ month: month2026, qty: predictedQty, sales: predictedSales });

                total_predicted_qty += predictedQty;
                total_predicted_sales += predictedSales;
            }

            const yoyGrowth = data.total_sales_2025 > 0
                ? ((total_predicted_sales - data.total_sales_2025) / data.total_sales_2025) * 100
                : 0;

            forecasts.push({
                model_number: modelNumber,
                product_name: data.product_name,
                sales_rep: data.sales_rep,
                predicted_qty_2026: total_predicted_qty,
                predicted_sales_2026: total_predicted_sales,
                prev_year_qty: data.total_qty_2025,
                prev_year_sales: data.total_sales_2025,
                yoy_growth_rate: yoyGrowth,
                is_growth_star: yoyGrowth >= 20,
                monthly_2025,
                monthly_2026,
            });
        });

        return forecasts.sort((a, b) => b.predicted_sales_2026 - a.predicted_sales_2026);
    }, [filteredData2025]);

    // Summary by rep (for drill-down)
    const repSummary = useMemo(() => {
        const summary = new Map<string, { total_2025: number; total_2026: number; growth: number }>();

        forecastData.forEach(item => {
            const existing = summary.get(item.sales_rep);
            if (existing) {
                existing.total_2025 += item.prev_year_sales;
                existing.total_2026 += item.predicted_sales_2026;
            } else {
                summary.set(item.sales_rep, {
                    total_2025: item.prev_year_sales,
                    total_2026: item.predicted_sales_2026,
                    growth: 0,
                });
            }
        });

        summary.forEach((val) => {
            val.growth = val.total_2025 > 0 ? ((val.total_2026 - val.total_2025) / val.total_2025) * 100 : 0;
        });

        return Array.from(summary.entries()).map(([name, data]) => ({ name, ...data }));
    }, [forecastData]);

    // Use repSummary to prevent unused warning (for future drill-down feature)
    console.debug('Rep summary count:', repSummary.length);

    // Trend chart data
    const trendChartData = useMemo((): MonthlyData[] => {
        const data: MonthlyData[] = [];
        const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

        months.forEach(m => {
            let actual = 0;
            let predicted = 0;

            forecastData.forEach(item => {
                const m2025 = item.monthly_2025.find(d => d.month.endsWith(m));
                const m2026 = item.monthly_2026.find(d => d.month.endsWith(m));
                if (m2025) actual += m2025.sales;
                if (m2026) predicted += m2026.sales;
            });

            data.push({
                month: `${m}월`,
                actual_2025: actual,
                predicted_2026: predicted,
            });
        });

        return data;
    }, [forecastData]);

    // Monthly grid data when a month is selected
    const monthlyGridData = useMemo(() => {
        if (!selectedMonth) return null;

        const monthNum = selectedMonth.replace('월', '').padStart(2, '0');
        const month2025 = `2025-${monthNum}`;
        const month2026 = `2026-${monthNum}`;

        return forecastData.map(item => {
            const m2025 = item.monthly_2025.find(d => d.month === month2025);
            const m2026 = item.monthly_2026.find(d => d.month === month2026);

            const qty2025 = m2025?.qty || 0;
            const sales2025 = m2025?.sales || 0;
            const qty2026 = m2026?.qty || 0;
            const sales2026 = m2026?.sales || 0;

            const monthGrowth = sales2025 > 0
                ? ((sales2026 - sales2025) / sales2025) * 100
                : 0;

            return {
                ...item,
                monthly_qty_2025: qty2025,
                monthly_sales_2025: sales2025,
                monthly_qty_2026: qty2026,
                monthly_sales_2026: sales2026,
                monthly_growth: monthGrowth,
            };
        }).filter(item => item.monthly_sales_2025 > 0 || item.monthly_sales_2026 > 0)
            .sort((a, b) => b.monthly_sales_2026 - a.monthly_sales_2026);
    }, [forecastData, selectedMonth]);

    // Summary totals
    const totals = useMemo(() => {
        const total2025 = forecastData.reduce((sum, i) => sum + i.prev_year_sales, 0);
        const total2026 = forecastData.reduce((sum, i) => sum + i.predicted_sales_2026, 0);
        const starCount = forecastData.filter(i => i.is_growth_star).length;
        const growth = total2025 > 0 ? ((total2026 - total2025) / total2025) * 100 : 0;
        return { total2025, total2026, starCount, growth };
    }, [forecastData]);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(amount);

    // CSV Download
    const downloadCSV = () => {
        const headers = ['형번', '상품군', '담당자', '2026예측수량', '2026예측매출', '2025실적', '증감률(%)'];
        const rows = forecastData.map(item => [
            item.model_number,
            item.product_name,
            item.sales_rep,
            item.predicted_qty_2026,
            item.predicted_sales_2026,
            item.prev_year_sales,
            item.yoy_growth_rate.toFixed(1)
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `2026_매출예측_${selectedDept}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
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
            {/* Header */}
            <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-purple-700/40 flex items-center justify-center">
                            <TrendingUp className="text-purple-400" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">2026년 매출 예측 시뮬레이션</h2>
                            <p className="text-sm text-muted-foreground">가중치 공식: (전년 동월 × 0.4) + (최근 3개월 평균 × 0.6)</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3 items-center">
                        {/* Drill-down filters */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Filter size={16} />
                            <span>전사</span>
                            <ChevronRight size={14} />
                        </div>
                        <select
                            value={selectedDept}
                            onChange={(e) => {
                                setSelectedDept(e.target.value);
                                setSelectedRep('전체');
                            }}
                            className="px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white"
                        >
                            {Object.keys(deptGroups).map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>

                        <select
                            value={selectedRep}
                            onChange={(e) => setSelectedRep(e.target.value)}
                            className="px-4 py-2 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent text-white"
                        >
                            {availableReps.map(rep => (
                                <option key={rep} value={rep}>{rep}</option>
                            ))}
                        </select>

                        <button
                            onClick={downloadCSV}
                            className="flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent border border-accent/30 rounded-lg hover:bg-accent/30 transition-colors"
                        >
                            <Download size={16} />
                            CSV 다운로드
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-300 text-sm">2025년 실적</p>
                            <p className="text-xl font-bold text-white mt-1">{formatCurrency(totals.total2025)}</p>
                        </div>
                        <BarChart3 className="text-blue-400" size={28} />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-300 text-sm">2026년 예측</p>
                            <p className="text-xl font-bold text-white mt-1">{formatCurrency(totals.total2026)}</p>
                        </div>
                        <TrendingUp className="text-purple-400" size={28} />
                    </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border border-emerald-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-emerald-300 text-sm">전년 대비</p>
                            <p className={`text-xl font-bold mt-1 ${totals.growth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {totals.growth >= 0 ? '+' : ''}{totals.growth.toFixed(1)}%
                            </p>
                        </div>
                        {totals.growth >= 0 ? <TrendingUp className="text-emerald-400" size={28} /> : <TrendingDown className="text-red-400" size={28} />}
                    </div>
                </div>
                <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 border border-amber-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-amber-300 text-sm">성장 유망주 ★</p>
                            <p className="text-xl font-bold text-white mt-1">{totals.starCount}개</p>
                        </div>
                        <Star className="text-amber-400" size={28} />
                    </div>
                </div>
            </div>

            {/* Trend Comparison Chart */}
            <div className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <BarChart3 className="text-accent" size={20} />
                        2025 실적 vs 2026 예측 트렌드 비교
                        {selectedMonth && (
                            <span className="ml-2 text-sm bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                                {selectedMonth} 선택됨
                            </span>
                        )}
                    </h3>
                    {selectedMonth && (
                        <button
                            onClick={() => setSelectedMonth(null)}
                            className="text-sm text-muted-foreground hover:text-white px-3 py-1 border border-border rounded-lg hover:bg-secondary/50 transition-colors"
                        >
                            전체 보기
                        </button>
                    )}
                </div>
                <p className="text-sm text-muted-foreground mb-4">클릭하면 해당 월별 형번 예측 시트로 변경됩니다</p>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={trendChartData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            onClick={(data) => {
                                if (data && data.activeLabel) {
                                    setSelectedMonth(data.activeLabel as string);
                                }
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                            <YAxis
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                tickFormatter={(v) => v >= 1000000000 ? `${(v / 1000000000).toFixed(0)}B` : v >= 1000000 ? `${(v / 1000000).toFixed(0)}M` : v}
                            />
                            <Tooltip
                                formatter={(value: number, name: string) => [formatCurrency(value), name === 'actual_2025' ? '2025 실적' : '2026 예측']}
                                contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                                labelStyle={{ color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                            />
                            <Legend formatter={(value) => value === 'actual_2025' ? '2025 실적' : '2026 예측'} />
                            <Line
                                type="monotone"
                                dataKey="actual_2025"
                                stroke="#5a8fd4"
                                strokeWidth={2}
                                dot={{ fill: '#5a8fd4', r: 4 }}
                                activeDot={{ r: 8, fill: '#5a8fd4', stroke: '#fff', strokeWidth: 2 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="predicted_2026"
                                stroke="#a855f7"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={{ fill: '#a855f7', r: 4 }}
                                activeDot={{ r: 8, fill: '#a855f7', stroke: '#fff', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Forecast Grid */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <Package size={18} />
                        형번별 예측 시트
                        {selectedMonth && (
                            <span className="ml-2 text-sm bg-purple-500/20 text-purple-400 px-2 py-1 rounded">
                                {selectedMonth}
                            </span>
                        )}
                    </h3>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1 text-amber-400">
                            <Star size={14} /> 성장 유망주 (+20%↑)
                        </span>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gradient-to-r from-secondary/50 to-secondary/30 border-b border-border">
                            <tr>
                                <th className="px-4 py-3 font-bold text-muted-foreground">형번</th>
                                <th className="px-4 py-3 font-bold text-muted-foreground">상품군</th>
                                <th className="px-4 py-3 font-bold text-muted-foreground">담당자</th>
                                <th className="px-4 py-3 font-bold text-muted-foreground text-right">
                                    {selectedMonth ? `${selectedMonth} 예측 수량` : '2026 예측 수량'}
                                </th>
                                <th className="px-4 py-3 font-bold text-muted-foreground text-right">
                                    {selectedMonth ? `${selectedMonth} 예측 매출` : '2026 예측 매출'}
                                </th>
                                <th className="px-4 py-3 font-bold text-muted-foreground text-right">
                                    {selectedMonth ? `2025년 ${selectedMonth} 실적` : '2025 실적'}
                                </th>
                                <th className="px-4 py-3 font-bold text-muted-foreground text-right">증감률</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {selectedMonth && monthlyGridData ? (
                                monthlyGridData.slice(0, 50).map((item) => (
                                    <tr
                                        key={item.model_number}
                                        className="transition-colors hover:bg-secondary/30"
                                    >
                                        <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                                            {item.is_growth_star && <Star size={14} className="text-amber-400 fill-amber-400" />}
                                            {item.model_number}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">{item.product_name}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{item.sales_rep}</td>
                                        <td className="px-4 py-3 text-right font-medium">{item.monthly_qty_2026.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right font-bold text-purple-400">{formatCurrency(item.monthly_sales_2026)}</td>
                                        <td className="px-4 py-3 text-right">{formatCurrency(item.monthly_sales_2025)}</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${item.monthly_growth >= 20 ? 'bg-emerald-500/20 text-emerald-400' :
                                                item.monthly_growth >= 0 ? 'bg-blue-500/20 text-blue-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                {item.monthly_growth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                {item.monthly_growth >= 0 ? '+' : ''}{item.monthly_growth.toFixed(1)}%
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : forecastData.length > 0 ? (
                                forecastData.slice(0, 50).map((item) => (
                                    <tr
                                        key={item.model_number}
                                        className="transition-colors hover:bg-secondary/30"
                                    >
                                        <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                                            {item.is_growth_star && <Star size={14} className="text-amber-400 fill-amber-400" />}
                                            {item.model_number}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">{item.product_name}</td>
                                        <td className="px-4 py-3 text-muted-foreground">{item.sales_rep}</td>
                                        <td className="px-4 py-3 text-right font-medium">{item.predicted_qty_2026.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-right font-bold text-purple-400">{formatCurrency(item.predicted_sales_2026)}</td>
                                        <td className="px-4 py-3 text-right">{formatCurrency(item.prev_year_sales)}</td>
                                        <td className="px-4 py-3 text-right">
                                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${item.yoy_growth_rate >= 20 ? 'bg-emerald-500/20 text-emerald-400' :
                                                item.yoy_growth_rate >= 0 ? 'bg-blue-500/20 text-blue-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                {item.yoy_growth_rate >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                {item.yoy_growth_rate >= 0 ? '+' : ''}{item.yoy_growth_rate.toFixed(1)}%
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                                        데이터가 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-4 py-3 border-t border-border text-sm text-muted-foreground">
                    {selectedMonth && monthlyGridData
                        ? `${selectedMonth} 기준 ${monthlyGridData.length}개 형번 중 상위 50개 표시`
                        : `총 ${forecastData.length}개 형번 중 상위 50개 표시`
                    }
                </div>
            </div>
        </div>
    );
}
