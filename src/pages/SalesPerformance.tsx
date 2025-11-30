import { useState, useEffect } from 'react';
import { Search, RefreshCw, AlertCircle, Loader2, ChevronUp, ChevronDown } from 'lucide-react';
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

export default function SalesPerformance() {
    const [salesData, setSalesData] = useState<SalesRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<{ key: keyof SalesRecord; direction: 'asc' | 'desc' } | null>(null);
    const itemsPerPage = 20;

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSalesData(searchTerm);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm]);

    const fetchSalesData = async (query: string = '') => {
        try {
            setIsLoading(true);
            let queryBuilder = supabase
                .from('sales_performance')
                .select('*')
                .order('shipment_date', { ascending: false });

            if (query) {
                queryBuilder = queryBuilder.or(`company_name.ilike.%${query}%,distributor_name.ilike.%${query}%,product_name.ilike.%${query}%,model_number.ilike.%${query}%`);
            }

            const { data, error } = await queryBuilder;

            if (error) throw error;
            setSalesData(data || []);
            setCurrentPage(1); // Reset to first page on new search
        } catch (err: any) {
            console.error('Error fetching sales data:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Client-side sorting is still useful for the fetched result set
    const filteredData = salesData.sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;

        let aValue = a[key];
        let bValue = b[key];

        // Handle null/undefined
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const handleSort = (key: keyof SalesRecord) => {
        setSortConfig(current => {
            if (current?.key === key) {
                return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    const SortIcon = ({ columnKey }: { columnKey: keyof SalesRecord }) => {
        if (sortConfig?.key !== columnKey) return <div className="w-4 h-4" />;
        return sortConfig.direction === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
    };

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('ko-KR');
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">판매 실적</h1>
                    <p className="text-gray-500 mt-1">영업 성과 및 실적을 확인합니다.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => fetchSalesData(searchTerm)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="새로고침"
                    >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle size={20} />
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="업체명, 판매점, 상품명, 형번 검색..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                            }}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th
                                    className="px-6 py-3 font-bold text-gray-500 whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort('shipment_date')}
                                >
                                    <div className="flex items-center gap-1">
                                        출고일 <SortIcon columnKey="shipment_date" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 font-bold text-gray-500 whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort('distributor_name')}
                                >
                                    <div className="flex items-center gap-1">
                                        판매점명 <SortIcon columnKey="distributor_name" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 font-bold text-gray-500 whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort('company_name')}
                                >
                                    <div className="flex items-center gap-1">
                                        업체명 <SortIcon columnKey="company_name" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 font-bold text-gray-500 whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort('sales_rep')}
                                >
                                    <div className="flex items-center gap-1">
                                        영업담당자 <SortIcon columnKey="sales_rep" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 font-bold text-gray-500 whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort('product_name')}
                                >
                                    <div className="flex items-center gap-1">
                                        판매상품 <SortIcon columnKey="product_name" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 font-bold text-gray-500 whitespace-nowrap cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort('model_number')}
                                >
                                    <div className="flex items-center gap-1">
                                        형번 <SortIcon columnKey="model_number" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 font-bold text-gray-500 whitespace-nowrap text-right cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort('quantity')}
                                >
                                    <div className="flex items-center justify-end gap-1">
                                        수량 <SortIcon columnKey="quantity" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 font-bold text-gray-500 whitespace-nowrap text-right cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort('unit_price')}
                                >
                                    <div className="flex items-center justify-end gap-1">
                                        단가 <SortIcon columnKey="unit_price" />
                                    </div>
                                </th>
                                <th
                                    className="px-6 py-3 font-bold text-gray-500 whitespace-nowrap text-right cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => handleSort('sales_amount')}
                                >
                                    <div className="flex items-center justify-end gap-1">
                                        판매금액 <SortIcon columnKey="sales_amount" />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                                        데이터를 불러오는 중입니다...
                                    </td>
                                </tr>
                            ) : paginatedData.length > 0 ? (
                                paginatedData.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(item.shipment_date)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.distributor_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{item.company_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.sales_rep}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.product_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">{item.model_number}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">{item.quantity.toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">{formatCurrency(item.unit_price)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-blue-600">{formatCurrency(item.sales_amount)}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                                        데이터가 없습니다.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t border-gray-200 flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                        총 {filteredData.length}개 중 {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredData.length)} 표시
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            이전
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            다음
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
