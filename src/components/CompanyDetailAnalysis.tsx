import { useState, useEffect, useRef } from 'react';
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
import { TrendingUp, Loader2, Search, X, Mail } from 'lucide-react';

export default function CompanyDetailAnalysis() {
    const [loading, setLoading] = useState(true);
    const [periodType, setPeriodType] = useState<'monthly' | 'quarterly'>('monthly');
    const [selectedCompany, setSelectedCompany] = useState<string>('');
    const [companyList, setCompanyList] = useState<string[]>([]);
    const [chartData, setChartData] = useState<any[]>([]); // Changed SalesData[] to any[] to support dynamic keys
    const [availableYears, setAvailableYears] = useState<number[]>([]);
    const [allData, setAllData] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
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
            <div className="flex flex-wrap items-center justify-between gap-4 bg-card p-4 rounded-xl border border-border shadow-sm">
                <div className="flex items-center gap-2">
                    <TrendingUp className="text-accent" size={24} />
                    <h2 className="text-lg font-bold text-white">개별 업체 매출 분석</h2>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-1">
                        <button
                            onClick={() => setPeriodType('monthly')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${periodType === 'monthly'
                                ? 'bg-card text-accent shadow-sm'
                                : 'text-muted-foreground hover:text-muted-foreground'
                                }`}
                        >
                            월별
                        </button>
                        <button
                            onClick={() => setPeriodType('quarterly')}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${periodType === 'quarterly'
                                ? 'bg-card text-accent shadow-sm'
                                : 'text-muted-foreground hover:text-muted-foreground'
                                }`}
                        >
                            분기별
                        </button>
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                            <input
                                type="text"
                                value={isDropdownOpen ? searchQuery : selectedCompany}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setIsDropdownOpen(true);
                                }}
                                onFocus={() => {
                                    setIsDropdownOpen(true);
                                    setSearchQuery('');
                                }}
                                placeholder="업체명 검색..."
                                className="pl-9 pr-8 py-2 bg-secondary text-white border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent min-w-[280px]"
                            />
                            {selectedCompany && !isDropdownOpen && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedCompany('');
                                        setSearchQuery('');
                                        setIsDropdownOpen(true);
                                    }}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-white"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                        {isDropdownOpen && (
                            <div className="absolute z-20 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {companyList
                                    .filter(company => company.toLowerCase().includes(searchQuery.toLowerCase()))
                                    .slice(0, 50)
                                    .map(company => (
                                        <button
                                            key={company}
                                            type="button"
                                            onClick={() => {
                                                setSelectedCompany(company);
                                                setSearchQuery('');
                                                setIsDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary/50 transition-colors ${selectedCompany === company ? 'bg-accent/20 text-accent' : 'text-white'}`}
                                        >
                                            {company}
                                        </button>
                                    ))
                                }
                                {companyList.filter(company => company.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                                    <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                                        검색 결과가 없습니다
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Email Button */}
                    <a
                        href={selectedCompany ? `https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=${encodeURIComponent('[' + selectedCompany + '] 매출 분석 관련 문의')}&body=${encodeURIComponent('안녕하세요,\n\n' + selectedCompany + ' 관련 매출 분석 문의드립니다.\n\n감사합니다.')}` : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => !selectedCompany && e.preventDefault()}
                        className={`flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors shadow-sm ${!selectedCompany ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title="Gmail로 메일 보내기"
                    >
                        <Mail size={16} />
                        <span>메일 보내기</span>
                    </a>
                </div>
            </div>

            {loading ? (
                <div className="h-96 flex items-center justify-center">
                    <Loader2 className="animate-spin text-accent" size={40} />
                </div>
            ) : (
                <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
                    <h3 className="text-lg font-bold text-white mb-6">
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
