import { useState, useEffect, useMemo } from 'react';
import { Search, RefreshCw, Loader2, ArrowUpDown, Filter, ChevronDown, ChevronUp, AlertCircle, CheckCircle, AlertTriangle, Plus, Edit2, Trash2, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CrossReference {
    id: number;
    maker: string;
    competitor_model: string;
    search_keyword: string;
    convum_model: string;
    compatibility_grade: 'A' | 'B' | 'C';
    tech_checkpoint: string;
    sales_point: string;
}

const gradeConfig = {
    A: { label: '완벽 호환', color: 'bg-green-500', textColor: 'text-green-400', bgLight: 'bg-green-500/10', icon: CheckCircle },
    B: { label: '주의 요망', color: 'bg-yellow-500', textColor: 'text-yellow-400', bgLight: 'bg-yellow-500/10', icon: AlertTriangle },
    C: { label: '개조 필요', color: 'bg-red-500', textColor: 'text-red-400', bgLight: 'bg-red-500/10', icon: AlertCircle },
};

const emptyForm: Partial<CrossReference> = {
    maker: '',
    competitor_model: '',
    search_keyword: '',
    convum_model: '',
    compatibility_grade: 'A',
    tech_checkpoint: '',
    sales_point: '',
};

export default function CrossReferenceGuide() {
    const [data, setData] = useState<CrossReference[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMaker, setSelectedMaker] = useState<string>('');
    const [selectedGrade, setSelectedGrade] = useState<string>('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof CrossReference; direction: 'asc' | 'desc' } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // CRUD State
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [formData, setFormData] = useState<Partial<CrossReference>>(emptyForm);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const { data: fetchedData, error } = await supabase
                .from('cross_references')
                .select('*')
                .order('id', { ascending: true });

            if (error) throw error;
            setData(fetchedData || []);
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    // Get unique makers for filter
    const makers = useMemo(() => {
        const unique = [...new Set(data.map(d => d.maker).filter(Boolean))];
        return unique.sort();
    }, [data]);

    // Filter and search
    const filteredData = useMemo(() => {
        let result = data;

        // Search (model or keyword)
        if (searchTerm) {
            const term = searchTerm.toLowerCase().replace(/[-/\s\.]/g, '');
            result = result.filter(d =>
                d.competitor_model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.search_keyword?.toLowerCase().includes(term) ||
                d.convum_model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                d.tech_checkpoint?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filter by maker
        if (selectedMaker) {
            result = result.filter(d => d.maker === selectedMaker);
        }

        // Filter by grade
        if (selectedGrade) {
            result = result.filter(d => d.compatibility_grade === selectedGrade);
        }

        return result;
    }, [data, searchTerm, selectedMaker, selectedGrade]);

    // Sort
    const sortedData = useMemo(() => {
        if (!sortConfig) return filteredData;
        return [...filteredData].sort((a, b) => {
            const aVal = a[sortConfig.key] || '';
            const bVal = b[sortConfig.key] || '';
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredData, sortConfig]);

    // Pagination
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleSort = (key: keyof CrossReference) => {
        setSortConfig(prev =>
            prev?.key === key
                ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
                : { key, direction: 'asc' }
        );
    };

    const SortIcon = ({ column }: { column: keyof CrossReference }) => {
        if (sortConfig?.key !== column) return <ArrowUpDown size={14} className="text-slate-500" />;
        return sortConfig.direction === 'asc'
            ? <ChevronUp size={14} className="text-cyan-400" />
            : <ChevronDown size={14} className="text-cyan-400" />;
    };

    // CRUD Handlers
    const handleCheckboxChange = (id: number) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedIds(newSet);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(new Set(paginatedData.map(d => d.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleCreate = () => {
        setFormData(emptyForm);
        setIsEditMode(false);
        setIsModalOpen(true);
        setIsMenuOpen(false);
    };

    const handleEdit = (item?: CrossReference) => {
        if (item) {
            setFormData(item);
        } else if (selectedIds.size === 1) {
            const id = Array.from(selectedIds)[0];
            const found = data.find(d => d.id === id);
            if (found) setFormData(found);
        } else {
            alert('수정할 항목을 하나만 선택해주세요.');
            return;
        }
        setIsEditMode(true);
        setIsModalOpen(true);
        setIsMenuOpen(false);
    };

    const handleDelete = async (id?: number) => {
        const idsToDelete = id ? [id] : Array.from(selectedIds);
        if (idsToDelete.length === 0) {
            alert('삭제할 항목을 선택해주세요.');
            return;
        }
        if (!confirm(`${idsToDelete.length}개의 항목을 삭제하시겠습니까?`)) return;

        try {
            const { error } = await supabase
                .from('cross_references')
                .delete()
                .in('id', idsToDelete);

            if (error) throw error;
            await fetchData();
            setSelectedIds(new Set());
            setIsMenuOpen(false);
            alert('삭제되었습니다.');
        } catch (err: any) {
            console.error('Error deleting:', err);
            alert('삭제 중 오류가 발생했습니다: ' + err.message);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                maker: formData.maker,
                competitor_model: formData.competitor_model,
                search_keyword: formData.search_keyword,
                convum_model: formData.convum_model,
                compatibility_grade: formData.compatibility_grade,
                tech_checkpoint: formData.tech_checkpoint,
                sales_point: formData.sales_point,
            };

            if (isEditMode && formData.id) {
                const { error } = await supabase
                    .from('cross_references')
                    .update(payload)
                    .eq('id', formData.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('cross_references')
                    .insert([payload]);
                if (error) throw error;
            }

            await fetchData();
            setIsModalOpen(false);
            setFormData(emptyForm);
            alert('저장되었습니다.');
        } catch (err: any) {
            console.error('Error saving:', err);
            alert('저장 중 오류가 발생했습니다: ' + err.message);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">경쟁사 치환 가이드</h1>
                    <p className="text-muted-foreground mt-1">SMC, 브이메카, 피스코 등 타사 제품 → CONVUM 제품 치환 정보</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchData}
                        className="p-2 text-muted-foreground hover:text-white hover:bg-secondary/50 rounded-lg transition-colors"
                        title="새로고침"
                    >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium hover:bg-cyan-500 transition-colors shadow-lg"
                        >
                            기능
                            <ChevronDown size={16} />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border py-1 z-10">
                                <button
                                    onClick={handleCreate}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-muted-foreground hover:bg-secondary/30"
                                >
                                    <Plus size={16} />
                                    새로 만들기
                                </button>
                                <button
                                    onClick={() => handleEdit()}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-muted-foreground hover:bg-secondary/30"
                                >
                                    <Edit2 size={16} />
                                    수정
                                </button>
                                <button
                                    onClick={() => handleDelete()}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                                >
                                    <Trash2 size={16} />
                                    삭제
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card rounded-xl border border-border p-4">
                    <p className="text-sm text-muted-foreground">전체 데이터</p>
                    <p className="text-2xl font-bold text-white mt-1">{data.length}</p>
                </div>
                <div className="bg-card rounded-xl border border-border p-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <p className="text-sm text-muted-foreground">Grade A (완벽 호환)</p>
                    </div>
                    <p className="text-2xl font-bold text-green-400 mt-1">{data.filter(d => d.compatibility_grade === 'A').length}</p>
                </div>
                <div className="bg-card rounded-xl border border-border p-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <p className="text-sm text-muted-foreground">Grade B (주의 요망)</p>
                    </div>
                    <p className="text-2xl font-bold text-yellow-400 mt-1">{data.filter(d => d.compatibility_grade === 'B').length}</p>
                </div>
                <div className="bg-card rounded-xl border border-border p-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <p className="text-sm text-muted-foreground">Grade C (개조 필요)</p>
                    </div>
                    <p className="text-2xl font-bold text-red-400 mt-1">{data.filter(d => d.compatibility_grade === 'C').length}</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-card rounded-xl border border-border p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <input
                            type="text"
                            placeholder="타사 모델명, CONVUM 모델명, 기술 체크포인트 검색..."
                            className="w-full pl-10 pr-4 py-2.5 bg-secondary text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                            value={searchTerm}
                            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                        />
                    </div>

                    {/* Maker Filter */}
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-muted-foreground" />
                        <select
                            className="bg-secondary text-white border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={selectedMaker}
                            onChange={(e) => { setSelectedMaker(e.target.value); setCurrentPage(1); }}
                        >
                            <option value="">모든 제조사</option>
                            {makers.map(maker => (
                                <option key={maker} value={maker}>{maker}</option>
                            ))}
                        </select>
                    </div>

                    {/* Grade Filter */}
                    <select
                        className="bg-secondary text-white border border-border rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20"
                        value={selectedGrade}
                        onChange={(e) => { setSelectedGrade(e.target.value); setCurrentPage(1); }}
                    >
                        <option value="">모든 등급</option>
                        <option value="A">A - 완벽 호환</option>
                        <option value="B">B - 주의 요망</option>
                        <option value="C">C - 개조 필요</option>
                    </select>
                </div>

                <p className="text-sm text-muted-foreground mt-3">
                    검색결과: <span className="text-white font-medium">{filteredData.length}</span>건
                    {selectedIds.size > 0 && (
                        <span className="ml-4 text-cyan-400">선택됨: {selectedIds.size}개</span>
                    )}
                </p>
            </div>

            {/* Table */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-secondary/50 border-b border-border">
                            <tr>
                                <th className="px-4 py-3 w-10">
                                    <input
                                        type="checkbox"
                                        onChange={handleSelectAll}
                                        checked={paginatedData.length > 0 && selectedIds.size === paginatedData.length}
                                        className="w-4 h-4 rounded border-border text-cyan-500 focus:ring-cyan-500 cursor-pointer"
                                    />
                                </th>
                                <th className="px-4 py-3 font-semibold text-muted-foreground cursor-pointer hover:bg-secondary/70" onClick={() => handleSort('maker')}>
                                    <div className="flex items-center gap-1">Maker <SortIcon column="maker" /></div>
                                </th>
                                <th className="px-4 py-3 font-semibold text-muted-foreground cursor-pointer hover:bg-secondary/70" onClick={() => handleSort('competitor_model')}>
                                    <div className="flex items-center gap-1">타사 모델 <SortIcon column="competitor_model" /></div>
                                </th>
                                <th className="px-4 py-3 font-semibold text-muted-foreground cursor-pointer hover:bg-secondary/70" onClick={() => handleSort('convum_model')}>
                                    <div className="flex items-center gap-1">CONVUM 대응 모델 <SortIcon column="convum_model" /></div>
                                </th>
                                <th className="px-4 py-3 font-semibold text-muted-foreground text-center cursor-pointer hover:bg-secondary/70" onClick={() => handleSort('compatibility_grade')}>
                                    <div className="flex items-center justify-center gap-1">등급 <SortIcon column="compatibility_grade" /></div>
                                </th>
                                <th className="px-4 py-3 font-semibold text-muted-foreground">기술 체크포인트</th>
                                <th className="px-4 py-3 w-20"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {paginatedData.map((row) => {
                                const grade = gradeConfig[row.compatibility_grade] || gradeConfig.A;
                                const GradeIcon = grade.icon;
                                return (
                                    <tr key={row.id} className="hover:bg-secondary/30 transition-colors group">
                                        <td className="px-4 py-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(row.id)}
                                                onChange={() => handleCheckboxChange(row.id)}
                                                className="w-4 h-4 rounded border-border text-cyan-500 focus:ring-cyan-500 cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 bg-slate-700 rounded text-xs font-medium text-slate-300">
                                                {row.maker || '-'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-mono text-white">{row.competitor_model || '-'}</td>
                                        <td className="px-4 py-3 font-mono text-cyan-400 font-medium">{row.convum_model || '-'}</td>
                                        <td className="px-4 py-3 text-center">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${grade.bgLight}`}>
                                                <GradeIcon size={14} className={grade.textColor} />
                                                <span className={`text-xs font-bold ${grade.textColor}`}>{row.compatibility_grade}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground max-w-xs truncate" title={row.tech_checkpoint}>
                                            {row.tech_checkpoint || '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEdit(row)}
                                                    className="p-1.5 text-muted-foreground hover:text-cyan-400 hover:bg-cyan-500/10 rounded"
                                                    title="수정"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(row.id)}
                                                    className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded"
                                                    title="삭제"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-4 py-3 border-t border-border flex items-center justify-between bg-secondary/30">
                    <span className="text-sm text-muted-foreground">
                        {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, sortedData.length)} / {sortedData.length}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 border border-border rounded text-sm hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            이전
                        </button>
                        <span className="text-sm text-muted-foreground">{currentPage} / {totalPages || 1}</span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage >= totalPages}
                            className="px-3 py-1 border border-border rounded text-sm hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            다음
                        </button>
                    </div>
                </div>
            </div>

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-xl font-semibold text-white">
                                {isEditMode ? '치환 정보 수정' : '새 치환 정보 등록'}
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-muted-foreground hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave}>
                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">제조사 (Maker)</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-2 bg-secondary text-white border border-border rounded text-sm"
                                        value={formData.maker || ''}
                                        onChange={e => setFormData({ ...formData, maker: e.target.value })}
                                        placeholder="예: SMC, VMECA, PISCO"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">타사 모델명</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-2 bg-secondary text-white border border-border rounded text-sm"
                                        value={formData.competitor_model || ''}
                                        onChange={e => setFormData({ ...formData, competitor_model: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">검색 키워드</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 bg-secondary text-white border border-border rounded text-sm"
                                        value={formData.search_keyword || ''}
                                        onChange={e => setFormData({ ...formData, search_keyword: e.target.value })}
                                        placeholder="검색용 별칭/키워드"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">CONVUM 대응 모델</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-2 bg-secondary text-white border border-border rounded text-sm"
                                        value={formData.convum_model || ''}
                                        onChange={e => setFormData({ ...formData, convum_model: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">호환 등급</label>
                                    <select
                                        className="w-full p-2 bg-secondary text-white border border-border rounded text-sm"
                                        value={formData.compatibility_grade || 'A'}
                                        onChange={e => setFormData({ ...formData, compatibility_grade: e.target.value as 'A' | 'B' | 'C' })}
                                    >
                                        <option value="A">A - 완벽 호환</option>
                                        <option value="B">B - 주의 요망</option>
                                        <option value="C">C - 개조 필요</option>
                                    </select>
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">기술 체크포인트</label>
                                    <textarea
                                        className="w-full p-2 bg-secondary text-white border border-border rounded text-sm"
                                        rows={2}
                                        value={formData.tech_checkpoint || ''}
                                        onChange={e => setFormData({ ...formData, tech_checkpoint: e.target.value })}
                                        placeholder="치환 시 주의사항, 기술적 차이점 등"
                                    />
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">영업 포인트</label>
                                    <textarea
                                        className="w-full p-2 bg-secondary text-white border border-border rounded text-sm"
                                        rows={2}
                                        value={formData.sales_point || ''}
                                        onChange={e => setFormData({ ...formData, sales_point: e.target.value })}
                                        placeholder="고객에게 어필할 포인트"
                                    />
                                </div>
                            </div>
                            <div className="p-4 bg-secondary/30 border-t border-border flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/30 transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors"
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
