import { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Product {
    id: string;
    name: string;
    model_number: string;
    category: string;
    unit_price: number;
    description: string;
    created_at: string;
}

export default function ProductCatalog() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState<Partial<Product>>({
        name: '',
        model_number: '',
        category: '',
        unit_price: 0,
        description: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            let query = supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });

            if (searchQuery) {
                query = query.or(`name.ilike.%${searchQuery}%,model_number.ilike.%${searchQuery}%`);
            }

            const { data, error } = await query;

            if (error) throw error;
            setProducts(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchProducts();
    };

    const handleOpenModal = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                model_number: product.model_number,
                category: product.category,
                unit_price: product.unit_price,
                description: product.description
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                model_number: '',
                category: '',
                unit_price: 0,
                description: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
        setFormData({});
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingProduct) {
                const { error } = await supabase
                    .from('products')
                    .update(formData)
                    .eq('id', editingProduct.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('products')
                    .insert([formData]);
                if (error) throw error;
            }
            fetchProducts();
            handleCloseModal();
        } catch (error) {
            console.error('Error saving product:', error);
            alert('제품 저장 중 오류가 발생했습니다.');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            alert('제품 삭제 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">제품 카탈로그</h1>
                    <p className="text-sm text-muted-foreground mt-1">제품 목록 및 상세 정보를 관리합니다.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
                >
                    <Plus size={20} />
                    제품 추가
                </button>
            </div>

            <div className="bg-card p-4 rounded-xl border border-border shadow-sm">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="제품명 또는 모델명 검색"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-secondary text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-secondary/50 text-muted-foreground rounded-lg hover:bg-secondary transition-colors"
                    >
                        검색
                    </button>
                </form>
            </div>

            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-secondary/30 text-muted-foreground font-medium border-b border-border">
                            <tr>
                                <th className="px-6 py-3 text-center text-base font-bold text-muted-foreground">제품명</th>
                                <th className="px-6 py-3 text-center text-base font-bold text-muted-foreground">모델명</th>
                                <th className="px-6 py-3 text-center text-base font-bold text-muted-foreground">카테고리</th>
                                <th className="px-6 py-3 text-center text-base font-bold text-muted-foreground">단가</th>
                                <th className="px-6 py-3 text-center text-base font-bold text-muted-foreground">설명</th>
                                <th className="px-6 py-3 text-center text-base font-bold text-muted-foreground">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                        로딩 중...
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                        등록된 제품이 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-secondary/30">
                                        <td className="px-6 py-4 font-medium text-white">{product.name}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{product.model_number}</td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {product.category || '미분류'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-white">
                                            {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(product.unit_price || 0)}
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground max-w-xs truncate" title={product.description}>
                                            {product.description}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={() => handleOpenModal(product)}
                                                    className="p-1.5 text-muted-foreground hover:text-accent hover:bg-accent/10 rounded-lg transition-colors"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-1.5 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
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

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-card rounded-xl shadow-lg w-full max-w-md overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b border-border bg-secondary/30">
                            <h2 className="text-lg font-bold text-white">
                                {editingProduct ? '제품 수정' : '제품 추가'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-muted-foreground hover:text-muted-foreground">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">제품명 <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 bg-secondary text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">모델명</label>
                                <input
                                    type="text"
                                    value={formData.model_number}
                                    onChange={(e) => setFormData({ ...formData, model_number: e.target.value })}
                                    className="w-full px-3 py-2 bg-secondary text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">카테고리</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2 bg-secondary text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">단가</label>
                                    <input
                                        type="number"
                                        value={formData.unit_price}
                                        onChange={(e) => setFormData({ ...formData, unit_price: Number(e.target.value) })}
                                        className="w-full px-3 py-2 bg-secondary text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">설명</label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 bg-secondary text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-sm font-medium text-muted-foreground bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-accent rounded-lg hover:bg-accent/90 transition-colors"
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
