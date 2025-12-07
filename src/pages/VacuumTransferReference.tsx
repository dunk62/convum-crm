import React, { useState, useEffect, useCallback } from 'react';
import { Play, CheckCircle, XCircle, Gauge, Activity, Clock, Tag, Save, Plus, Trash2, RefreshCw, List, Zap, Target, Box, Settings2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface VacuumTransferData {
    id?: string;
    customer_name: string;
    project_name: string;
    test_status: 'pass' | 'fail';
    youtube_url: string;
    work_name: string;
    work_material: string;
    work_size: string;
    work_weight: number;
    is_breathable: boolean;
    surface_condition: string;
    ejector_model: string;
    nozzle_diameter: string;
    supply_pressure: number;
    pad_model: string;
    pad_material: string;
    pad_count: number;
    pad_diameter: number;
    vacuum_level: number;
    suction_flow: number;
    response_time: number;
    tags: string[];
    safety_factor: number;
    // Pad Selection Criteria
    transport_mode: string;
    pad_shape: string;
    material_type: string;
    work_conditions: string[];
    created_at?: string;
    updated_at?: string;
}

const initialData: VacuumTransferData = {
    customer_name: '',
    project_name: '',
    test_status: 'pass',
    youtube_url: '',
    work_name: '',
    work_material: '',
    work_size: '',
    work_weight: 0,
    is_breathable: false,
    surface_condition: '',
    ejector_model: '',
    nozzle_diameter: '',
    supply_pressure: 0,
    pad_model: '',
    pad_material: '',
    pad_count: 1,
    pad_diameter: 0,
    vacuum_level: 0,
    suction_flow: 0,
    response_time: 0,
    tags: [],
    safety_factor: 0,
    // Pad Selection Criteria
    transport_mode: '',
    pad_shape: '',
    material_type: '',
    work_conditions: [],
};

export default function VacuumTransferReference() {
    const [data, setData] = useState<VacuumTransferData>(initialData);
    const [records, setRecords] = useState<VacuumTransferData[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showList, setShowList] = useState(false);
    const [tagInput, setTagInput] = useState('');

    const fetchRecords = useCallback(async () => {
        setIsLoading(true);
        try {
            const { data: fetchedData, error } = await supabase
                .from('vacuum_transfer_references')
                .select('*')
                .order('created_at', { ascending: false });
            if (error) throw error;
            setRecords(fetchedData || []);
        } catch (err) {
            console.error('Error fetching records:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchRecords(); }, [fetchRecords]);

    useEffect(() => {
        if (data.work_weight > 0 && data.vacuum_level > 0 && data.pad_diameter > 0 && data.pad_count > 0) {
            const radiusCm = (data.pad_diameter / 2) / 10;
            const areaCm2 = Math.PI * radiusCm * radiusCm;
            const totalForceKgf = (data.vacuum_level * areaCm2 * data.pad_count) / 10;
            const sf = totalForceKgf / data.work_weight;
            setData(prev => ({ ...prev, safety_factor: parseFloat(sf.toFixed(2)) }));
        } else {
            setData(prev => ({ ...prev, safety_factor: 0 }));
        }
    }, [data.work_weight, data.vacuum_level, data.pad_diameter, data.pad_count]);

    const getYoutubeThumbnail = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg` : null;
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            setData(prev => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove: string) => setData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tagToRemove) }));
    const updateField = <K extends keyof VacuumTransferData>(field: K, value: VacuumTransferData[K]) => setData(prev => ({ ...prev, [field]: value }));

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const payload = { ...data };
            delete payload.created_at;
            delete payload.updated_at;
            if (data.id) {
                const { error } = await supabase.from('vacuum_transfer_references').update(payload).eq('id', data.id);
                if (error) throw error;
            } else {
                delete payload.id;
                const { data: newData, error } = await supabase.from('vacuum_transfer_references').insert([payload]).select().single();
                if (error) throw error;
                setData(prev => ({ ...prev, id: newData.id }));
            }
            fetchRecords();
            alert('저장되었습니다!');
        } catch (err: any) {
            console.error('Error saving:', err);
            alert('저장 실패: ' + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleNew = () => { setData(initialData); setShowList(false); };
    const handleLoad = (record: VacuumTransferData) => { setData(record); setShowList(false); };
    const handleDelete = async (id: string) => {
        if (!confirm('이 레코드를 삭제하시겠습니까?')) return;
        try {
            const { error } = await supabase.from('vacuum_transfer_references').delete().eq('id', id);
            if (error) throw error;
            fetchRecords();
            if (data.id === id) setData(initialData);
        } catch (err: any) {
            console.error('Error deleting:', err);
            alert('삭제 실패: ' + err.message);
        }
    };

    // 진공도 퍼센트 계산 (0-100kPa 기준)
    const vacuumPercent = Math.min((data.vacuum_level / 100) * 100, 100);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-4 md:p-8">
            {/* 배경 그리드 패턴 */}
            <div className="fixed inset-0 opacity-[0.02] pointer-events-none" style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }} />

            {/* 헤더 */}
            <header className="relative mb-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-slate-900/60 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 shadow-2xl">
                    {/* 왼쪽: 타이틀 & 입력 */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                <Target size={22} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight text-white">
                                    진공 이송 레퍼런스 시트
                                </h1>
                                <p className="text-xs text-slate-500 font-mono tracking-wider">VACUUM TRANSFER REFERENCE SHEET</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm">
                            <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50">
                                <span className="text-slate-500 text-xs">고객사</span>
                                <input
                                    type="text"
                                    placeholder="입력"
                                    className="bg-transparent border-none focus:outline-none w-32 text-white placeholder-slate-600 font-medium"
                                    value={data.customer_name}
                                    onChange={(e) => updateField('customer_name', e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2 bg-slate-800/50 rounded-lg px-3 py-2 border border-slate-700/50">
                                <span className="text-slate-500 text-xs">프로젝트</span>
                                <input
                                    type="text"
                                    placeholder="입력"
                                    className="bg-transparent border-none focus:outline-none w-40 text-white placeholder-slate-600 font-medium"
                                    value={data.project_name}
                                    onChange={(e) => updateField('project_name', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 오른쪽: 상태 & 액션 */}
                    <div className="flex items-center gap-4">
                        {/* 상태 배지 */}
                        <button
                            onClick={() => updateField('test_status', data.test_status === 'pass' ? 'fail' : 'pass')}
                            className={`relative px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all duration-300 shadow-lg ${data.test_status === 'pass'
                                ? 'bg-gradient-to-r from-emerald-600 to-green-500 text-white shadow-emerald-500/30 hover:shadow-emerald-500/50'
                                : 'bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-red-500/30 hover:shadow-red-500/50'
                                }`}
                        >
                            {data.test_status === 'pass' ? <CheckCircle size={18} /> : <XCircle size={18} />}
                            {data.test_status === 'pass' ? '테스트 성공' : '테스트 실패'}
                            <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse ${data.test_status === 'pass' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                        </button>

                        {/* 액션 버튼 */}
                        <div className="flex gap-2">
                            <button onClick={() => setShowList(!showList)} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700/50 hover:border-slate-600" title="목록">
                                <List size={18} />
                            </button>
                            <button onClick={handleNew} className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-700/50 hover:border-slate-600" title="새로 만들기">
                                <Plus size={18} />
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 rounded-xl transition-all flex items-center gap-2 font-semibold text-sm shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 disabled:opacity-50"
                            >
                                {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* 목록 모달 */}
            {showList && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-900 rounded-2xl border border-slate-700/50 shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
                        <div className="p-5 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/50">
                            <h2 className="text-lg font-bold flex items-center gap-2"><List size={20} className="text-cyan-400" /> 저장된 레퍼런스</h2>
                            <button onClick={() => setShowList(false)} className="text-slate-400 hover:text-white p-1"><XCircle size={22} /></button>
                        </div>
                        <div className="overflow-auto max-h-[65vh] p-4">
                            {isLoading ? (
                                <div className="text-center py-12 text-slate-400"><RefreshCw className="animate-spin mx-auto mb-3" size={28} />로딩중...</div>
                            ) : records.length === 0 ? (
                                <div className="text-center py-12 text-slate-500">저장된 데이터가 없습니다.</div>
                            ) : (
                                <div className="space-y-2">
                                    {records.map(record => (
                                        <div key={record.id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/30 hover:border-slate-600/50 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <span className={`w-2 h-8 rounded-full ${record.test_status === 'pass' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                <div>
                                                    <p className="font-semibold text-white">{record.customer_name || '미지정'} <span className="text-slate-500 font-normal">/ {record.project_name || '프로젝트 없음'}</span></p>
                                                    <p className="text-xs text-slate-500 font-mono">{record.work_name || '워크 미지정'} • 안전율 x{record.safety_factor}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => handleLoad(record)} className="px-3 py-1.5 text-xs bg-cyan-600/20 text-cyan-400 rounded-lg hover:bg-cyan-600/30">불러오기</button>
                                                <button onClick={() => handleDelete(record.id!)} className="p-1.5 text-red-400 hover:bg-red-500/20 rounded-lg"><Trash2 size={14} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* 메인 콘텐츠 그리드 */}
            <div className="grid grid-cols-12 gap-6">
                {/* 좌측: 비주얼 & 워크 사양 */}
                <div className="col-span-12 lg:col-span-5 space-y-6">
                    {/* YouTube 미리보기 */}
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-500" />
                        <div className="relative bg-slate-900/80 rounded-2xl overflow-hidden border border-slate-700/50 aspect-video">
                            {getYoutubeThumbnail(data.youtube_url) ? (
                                <>
                                    <img src={getYoutubeThumbnail(data.youtube_url)!} alt="썸네일" className="w-full h-full object-cover opacity-90" />
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform cursor-pointer">
                                            <Play fill="white" className="ml-1 text-white" size={28} />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-slate-600 w-full h-full bg-slate-800/50">
                                    <Play size={40} className="mb-2 opacity-30" />
                                    <span className="text-sm">YouTube URL을 입력하세요</span>
                                </div>
                            )}
                            <input
                                type="text"
                                placeholder="YouTube URL 붙여넣기..."
                                className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-cyan-500/50 text-sm font-mono"
                                value={data.youtube_url}
                                onChange={(e) => updateField('youtube_url', e.target.value)}
                            />
                        </div>
                    </div>

                    {/* 워크 사양 카드 */}
                    <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-700/50 flex items-center gap-2 bg-slate-800/30">
                            <Box size={18} className="text-blue-400" />
                            <h3 className="font-bold text-sm tracking-wide">워크 사양</h3>
                            <span className="text-[10px] text-slate-600 font-mono ml-auto">WORKPIECE SPEC</span>
                        </div>
                        <div className="p-5 grid grid-cols-2 gap-4">
                            {[
                                { label: '명칭', key: 'work_name', type: 'text' },
                                { label: '재질', key: 'work_material', type: 'text' },
                                { label: '크기 (mm)', key: 'work_size', type: 'text' },
                                { label: '무게 (kg)', key: 'work_weight', type: 'number', highlight: true },
                            ].map(field => (
                                <div key={field.key} className="space-y-1.5">
                                    <label className={`text-[10px] uppercase tracking-wider font-bold ${field.highlight ? 'text-orange-400' : 'text-slate-500'}`}>{field.label}</label>
                                    <input
                                        type={field.type}
                                        className={`w-full bg-slate-800/50 border rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-all ${field.highlight
                                            ? 'border-orange-500/30 focus:border-orange-500 text-orange-300 font-bold'
                                            : 'border-slate-700/50 focus:border-cyan-500/50 text-white'
                                            }`}
                                        value={(data as any)[field.key] || ''}
                                        onChange={e => updateField(field.key as any, field.type === 'number' ? Number(e.target.value) : e.target.value)}
                                    />
                                </div>
                            ))}
                            <div className="col-span-2 flex items-center gap-4 pt-2">
                                <label className="flex items-center gap-2 cursor-pointer bg-slate-800/30 px-3 py-2 rounded-lg border border-slate-700/30">
                                    <input type="checkbox" className="w-4 h-4 rounded accent-cyan-500" checked={data.is_breathable} onChange={e => updateField('is_breathable', e.target.checked)} />
                                    <span className="text-xs text-slate-300">통기성</span>
                                </label>
                                <input type="text" placeholder="표면 상태" className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50" value={data.surface_condition} onChange={e => updateField('surface_condition', e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 우측: 시스템 구성 & 성능 */}
                <div className="col-span-12 lg:col-span-7 space-y-6">
                    {/* 시스템 구성 */}
                    <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-700/50 flex items-center gap-2 bg-slate-800/30">
                            <Settings2 size={18} className="text-cyan-400" />
                            <h3 className="font-bold text-sm tracking-wide">시스템 구성</h3>
                            <span className="text-[10px] text-slate-600 font-mono ml-auto">SYSTEM CONFIG</span>
                        </div>
                        <div className="p-5 grid grid-cols-2 gap-6">
                            {/* 진공 발생기 */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                    <Zap size={12} className="text-yellow-500" /> 진공 발생기
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        { label: '모델', key: 'ejector_model' },
                                        { label: '노즐 (mm)', key: 'nozzle_diameter' },
                                    ].map(f => (
                                        <div key={f.key} className="space-y-1">
                                            <label className="text-[10px] text-slate-500 uppercase">{f.label}</label>
                                            <input type="text" className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50" value={(data as any)[f.key]} onChange={e => updateField(f.key as any, e.target.value)} />
                                        </div>
                                    ))}
                                    <div className="col-span-2 space-y-1">
                                        <label className="text-[10px] text-slate-500 uppercase">공급 압력 (MPa)</label>
                                        <div className="flex items-center gap-2">
                                            <input type="number" step="0.1" className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50" value={data.supply_pressure || ''} onChange={e => updateField('supply_pressure', Number(e.target.value))} />
                                            <Gauge size={16} className="text-slate-500" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 진공 패드 */}
                            <div className="space-y-4">
                                <h4 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                                    <Target size={12} className="text-emerald-500" /> 진공 패드
                                </h4>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2 flex gap-2">
                                        <input type="text" placeholder="모델" className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50" value={data.pad_model} onChange={e => updateField('pad_model', e.target.value)} />
                                        <input type="text" placeholder="재질" className="w-20 bg-slate-800/50 border border-slate-700/50 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500/50" value={data.pad_material} onChange={e => updateField('pad_material', e.target.value)} />
                                    </div>
                                    {[
                                        { label: '직경 (mm)', key: 'pad_diameter' },
                                        { label: '수량 (ea)', key: 'pad_count' },
                                    ].map(f => (
                                        <div key={f.key} className="space-y-1">
                                            <label className="text-[10px] text-emerald-400 uppercase font-bold">{f.label}</label>
                                            <input type="number" className="w-full bg-slate-800/50 border border-emerald-500/20 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500/50 font-semibold text-emerald-300" value={(data as any)[f.key] || ''} onChange={e => updateField(f.key as any, Number(e.target.value))} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 성능 지표 */}
                    <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/30">
                            <div className="flex items-center gap-2">
                                <Activity size={18} className="text-purple-400" />
                                <h3 className="font-bold text-sm tracking-wide">성능 지표</h3>
                            </div>
                            <span className="text-[10px] text-slate-600 bg-slate-800 px-3 py-1 rounded-full font-mono">AUTO-CALC</span>
                        </div>
                        <div className="p-5">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                {/* 진공도 (슬라이더) */}
                                <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/5 p-4 rounded-xl border border-blue-500/20 relative">
                                    <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                                    <label className="text-[10px] text-blue-300 uppercase font-bold block mb-2">도달 진공도</label>
                                    <div className="flex items-baseline gap-1 mb-3">
                                        <span className="text-3xl font-black text-white font-mono">{data.vacuum_level}</span>
                                        <span className="text-xs text-blue-300">-kPa</span>
                                    </div>
                                    <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all" style={{ width: `${vacuumPercent}%` }} />
                                    </div>
                                    <input type="range" min="0" max="100" className="w-full mt-2 opacity-0 absolute inset-0 cursor-pointer" value={data.vacuum_level} onChange={e => updateField('vacuum_level', Number(e.target.value))} />
                                </div>

                                {/* 흡입 유량 */}
                                <div className="bg-gradient-to-br from-cyan-500/10 to-teal-500/5 p-4 rounded-xl border border-cyan-500/20 relative">
                                    <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-cyan-500" />
                                    <label className="text-[10px] text-cyan-300 uppercase font-bold block mb-2">흡입 유량</label>
                                    <div className="flex items-baseline gap-1">
                                        <input type="number" className="w-16 bg-transparent text-3xl font-black text-white font-mono focus:outline-none" value={data.suction_flow || ''} onChange={e => updateField('suction_flow', Number(e.target.value))} placeholder="0" />
                                        <span className="text-xs text-cyan-300">L/min</span>
                                    </div>
                                    <Activity className="absolute bottom-2 right-2 text-cyan-500/10" size={28} />
                                </div>

                                {/* 진공 도달 시간 */}
                                <div className="bg-gradient-to-br from-purple-500/10 to-violet-500/5 p-4 rounded-xl border border-purple-500/20 relative">
                                    <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-purple-500" />
                                    <label className="text-[10px] text-purple-300 uppercase font-bold block mb-2">진공 도달 시간</label>
                                    <div className="flex items-baseline gap-1">
                                        <input type="number" step="0.01" className="w-16 bg-transparent text-3xl font-black text-white font-mono focus:outline-none" value={data.response_time || ''} onChange={e => updateField('response_time', Number(e.target.value))} placeholder="0" />
                                        <span className="text-xs text-purple-300">초</span>
                                    </div>
                                    <Clock className="absolute bottom-2 right-2 text-purple-500/10" size={28} />
                                </div>

                                {/* 안전율 */}
                                <div className={`p-4 rounded-xl border relative transition-all ${data.safety_factor >= 4 ? 'bg-gradient-to-br from-emerald-500/20 to-green-500/10 border-emerald-500/40' :
                                    data.safety_factor >= 2 ? 'bg-gradient-to-br from-yellow-500/20 to-amber-500/10 border-yellow-500/40' :
                                        'bg-gradient-to-br from-red-500/20 to-rose-500/10 border-red-500/40'
                                    }`}>
                                    <div className={`absolute top-2 left-2 w-2 h-2 rounded-full animate-pulse ${data.safety_factor >= 4 ? 'bg-emerald-500' : data.safety_factor >= 2 ? 'bg-yellow-500' : 'bg-red-500'
                                        }`} />
                                    <label className={`text-[10px] uppercase font-bold block mb-2 ${data.safety_factor >= 4 ? 'text-emerald-300' : data.safety_factor >= 2 ? 'text-yellow-300' : 'text-red-300'
                                        }`}>안전율</label>
                                    <span className={`text-4xl font-black font-mono ${data.safety_factor >= 4 ? 'text-emerald-300' : data.safety_factor >= 2 ? 'text-yellow-300' : 'text-red-300'
                                        }`}>x{data.safety_factor}</span>
                                    <p className="text-[10px] text-slate-500 mt-2">목표 &gt; x4</p>
                                </div>
                            </div>

                            {/* 태그 */}
                            <div className="flex items-center gap-3 bg-slate-800/50 p-4 rounded-xl border border-slate-600/50">
                                <Tag size={16} className="text-cyan-400" />
                                <span className="text-xs text-slate-400 font-semibold">태그</span>
                                <div className="flex flex-wrap gap-2 flex-1 items-center">
                                    {data.tags.map((tag, idx) => (
                                        <span key={idx} className="bg-cyan-600/20 text-cyan-300 px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 hover:bg-cyan-600/30 cursor-pointer group border border-cyan-500/20" onClick={() => removeTag(tag)}>
                                            #{tag}
                                            <XCircle size={12} className="text-cyan-400/50 group-hover:text-white" />
                                        </span>
                                    ))}
                                    <input
                                        type="text"
                                        className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500/50 text-sm min-w-[120px] text-white placeholder-slate-400"
                                        placeholder="+ 태그 입력 (Enter)"
                                        value={tagInput}
                                        onChange={e => setTagInput(e.target.value)}
                                        onKeyDown={handleAddTag}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 푸터 */}
            {data.id && (
                <div className="mt-6 text-center">
                    <span className="text-[10px] text-slate-600 font-mono bg-slate-800/30 px-3 py-1 rounded-full">ID: {data.id}</span>
                </div>
            )}
        </div>
    );
}
