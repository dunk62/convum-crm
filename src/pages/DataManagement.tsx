import { useState, useEffect } from 'react';
import { Database, Phone, Users, Mail, Plus, Search, Trash2, Edit2, X, Save } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface DataRecord {
    id: string;
    type: 'call' | 'meeting' | 'email';
    title: string;
    content: string;
    created_at: string;
    company_name?: string;
    contact_name?: string;
    summary?: string;
    sentiment_score?: number;
    keywords?: string[];
    next_action?: string[];
    recording_link?: string;
}

const RECORD_TYPES = [
    { id: 'call', label: '통화 녹음', icon: Phone },
    { id: 'meeting', label: '미팅 녹음', icon: Users },
    { id: 'email', label: '이메일', icon: Mail },
] as const;

export default function DataManagement() {
    const [records, setRecords] = useState<DataRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<'all' | 'call' | 'meeting' | 'email'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingRecord, setEditingRecord] = useState<DataRecord | null>(null);

    // Form States
    const [formData, setFormData] = useState<{
        type: 'call' | 'meeting' | 'email';
        title: string;
        content: string;
        company_name: string;
        contact_name: string;
        summary: string;
        sentiment_score: number;
        keywords: string | string[];
        next_action: string | string[];
    }>({
        type: 'call',
        title: '',
        content: '',
        company_name: '',
        contact_name: '',
        summary: '',
        sentiment_score: 0,
        keywords: '',
        next_action: ''
    });

    useEffect(() => {
        fetchRecords();

        const subscription = supabase
            .channel('data_records_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'data_records' }, (payload) => {
                if (payload.eventType === 'INSERT') {
                    setRecords((prev) => [payload.new as DataRecord, ...prev]);
                } else if (payload.eventType === 'UPDATE') {
                    setRecords((prev) => prev.map((record) => (record.id === payload.new.id ? (payload.new as DataRecord) : record)));
                } else if (payload.eventType === 'DELETE') {
                    setRecords((prev) => prev.filter((record) => record.id !== payload.old.id));
                }
            })
            .subscribe();

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('data_records')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRecords(data || []);
        } catch (error) {
            console.error('Error fetching records:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddRecord = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase
                .from('data_records')
                .insert([{
                    type: formData.type,
                    title: formData.title,
                    content: formData.content,
                    company_name: formData.company_name,
                    contact_name: formData.contact_name,
                    summary: formData.summary,
                    sentiment_score: formData.sentiment_score,
                    keywords: typeof formData.keywords === 'string' ? formData.keywords.split(',').map(k => k.trim()).filter(k => k) : formData.keywords,
                    next_action: typeof formData.next_action === 'string' ? formData.next_action.split(',').map(k => k.trim()).filter(k => k) : formData.next_action
                }])
                .select()
                .single();

            if (error) throw error;

            setRecords([data, ...records]);
            setIsAddModalOpen(false);
            resetForm();
        } catch (error) {
            console.error('Error adding record:', error);
            alert('기록 추가 중 오류가 발생했습니다.');
        }
    };

    const handleUpdateRecord = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRecord) return;

        try {
            const updates = {
                type: formData.type,
                title: formData.title,
                content: formData.content,
                company_name: formData.company_name,
                contact_name: formData.contact_name,
                summary: formData.summary,
                sentiment_score: formData.sentiment_score,
                keywords: typeof formData.keywords === 'string' ? formData.keywords.split(',').map(k => k.trim()).filter(k => k) : formData.keywords,
                next_action: typeof formData.next_action === 'string' ? formData.next_action.split(',').map(k => k.trim()).filter(k => k) : formData.next_action
            };

            const { data, error } = await supabase
                .from('data_records')
                .update(updates)
                .eq('id', editingRecord.id)
                .select()
                .single();

            if (error) throw error;

            setRecords(records.map(r => r.id === editingRecord.id ? data : r));
            setIsEditModalOpen(false);
            setEditingRecord(null);
            resetForm();
        } catch (error) {
            console.error('Error updating record:', error);
            alert('기록 수정 중 오류가 발생했습니다.');
        }
    };

    const handleDeleteRecord = async (id: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;

        try {
            const { error } = await supabase
                .from('data_records')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setRecords(records.filter(r => r.id !== id));
        } catch (error) {
            console.error('Error deleting record:', error);
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

    const openEditModal = (record: DataRecord) => {
        setEditingRecord(record);
        setFormData({
            type: record.type,
            title: record.title,
            content: record.content,
            company_name: record.company_name || '',
            contact_name: record.contact_name || '',
            summary: record.summary || '',
            sentiment_score: record.sentiment_score || 0,
            keywords: record.keywords ? record.keywords.join(', ') : '',
            next_action: record.next_action ? record.next_action.join(', ') : ''
        });
        setIsEditModalOpen(true);
    };

    const resetForm = () => {
        setFormData({
            type: 'call',
            title: '',
            content: '',
            company_name: '',
            contact_name: '',
            summary: '',
            sentiment_score: 0,
            keywords: '',
            next_action: ''
        });
    };

    const getTypeIcon = (type: string) => {
        const config = RECORD_TYPES.find(t => t.id === type);
        const Icon = config?.icon || Database;
        return <Icon size={16} />;
    };

    const getTypeLabel = (type: string) => {
        return RECORD_TYPES.find(t => t.id === type)?.label || type;
    };

    const filteredRecords = records.filter(record => {
        const matchesType = filterType === 'all' || record.type === filterType;
        const matchesSearch = (record.title?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
            (record.content?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
            (record.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
            (record.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) || '');
        return matchesType && matchesSearch;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">데이터 관리</h1>
                <button
                    onClick={() => { resetForm(); setIsAddModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    기록 추가
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setFilterType('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === 'all'
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Database size={16} />
                            전체
                        </div>
                    </button>
                    {RECORD_TYPES.map(type => (
                        <button
                            key={type.id}
                            onClick={() => setFilterType(type.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filterType === type.id
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <type.icon size={16} />
                                {type.label}
                            </div>
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            {/* Table View */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 font-medium whitespace-nowrap">일자</th>
                                <th className="px-6 py-3 font-medium whitespace-nowrap">업체명</th>
                                <th className="px-6 py-3 font-medium whitespace-nowrap">담당자명</th>
                                <th className="px-6 py-3 font-medium whitespace-nowrap">유형</th>
                                <th className="px-6 py-3 font-medium min-w-[300px]">핵심 요약</th>
                                <th className="px-6 py-3 font-medium whitespace-nowrap">감정/태도</th>
                                <th className="px-6 py-3 font-medium whitespace-nowrap">주요 키워드</th>
                                <th className="px-6 py-3 font-medium whitespace-nowrap">Next Action</th>
                                <th className="px-6 py-3 font-medium whitespace-nowrap">전체 내용</th>
                                <th className="px-6 py-3 font-medium whitespace-nowrap text-right">관리</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {loading ? (
                                <tr>
                                    <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                                        로딩 중...
                                    </td>
                                </tr>
                            ) : filteredRecords.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Database className="h-8 w-8 text-gray-300" />
                                            <p>등록된 기록이 없습니다.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredRecords.map((record) => (
                                    <tr key={record.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                            {new Date(record.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                            {record.company_name || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                                            {record.contact_name || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                {getTypeIcon(record.type)}
                                                <span className="text-gray-600">{getTypeLabel(record.type)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-700">
                                            <p className="line-clamp-2" title={record.summary || record.content}>
                                                {record.summary || record.content}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {record.sentiment_score !== undefined && record.sentiment_score !== null ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${record.sentiment_score >= 70 ? 'bg-green-500' :
                                                                record.sentiment_score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                                                                }`}
                                                            style={{ width: `${record.sentiment_score}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs font-medium text-gray-600">{record.sentiment_score}점</span>
                                                </div>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {record.keywords && record.keywords.length > 0 ? (
                                                    record.keywords.slice(0, 3).map((keyword, idx) => (
                                                        <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                                                            {keyword}
                                                        </span>
                                                    ))
                                                ) : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                {record.next_action && record.next_action.length > 0 ? (
                                                    record.next_action.slice(0, 2).map((action, idx) => (
                                                        <span key={idx} className="flex items-center gap-1 text-xs text-blue-600">
                                                            <span className="w-1 h-1 bg-blue-600 rounded-full" />
                                                            {action}
                                                        </span>
                                                    ))
                                                ) : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {record.recording_link ? (
                                                <a
                                                    href={record.recording_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline text-xs"
                                                >
                                                    Link
                                                </a>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => openEditModal(record)}
                                                    className="text-gray-400 hover:text-blue-500 p-1.5 hover:bg-blue-50 rounded-full transition-colors"
                                                    title="수정"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteRecord(record.id)}
                                                    className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-full transition-colors"
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

            {/* Add/Edit Modal */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">
                                {isEditModalOpen ? '기록 수정' : '새 기록 추가'}
                            </h2>
                            <button
                                onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={isEditModalOpen ? handleUpdateRecord : handleAddRecord} className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        유형
                                    </label>
                                    <div className="flex gap-2">
                                        {RECORD_TYPES.map(type => (
                                            <button
                                                key={type.id}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, type: type.id })}
                                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium border transition-colors ${formData.type === type.id
                                                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                                                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {type.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        감정 점수 (0-100)
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.sentiment_score}
                                        onChange={(e) => setFormData({ ...formData, sentiment_score: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        업체명
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.company_name}
                                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="업체명 입력"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        담당자명
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.contact_name}
                                        onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="담당자명 입력"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    제목
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="기록 제목을 입력하세요"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    핵심 요약
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.summary}
                                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    placeholder="대화 내용 요약"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    전체 내용
                                </label>
                                <textarea
                                    rows={6}
                                    required
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    placeholder="상세 내용을 입력하세요"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        주요 키워드 (쉼표로 구분)
                                    </label>
                                    <input
                                        type="text"
                                        value={Array.isArray(formData.keywords) ? formData.keywords.join(', ') : formData.keywords}
                                        onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="예: 가격, 일정, 기능"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Next Action (쉼표로 구분)
                                    </label>
                                    <input
                                        type="text"
                                        value={Array.isArray(formData.next_action) ? formData.next_action.join(', ') : formData.next_action}
                                        onChange={(e) => setFormData({ ...formData, next_action: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="예: 견적서 송부, 미팅 요청"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                                    className="px-5 py-2.5 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    {isEditModalOpen ? '수정 완료' : '저장하기'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
