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
import { TrendingUp, Loader2 } from 'lucide-react';

export default function CompanyDetailAnalysis() {
    const [loading, setLoading] = useState(true);
    const [periodType, setPeriodType] = useState<'monthly' | 'quarterly'>('monthly');
    const [selectedCompany, setSelectedCompany] = useState<string>('');
    const [companyList, setCompanyList] = useState<string[]>([]);
    const [chartData, setChartData] = useState<any[]>([]); // Changed SalesData[] to any[] to support dynamic keys
    const [availableYears, setAvailableYears] = useState<number[]>([]);
    const [allData, setAllData] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (allData.length > 0) {
            processChartData();
        }
    }, [periodType, selectedCompany, allData]); // Removed selectedYear dependency

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch data with chunked loading
            let fetchedData: any[] = [];
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
                    fetchedData = [...fetchedData, ...salesData];
                    if (salesData.length < pageSize) {
                        hasMore = false;
                    } else {
                        page++;
                    }
                } else {
                    hasMore = false;
                }
            }

            setAllData(fetchedData);

            // Extract unique companies
            const companies = Array.from(new Set(fetchedData.map(d => d.company_name))).sort();
            setCompanyList(companies);

            if (companies.length > 0) {
                setSelectedCompany(companies[0]);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const processChartData = () => {
        if (!selectedCompany) return;

        // Filter by company only
        const filtered = allData.filter(d => d.company_name === selectedCompany);

        // Determine available years from data
        const years = Array.from(new Set(filtered.map(d => new Date(d.shipment_date).getFullYear()))).sort();
        setAvailableYears(years);

        const periods = periodType === 'monthly'
            ? Array.from({ length: 12 }, (_, i) => `${i + 1}월`)
            : ['1분기', '2분기', '3분기', '4분기'];

        const chartDataList: any[] = [];

        periods.forEach((p, index) => {
            const dataPoint: any = { period: p };

            years.forEach(year => {
                // Filter for this year and period
                const yearData = filtered.filter(d => {
                    const date = new Date(d.shipment_date);
                    if (date.getFullYear() !== year) return false;

                    const month = date.getMonth(); // 0-11
                    if (periodType === 'monthly') {
                        return month === index;
                    } else {
                        // Quarterly: 0-2=Q1, 3-5=Q2...
                        const q = Math.floor(month / 3);
                        return q === index;
                    }
                });

                const total = yearData.reduce((sum, d) => sum + d.sales_amount, 0);
                dataPoint[year] = total;
            });

            chartDataList.push(dataPoint);
        });

        setChartData(chartDataList);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(value);
    };

    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']; // Red, Amber, Emerald, Blue, Violet

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-800 text-white p-4 rounded-lg shadow-xl border border-gray-700">
                    <p className="font-bold text-lg mb-2">{label}</p>
                    <div className="space-y-2">
                        {payload.map((entry: any, index: number) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                <span className="text-gray-300">{entry.name}:</span>
                                <span className="font-mono font-medium">{formatCurrency(entry.value)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };

    const CustomizedDot = (props: any) => {
        const { cx, cy, stroke } = props;
        // Simple dot with halo effect on hover (handled by activeDot usually, but here we can make it static or interactive)
        // Since we don't have 'selectedStore' equivalent here, we just render a nice dot.
        return (
            <g>
                <circle cx={cx} cy={cy} r={6} fill={stroke} stroke="white" strokeWidth={3} />
            </g>
        );
    };

    return (
        <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-2">
                    <TrendingUp className="text-blue-600" size={24} />
                    <h2 className="text-lg font-bold text-gray-900">개별 업체 매출 분석</h2>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
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

                    <div className="relative">
                        <select
                            value={selectedCompany}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                            className="pl-3 pr-8 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
                        >
                            {companyList.map(company => (
                                <option key={company} value={company}>{company}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="h-96 flex items-center justify-center">
                    <Loader2 className="animate-spin text-blue-600" size={40} />
                </div>
            ) : (
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 mb-6">
                        {selectedCompany} 매출 추이 ({availableYears.join(', ')}년)
                    </h3>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="period"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    tickFormatter={(value) => `${value / 1000000}M`}
                                />
                                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#e5e7eb', strokeWidth: 2 }} />
                                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />

                                {availableYears.map((year, index) => (
                                    <Line
                                        key={year}
                                        type="monotone"
                                        dataKey={year}
                                        name={`${year}년 매출`}
                                        stroke={colors[index % colors.length]}
                                        strokeWidth={3}
                                        dot={<CustomizedDot />}
                                        activeDot={{ r: 8, strokeWidth: 0 }}
                                    />
                                ))}
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
        </div>
    );
}
