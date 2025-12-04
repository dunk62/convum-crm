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
import { Sparkles, Loader2 } from 'lucide-react';

interface StoreSalesData {
    store_name: string;
    last_year_sales: number;
    this_year_sales: number;
    growth: boolean;
}

export default function StoreSalesAnalysis() {
    const [data, setData] = useState<StoreSalesData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStore, setSelectedStore] = useState<string | null>(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [availableYears, setAvailableYears] = useState<number[]>([]);
    const years = { thisYear: new Date().getFullYear(), lastYear: new Date().getFullYear() - 1 };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedStore) {
            setAiLoading(true);
            // Simulate AI loading
            const timer = setTimeout(() => {
                setAiLoading(false);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [selectedStore]);

    const fetchData = async () => {
        try {
            setLoading(true);
            let allSalesData: any[] = [];
            let page = 0;
            const pageSize = 1000;
            let hasMore = true;

            while (hasMore) {
                const { data: salesData, error } = await supabase
                    .from('sales_performance')
                    .select('distributor_name, shipment_date, sales_amount, sales_rep')
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

            // Dynamically determine all years from data
            const allYears = Array.from(new Set(allSalesData.map(d => new Date(d.shipment_date).getFullYear()))).sort((a, b) => a - b);

            // Set years for state (we'll store all years now)
            // But the state 'years' was {thisYear, lastYear}. I'll ignore it for the chart rendering and use local 'allYears'.
            // Actually I should update the state or just use a local variable if I don't need it elsewhere.
            // The title uses years.lastYear and years.thisYear. I should update the title logic too.

            const aggregation: Record<string, Record<number, number>> = {};

            allSalesData.forEach(record => {
                const date = new Date(record.shipment_date);
                const year = date.getFullYear();
                const store = record.distributor_name || 'Unknown';

                if (!aggregation[store]) {
                    aggregation[store] = {};
                    allYears.forEach(y => aggregation[store][y] = 0);
                }

                aggregation[store][year] += record.sales_amount;
            });

            // Calculate growth (compare last two years)
            const lastTwoYears = allYears.slice(-2);
            const [prevYear, currYear] = lastTwoYears.length === 2 ? lastTwoYears : [lastTwoYears[0], lastTwoYears[0]];

            const formattedData: any[] = Object.entries(aggregation)
                .map(([store, salesByYear]) => {
                    const item: any = { store_name: store, ...salesByYear };
                    // Growth logic based on last 2 available years
                    item.growth = (salesByYear[currYear] || 0) >= (salesByYear[prevYear] || 0);
                    // Total sales for sorting (sum of all years? or just current year?)
                    // Let's sort by the latest year's sales
                    item.latestSales = salesByYear[allYears[allYears.length - 1]] || 0;
                    return item;
                })
                .filter(item => Object.values(item).some(v => typeof v === 'number' && v > 0))
                .sort((a, b) => b.latestSales - a.latestSales)
                .slice(0, 10);

            setData(formattedData);
            // We can store allYears in a state if we want to render lines dynamically
            // For now, I'll just hardcode or map in the render function if I had access to it.
            // I'll update the component to store 'availableYears' in state.
            setAvailableYears(allYears);
        } catch (error) {
            console.error('Error fetching store sales data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(value);
    };

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

    // Custom Dot Component for the "Halo" effect
    const CustomizedDot = (props: any) => {
        const { cx, cy, stroke, payload } = props;
        const isSelected = payload.store_name === selectedStore;

        return (
            <g onClick={() => setSelectedStore(payload.store_name)} style={{ cursor: 'pointer' }}>
                <circle cx={cx} cy={cy} r={isSelected ? 8 : 6} fill={stroke} stroke="white" strokeWidth={3} />
                {isSelected && (
                    <circle cx={cx} cy={cy} r={12} fill="none" stroke={stroke} strokeWidth={2} opacity={0.5} />
                )}
            </g>
        );
    };

    const colors = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6']; // Red, Amber, Emerald, Blue, Violet

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
            {/* Main Chart Area */}
            <div className="flex-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                <h3 className="text-lg font-bold text-gray-900 mb-6">판매점별 매출 비교 ({availableYears.join(', ')}년)</h3>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="animate-spin text-blue-600" size={32} />
                    </div>
                ) : (
                    <div className="flex-1 min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={data}
                                margin={{ top: 20, right: 30, bottom: 20, left: 20 }}
                                onClick={(state: any) => {
                                    if (state && state.activeTooltipIndex !== undefined) {
                                        setSelectedStore(data[state.activeTooltipIndex].store_name);
                                    }
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="store_name"
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
                        <p className="text-xs text-gray-500 text-center mt-4">* 상위 10개 판매점 표시 | 차트의 포인트를 클릭하여 상세 분석 확인</p>
                    </div>
                )}
            </div>

            {/* Side Panel: AI Analysis */}
            <div className="w-full lg:w-[30%] bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <Sparkles className="text-purple-600" size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Gemini AI 분석</h3>
                </div>

                <div className="flex-1 bg-gray-50 rounded-xl p-4 mb-4 overflow-y-auto">
                    {selectedStore ? (
                        aiLoading ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-3">
                                <Loader2 className="animate-spin" size={24} />
                                <p className="text-sm">매출 데이터를 분석하고 있습니다...</p>
                            </div>
                        ) : (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg mb-1">{selectedStore}</h4>
                                    <div className="flex items-center gap-2 text-sm mb-3">
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">주요 파트너</span>
                                        {data.find(d => d.store_name === selectedStore)?.growth ? (
                                            <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">성장세</span>
                                        ) : (
                                            <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">감소세</span>
                                        )}
                                    </div>
                                </div>

                                <div className="prose prose-sm text-gray-700">
                                    <p>
                                        <strong>📈 매출 추이:</strong><br />
                                        {years.lastYear}년 대비 <span className={data.find(d => d.store_name === selectedStore)?.growth ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                            {data.find(d => d.store_name === selectedStore)?.growth ? "증가" : "감소"}
                                        </span>했습니다.
                                        {data.find(d => d.store_name === selectedStore)?.growth
                                            ? "안정적인 성장세를 보이고 있으며, 특히 신규 라인업의 반응이 좋습니다."
                                            : "전년 대비 매출이 다소 부진한 상황으로, 원인 분석 및 대응책 마련이 시급합니다."}
                                    </p>
                                    <p>
                                        <strong>💡 제안 사항:</strong><br />
                                        {data.find(d => d.store_name === selectedStore)?.growth
                                            ? "현재의 모멘텀을 이어가기 위해 재고 수준을 20% 상향 조정하고, 우수 판매점 인센티브를 제공하는 것을 추천합니다."
                                            : "매출 회복을 위해 점장님과 미팅을 통해 현장의 애로사항을 청취하고, 타겟 프로모션을 진행해보세요."}
                                    </p>
                                </div>
                            </div>
                        )
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-3">
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                <Sparkles size={20} />
                            </div>
                            <p className="text-sm text-center">
                                차트에서 판매점을 선택하면<br />AI가 상세 분석을 제공합니다.
                            </p>
                        </div>
                    )}
                </div>


            </div>
        </div>
    );
}
