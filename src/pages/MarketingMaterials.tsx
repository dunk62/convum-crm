import { useState, useEffect, useCallback } from 'react';
import { Search, FileText, Send, Eye, Loader2, CheckCircle, X, Mail, RefreshCw, Sparkles } from 'lucide-react';

// Marketing material interface
interface MarketingMaterial {
    id: string;
    name: string;
    cleanName: string;
    fileId: string;
    category: string;
    thumbnailUrl?: string;
    viewUrl: string;
    modifiedTime?: string;
}

// Category interface
interface Category {
    id: string;
    name: string;
    fileCount: number;
}

// Root folder ID
const ROOT_FOLDER_ID = '1RqbKXjoS37iDmXDnN_UJHqnCB3AVjeWN';

export default function MarketingMaterials() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [materials, setMaterials] = useState<MarketingMaterial[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMaterials, setSelectedMaterials] = useState<Set<string>>(new Set());
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [lastSynced, setLastSynced] = useState<Date | null>(null);

    // Clean file name - remove special characters and extension
    const cleanFileName = (filename: string): string => {
        return filename
            .replace(/\.(pdf|PDF)$/i, '') // Remove .pdf extension
            .replace(/^[-_\[\]]+|[-_\[\]]+$/g, '') // Remove leading/trailing special chars
            .replace(/[-_]{2,}/g, ' ') // Replace multiple dashes/underscores with space
            .replace(/\[|\]/g, '') // Remove brackets
            .replace(/---+/g, ' ') // Replace multiple dashes with space
            .trim();
    };

    // Fetch categories (subfolders) and materials
    const fetchMaterials = useCallback(async () => {
        setIsLoading(true);

        try {
            const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

            if (!GOOGLE_API_KEY) {
                throw new Error('Google API 키가 설정되지 않았습니다.');
            }

            // 1. Get subfolders (categories)
            const foldersQuery = `'${ROOT_FOLDER_ID}' in parents and mimeType='application/vnd.google-apps.folder'`;
            const foldersResponse = await fetch(
                `https://www.googleapis.com/drive/v3/files?` +
                `q=${encodeURIComponent(foldersQuery)}` +
                `&fields=files(id,name)` +
                `&key=${GOOGLE_API_KEY}`
            );

            const foldersData = await foldersResponse.json();
            const subfolders = foldersData.files || [];

            // 2. Get files from root folder (PDFs only)
            const rootFilesQuery = `'${ROOT_FOLDER_ID}' in parents and mimeType='application/pdf'`;
            const rootFilesResponse = await fetch(
                `https://www.googleapis.com/drive/v3/files?` +
                `q=${encodeURIComponent(rootFilesQuery)}` +
                `&fields=files(id,name,thumbnailLink,modifiedTime)` +
                `&pageSize=100` +
                `&key=${GOOGLE_API_KEY}`
            );

            const rootFilesData = await rootFilesResponse.json();
            const rootFiles = (rootFilesData.files || []).map((file: any) => ({
                id: file.id,
                name: file.name,
                cleanName: cleanFileName(file.name),
                fileId: file.id,
                category: '전체',
                thumbnailUrl: file.thumbnailLink,
                viewUrl: `https://drive.google.com/file/d/${file.id}/view`,
                modifiedTime: file.modifiedTime
            }));

            // 3. Get files from each subfolder
            const allMaterials: MarketingMaterial[] = [...rootFiles];
            const categoryList: Category[] = [];

            for (const folder of subfolders) {
                const filesQuery = `'${folder.id}' in parents and mimeType='application/pdf'`;
                const filesResponse = await fetch(
                    `https://www.googleapis.com/drive/v3/files?` +
                    `q=${encodeURIComponent(filesQuery)}` +
                    `&fields=files(id,name,thumbnailLink,modifiedTime)` +
                    `&pageSize=100` +
                    `&key=${GOOGLE_API_KEY}`
                );

                const filesData = await filesResponse.json();
                const files = filesData.files || [];

                categoryList.push({
                    id: folder.id,
                    name: folder.name,
                    fileCount: files.length
                });

                files.forEach((file: any) => {
                    allMaterials.push({
                        id: file.id,
                        name: file.name,
                        cleanName: cleanFileName(file.name),
                        fileId: file.id,
                        category: folder.name,
                        thumbnailUrl: file.thumbnailLink,
                        viewUrl: `https://drive.google.com/file/d/${file.id}/view`,
                        modifiedTime: file.modifiedTime
                    });
                });
            }

            setCategories(categoryList);
            setMaterials(allMaterials);
            setLastSynced(new Date());

        } catch (error) {
            console.error('Failed to fetch materials:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMaterials();
    }, [fetchMaterials]);

    // Filter materials
    const filteredMaterials = materials.filter(m => {
        const matchesCategory = activeCategory === 'all' || m.category === activeCategory;
        const matchesSearch = m.cleanName.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Toggle material selection
    const toggleSelection = (materialId: string) => {
        setSelectedMaterials(prev => {
            const newSet = new Set(prev);
            if (newSet.has(materialId)) {
                newSet.delete(materialId);
            } else {
                newSet.add(materialId);
            }
            return newSet;
        });
    };

    // Select all visible materials
    const selectAll = () => {
        if (selectedMaterials.size === filteredMaterials.length) {
            setSelectedMaterials(new Set());
        } else {
            setSelectedMaterials(new Set(filteredMaterials.map(m => m.id)));
        }
    };

    // Clear selection
    const clearSelection = () => {
        setSelectedMaterials(new Set());
    };

    // Open email modal
    const openEmailModal = () => {
        if (selectedMaterials.size === 0) {
            alert('발송할 자료를 선택해 주세요.');
            return;
        }
        setIsEmailModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                            <Sparkles size={20} className="text-white" />
                        </div>
                        마케팅 자료실
                    </h1>
                    <p className="text-muted-foreground mt-1">제품 카탈로그와 기술 자료를 고객에게 배포합니다.</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchMaterials}
                        disabled={isLoading}
                        className="px-4 py-2.5 bg-secondary/50 text-muted-foreground rounded-lg hover:bg-secondary hover:text-white transition-colors flex items-center gap-2"
                    >
                        <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                        동기화
                    </button>
                    {selectedMaterials.size > 0 && (
                        <button
                            onClick={openEmailModal}
                            className="px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all shadow-lg flex items-center gap-2"
                        >
                            <Send size={16} />
                            선택한 자료 보내기 ({selectedMaterials.size})
                        </button>
                    )}
                </div>
            </div>

            {/* Sync Status */}
            {lastSynced && (
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-4 flex items-center gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm">
                            <CheckCircle size={16} className="text-green-400" />
                            <span className="text-green-400 font-medium">Google Drive 연동됨</span>
                            <span className="text-muted-foreground">
                                · 마지막 동기화: {lastSynced.toLocaleTimeString('ko-KR')}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            총 {materials.length}개 자료 | {categories.length}개 카테고리
                        </p>
                    </div>
                </div>
            )}

            {/* Category Tabs + Search */}
            <div className="bg-card/80 backdrop-blur-sm p-4 rounded-xl border border-border">
                <div className="flex flex-wrap items-center gap-4 mb-4">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="자료 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                    </div>

                    {/* Selection controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={selectAll}
                            className="px-3 py-2 text-sm bg-secondary/50 text-muted-foreground rounded-lg hover:bg-secondary hover:text-white transition-colors"
                        >
                            {selectedMaterials.size === filteredMaterials.length && filteredMaterials.length > 0 ? '전체 해제' : '전체 선택'}
                        </button>
                        {selectedMaterials.size > 0 && (
                            <button
                                onClick={clearSelection}
                                className="px-3 py-2 text-sm bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                            >
                                선택 취소
                            </button>
                        )}
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setActiveCategory('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === 'all'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : 'bg-secondary/50 text-muted-foreground hover:text-white'
                            }`}
                    >
                        전체 ({materials.length})
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.name)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat.name
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                : 'bg-secondary/50 text-muted-foreground hover:text-white'
                                }`}
                        >
                            {cat.name} ({cat.fileCount})
                        </button>
                    ))}
                </div>
            </div>

            {/* Materials Grid */}
            {isLoading ? (
                <div className="bg-card rounded-xl border border-border p-12 text-center">
                    <Loader2 className="animate-spin mx-auto text-purple-400" size={40} />
                    <p className="text-muted-foreground mt-4">Google Drive에서 자료를 불러오는 중...</p>
                </div>
            ) : filteredMaterials.length === 0 ? (
                <div className="bg-card rounded-xl border border-border p-12 text-center">
                    <FileText className="mx-auto text-muted-foreground/30" size={48} />
                    <p className="text-muted-foreground mt-4">자료가 없습니다.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredMaterials.map((material) => {
                        const isSelected = selectedMaterials.has(material.id);
                        return (
                            <div
                                key={material.id}
                                className={`bg-card/80 backdrop-blur-sm rounded-xl border overflow-hidden transition-all ${isSelected
                                    ? 'border-purple-500 ring-2 ring-purple-500/30'
                                    : 'border-border hover:border-purple-500/50'
                                    }`}
                            >
                                {/* Thumbnail */}
                                <div
                                    className="aspect-[4/3] relative cursor-pointer overflow-hidden"
                                    onClick={() => toggleSelection(material.id)}
                                >
                                    {/* Selection Checkbox */}
                                    <div className={`absolute top-3 right-3 z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all ${isSelected
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-black/50 border-2 border-white/50'
                                        }`}>
                                        {isSelected && <CheckCircle size={16} />}
                                    </div>

                                    {/* Background with gradient based on category */}
                                    <div className={`absolute inset-0 ${material.category === 'RA PAD' ? 'bg-gradient-to-br from-amber-600/30 to-amber-900/50' :
                                            material.category === 'COP PAD' ? 'bg-gradient-to-br from-rose-600/30 to-rose-900/50' :
                                                material.category === 'PJG PAD' || material.category === 'PJG패드' ? 'bg-gradient-to-br from-cyan-600/30 to-cyan-900/50' :
                                                    material.category === 'SM 패드' || material.category === 'SM PAD' ? 'bg-gradient-to-br from-violet-600/30 to-violet-900/50' :
                                                        'bg-gradient-to-br from-purple-600/30 to-slate-900/70'
                                        }`} />

                                    {/* Content */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                                        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-3">
                                            <FileText size={32} className="text-white/80" />
                                        </div>
                                        <span className="text-white/90 text-sm font-medium text-center line-clamp-2 px-2">
                                            {material.cleanName}
                                        </span>
                                        <span className="text-white/50 text-xs mt-2">PDF</span>
                                    </div>

                                    {/* Thumbnail image overlay if available */}
                                    {material.thumbnailUrl && (
                                        <img
                                            src={material.thumbnailUrl}
                                            alt={material.cleanName}
                                            className="absolute inset-0 w-full h-full object-cover opacity-90"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                            }}
                                        />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-4">
                                    <p className="text-sm font-medium text-white line-clamp-2 mb-2">{material.cleanName}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground px-2 py-1 bg-secondary/50 rounded">
                                            {material.category}
                                        </span>
                                        <button
                                            onClick={() => window.open(material.viewUrl, '_blank')}
                                            className="p-2 text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors flex items-center gap-1 text-sm"
                                        >
                                            <Eye size={14} />
                                            미리보기
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Email Modal */}
            {isEmailModalOpen && (
                <MaterialsEmailModal
                    selectedMaterials={materials.filter(m => selectedMaterials.has(m.id))}
                    onClose={() => setIsEmailModalOpen(false)}
                    onSuccess={() => {
                        setIsEmailModalOpen(false);
                        setSelectedMaterials(new Set());
                    }}
                />
            )}
        </div>
    );
}

// Email Modal Component
interface MaterialsEmailModalProps {
    selectedMaterials: MarketingMaterial[];
    onClose: () => void;
    onSuccess: () => void;
}

function MaterialsEmailModal({ selectedMaterials, onClose, onSuccess }: MaterialsEmailModalProps) {
    const [recipientEmail, setRecipientEmail] = useState('');
    const [emailSubject, setEmailSubject] = useState('요청하신 자료 링크 안내');
    const [additionalMessage, setAdditionalMessage] = useState('안녕하세요,\n\n요청하신 자료 링크를 보내드립니다.\n아래 링크를 클릭하시면 바로 열람하실 수 있습니다.');
    const [isSending, setIsSending] = useState(false);

    // Generate email body
    const generateEmailBody = () => {
        let body = additionalMessage + '\n\n';
        body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        body += `📚 마케팅 자료 (${selectedMaterials.length}건)\n`;
        body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

        selectedMaterials.forEach((material) => {
            body += `📘 [${material.cleanName}]\n`;
            body += `   ${material.viewUrl}\n\n`;
        });

        body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        body += '문의사항이 있으시면 언제든 연락주세요.\n감사합니다.';

        return body;
    };

    // Send email
    const sendEmail = async () => {
        if (!recipientEmail.trim()) {
            alert('받는 사람 이메일을 입력해 주세요.');
            return;
        }

        setIsSending(true);

        try {
            const body = generateEmailBody();

            const response = await fetch('/api/send-drawing-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: recipientEmail,
                    subject: emailSubject,
                    body: body,
                    modelNo: '마케팅자료',
                    fileCount: selectedMaterials.length
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(`✅ 마케팅 자료(${selectedMaterials.length}건)가 ${recipientEmail}로 발송되었습니다!`);
                onSuccess();
            } else {
                throw new Error(result.error || '이메일 발송에 실패했습니다.');
            }
        } catch (error: any) {
            console.error('Email send error:', error);
            alert(`❌ 이메일 발송 실패: ${error.message}`);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                            <Mail size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">마케팅 자료 발송</h2>
                            <p className="text-sm text-muted-foreground">{selectedMaterials.length}건 선택됨</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-muted-foreground hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto flex-1 space-y-4">
                    {/* Recipient */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">받는 사람 *</label>
                        <input
                            type="email"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            placeholder="customer@example.com"
                            className="w-full px-4 py-3 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">제목</label>
                        <input
                            type="text"
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            className="w-full px-4 py-3 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">인사말</label>
                        <textarea
                            value={additionalMessage}
                            onChange={(e) => setAdditionalMessage(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                        />
                    </div>

                    {/* Selected Materials Preview */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">선택한 자료</label>
                        <div className="bg-secondary/30 rounded-lg p-4 space-y-2 max-h-40 overflow-y-auto">
                            {selectedMaterials.map((material) => (
                                <div key={material.id} className="flex items-center gap-3 text-sm">
                                    <FileText size={16} className="text-purple-400" />
                                    <span className="text-white truncate">{material.cleanName}</span>
                                    <span className="text-xs text-muted-foreground ml-auto">{material.category}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-border flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-secondary/50 text-muted-foreground rounded-lg hover:bg-secondary hover:text-white transition-colors"
                    >
                        취소
                    </button>
                    <button
                        onClick={sendEmail}
                        disabled={isSending}
                        className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSending ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                발송 중...
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                메일 발송
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
