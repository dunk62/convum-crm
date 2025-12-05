import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Search, Edit2, X, Trash2, ArrowUpDown } from 'lucide-react';

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
    const [sortConfig, setSortConfig] = useState<{ key: keyof InventoryItem; direction: 'asc' | 'desc' } | null>(null);

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

    const filteredInventory = inventory
        .filter(item =>
            item.model_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (!sortConfig) return 0;
            const { key, direction } = sortConfig;

            const aValue = a[key];
            const bValue = b[key];

            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            return 0;
        });

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">재고 현황</h1>
                    <p className="mt-2 text-base text-muted-foreground">
                        전체 재고 현황 및 영업소별 재고를 관리합니다.
                    </p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-accent text-white text-lg font-medium rounded-lg hover:bg-accent/90 transition-colors"
                >
                    <Plus size={24} />
                    신규 품목 등록
                </button>
            </div>

            <div className="bg-card rounded-xl overflow-hidden border border-border">
                <div className="p-6 border-b border-border flex justify-between items-center">
                    <h2 className="text-xl font-bold text-white">남부전략영업소 영업용 재고</h2>
                    <div className="relative w-96">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                        <input
                            type="text"
                            placeholder="모델명 또는 비고 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-4 py-3 w-full bg-secondary border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-accent text-white placeholder-muted-foreground text-base transition-shadow"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-border">
                        <thead className="bg-secondary/50">
                            <tr>
                                <th scope="col" className="px-8 py-5 text-left text-sm font-bold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-secondary transition-colors" onClick={() => handleSort('model_code')}>
                                    <div className="flex items-center gap-2">
                                        모델명
                                        <ArrowUpDown size={16} className={`transition-colors ${sortConfig?.key === 'model_code' ? 'text-accent' : 'text-muted-foreground'}`} />
                                    </div>
                                </th>
                                <th scope="col" className="px-8 py-5 text-center text-sm font-bold text-muted-foreground uppercase tracking-wider">
                                    총 재고
                                </th>
                                <th scope="col" className="px-8 py-5 text-center text-sm font-bold text-muted-foreground uppercase tracking-wider">
                                    대여중
                                </th>
                                <th scope="col" className="px-8 py-5 text-center text-sm font-bold text-accent uppercase tracking-wider bg-accent/10">
                                    가용 재고
                                </th>
                                <th scope="col" className="px-8 py-5 text-left text-sm font-bold text-muted-foreground uppercase tracking-wider">
                                    비고
                                </th>
                                <th scope="col" className="px-8 py-5 text-right text-sm font-bold text-muted-foreground uppercase tracking-wider">
                                    관리
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-12 text-center text-lg text-muted-foreground">
                                        데이터를 불러오는 중...
                                    </td>
                                </tr>
                            ) : filteredInventory.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-12 text-center text-lg text-muted-foreground">
                                        등록된 재고가 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                filteredInventory.map((item) => (
                                    <tr key={item.id} className="hover:bg-secondary/30 transition-colors">
                                        <td className="px-8 py-5 whitespace-nowrap text-lg font-semibold text-white">
                                            {item.model_code}
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-lg text-white text-center font-medium">
                                            {item.total_quantity}
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-lg text-muted-foreground text-center">
                                            {item.rented_quantity}
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-center bg-accent/5">
                                            <span className={`inline-flex items-center justify-center px-4 py-1 rounded-full text-lg font-bold ${item.available_quantity > 0 ? 'bg-accent/20 text-accent' : 'bg-danger/20 text-danger'
                                                }`}>
                                                {item.available_quantity}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-base text-muted-foreground">
                                            {item.description || '-'}
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-right text-base font-medium">
                                            <button
                                                onClick={() => setEditingItem(item)}
                                                className="p-2 text-accent hover:text-accent/80 hover:bg-accent/10 rounded-full transition-colors"
                                                title="수정"
                                            >
                                                <Edit2 size={22} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteItem(item.id, item.model_code)}
                                                className="p-2 text-danger hover:text-danger/80 hover:bg-danger/10 rounded-full transition-colors ml-1"
                                                title="삭제"
                                            >
                                                <Trash2 size={22} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Item Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-card rounded-lg p-6 w-full max-w-md border border-border">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white">신규 품목 등록</h3>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-muted-foreground hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleAddItem} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground">모델명</label>
                                <input
                                    type="text"
                                    required
                                    value={newItem.model_code}
                                    onChange={(e) => setNewItem({ ...newItem, model_code: e.target.value })}
                                    className="mt-1 block w-full bg-secondary border border-border rounded-md py-2 px-3 text-white focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground">초기 수량</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={newItem.total_quantity}
                                    onChange={(e) => setNewItem({ ...newItem, total_quantity: e.target.value })}
                                    className="mt-1 block w-full bg-secondary border border-border rounded-md py-2 px-3 text-white focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground">비고</label>
                                <input
                                    type="text"
                                    value={newItem.description}
                                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                                    className="mt-1 block w-full bg-secondary border border-border rounded-md py-2 px-3 text-white focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsAddModalOpen(false)}
                                    className="px-4 py-2 border border-border rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-accent hover:bg-accent/90"
                                >
                                    등록
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Item Modal */}
            {editingItem && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-card rounded-lg p-6 w-full max-w-md border border-border">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-white">재고 수정 ({editingItem.model_code})</h3>
                            <button onClick={() => setEditingItem(null)} className="text-muted-foreground hover:text-white">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleUpdateItem} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground">총 수량 (입고/출고)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={editingItem.total_quantity}
                                    onChange={(e) => setEditingItem({ ...editingItem, total_quantity: parseInt(e.target.value) || 0 })}
                                    className="mt-1 block w-full bg-secondary border border-border rounded-md py-2 px-3 text-white focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                                />
                                <p className="mt-1 text-xs text-muted-foreground">현재 수량을 직접 수정하여 입고/출고를 처리합니다.</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground">비고</label>
                                <input
                                    type="text"
                                    value={editingItem.description}
                                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                                    className="mt-1 block w-full bg-secondary border border-border rounded-md py-2 px-3 text-white focus:outline-none focus:ring-accent focus:border-accent sm:text-sm"
                                />
                            </div>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setEditingItem(null)}
                                    className="px-4 py-2 border border-border rounded-md text-sm font-medium text-muted-foreground hover:bg-secondary"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-accent hover:bg-accent/90"
                                >
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
