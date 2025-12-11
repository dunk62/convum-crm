import { useState, useEffect, useCallback, useMemo } from 'react';
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
import {
    TrendingUp,
    TrendingDown,
    Loader2,
    Filter,
    AlertTriangle,
    Mail,
    Store,
    ChevronRight,
    Search,
    Clock,
    Package,
    Minus,
    Building2,
    BarChart3
} from 'lucide-react';

interface SalesRecord {
    distributor_name: string;
    company_name: string;
    shipment_date: string;
    sales_amount: number;
    sales_rep: string;
    product_name: string;
    model_number: string;
    quantity: number;
}

interface PartnerStats {
    distributor_name: string;
    sales_2025: number;
    sales_2024: number;
    yoy_growth: number;
    last_order_date: string;
    days_since_order: number;
    avg_order_cycle: number;
    is_order_delayed: boolean;
    growth_signal: 'up' | 'stable' | 'down';
    tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
    total_12_months: number;
}

interface CompanyStats {
    company_name: string;
    sales_2025: number;
    sales_2024: number;
    yoy_growth: number;
    is_new: boolean;
    is_risk: boolean;
}

// 부서별 담당자 그룹
const deptGroups: { [key: string]: string[] } = {
    '전체': [],
    '북부': ['김광중'],
    '남부': ['탁현호', '임성렬'],
    'CS': ['윤회승', '이다경'],
    '수출': ['윤회승(수출)', '이다경(수출)']
};

// 상품군 목록
const PRODUCT_CATEGORIES = ['PAD', 'PAD金具', 'Ejector(CONVUM)', 'SENSOR', '補器', 'FA機器その他'];

// 등급 색상
const TIER_COLORS: { [key: string]: string } = {
    'Platinum': 'bg-purple-500',
    'Gold': 'bg-yellow-500',
    'Silver': 'bg-gray-400',
    'Bronze': 'bg-amber-700'
};

export default function PartnerGrowthDashboard() {
    const [salesData, setSalesData] = useState<SalesRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDept, setSelectedDept] = useState<string>('전체');
    const [selectedRep, setSelectedRep] = useState<string>('전체');
    const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
    const [sortBy, setSortBy] = useState<'sales' | 'growth' | 'risk'>('sales');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Company analysis tab states
    const [activeDetailTab, setActiveDetailTab] = useState<'summary' | 'companies'>('summary');
    const [companyStats, setCompanyStats] = useState<CompanyStats[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

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
                    .select('distributor_name, company_name, shipment_date, sales_amount, sales_rep, product_name, model_number, quantity')
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

    // Calculate partner statistics
    const partnerStats = useMemo((): PartnerStats[] => {
        const today = new Date();
        const partnerMap = new Map<string, {
            sales_2025: number;
            sales_2024: number;
            order_dates: string[];
            categories: Set<string>;
        }>();

        filteredData.forEach(record => {
            if (!record.distributor_name) return;

            const year = new Date(record.shipment_date).getFullYear();
            const existing = partnerMap.get(record.distributor_name) || {
                sales_2025: 0,
                sales_2024: 0,
                order_dates: [],
                categories: new Set<string>()
            };

            if (year === 2025) {
                existing.sales_2025 += record.sales_amount || 0;
            } else if (year === 2024) {
                existing.sales_2024 += record.sales_amount || 0;
            }

            existing.order_dates.push(record.shipment_date);
            if (record.product_name) {
                existing.categories.add(record.product_name);
            }

            partnerMap.set(record.distributor_name, existing);
        });

        const stats: PartnerStats[] = [];
        partnerMap.forEach((data, distributor_name) => {
            // YoY growth rate
            const yoy_growth = data.sales_2024 > 0
                ? ((data.sales_2025 - data.sales_2024) / data.sales_2024) * 100
                : (data.sales_2025 > 0 ? 100 : 0);

            // Last order date and days since
            const sortedDates = data.order_dates.sort().reverse();
            const last_order_date = sortedDates[0] || '';
            const lastOrderDate = last_order_date ? new Date(last_order_date) : today;
            const days_since_order = Math.floor((today.getTime() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24));

            // Calculate average order cycle
            let avg_order_cycle = 30; // default
            if (sortedDates.length >= 2) {
                const cycles: number[] = [];
                for (let i = 0; i < sortedDates.length - 1 && i < 10; i++) {
                    const d1 = new Date(sortedDates[i]);
                    const d2 = new Date(sortedDates[i + 1]);
                    const diff = Math.floor((d1.getTime() - d2.getTime()) / (1000 * 60 * 60 * 24));
                    if (diff > 0) cycles.push(diff);
                }
                if (cycles.length > 0) {
                    avg_order_cycle = Math.round(cycles.reduce((a, b) => a + b, 0) / cycles.length);
                }
            }

            // Order delay detection
            const is_order_delayed = days_since_order > avg_order_cycle * 2;

            // Growth signal
            let growth_signal: 'up' | 'stable' | 'down' = 'stable';
            if (yoy_growth >= 5) growth_signal = 'up';
            else if (yoy_growth <= -5) growth_signal = 'down';

            // Tier based on 12-month total
            const total_12_months = data.sales_2025 + data.sales_2024 * 0.5; // weighted
            let tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze' = 'Bronze';
            if (total_12_months >= 100000000) tier = 'Platinum';
            else if (total_12_months >= 50000000) tier = 'Gold';
            else if (total_12_months >= 10000000) tier = 'Silver';

            stats.push({
                distributor_name,
                sales_2025: data.sales_2025,
                sales_2024: data.sales_2024,
                yoy_growth,
                last_order_date,
                days_since_order,
                avg_order_cycle,
                is_order_delayed,
                growth_signal,
                tier,
                total_12_months
            });
        });

        // Filter by search
        let result = stats.filter(s =>
            searchQuery === '' || s.distributor_name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Sort
        result = result.sort((a, b) => {
            let comparison = 0;
            switch (sortBy) {
                case 'sales':
                    comparison = b.sales_2025 - a.sales_2025;
                    break;
                case 'growth':
                    comparison = b.yoy_growth - a.yoy_growth;
                    break;
                case 'risk':
                    // Prioritize delayed orders and negative growth
                    const aRisk = (a.is_order_delayed ? 100 : 0) + (a.yoy_growth < 0 ? Math.abs(a.yoy_growth) : 0);
                    const bRisk = (b.is_order_delayed ? 100 : 0) + (b.yoy_growth < 0 ? Math.abs(b.yoy_growth) : 0);
                    comparison = bRisk - aRisk;
                    break;
            }
            return sortOrder === 'asc' ? -comparison : comparison;
        });

        return result;
    }, [filteredData, searchQuery, sortBy, sortOrder]);

    // Selected partner data for right panel
    const selectedPartnerData = useMemo(() => {
        if (!selectedPartner) return null;

        const partnerRecords = filteredData.filter(d => d.distributor_name === selectedPartner);

        // Monthly sales comparison
        const monthlyData: { month: string; sales_2025: number; sales_2024: number }[] = [];
        for (let m = 1; m <= 12; m++) {
            const monthStr = m.toString().padStart(2, '0');
            const sales_2025 = partnerRecords
                .filter(r => r.shipment_date.startsWith(`2025-${monthStr}`))
                .reduce((sum, r) => sum + (r.sales_amount || 0), 0);
            const sales_2024 = partnerRecords
                .filter(r => r.shipment_date.startsWith(`2024-${monthStr}`))
                .reduce((sum, r) => sum + (r.sales_amount || 0), 0);

            monthlyData.push({
                month: `${m}월`,
                sales_2025,
                sales_2024
            });
        }

        // White space analysis - which categories are NOT being purchased
        const purchasedCategories = new Set<string>();
        partnerRecords
            .filter(r => r.shipment_date.startsWith('2025'))
            .forEach(r => {
                if (r.product_name) purchasedCategories.add(r.product_name);
            });

        const whiteSpaceData = PRODUCT_CATEGORIES.map(cat => ({
            category: cat,
            purchased: purchasedCategories.has(cat),
            sales: partnerRecords
                .filter(r => r.shipment_date.startsWith('2025') && r.product_name === cat)
                .reduce((sum, r) => sum + (r.sales_amount || 0), 0)
        }));

        // Order timeline - last 6 months with monthly grouping
        const today = new Date();
        const monthLabels: string[] = [];
        const monthlyOrderCounts: { month: string; count: number; dates: string[] }[] = [];

        for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const monthKey = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}`;
            const monthLabel = `${d.getMonth() + 1}월`;
            monthLabels.push(monthLabel);

            const ordersInMonth = partnerRecords
                .filter(r => r.shipment_date.startsWith(monthKey))
                .map(r => r.shipment_date)
                .filter((v, i, a) => a.indexOf(v) === i); // unique dates

            monthlyOrderCounts.push({
                month: monthLabel,
                count: ordersInMonth.length,
                dates: ordersInMonth.sort()
            });
        }

        // Calculate average gap between orders
        const allOrderDates = partnerRecords
            .map(r => r.shipment_date)
            .filter((v, i, a) => a.indexOf(v) === i)
            .sort()
            .reverse();

        let avgGap = 0;
        if (allOrderDates.length >= 2) {
            const lastOrder = new Date(allOrderDates[0]);
            const secondLastOrder = new Date(allOrderDates[1]);
            avgGap = Math.floor((lastOrder.getTime() - secondLastOrder.getTime()) / (1000 * 60 * 60 * 24));
        }

        const timelineData = {
            monthlyOrderCounts,
            lastOrderDate: allOrderDates[0] || null,
            avgGap,
            totalOrders: allOrderDates.length
        };

        const stats = partnerStats.find(s => s.distributor_name === selectedPartner);

        return {
            monthlyData,
            whiteSpaceData,
            timelineData,
            stats
        };
    }, [selectedPartner, filteredData, partnerStats]);

    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(amount);

    const formatCompactCurrency = (amount: number) => {
        if (amount >= 1000000000) return `${(amount / 1000000000).toFixed(1)}B`;
        if (amount >= 1000000) return `${(amount / 1000000).toFixed(0)}M`;
        if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
        return amount.toString();
    };

    const getGrowthIcon = (signal: 'up' | 'stable' | 'down') => {
        switch (signal) {
            case 'up': return <TrendingUp size={14} className="text-emerald-400" />;
            case 'down': return <TrendingDown size={14} className="text-red-400" />;
            default: return <Minus size={14} className="text-yellow-400" />;
        }
    };

    const getGrowthColor = (signal: 'up' | 'stable' | 'down') => {
        switch (signal) {
            case 'up': return 'text-emerald-400';
            case 'down': return 'text-red-400';
            default: return 'text-yellow-400';
        }
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
                        <Store className="text-accent" size={24} />
                        <h2 className="text-xl font-bold text-white">판매점 성장 분석 및 이탈 관제</h2>
                    </div>
                    <div className="flex items-center gap-3">
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

            {/* Split Layout */}
            <div className="flex gap-4" style={{ height: 'calc(100vh - 280px)', minHeight: '650px' }}>
                {/* Left Panel - Partner List */}
                <div className="w-[35%] bg-card border border-border rounded-xl overflow-hidden flex flex-col">
                    <div className="p-3 border-b border-border">
                        <h3 className="font-bold text-white text-sm mb-2">파트너 랭킹</h3>
                        {/* Sort Controls */}
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground">정렬:</span>
                            <button
                                onClick={() => { setSortBy('sales'); setSortOrder(sortBy === 'sales' && sortOrder === 'desc' ? 'asc' : 'desc'); }}
                                className={`px-2 py-1 rounded ${sortBy === 'sales' ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:text-white'}`}
                            >
                                매출 {sortBy === 'sales' && (sortOrder === 'desc' ? '↓' : '↑')}
                            </button>
                            <button
                                onClick={() => { setSortBy('growth'); setSortOrder(sortBy === 'growth' && sortOrder === 'desc' ? 'asc' : 'desc'); }}
                                className={`px-2 py-1 rounded ${sortBy === 'growth' ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:text-white'}`}
                            >
                                성장률 {sortBy === 'growth' && (sortOrder === 'desc' ? '↓' : '↑')}
                            </button>
                            <button
                                onClick={() => { setSortBy('risk'); setSortOrder('desc'); }}
                                className={`px-2 py-1 rounded ${sortBy === 'risk' ? 'bg-accent/20 text-accent' : 'text-muted-foreground hover:text-white'}`}
                            >
                                위험도
                            </button>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="px-3 py-2 border-b border-border bg-secondary/30 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">🟢 성장</span>
                        <span className="flex items-center gap-1">🟡 유지</span>
                        <span className="flex items-center gap-1">🔴 역성장</span>
                        <span className="flex items-center gap-1">⚠️ 지연</span>
                    </div>

                    {/* Search */}
                    <div className="px-3 py-2 border-b border-border">
                        <div className="relative">
                            <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="판매점 검색..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-secondary border border-border rounded-lg pl-7 pr-3 py-1.5 text-sm text-white placeholder:text-muted-foreground focus:outline-none focus:border-accent"
                            />
                        </div>
                    </div>

                    {/* Partner List */}
                    <div className="flex-1 overflow-y-auto">
                        {partnerStats.slice(0, 100).map((partner, index) => (
                            <div
                                key={partner.distributor_name}
                                onClick={() => setSelectedPartner(partner.distributor_name)}
                                className={`px-3 py-2 border-b border-border cursor-pointer transition-all ${selectedPartner === partner.distributor_name
                                    ? 'bg-accent/20 border-l-2 border-l-accent'
                                    : 'hover:bg-secondary/50'
                                    } ${partner.growth_signal === 'down' || partner.is_order_delayed ? 'bg-red-500/5' : ''}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                        <span className="text-muted-foreground text-xs w-5">{index + 1}</span>
                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold text-white ${TIER_COLORS[partner.tier]}`}>
                                            {partner.tier.charAt(0)}
                                        </span>
                                        {getGrowthIcon(partner.growth_signal)}
                                        {partner.is_order_delayed && <AlertTriangle size={12} className="text-amber-400" />}
                                        <span className="text-white text-sm truncate">{partner.distributor_name}</span>
                                    </div>
                                    <ChevronRight size={14} className="text-muted-foreground flex-shrink-0" />
                                </div>
                                <div className="flex items-center justify-between mt-1 pl-5">
                                    <span className="text-xs text-muted-foreground">
                                        {formatCompactCurrency(partner.sales_2025)}
                                    </span>
                                    <span className={`text-xs font-medium ${getGrowthColor(partner.growth_signal)}`}>
                                        {partner.yoy_growth >= 0 ? '+' : ''}{partner.yoy_growth.toFixed(1)}%
                                    </span>
                                    <span className={`text-xs ${partner.is_order_delayed ? 'text-amber-400' : 'text-muted-foreground'}`}>
                                        D-{partner.days_since_order}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="px-3 py-2 border-t border-border bg-secondary/30">
                        <span className="text-xs text-muted-foreground">
                            총 {partnerStats.length}개 판매점
                        </span>
                    </div>
                </div>

                {/* Right Panel - Detail */}
                <div className="w-[65%] bg-card border border-border rounded-xl overflow-hidden flex flex-col">
                    {selectedPartner && selectedPartnerData ? (
                        <>
                            {/* Header */}
                            <div className="p-4 border-b border-border bg-gradient-to-r from-accent/10 to-transparent">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                            <span className={`text-xs px-2 py-0.5 rounded font-bold text-white ${TIER_COLORS[selectedPartnerData.stats?.tier || 'Bronze']}`}>
                                                {selectedPartnerData.stats?.tier}
                                            </span>
                                            {getGrowthIcon(selectedPartnerData.stats?.growth_signal || 'stable')}
                                            {selectedPartnerData.stats?.is_order_delayed && (
                                                <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded flex items-center gap-1">
                                                    <AlertTriangle size={12} /> 주문 지연
                                                </span>
                                            )}
                                            {selectedPartner}
                                        </h3>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                            <span>평균 주문주기: {selectedPartnerData.stats?.avg_order_cycle || 0}일</span>
                                            <span>마지막 주문: {selectedPartnerData.stats?.days_since_order || 0}일 전</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => window.location.href = `mailto:?subject=${encodeURIComponent(`[컨범코리아] ${selectedPartner} 관련 문의`)}`}
                                        className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/80 text-white rounded-lg transition-colors"
                                    >
                                        <Mail size={16} />
                                        메일 보내기
                                    </button>
                                </div>
                            </div>

                            {/* Tab Navigation */}
                            <div className="px-4 py-2 border-b border-border bg-secondary/20">
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setActiveDetailTab('summary')}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeDetailTab === 'summary'
                                            ? 'bg-accent text-white'
                                            : 'text-muted-foreground hover:text-white hover:bg-secondary'
                                            }`}
                                    >
                                        <BarChart3 size={14} />
                                        요약
                                    </button>
                                    <button
                                        onClick={() => {
                                            setActiveDetailTab('companies');
                                            // Calculate company stats for this partner
                                            const now = new Date();
                                            const currentYear = now.getFullYear();
                                            const lastYear = currentYear - 1;
                                            const currentMonth = now.getMonth();

                                            const partnerData = salesData.filter(d => d.distributor_name === selectedPartner);
                                            const companyAgg: Record<string, {
                                                sales_2025: number;
                                                sales_2024: number;
                                                has_historical_sales: boolean; // 2022-2024 이력 여부
                                            }> = {};

                                            partnerData.forEach(record => {
                                                const date = new Date(record.shipment_date);
                                                const year = date.getFullYear();
                                                const month = date.getMonth();
                                                const company = record.company_name || 'Unknown';

                                                if (!companyAgg[company]) {
                                                    companyAgg[company] = { sales_2025: 0, sales_2024: 0, has_historical_sales: false };
                                                }

                                                // 2022~2024년 이력 확인 (New 업체 판정용)
                                                if (year >= 2022 && year <= 2024) {
                                                    companyAgg[company].has_historical_sales = true;
                                                }

                                                if (year === currentYear && month <= currentMonth) {
                                                    companyAgg[company].sales_2025 += record.sales_amount;
                                                } else if (year === lastYear && month <= currentMonth) {
                                                    companyAgg[company].sales_2024 += record.sales_amount;
                                                }
                                            });

                                            const companies: CompanyStats[] = Object.entries(companyAgg)
                                                .map(([name, data]) => {
                                                    const yoy = data.sales_2024 > 0
                                                        ? ((data.sales_2025 - data.sales_2024) / data.sales_2024) * 100
                                                        : 0;
                                                    return {
                                                        company_name: name,
                                                        sales_2025: data.sales_2025,
                                                        sales_2024: data.sales_2024,
                                                        yoy_growth: yoy,
                                                        // New: 2022-2024 이력이 없고 2025년 매출만 있는 경우
                                                        is_new: !data.has_historical_sales && data.sales_2025 > 0,
                                                        is_risk: yoy <= -30 && data.sales_2024 > 0
                                                    };
                                                })
                                                .filter(c => c.sales_2025 > 0 || c.sales_2024 > 0)
                                                .sort((a, b) => {
                                                    if (a.is_risk && !b.is_risk) return -1;
                                                    if (!a.is_risk && b.is_risk) return 1;
                                                    return a.yoy_growth - b.yoy_growth;
                                                });

                                            setCompanyStats(companies);
                                            if (companies.length > 0) setSelectedCompany(companies[0].company_name);
                                        }}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeDetailTab === 'companies'
                                            ? 'bg-accent text-white'
                                            : 'text-muted-foreground hover:text-white hover:bg-secondary'
                                            }`}
                                    >
                                        <Building2 size={14} />
                                        관리 업체
                                        {companyStats.filter(c => c.is_risk).length > 0 && (
                                            <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                                                {companyStats.filter(c => c.is_risk).length}
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Tab Content */}
                            {activeDetailTab === 'summary' ? (
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {/* Sales Trend Chart */}
                                    <div className="bg-secondary/30 rounded-xl p-4">
                                        <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                                            <TrendingUp size={16} className="text-accent" />
                                            성장 추세 비교 (금년 vs 작년)
                                        </h4>
                                        <div className="h-[200px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={selectedPartnerData.monthlyData}>
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
                                        {/* White Space Analysis */}
                                        <div className="bg-secondary/30 rounded-xl p-4">
                                            <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                                                <Package size={16} className="text-accent" />
                                                White Space 분석 (상품군)
                                            </h4>
                                            <div className="space-y-2">
                                                {selectedPartnerData.whiteSpaceData.map(item => (
                                                    <div key={item.category} className="flex items-center gap-2">
                                                        <div className={`w-4 h-4 rounded ${item.purchased ? 'bg-blue-500' : 'bg-gray-600'}`} />
                                                        <span className={`text-sm flex-1 ${item.purchased ? 'text-white' : 'text-gray-500'}`}>
                                                            {item.category}
                                                        </span>
                                                        {item.purchased && (
                                                            <span className="text-xs text-accent">{formatCompactCurrency(item.sales)}</span>
                                                        )}
                                                        {!item.purchased && (
                                                            <span className="text-xs text-gray-500">미취급</span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Order Timeline */}
                                        <div className="bg-secondary/30 rounded-xl p-4">
                                            <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                                                <Clock size={16} className="text-accent" />
                                                최근 6개월 주문 현황
                                            </h4>

                                            {/* Summary Stats */}
                                            <div className="grid grid-cols-3 gap-2 mb-4">
                                                <div className="bg-secondary/50 rounded-lg p-2 text-center">
                                                    <div className="text-lg font-bold text-accent">{selectedPartnerData.timelineData.totalOrders}</div>
                                                    <div className="text-xs text-muted-foreground">총 주문일</div>
                                                </div>
                                                <div className="bg-secondary/50 rounded-lg p-2 text-center">
                                                    <div className="text-lg font-bold text-white">
                                                        {selectedPartnerData.timelineData.lastOrderDate
                                                            ? new Date(selectedPartnerData.timelineData.lastOrderDate).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
                                                            : '-'}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">마지막 주문</div>
                                                </div>
                                                <div className="bg-secondary/50 rounded-lg p-2 text-center">
                                                    <div className={`text-lg font-bold ${selectedPartnerData.timelineData.avgGap > 30 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                                        {selectedPartnerData.timelineData.avgGap || '-'}일
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">최근 간격</div>
                                                </div>
                                            </div>

                                            {/* Monthly Bar Chart */}
                                            <div className="space-y-2">
                                                {selectedPartnerData.timelineData.monthlyOrderCounts.map((monthData, idx) => {
                                                    const maxCount = Math.max(...selectedPartnerData.timelineData.monthlyOrderCounts.map(m => m.count), 1);
                                                    const barWidth = (monthData.count / maxCount) * 100;
                                                    const isCurrentMonth = idx === selectedPartnerData.timelineData.monthlyOrderCounts.length - 1;

                                                    return (
                                                        <div key={monthData.month} className="flex items-center gap-2">
                                                            <span className={`w-8 text-xs text-right ${isCurrentMonth ? 'text-white font-medium' : 'text-muted-foreground'}`}>
                                                                {monthData.month}
                                                            </span>
                                                            <div className="flex-1 h-5 bg-secondary/50 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full transition-all ${monthData.count > 0 ? 'bg-gradient-to-r from-accent to-accent/60' : ''}`}
                                                                    style={{ width: `${barWidth}%` }}
                                                                />
                                                            </div>
                                                            <span className={`w-8 text-xs ${monthData.count > 0 ? 'text-white' : 'text-muted-foreground'}`}>
                                                                {monthData.count > 0 ? `${monthData.count}회` : '-'}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {selectedPartnerData.timelineData.monthlyOrderCounts.every(m => m.count === 0) && (
                                                <div className="text-center text-muted-foreground text-sm mt-4">
                                                    최근 6개월 주문 없음
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                /* Companies Tab Content */
                                <div className="flex-1 overflow-hidden flex flex-col p-4">
                                    <div className="text-xs text-muted-foreground pb-2 flex items-center gap-1 border-b border-border mb-2">
                                        <AlertTriangle size={12} className="text-amber-400" />
                                        기본 정렬: 매출 급락순 (Risk First) | 총 {companyStats.length}개 업체
                                    </div>
                                    <div className="flex-1 overflow-y-auto space-y-1">
                                        {companyStats.map((company) => (
                                            <div
                                                key={company.company_name}
                                                onClick={() => setSelectedCompany(company.company_name)}
                                                className={`p-3 rounded-lg cursor-pointer transition-all ${selectedCompany === company.company_name
                                                    ? 'bg-accent/20 border border-accent'
                                                    : company.is_risk
                                                        ? 'bg-red-500/10 border border-red-500/30 hover:bg-red-500/20'
                                                        : 'bg-secondary/30 hover:bg-secondary/50 border border-transparent'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        {company.is_risk && <AlertTriangle size={14} className="text-red-400" />}
                                                        <span className="font-medium text-sm text-white truncate max-w-[200px]">
                                                            {company.company_name}
                                                        </span>
                                                        {company.is_new && (
                                                            <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">✨New</span>
                                                        )}
                                                    </div>
                                                    <div className="text-right flex items-center gap-4">
                                                        <div className="text-sm text-muted-foreground">
                                                            {formatCompactCurrency(company.sales_2025)}
                                                        </div>
                                                        <div className={`text-sm font-medium flex items-center gap-1 min-w-[60px] justify-end ${company.is_new ? 'text-green-400' :
                                                            company.yoy_growth >= 0 ? 'text-green-400' : 'text-red-400'
                                                            }`}>
                                                            {company.is_new ? (
                                                                'New'
                                                            ) : (
                                                                <>
                                                                    {company.yoy_growth >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                                                    {company.yoy_growth.toFixed(1)}%
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        {companyStats.length === 0 && (
                                            <div className="flex-1 flex items-center justify-center h-40 text-muted-foreground">
                                                <p>업체 데이터가 없습니다.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                            <div className="text-center">
                                <Store size={48} className="mx-auto mb-4 opacity-30" />
                                <p>좌측 리스트에서 판매점을 선택하세요</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
