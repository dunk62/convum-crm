import { useState, useEffect } from 'react';
import { Layers, Target, Droplets, CheckCircle, ChevronDown, Tag, Calculator, CircleDot, Scale } from 'lucide-react';

// 패드 형상 옵션
const PAD_SHAPES = [
    { value: 'flat', label: '평형 (Flat)', desc: '기본형', tip: '평평하고 매끄러운 표면의 일반적인 워크', conditions: ['smooth', 'rigid'] },
    { value: 'flat_rib', label: '평형 립 부착 (Flat with Rib)', desc: '변형 쉬운 워크/이탈 방지', tip: '얇은 비닐, 종이 등 변형 방지 / 이탈 방지', conditions: ['thin', 'flexible'] },
    { value: 'bellows', label: '벨로즈형 (Bellows)', desc: '경사면/완충 필요', tip: '경사면 흡착 / 완충 필요 시 / 높이 차이 흡수', conditions: ['uneven', 'fragile', 'inclined'] },
    { value: 'oval', label: '타원형 (Oval)', desc: '좁고 긴 워크', tip: '폭이 좁고 긴 형태의 워크', conditions: ['narrow', 'elongated'] },
    { value: 'deep', label: '깊은형 (Deep)', desc: '굴곡진 표면', tip: '굴곡진 표면 / 구형 또는 불규칙 형상', conditions: ['curved', 'spherical', 'irregular'] },
];

// 패드 재질 옵션
const PAD_MATERIALS = [
    { value: 'nbr', label: 'NBR (니트릴)', desc: '일반/내유성 우수', tip: '일반 산업 환경, 오일 접촉 가능 워크' },
    { value: 'silicone', label: '실리콘 (Silicone)', desc: '고온/식품/유연함', tip: '80°C 이상 고온 / 식품 라인 / 유연한 흡착 필요' },
    { value: 'urethane', label: '우레탄 (Urethane)', desc: '거친 표면/내마모성', tip: '거친 표면, 마모가 심한 환경' },
    { value: 'fkm', label: 'FKM (불소고무)', desc: '내약품성', tip: '화학약품 노출, 솔벤트 환경' },
    { value: 'conductive', label: '도전성 (Conductive)', desc: '정전기 방지', tip: '전자부품, 반도체, 정전기 민감 워크' },
    { value: 'markfree', label: '마크 프리 (Mark-free)', desc: '자국 방지', tip: '유리, 광학 렌즈, 자국 방지 필요' },
];

// 워크 표면 특성 (형상 추천용)
const SURFACE_CHARACTERISTICS = [
    { value: 'smooth', label: '매끄러움', icon: '✨', recommend: 'flat' },
    { value: 'rigid', label: '단단함', icon: '🧱', recommend: 'flat' },
    { value: 'thin', label: '얇음', icon: '📄', recommend: 'flat_rib' },
    { value: 'flexible', label: '유연함', icon: '〰️', recommend: 'flat_rib' },
    { value: 'uneven', label: '높낮이 차이', icon: '📊', recommend: 'bellows' },
    { value: 'fragile', label: '충격 민감', icon: '💎', recommend: 'bellows' },
    { value: 'inclined', label: '경사면', icon: '📐', recommend: 'bellows' },
    { value: 'narrow', label: '폭이 좁음', icon: '📏', recommend: 'oval' },
    { value: 'elongated', label: '길쭉함', icon: '➡️', recommend: 'oval' },
    { value: 'curved', label: '곡면', icon: '🌙', recommend: 'deep' },
    { value: 'spherical', label: '구형', icon: '🔵', recommend: 'deep' },
    { value: 'irregular', label: '불규칙', icon: '🪨', recommend: 'deep' },
];

// 표준 패드 직경 옵션 (mm)
const PAD_DIAMETERS = [4, 6, 8, 10, 15, 20, 25, 30, 35, 40, 50, 60, 80, 100, 120, 150];

// 워크 환경 조건
const WORK_CONDITIONS = [
    { value: 'porous', label: '통기성', icon: '🕳️', tip: '다공성 소재(스펀지, 종이 등)는 진공 유지가 어려워 스폰지형 패드나 씰 강화 필요' },
    { value: 'oily', label: '오일/수분', icon: '💧', tip: 'NBR 또는 FKM 재질 권장, 실리콘은 오일에 취약' },
    { value: 'rough', label: '거친표면', icon: '🪨', tip: '우레탄 재질 또는 스폰지형 패드로 밀착력 확보' },
    { value: 'hot', label: '고온환경', icon: '🔥', tip: '실리콘 또는 FKM 재질 필수 (80°C 이상)' },
    { value: 'static', label: '정전기민감', icon: '⚡', tip: '도전성 재질 필수, 접지 확보 필요' },
];

export default function PadSelectionGuide() {
    // 고객 입력 정보
    const [workWeight, setWorkWeight] = useState<number>(0);
    const [workMaterial, setWorkMaterial] = useState<string>('');
    const [workSize, setWorkSize] = useState<string>('');

    // 진공 시스템 설정
    const [vacuumPressure, setVacuumPressure] = useState<number>(60); // -kPa
    const [padDiameter, setPadDiameter] = useState<number>(30); // mm

    // 선정 기준
    const [transportMode, setTransportMode] = useState<string>('');
    const [padShape, setPadShape] = useState<string>('');
    const [materialType, setMaterialType] = useState<string>('');
    const [surfaceChars, setSurfaceChars] = useState<string[]>([]);
    const [workConditions, setWorkConditions] = useState<string[]>([]);

    // 안전율
    const [targetSafetyFactor, setTargetSafetyFactor] = useState<number>(4);

    // 패드 1개당 흡착력 계산 (kgf)
    // F = (P × A) / 10
    // P: 진공압 (-kPa), A: 패드 면적 (cm²)
    const calculatePadForce = () => {
        const radiusCm = (padDiameter / 2) / 10; // mm to cm
        const areaCm2 = Math.PI * radiusCm * radiusCm;
        const force = (vacuumPressure * areaCm2) / 10;
        return force;
    };

    const padForce = calculatePadForce();

    // 필요 흡착력 계산 (무게 × 안전율)
    const requiredForce = workWeight * targetSafetyFactor;

    // 필요 패드 개수 계산
    const requiredPadCount = padForce > 0 ? Math.ceil(requiredForce / padForce) : 0;

    // 이송 모드에 따른 권장 안전율
    useEffect(() => {
        if (transportMode === 'vertical') {
            setTargetSafetyFactor(8);
        } else if (transportMode === 'horizontal') {
            setTargetSafetyFactor(4);
        }
    }, [transportMode]);

    // 표면 특성에 따른 형상 추천
    const getRecommendedShape = () => {
        const recommendations: Record<string, number> = {};
        surfaceChars.forEach(char => {
            const charData = SURFACE_CHARACTERISTICS.find(c => c.value === char);
            if (charData) {
                recommendations[charData.recommend] = (recommendations[charData.recommend] || 0) + 1;
            }
        });

        let maxScore = 0;
        let recommended = '';
        Object.entries(recommendations).forEach(([shape, score]) => {
            if (score > maxScore) {
                maxScore = score;
                recommended = shape;
            }
        });

        return recommended;
    };

    const recommendedShape = getRecommendedShape();

    const toggleSurfaceChar = (char: string) => {
        setSurfaceChars(prev =>
            prev.includes(char)
                ? prev.filter(c => c !== char)
                : [...prev, char]
        );
    };

    const toggleCondition = (condition: string) => {
        setWorkConditions(prev =>
            prev.includes(condition)
                ? prev.filter(c => c !== condition)
                : [...prev, condition]
        );
    };

    const selectedShape = PAD_SHAPES.find(s => s.value === padShape);
    const selectedMaterial = PAD_MATERIALS.find(m => m.value === materialType);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-4 md:p-8">
            {/* 배경 그리드 패턴 */}
            <div className="fixed inset-0 opacity-[0.02] pointer-events-none" style={{
                backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                backgroundSize: '40px 40px'
            }} />

            {/* 헤더 */}
            <header className="relative mb-8">
                <div className="bg-gradient-to-r from-violet-600/10 to-purple-600/10 backdrop-blur-xl p-6 rounded-2xl border border-slate-700/50 shadow-2xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
                            <Layers size={26} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">진공 패드 선정 가이드</h1>
                            <p className="text-xs text-slate-500 font-mono tracking-wider">PAD SELECTION GUIDE</p>
                        </div>
                    </div>
                    <p className="mt-4 text-sm text-slate-400 leading-relaxed max-w-3xl">
                        워크 무게와 진공압, 패드 사이즈를 입력하면 <strong className="text-cyan-300">필요 패드 개수</strong>를 자동 계산합니다.
                        워크 표면 특성을 선택하면 <strong className="text-emerald-300">적합한 패드 형상</strong>을 추천합니다.
                    </p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* 왼쪽: 입력 & 계산 영역 */}
                <div className="lg:col-span-5 space-y-6">
                    {/* 워크 정보 입력 */}
                    <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-700/50 bg-gradient-to-r from-cyan-600/10 to-blue-600/10">
                            <div className="flex items-center gap-2">
                                <Scale size={18} className="text-cyan-400" />
                                <h3 className="font-bold text-sm">워크 정보</h3>
                                <span className="text-[10px] text-slate-600 font-mono ml-auto">WORKPIECE INFO</span>
                            </div>
                        </div>
                        <div className="p-5 space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs text-orange-400 uppercase font-bold flex items-center gap-2">
                                    워크 무게 (kg) <span className="text-slate-500 text-[10px] font-normal">*필수</span>
                                </label>
                                <input
                                    type="number"
                                    value={workWeight || ''}
                                    onChange={e => setWorkWeight(Number(e.target.value))}
                                    placeholder="예: 5.5"
                                    className="w-full bg-slate-800/50 border border-orange-500/30 rounded-xl px-4 py-3 text-lg font-bold text-orange-300 focus:outline-none focus:border-orange-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-400 uppercase font-bold">워크 재질</label>
                                    <input
                                        type="text"
                                        value={workMaterial}
                                        onChange={e => setWorkMaterial(e.target.value)}
                                        placeholder="예: 알루미늄"
                                        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-400 uppercase font-bold">워크 크기 (mm)</label>
                                    <input
                                        type="text"
                                        value={workSize}
                                        onChange={e => setWorkSize(e.target.value)}
                                        placeholder="예: 200×300"
                                        className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 진공 시스템 설정 */}
                    <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-700/50 bg-gradient-to-r from-blue-600/10 to-cyan-600/10">
                            <div className="flex items-center gap-2">
                                <CircleDot size={18} className="text-blue-400" />
                                <h3 className="font-bold text-sm">진공 시스템 설정</h3>
                                <span className="text-[10px] text-slate-600 font-mono ml-auto">VACUUM SYSTEM</span>
                            </div>
                        </div>
                        <div className="p-5 space-y-5">
                            {/* 이송 형태 */}
                            <div className="space-y-2">
                                <label className="text-xs text-slate-400 font-semibold">이송 형태</label>
                                <div className="relative">
                                    <select
                                        value={transportMode}
                                        onChange={e => setTransportMode(e.target.value)}
                                        className="w-full appearance-none bg-slate-800/80 border border-slate-600/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500/50 cursor-pointer"
                                    >
                                        <option value="">선택해주세요</option>
                                        <option value="horizontal">수평 이송 (Horizontal) - 안전율 ×4</option>
                                        <option value="vertical">수직 리프트 (Vertical) - 안전율 ×8</option>
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* 진공압 */}
                            <div className="space-y-2">
                                <label className="text-xs text-blue-300 uppercase font-bold flex items-center justify-between">
                                    도달 진공압
                                    <span className="text-lg font-black text-white">{vacuumPressure} -kPa</span>
                                </label>
                                <input
                                    type="range"
                                    min="20"
                                    max="95"
                                    value={vacuumPressure}
                                    onChange={e => setVacuumPressure(Number(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                                <div className="flex justify-between text-[10px] text-slate-500">
                                    <span>20 kPa</span>
                                    <span>General: 60-80 kPa</span>
                                    <span>95 kPa</span>
                                </div>
                            </div>

                            {/* 패드 직경 */}
                            <div className="space-y-2">
                                <label className="text-xs text-emerald-300 uppercase font-bold">패드 직경 (mm)</label>
                                <div className="relative">
                                    <select
                                        value={padDiameter}
                                        onChange={e => setPadDiameter(Number(e.target.value))}
                                        className="w-full appearance-none bg-slate-800/80 border border-emerald-500/30 rounded-xl px-4 py-3 text-sm text-emerald-300 font-semibold focus:outline-none focus:border-emerald-500/50 cursor-pointer"
                                    >
                                        {PAD_DIAMETERS.map(d => (
                                            <option key={d} value={d}>Ø{d} mm</option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-400 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 계산 결과 카드 */}
                    <div className="bg-gradient-to-br from-violet-600/20 to-purple-600/10 rounded-2xl border border-violet-500/40 p-5 shadow-lg shadow-violet-500/10">
                        <div className="flex items-center gap-2 mb-4">
                            <Calculator size={20} className="text-violet-400" />
                            <h3 className="font-bold text-white">패드 개수 계산</h3>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center py-2 border-b border-violet-500/20">
                                <span className="text-slate-400">패드 1개당 흡착력</span>
                                <span className="font-bold text-cyan-300">{padForce.toFixed(2)} kgf</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-violet-500/20">
                                <span className="text-slate-400">워크 무게 × 안전율({targetSafetyFactor})</span>
                                <span className="font-bold text-orange-300">{requiredForce.toFixed(1)} kgf</span>
                            </div>
                            <div className="flex justify-between items-center pt-3">
                                <span className="text-white font-semibold">필요 패드 개수</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-4xl font-black text-violet-300">{requiredPadCount}</span>
                                    <span className="text-sm text-slate-400">개 이상</span>
                                </div>
                            </div>
                        </div>

                        {workWeight > 0 && requiredPadCount > 0 && (
                            <div className={`mt-4 p-3 rounded-lg border ${requiredPadCount <= 4
                                ? 'bg-emerald-500/10 border-emerald-500/30'
                                : requiredPadCount <= 8
                                    ? 'bg-amber-500/10 border-amber-500/30'
                                    : 'bg-red-500/10 border-red-500/30'
                                }`}>
                                <p className="text-[11px]">
                                    {requiredPadCount <= 4
                                        ? '✅ 적정 패드 개수입니다.'
                                        : requiredPadCount <= 8
                                            ? '⚠️ 패드 직경을 늘리거나 진공압을 높이는 것을 고려하세요.'
                                            : '🔴 패드가 너무 많습니다. 더 큰 패드 사이즈를 권장합니다.'}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 오른쪽: 형상 & 재질 선정 */}
                <div className="lg:col-span-7 space-y-6">
                    {/* 워크 표면 특성 선택 → 형상 추천 */}
                    <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-700/50 bg-gradient-to-r from-emerald-500/10 to-green-500/5">
                            <div className="flex items-center gap-2">
                                <Target size={18} className="text-emerald-400" />
                                <h3 className="font-bold text-sm">워크 표면 특성 → 패드 형상 추천</h3>
                            </div>
                        </div>
                        <div className="p-5 space-y-4">
                            <label className="text-xs text-slate-400 font-semibold block">워크의 표면 특성을 선택하세요 (다중 선택)</label>
                            <div className="flex flex-wrap gap-2">
                                {SURFACE_CHARACTERISTICS.map(char => (
                                    <button
                                        key={char.value}
                                        onClick={() => toggleSurfaceChar(char.value)}
                                        className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${surfaceChars.includes(char.value)
                                            ? 'bg-emerald-600/30 text-emerald-200 border border-emerald-500/50'
                                            : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-emerald-500/30'
                                            }`}
                                    >
                                        <span>{char.icon}</span>
                                        {char.label}
                                    </button>
                                ))}
                            </div>

                            {/* 추천 형상 */}
                            {recommendedShape && (
                                <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/20 to-green-500/10 border border-emerald-500/30">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle size={16} className="text-emerald-400" />
                                        <span className="text-sm font-bold text-emerald-300">추천 패드 형상</span>
                                    </div>
                                    <p className="text-lg font-bold text-white">
                                        {PAD_SHAPES.find(s => s.value === recommendedShape)?.label}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {PAD_SHAPES.find(s => s.value === recommendedShape)?.tip}
                                    </p>
                                    <button
                                        onClick={() => setPadShape(recommendedShape)}
                                        className="mt-3 px-4 py-2 bg-emerald-600/30 text-emerald-200 rounded-lg text-xs font-semibold hover:bg-emerald-600/50 transition-colors"
                                    >
                                        이 형상 적용하기
                                    </button>
                                </div>
                            )}

                            {/* 형상 직접 선택 */}
                            <div className="space-y-2 pt-2 border-t border-slate-700/30">
                                <label className="text-xs text-slate-400 font-semibold">또는 직접 선택</label>
                                <div className="relative">
                                    <select
                                        value={padShape}
                                        onChange={e => setPadShape(e.target.value)}
                                        className="w-full appearance-none bg-slate-800/80 border border-slate-600/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 cursor-pointer"
                                    >
                                        <option value="">선택해주세요</option>
                                        {PAD_SHAPES.map(shape => (
                                            <option key={shape.value} value={shape.value}>
                                                {shape.label} - {shape.desc}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                                {selectedShape && (
                                    <p className="text-[11px] text-emerald-400 mt-2">💡 {selectedShape.tip}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 패드 재질 */}
                        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-700/50 bg-gradient-to-r from-amber-500/10 to-orange-500/5">
                                <div className="flex items-center gap-2">
                                    <Droplets size={16} className="text-amber-400" />
                                    <h3 className="text-sm font-bold text-amber-300 uppercase">패드 재질</h3>
                                </div>
                            </div>
                            <div className="p-5 space-y-3">
                                <div className="relative">
                                    <select
                                        value={materialType}
                                        onChange={e => setMaterialType(e.target.value)}
                                        className="w-full appearance-none bg-slate-800/80 border border-slate-600/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500/50 cursor-pointer"
                                    >
                                        <option value="">선택해주세요</option>
                                        {PAD_MATERIALS.map(mat => (
                                            <option key={mat.value} value={mat.value}>
                                                {mat.label} - {mat.desc}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                                {selectedMaterial && (
                                    <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                                        <p className="text-[11px] text-amber-300">💡 {selectedMaterial.tip}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 환경 조건 */}
                        <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-700/50 overflow-hidden">
                            <div className="px-5 py-4 border-b border-slate-700/50 bg-gradient-to-r from-purple-500/10 to-violet-500/5">
                                <div className="flex items-center gap-2">
                                    <Tag size={16} className="text-purple-400" />
                                    <h3 className="text-sm font-bold text-purple-300 uppercase">환경 조건</h3>
                                </div>
                            </div>
                            <div className="p-5 space-y-3">
                                <div className="flex flex-wrap gap-2">
                                    {WORK_CONDITIONS.map(cond => (
                                        <button
                                            key={cond.value}
                                            onClick={() => toggleCondition(cond.value)}
                                            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${workConditions.includes(cond.value)
                                                ? 'bg-purple-600/30 text-purple-200 border border-purple-500/50'
                                                : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:border-purple-500/30'
                                                }`}
                                        >
                                            <span>{cond.icon}</span>
                                            {cond.label}
                                        </button>
                                    ))}
                                </div>
                                {workConditions.length > 0 && (
                                    <div className="space-y-1 pt-2 border-t border-slate-700/30">
                                        {workConditions.map(c => {
                                            const cond = WORK_CONDITIONS.find(wc => wc.value === c);
                                            return cond ? (
                                                <p key={c} className="text-[10px] text-purple-300">
                                                    {cond.icon} {cond.tip}
                                                </p>
                                            ) : null;
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 최종 선정 요약 */}
                    {(padShape || materialType || requiredPadCount > 0) && (
                        <div className="bg-gradient-to-r from-violet-600/10 to-purple-600/10 rounded-2xl border border-violet-500/30 p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <CheckCircle size={20} className="text-violet-400" />
                                선정 요약
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="bg-slate-800/30 p-3 rounded-xl">
                                    <p className="text-slate-500 text-xs mb-1">패드 형상</p>
                                    <p className="font-semibold text-white">{selectedShape?.label.split(' (')[0] || '-'}</p>
                                </div>
                                <div className="bg-slate-800/30 p-3 rounded-xl">
                                    <p className="text-slate-500 text-xs mb-1">패드 재질</p>
                                    <p className="font-semibold text-white">{selectedMaterial?.label.split(' (')[0] || '-'}</p>
                                </div>
                                <div className="bg-slate-800/30 p-3 rounded-xl">
                                    <p className="text-slate-500 text-xs mb-1">패드 직경</p>
                                    <p className="font-semibold text-emerald-300">Ø{padDiameter} mm</p>
                                </div>
                                <div className="bg-slate-800/30 p-3 rounded-xl">
                                    <p className="text-slate-500 text-xs mb-1">필요 개수</p>
                                    <p className="font-semibold text-violet-300">{requiredPadCount}개 이상</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
