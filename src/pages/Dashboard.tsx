import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, Users, Briefcase, Activity, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

const StatCard = ({ label, value, icon: Icon }: any) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col justify-between">
        <div className="flex items-start justify-between mb-4">
            <div className="p-2 bg-primary/5 rounded-lg text-primary">
                <Icon size={20} />
            </div>
            <h3 className="text-2xl font-bold text-gray-500 text-right">{label}</h3>
        </div>
        <div className="flex justify-end items-end mt-auto">
            <p className="text-4xl font-bold text-gray-900">{value}</p>
        </div>
    </div>
);


export default function Dashboard() {
    const navigate = useNavigate();
    const [chartData, setChartData] = useState<{ name: string; revenue: number; target: number }[]>([]);
    const [currentMonthRevenue, setCurrentMonthRevenue] = useState(0);
    const [currentMonthTarget, setCurrentMonthTarget] = useState(0);
    const [currentMonthLabel, setCurrentMonthLabel] = useState('');
    const [expectedRevenue, setExpectedRevenue] = useState(0);
    const [recentOpportunities, setRecentOpportunities] = useState<any[]>([]);
    const [contactCount, setContactCount] = useState(0);

    // Monthly Targets for 2025
    const targets: { [key: string]: number } = {
        '2025-01': 78780000,
        '2025-02': 135380000,
        '2025-03': 112980000,
        '2025-04': 110800000,
        '2025-05': 157300000,
        '2025-06': 106800000,
        '2025-07': 56800000,
        '2025-08': 109800000,
        '2025-09': 125100000,
        '2025-10': 52600000,
        '2025-11': 108500000,
        '2025-12': 37660000
    };

    const stats = [
        { label: `${currentMonthLabel} 매출 실적`, value: new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(currentMonthRevenue), icon: DollarSign, isRightAligned: true },
        { label: `${currentMonthLabel} 매출 목표`, value: new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(currentMonthTarget), icon: Briefcase, isRightAligned: true },
        { label: '추가 예상 매출액', value: new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(expectedRevenue), icon: Activity, isRightAligned: true },
        { label: '접촉 횟수', value: `${contactCount}건`, icon: Users, isRightAligned: true },
    ];

    useEffect(() => {
        const today = new Date();
        const month = today.getMonth() + 1;
        setCurrentMonthLabel(`${month}월`);

        const year = today.getFullYear();
        const monthKey = `${year}-${String(month).padStart(2, '0')}`;
        setCurrentMonthTarget(targets[monthKey] || 0);

        fetchChartData();
        fetchExpectedRevenue();
    }, []);


    const fetchExpectedRevenue = async () => {
        try {
            // Fetch total expected revenue
            const { data: totalData, error: totalError } = await supabase
                .from('opportunities')
                .select('value');

            if (totalError) throw totalError;

            const total = totalData?.reduce((sum, item) => sum + (item.value || 0), 0) || 0;
            setExpectedRevenue(total);

            // Fetch recent opportunities
            const { data: recentData, error: recentError } = await supabase
                .from('opportunities')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (recentError) throw recentError;
            setRecentOpportunities(recentData || []);

            // Fetch contact count (Current Month)
            const today = new Date();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString();

            const { count, error: countError } = await supabase
                .from('opportunities')
                .select('*', { count: 'exact', head: true })
                .gte('created_at', startOfMonth)
                .lt('created_at', endOfMonth);

            if (countError) throw countError;
            setContactCount(count || 0);

        } catch (err) {
            console.error('Error fetching opportunities data:', err);
        }
    };

    const fetchChartData = async () => {
        try {
            let query = supabase
                .from('sales_performance')
                .select('shipment_date, sales_amount, sales_rep, company_name, distributor_name')
                .gte('shipment_date', '2025-01-01')
                .in('sales_rep', ['탁현호', '임성렬']);


            const { data, error } = await query;

            if (error) throw error;

            // Group actual sales by month
            const monthlyData: { [key: string]: number } = {};
            let currentMonthSum = 0;

            const today = new Date();
            const currentMonthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;

            data?.forEach(item => {
                const date = new Date(item.shipment_date);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

                if (!monthlyData[monthKey]) {
                    monthlyData[monthKey] = 0;
                }
                monthlyData[monthKey] += item.sales_amount;

                // Calculate Current Month revenue
                if (monthKey === currentMonthKey) {
                    currentMonthSum += item.sales_amount;
                }
            });

            setCurrentMonthRevenue(currentMonthSum);

            // Merge Targets and Actuals
            const allMonths = Object.keys(targets).sort();
            const formattedData = allMonths.map(key => ({
                name: key,
                revenue: monthlyData[key] || 0,
                target: targets[key]
            }));

            setChartData(formattedData);
        } catch (err) {
            console.error('Error fetching chart data:', err);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-2">Overview of your sales performance and key metrics.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <StatCard key={i} {...stat} />
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                        <h2 className="text-lg font-bold text-gray-900">매출 실적 및 목표</h2>
                        <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                                <span className="text-gray-500">총 매출 목표</span>
                                <span className="font-bold text-gray-900">
                                    {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(chartData.reduce((sum, item) => sum + (item.target || 0), 0))}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-gray-900"></span>
                                <span className="text-gray-500">총 매출 실적</span>
                                <span className="font-bold text-gray-900">
                                    {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(chartData.reduce((sum, item) => sum + (item.revenue || 0), 0))}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">달성률</span>
                                <span className={cn(
                                    "font-bold",
                                    (chartData.reduce((sum, item) => sum + (item.revenue || 0), 0) / chartData.reduce((sum, item) => sum + (item.target || 0), 0) * 100) >= 100 ? "text-green-600" : "text-blue-600"
                                )}>
                                    {(() => {
                                        const totalTarget = chartData.reduce((sum, item) => sum + (item.target || 0), 0);
                                        const totalRevenue = chartData.reduce((sum, item) => sum + (item.revenue || 0), 0);
                                        return totalTarget > 0 ? (totalRevenue / totalTarget * 100).toFixed(1) : '0.0';
                                    })()}%
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b' }}
                                    tickFormatter={(value) => {
                                        const [, month] = value.split('-');
                                        return `${month}월`;
                                    }}
                                />
                                <YAxis
                                    yAxisId="left"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b' }}
                                    tickFormatter={(value) => new Intl.NumberFormat('ko-KR', { notation: "compact" }).format(value)}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748b' }}
                                    tickFormatter={(value) => new Intl.NumberFormat('ko-KR', { notation: "compact" }).format(value)}
                                    hide
                                />
                                <Tooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: number) => new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value)}
                                    labelFormatter={(label) => {
                                        const [year, month] = label.split('-');
                                        return `${year}년 ${month}월`;
                                    }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                                <Area yAxisId="left" type="monotone" dataKey="revenue" name="매출 실적" stroke="#0f172a" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" />
                                <Line yAxisId="left" type="monotone" dataKey="target" name="매출 목표" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">영업 기회</h2>
                    <div className="space-y-4">
                        {recentOpportunities.map((deal: any) => (
                            <div key={deal.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                                <div>
                                    <p className="font-medium text-gray-900 line-clamp-1">{deal.title}</p>
                                    <p className="text-sm text-gray-500">{deal.company}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-gray-900">
                                        {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(deal.value)}
                                    </p>
                                    <p className="text-sm text-green-600">{deal.stage}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={() => navigate('/opportunities')}
                        className="w-full mt-6 py-2.5 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    >
                        영업 기회로 이동
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
