import { useState, useEffect } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { supabase } from '../lib/supabase';
import { Trophy, TrendingUp, Loader2 } from 'lucide-react';

interface AggregatedData {
    period: string; // "1월", "2월"... or "1분기", "2분기"...
    [key: string]: number | string; // Dynamic keys for company names
}

interface TopCompany {
    rank: number;
    name: string;
    totalSales: number;
}

export default function CompanySalesAnalysis() {
    const [loading, setLoading] = useState(true);
    const [periodType, setPeriodType] = useState<'monthly' | 'quarterly'>('monthly');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [chartData, setChartData] = useState<AggregatedData[]>([]);
    const [topCompanies, setTopCompanies] = useState<TopCompany[]>([]);
    const [availableYears, setAvailableYears] = useState<number[]>([]);

    useEffect(() => {
        fetchData();
    }, [selectedYear, periodType]);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch data with chunked loading to get all records
            let allSalesData: any[] = [];
            let page = 0;
            const pageSize = 1000;
            let hasMore = true;

            while (hasMore) {
                const { data: salesData, error } = await supabase
                    .from('sales_performance')
                    .select('company_name, shipment_date, sales_amount, sales_rep')
                    .in('sales_rep', ['탁현호', '임성렬'])
                    .range(page * pageSize, (page + 1) * pageSize - 1);

                if (error) throw error;

                if (salesData && salesData.length > 0) {
                    allSalesData = [...allSalesData, ...salesData];
                    if (salesData.length < pageSize) {
                        hasMore = false;
                    } else {
                        page++;
                    }
                } else {
                    hasMore = false;
                }
            }

            if (allSalesData.length === 0) return;

            // Extract available years
            const detectedYears = Array.from(new Set(allSalesData.map(d => new Date(d.shipment_date).getFullYear())));
            // Ensure 2022-2025 are included as requested
            const years = Array.from(new Set([...detectedYears, 2022, 2023, 2024, 2025])).sort((a, b) => b - a);
            setAvailableYears(years);

            // Filter by selected year
            const filteredData = allSalesData.filter(d => new Date(d.shipment_date).getFullYear() === selectedYear);

            // 1. Identify Top 5 Companies by Total Sales in the selected year
            const companyTotals: Record<string, number> = {};
            filteredData.forEach(d => {
                companyTotals[d.company_name] = (companyTotals[d.company_name] || 0) + d.sales_amount;
            });

            const sortedCompanies = Object.entries(companyTotals)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([name, totalSales], index) => ({
                    rank: index + 1,
                    name,
                    totalSales
                }));

            setTopCompanies(sortedCompanies);

            // 2. Aggregate Data for Chart (Monthly/Quarterly Top 5)
            const periods = periodType === 'monthly'
                ? Array.from({ length: 12 }, (_, i) => `${i + 1}월`)
                : ['1분기', '2분기', '3분기', '4분기'];

            const chartDataList: any[] = [];

            periods.forEach((p, index) => {
                // Find start and end month for the period
                let startMonth: number, endMonth: number;
                if (periodType === 'monthly') {
                    startMonth = index;
                    endMonth = index;
                } else {
                    startMonth = index * 3;
                    endMonth = index * 3 + 2;
                }

                // Filter data for this period
                const periodData = filteredData.filter(d => {
                    const date = new Date(d.shipment_date);
                    const month = date.getMonth();
                    return month >= startMonth && month <= endMonth;
                });

                // Calculate totals for this period
                const periodTotals: Record<string, number> = {};
                periodData.forEach(d => {
                    periodTotals[d.company_name] = (periodTotals[d.company_name] || 0) + d.sales_amount;
                });

                // Sort and take Top 5
                const top5InPeriod = Object.entries(periodTotals)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5);

                // Construct data point
                const dataPoint: any = { period: p };
                top5InPeriod.forEach(([name, sales], i) => {
                    dataPoint[`rank${i + 1}`] = sales;
                    dataPoint[`rank${i + 1}_name`] = name;
                });

                // Fill remaining ranks with 0 if less than 5 companies
                for (let i = top5InPeriod.length; i < 5; i++) {
                    dataPoint[`rank${i + 1}`] = 0;
                    dataPoint[`rank${i + 1}_name`] = '-';
                }

                chartDataList.push(dataPoint);
            });

            setChartData(chartDataList);

        } catch (error) {
            console.error('Error fetching company sales data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(value);
    };

    const colors = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a'];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-bold text-gray-900 mb-2">{label} 매출 Top 5</p>
                    <div className="space-y-2">
                        {payload.map((entry: any, index: number) => {
                            const rank = entry.dataKey.replace('rank', '');
                            const companyName = entry.payload[`rank${rank}_name`];
                            if (!companyName || companyName === '-') return null;

                            return (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                                    <span className="font-bold text-gray-700">{rank}위:</span>
                                    <span className="text-gray-600 truncate max-w-[100px]" title={companyName}>{companyName}</span>
                                    <span className="font-mono font-medium text-gray-900 ml-auto">{formatCurrency(entry.value)}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2">
                    <TrendingUp className="text-blue-600" size={24} />
                    <h2 className="text-lg font-bold text-gray-900">상위 5개 업체 매출 분석</h2>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                            onClick={() => setPeriodType('monthly')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${periodType === 'monthly'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            월별
                        </button>
                        <button
                            onClick={() => setPeriodType('quarterly')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${periodType === 'quarterly'
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            분기별
                        </button>
                    </div>

                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {availableYears.map(year => (
                            <option key={year} value={year}>{year}년</option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="h-96 flex items-center justify-center">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                </div>
            ) : (
                <>
                    {/* Top 5 Cards (Annual) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {topCompanies.map((company, index) => (
                            <div key={company.name} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Trophy size={48} color={colors[index]} />
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span
                                        className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white"
                                        style={{ backgroundColor: colors[index] }}
                                    >
                                        {company.rank}
                                    </span>
                                    <span className="text-sm font-medium text-gray-500">Top {company.rank}</span>
                                </div>
                                <h3 className="font-bold text-gray-900 truncate mb-1" title={company.name}>{company.name}</h3>
                                <p className="text-lg font-bold text-blue-600">{formatCurrency(company.totalSales)}</p>
                            </div>
                        ))}
                    </div>

                    {/* Chart */}
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">
                            상위 5개 업체 매출 추이 ({selectedYear}년 {periodType === 'monthly' ? '월별' : '분기별'})
                        </h3>
                        <div className="h-[400px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="period" />
                                    <YAxis tickFormatter={(value) => `${value / 1000000}M`} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    {[1, 2, 3, 4, 5].map((rank, index) => (
                                        <Line
                                            key={rank}
                                            type="monotone"
                                            dataKey={`rank${rank}`}
                                            name={`${rank}위`}
                                            stroke={colors[index]}
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    ))}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
