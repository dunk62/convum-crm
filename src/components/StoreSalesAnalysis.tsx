import { useState, useEffect } from 'react';
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
import { Loader2, BarChart3, Building2, Info, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface StoreSalesData {
    store_name: string;
    last_year_sales: number;
    this_year_sales: number;
    growth: boolean;
    [key: number]: number;
    latestSales: number;
}

interface CompanyStats {
    company_name: string;
    sales_2025: number;
    sales_2024: number;
    yoy_growth: number;
    is_new: boolean;
    is_risk: boolean;
}

interface CompanyMonthlySales {
    month: string;
    sales_2024: number;
    sales_2025: number;
}

interface ProductCategory {
    name: string;
    value: number;
}

export default function StoreSalesAnalysis() {
    const [data, setData] = useState<StoreSalesData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedStore, setSelectedStore] = useState<string | null>(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [availableYears, setAvailableYears] = useState<number[]>([]);
    const years = { thisYear: new Date().getFullYear(), lastYear: new Date().getFullYear() - 1 };

    // New states for tabs and company analysis
    const [activeTab, setActiveTab] = useState<'summary' | 'companies' | 'info'>('summary');
    const [companyData, setCompanyData] = useState<CompanyStats[]>([]);
    const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
    const [companyLoading, setCompanyLoading] = useState(false);
    const [companyMonthlyData, setCompanyMonthlyData] = useState<CompanyMonthlySales[]>([]);
    const [productCategories, setProductCategories] = useState<ProductCategory[]>([]);
    const [allSalesData, setAllSalesData] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (selectedStore) {
            setAiLoading(true);
            const timer = setTimeout(() => {
                setAiLoading(false);
            }, 1500);

            // Fetch company data when store is selected
            fetchCompanyData(selectedStore);

            return () => clearTimeout(timer);
        }
    }, [selectedStore]);

    useEffect(() => {
        if (selectedCompany && selectedStore) {
            processCompanyDetails(selectedCompany);
        }
    }, [selectedCompany, allSalesData]);

    const fetchData = async () => {
        try {
            setLoading(true);
            let salesDataList: any[] = [];
            let page = 0;
            const pageSize = 1000;
            let hasMore = true;

            while (hasMore) {
                const { data: salesData, error } = await supabase
                    .from('sales_performance')
                    .select('distributor_name, company_name, shipment_date, sales_amount, sales_rep, product_name')
                    .in('sales_rep', ['탁현호', '임성렬'])
                    .range(page * pageSize, (page + 1) * pageSize - 1);

                if (error) throw error;

                if (salesData && salesData.length > 0) {
                    salesDataList = [...salesDataList, ...salesData];
                    if (salesData.length < pageSize) {
                        hasMore = false;
                    } else {
                        page++;
                    }
                } else {
                    hasMore = false;
                }
            }

            setAllSalesData(salesDataList);

            if (salesDataList.length === 0) return;

            const allYears = Array.from(new Set(salesDataList.map(d => new Date(d.shipment_date).getFullYear()))).sort((a, b) => a - b);

            const aggregation: Record<string, Record<number, number>> = {};

            salesDataList.forEach(record => {
                const date = new Date(record.shipment_date);
                const year = date.getFullYear();
                const store = record.distributor_name || 'Unknown';

                if (!aggregation[store]) {
                    aggregation[store] = {};
                    allYears.forEach(y => aggregation[store][y] = 0);
                }

                aggregation[store][year] += record.sales_amount;
            });

            const lastTwoYears = allYears.slice(-2);
            const [prevYear, currYear] = lastTwoYears.length === 2 ? lastTwoYears : [lastTwoYears[0], lastTwoYears[0]];

            const formattedData: StoreSalesData[] = Object.entries(aggregation)
                .map(([store, salesByYear]) => {
                    const item: any = { store_name: store, ...salesByYear };
                    item.growth = (salesByYear[currYear] || 0) >= (salesByYear[prevYear] || 0);
                    item.latestSales = salesByYear[allYears[allYears.length - 1]] || 0;
                    return item;
                })
                .filter(item => Object.values(item).some(v => typeof v === 'number' && v > 0))
                .sort((a, b) => b.latestSales - a.latestSales)
                .slice(0, 10);

            setData(formattedData);
            setAvailableYears(allYears);
        } catch (error) {
            console.error('Error fetching store sales data:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCompanyData = async (storeName: string) => {
        try {
            setCompanyLoading(true);

            const now = new Date();
            const currentYear = now.getFullYear();
            const lastYear = currentYear - 1;
            const currentMonth = now.getMonth();

            // Filter all sales data for this store
            const storeData = allSalesData.filter(d => d.distributor_name === storeName);

            // Aggregate by company
            const companyAgg: Record<string, { sales_2025: number; sales_2024: number }> = {};

            storeData.forEach(record => {
                const date = new Date(record.shipment_date);
                const year = date.getFullYear();
                const month = date.getMonth();
                const company = record.company_name || 'Unknown';

                if (!companyAgg[company]) {
                    companyAgg[company] = { sales_2025: 0, sales_2024: 0 };
                }

                // YTD comparison: same period (Jan ~ current month)
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
                        is_new: data.sales_2024 === 0 && data.sales_2025 > 0,
                        is_risk: yoy <= -30 && !data.sales_2024 === false
                    };
                })
                .filter(c => c.sales_2025 > 0 || c.sales_2024 > 0)
                // Sort by risk first (most negative YoY), then by sales
                .sort((a, b) => {
                    if (a.is_risk && !b.is_risk) return -1;
                    if (!a.is_risk && b.is_risk) return 1;
                    return a.yoy_growth - b.yoy_growth;
                });

            setCompanyData(companies);

            // Auto-select first company
            if (companies.length > 0 && !selectedCompany) {
                setSelectedCompany(companies[0].company_name);
            }
        } catch (error) {
            console.error('Error fetching company data:', error);
        } finally {
            setCompanyLoading(false);
        }
    };

    const processCompanyDetails = (companyName: string) => {
        if (!selectedStore) return;

        const companyRecords = allSalesData.filter(
            d => d.distributor_name === selectedStore && d.company_name === companyName
        );

        // Monthly sales comparison
        const monthlyAgg: Record<string, { sales_2024: number; sales_2025: number }> = {};
        const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

        months.forEach(m => {
            monthlyAgg[m] = { sales_2024: 0, sales_2025: 0 };
        });

        companyRecords.forEach(record => {
            const date = new Date(record.shipment_date);
            const year = date.getFullYear();
            const monthIndex = date.getMonth();
            const monthKey = months[monthIndex];

            if (year === 2025) {
                monthlyAgg[monthKey].sales_2025 += record.sales_amount;
            } else if (year === 2024) {
                monthlyAgg[monthKey].sales_2024 += record.sales_amount;
            }
        });

        const monthlyData: CompanyMonthlySales[] = months.map(m => ({
            month: m,
            sales_2024: monthlyAgg[m].sales_2024,
            sales_2025: monthlyAgg[m].sales_2025
        }));

        setCompanyMonthlyData(monthlyData);

        // Product categories (2025 only)
        const productAgg: Record<string, number> = {};

        companyRecords
            .filter(r => new Date(r.shipment_date).getFullYear() === 2025)
            .forEach(record => {
                const product = record.product_name || 'Unknown';
                productAgg[product] = (productAgg[product] || 0) + record.sales_amount;
            });

        const categories: ProductCategory[] = Object.entries(productAgg)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);

        setProductCategories(categories);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(value);
    };

    const formatCompactCurrency = (value: number) => {
        if (value >= 100000000) {
            return `${(value / 100000000).toFixed(1)}억`;
        } else if (value >= 10000) {
            return `${(value / 10000).toFixed(0)}만`;
        }
        return value.toLocaleString();
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

    const colors = ['#ef4444', '#f59e0b', '#10b981', '#5a8fd4', '#8b5cf6'];
    const pieColors = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'];

    // Tab content rendering
    const renderTabContent = () => {
        if (!selectedStore) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-3">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                        <Building2 size={28} />
                    </div>
                    <p className="text-sm text-center">
                        차트에서 판매점을 선택하면<br />상세 분석이 표시됩니다.
                    </p>
                </div>
            );
        }

        switch (activeTab) {
            case 'summary':
                return renderSummaryTab();
            case 'companies':
                return renderCompaniesTab();
            case 'info':
                return renderInfoTab();
            default:
                return null;
        }
    };

    const renderSummaryTab = () => {
        if (aiLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-3">
                    <Loader2 className="animate-spin" size={24} />
                    <p className="text-sm">매출 데이터를 분석하고 있습니다...</p>
                </div>
            );
        }

        const storeInfo = data.find(d => d.store_name === selectedStore);

        return (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                <div>
                    <h4 className="font-bold text-white text-lg mb-1">{selectedStore}</h4>
                    <div className="flex items-center gap-2 text-sm mb-3">
                        <span className="px-2 py-0.5 bg-blue-100 text-accent rounded text-xs font-medium">주요 파트너</span>
                        {storeInfo?.growth ? (
                            <span className="px-2 py-0.5 bg-green-100 text-success rounded text-xs font-medium">성장세</span>
                        ) : (
                            <span className="px-2 py-0.5 bg-red-100 text-danger rounded text-xs font-medium">감소세</span>
                        )}
                    </div>
                </div>

                <div className="prose prose-sm text-muted-foreground">
                    <p>
                        <strong>📈 매출 추이:</strong><br />
                        {years.lastYear}년 대비 <span className={storeInfo?.growth ? "text-success font-bold" : "text-danger font-bold"}>
                            {storeInfo?.growth ? "증가" : "감소"}
                        </span>했습니다.
                        {storeInfo?.growth
                            ? " 안정적인 성장세를 보이고 있으며, 특히 신규 라인업의 반응이 좋습니다."
                            : " 전년 대비 매출이 다소 부진한 상황으로, 원인 분석이 필요합니다."}
                    </p>
                    <p>
                        <strong>💡 제안 사항:</strong><br />
                        {storeInfo?.growth
                            ? "현재의 모멘텀을 이어가기 위해 재고 수준을 상향 조정하고, 우수 판매점 인센티브를 제공하세요."
                            : "[📂 관리 업체] 탭에서 매출이 하락한 업체를 확인하고, 맞춤형 영업 전략을 수립하세요."}
                    </p>
                </div>
            </div>
        );
    };

    const renderCompaniesTab = () => {
        if (companyLoading) {
            return (
                <div className="flex items-center justify-center h-full">
                    <Loader2 className="animate-spin text-accent" size={32} />
                </div>
            );
        }

        return (
            <div className="flex flex-col h-full gap-4">
                {/* Company List */}
                <div className="flex-1 overflow-auto">
                    <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                        <AlertTriangle size={12} className="text-amber-400" />
                        기본 정렬: 매출 급락순 (Risk First)
                    </div>
                    <div className="space-y-1">
                        {companyData.map((company) => (
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
                                        <span className="font-medium text-sm text-white truncate max-w-[120px]">
                                            {company.company_name}
                                        </span>
                                        {company.is_new && (
                                            <span className="px-1.5 py-0.5 bg-green-500/20 text-green-400 text-xs rounded">✨New</span>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-muted-foreground">
                                            {formatCompactCurrency(company.sales_2025)}
                                        </div>
                                        <div className={`text-xs font-medium flex items-center gap-1 ${company.is_new ? 'text-green-400' :
                                            company.yoy_growth >= 0 ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                            {company.is_new ? (
                                                'New'
                                            ) : (
                                                <>
                                                    {company.yoy_growth >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                    {company.yoy_growth.toFixed(1)}%
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Company Detail Charts - Show in modal or expanded view */}
                {selectedCompany && (
                    <div className="border-t border-border pt-4">
                        <h5 className="text-sm font-bold text-white mb-2">{selectedCompany} 상세</h5>

                        {/* Seasonal Comparison Chart */}
                        <div className="h-32 mb-3">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={companyMonthlyData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#9ca3af' }} />
                                    <YAxis tick={{ fontSize: 9, fill: '#9ca3af' }} tickFormatter={(v) => `${v / 10000}만`} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line
                                        type="monotone"
                                        dataKey="sales_2024"
                                        stroke="#6b7280"
                                        strokeDasharray="5 5"
                                        strokeWidth={2}
                                        dot={false}
                                        name="2024년"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="sales_2025"
                                        stroke="#10b981"
                                        strokeWidth={2}
                                        dot={false}
                                        name="2025년"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Product Category Donut */}
                        {productCategories.length > 0 && (
                            <div className="h-28 flex items-center">
                                <ResponsiveContainer width="50%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={productCategories as any}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={25}
                                            outerRadius={40}
                                            dataKey="value"
                                        >
                                            {productCategories.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="flex-1 text-xs space-y-1">
                                    {productCategories.slice(0, 3).map((cat, i) => (
                                        <div key={cat.name} className="flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pieColors[i] }} />
                                            <span className="text-muted-foreground truncate max-w-[80px]">{cat.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const renderInfoTab = () => {
        return (
            <div className="space-y-4 text-sm text-muted-foreground">
                <div>
                    <h5 className="font-bold text-white mb-2">📊 데이터 안내</h5>
                    <ul className="list-disc list-inside space-y-1">
                        <li>데이터 기간: {availableYears.join(', ')}년</li>
                        <li>담당자: 탁현호, 임성렬</li>
                        <li>상위 10개 판매점 표시</li>
                    </ul>
                </div>
                <div>
                    <h5 className="font-bold text-white mb-2">⚠️ Risk Alert 기준</h5>
                    <p>전년 동기 대비 매출이 <span className="text-red-400 font-bold">30% 이상 하락</span>한 업체는 위험 표시됩니다.</p>
                </div>
                <div>
                    <h5 className="font-bold text-white mb-2">✨ New 태그</h5>
                    <p>작년 동기 매출이 0원이고 올해 매출이 있는 신규 업체입니다.</p>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[600px]">
            {/* Main Chart Area */}
            <div className="flex-1 bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col">
                <h3 className="text-lg font-bold text-white mb-6">판매점별 매출 비교 ({availableYears.join(', ')}년)</h3>

                {loading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 className="animate-spin text-accent" size={32} />
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
                        <p className="text-xs text-muted-foreground text-center mt-4">* 상위 10개 판매점 표시 | 차트의 포인트를 클릭하여 상세 분석 확인</p>
                    </div>
                )}
            </div>

            {/* Side Panel with Tabs */}
            <div className="w-full lg:w-[35%] bg-card p-6 rounded-xl border border-border shadow-sm flex flex-col">
                {/* Tab Header */}
                <div className="flex items-center gap-1 mb-4 bg-secondary/30 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('summary')}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${activeTab === 'summary'
                            ? 'bg-accent text-white'
                            : 'text-muted-foreground hover:text-white'
                            }`}
                    >
                        <BarChart3 size={14} />
                        <span>요약</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('companies')}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${activeTab === 'companies'
                            ? 'bg-accent text-white'
                            : 'text-muted-foreground hover:text-white'
                            }`}
                    >
                        <Building2 size={14} />
                        <span>관리 업체</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-all ${activeTab === 'info'
                            ? 'bg-accent text-white'
                            : 'text-muted-foreground hover:text-white'
                            }`}
                    >
                        <Info size={14} />
                        <span>정보</span>
                    </button>
                </div>

                {/* Store Name Badge */}
                {selectedStore && (
                    <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-accent/10 rounded-lg border border-accent/30">
                        <Building2 size={16} className="text-accent" />
                        <span className="font-bold text-white text-sm">{selectedStore}</span>
                    </div>
                )}

                {/* Tab Content */}
                <div className="flex-1 overflow-hidden">
                    {renderTabContent()}
                </div>
            </div>
        </div>
    );
}
