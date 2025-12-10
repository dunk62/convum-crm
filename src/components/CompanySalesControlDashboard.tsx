import { useState, useEffect, useCallback, useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { supabase } from '../lib/supabase';
import {
    TrendingUp,
    Loader2,
    Filter,
    AlertTriangle,
    Star,
    Mail,
    Phone,
    Building2,
    Package,
    ChevronRight,
    Search
} from 'lucide-react';

interface SalesRecord {
    company_name: string;
    shipment_date: string;
    sales_amount: number;
    sales_rep: string;
    product_name: string;
    model_number: string;
    quantity: number;
}

interface CompanyStats {
    company_name: string;
    sales_2025: number;
    sales_2024: number;
    yoy_growth: number;
    last_order_date: string;
    days_since_order: number;
    is_churn_risk: boolean;
    is_rising: boolean;
}

interface ContactInfo {
    name: string;
    phone: string;
    email: string;
    position: string;
}

// 부서별 담당자 그룹
const deptGroups: { [key: string]: string[] } = {
    '전체': [],
    '북부': ['김광중'],
    '남부': ['탁현호', '임성렬'],
    'CS': ['윤회승', '이다경'],
    '수출': ['윤회승(수출)', '이다경(수출)']
};

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899', '#14b8a6'];

export default function CompanySalesControlDashboard() {
    const [salesData, setSalesData] = useState<SalesRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDept, setSelectedDept] = useState<string>('전체');
    const [selectedRep, setSelectedRep] = useState<string>('전체');
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
    const [showRiskOnly, setShowRiskOnly] = useState(false);
    const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
    const [sortBy, setSortBy] = useState<'sales' | 'yoy' | 'days'>('sales');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Fetch sales data
    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const pageSize = 1000;
            let allData: SalesRecord[] = [];
            let page = 0;
            let hasMore = true;

            while (hasMore) {
                const { data, error } = await supabase
                    .from('sales_performance')
                    .select('company_name, shipment_date, sales_amount, sales_rep, product_name, model_number, quantity')
                    .gte('shipment_date', '2024-01-01')
                    .range(page * pageSize, (page + 1) * pageSize - 1);

                if (error) throw error;
                if (data && data.length > 0) {
                    allData = [...allData, ...data];
                    hasMore = data.length === pageSize;
                    page++;
                } else {
                    hasMore = false;
                }
            }

            setSalesData(allData);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();

        // Real-time subscription
        const subscription = supabase
            .channel('company_sales_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'sales_performance' }, () => {
                console.log('Sales data changed, refreshing...');
                fetchData();
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, [fetchData]);

    // Get available reps based on selected department
    const availableReps = useMemo(() => {
        if (selectedDept === '전체') {
            return Object.values(deptGroups).flat();
        }
        return deptGroups[selectedDept] || [];
    }, [selectedDept]);

    // Filter data by rep
    const filteredData = useMemo(() => {
        if (selectedRep !== '전체') {
            return salesData.filter(d => d.sales_rep === selectedRep);
        }
        if (selectedDept !== '전체') {
            const reps = deptGroups[selectedDept] || [];
            return salesData.filter(d => reps.includes(d.sales_rep));
        }
        return salesData;
    }, [salesData, selectedDept, selectedRep]);

    // Calculate company statistics
    const companyStats = useMemo((): CompanyStats[] => {
        const today = new Date();
        const companyMap = new Map<string, { sales_2025: number; sales_2024: number; last_order_date: string }>();

        filteredData.forEach(record => {
            const year = new Date(record.shipment_date).getFullYear();
            const existing = companyMap.get(record.company_name) || { sales_2025: 0, sales_2024: 0, last_order_date: '' };

            if (year === 2025) {
                existing.sales_2025 += record.sales_amount || 0;
            } else if (year === 2024) {
                existing.sales_2024 += record.sales_amount || 0;
            }

            if (!existing.last_order_date || record.shipment_date > existing.last_order_date) {
                existing.last_order_date = record.shipment_date;
            }

            companyMap.set(record.company_name, existing);
        });

        const stats: CompanyStats[] = [];
        companyMap.forEach((data, company_name) => {
            const yoy_growth = data.sales_2024 > 0
                ? ((data.sales_2025 - data.sales_2024) / data.sales_2024) * 100
                : 0;

            const lastOrderDate = new Date(data.last_order_date);
            const days_since_order = Math.floor((today.getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24));

            const is_churn_risk = yoy_growth <= -30 || days_since_order >= 90;
            const is_rising = yoy_growth >= 20;

            stats.push({
                company_name,
                sales_2025: data.sales_2025,
                sales_2024: data.sales_2024,
                yoy_growth,
                last_order_date: data.last_order_date,
                days_since_order,
                is_churn_risk,
                is_rising
            });
        });

        // Filter risk if needed
        let result = showRiskOnly ? stats.filter(s => s.is_churn_risk) : stats;

        // Sort based on sortBy and sortOrder
        result = result.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'sales':
                    comparison = b.sales_2025 - a.sales_2025;
                    break;
                case 'yoy':
                    comparison = b.yoy_growth - a.yoy_growth;
                    break;
                case 'days':
                    comparison = a.days_since_order - b.days_since_order;
                    break;
            }
            return sortOrder === 'asc' ? -comparison : comparison;
        });

        return result;
    }, [filteredData, showRiskOnly, sortBy, sortOrder]);

    // Selected company data for right panel
    const selectedCompanyData = useMemo(() => {
        if (!selectedCompany) return null;

        const companyRecords = filteredData.filter(d => d.company_name === selectedCompany);

        // Monthly sales comparison
        const monthlyData: { month: string; sales_2025: number; sales_2024: number }[] = [];
        for (let m = 1; m <= 12; m++) {
            const monthStr = m.toString().padStart(2, '0');
            const sales_2025 = companyRecords
                .filter(r => r.shipment_date.startsWith(`2025-${monthStr}`))
                .reduce((sum, r) => sum + (r.sales_amount || 0), 0);
            const sales_2024 = companyRecords
                .filter(r => r.shipment_date.startsWith(`2024-${monthStr}`))
                .reduce((sum, r) => sum + (r.sales_amount || 0), 0);

            monthlyData.push({
                month: `${m}월`,
                sales_2025,
                sales_2024
            });
        }

        // Category distribution (product_name)
        const categoryMap = new Map<string, number>();
        companyRecords
            .filter(r => r.shipment_date.startsWith('2025'))
            .forEach(r => {
                const category = r.product_name || '기타';
                categoryMap.set(category, (categoryMap.get(category) || 0) + (r.sales_amount || 0));
            });

        const categoryData = Array.from(categoryMap.entries())
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 8);

        // Top 5 products
        const productMap = new Map<string, { qty: number; sales: number }>();
        companyRecords
            .filter(r => r.shipment_date.startsWith('2025'))
            .forEach(r => {
                const existing = productMap.get(r.model_number) || { qty: 0, sales: 0 };
                existing.qty += r.quantity || 0;
                existing.sales += r.sales_amount || 0;
                productMap.set(r.model_number, existing);
            });

        const topProducts = Array.from(productMap.entries())
            .map(([model, data]) => ({ model, ...data }))
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 5);

        const stats = companyStats.find(s => s.company_name === selectedCompany);

        return {
            monthlyData,
            categoryData,
            topProducts,
            stats
        };
    }, [selectedCompany, filteredData, companyStats]);

    // Fetch contact info when company is selected
    useEffect(() => {
        if (!selectedCompany) {
            setContactInfo(null);
            return;
        }

        const fetchContact = async () => {
            // Try to find contact from contacts table
            const { data } = await supabase
                .from('contacts')
                .select('name, phone, email, position')
                .ilike('company', `%${selectedCompany}%`)
                .limit(1);

            if (data && data.length > 0) {
                setContactInfo(data[0]);
            } else {
                setContactInfo(null);
            }
        };

        fetchContact();
    }, [selectedCompany]);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(amount);

    const formatCompactCurrency = (amount: number) => {
        if (amount >= 1000000000) return `${(amount / 1000000000).toFixed(1)}B`;
        if (amount >= 1000000) return `${(amount / 1000000).toFixed(0)}M`;
        if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
        return amount.toString();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader2 className="animate-spin text-accent" size={48} />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header & Filters */}
            <div className="bg-card border border-border rounded-xl p-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <Building2 className="text-accent" size={24} />
                        <h2 className="text-xl font-bold text-white">업체별 매출 관제 대시보드</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <Filter size={16} className="text-muted-foreground" />
                            <select
                                value={selectedDept}
                                onChange={(e) => {
                                    setSelectedDept(e.target.value);
                                    setSelectedRep('전체');
                                }}
                                className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-white"
                            >
                                {Object.keys(deptGroups).map(dept => (
                                    <option key={dept} value={dept}>{dept === '전체' ? '전체 부서' : dept}</option>
                                ))}
                            </select>
                            <select
                                value={selectedRep}
                                onChange={(e) => setSelectedRep(e.target.value)}
                                className="bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-white"
                            >
                                <option value="전체">전체 담당자</option>
                                {availableReps.map(rep => (
                                    <option key={rep} value={rep}>{rep}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Split Layout */}
            <div className="flex gap-4" style={{ height: 'calc(100vh - 280px)', minHeight: '600px' }}>
                {/* Left Panel - Company List */}
                <div className="w-[30%] bg-card border border-border rounded-xl overflow-hidden flex flex-col">
                    <div className="p-3 border-b border-border flex items-center justify-between">
                        <h3 className="font-bold text-white text-sm">업체 리스트</h3>
                        <button
                            onClick={() => setShowRiskOnly(!showRiskOnly)}
                            className={`text-xs px-2 py-1 rounded-lg transition-colors ${showRiskOnly
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-secondary text-muted-foreground hover:text-white'
                                }`}
                        >
                            🔴 위험 업체 모아보기
                        </button>
                    </div>

                    {/* Legend */}
                    <div className="px-3 py-2 border-b border-border bg-secondary/30 flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span> 위험
                        </span>
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> 상승
                        </span>
                    </div>

                    {/* Sort Controls */}
                    <div className="px-3 py-2 border-b border-border bg-secondary/20 flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">정렬:</span>
                        <button
                            onClick={() => { setSortBy('sales'); setSortOrder(sortBy === 'sales' && sortOrder === 'desc' ? 'asc' : 'desc'); }}
                            className={`px-2 py-1 rounded ${sortBy === 'sales' ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:text-white'}`}
                        >
                            매출 {sortBy === 'sales' && (sortOrder === 'desc' ? '↓' : '↑')}
                        </button>
                        <button
                            onClick={() => { setSortBy('yoy'); setSortOrder(sortBy === 'yoy' && sortOrder === 'desc' ? 'asc' : 'desc'); }}
                            className={`px-2 py-1 rounded ${sortBy === 'yoy' ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:text-white'}`}
                        >
                            YoY {sortBy === 'yoy' && (sortOrder === 'desc' ? '↓' : '↑')}
                        </button>
                        <button
                            onClick={() => { setSortBy('days'); setSortOrder(sortBy === 'days' && sortOrder === 'asc' ? 'desc' : 'asc'); }}
                            className={`px-2 py-1 rounded ${sortBy === 'days' ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:text-white'}`}
                        >
                            주문일 {sortBy === 'days' && (sortOrder === 'asc' ? '↑' : '↓')}
                        </button>
                    </div>

                    {/* Search */}
                    <div className="px-3 py-2 border-b border-border">
                        <div className="relative">
                            <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="업체명 검색..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-secondary border border-border rounded-lg pl-7 pr-3 py-1.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-accent"
                            />
                        </div>
                    </div>

                    {/* Company List */}
                    <div className="flex-1 overflow-y-auto">
                        {companyStats
                            .filter(c => searchQuery === '' || c.company_name.toLowerCase().includes(searchQuery.toLowerCase()))
                            .slice(0, 100).map((company, index) => (
                                <div
                                    key={company.company_name}
                                    onClick={() => setSelectedCompany(company.company_name)}
                                    className={`px-3 py-2 border-b border-border cursor-pointer transition-all ${selectedCompany === company.company_name
                                        ? 'bg-accent/20 border-l-2 border-l-accent'
                                        : 'hover:bg-secondary/50'
                                        } ${company.is_churn_risk ? 'bg-red-500/5' : ''}`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <span className="text-muted-foreground text-xs w-6">{index + 1}</span>
                                            {company.is_churn_risk && <AlertTriangle size={12} className="text-red-400 flex-shrink-0" />}
                                            {company.is_rising && <Star size={12} className="text-emerald-400 fill-emerald-400 flex-shrink-0" />}
                                            <span className="text-white text-sm truncate">{company.company_name}</span>
                                        </div>
                                        <ChevronRight size={14} className="text-muted-foreground flex-shrink-0" />
                                    </div>
                                    <div className="flex items-center justify-between mt-1 pl-6">
                                        <span className="text-xs text-muted-foreground">
                                            {formatCompactCurrency(company.sales_2025)}
                                        </span>
                                        <span className={`text-xs font-medium ${company.yoy_growth >= 0 ? 'text-emerald-400' : 'text-red-400'
                                            }`}>
                                            {company.yoy_growth >= 0 ? '+' : ''}{company.yoy_growth.toFixed(1)}%
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {company.days_since_order}일 전
                                        </span>
                                    </div>
                                </div>
                            ))}
                    </div>

                    <div className="px-3 py-2 border-t border-border bg-secondary/30">
                        <span className="text-xs text-muted-foreground">
                            총 {companyStats.length}개 업체 중 {Math.min(100, companyStats.length)}개 표시
                        </span>
                    </div>
                </div>

                {/* Right Panel - Detail */}
                <div className="w-[70%] bg-card border border-border rounded-xl overflow-hidden flex flex-col">
                    {selectedCompany && selectedCompanyData ? (
                        <>
                            {/* Header */}
                            <div className="p-4 border-b border-border bg-gradient-to-r from-accent/10 to-transparent">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            {selectedCompanyData.stats?.is_churn_risk && (
                                                <AlertTriangle size={18} className="text-red-400" />
                                            )}
                                            {selectedCompanyData.stats?.is_rising && (
                                                <Star size={18} className="text-emerald-400 fill-emerald-400" />
                                            )}
                                            {selectedCompany}
                                        </h3>
                                        {contactInfo && (
                                            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Phone size={14} /> {contactInfo.phone}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Mail size={14} /> {contactInfo.email}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {/* Sales Trend Chart */}
                                <div className="bg-secondary/30 rounded-xl p-4">
                                    <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                                        <TrendingUp size={16} className="text-accent" />
                                        매출 추이 비교 (금년 vs 작년)
                                    </h4>
                                    <div className="h-[280px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={selectedCompanyData.monthlyData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                                <XAxis dataKey="month" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                                                <YAxis
                                                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                                                    tickFormatter={(v) => formatCompactCurrency(v)}
                                                />
                                                <Tooltip
                                                    formatter={(value: number) => [formatCurrency(value), '']}
                                                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                                                    labelStyle={{ color: '#fff' }}
                                                    itemStyle={{ color: '#fff' }}
                                                />
                                                <Legend />
                                                <Line
                                                    type="monotone"
                                                    dataKey="sales_2025"
                                                    name="2025년"
                                                    stroke="#8b5cf6"
                                                    strokeWidth={2}
                                                    dot={{ fill: '#8b5cf6', r: 3 }}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="sales_2024"
                                                    name="2024년"
                                                    stroke="#6b7280"
                                                    strokeWidth={2}
                                                    strokeDasharray="5 5"
                                                    dot={{ fill: '#6b7280', r: 3 }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                {/* Bottom Row */}
                                <div className="grid grid-cols-2 gap-4">
                                    {/* Category Donut Chart */}
                                    <div className="bg-secondary/30 rounded-xl p-4">
                                        <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                                            <Package size={16} className="text-accent" />
                                            구매 품목 점유율
                                        </h4>
                                        <div className="flex items-center gap-4">
                                            <div className="h-[160px] w-[160px] flex-shrink-0">
                                                <ResponsiveContainer width="100%" height="100%">
                                                    <PieChart>
                                                        <Pie
                                                            data={selectedCompanyData.categoryData}
                                                            cx="50%"
                                                            cy="50%"
                                                            innerRadius={35}
                                                            outerRadius={65}
                                                            dataKey="value"
                                                        >
                                                            {selectedCompanyData.categoryData.map((_, index) => (
                                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                            ))}
                                                        </Pie>
                                                        <Tooltip
                                                            formatter={(value: number) => [formatCurrency(value), '매출']}
                                                            contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                                                        />
                                                    </PieChart>
                                                </ResponsiveContainer>
                                            </div>
                                            <div className="flex-1 space-y-1 text-xs overflow-y-auto max-h-[160px]">
                                                {selectedCompanyData.categoryData.map((item, index) => {
                                                    const total = selectedCompanyData.categoryData.reduce((s, i) => s + i.value, 0);
                                                    const percent = total > 0 ? ((item.value / total) * 100).toFixed(0) : 0;
                                                    return (
                                                        <div key={item.name} className="flex items-center gap-2">
                                                            <span
                                                                className="w-3 h-3 rounded-sm flex-shrink-0"
                                                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                            />
                                                            <span className="text-muted-foreground truncate flex-1">{item.name}</span>
                                                            <span className="text-white font-medium">{percent}%</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Top Products Table */}
                                    <div className="bg-secondary/30 rounded-xl p-4">
                                        <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                                            <Star size={16} className="text-amber-400" />
                                            매출 Top 5
                                        </h4>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="text-muted-foreground text-xs">
                                                        <th className="text-left py-1">형번</th>
                                                        <th className="text-right py-1">수량</th>
                                                        <th className="text-right py-1">매출</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedCompanyData.topProducts.map((product, i) => (
                                                        <tr key={product.model} className="border-t border-border/50">
                                                            <td className="py-2 text-white font-medium truncate max-w-[120px]">
                                                                {i + 1}. {product.model}
                                                            </td>
                                                            <td className="py-2 text-right text-muted-foreground">
                                                                {product.qty.toLocaleString()}
                                                            </td>
                                                            <td className="py-2 text-right text-accent font-medium">
                                                                {formatCompactCurrency(product.sales)}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                    {selectedCompanyData.topProducts.length === 0 && (
                                                        <tr>
                                                            <td colSpan={3} className="py-4 text-center text-muted-foreground">
                                                                2025년 주문 데이터 없음
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                            <div className="text-center">
                                <Building2 size={48} className="mx-auto mb-4 opacity-30" />
                                <p>좌측 리스트에서 업체를 선택하세요</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
