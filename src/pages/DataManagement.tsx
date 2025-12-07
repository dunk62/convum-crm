import { useState, useEffect } from 'react';
import { Database, Phone, Users, Mail, Plus, Search, Trash2, Edit2, X, Save, RefreshCw, Loader2, FileText, TrendingUp, Calendar, Building2, User, Hash, Sparkles, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
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
    { id: 'call', label: '통화 녹음', icon: Phone, color: 'from-emerald-500 to-teal-600', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-400', borderColor: 'border-emerald-500/30' },
    { id: 'meeting', label: '미팅 녹음', icon: Users, color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-500/10', textColor: 'text-blue-400', borderColor: 'border-blue-500/30' },
    { id: 'email', label: '이메일', icon: Mail, color: 'from-purple-500 to-violet-600', bgColor: 'bg-purple-500/10', textColor: 'text-purple-400', borderColor: 'border-purple-500/30' },
] as const;

export default function DataManagement() {
    const [records, setRecords] = useState<DataRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState<'all' | 'call' | 'meeting' | 'email'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

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

    const getTypeConfig = (type: string) => {
        return RECORD_TYPES.find(t => t.id === type) || RECORD_TYPES[0];
    };

    const filteredRecords = records.filter(record => {
        const matchesType = filterType === 'all' || record.type === filterType;
        const matchesSearch = (record.title?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
            (record.content?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
            (record.company_name?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
            (record.contact_name?.toLowerCase().includes(searchQuery.toLowerCase()) || '');
        return matchesType && matchesSearch;
    });

    // Summary Stats
    const stats = {
        total: records.length,
        calls: records.filter(r => r.type === 'call').length,
        meetings: records.filter(r => r.type === 'meeting').length,
        emails: records.filter(r => r.type === 'email').length,
        avgSentiment: records.length > 0 ? Math.round(records.reduce((sum, r) => sum + (r.sentiment_score || 0), 0) / records.length) : 0
    };

    const getSentimentColor = (score: number) => {
        if (score >= 70) return { bg: 'bg-emerald-500', text: 'text-emerald-400', label: '긍정적' };
        if (score >= 40) return { bg: 'bg-amber-500', text: 'text-amber-400', label: '중립적' };
        return { bg: 'bg-red-500', text: 'text-red-400', label: '부정적' };
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                            <Database size={20} className="text-white" />
                        </div>
                        데이터 관리
                    </h1>
                    <p className="text-muted-foreground mt-1">통화, 미팅, 이메일 기록을 통합 관리합니다.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchRecords}
                        className="p-2.5 text-muted-foreground hover:text-white hover:bg-secondary/50 rounded-lg transition-colors"
                        title="새로고침"
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
                    </button>
                    <button
                        onClick={() => { resetForm(); setIsAddModalOpen(true); }}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-violet-500/25"
                    >
                        <Plus size={20} />
                        기록 추가
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-slate-600/20 to-slate-800/20 border border-slate-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <FileText className="text-slate-400" size={24} />
                        <span className="text-xs text-slate-400 bg-slate-500/20 px-2 py-0.5 rounded-full">전체</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                    <p className="text-sm text-slate-400">총 기록</p>
                </div>
                <div className="bg-gradient-to-br from-emerald-600/20 to-emerald-800/20 border border-emerald-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <Phone className="text-emerald-400" size={24} />
                        <span className="text-xs text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">통화</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.calls}</p>
                    <p className="text-sm text-emerald-400">통화 녹음</p>
                </div>
                <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <Users className="text-blue-400" size={24} />
                        <span className="text-xs text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded-full">미팅</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.meetings}</p>
                    <p className="text-sm text-blue-400">미팅 녹음</p>
                </div>
                <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <Mail className="text-purple-400" size={24} />
                        <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-full">이메일</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.emails}</p>
                    <p className="text-sm text-purple-400">이메일</p>
                </div>
                <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 border border-amber-500/30 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="text-amber-400" size={24} />
                        <span className="text-xs text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full">감정</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{stats.avgSentiment}점</p>
                    <p className="text-sm text-amber-400">평균 감정</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-card/80 backdrop-blur-sm p-4 rounded-xl border border-border flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                    <button
                        onClick={() => setFilterType('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === 'all'
                            ? 'bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-violet-400 border border-violet-500/30 shadow-lg shadow-violet-500/10'
                            : 'text-muted-foreground hover:bg-secondary/30 border border-transparent'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Database size={16} />
                            전체 ({stats.total})
                        </div>
                    </button>
                    {RECORD_TYPES.map(type => (
                        <button
                            key={type.id}
                            onClick={() => setFilterType(type.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterType === type.id
                                ? `${type.bgColor} ${type.textColor} border ${type.borderColor} shadow-lg`
                                : 'text-muted-foreground hover:bg-secondary/30 border border-transparent'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <type.icon size={16} />
                                {type.label} ({type.id === 'call' ? stats.calls : type.id === 'meeting' ? stats.meetings : stats.emails})
                            </div>
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input
                        type="text"
                        placeholder="제목, 업체명, 담당자 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition-all"
                    />
                </div>
            </div>

            {/* Card List View */}
            <div className="space-y-4">
                {loading ? (
                    <div className="bg-card rounded-xl border border-border p-12 text-center">
                        <Loader2 className="animate-spin mx-auto text-violet-400" size={40} />
                        <p className="text-muted-foreground mt-4">데이터를 불러오는 중...</p>
                    </div>
                ) : filteredRecords.length === 0 ? (
                    <div className="bg-card rounded-xl border border-border p-12 text-center">
                        <Database className="mx-auto text-muted-foreground/30" size={48} />
                        <p className="text-muted-foreground mt-4">등록된 기록이 없습니다.</p>
                        <button
                            onClick={() => { resetForm(); setIsAddModalOpen(true); }}
                            className="mt-4 px-4 py-2 bg-violet-500/20 text-violet-400 rounded-lg hover:bg-violet-500/30 transition-colors"
                        >
                            첫 기록 추가하기
                        </button>
                    </div>
                ) : (
                    filteredRecords.map((record) => {
                        const typeConfig = getTypeConfig(record.type);
                        const sentiment = getSentimentColor(record.sentiment_score || 0);
                        const isExpanded = expandedRow === record.id;

                        return (
                            <div
                                key={record.id}
                                className={`bg-card/80 backdrop-blur-sm rounded-xl border ${typeConfig.borderColor} overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-${typeConfig.textColor.replace('text-', '')}/5`}
                            >
                                {/* Card Header */}
                                <div className="p-4 flex items-start gap-4">
                                    {/* Type Icon */}
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeConfig.color} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                        <typeConfig.icon size={24} className="text-white" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-xs px-2 py-0.5 rounded-full ${typeConfig.bgColor} ${typeConfig.textColor} font-medium`}>
                                                        {typeConfig.label}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Calendar size={12} />
                                                        {new Date(record.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-bold text-white mb-1">{record.title || '제목 없음'}</h3>
                                                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                                    {record.company_name && (
                                                        <span className="flex items-center gap-1">
                                                            <Building2 size={14} />
                                                            {record.company_name}
                                                        </span>
                                                    )}
                                                    {record.contact_name && (
                                                        <span className="flex items-center gap-1">
                                                            <User size={14} />
                                                            {record.contact_name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-1">
                                                {record.sentiment_score !== undefined && record.sentiment_score !== null && (
                                                    <div className={`px-2.5 py-1 rounded-full ${sentiment.bg}/20 ${sentiment.text} text-xs font-bold mr-2`}>
                                                        {record.sentiment_score}점
                                                    </div>
                                                )}
                                                <button
                                                    onClick={() => openEditModal(record)}
                                                    className="p-2 text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                    title="수정"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteRecord(record.id)}
                                                    className="p-2 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                    title="삭제"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => setExpandedRow(isExpanded ? null : record.id)}
                                                    className="p-2 text-muted-foreground hover:text-white hover:bg-secondary/50 rounded-lg transition-colors"
                                                    title={isExpanded ? "접기" : "펼치기"}
                                                >
                                                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                </button>
                                            </div>
                                        </div>

                                        {/* Summary */}
                                        {record.summary && (
                                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                                {record.summary}
                                            </p>
                                        )}

                                        {/* Keywords & Actions */}
                                        <div className="flex flex-wrap items-center gap-2 mt-3">
                                            {record.keywords && record.keywords.length > 0 && (
                                                record.keywords.slice(0, 4).map((keyword, idx) => (
                                                    <span key={idx} className="flex items-center gap-1 px-2 py-0.5 bg-secondary/50 text-muted-foreground rounded-full text-xs">
                                                        <Hash size={10} />
                                                        {keyword}
                                                    </span>
                                                ))
                                            )}
                                            {record.next_action && record.next_action.length > 0 && (
                                                record.next_action.slice(0, 2).map((action, idx) => (
                                                    <span key={idx} className="flex items-center gap-1 px-2 py-0.5 bg-violet-500/20 text-violet-400 rounded-full text-xs">
                                                        <Sparkles size={10} />
                                                        {action}
                                                    </span>
                                                ))
                                            )}
                                            {record.recording_link && (
                                                <a
                                                    href={record.recording_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded-full text-xs hover:bg-blue-500/30 transition-colors"
                                                >
                                                    <ExternalLink size={10} />
                                                    원본 보기
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div className="px-4 pb-4 pt-2 border-t border-border/50 bg-secondary/20">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Sentiment */}
                                            {record.sentiment_score !== undefined && (
                                                <div className="bg-secondary/30 rounded-lg p-3">
                                                    <p className="text-xs text-muted-foreground mb-2">감정/태도 분석</p>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 h-3 bg-secondary/50 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full rounded-full ${sentiment.bg}`}
                                                                style={{ width: `${record.sentiment_score}%` }}
                                                            />
                                                        </div>
                                                        <span className={`text-sm font-bold ${sentiment.text}`}>
                                                            {record.sentiment_score}점 ({sentiment.label})
                                                        </span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Full Content Preview */}
                                            <div className="bg-secondary/30 rounded-lg p-3">
                                                <p className="text-xs text-muted-foreground mb-2">전체 내용</p>
                                                <p className="text-sm text-white/80 line-clamp-4">{record.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Results Count */}
            {!loading && filteredRecords.length > 0 && (
                <div className="text-center text-sm text-muted-foreground">
                    총 {filteredRecords.length}개의 기록
                </div>
            )}

            {/* Add/Edit Modal */}
            {(isAddModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-border">
                        <div className="flex items-center justify-between p-6 border-b border-border bg-gradient-to-r from-violet-500/10 to-purple-500/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                                    {isEditModalOpen ? <Edit2 size={20} className="text-white" /> : <Plus size={20} className="text-white" />}
                                </div>
                                <h2 className="text-xl font-bold text-white">
                                    {isEditModalOpen ? '기록 수정' : '새 기록 추가'}
                                </h2>
                            </div>
                            <button
                                onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                                className="text-muted-foreground hover:text-white p-2 hover:bg-secondary/50 rounded-lg transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={isEditModalOpen ? handleUpdateRecord : handleAddRecord} className="p-6 space-y-6">
                            {/* Type Selection */}
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-3">유형 선택</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {RECORD_TYPES.map(type => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, type: type.id })}
                                            className={`p-4 rounded-xl border text-center transition-all ${formData.type === type.id
                                                ? `${type.bgColor} ${type.borderColor} ${type.textColor} shadow-lg`
                                                : 'border-border text-muted-foreground hover:bg-secondary/30'
                                                }`}
                                        >
                                            <type.icon size={24} className="mx-auto mb-2" />
                                            <span className="font-medium">{type.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">업체명</label>
                                    <input
                                        type="text"
                                        value={formData.company_name}
                                        onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                                        placeholder="업체명 입력"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">담당자명</label>
                                    <input
                                        type="text"
                                        value={formData.contact_name}
                                        onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                                        placeholder="담당자명 입력"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">제목</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                                    placeholder="기록 제목을 입력하세요"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">핵심 요약</label>
                                <textarea
                                    rows={3}
                                    value={formData.summary}
                                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none"
                                    placeholder="대화 내용 요약"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-2">전체 내용</label>
                                <textarea
                                    rows={5}
                                    required
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="w-full px-4 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/50 resize-none"
                                    placeholder="상세 내용을 입력하세요"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">감정 점수</label>
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={formData.sentiment_score}
                                        onChange={(e) => setFormData({ ...formData, sentiment_score: parseInt(e.target.value) || 0 })}
                                        className="w-full px-4 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">키워드 (쉼표)</label>
                                    <input
                                        type="text"
                                        value={Array.isArray(formData.keywords) ? formData.keywords.join(', ') : formData.keywords}
                                        onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                                        placeholder="가격, 일정"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-2">Next Action</label>
                                    <input
                                        type="text"
                                        value={Array.isArray(formData.next_action) ? formData.next_action.join(', ') : formData.next_action}
                                        onChange={(e) => setFormData({ ...formData, next_action: e.target.value })}
                                        className="w-full px-4 py-2.5 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                                        placeholder="견적서 송부"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-border">
                                <button
                                    type="button"
                                    onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                                    className="px-5 py-2.5 text-muted-foreground hover:bg-secondary/50 rounded-lg font-medium transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg font-medium hover:from-violet-600 hover:to-purple-700 transition-all flex items-center gap-2 shadow-lg"
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
