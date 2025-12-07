import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Edit2, Trash2, X, FileText, Book, ExternalLink, Download, Eye, RefreshCw, Loader2, Grid3X3, List, FolderOpen, Sparkles, BookOpen, CheckCircle } from 'lucide-react';
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

interface PdfCatalog {
    id: string;
    name: string;
    file_id: string;
    thumbnail_url: string;
    view_url: string;
    download_url: string;
    category: string;
    mimeType: string;
    modifiedTime?: string;
}

// Google Drive folder ID
const DRIVE_FOLDER_ID = '1RqbKXjoS37iDmXDnN_UJHqnCB3AVjeWN';

// Google Drive API Key - 환경 변수에서 읽어옴 (보안)
// .env.local 파일에 VITE_GOOGLE_API_KEY 설정 필요
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY || '';

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

    // Tab and PDF states
    const [activeTab, setActiveTab] = useState<'products' | 'catalogs'>('catalogs');
    const [selectedCatalog, setSelectedCatalog] = useState<PdfCatalog | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [catalogSearchQuery, setCatalogSearchQuery] = useState('');
    const [catalogs, setCatalogs] = useState<PdfCatalog[]>([]);
    const [catalogsLoading, setCatalogsLoading] = useState(false);
    const [lastSynced, setLastSynced] = useState<Date | null>(null);
    const [syncError, setSyncError] = useState<string | null>(null);

    // Fetch catalogs from Google Drive
    const fetchDriveCatalogs = useCallback(async () => {
        setCatalogsLoading(true);
        setSyncError(null);

        try {
            // Use Google Drive API to list files in folder
            // For public folders, we can use the embed approach
            // For private folders, you'd need OAuth2

            // Since the folder is shared publicly, we'll use a workaround
            // In production, use Google Drive API with proper authentication

            // For now, we'll use the embedded folder approach and parse file info
            // This is a simplified version - for production, use proper API calls

            const response = await fetch(
                `https://www.googleapis.com/drive/v3/files?q='${DRIVE_FOLDER_ID}'+in+parents+and+mimeType='application/pdf'&fields=files(id,name,thumbnailLink,webViewLink,webContentLink,mimeType,modifiedTime)&key=${GOOGLE_API_KEY}`
            );

            if (!response.ok) {
                // If API call fails, use fallback static list
                console.log('Using fallback catalog list (API key not configured)');
                const fallbackCatalogs = await fetchFallbackCatalogs();
                setCatalogs(fallbackCatalogs);
                setLastSynced(new Date());
                return;
            }

            const data = await response.json();

            if (data.files && data.files.length > 0) {
                const pdfCatalogs: PdfCatalog[] = data.files.map((file: any) => ({
                    id: file.id,
                    name: file.name.replace('.pdf', '').replace('.pdf의 사본', ''),
                    file_id: file.id,
                    thumbnail_url: file.thumbnailLink || `https://drive.google.com/thumbnail?id=${file.id}&sz=w400`,
                    view_url: `https://drive.google.com/file/d/${file.id}/preview`,
                    download_url: `https://drive.google.com/uc?export=download&id=${file.id}`,
                    category: getCategoryFromFileName(file.name),
                    mimeType: file.mimeType,
                    modifiedTime: file.modifiedTime
                }));

                setCatalogs(pdfCatalogs);
                setLastSynced(new Date());
            } else {
                // No files in response, use fallback
                console.log('No files returned from API, using fallback');
                const fallbackCatalogs = await fetchFallbackCatalogs();
                setCatalogs(fallbackCatalogs);
                setLastSynced(new Date());
            }
        } catch (error) {
            console.error('Error fetching Drive catalogs:', error);
            setSyncError('Google Drive 연동에 실패했습니다. 폴백 데이터를 사용합니다.');

            // Use fallback data
            const fallbackCatalogs = await fetchFallbackCatalogs();
            setCatalogs(fallbackCatalogs);
        } finally {
            setCatalogsLoading(false);
        }
    }, []);

    // Fallback catalog list - used when API key is not configured
    // Update this list when files change in Google Drive
    const fetchFallbackCatalogs = async (): Promise<PdfCatalog[]> => {
        // Current files in Google Drive folder (updated 2024-12-07)
        const driveFiles = [
            { name: 'COP PAD카탈로그', fileId: 'COP_PAD' },
            { name: 'PJG패드 카탈로그', fileId: 'PJG_PAD' },
            { name: 'RA PAD 카탈로그', fileId: 'RA_PAD' },
            { name: 'SM 패드 카탈로그', fileId: 'SM_PAD' }
        ];

        return driveFiles.map((file, index) => ({
            id: `catalog-${index}`,
            name: file.name.replace('.pdf의 사본', '').replace('.pdf', ''),
            file_id: file.fileId,
            thumbnail_url: '', // Placeholder - will show file icon
            view_url: `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`,
            download_url: `https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`,
            category: getCategoryFromFileName(file.name),
            mimeType: 'application/pdf'
        }));
    };

    // Extract category from filename
    const getCategoryFromFileName = (fileName: string): string => {
        const name = fileName.replace('.pdf', '').replace('.pdf의 사본', '');
        if (name.includes('COP')) return 'COP PAD';
        if (name.includes('PJG')) return 'PJG PAD';
        if (name.includes('RA')) return 'RA PAD';
        if (name.includes('SM')) return 'SM PAD';
        if (name.startsWith('CL')) return 'CL 시리즈';
        if (name.startsWith('CB')) return 'CB 시리즈';
        if (name.startsWith('CM')) return 'CM 시리즈';
        if (name.startsWith('CU')) return 'CU 시리즈';
        return '패드 카탈로그';
    };

    // Initial load
    useEffect(() => {
        if (activeTab === 'catalogs') {
            fetchDriveCatalogs();
        } else {
            fetchProducts();
        }
    }, [activeTab, fetchDriveCatalogs]);

    // Auto-refresh every 5 minutes
    useEffect(() => {
        if (activeTab === 'catalogs') {
            const interval = setInterval(() => {
                fetchDriveCatalogs();
            }, 5 * 60 * 1000); // 5 minutes

            return () => clearInterval(interval);
        }
    }, [activeTab, fetchDriveCatalogs]);

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

    const openDriveFolder = () => {
        window.open(`https://drive.google.com/drive/folders/${DRIVE_FOLDER_ID}`, '_blank');
    };

    const getCategoryColor = (category?: string) => {
        const colors: Record<string, { bg: string; text: string; border: string }> = {
            'COP PAD': { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/30' },
            'PJG PAD': { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/30' },
            'RA PAD': { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30' },
            'SM PAD': { bg: 'bg-violet-500/10', text: 'text-violet-400', border: 'border-violet-500/30' },
            '패드 카탈로그': { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/30' },
            'CL 시리즈': { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
            'CB 시리즈': { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
            'CM 시리즈': { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
            'CU 시리즈': { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
        };
        return colors[category || ''] || { bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/30' };
    };

    const filteredCatalogs = catalogs.filter(c =>
        c.name.toLowerCase().includes(catalogSearchQuery.toLowerCase()) ||
        c.category?.toLowerCase().includes(catalogSearchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                            <BookOpen size={20} className="text-white" />
                        </div>
                        제품 카탈로그
                    </h1>
                    <p className="text-muted-foreground mt-1">제품 정보와 PDF 카탈로그를 통합 관리합니다.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={openDriveFolder}
                        className="flex items-center gap-2 px-4 py-2.5 bg-secondary/50 text-muted-foreground rounded-lg hover:bg-secondary hover:text-white transition-all"
                    >
                        <FolderOpen size={18} />
                        Google Drive 열기
                    </button>
                    {activeTab === 'products' && (
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-lg hover:from-orange-600 hover:to-red-700 transition-all shadow-lg"
                        >
                            <Plus size={20} />
                            제품 추가
                        </button>
                    )}
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-border">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('catalogs')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'catalogs'
                            ? 'border-orange-500 text-orange-400'
                            : 'border-transparent text-muted-foreground hover:text-white hover:border-border'
                            }`}
                    >
                        <FileText size={18} />
                        PDF 카탈로그
                        {catalogs.length > 0 && (
                            <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-0.5 rounded-full">
                                {catalogs.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${activeTab === 'products'
                            ? 'border-orange-500 text-orange-400'
                            : 'border-transparent text-muted-foreground hover:text-white hover:border-border'
                            }`}
                    >
                        <Book size={18} />
                        제품 목록
                    </button>
                </nav>
            </div>

            {/* PDF Catalogs Tab */}
            {activeTab === 'catalogs' && (
                <div className="space-y-6">
                    {/* Sync Status Banner */}
                    <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-4 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0">
                            <Sparkles size={24} className="text-white" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="text-white font-bold">Google Drive 자동 동기화</h3>
                                {lastSynced && (
                                    <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                                        <CheckCircle size={12} />
                                        마지막 동기화: {lastSynced.toLocaleTimeString('ko-KR')}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Google Drive "제품 카탈로그" 폴더에 PDF를 업로드하면 자동으로 표시됩니다.
                                {syncError && <span className="text-amber-400 ml-2">{syncError}</span>}
                            </p>
                        </div>
                        <button
                            onClick={fetchDriveCatalogs}
                            disabled={catalogsLoading}
                            className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            {catalogsLoading ? (
                                <Loader2 size={16} className="animate-spin" />
                            ) : (
                                <RefreshCw size={16} />
                            )}
                            {catalogsLoading ? '동기화 중...' : '새로고침'}
                        </button>
                        <button
                            onClick={openDriveFolder}
                            className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors flex items-center gap-2"
                        >
                            <ExternalLink size={16} />
                            폴더 열기
                        </button>
                    </div>

                    {/* Search & View Toggle */}
                    <div className="bg-card/80 backdrop-blur-sm p-4 rounded-xl border border-border flex items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                type="text"
                                placeholder="카탈로그 검색..."
                                value={catalogSearchQuery}
                                onChange={(e) => setCatalogSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                            />
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground">
                                총 {filteredCatalogs.length}개 카탈로그
                            </span>
                            <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-lg">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-orange-500/20 text-orange-400' : 'text-muted-foreground hover:text-white'}`}
                                >
                                    <Grid3X3 size={18} />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-orange-500/20 text-orange-400' : 'text-muted-foreground hover:text-white'}`}
                                >
                                    <List size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {catalogsLoading && catalogs.length === 0 ? (
                        <div className="bg-card rounded-xl border border-border p-12 text-center">
                            <Loader2 className="animate-spin mx-auto text-orange-400" size={40} />
                            <p className="text-muted-foreground mt-4">Google Drive에서 카탈로그를 불러오는 중...</p>
                        </div>
                    ) : filteredCatalogs.length === 0 ? (
                        <div className="bg-card rounded-xl border border-border p-12 text-center">
                            <FileText className="mx-auto text-muted-foreground/30" size={48} />
                            <p className="text-muted-foreground mt-4">카탈로그가 없습니다.</p>
                            <button
                                onClick={openDriveFolder}
                                className="mt-4 px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors"
                            >
                                Google Drive에 PDF 업로드하기
                            </button>
                        </div>
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredCatalogs.map((catalog) => {
                                const categoryColor = getCategoryColor(catalog.category);
                                return (
                                    <div
                                        key={catalog.id}
                                        className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border overflow-hidden hover:border-orange-500/30 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 group cursor-pointer"
                                        onClick={() => setSelectedCatalog(catalog)}
                                    >
                                        {/* PDF Thumbnail - First Page Preview */}
                                        <div className="aspect-[4/3] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden">
                                            {catalog.thumbnail_url ? (
                                                <img
                                                    src={catalog.thumbnail_url}
                                                    alt={catalog.name}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="text-center">
                                                        <FileText size={48} className="text-orange-500/40 mx-auto mb-2" />
                                                        <span className="text-white/60 text-sm font-medium">{catalog.name}</span>
                                                    </div>
                                                </div>
                                            )}
                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setSelectedCatalog(catalog); }}
                                                        className="flex items-center gap-1 px-4 py-2 bg-white/90 text-gray-900 rounded-lg text-sm font-medium hover:bg-white transition-colors"
                                                    >
                                                        <Eye size={14} />
                                                        보기
                                                    </button>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); window.open(catalog.download_url, '_blank'); }}
                                                        className="px-3 py-2 bg-orange-500/90 text-white rounded-lg hover:bg-orange-500 transition-colors"
                                                    >
                                                        <Download size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                            {/* Category Badge */}
                                            <div className="absolute top-3 left-3">
                                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${categoryColor.bg} ${categoryColor.text} border ${categoryColor.border} backdrop-blur-sm`}>
                                                    {catalog.category}
                                                </span>
                                            </div>
                                        </div>
                                        {/* Info */}
                                        <div className="p-4">
                                            <h3 className="font-bold text-white mb-1 group-hover:text-orange-400 transition-colors text-lg">
                                                {catalog.name}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {catalog.name} 제품 카탈로그
                                            </p>
                                            {catalog.modifiedTime && (
                                                <p className="text-xs text-muted-foreground/60 mt-2">
                                                    수정: {new Date(catalog.modifiedTime).toLocaleDateString('ko-KR')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Add New Card */}
                            <div
                                onClick={openDriveFolder}
                                className="bg-card/40 backdrop-blur-sm rounded-2xl border-2 border-dashed border-border hover:border-orange-500/50 transition-all duration-300 flex flex-col items-center justify-center p-8 cursor-pointer group min-h-[280px]"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-4 group-hover:bg-orange-500/20 transition-colors">
                                    <Plus size={32} className="text-orange-400" />
                                </div>
                                <h3 className="font-bold text-white mb-1">새 카탈로그 추가</h3>
                                <p className="text-sm text-muted-foreground text-center">Google Drive에 PDF 파일을 업로드하세요</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-card rounded-xl border border-border overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-secondary/30 border-b border-border">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-muted-foreground">미리보기</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-muted-foreground">카탈로그</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-muted-foreground">시리즈</th>
                                        <th className="px-6 py-4 text-left text-sm font-bold text-muted-foreground">수정일</th>
                                        <th className="px-6 py-4 text-right text-sm font-bold text-muted-foreground">액션</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredCatalogs.map((catalog) => {
                                        const categoryColor = getCategoryColor(catalog.category);
                                        return (
                                            <tr key={catalog.id} className="hover:bg-secondary/20 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center overflow-hidden">
                                                        {catalog.thumbnail_url ? (
                                                            <img
                                                                src={catalog.thumbnail_url}
                                                                alt={catalog.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                                }}
                                                            />
                                                        ) : (
                                                            <FileText size={20} className="text-orange-400" />
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-medium text-white">{catalog.name}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${categoryColor.bg} ${categoryColor.text} border ${categoryColor.border}`}>
                                                        {catalog.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground text-sm">
                                                    {catalog.modifiedTime
                                                        ? new Date(catalog.modifiedTime).toLocaleDateString('ko-KR')
                                                        : '-'
                                                    }
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => setSelectedCatalog(catalog)}
                                                            className="p-2 text-muted-foreground hover:text-orange-400 hover:bg-orange-500/10 rounded-lg transition-colors"
                                                            title="보기"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => window.open(catalog.download_url, '_blank')}
                                                            className="p-2 text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                                            title="다운로드"
                                                        >
                                                            <Download size={16} />
                                                        </button>
                                                        <button
                                                            onClick={openDriveFolder}
                                                            className="p-2 text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                            title="Drive에서 열기"
                                                        >
                                                            <ExternalLink size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
                <>
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
                                                <Loader2 className="animate-spin mx-auto text-orange-400" size={32} />
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
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/30">
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
                                                            className="p-1.5 text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                        >
                                                            <Edit2 size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(product.id)}
                                                            className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
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
                </>
            )}

            {/* PDF Viewer Modal */}
            {selectedCatalog && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden border border-border">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-orange-500/10 to-red-500/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                                    <FileText size={20} className="text-white" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">{selectedCatalog.name}</h2>
                                    <p className="text-sm text-muted-foreground">{selectedCatalog.category} · PDF 카탈로그</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => window.open(selectedCatalog.download_url, '_blank')}
                                    className="flex items-center gap-2 px-3 py-2 text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                                >
                                    <Download size={16} />
                                    다운로드
                                </button>
                                <button
                                    onClick={openDriveFolder}
                                    className="flex items-center gap-2 px-3 py-2 text-muted-foreground hover:text-white hover:bg-secondary/50 rounded-lg transition-colors"
                                >
                                    <ExternalLink size={16} />
                                    Drive에서 열기
                                </button>
                                <button
                                    onClick={() => setSelectedCatalog(null)}
                                    className="p-2 text-muted-foreground hover:text-white hover:bg-secondary/50 rounded-lg transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        {/* PDF Embed */}
                        <div className="flex-1 bg-gray-900">
                            <iframe
                                src={selectedCatalog.view_url || `https://drive.google.com/embeddedfolderview?id=${DRIVE_FOLDER_ID}#grid`}
                                className="w-full h-full border-0"
                                title={`${selectedCatalog.name} PDF Viewer`}
                                allow="autoplay"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Product Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-border">
                        <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-orange-500/10 to-red-500/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center">
                                    {editingProduct ? <Edit2 size={20} className="text-white" /> : <Plus size={20} className="text-white" />}
                                </div>
                                <h2 className="text-lg font-bold text-white">
                                    {editingProduct ? '제품 수정' : '제품 추가'}
                                </h2>
                            </div>
                            <button onClick={handleCloseModal} className="text-muted-foreground hover:text-white p-2 hover:bg-secondary/50 rounded-lg transition-colors">
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
                                    className="w-full px-3 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">모델명</label>
                                <input
                                    type="text"
                                    value={formData.model_number}
                                    onChange={(e) => setFormData({ ...formData, model_number: e.target.value })}
                                    className="w-full px-3 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">카테고리</label>
                                    <input
                                        type="text"
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-3 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">단가</label>
                                    <input
                                        type="number"
                                        value={formData.unit_price}
                                        onChange={(e) => setFormData({ ...formData, unit_price: Number(e.target.value) })}
                                        className="w-full px-3 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-1">설명</label>
                                <textarea
                                    rows={3}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500/50 resize-none"
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2 border-t border-border">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-sm font-medium text-muted-foreground bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-red-600 rounded-lg hover:from-orange-600 hover:to-red-700 transition-all"
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
