import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, Package, Search, X } from 'lucide-react';

interface RentalItem {
    id: string;
    inventory_id: string;
    model_code: string;
    quantity: number;
    rent_date: string;
    return_due_date: string | null;
    status: string;
}

interface InventoryItem {
    id: string;
    model_code: string;
    product_name: string;
    available_quantity: number;
}

interface RentalManagerProps {
    opportunityId: string;
}

export default function RentalManager({ opportunityId }: RentalManagerProps) {
    const [rentals, setRentals] = useState<RentalItem[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    // New Rental Form State
    const [selectedInventoryId, setSelectedInventoryId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [returnDueDate, setReturnDueDate] = useState('');

    // Search State
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchRentals();
        fetchInventory();

        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [opportunityId]);

    const fetchRentals = async () => {
        try {
            const { data, error } = await supabase
                .from('sample_rentals')
                .select(`
                    *,
                    sample_inventory (model_code)
                `)
                .eq('opportunity_id', opportunityId)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setRentals(data.map((item: any) => ({
                ...item,
                model_code: item.sample_inventory?.model_code
            })) || []);
        } catch (error) {
            console.error('Error fetching rentals:', error);
        }
    };

    const fetchInventory = async () => {
        try {
            const { data, error } = await supabase
                .from('inventory_status_view')
                .select('id, model_code, product_name, available_quantity')
                .gt('available_quantity', 0)
                .order('model_code');

            if (error) throw error;
            setInventory(data || []);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    };

    const handleAddRental = async () => {
        if (!selectedInventoryId) {
            alert('품목을 선택해주세요.');
            return;
        }

        try {
            const { error } = await supabase
                .from('sample_rentals')
                .insert([{
                    opportunity_id: opportunityId,
                    inventory_id: selectedInventoryId,
                    quantity: quantity,
                    return_due_date: returnDueDate || null,
                    status: 'rented'
                }]);

            if (error) throw error;

            setIsAdding(false);
            setSelectedInventoryId('');
            setSearchQuery('');
            setQuantity(1);
            setReturnDueDate('');
            fetchRentals();
            fetchInventory(); // Refresh inventory to update available quantities
        } catch (error) {
            console.error('Error adding rental:', error);
            alert('Failed to add rental');
        }
    };

    const handleReturnRental = async (e: React.MouseEvent, rentalId: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('반납 처리하시겠습니까?')) return;

        try {
            const { error } = await supabase
                .from('sample_rentals')
                .update({
                    status: 'returned',
                    returned_date: new Date().toISOString().split('T')[0]
                })
                .eq('id', rentalId);

            if (error) throw error;
            fetchRentals();
            fetchInventory();
        } catch (error) {
            console.error('Error returning rental:', error);
            alert('Failed to return rental');
        }
    };

    const handleDeleteRental = async (e: React.MouseEvent, rentalId: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('대여 기록을 삭제하시겠습니까?')) return;

        try {
            const { error } = await supabase
                .from('sample_rentals')
                .delete()
                .eq('id', rentalId);

            if (error) throw error;
            fetchRentals();
            fetchInventory();
        } catch (error) {
            console.error('Error deleting rental:', error);
            alert('Failed to delete rental');
        }
    };

    const filteredInventory = inventory.filter(item =>
        item.model_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.product_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedItem = inventory.find(i => i.id === selectedInventoryId);

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                        <Package size={20} />
                    </div>
                    영업 샘플 대여
                </h3>
                {!isAdding && (
                    <button
                        type="button"
                        onClick={() => setIsAdding(true)}
                        className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        <Plus size={16} />
                        대여 추가
                    </button>
                )}
            </div>

            {isAdding && (
                <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm mb-6 animate-in fade-in slide-in-from-top-2 duration-200">
                    <h4 className="text-sm font-bold text-gray-900 mb-4">새로운 대여 등록</h4>
                    <div>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="sm:col-span-2 relative" ref={dropdownRef}>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">품목 검색</label>
                                <div className="relative">
                                    <div
                                        className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 cursor-text flex items-center justify-between"
                                        onClick={() => {
                                            setIsDropdownOpen(true);
                                        }}
                                    >
                                        <input
                                            type="text"
                                            className="flex-1 outline-none bg-transparent placeholder-gray-400"
                                            placeholder="모델명 또는 품명으로 검색..."
                                            value={selectedItem ? `${selectedItem.model_code} (가용: ${selectedItem.available_quantity})` : searchQuery}
                                            onChange={(e) => {
                                                setSearchQuery(e.target.value);
                                                setSelectedInventoryId('');
                                                setIsDropdownOpen(true);
                                            }}
                                            onFocus={() => setIsDropdownOpen(true)}
                                        />
                                        {selectedInventoryId ? (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedInventoryId('');
                                                    setSearchQuery('');
                                                }}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <X size={16} />
                                            </button>
                                        ) : (
                                            <Search size={16} className="text-gray-400" />
                                        )}
                                    </div>

                                    {isDropdownOpen && (
                                        <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                                            {filteredInventory.length === 0 ? (
                                                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                                                    검색 결과가 없습니다.
                                                </div>
                                            ) : (
                                                filteredInventory.map(item => (
                                                    <div
                                                        key={item.id}
                                                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-50 last:border-0 transition-colors"
                                                        onClick={() => {
                                                            setSelectedInventoryId(item.id);
                                                            setSearchQuery('');
                                                            setIsDropdownOpen(false);
                                                        }}
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-medium text-gray-900">{item.model_code}</span>
                                                            <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                                                가용: {item.available_quantity}
                                                            </span>
                                                        </div>
                                                        {item.product_name && (
                                                            <div className="text-xs text-gray-500 mt-0.5">{item.product_name}</div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">수량</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    max={selectedItem?.available_quantity || 1}
                                    value={quantity}
                                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                                    className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1.5">반납 예정일</label>
                                <input
                                    type="date"
                                    value={returnDueDate}
                                    onChange={(e) => setReturnDueDate(e.target.value)}
                                    className="block w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                취소
                            </button>
                            <button
                                type="button"
                                onClick={handleAddRental}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
                            >
                                등록하기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="overflow-hidden bg-white border border-gray-200 rounded-xl shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/80">
                        <tr>
                            <th scope="col" className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">품목</th>
                            <th scope="col" className="px-3 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">수량</th>
                            <th scope="col" className="px-3 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">대여일</th>
                            <th scope="col" className="px-3 py-3.5 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">상태</th>
                            <th scope="col" className="relative py-3.5 pl-3 pr-6">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                        {rentals.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <Package className="w-10 h-10 text-gray-300 mb-2" />
                                        <p className="text-sm font-medium">대여 기록이 없습니다.</p>
                                        <p className="text-xs text-gray-400 mt-1">새로운 샘플을 대여하려면 '대여 추가' 버튼을 클릭하세요.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            rentals.map((rental) => (
                                <tr key={rental.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-medium text-gray-900">{rental.model_code}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600 text-center">{rental.quantity}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-600 text-center">{rental.rent_date}</td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-center">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${rental.status === 'rented'
                                            ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                                            : 'bg-green-100 text-green-800 border border-green-200'
                                            }`}>
                                            {rental.status === 'rented' ? '대여중' : '반납완료'}
                                        </span>
                                    </td>
                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                                        <div className="flex justify-end items-center gap-3">
                                            {rental.status === 'rented' && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => handleReturnRental(e, rental.id)}
                                                    className="text-blue-600 hover:text-blue-900 font-medium text-xs bg-blue-50 px-3 py-1.5 rounded-md hover:bg-blue-100 transition-colors"
                                                >
                                                    반납
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={(e) => handleDeleteRental(e, rental.id)}
                                                className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-50"
                                                title="삭제"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
