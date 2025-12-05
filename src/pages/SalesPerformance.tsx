import { useState, useEffect } from 'react';
import { Search, RefreshCw, AlertCircle, Loader2, ChevronUp, ChevronDown, BarChart2, List, PieChart, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import StoreSalesAnalysis from '../components/StoreSalesAnalysis';
import CompanySalesAnalysis from '../components/CompanySalesAnalysis';
import CompanyDetailAnalysis from '../components/CompanyDetailAnalysis';

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
    // Order specific fields (optional as they might not exist in sales records)
    order_date?: string;
    total_amount?: number;
}

export default function SalesPerformance() {
    const [activeTab, setActiveTab] = useState<'list' | 'analysis' | 'company_analysis' | 'order_performance' | 'detail_analysis'>('list');
    const [salesData, setSalesData] = useState<SalesRecord[]>([]);
    const [orderData, setOrderData] = useState<SalesRecord[]>([]); // Added for order performance data
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: keyof SalesRecord; direction: 'asc' | 'desc' } | null>(null);
    const itemsPerPage = 20;

    const [salesReps, setSalesReps] = useState<string[]>([]);
    const [distributorNames, setDistributorNames] = useState<string[]>([]);
    const [productNames, setProductNames] = useState<string[]>([]);

    const [filters, setFilters] = useState({
        year: '2025',
        month: 'all',
        distributor_name: 'all',
        company_name: '',
        sales_rep: 'all',
        product_name: 'all',
        model_number: ''
    });

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const tableName = activeTab === 'order_performance' ? 'order_performance' : 'sales_performance';
                const dateColumn = activeTab === 'order_performance' ? 'order_date' : 'shipment_date';

                let query = supabase
                    .from(tableName)
                    .select('sales_rep, distributor_name, product_name');

                // Apply Date Filter to Dropdown Options
                if (filters.year !== 'all') {
                    const startYear = `${filters.year}-01-01`;
                    const endYear = `${filters.year}-12-31`;

                    if (filters.month !== 'all') {
                        const startMonth = `${filters.year}-${filters.month.padStart(2, '0')}-01`;
                        const endMonth = new Date(parseInt(filters.year), parseInt(filters.month), 0).toISOString().split('T')[0];
                        query = query.gte(dateColumn, startMonth).lte(dateColumn, endMonth);
                    } else {
                        query = query.gte(dateColumn, startYear).lte(dateColumn, endYear);
                    }
                }

                const { data } = await query;

                if (data) {
                    const uniqueReps = Array.from(new Set(data.map(item => item.sales_rep))).filter(Boolean).sort();
                    const uniqueDistributors = Array.from(new Set(data.map(item => item.distributor_name))).filter(Boolean).sort();
                    const uniqueProducts = Array.from(new Set(data.map(item => item.product_name))).filter(Boolean).sort();

                    setSalesReps(uniqueReps);
                    setDistributorNames(uniqueDistributors);
                    setProductNames(uniqueProducts);
                }
            } catch (err) {
                console.error('Error fetching filter options:', err);
            }
        };

        // Only fetch options if we are in a relevant tab
        if (activeTab === 'list' || activeTab === 'order_performance') {
            fetchFilterOptions();
        }
    }, [filters.year, filters.month, activeTab]);

    useEffect(() => {
        if (activeTab === 'list') {
            const timer = setTimeout(() => {
                fetchSalesData(searchTerm);
            }, 500);
            return () => clearTimeout(timer);
        } else if (activeTab === 'order_performance') {
            const timer = setTimeout(() => {
                fetchOrderData(searchTerm);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [searchTerm, activeTab, filters]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const fetchOrderData = async (query: string = '') => {
        try {
            setIsLoading(true);
            let queryBuilder = supabase
                .from('order_performance')
                .select('*')
                .order('order_date', { ascending: false });

            // Apply Column Filters
            if (filters.year !== 'all') {
                const startYear = `${filters.year}-01-01`;
                const endYear = `${filters.year}-12-31`;

                if (filters.month !== 'all') {
                    const startMonth = `${filters.year}-${filters.month.padStart(2, '0')}-01`;
                    const endMonth = new Date(parseInt(filters.year), parseInt(filters.month), 0).toISOString().split('T')[0];
                    queryBuilder = queryBuilder.gte('order_date', startMonth).lte('order_date', endMonth);
                } else {
                    queryBuilder = queryBuilder.gte('order_date', startYear).lte('order_date', endYear);
                }
            }

            if (filters.distributor_name !== 'all') queryBuilder = queryBuilder.eq('distributor_name', filters.distributor_name);
            if (filters.company_name) queryBuilder = queryBuilder.ilike('company_name', `%${filters.company_name}%`);
            if (filters.sales_rep !== 'all') queryBuilder = queryBuilder.eq('sales_rep', filters.sales_rep);
            if (filters.product_name !== 'all') queryBuilder = queryBuilder.eq('product_name', filters.product_name);
            if (filters.model_number) queryBuilder = queryBuilder.ilike('model_number', `%${filters.model_number}%`);

            if (query) {
                queryBuilder = queryBuilder.or(`company_name.ilike.%${query}%,distributor_name.ilike.%${query}%,product_name.ilike.%${query}%,model_number.ilike.%${query}%,sales_rep.ilike.%${query}%`);
            }

            const { data, error } = await queryBuilder;

            if (error) throw error;
            setOrderData(data || []);
            setCurrentPage(1);
        } catch (err: any) {
            console.error('Error fetching order data:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSalesData = async (query: string = '') => {
        try {
            setIsLoading(true);
            let queryBuilder = supabase
                .from('sales_performance')
                .select('*')
                .order('shipment_date', { ascending: false });

            // Apply Column Filters
            if (filters.year !== 'all') {
                const startYear = `${filters.year}-01-01`;
                const endYear = `${filters.year}-12-31`;

                if (filters.month !== 'all') {
                    const startMonth = `${filters.year}-${filters.month.padStart(2, '0')}-01`;
                    const endMonth = new Date(parseInt(filters.year), parseInt(filters.month), 0).toISOString().split('T')[0];
                    queryBuilder = queryBuilder.gte('shipment_date', startMonth).lte('shipment_date', endMonth);
                } else {
                    queryBuilder = queryBuilder.gte('shipment_date', startYear).lte('shipment_date', endYear);
                }
            }

            if (filters.distributor_name !== 'all') queryBuilder = queryBuilder.eq('distributor_name', filters.distributor_name);
            if (filters.company_name) queryBuilder = queryBuilder.ilike('company_name', `%${filters.company_name}%`);
            if (filters.sales_rep !== 'all') queryBuilder = queryBuilder.eq('sales_rep', filters.sales_rep);
            if (filters.product_name !== 'all') queryBuilder = queryBuilder.eq('product_name', filters.product_name);
            if (filters.model_number) queryBuilder = queryBuilder.ilike('model_number', `%${filters.model_number}%`);

            if (query) {
                queryBuilder = queryBuilder.or(`company_name.ilike.%${query}%,distributor_name.ilike.%${query}%,product_name.ilike.%${query}%,model_number.ilike.%${query}%,sales_rep.ilike.%${query}%`);
            }

            const { data, error } = await queryBuilder;

            if (error) throw error;
            setSalesData(data || []);
            setCurrentPage(1);
        } catch (err: any) {
            console.error('Error fetching sales data:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Helper to get current data based on tab
    const getCurrentData = () => {
        if (activeTab === 'list') return salesData;
        if (activeTab === 'order_performance') return orderData;
        return [];
    };

    const currentData = getCurrentData();

    // Client-side sorting
    const filteredData = [...currentData].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;

        let aValue = a[key];
        let bValue = b[key];

        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handleSort = (key: keyof SalesRecord) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const SortIcon = ({ columnKey }: { columnKey: keyof SalesRecord }) => {
        if (sortConfig?.key !== columnKey) return <div className="w-4 h-4 ml-1 inline-block" />;
        return sortConfig.direction === 'asc' ?
            <ChevronUp size={16} className="ml-1 inline-block text-accent" /> :
            <ChevronDown size={16} className="ml-1 inline-block text-accent" />;
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        try {
            return new Date(dateString).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' });
        } catch (e) {
            return dateString;
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount);
    };

    // Render Table Helper
    const renderTable = (data: any[], type: 'sales' | 'order') => (
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            {/* Search Input Only */}
            <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="업체명, 판매점, 상품군, 형번, 영업담당자 검색..."
                        className="w-full pl-10 pr-4 py-2 bg-secondary text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                        }}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-secondary/30 border-b border-border">
                        <tr>
                            <th className="px-6 py-3 text-center text-base font-bold text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => handleSort(type === 'sales' ? 'shipment_date' : 'order_date')}>
                                <div className="flex items-center justify-center gap-1">
                                    {type === 'sales' ? '출고일' : '수주일'} <SortIcon columnKey={type === 'sales' ? 'shipment_date' : 'order_date'} />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-center text-base font-bold text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => handleSort('distributor_name')}>
                                <div className="flex items-center justify-center gap-1">
                                    판매점명 <SortIcon columnKey="distributor_name" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-center text-base font-bold text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => handleSort('company_name')}>
                                <div className="flex items-center justify-center gap-1">
                                    업체명 <SortIcon columnKey="company_name" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-center text-base font-bold text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => handleSort('sales_rep')}>
                                <div className="flex items-center justify-center gap-1">
                                    영업담당자 <SortIcon columnKey="sales_rep" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-center text-base font-bold text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => handleSort('product_name')}>
                                <div className="flex items-center justify-center gap-1">
                                    상품군 <SortIcon columnKey="product_name" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-center text-base font-bold text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => handleSort('model_number')}>
                                <div className="flex items-center justify-center gap-1">
                                    형번 <SortIcon columnKey="model_number" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-center text-base font-bold text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => handleSort('quantity')}>
                                <div className="flex items-center justify-center gap-1">
                                    수량 <SortIcon columnKey="quantity" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-center text-sm font-bold text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => handleSort('unit_price')}>
                                <div className="flex items-center justify-center gap-1">
                                    단가 <SortIcon columnKey="unit_price" />
                                </div>
                            </th>
                            <th className="px-6 py-3 text-center text-sm font-bold text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => handleSort(type === 'sales' ? 'sales_amount' : 'total_amount')}>
                                <div className="flex items-center justify-center gap-1">
                                    {type === 'sales' ? '판매금액' : '수주금액'} <SortIcon columnKey={type === 'sales' ? 'sales_amount' : 'total_amount'} />
                                </div>
                            </th>
                        </tr>
                        {/* Filter Row */}
                        <tr className="bg-secondary/30 border-b border-border">
                            <th className="px-2 py-2">
                                <div className="flex gap-1">
                                    <select
                                        value={filters.year}
                                        onChange={(e) => handleFilterChange('year', e.target.value)}
                                        className="w-1/2 px-1 py-1 text-xs border border-border rounded focus:outline-none focus:ring-1 focus:ring-accent"
                                    >
                                        <option value="all">전체</option>
                                        <option value="2025">2025</option>
                                        <option value="2024">2024</option>
                                        <option value="2023">2023</option>
                                        <option value="2022">2022</option>
                                    </select>
                                    <select
                                        value={filters.month}
                                        onChange={(e) => handleFilterChange('month', e.target.value)}
                                        className="w-1/2 px-1 py-1 text-xs border border-border rounded focus:outline-none focus:ring-1 focus:ring-accent"
                                        disabled={filters.year === 'all'}
                                    >
                                        <option value="all">전체</option>
                                        {[...Array(12)].map((_, i) => (
                                            <option key={i + 1} value={String(i + 1)}>{i + 1}월</option>
                                        ))}
                                    </select>
                                </div>
                            </th>
                            <th className="px-2 py-2">
                                <select
                                    value={filters.distributor_name}
                                    onChange={(e) => handleFilterChange('distributor_name', e.target.value)}
                                    className="w-full px-1 py-1 text-xs border border-border rounded focus:outline-none focus:ring-1 focus:ring-accent"
                                >
                                    <option value="all">전체</option>
                                    {distributorNames.map(name => (
                                        <option key={name} value={name}>{name}</option>
                                    ))}
                                </select>
                            </th>
                            <th className="px-2 py-2">
                                <input
                                    type="text"
                                    value={filters.company_name}
                                    onChange={(e) => handleFilterChange('company_name', e.target.value)}
                                    className="w-full px-2 py-1 text-xs bg-secondary text-white border border-border rounded focus:outline-none focus:ring-1 focus:ring-accent"
                                    placeholder="업체명"
                                />
                            </th>
                            <th className="px-2 py-2">
                                <select
                                    value={filters.sales_rep}
                                    onChange={(e) => handleFilterChange('sales_rep', e.target.value)}
                                    className="w-full px-1 py-1 text-xs border border-border rounded focus:outline-none focus:ring-1 focus:ring-accent"
                                >
                                    <option value="all">전체</option>
                                    {salesReps.map(rep => (
                                        <option key={rep} value={rep}>{rep}</option>
                                    ))}
                                </select>
                            </th>
                            <th className="px-2 py-2">
                                <select
                                    value={filters.product_name}
                                    onChange={(e) => handleFilterChange('product_name', e.target.value)}
                                    className="w-full px-1 py-1 text-xs border border-border rounded focus:outline-none focus:ring-1 focus:ring-accent"
                                >
                                    <option value="all">전체</option>
                                    {productNames.map(name => (
                                        <option key={name} value={name}>{name}</option>
                                    ))}
                                </select>
                            </th>
                            <th className="px-2 py-2">
                                <input
                                    type="text"
                                    value={filters.model_number}
                                    onChange={(e) => handleFilterChange('model_number', e.target.value)}
                                    className="w-full px-2 py-1 text-xs bg-secondary text-white border border-border rounded focus:outline-none focus:ring-1 focus:ring-accent"
                                    placeholder="형번"
                                />
                            </th>
                            <th className="px-2 py-2"></th>
                            <th className="px-2 py-2"></th>
                            <th className="px-2 py-2"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {isLoading ? (
                            <tr>
                                <td colSpan={9} className="px-6 py-8 text-center text-muted-foreground">
                                    데이터를 불러오는 중입니다...
                                </td>
                            </tr>
                        ) : data.length > 0 ? (
                            data.map((item) => (
                                <tr key={item.id} className="hover:bg-secondary/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">{formatDate(type === 'sales' ? item.shipment_date : item.order_date)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.distributor_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-white">{item.company_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.sales_rep}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.product_name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{item.model_number}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">{(item.quantity || 0).toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">{formatCurrency(item.unit_price || 0)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-accent">{formatCurrency((type === 'sales' ? item.sales_amount : item.total_amount) || 0)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="px-6 py-8 text-center text-muted-foreground">
                                    데이터가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination and Total */}
            <div className="p-4 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                    총 {filteredData.length}개 중 {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} 표시
                </div>

                <div className="flex items-center gap-6">
                    <div className="text-sm">
                        <span className="text-muted-foreground mr-2">합계:</span>
                        <span className="font-bold text-lg text-accent">
                            {formatCurrency(filteredData.reduce((sum, item) => sum + ((type === 'sales' ? item.sales_amount : item.total_amount) || 0), 0))}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-border rounded hover:bg-secondary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            이전
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border border-border rounded hover:bg-secondary/30 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            다음
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* ... (Header and Tabs) ... */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">실적 관리</h1>
                    <p className="text-muted-foreground mt-1">영업 성과 및 실적을 확인하고 관리합니다.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            if (activeTab === 'list') fetchSalesData(searchTerm);
                            if (activeTab === 'order_performance') fetchOrderData(searchTerm);
                        }}
                        className="p-2 text-muted-foreground hover:text-muted-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                        title="새로고침"
                    >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                    <button
                        onClick={() => {
                            setActiveTab('list');
                            setSearchTerm('');
                            setFilters(prev => ({
                                ...prev,
                                distributor_name: 'all',
                                company_name: '',
                                sales_rep: 'all',
                                product_name: 'all',
                                model_number: ''
                            }));
                        }}
                        className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                            ${activeTab === 'list'
                                ? 'border-blue-500 text-accent'
                                : 'border-transparent text-muted-foreground hover:text-muted-foreground hover:border-border'}
                        `}
                    >
                        <List size={18} />
                        판매 실적
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab('order_performance');
                            setSearchTerm('');
                            setFilters(prev => ({
                                ...prev,
                                distributor_name: 'all',
                                company_name: '',
                                sales_rep: 'all',
                                product_name: 'all',
                                model_number: ''
                            }));
                        }}
                        className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                            ${activeTab === 'order_performance'
                                ? 'border-blue-500 text-accent'
                                : 'border-transparent text-muted-foreground hover:text-muted-foreground hover:border-border'}
                        `}
                    >
                        <TrendingUp size={18} />
                        수주 실적
                    </button>
                    <button
                        onClick={() => setActiveTab('analysis')}
                        className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                            ${activeTab === 'analysis'
                                ? 'border-blue-500 text-accent'
                                : 'border-transparent text-muted-foreground hover:text-muted-foreground hover:border-border'}
                        `}
                    >
                        <BarChart2 size={18} />
                        판매점별 매출 분석
                    </button>
                    <button
                        onClick={() => setActiveTab('company_analysis')}
                        className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                            ${activeTab === 'company_analysis'
                                ? 'border-blue-500 text-accent'
                                : 'border-transparent text-muted-foreground hover:text-muted-foreground hover:border-border'}
                        `}
                    >
                        <PieChart size={18} />
                        상위 5개 업체 매출 분석
                    </button>
                    <button
                        onClick={() => setActiveTab('detail_analysis')}
                        className={`
                            whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2
                            ${activeTab === 'detail_analysis'
                                ? 'border-blue-500 text-accent'
                                : 'border-transparent text-muted-foreground hover:text-muted-foreground hover:border-border'}
                        `}
                    >
                        <PieChart size={18} />
                        업체별 매출 분석
                    </button>
                </nav>
            </div>

            {error && (
                <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle size={20} />
                    <p>{error}</p>
                </div>
            )}

            {activeTab === 'list' ? (
                renderTable(paginatedData, 'sales')
            ) : activeTab === 'order_performance' ? (
                renderTable(paginatedData, 'order')
            ) : activeTab === 'analysis' ? (
                <StoreSalesAnalysis />
            ) : activeTab === 'company_analysis' ? (
                <CompanySalesAnalysis />
            ) : (
                <CompanyDetailAnalysis />
            )}
        </div>
    );
}
