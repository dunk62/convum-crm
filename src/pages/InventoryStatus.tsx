import { useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Search, Edit2, X, Trash2, ArrowUpDown, Package, AlertTriangle, CheckCircle, RefreshCw, Loader2, TrendingUp, BarChart3, Box, Archive, Save, ChevronUp, ChevronDown, Warehouse, MapPin } from 'lucide-react';

interface InventoryItem {
    id: string;
    product_name: string;
    model_code: string;
    total_quantity: number;
    description: string;
    rented_quantity: number;
    available_quantity: number;
}

export default function InventoryStatus() {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [sortConfig, setSortConfig] = useState<{ key: keyof InventoryItem; direction: 'asc' | 'desc' }>({ key: 'model_code', direction: 'asc' });
    const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'low' | 'out'>('all');

    // New Item Form State
    const [newItem, setNewItem] = useState<{
        model_code: string;
        total_quantity: number | string;
        description: string;
    }>({
        model_code: '',
        total_quantity: '',
        description: ''
    });

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('inventory_status_view')
                .select('*')
                .order('model_code', { ascending: true });

            if (error) throw error;

            setInventory(data || []);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { error } = await supabase
                .from('sample_inventory')
                .insert([{
                    product_name: newItem.model_code,
                    model_code: newItem.model_code,
                    total_quantity: Number(newItem.total_quantity) || 0,
                    description: newItem.description
                }]);

            if (error) throw error;

            setIsAddModalOpen(false);
            setNewItem({ model_code: '', total_quantity: '', description: '' });
            fetchInventory();
        } catch (error) {
            console.error('Error adding item:', error);
            alert('Failed to add item');
        }
    };

    const handleUpdateItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingItem) return;

        try {
            const { error } = await supabase
                .from('sample_inventory')
                .update({
                    total_quantity: editingItem.total_quantity,
                    description: editingItem.description
                })
                .eq('id', editingItem.id);

            if (error) throw error;

            setEditingItem(null);
            fetchInventory();
        } catch (error) {
            console.error('Error updating item:', error);
            alert('Failed to update item');
        }
    };

    const handleDeleteItem = async (id: string, modelCode: string) => {
        if (!confirm(`정말로 ${modelCode} 항목을 삭제하시겠습니까?`)) return;

        try {
            const { error } = await supabase
                .from('sample_inventory')
                .delete()
                .eq('id', id);

            if (error) throw error;

            fetchInventory();
        } catch (error) {
            console.error('Error deleting item:', error);
            alert('Failed to delete item');
        }
    };

    const handleSort = (key: keyof InventoryItem) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    // Statistics
    const stats = useMemo(() => {
        const total = inventory.length;
        const totalQuantity = inventory.reduce((sum, item) => sum + item.total_quantity, 0);
        const totalRented = inventory.reduce((sum, item) => sum + item.rented_quantity, 0);
        const totalAvailable = inventory.reduce((sum, item) => sum + item.available_quantity, 0);
        const outOfStock = inventory.filter(item => item.available_quantity === 0).length;
        const lowStock = inventory.filter(item => item.available_quantity > 0 && item.available_quantity <= 2).length;
        const availableCount = inventory.filter(item => item.available_quantity > 2).length;
        const utilizationRate = totalQuantity > 0 ? Math.round((totalRented / totalQuantity) * 100) : 0;

        return { total, totalQuantity, totalRented, totalAvailable, outOfStock, lowStock, availableCount, utilizationRate };
    }, [inventory]);

    const filteredInventory = inventory
        .filter(item => {
            const matchesSearch = item.model_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description?.toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            switch (filterStatus) {
                case 'available': return item.available_quantity > 2;
                case 'low': return item.available_quantity > 0 && item.available_quantity <= 2;
                case 'out': return item.available_quantity === 0;
                default: return true;
            }
        })
        .sort((a, b) => {
            const { key, direction } = sortConfig;
            const aValue = a[key];
            const bValue = b[key];

            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            return 0;
        });

    const getStockStatus = (available: number, _total: number) => {
        if (available === 0) return { label: '재고 없음', color: 'bg-red-500', textColor: 'text-red-400', bgLight: 'bg-red-500/10' };
        if (available <= 2) return { label: '재고 부족', color: 'bg-amber-500', textColor: 'text-amber-400', bgLight: 'bg-amber-500/10' };
        return { label: '정상', color: 'bg-emerald-500', textColor: 'text-emerald-400', bgLight: 'bg-emerald-500/10' };
    };

    const SortIcon = ({ columnKey }: { columnKey: keyof InventoryItem }) => {
        if (sortConfig.key !== columnKey) return <ArrowUpDown size={14} className="text-muted-foreground/50" />;
        return sortConfig.direction === 'asc' ?
            <ChevronUp size={14} className="text-accent" /> :
            <ChevronDown size={14} className="text-accent" />;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                            <Warehouse size={20} className="text-white" />
                        </div>
                        재고 현황
                    </h1>
                    <p className="text-muted-foreground mt-1 flex items-center gap-2">
                        <MapPin size={16} />
                        남부전략영업소 영업용 재고를 관리합니다.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchInventory}
                        className="p-2.5 text-muted-foreground hover:text-white hover:bg-secondary/50 rounded-lg transition-colors"
                        title="새로고침"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg hover:from-teal-600 hover:to-cyan-700 transition-all shadow-lg hover:shadow-teal-500/25"
                    >
                        <Plus size={20} />
                        신규 품목 등록
                    </button>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                <div className="bg-gradient-to-br from-slate-600/20 to-slate-800/20 border border-slate-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                        <Package className="text-slate-400" size={20} />
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                    <p className="text-xs text-slate-400">총 품목</p>
                </div>
                <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                        <Box className="text-blue-400" size={20} />
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.totalQuantity}</p>
                    <p className="text-xs text-blue-400">총 재고</p>
                </div>
                <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                        <TrendingUp className="text-purple-400" size={20} />
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.totalRented}</p>
                    <p className="text-xs text-purple-400">대여중</p>
                </div>
                <div className="bg-gradient-to-br from-cyan-600/20 to-cyan-800/20 border border-cyan-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                        <Archive className="text-cyan-400" size={20} />
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.totalAvailable}</p>
                    <p className="text-xs text-cyan-400">가용 재고</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border border-emerald-500/30 rounded-xl p-4 cursor-pointer hover:border-emerald-400/50 transition-colors" onClick={() => setFilterStatus(filterStatus === 'available' ? 'all' : 'available')}>
                    <div className="flex items-center justify-between mb-1">
                        <CheckCircle className="text-emerald-400" size={20} />
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.availableCount}</p>
                    <p className="text-xs text-emerald-400">정상 품목</p>
                </div>
                <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 border border-amber-500/30 rounded-xl p-4 cursor-pointer hover:border-amber-400/50 transition-colors" onClick={() => setFilterStatus(filterStatus === 'low' ? 'all' : 'low')}>
                    <div className="flex items-center justify-between mb-1">
                        <AlertTriangle className="text-amber-400" size={20} />
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.lowStock}</p>
                    <p className="text-xs text-amber-400">재고 부족</p>
                </div>
                <div className="bg-gradient-to-br from-red-600/20 to-red-800/20 border border-red-500/30 rounded-xl p-4 cursor-pointer hover:border-red-400/50 transition-colors" onClick={() => setFilterStatus(filterStatus === 'out' ? 'all' : 'out')}>
                    <div className="flex items-center justify-between mb-1">
                        <X className="text-red-400" size={20} />
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.outOfStock}</p>
                    <p className="text-xs text-red-400">재고 없음</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-600/20 to-indigo-800/20 border border-indigo-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-1">
                        <BarChart3 className="text-indigo-400" size={20} />
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.utilizationRate}%</p>
                    <p className="text-xs text-indigo-400">활용률</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-card/80 backdrop-blur-sm p-4 rounded-xl border border-border flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={() => setFilterStatus('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === 'all'
                            ? 'bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-400 border border-teal-500/30'
                            : 'text-muted-foreground hover:bg-secondary/30 border border-transparent'
                            }`}
                    >
                        전체 ({stats.total})
                    </button>
                    <button
                        onClick={() => setFilterStatus('available')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${filterStatus === 'available'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'text-muted-foreground hover:bg-secondary/30 border border-transparent'
                            }`}
                    >
                        <CheckCircle size={14} /> 정상 ({stats.availableCount})
                    </button>
                    <button
                        onClick={() => setFilterStatus('low')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${filterStatus === 'low'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'text-muted-foreground hover:bg-secondary/30 border border-transparent'
                            }`}
                    >
                        <AlertTriangle size={14} /> 부족 ({stats.lowStock})
                    </button>
                    <button
                        onClick={() => setFilterStatus('out')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${filterStatus === 'out'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                            : 'text-muted-foreground hover:bg-secondary/30 border border-transparent'
                            }`}
                    >
                        <X size={14} /> 없음 ({stats.outOfStock})
                    </button>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="모델명 또는 비고 검색..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 transition-all"
                    />
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between bg-gradient-to-r from-teal-500/5 to-cyan-500/5">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                            <MapPin size={16} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">남부전략영업소 영업용 재고</h2>
                            <p className="text-xs text-muted-foreground">총 {filteredInventory.length}개 품목</p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead className="bg-secondary/30 border-b border-border">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-bold text-muted-foreground cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => handleSort('model_code')}>
                                    <div className="flex items-center gap-2">
                                        모델명 <SortIcon columnKey="model_code" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-muted-foreground cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => handleSort('total_quantity')}>
                                    <div className="flex items-center justify-center gap-2">
                                        총 재고 <SortIcon columnKey="total_quantity" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-muted-foreground cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => handleSort('rented_quantity')}>
                                    <div className="flex items-center justify-center gap-2">
                                        대여중 <SortIcon columnKey="rented_quantity" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-white bg-gradient-to-r from-teal-500/10 to-cyan-500/10 cursor-pointer hover:from-teal-500/20 hover:to-cyan-500/20 transition-colors" onClick={() => handleSort('available_quantity')}>
                                    <div className="flex items-center justify-center gap-2">
                                        가용 재고 <SortIcon columnKey="available_quantity" />
                                    </div>
                                </th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-muted-foreground">상태</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-muted-foreground">비고</th>
                                <th className="px-6 py-4 text-right text-sm font-bold text-muted-foreground">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <Loader2 className="animate-spin mx-auto text-teal-400" size={32} />
                                        <p className="text-muted-foreground mt-2">데이터를 불러오는 중...</p>
                                    </td>
                                </tr>
                            ) : filteredInventory.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <Package className="mx-auto text-muted-foreground/30" size={48} />
                                        <p className="text-muted-foreground mt-4">등록된 재고가 없습니다.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredInventory.map((item) => {
                                    const status = getStockStatus(item.available_quantity, item.total_quantity);
                                    return (
                                        <tr key={item.id} className="hover:bg-secondary/20 transition-colors">
                                            <td className="px-6 py-4">
                                                <span className="text-base font-bold text-white">{item.model_code}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-base font-medium text-white">{item.total_quantity}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="text-base text-muted-foreground">{item.rented_quantity}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center bg-gradient-to-r from-teal-500/5 to-cyan-500/5">
                                                <span className={`inline-flex items-center justify-center min-w-[3rem] px-3 py-1.5 rounded-full text-base font-bold ${item.available_quantity > 2 ? 'bg-teal-500/20 text-teal-400' :
                                                    item.available_quantity > 0 ? 'bg-amber-500/20 text-amber-400' :
                                                        'bg-red-500/20 text-red-400'
                                                    }`}>
                                                    {item.available_quantity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.bgLight} ${status.textColor}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${status.color}`}></span>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm text-muted-foreground">{item.description || '-'}</span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => setEditingItem(item)}
                                                        className="p-2 text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                        title="수정"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteItem(item.id, item.model_code)}
                                                        className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        title="삭제"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer Summary */}
                {!loading && filteredInventory.length > 0 && (
                    <div className="px-6 py-4 border-t border-border bg-secondary/20 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                            {filterStatus !== 'all' && `필터 적용됨 · `}총 {filteredInventory.length}개 품목
                        </span>
                        <div className="flex items-center gap-4 text-sm">
                            <span className="text-muted-foreground">재고 합계: <strong className="text-white">{filteredInventory.reduce((sum, item) => sum + item.total_quantity, 0)}</strong></span>
                            <span className="text-muted-foreground">가용 합계: <strong className="text-teal-400">{filteredInventory.reduce((sum, item) => sum + item.available_quantity, 0)}</strong></span>
                        </div>
                    </div>
                )}
            </div>

            {/* Add Item Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md border border-border">
                        <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-teal-500/10 to-cyan-500/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center">
                                    <Plus size={20} className="text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-white">신규 품목 등록</h3>
                            </div>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-muted-foreground hover:text-white p-2 hover:bg-secondary/50 rounded-lg transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleAddItem} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">모델명</label>
                                <input
                                    type="text"
                                    required
                                    value={newItem.model_code}
                                    onChange={(e) => setNewItem({ ...newItem, model_code: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                                    placeholder="예: AB-123"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">초기 수량</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={newItem.total_quantity}
                                    onChange={(e) => setNewItem({ ...newItem, total_quantity: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                                    placeholder="수량 입력"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">비고</label>
                                <input
                                    type="text"
                                    value={newItem.description}
                                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50"
                                    placeholder="추가 메모 (선택)"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 text-muted-foreground hover:bg-secondary/50 rounded-lg font-medium transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg font-medium hover:from-teal-600 hover:to-cyan-700 transition-all flex items-center gap-2"
                                >
                                    <Save size={16} />
                                    등록
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Item Modal */}
            {editingItem && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md border border-border">
                        <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-blue-500/10 to-indigo-500/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                    <Edit2 size={20} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white">재고 수정</h3>
                                    <p className="text-sm text-muted-foreground">{editingItem.model_code}</p>
                                </div>
                            </div>
                            <button onClick={() => setEditingItem(null)} className="text-muted-foreground hover:text-white p-2 hover:bg-secondary/50 rounded-lg transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateItem} className="p-6 space-y-4">
                            <div className="grid grid-cols-3 gap-4 p-4 bg-secondary/30 rounded-lg">
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground">현재 총 재고</p>
                                    <p className="text-lg font-bold text-white">{editingItem.total_quantity}</p>
                                </div>
                                <div className="text-center border-x border-border">
                                    <p className="text-xs text-muted-foreground">대여중</p>
                                    <p className="text-lg font-bold text-purple-400">{editingItem.rented_quantity}</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs text-muted-foreground">가용 재고</p>
                                    <p className="text-lg font-bold text-teal-400">{editingItem.available_quantity}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">새로운 총 수량</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={editingItem.total_quantity}
                                    onChange={(e) => setEditingItem({ ...editingItem, total_quantity: parseInt(e.target.value) || 0 })}
                                    className="w-full px-4 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                                <p className="mt-1.5 text-xs text-muted-foreground">총 수량을 직접 수정하여 입고/출고를 처리합니다.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">비고</label>
                                <input
                                    type="text"
                                    value={editingItem.description || ''}
                                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                <button
                                    type="button"
                                    onClick={() => setEditingItem(null)}
                                    className="px-4 py-2 text-muted-foreground hover:bg-secondary/50 rounded-lg font-medium transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center gap-2"
                                >
                                    <Save size={16} />
                                    저장
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
