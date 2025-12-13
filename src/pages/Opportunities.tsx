
import { useState, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Filter, Settings, RefreshCw, Plus, X, AlertCircle, Calendar, Trash2, Building2, Mail, Sparkles, LayoutGrid, List, GripVertical, MessageSquare } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { supabase } from '../lib/supabase';
import RentalManager from '../components/RentalManager';
import CompanyNews from '../components/CompanyNews';
import TodoList from '../components/TodoList';

const STAGE_OPTIONS = ['발굴', '제안', '견적', '협상', '계약 대기', '수주(성공)', '실주(실패)'];
const PROBABILITY_OPTIONS = ['10%', '30%', '50%', '80%', '100%'];
const OWNER_OPTIONS = ['탁현호', '임성렬'];
const OWNER_EMAILS: Record<string, string> = {
    '탁현호': 'hyeonho.tak@convum.com',
    '임성렬': 'sungryul.lim@convum.com'
};
const TIME_OPTIONS = Array.from({ length: 24 * 4 }, (_, i) => {
    const h = Math.floor(i / 4).toString().padStart(2, '0');
    const m = ((i % 4) * 15).toString().padStart(2, '0');
    return `${h}:${m}`;
});

interface Opportunity {
    id: string | number;
    title: string;
    company: string;
    value: number | string;
    stage: string;
    date: string;
    owner: string; // Internal Sales Rep
    contact_name?: string; // Customer Contact
    success_probability?: number;
    meeting_date?: string;
    created_at?: string;
    account_id?: string; // FK to accounts table
}

interface Memo {
    id: string;
    content: string;
    created_at: string;
    updated_at?: string;
    parent_id?: string | null;
    author?: string;
    ai_summary?: string;
}

export default function Opportunities() {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOpportunities();
    }, []);

    // Check for overdue opportunities and show alert
    useEffect(() => {
        if (opportunities.length > 0) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const overdue = opportunities.filter(op => {
                if (!op.date || op.stage === '수주(성공)' || op.stage === '실주(실패)') return false;
                const dueDate = new Date(op.date);
                dueDate.setHours(0, 0, 0, 0);
                return dueDate <= today;
            });

            if (overdue.length > 0) {
                setOverdueOpportunities(overdue);
                setShowOverdueAlert(true);

                // Play warning sound
                const playWarningSound = () => {
                    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();

                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);

                    oscillator.frequency.value = 800;
                    oscillator.type = 'square';
                    gainNode.gain.value = 0.3;

                    oscillator.start();

                    // Beep pattern: on-off-on-off-on
                    setTimeout(() => gainNode.gain.value = 0, 150);
                    setTimeout(() => gainNode.gain.value = 0.3, 300);
                    setTimeout(() => gainNode.gain.value = 0, 450);
                    setTimeout(() => gainNode.gain.value = 0.3, 600);
                    setTimeout(() => {
                        gainNode.gain.value = 0;
                        oscillator.stop();
                    }, 750);
                };

                playWarningSound();
            }
        }
    }, [opportunities]);

    const fetchOpportunities = async () => {
        try {
            setLoading(true);
            // Add a small delay to make the refresh action visible
            await new Promise(resolve => setTimeout(resolve, 500));

            const { data, error } = await supabase
                .from('opportunities')
                .select('*')
                .order('date', { ascending: true });

            if (error) throw error;
            setOpportunities(data || []);
        } catch (err: any) {
            console.error('Error fetching opportunities:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Sorting State
    const [sortConfig, setSortConfig] = useState<{ key: keyof Opportunity; direction: 'asc' | 'desc' } | null>(null);

    // Filter State
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<Record<string, string>>({});

    // Column Visibility State
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set([
        'title', 'company', 'value', 'stage', 'success_probability', 'date', 'meeting_date', 'owner', 'created_at'
    ]));

    // View Mode State (table or kanban)
    const [viewMode, setViewMode] = useState<'table' | 'kanban'>('kanban');

    // Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showOverdueAlert, setShowOverdueAlert] = useState(false);
    const [overdueOpportunities, setOverdueOpportunities] = useState<any[]>([]);

    // Form States
    const [newOpportunity, setNewOpportunity] = useState<{
        title: string;
        company: string;
        value: number | string;
        stage: string;
        date: string;
        owner: string;
        contact_name: string;
        success_probability?: number;
        meeting_date?: string;
        account_id?: string;
    }>({
        title: '',
        company: '',
        value: '',
        stage: STAGE_OPTIONS[0],
        date: '',
        owner: OWNER_OPTIONS[0],
        contact_name: '',
        success_probability: 10,
        meeting_date: ''
    });

    const [editingOpportunity, setEditingOpportunity] = useState<{
        id: string;
        title: string;
        company: string;
        value: number | string;
        stage: string;
        date: string;
        owner: string;
        contact_name: string;
        success_probability?: number;
        meeting_date?: string;
        account_id?: string;
    } | null>(null);



    // Memo State
    const [memos, setMemos] = useState<Memo[]>([]);
    const [newMemo, setNewMemo] = useState('');
    const [isMemoLoading, setIsMemoLoading] = useState(false);
    const [loadingAIForMemo, setLoadingAIForMemo] = useState<string | null>(null);
    const [loadingAISummaryForMemo, setLoadingAISummaryForMemo] = useState<string | null>(null);
    const [editingMemoId, setEditingMemoId] = useState<string | null>(null);
    const [editingMemoContent, setEditingMemoContent] = useState('');
    const [activeMenuMemoId, setActiveMenuMemoId] = useState<string | null>(null);
    const [replyToMemoId, setReplyToMemoId] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');

    const fetchMemos = async (opportunityId: string) => {
        try {
            setIsMemoLoading(true);
            const { data, error } = await supabase
                .from('opportunity_memos')
                .select('*')
                .eq('opportunity_id', opportunityId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setMemos(data || []);
        } catch (err) {
            console.error('Error fetching memos:', err);
        } finally {
            setIsMemoLoading(false);
        }
    };

    // Account Search State
    const [accountSearchQuery, setAccountSearchQuery] = useState('');
    const [searchedAccounts, setSearchedAccounts] = useState<{ id: number; name: string; address?: string }[]>([]);
    const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    // Account Popup State
    const [selectedAccountForPopup, setSelectedAccountForPopup] = useState<any>(null);

    const handleCompanyClick = async (companyName: string) => {
        try {
            const { data, error } = await supabase
                .from('accounts')
                .select('*')
                .eq('name', companyName)
                .single();

            if (error) throw error;
            if (data) {
                // Transform data to match Account interface if needed, or just use as is
                setSelectedAccountForPopup({
                    ...data,
                    contactName: data.contact_name,
                    registrationDate: data.registration_date,
                    mainPhone: data.main_phone
                });
            }
        } catch (err) {
            console.error('Error fetching account details:', err);
            // Optional: Show a toast or alert that account details were not found
        }
    };

    const DetailItem = ({ label, value, className = '' }: { label: string; value: string | number; className?: string }) => (
        <div className={`space-y-1 ${className}`}>
            <label className="text-xs font-medium text-muted-foreground uppercase">{label}</label>
            <div className="text-sm text-white font-medium break-words">{value}</div>
            {/* Account Details Modal */}
            {selectedAccountForPopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-xl font-semibold text-white">업체 정보</h2>
                            <button
                                onClick={() => setSelectedAccountForPopup(null)}
                                className="text-muted-foreground hover:text-muted-foreground transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[80vh]">
                            <div className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg border border-border mb-6">
                                <div className="w-12 h-12 rounded-lg bg-card border border-border flex items-center justify-center text-primary shadow-sm">
                                    <Building2 size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-white">{selectedAccountForPopup.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                        <span className="px-2 py-0.5 bg-card border border-border rounded text-xs">
                                            {selectedAccountForPopup.industry}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-xs border ${selectedAccountForPopup.status === 'Active' ? "bg-success/10 text-success border-green-200" : "bg-secondary/30 text-muted-foreground border-border"
                                            }`}>
                                            {selectedAccountForPopup.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <DetailItem label="No" value={selectedAccountForPopup.id} />
                                <DetailItem label="등록일" value={selectedAccountForPopup.registrationDate || '-'} />
                                <DetailItem label="업종" value={selectedAccountForPopup.industry} />
                                <DetailItem label="업체명" value={selectedAccountForPopup.name} />
                                <DetailItem label="대표전화" value={selectedAccountForPopup.mainPhone || '-'} />
                                <DetailItem label="홈페이지" value={selectedAccountForPopup.website || '-'} />
                                <DetailItem label="주소" value={selectedAccountForPopup.address || '-'} className="sm:col-span-2" />
                                <DetailItem label="부서" value={selectedAccountForPopup.department || '-'} />
                                <DetailItem label="직급" value={selectedAccountForPopup.position || '-'} />
                                <DetailItem label="담당자명" value={selectedAccountForPopup.contactName || '-'} />
                                <DetailItem label="휴대전화" value={selectedAccountForPopup.phone} />
                                <DetailItem label="이메일" value={selectedAccountForPopup.email} />
                                <DetailItem label="담당자" value={selectedAccountForPopup.owner} />
                                <DetailItem label="거래상태" value={selectedAccountForPopup.status} />
                                <DetailItem label="등급" value={selectedAccountForPopup.grade || '-'} />
                                <DetailItem label="유입경로" value={selectedAccountForPopup.type} />
                                <DetailItem label="비고" value={selectedAccountForPopup.note || '-'} className="sm:col-span-2" />
                            </div>
                        </div>

                        <div className="p-4 bg-secondary/30 border-t border-border flex justify-end">
                            <button
                                onClick={() => setSelectedAccountForPopup(null)}
                                className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/30 transition-colors"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    const searchAccounts = async (query: string) => {
        console.log('Searching accounts with query:', query);
        if (!query.trim()) {
            setSearchedAccounts([]);
            return;
        }

        setIsSearching(true);
        try {
            const { data, error } = await supabase
                .from('accounts')
                .select('id, name, address')
                .ilike('name', `%${query}%`)
                .limit(5);

            if (error) throw error;
            console.log('Search results:', data);
            setSearchedAccounts(data || []);
        } catch (err) {
            console.error('Error searching accounts:', err);
        } finally {
            setIsSearching(false);
        }
    };

    const handleCompanyInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (isEditModalOpen && editingOpportunity) {
            setEditingOpportunity(prev => prev ? { ...prev, company: value } : null);
        } else {
            setNewOpportunity(prev => ({ ...prev, company: value }));
        }
        setAccountSearchQuery(value);
        setIsAccountDropdownOpen(true);
        searchAccounts(value);
    };

    const handleCompanyInputBlur = () => {
        // Delay to allow dropdown click to happen first
        setTimeout(() => {
            setIsAccountDropdownOpen(false);
            const companyName = isEditModalOpen && editingOpportunity ? editingOpportunity.company : newOpportunity.company;
            if (companyName) {
                fetchContacts(companyName);
            }
        }, 200);
    };

    // Contact Search State
    const [contactOptions, setContactOptions] = useState<string[]>([]);
    const [isContactDropdownOpen, setIsContactDropdownOpen] = useState(false);

    const fetchContacts = async (companyName: string) => {
        try {
            // 1. Get Account ID
            const { data: accountData, error: accountError } = await supabase
                .from('accounts')
                .select('id')
                .eq('name', companyName)
                .single();

            if (accountError) {
                // If account not found, maybe it's a new company or error. 
                // Just clear options.
                setContactOptions([]);
                return [];
            }

            if (!accountData) {
                setContactOptions([]);
                return [];
            }

            // 2. Get Contacts linked to this Account
            const { data: contactData, error: contactError } = await supabase
                .from('contacts')
                .select('name')
                .eq('account_id', accountData.id);

            if (contactError) throw contactError;

            // Extract unique contact names
            const contacts = Array.from(new Set(contactData?.map(d => d.name).filter(Boolean) || []));
            setContactOptions(contacts);
            return contacts;
        } catch (err) {
            console.error('Error fetching contacts:', err);
            setContactOptions([]);
            return [];
        }
    };

    const [selectedAccountAddress, setSelectedAccountAddress] = useState<string>('');

    const handleSelectCompany = async (companyName: string, address?: string, accountId?: string) => {
        setNewOpportunity(prev => ({ ...prev, company: companyName, account_id: accountId }));
        if (editingOpportunity) {
            setEditingOpportunity(prev => prev ? { ...prev, company: companyName, account_id: accountId } : null);
        }
        setAccountSearchQuery(companyName);
        setIsAccountDropdownOpen(false);
        if (address) setSelectedAccountAddress(address);

        const contacts = await fetchContacts(companyName);

        if (contacts && contacts.length === 1) {
            const contactName = contacts[0];
            setNewOpportunity(prev => ({ ...prev, contact_name: contactName }));
            if (editingOpportunity) {
                setEditingOpportunity(prev => prev ? { ...prev, contact_name: contactName } : null);
            }
        } else {
            // Clear contact if multiple or none, to force selection
            setNewOpportunity(prev => ({ ...prev, contact_name: '' }));
            if (editingOpportunity) {
                setEditingOpportunity(prev => prev ? { ...prev, contact_name: '' } : null);
            }
        }
    };

    const handleSort = (key: keyof Opportunity) => {
        setSortConfig(current => {
            if (current?.key === key) {
                return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
            }
            return { key, direction: 'asc' };
        });
    };

    const toggleColumnVisibility = (columnKey: string) => {
        const newVisibleColumns = new Set(visibleColumns);
        if (newVisibleColumns.has(columnKey)) {
            newVisibleColumns.delete(columnKey);
        } else {
            newVisibleColumns.add(columnKey);
        }
        setVisibleColumns(newVisibleColumns);
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const saveOpportunityData = async () => {
        if (!editingOpportunity) return false;

        const updatedItem: Record<string, any> = {
            title: editingOpportunity.title,
            company: editingOpportunity.company,
            value: editingOpportunity.value === '' ? 0 : Number(editingOpportunity.value),
            stage: editingOpportunity.stage,
            date: editingOpportunity.date,
            owner: editingOpportunity.owner,
            contact_name: editingOpportunity.contact_name,
            success_probability: Number(String(editingOpportunity.success_probability).replace('%', '')),
            meeting_date: editingOpportunity.meeting_date || null
        };

        // Add account_id if present
        if (editingOpportunity.account_id) {
            updatedItem.account_id = editingOpportunity.account_id;
        }

        try {
            const { data, error } = await supabase
                .from('opportunities')
                .update(updatedItem)
                .eq('id', editingOpportunity.id)
                .select();

            if (error) throw error;

            if (data) {
                setOpportunities(prev => prev.map(op =>
                    String(op.id) === String(editingOpportunity.id) ? data[0] : op
                ));
            }
            return true;
        } catch (err: any) {
            console.error('Error updating opportunity:', err);
            alert('Failed to update opportunity: ' + err.message);
            return false;
        }
    };

    const handleSaveAndAddToCalendar = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingOpportunity) return;

        // 1. Save the opportunity first (without closing modal)
        await saveOpportunityData();

        // 2. Construct Google Calendar URL
        const title = `[미팅] ${editingOpportunity.company}&${editingOpportunity.contact_name || ''}`;
        const details = memos.map(m => m.content).join('\n\n');
        const location = selectedAccountAddress || '';

        let dates = '';
        if (editingOpportunity.meeting_date) {
            const startDate = new Date(editingOpportunity.meeting_date);
            const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // Default 1 hour duration

            const formatTime = (date: Date) => date.toISOString().replace(/-|:|\.\d\d\d/g, '');
            dates = `${formatTime(startDate)}/${formatTime(endDate)}`;
        }

        const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}&dates=${dates}&src=3389a03d658044a4d9742c96152c6c7fe91df85c869d167453c1c87825fd494f@group.calendar.google.com`;

        window.open(calendarUrl, '_blank');
    };

    const handleUpdateMemo = async (id: string) => {
        if (!editingMemoContent.trim()) return;

        try {
            const { error } = await supabase
                .from('opportunity_memos')
                .update({
                    content: editingMemoContent,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;

            setEditingMemoId(null);
            setEditingMemoContent('');
            if (editingOpportunity) {
                fetchMemos(editingOpportunity.id);
            }
        } catch (err: any) {
            console.error('Error updating memo:', err);
            alert('메모 수정 실패: ' + err.message);
        }
    };

    const handleSendEmail = (memoContent: string) => {
        if (!editingOpportunity) return;

        const ownerEmail = OWNER_EMAILS[editingOpportunity.owner] || '';
        const subject = `[F/U 요청] ${editingOpportunity.title} - ${editingOpportunity.company}`;
        const body = memoContent;

        const mailtoLink = `mailto:${ownerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
    };

    const handleAIFollowUp = async (memoId: string, content: string) => {
        setLoadingAIForMemo(memoId);
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        if (!apiKey) {
            alert('GEMINI API 키가 설정되지 않았습니다.');
            setLoadingAIForMemo(null);
            return;
        }

        try {
            const prompt = `너는 유능한 영업 비서야. 사용자가 입력한 미팅 내용을 바탕으로 향후 F/U(Follow-up)해야 할 핵심 내용을 4가지로 간략하게 요약해서 번호 매겨서 정리해줘.
각 항목은 군더더기 없이 핵심 행동이나 내용만 명확하게 작성해줘.
(미팅 내용에 기반하여) 와 같은 괄호 설명이나 부연 설명은 절대 포함하지 마.

반드시 아래 형식으로만 출력해줘:
F/U 제안
1. [핵심 내용]
2. [핵심 내용]
3. [핵심 내용]
4. [핵심 내용]

[미팅 내용]
${content}`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message);
            }

            const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!aiResponse) {
                throw new Error('AI 응답을 받아오지 못했습니다.');
            }

            // Add AI response as a reply (child memo)
            const { error } = await supabase
                .from('opportunity_memos')
                .insert([{
                    opportunity_id: editingOpportunity?.id,
                    content: aiResponse,
                    parent_id: memoId,
                    author: 'AI Assistant'
                }]);

            if (error) throw error;

            fetchMemos(editingOpportunity!.id);

        } catch (err: any) {
            console.error('Error calling Gemini API:', err);
            alert('AI 분석 중 오류가 발생했습니다: ' + err.message);
        } finally {
            setLoadingAIForMemo(null);
        }
    };

    // AI 메모 정리 함수 - Gemini를 사용하여 메모 내용을 깔끔하게 정리
    const handleAISummary = async (memoId: string, content: string) => {
        setLoadingAISummaryForMemo(memoId);
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        if (!apiKey) {
            alert('GEMINI API 키가 설정되지 않았습니다.');
            setLoadingAISummaryForMemo(null);
            return;
        }

        try {
            const prompt = `너는 유능한 영업 비서야. 다음 영업 메모를 깔끔하게 정리해줘.

## 정리 규칙:
1. 핵심 내용을 bullet point로 요약
2. 날짜, 담당자, 업체명 등 중요 정보 강조
3. 주요 액션 아이템이 있다면 "📌 액션 아이템" 섹션으로 분리
4. 간결하고 명확하게 작성
5. 불필요한 설명 없이 핵심만 작성

[메모 내용]
${content}

## 정리 결과:`;

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }]
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message);
            }

            const aiSummary = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!aiSummary) {
                throw new Error('AI 정리 결과를 받아오지 못했습니다.');
            }

            // Add AI summary as a reply with [AI 정리] prefix
            const { error } = await supabase
                .from('opportunity_memos')
                .insert([{
                    opportunity_id: editingOpportunity?.id,
                    content: `📋 **AI 정리**\n\n${aiSummary}`,
                    parent_id: memoId,
                    author: 'AI Assistant'
                }]);

            if (error) throw error;

            fetchMemos(editingOpportunity!.id);

        } catch (err: any) {
            console.error('Error calling Gemini API for summary:', err);
            alert('AI 정리 중 오류가 발생했습니다: ' + err.message);
        } finally {
            setLoadingAISummaryForMemo(null);
        }
    };

    const startEditingMemo = (memo: Memo) => {
        setEditingMemoId(memo.id);
        setEditingMemoContent(memo.content);
    };

    const handleAddMemo = async () => {
        if (!newMemo.trim() || !editingOpportunity) return;

        try {
            const { error } = await supabase
                .from('opportunity_memos')
                .insert([{
                    opportunity_id: editingOpportunity.id,
                    content: newMemo
                }]);

            if (error) throw error;

            setNewMemo('');
            fetchMemos(editingOpportunity!.id);
        } catch (err: any) {
            console.error('Error adding memo:', err);
            alert('메모 추가에 실패했습니다.');
        }
    };

    const handleAddReply = async (parentMemoId: string) => {
        if (!replyContent.trim() || !editingOpportunity) return;

        try {
            const { error } = await supabase
                .from('opportunity_memos')
                .insert([{
                    opportunity_id: editingOpportunity.id,
                    content: replyContent,
                    parent_id: parentMemoId
                }]);

            if (error) throw error;

            setReplyContent('');
            setReplyToMemoId(null);
            fetchMemos(editingOpportunity!.id);
        } catch (err: any) {
            console.error('Error adding reply:', err);
            alert('댓글 추가에 실패했습니다.');
        }
    };

    const handleDeleteMemo = async (id: string) => {
        if (!confirm('정말로 이 메모를 삭제하시겠습니까?')) return;

        try {
            const { error } = await supabase
                .from('opportunity_memos')
                .delete()
                .eq('id', id);

            if (error) throw error;

            fetchMemos(editingOpportunity!.id);
        } catch (err: any) {
            console.error('Error deleting memo:', err);
            alert('메모 삭제에 실패했습니다.');
        }
    };

    // Drag and Drop Handler
    const handleDragEnd = async (result: DropResult) => {
        const { draggableId, destination, source } = result;

        // If dropped outside a droppable area or same position
        if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        }

        const newStage = destination.droppableId;
        const opportunityId = draggableId;

        // Optimistically update the local state
        setOpportunities(prev => prev.map(op =>
            String(op.id) === opportunityId ? { ...op, stage: newStage } : op
        ));

        try {
            const { error } = await supabase
                .from('opportunities')
                .update({ stage: newStage })
                .eq('id', opportunityId);

            if (error) throw error;

            console.log(`Opportunity ${opportunityId} moved to ${newStage}`);
        } catch (err: any) {
            console.error('Error updating stage:', err);
            alert('단계 변경에 실패했습니다. 페이지를 새로고침해주세요.');
            // Revert on error
            fetchOpportunities();
        }
    };

    const filteredOpportunities = useMemo(() => {
        // Start with all opportunities
        let data = [...opportunities];

        // Global search filter
        if (searchQuery) {
            const lowerQuery = searchQuery.toLowerCase();
            data = data.filter(op =>
                op.title.toLowerCase().includes(lowerQuery) ||
                op.company.toLowerCase().includes(lowerQuery)
            );
        }

        // Column-specific filters
        Object.entries(filters).forEach(([key, value]) => {
            if (!value) return;
            const lowerValue = value.toLowerCase();
            data = data.filter(op => {
                const field = (op as any)[key];
                if (field === undefined || field === null) return false;
                return String(field).toLowerCase().includes(lowerValue);
            });
        });

        // Sorting
        if (sortConfig) {
            const { key, direction } = sortConfig;
            data.sort((a, b) => {
                const aVal = (a as any)[key];
                const bVal = (b as any)[key];
                if (typeof aVal === 'number' && typeof bVal === 'number') {
                    return direction === 'asc' ? aVal - bVal : bVal - aVal;
                }
                return direction === 'asc'
                    ? String(aVal).localeCompare(String(bVal))
                    : String(bVal).localeCompare(String(aVal));
            });
        }

        return data;
    }, [opportunities, searchQuery, filters, sortConfig]);
    // Removed duplicate filteredOpportunities definition; sorting and filters are now handled in the primary useMemo above.

    const formatCurrency = (value: number | string) => {
        if (value === '' || value === 0) return '0원';
        return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(Number(value));
    };

    const toggleSelectAll = () => {
        if (selectedItems.length === filteredOpportunities.length) {
            setSelectedItems([]);
        } else {
            setSelectedItems(filteredOpportunities.map(op => String(op.id)));
        }
    };

    const toggleSelectItem = (id: string) => {
        if (selectedItems.includes(id)) {
            setSelectedItems(selectedItems.filter(item => item !== id));
        } else {
            setSelectedItems([...selectedItems, id]);
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedItems.length === 0) return;

        if (!confirm(`${selectedItems.length}개의 항목을 삭제하시겠습니까?`)) return;

        try {
            const { error } = await supabase
                .from('opportunities')
                .delete()
                .in('id', selectedItems);

            if (error) throw error;

            setSelectedItems([]);
            await fetchOpportunities();
            setIsMenuOpen(false);
            alert('삭제되었습니다.');
        } catch (err: any) {
            console.error('Error deleting opportunities:', err);
            alert('삭제 중 오류가 발생했습니다: ' + err.message);
        }
    };

    const handleStageChange = async (id: string, newStage: string) => {
        // Optimistic update
        setOpportunities(opportunities.map(op =>
            String(op.id) === id ? { ...op, stage: newStage } : op
        ));

        const { error } = await supabase
            .from('opportunities')
            .update({ stage: newStage })
            .eq('id', id);

        if (error) {
            console.error('Error updating stage:', error);
            fetchOpportunities(); // Revert on error
        }
    };

    const handleOwnerChange = async (id: string, newOwner: string) => {
        // Optimistic update
        setOpportunities(opportunities.map(op =>
            String(op.id) === id ? { ...op, owner: newOwner } : op
        ));

        const { error } = await supabase
            .from('opportunities')
            .update({ owner: newOwner })
            .eq('id', id);

        if (error) {
            console.error('Error updating owner:', error);
            fetchOpportunities(); // Revert on error
        }
    };

    // Create Handlers
    const handleCreateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let newValue: any = value;

        if (name === 'value') {
            const numericValue = value.replace(/,/g, '');
            if (isNaN(Number(numericValue))) return;
            newValue = numericValue === '' ? '' : Number(numericValue);
        } else if (name === 'success_probability') {
            newValue = parseInt(value.replace('%', ''));
        }

        setNewOpportunity(prev => ({
            ...prev,
            [name]: newValue
        }));
    };

    const handleCreateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newItem = {
            ...newOpportunity,
            value: newOpportunity.value === '' ? 0 : Number(newOpportunity.value),
            success_probability: Number(String(newOpportunity.success_probability).replace('%', '')),
            meeting_date: null
        };

        const { data, error } = await supabase
            .from('opportunities')
            .insert([newItem])
            .select();

        if (error) {
            console.error('Error creating opportunity:', error);
            alert('Failed to create opportunity: ' + error.message);
            return;
        }

        if (data) {
            setOpportunities([data[0], ...opportunities]);
        }

        setIsCreateModalOpen(false);
        setNewOpportunity({
            title: '',
            company: '',
            value: '',
            stage: STAGE_OPTIONS[0],
            date: '',
            owner: OWNER_OPTIONS[0],
            contact_name: '',
            success_probability: 10,
            meeting_date: ''
        });
    };

    // Edit Handlers
    const handleTitleClick = (op: any) => {
        setEditingOpportunity({
            id: String(op.id),
            title: op.title,
            company: op.company,
            value: op.value,
            stage: op.stage,
            date: op.date,
            owner: op.owner,
            contact_name: op.contact_name || '',
            success_probability: op.success_probability || 10,
            meeting_date: op.meeting_date ? op.meeting_date.slice(0, 16) : '',
            account_id: op.account_id || undefined
        });
        fetchMemos(String(op.id));
        setNewMemo(''); // Reset memo input
        fetchAccountAddress(op.company);
        setIsEditModalOpen(true);
    };

    const fetchAccountAddress = async (companyName: string) => {
        try {
            const { data } = await supabase
                .from('accounts')
                .select('address')
                .eq('name', companyName)
                .maybeSingle();

            if (data) {
                setSelectedAccountAddress(data.address || '');
            } else {
                setSelectedAccountAddress('');
            }
        } catch (err) {
            console.error('Error fetching address:', err);
            setSelectedAccountAddress('');
        }
    };

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        if (!editingOpportunity) return;
        const { name, value } = e.target;
        let newValue: any = value;

        if (name === 'value') {
            const numericValue = value.replace(/,/g, '');
            if (isNaN(Number(numericValue))) return;
            newValue = numericValue === '' ? '' : Number(numericValue);
        } else if (name === 'success_probability') {
            newValue = parseInt(value.replace('%', ''));
        }

        setEditingOpportunity(prev => ({
            ...prev!,
            [name]: newValue
        }));
    };



    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await saveOpportunityData();
        setIsEditModalOpen(false);
        setEditingOpportunity(null);
    };

    return (
        <div className="h-full flex flex-col bg-card rounded-lg border border-border shadow-sm overflow-hidden relative">
            {/* Config Warning */}
            {import.meta.env.VITE_SUPABASE_URL?.includes('YOUR_SUPABASE_URL') && (
                <div className="bg-yellow-50 border-b border-yellow-200 p-4 flex items-center gap-3 text-yellow-800">
                    <AlertCircle size={20} />
                    <div>
                        <p className="font-medium">Supabase Configuration Required</p>
                        <p className="text-sm">Please update your <code className="bg-yellow-100 px-1 rounded">.env</code> file with your Supabase project URL and Anon Key.</p>
                    </div>
                </div>
            )}

            {/* Error Alert */}
            {error && (
                <div className="bg-danger/10 border-b border-danger/20 p-4 flex items-center gap-3 text-red-800">
                    <AlertCircle size={20} />
                    <div>
                        <p className="font-medium">Error</p>
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            )}

            {/* Toolbar */}
            <div className="flex items-center justify-between p-2 border-b border-border bg-secondary/30/50">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                        <input
                            type="text"
                            placeholder="이 목록 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8 pr-3 py-1 text-sm bg-secondary text-white border border-border rounded focus:outline-none focus:border-accent w-64"
                        />
                    </div>
                    <div className="relative">
                        <button
                            className={`p-1.5 text-muted-foreground hover:bg-secondary rounded border border-border bg-card ${isSettingsOpen ? 'bg-secondary' : ''}`}
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            title="설정"
                        >
                            <Settings size={14} />
                        </button>
                        {isSettingsOpen && (
                            <div className="absolute left-0 top-full mt-1 w-48 bg-card rounded-lg shadow-lg border border-border p-2 z-50">
                                <div className="text-xs font-semibold text-muted-foreground mb-2 px-2">표시할 열 선택</div>
                                <div className="space-y-1">
                                    {[
                                        { key: 'title', label: '안건' },
                                        { key: 'company', label: '업체명' },
                                        { key: 'value', label: '예상 매출액' },
                                        { key: 'stage', label: '진행 단계' },
                                        { key: 'success_probability', label: '성공 확률' },
                                        { key: 'date', label: '마감 일자' },
                                        { key: 'meeting_date', label: '미팅 일자' },
                                        { key: 'owner', label: '영업 담당자' },
                                        { key: 'created_at', label: '등록일' }
                                    ].map(col => (
                                        <label key={col.key} className="flex items-center gap-2 px-2 py-1 hover:bg-secondary/30 rounded cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={visibleColumns.has(col.key)}
                                                onChange={() => toggleColumnVisibility(col.key)}
                                                className="rounded border-border text-accent focus:ring-accent"
                                            />
                                            <span className="text-sm text-muted-foreground">{col.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                    <button
                        className={`p-1.5 text-muted-foreground hover:bg-secondary rounded border border-border bg-card ${showFilters ? 'bg-accent/10 border-accent/20 text-accent' : ''}`}
                        onClick={() => setShowFilters(!showFilters)}
                        title="필터"
                    >
                        <Filter size={14} />
                    </button>
                    <button
                        onClick={fetchOpportunities}
                        className="p-1.5 text-muted-foreground hover:bg-secondary rounded border border-border bg-card"
                        title="새로고침"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    </button>

                </div>

                <div className="hidden md:flex items-center gap-3 px-5 py-2.5 rounded-full border-2 animate-pulse-glow relative overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.3) 50%, rgba(239, 68, 68, 0.2) 100%)',
                        borderColor: 'rgba(239, 68, 68, 0.5)',
                        boxShadow: '0 0 20px rgba(239, 68, 68, 0.3), inset 0 0 20px rgba(239, 68, 68, 0.1)'
                    }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent animate-shimmer"></div>
                    <AlertCircle size={18} className="text-red-400 animate-bounce-slow relative z-10" />
                    <span className="text-sm font-bold text-red-400 tracking-wide relative z-10">
                        ⚠️ 모든 안건은 14일 안에 재접촉할 것
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground mr-2">{filteredOpportunities.length}개 항목 • 정렬 기준: {sortConfig ? (sortConfig.direction === 'asc' ? '오름차순' : '내림차순') : '기본'}</span>

                    {/* View Mode Toggle */}
                    <div className="flex items-center bg-secondary/50 rounded-lg p-1 border border-border">
                        <button
                            onClick={() => setViewMode('table')}
                            className={`p-1.5 rounded transition-colors ${viewMode === 'table' ? 'bg-accent text-white' : 'text-muted-foreground hover:text-white'}`}
                            title="테이블 보기"
                        >
                            <List size={16} />
                        </button>
                        <button
                            onClick={() => setViewMode('kanban')}
                            className={`p-1.5 rounded transition-colors ${viewMode === 'kanban' ? 'bg-accent text-white' : 'text-muted-foreground hover:text-white'}`}
                            title="칸반 보기"
                        >
                            <LayoutGrid size={16} />
                        </button>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors"
                        >
                            기능
                            <ChevronDown size={16} />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border py-1 z-50">
                                <button
                                    onClick={() => {
                                        setIsCreateModalOpen(true);
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-muted-foreground hover:bg-secondary/30"
                                >
                                    <Plus size={16} />
                                    새로 만들기
                                </button>
                                <button
                                    onClick={handleDeleteSelected}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-danger hover:bg-danger/10"
                                >
                                    <Trash2 size={16} />
                                    삭제
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Table View */}
            {viewMode === 'table' && (
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-secondary/30 sticky top-0 z-10">
                            <tr>
                                <th className="p-2 border-b border-border w-10 text-center">
                                    <input
                                        type="checkbox"
                                        className="rounded border-border text-accent focus:ring-accent"
                                        checked={selectedItems.length === filteredOpportunities.length && filteredOpportunities.length > 0}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                {visibleColumns.has('title') && (
                                    <th className="p-2 border-b border-border text-center text-base font-bold text-muted-foreground min-w-[200px]" onClick={() => handleSort('title')}>
                                        <div className="flex items-center justify-center cursor-pointer hover:text-white group">
                                            안건
                                            {sortConfig?.key === 'title' ? (
                                                <ChevronDown size={12} className={`ml-1 transition-transform ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                                            ) : (
                                                <ChevronDown size={12} className="ml-1 opacity-0 group-hover:opacity-50" />
                                            )}
                                        </div>
                                    </th>
                                )}
                                {visibleColumns.has('company') && (
                                    <th className="p-2 border-b border-border text-center text-base font-bold text-muted-foreground min-w-[150px]" onClick={() => handleSort('company')}>
                                        <div className="flex items-center justify-center cursor-pointer hover:text-white group">
                                            업체명
                                            {sortConfig?.key === 'company' ? (
                                                <ChevronDown size={12} className={`ml-1 transition-transform ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                                            ) : (
                                                <ChevronDown size={12} className="ml-1 opacity-0 group-hover:opacity-50" />
                                            )}
                                        </div>
                                    </th>
                                )}
                                {visibleColumns.has('value') && (
                                    <th className="p-2 border-b border-border text-center text-base font-bold text-muted-foreground min-w-[120px]" onClick={() => handleSort('value')}>
                                        <div className="flex items-center justify-center cursor-pointer hover:text-white group">
                                            예상 매출액
                                            {sortConfig?.key === 'value' ? (
                                                <ChevronDown size={12} className={`ml-1 transition-transform ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                                            ) : (
                                                <ChevronDown size={12} className="ml-1 opacity-0 group-hover:opacity-50" />
                                            )}
                                        </div>
                                    </th>
                                )}
                                {visibleColumns.has('stage') && (
                                    <th className="p-2 border-b border-border text-center text-base font-bold text-muted-foreground min-w-[120px]" onClick={() => handleSort('stage')}>
                                        <div className="flex items-center justify-center cursor-pointer hover:text-white group">
                                            진행 단계
                                            {sortConfig?.key === 'stage' ? (
                                                <ChevronDown size={12} className={`ml-1 transition-transform ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                                            ) : (
                                                <ChevronDown size={12} className="ml-1 opacity-0 group-hover:opacity-50" />
                                            )}
                                        </div>
                                    </th>
                                )}
                                {visibleColumns.has('success_probability') && (
                                    <th className="p-2 border-b border-border text-center text-base font-bold text-muted-foreground min-w-[100px]" onClick={() => handleSort('success_probability')}>
                                        <div className="flex items-center justify-center cursor-pointer hover:text-white group">
                                            성공 확률
                                            {sortConfig?.key === 'success_probability' ? (
                                                <ChevronDown size={12} className={`ml-1 transition-transform ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                                            ) : (
                                                <ChevronDown size={12} className="ml-1 opacity-0 group-hover:opacity-50" />
                                            )}
                                        </div>
                                    </th>
                                )}
                                {visibleColumns.has('date') && (
                                    <th className="p-2 border-b border-border text-center text-base font-bold text-muted-foreground min-w-[100px]" onClick={() => handleSort('date')}>
                                        <div className="flex items-center justify-center cursor-pointer hover:text-white group">
                                            마감 일자
                                            {sortConfig?.key === 'date' ? (
                                                <ChevronDown size={12} className={`ml-1 transition-transform ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                                            ) : (
                                                <ChevronDown size={12} className="ml-1 opacity-0 group-hover:opacity-50" />
                                            )}
                                        </div>
                                    </th>
                                )}
                                {visibleColumns.has('meeting_date') && (
                                    <th className="p-2 border-b border-border text-center text-base font-bold text-muted-foreground min-w-[100px]" onClick={() => handleSort('meeting_date')}>
                                        <div className="flex items-center justify-center cursor-pointer hover:text-white group">
                                            미팅 일자
                                            {sortConfig?.key === 'meeting_date' ? (
                                                <ChevronDown size={12} className={`ml-1 transition-transform ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                                            ) : (
                                                <ChevronDown size={12} className="ml-1 opacity-0 group-hover:opacity-50" />
                                            )}
                                        </div>
                                    </th>
                                )}
                                {visibleColumns.has('owner') && (
                                    <th className="p-2 border-b border-border text-center text-base font-bold text-muted-foreground min-w-[100px]" onClick={() => handleSort('owner')}>
                                        <div className="flex items-center justify-center cursor-pointer hover:text-white group">
                                            영업 담당자
                                            {sortConfig?.key === 'owner' ? (
                                                <ChevronDown size={12} className={`ml-1 transition-transform ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                                            ) : (
                                                <ChevronDown size={12} className="ml-1 opacity-0 group-hover:opacity-50" />
                                            )}
                                        </div>
                                    </th>
                                )}
                                {visibleColumns.has('created_at') && (
                                    <th className="p-2 border-b border-border text-center text-base font-bold text-muted-foreground min-w-[100px]" onClick={() => handleSort('created_at')}>
                                        <div className="flex items-center justify-center cursor-pointer hover:text-white group">
                                            등록일
                                            {sortConfig?.key === 'created_at' ? (
                                                <ChevronDown size={12} className={`ml-1 transition-transform ${sortConfig.direction === 'asc' ? 'rotate-180' : ''}`} />
                                            ) : (
                                                <ChevronDown size={12} className="ml-1 opacity-0 group-hover:opacity-50" />
                                            )}
                                        </div>
                                    </th>
                                )}
                                <th className="p-2 border-b border-border w-10"></th>
                            </tr>
                            {/* Filter Row */}
                            {showFilters && (
                                <tr className="bg-secondary/30">
                                    <th className="p-2 border-b border-border"></th>
                                    {visibleColumns.has('title') && (
                                        <th className="p-2 border-b border-border">
                                            <input
                                                type="text"
                                                placeholder="필터..."
                                                value={filters.title || ''}
                                                onChange={(e) => handleFilterChange('title', e.target.value)}
                                                className="w-full px-2 py-1 text-xs bg-secondary text-white border border-border rounded focus:outline-none focus:border-accent"
                                            />
                                        </th>
                                    )}
                                    {visibleColumns.has('company') && (
                                        <th className="p-2 border-b border-border">
                                            <input
                                                type="text"
                                                placeholder="필터..."
                                                value={filters.company || ''}
                                                onChange={(e) => handleFilterChange('company', e.target.value)}
                                                className="w-full px-2 py-1 text-xs bg-secondary text-white border border-border rounded focus:outline-none focus:border-accent"
                                            />
                                        </th>
                                    )}
                                    {visibleColumns.has('value') && (
                                        <th className="p-2 border-b border-border">
                                            <input
                                                type="text"
                                                placeholder="필터..."
                                                value={filters.value || ''}
                                                onChange={(e) => handleFilterChange('value', e.target.value)}
                                                className="w-full px-2 py-1 text-xs bg-secondary text-white border border-border rounded focus:outline-none focus:border-accent"
                                            />
                                        </th>
                                    )}
                                    {visibleColumns.has('stage') && (
                                        <th className="p-2 border-b border-border">
                                            <select
                                                value={filters.stage || ''}
                                                onChange={(e) => handleFilterChange('stage', e.target.value)}
                                                className="w-full px-2 py-1 text-xs bg-secondary text-white border border-border rounded focus:outline-none focus:border-accent"
                                            >
                                                <option value="">전체</option>
                                                {STAGE_OPTIONS.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </th>
                                    )}
                                    {visibleColumns.has('success_probability') && (
                                        <th className="p-2 border-b border-border">
                                            <input
                                                type="text"
                                                placeholder="필터..."
                                                value={filters.success_probability || ''}
                                                onChange={(e) => handleFilterChange('success_probability', e.target.value)}
                                                className="w-full px-2 py-1 text-xs bg-secondary text-white border border-border rounded focus:outline-none focus:border-accent"
                                            />
                                        </th>
                                    )}
                                    {visibleColumns.has('date') && (
                                        <th className="p-2 border-b border-border">
                                            <input
                                                type="text"
                                                placeholder="필터..."
                                                value={filters.date || ''}
                                                onChange={(e) => handleFilterChange('date', e.target.value)}
                                                className="w-full px-2 py-1 text-xs bg-secondary text-white border border-border rounded focus:outline-none focus:border-accent"
                                            />
                                        </th>
                                    )}
                                    {visibleColumns.has('meeting_date') && (
                                        <th className="p-2 border-b border-border">
                                            <input
                                                type="text"
                                                placeholder="필터..."
                                                value={filters.meeting_date || ''}
                                                onChange={(e) => handleFilterChange('meeting_date', e.target.value)}
                                                className="w-full px-2 py-1 text-xs bg-secondary text-white border border-border rounded focus:outline-none focus:border-accent"
                                            />
                                        </th>
                                    )}
                                    {visibleColumns.has('owner') && (
                                        <th className="p-2 border-b border-border">
                                            <select
                                                value={filters.owner || ''}
                                                onChange={(e) => handleFilterChange('owner', e.target.value)}
                                                className="w-full px-2 py-1 text-xs bg-secondary text-white border border-border rounded focus:outline-none focus:border-accent"
                                            >
                                                <option value="">전체</option>
                                                {OWNER_OPTIONS.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </th>
                                    )}
                                    {visibleColumns.has('created_at') && (
                                        <th className="p-2 border-b border-border">
                                            <input
                                                type="text"
                                                placeholder="필터..."
                                                value={filters.created_at || ''}
                                                onChange={(e) => handleFilterChange('created_at', e.target.value)}
                                                className="w-full px-2 py-1 text-xs bg-secondary text-white border border-border rounded focus:outline-none focus:border-accent"
                                            />
                                        </th>
                                    )}
                                    <th className="p-2 border-b border-border"></th>
                                </tr>
                            )}
                        </thead>
                        <tbody className="divide-y divide-border">
                            {filteredOpportunities.map((op) => (
                                <tr key={op.id} className="hover:bg-secondary/30 group transition-colors">
                                    <td className="px-3 py-4 text-center">
                                        <input
                                            type="checkbox"
                                            className="rounded border-border text-accent focus:ring-accent w-4 h-4"
                                            checked={selectedItems.includes(String(op.id))}
                                            onChange={() => toggleSelectItem(String(op.id))}
                                        />
                                    </td>
                                    {visibleColumns.has('title') && (
                                        <td className="px-3 py-4 font-semibold text-accent hover:underline cursor-pointer text-base" onClick={() => handleTitleClick(op)}>
                                            {op.title}
                                        </td>
                                    )}
                                    {visibleColumns.has('company') && (
                                        <td className="px-3 py-4">
                                            <button
                                                onClick={() => handleCompanyClick(op.company)}
                                                className="text-white/80 hover:text-accent hover:underline text-left text-base"
                                            >
                                                {op.company}
                                            </button>
                                        </td>
                                    )}
                                    {visibleColumns.has('value') && (
                                        <td className="px-3 py-4 text-white font-medium text-base">
                                            {formatCurrency(op.value)}
                                        </td>
                                    )}
                                    {visibleColumns.has('stage') && (
                                        <td className="px-3 py-4">
                                            <div className="relative group/edit">
                                                <select
                                                    value={op.stage}
                                                    onChange={(e) => handleStageChange(String(op.id), e.target.value)}
                                                    className="appearance-none bg-transparent w-full pr-6 py-1 text-emerald-400 font-medium text-base focus:outline-none focus:bg-card focus:ring-1 focus:ring-accent rounded cursor-pointer"
                                                >
                                                    {STAGE_OPTIONS.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground opacity-0 group-hover/edit:opacity-100">
                                                    <Settings size={14} />
                                                </div>
                                            </div>
                                        </td>
                                    )}
                                    {visibleColumns.has('success_probability') && (
                                        <td className="px-3 py-4 text-white/80 text-base">
                                            {op.success_probability ? `${op.success_probability}%` : '-'}
                                        </td>
                                    )}
                                    {visibleColumns.has('date') && (
                                        <td className="px-3 py-4 text-white/80 text-base">
                                            {op.date}
                                        </td>
                                    )}
                                    {visibleColumns.has('meeting_date') && (
                                        <td className="px-3 py-4 text-white/80 text-base">
                                            {op.meeting_date ? (() => {
                                                // meeting_date is stored as local time (e.g., 2025-12-09T09:00)
                                                // just display it directly without timezone conversion
                                                return op.meeting_date.slice(0, 16).replace('T', ' ');
                                            })() : '-'}
                                        </td>
                                    )}
                                    {visibleColumns.has('owner') && (
                                        <td className="px-3 py-4">
                                            <div className="relative group/edit">
                                                <select
                                                    value={op.owner}
                                                    onChange={(e) => handleOwnerChange(String(op.id), e.target.value)}
                                                    className="appearance-none bg-transparent w-full pr-6 py-1 text-sky-400 font-medium text-base focus:outline-none focus:bg-card focus:ring-1 focus:ring-accent rounded cursor-pointer"
                                                >
                                                    {OWNER_OPTIONS.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground opacity-0 group-hover/edit:opacity-100">
                                                    <Settings size={14} />
                                                </div>
                                            </div>
                                        </td>
                                    )}
                                    {visibleColumns.has('created_at') && (
                                        <td className="px-3 py-4 text-white/80 text-base">
                                            {op.created_at ? new Date(op.created_at).toISOString().split('T')[0] : '-'}
                                        </td>
                                    )}
                                    <td className="px-3 py-4 text-center">
                                        <button className="text-muted-foreground hover:text-accent border border-border rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <ChevronDown size={14} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Kanban View */}
            {viewMode === 'kanban' && (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="flex-1 overflow-x-auto p-6 bg-gradient-to-br from-background via-background to-secondary/20">
                        <div className="flex gap-5 h-full min-w-max">
                            {STAGE_OPTIONS.map((stage) => {
                                const stageOpportunities = filteredOpportunities
                                    .filter(op => op.stage === stage)
                                    .sort((a, b) => {
                                        // Sort by date ascending (earliest first)
                                        if (!a.date && !b.date) return 0;
                                        if (!a.date) return 1;
                                        if (!b.date) return -1;
                                        return new Date(a.date).getTime() - new Date(b.date).getTime();
                                    });
                                const stageTotal = stageOpportunities.reduce((sum, op) => sum + Number(op.value || 0), 0);

                                // Premium stage color mapping with gradients
                                const stageColors: Record<string, {
                                    headerGradient: string;
                                    cardBg: string;
                                    borderColor: string;
                                    badgeColor: string;
                                    badgeBg: string;
                                    iconColor: string;
                                    glowColor: string;
                                }> = {
                                    '발굴': {
                                        headerGradient: 'from-slate-600/90 to-slate-700/90',
                                        cardBg: 'bg-slate-900/40',
                                        borderColor: 'border-slate-500/40',
                                        badgeColor: 'text-slate-300',
                                        badgeBg: 'bg-slate-500/30',
                                        iconColor: 'bg-gradient-to-br from-slate-400 to-slate-600',
                                        glowColor: 'hover:shadow-slate-500/20'
                                    },
                                    '제안': {
                                        headerGradient: 'from-blue-600/90 to-blue-700/90',
                                        cardBg: 'bg-blue-950/40',
                                        borderColor: 'border-blue-500/40',
                                        badgeColor: 'text-blue-300',
                                        badgeBg: 'bg-blue-500/30',
                                        iconColor: 'bg-gradient-to-br from-blue-400 to-blue-600',
                                        glowColor: 'hover:shadow-blue-500/20'
                                    },
                                    '견적': {
                                        headerGradient: 'from-violet-600/90 to-purple-700/90',
                                        cardBg: 'bg-purple-950/40',
                                        borderColor: 'border-purple-500/40',
                                        badgeColor: 'text-purple-300',
                                        badgeBg: 'bg-purple-500/30',
                                        iconColor: 'bg-gradient-to-br from-violet-400 to-purple-600',
                                        glowColor: 'hover:shadow-purple-500/20'
                                    },
                                    '협상': {
                                        headerGradient: 'from-orange-500/90 to-amber-600/90',
                                        cardBg: 'bg-orange-950/40',
                                        borderColor: 'border-orange-500/40',
                                        badgeColor: 'text-orange-300',
                                        badgeBg: 'bg-orange-500/30',
                                        iconColor: 'bg-gradient-to-br from-orange-400 to-amber-500',
                                        glowColor: 'hover:shadow-orange-500/20'
                                    },
                                    '계약 대기': {
                                        headerGradient: 'from-yellow-500/90 to-amber-500/90',
                                        cardBg: 'bg-yellow-950/40',
                                        borderColor: 'border-yellow-500/40',
                                        badgeColor: 'text-yellow-300',
                                        badgeBg: 'bg-yellow-500/30',
                                        iconColor: 'bg-gradient-to-br from-yellow-400 to-amber-500',
                                        glowColor: 'hover:shadow-yellow-500/20'
                                    },
                                    '수주(성공)': {
                                        headerGradient: 'from-emerald-500/90 to-teal-600/90',
                                        cardBg: 'bg-emerald-950/40',
                                        borderColor: 'border-emerald-500/40',
                                        badgeColor: 'text-emerald-300',
                                        badgeBg: 'bg-emerald-500/30',
                                        iconColor: 'bg-gradient-to-br from-emerald-400 to-teal-500',
                                        glowColor: 'hover:shadow-emerald-500/20'
                                    },
                                    '실주(실패)': {
                                        headerGradient: 'from-red-600/90 to-rose-700/90',
                                        cardBg: 'bg-red-950/40',
                                        borderColor: 'border-red-500/40',
                                        badgeColor: 'text-red-300',
                                        badgeBg: 'bg-red-500/30',
                                        iconColor: 'bg-gradient-to-br from-red-400 to-rose-600',
                                        glowColor: 'hover:shadow-red-500/20'
                                    },
                                };

                                const colors = stageColors[stage] || {
                                    headerGradient: 'from-gray-600/90 to-gray-700/90',
                                    cardBg: 'bg-gray-900/40',
                                    borderColor: 'border-gray-500/40',
                                    badgeColor: 'text-gray-300',
                                    badgeBg: 'bg-gray-500/30',
                                    iconColor: 'bg-gradient-to-br from-gray-400 to-gray-600',
                                    glowColor: 'hover:shadow-gray-500/20'
                                };

                                return (
                                    <div
                                        key={stage}
                                        className={`flex flex-col w-80 rounded-2xl ${colors.cardBg} border ${colors.borderColor} overflow-hidden backdrop-blur-sm shadow-xl transition-all duration-300`}
                                    >
                                        {/* Column Header - Gradient */}
                                        <div className={`p-4 bg-gradient-to-r ${colors.headerGradient} backdrop-blur-md`}>
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded-lg ${colors.iconColor} shadow-lg`}></div>
                                                    <h3 className="font-bold text-white text-lg tracking-tight">{stage}</h3>
                                                </div>
                                                <span className={`text-sm font-semibold ${colors.badgeColor} ${colors.badgeBg} px-3 py-1 rounded-full backdrop-blur-sm`}>
                                                    {stageOpportunities.length}건
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-white/80 font-medium">
                                                    💰 {formatCurrency(stageTotal)}
                                                </p>
                                                {stageOpportunities.length > 0 && (
                                                    <p className="text-xs text-white/60">
                                                        평균: {formatCurrency(stageTotal / stageOpportunities.length)}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Cards Container - Droppable */}
                                        <Droppable droppableId={stage}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.droppableProps}
                                                    className={`flex-1 overflow-y-auto p-3 space-y-3 max-h-[calc(100vh-300px)] min-h-[100px] transition-colors duration-200 ${snapshot.isDraggingOver ? 'bg-accent/10 ring-2 ring-accent/30 ring-inset' : ''
                                                        }`}
                                                >
                                                    {stageOpportunities.map((op, index) => (
                                                        <Draggable key={String(op.id)} draggableId={String(op.id)} index={index}>
                                                            {(provided, snapshot) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    onClick={() => handleTitleClick(op)}
                                                                    className={`bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl p-4 cursor-grab transition-all duration-300 group hover:bg-card hover:border-accent/40 ${colors.glowColor} hover:shadow-2xl ${snapshot.isDragging ? 'shadow-2xl scale-105 rotate-2 opacity-90 cursor-grabbing ring-2 ring-accent' : 'hover:-translate-y-1'
                                                                        }`}
                                                                    style={provided.draggableProps.style}
                                                                >
                                                                    {/* Card Header */}
                                                                    <div className="flex items-start justify-between mb-3">
                                                                        <h4 className="font-bold text-white text-base line-clamp-2 group-hover:text-accent transition-colors leading-tight">
                                                                            {op.title}
                                                                        </h4>
                                                                        <GripVertical size={16} className="text-muted-foreground group-hover:text-accent transition-opacity flex-shrink-0 ml-2 mt-0.5" />
                                                                    </div>

                                                                    {/* Company */}
                                                                    <div className="flex items-center gap-2 mb-3">
                                                                        <Building2 size={14} className="text-muted-foreground" />
                                                                        <p className="text-sm text-white/80 font-medium">{op.company}</p>
                                                                    </div>

                                                                    {/* Value & Probability */}
                                                                    <div className="flex items-center justify-between mb-3">
                                                                        <span className="text-lg font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                                                                            {formatCurrency(op.value)}
                                                                        </span>
                                                                        {op.success_probability && (
                                                                            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${op.success_probability >= 80 ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30' :
                                                                                op.success_probability >= 50 ? 'bg-amber-500/20 text-amber-400 ring-1 ring-amber-500/30' :
                                                                                    'bg-slate-500/20 text-slate-400 ring-1 ring-slate-500/30'
                                                                                }`}>
                                                                                <div className={`w-2 h-2 rounded-full ${op.success_probability >= 80 ? 'bg-emerald-400' :
                                                                                    op.success_probability >= 50 ? 'bg-amber-400' :
                                                                                        'bg-slate-400'
                                                                                    }`}></div>
                                                                                {op.success_probability}%
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {/* Footer */}
                                                                    <div className="flex items-center justify-between pt-3 border-t border-border/30">
                                                                        <div className="flex items-center gap-2">
                                                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                                                                {op.owner?.charAt(0)}
                                                                            </div>
                                                                            <span className="text-sm text-sky-400 font-medium">{op.owner}</span>
                                                                        </div>
                                                                        {op.date && (
                                                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded-full">
                                                                                <Calendar size={12} />
                                                                                {op.date}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))}
                                                    {provided.placeholder}
                                                    {stageOpportunities.length === 0 && !snapshot.isDraggingOver && (
                                                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                                            <div className={`w-16 h-16 rounded-2xl ${colors.badgeBg} flex items-center justify-center mb-4`}>
                                                                <Plus size={32} className="text-muted-foreground/50" />
                                                            </div>
                                                            <p className="text-sm font-medium">안건이 없습니다</p>
                                                            <p className="text-xs mt-1 opacity-70">카드를 여기로 끌어다 놓으세요</p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </Droppable>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </DragDropContext>
            )}

            {/* Overdue Alert Popup */}
            {showOverdueAlert && overdueOpportunities.length > 0 && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-gradient-to-br from-red-950 via-red-900 to-red-950 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden border-2 border-red-500/50 animate-in zoom-in-95 duration-300" style={{ animation: 'shake 0.5s ease-in-out' }}>
                        {/* Header */}
                        <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                                <AlertCircle size={36} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white tracking-tight">⚠️ 긴급 경고</h2>
                                <p className="text-red-100 font-medium">마감일이 도래한 안건이 있습니다!</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="bg-red-950/50 border border-red-500/30 rounded-xl p-4 mb-4">
                                <p className="text-red-200 text-lg font-bold mb-2 flex items-center gap-2">
                                    🚨 {overdueOpportunities.length}건의 안건이 마감일을 초과했습니다!
                                </p>
                                <p className="text-red-300/80 text-sm">
                                    아래 안건들의 마감일이 도래하였습니다. 즉시 조치가 필요합니다.
                                </p>
                            </div>

                            {/* Overdue List */}
                            <div className="max-h-64 overflow-y-auto space-y-2">
                                {overdueOpportunities.map((op) => (
                                    <div
                                        key={op.id}
                                        className="bg-red-900/40 border border-red-500/20 rounded-lg p-3 hover:bg-red-800/40 transition-colors cursor-pointer"
                                        onClick={() => {
                                            setShowOverdueAlert(false);
                                            handleTitleClick(op);
                                        }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <h4 className="font-bold text-white text-base">{op.title}</h4>
                                                <div className="flex items-center gap-4 mt-1">
                                                    <span className="text-red-300 text-sm">{op.company}</span>
                                                    <span className="text-red-400 text-sm font-medium">
                                                        💰 {new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(op.value || 0)}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                                    마감: {op.date}
                                                </div>
                                                <span className="text-red-400 text-xs mt-1 block">{op.owner}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-6 py-4 bg-red-950/80 border-t border-red-500/30 flex justify-end gap-3">
                            <button
                                onClick={() => setShowOverdueAlert(false)}
                                className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-500 hover:to-red-600 transition-all shadow-lg hover:shadow-red-500/30 flex items-center gap-2"
                            >
                                <X size={18} />
                                확인했습니다
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Modal */}
            {
                isCreateModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                        <div className="bg-card rounded-lg shadow-xl w-full max-w-4xl mx-4 overflow-hidden flex flex-col max-h-[90vh]">
                            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                                <h2 className="text-lg font-semibold text-white">새로운 기회 생성</h2>
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="text-muted-foreground hover:text-muted-foreground transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleCreateSubmit} className="flex flex-col flex-1 overflow-hidden">
                                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="col-span-2">
                                            <label className="block text-sm font-medium text-muted-foreground mb-1">안건</label>
                                            <input
                                                type="text"
                                                name="title"
                                                required
                                                value={newOpportunity.title}
                                                onChange={handleCreateInputChange}
                                                className="w-full px-3 py-2 bg-secondary text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                placeholder="예: 클라우드 도입 프로젝트"
                                            />
                                        </div>
                                        <div>
                                            <div className="relative">
                                                <label className="block text-sm font-medium text-muted-foreground mb-1">업체명</label>
                                                <input
                                                    type="text"
                                                    name="company"
                                                    required
                                                    value={newOpportunity.company}
                                                    onChange={handleCompanyInputChange}
                                                    onBlur={handleCompanyInputBlur}
                                                    onFocus={() => {
                                                        if (newOpportunity.company) {
                                                            searchAccounts(newOpportunity.company);
                                                            setIsAccountDropdownOpen(true);
                                                        }
                                                    }}
                                                    className="w-full px-3 py-2 bg-secondary text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                    placeholder="예: (주)미래시스템"
                                                    autoComplete="off"
                                                />
                                                {isAccountDropdownOpen && (
                                                    <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
                                                        {isSearching ? (
                                                            <div className="px-4 py-2 text-sm text-muted-foreground">검색 중...</div>
                                                        ) : searchedAccounts.length > 0 ? (
                                                            searchedAccounts.map((account) => (
                                                                <button
                                                                    key={account.id}
                                                                    type="button"
                                                                    onClick={() => handleSelectCompany(account.name, account.address, String(account.id))}
                                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-secondary/30 focus:outline-none focus:bg-secondary/30"
                                                                >
                                                                    {account.name}
                                                                </button>
                                                            ))
                                                        ) : accountSearchQuery.trim() !== '' ? (
                                                            <div className="px-4 py-2 text-sm text-muted-foreground">검색 결과가 없습니다.</div>
                                                        ) : null}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="relative">
                                                <label className="block text-sm font-medium text-muted-foreground mb-1">담당자</label>
                                                <input
                                                    type="text"
                                                    name="contact_name"
                                                    value={newOpportunity.contact_name}
                                                    onChange={handleCreateInputChange}
                                                    onFocus={() => contactOptions.length > 0 && setIsContactDropdownOpen(true)}
                                                    className="w-full px-3 py-2 bg-secondary text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                    placeholder="고객 담당자 입력 또는 선택"
                                                    autoComplete="off"
                                                />
                                                {isContactDropdownOpen && contactOptions.length > 0 && (
                                                    <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
                                                        {contactOptions.map((contact, index) => (
                                                            <button
                                                                key={index}
                                                                type="button"
                                                                onClick={() => {
                                                                    setNewOpportunity(prev => ({ ...prev, contact_name: contact }));
                                                                    setIsContactDropdownOpen(false);
                                                                }}
                                                                className="w-full px-4 py-2 text-left text-sm hover:bg-secondary/30 focus:outline-none focus:bg-secondary/30"
                                                            >
                                                                {contact}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-muted-foreground mb-1">예상 매출액</label>
                                            <input
                                                type="text"
                                                name="value"
                                                value={newOpportunity.value === '' ? '' : Number(newOpportunity.value).toLocaleString()}
                                                onChange={handleCreateInputChange}
                                                className="w-full px-3 py-2 bg-secondary text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-muted-foreground mb-1">진행 단계</label>
                                            <select
                                                name="stage"
                                                value={newOpportunity.stage}
                                                onChange={handleCreateInputChange}
                                                className="w-full px-3 py-2 bg-secondary text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                            >
                                                {STAGE_OPTIONS.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-muted-foreground mb-1">성공 확률</label>
                                            <select
                                                name="success_probability"
                                                value={newOpportunity.success_probability ? `${newOpportunity.success_probability}%` : '10%'}
                                                onChange={handleCreateInputChange}
                                                className="w-full px-3 py-2 bg-secondary text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                            >
                                                {PROBABILITY_OPTIONS.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-muted-foreground mb-1">영업 담당자</label>
                                            <select
                                                name="owner"
                                                value={newOpportunity.owner}
                                                onChange={handleCreateInputChange}
                                                className="w-full px-3 py-2 bg-secondary text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                            >
                                                {OWNER_OPTIONS.map(opt => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-muted-foreground mb-1">마감 일자</label>
                                            <input
                                                type="date"
                                                name="date"
                                                required
                                                value={newOpportunity.date}
                                                onChange={handleCreateInputChange}
                                                className="w-full px-3 py-2 bg-secondary text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                            />
                                        </div>

                                    </div>
                                </div>
                                <div className="p-4 border-t border-border flex justify-end gap-2 bg-secondary/30">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
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
                )
            }

            {/* Edit Modal */}
            {
                isEditModalOpen && editingOpportunity && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2">
                        <div className="bg-card rounded-xl shadow-xl w-full max-w-[99vw] h-[98vh] overflow-hidden animate-in flex flex-col">
                            <div className="flex justify-between items-center p-4 border-b border-border">
                                <h2 className="text-xl font-bold text-white">기회 수정</h2>
                                <button onClick={() => setIsEditModalOpen(false)} className="text-muted-foreground hover:text-muted-foreground">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleEditSubmit} className="flex-1 overflow-hidden flex flex-col">
                                <div className="flex-1 overflow-y-auto p-6">
                                    <div className="flex gap-6 h-full">
                                        {/* Left Column: Form Fields */}
                                        <div className="w-1/3 space-y-4 overflow-y-auto pr-2">
                                            <div>
                                                <label className="block text-sm font-medium text-muted-foreground mb-1">안건</label>
                                                <input
                                                    type="text"
                                                    name="title"
                                                    required
                                                    value={editingOpportunity.title}
                                                    onChange={handleEditInputChange}
                                                    className="w-full px-3 py-2 bg-secondary text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-muted-foreground mb-1">업체명</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            name="company"
                                                            required
                                                            value={editingOpportunity.company}
                                                            onChange={handleCompanyInputChange}
                                                            onBlur={handleCompanyInputBlur}
                                                            className="w-full px-3 py-2 bg-secondary text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                            autoComplete="off"
                                                        />
                                                        {isAccountDropdownOpen && searchedAccounts.length > 0 && (
                                                            <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                                {searchedAccounts.map(account => (
                                                                    <button
                                                                        key={account.id}
                                                                        type="button"
                                                                        onClick={() => handleSelectCompany(account.name, account.address, String(account.id))}
                                                                        className="w-full text-left px-4 py-2 hover:bg-secondary/30 text-sm"
                                                                    >
                                                                        <div className="font-medium">{account.name}</div>
                                                                        {account.address && <div className="text-xs text-muted-foreground">{account.address}</div>}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-muted-foreground mb-1">담당자</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            name="contact_name"
                                                            value={editingOpportunity.contact_name || ''}
                                                            onChange={handleEditInputChange}
                                                            className="w-full px-3 py-2 bg-secondary text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                            list="contact-options"
                                                        />
                                                        <datalist id="contact-options">
                                                            {contactOptions.map((contact, index) => (
                                                                <option key={index} value={contact} />
                                                            ))}
                                                        </datalist>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-muted-foreground mb-1">예상 매출액</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            name="value"
                                                            value={editingOpportunity.value ? Number(editingOpportunity.value).toLocaleString() : ''}
                                                            onChange={handleEditInputChange}
                                                            className="w-full px-3 py-2 bg-secondary text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-muted-foreground mb-1">진행 단계</label>
                                                    <select
                                                        name="stage"
                                                        value={editingOpportunity.stage}
                                                        onChange={handleEditInputChange}
                                                        className="w-full px-3 py-2 bg-secondary text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                    >
                                                        {STAGE_OPTIONS.map(stage => (
                                                            <option key={stage} value={stage}>{stage}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-muted-foreground mb-1">성공 확률</label>
                                                    <select
                                                        name="success_probability"
                                                        value={editingOpportunity.success_probability ? `${editingOpportunity.success_probability}%` : '10%'}
                                                        onChange={handleEditInputChange}
                                                        className="w-full px-3 py-2 bg-secondary text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                    >
                                                        {PROBABILITY_OPTIONS.map(prob => (
                                                            <option key={prob} value={prob}>{prob}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-muted-foreground mb-1">영업 담당자</label>
                                                    <select
                                                        name="owner"
                                                        value={editingOpportunity.owner}
                                                        onChange={handleEditInputChange}
                                                        className="w-full px-3 py-2 bg-secondary text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                    >
                                                        {OWNER_OPTIONS.map(owner => (
                                                            <option key={owner} value={owner}>{owner}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-muted-foreground mb-1">마감 일자</label>
                                                    <input
                                                        type="date"
                                                        name="date"
                                                        required
                                                        value={editingOpportunity.date}
                                                        onChange={handleEditInputChange}
                                                        className="w-full px-3 py-2 bg-secondary text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-muted-foreground mb-1">미팅 일자</label>
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="date"
                                                            value={editingOpportunity.meeting_date ? editingOpportunity.meeting_date.split('T')[0] : ''}
                                                            onChange={(e) => {
                                                                const date = e.target.value;
                                                                const time = editingOpportunity.meeting_date ? editingOpportunity.meeting_date.split('T')[1] : '09:00';
                                                                if (date) {
                                                                    setEditingOpportunity(prev => ({ ...prev!, meeting_date: `${date}T${time}` }));
                                                                } else {
                                                                    setEditingOpportunity(prev => ({ ...prev!, meeting_date: '' }));
                                                                }
                                                            }}
                                                            className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                        />
                                                        <select
                                                            value={editingOpportunity.meeting_date ? editingOpportunity.meeting_date.split('T')[1] : '09:00'}
                                                            onChange={(e) => {
                                                                const time = e.target.value;
                                                                const date = editingOpportunity.meeting_date ? editingOpportunity.meeting_date.split('T')[0] : new Date().toISOString().split('T')[0];
                                                                setEditingOpportunity(prev => ({ ...prev!, meeting_date: `${date}T${time}` }));
                                                            }}
                                                            className="w-24 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                                                        >
                                                            {TIME_OPTIONS.map(t => (
                                                                <option key={t} value={t}>{t}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex justify-end mt-2">
                                                <button
                                                    type="button"
                                                    onClick={handleSaveAndAddToCalendar}
                                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors w-full justify-center"
                                                >
                                                    <Calendar size={16} />
                                                    구글 캘린더 등록
                                                </button>
                                            </div>

                                            {/* Todo List - moved under Google Calendar */}
                                            <div className="mt-4 flex-1 min-h-0">
                                                <TodoList opportunityId={editingOpportunity.id} />
                                            </div>
                                        </div>

                                        {/* Center Column: Memo Section - Full Width */}
                                        <div className="w-1/3 border-r border-border px-6 flex flex-col h-full overflow-hidden pb-2">
                                            {/* Memo Section - Full Height */}
                                            <div className="flex-1 min-h-0 flex flex-col">
                                                <h3 className="text-lg font-bold text-white mb-2 flex-shrink-0">메모</h3>
                                                <div className="flex-1 overflow-y-auto bg-secondary/30 p-3 rounded-lg mb-2 space-y-2">
                                                    {isMemoLoading ? (
                                                        <p className="text-xs text-muted-foreground text-center">로딩 중...</p>
                                                    ) : memos.length > 0 ? (
                                                        memos.filter(m => !m.parent_id).map(memo => (
                                                            <div key={memo.id} className="space-y-2">
                                                                <div className="bg-card p-2 rounded border border-border shadow-sm group relative">
                                                                    {editingMemoId === memo.id ? (
                                                                        <div className="space-y-2">
                                                                            <textarea
                                                                                value={editingMemoContent}
                                                                                onChange={(e) => setEditingMemoContent(e.target.value)}
                                                                                className="w-full px-2 py-1 text-sm border border-border rounded focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                                                                                rows={3}
                                                                            />
                                                                            <div className="flex justify-end gap-2 mt-2">
                                                                                <button
                                                                                    onClick={() => setEditingMemoId(null)}
                                                                                    className="px-3 py-1.5 text-xs font-medium text-muted-foreground bg-secondary/50 rounded-md hover:bg-secondary transition-colors"
                                                                                >
                                                                                    취소
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => handleUpdateMemo(memo.id)}
                                                                                    className="px-3 py-1.5 text-xs font-medium text-white bg-accent rounded-md hover:bg-accent/90 transition-colors"
                                                                                >
                                                                                    저장
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    ) : (
                                                                        <div>
                                                                            <p className="text-sm text-white whitespace-pre-wrap pr-6">{memo.content}</p>
                                                                            <div className="flex items-center justify-between mt-1">
                                                                                <div className="flex items-center gap-2">
                                                                                    <p className="text-xs text-muted-foreground">
                                                                                        {new Date(memo.created_at).toLocaleString()}
                                                                                        {memo.updated_at && ` (수정됨: ${new Date(memo.updated_at).toLocaleString()})`}
                                                                                    </p>
                                                                                    {memo.author && (
                                                                                        <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border border-blue-500/30">
                                                                                            ✍️ {memo.author}
                                                                                        </span>
                                                                                    )}
                                                                                </div>


                                                                                <div className="flex items-center gap-2">
                                                                                    <button
                                                                                        onClick={() => handleAISummary(memo.id, memo.content)}
                                                                                        disabled={loadingAISummaryForMemo === memo.id}
                                                                                        className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded transition-colors"
                                                                                        title="A/I 정리"
                                                                                    >
                                                                                        {loadingAISummaryForMemo === memo.id ? (
                                                                                            <RefreshCw size={12} className="animate-spin" />
                                                                                        ) : (
                                                                                            <Sparkles size={12} />
                                                                                        )}
                                                                                        A/I 정리
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => handleAIFollowUp(memo.id, memo.content)}
                                                                                        disabled={loadingAIForMemo === memo.id}
                                                                                        className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 bg-purple-50 px-2 py-0.5 rounded transition-colors"
                                                                                        title="A/I F/U"
                                                                                    >
                                                                                        {loadingAIForMemo === memo.id ? (
                                                                                            <RefreshCw size={12} className="animate-spin" />
                                                                                        ) : (
                                                                                            <Sparkles size={12} />
                                                                                        )}
                                                                                        A/I F/U
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => handleSendEmail(memo.content)}
                                                                                        className="flex items-center gap-1 text-xs text-accent hover:text-accent bg-accent/10 px-2 py-0.5 rounded transition-colors"
                                                                                        title="이메일 발송"
                                                                                    >
                                                                                        <Mail size={12} />
                                                                                        이메일 발송
                                                                                    </button>
                                                                                    <div className="relative">
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={() => setActiveMenuMemoId(activeMenuMemoId === memo.id ? null : memo.id)}
                                                                                            className="p-1 text-muted-foreground hover:text-muted-foreground transition-colors"
                                                                                            title="설정"
                                                                                        >
                                                                                            <Settings size={16} />
                                                                                        </button>
                                                                                        {activeMenuMemoId === memo.id && (
                                                                                            <div className="absolute right-0 mt-1 w-24 bg-card rounded-md shadow-lg border border-border z-10">
                                                                                                <button
                                                                                                    onClick={() => {
                                                                                                        startEditingMemo(memo);
                                                                                                        setActiveMenuMemoId(null);
                                                                                                    }}
                                                                                                    className="block w-full text-left px-4 py-2 text-xs text-muted-foreground hover:bg-secondary/50 first:rounded-t-md"
                                                                                                >
                                                                                                    수정
                                                                                                </button>
                                                                                                <button
                                                                                                    onClick={() => {
                                                                                                        handleDeleteMemo(memo.id);
                                                                                                        setActiveMenuMemoId(null);
                                                                                                    }}
                                                                                                    className="block w-full text-left px-4 py-2 text-xs text-danger hover:bg-secondary/50 last:rounded-b-md"
                                                                                                >
                                                                                                    삭제
                                                                                                </button>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {/* Reply Button */}
                                                                <button
                                                                    type="button"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        e.preventDefault();
                                                                        setReplyToMemoId(replyToMemoId === memo.id ? null : memo.id);
                                                                    }}
                                                                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-white mt-1 transition-colors"
                                                                >
                                                                    <MessageSquare size={12} />
                                                                    댓글 {memos.filter(r => r.parent_id === memo.id).length > 0 && `(${memos.filter(r => r.parent_id === memo.id).length})`}
                                                                </button>

                                                                {/* Replies */}
                                                                {memos.filter(reply => reply.parent_id === memo.id).map(reply => (
                                                                    <div key={reply.id} className="ml-4 bg-purple-50/10 p-2 rounded border border-purple-200/20 shadow-sm group relative">
                                                                        <p className="text-sm text-white whitespace-pre-wrap pr-6">{reply.content}</p>
                                                                        <div className="flex items-center justify-between mt-1">
                                                                            <p className="text-xs text-muted-foreground">
                                                                                {new Date(reply.created_at).toLocaleString()}
                                                                            </p>
                                                                            <div className="flex items-center gap-2">
                                                                                <div className="relative">
                                                                                    <button
                                                                                        type="button"
                                                                                        onClick={() => setActiveMenuMemoId(activeMenuMemoId === reply.id ? null : reply.id)}
                                                                                        className="p-1 text-muted-foreground hover:text-muted-foreground transition-colors"
                                                                                        title="설정"
                                                                                    >
                                                                                        <Settings size={16} />
                                                                                    </button>
                                                                                    {activeMenuMemoId === reply.id && (
                                                                                        <div className="absolute right-0 mt-1 w-24 bg-card rounded-md shadow-lg border border-border z-10">
                                                                                            <button
                                                                                                onClick={() => {
                                                                                                    startEditingMemo(reply);
                                                                                                    setActiveMenuMemoId(null);
                                                                                                }}
                                                                                                className="block w-full text-left px-4 py-2 text-xs text-muted-foreground hover:bg-secondary/50 first:rounded-t-md"
                                                                                            >
                                                                                                수정
                                                                                            </button>
                                                                                            <button
                                                                                                onClick={() => {
                                                                                                    handleDeleteMemo(reply.id);
                                                                                                    setActiveMenuMemoId(null);
                                                                                                }}
                                                                                                className="block w-full text-left px-4 py-2 text-xs text-danger hover:bg-secondary/50 last:rounded-b-md"
                                                                                            >
                                                                                                삭제
                                                                                            </button>
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {/* Reply Input Box */}
                                                                {replyToMemoId === memo.id && (
                                                                    <div className="ml-4 mt-2 flex gap-2">
                                                                        <input
                                                                            type="text"
                                                                            value={replyContent}
                                                                            onChange={(e) => setReplyContent(e.target.value)}
                                                                            placeholder="댓글을 입력하세요..."
                                                                            className="flex-1 px-2 py-1.5 text-xs bg-secondary/50 text-white border border-border rounded focus:outline-none focus:border-accent"
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                                                    e.preventDefault();
                                                                                    handleAddReply(memo.id);
                                                                                }
                                                                            }}
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.preventDefault();
                                                                                e.stopPropagation();
                                                                                handleAddReply(memo.id);
                                                                            }}
                                                                            disabled={!replyContent.trim()}
                                                                            className="px-3 py-1.5 text-xs font-medium text-white bg-accent rounded hover:bg-accent/90 transition-colors disabled:opacity-50"
                                                                        >
                                                                            등록
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <p className="text-xs text-muted-foreground text-center">등록된 메모가 없습니다.</p>
                                                    )}
                                                </div>
                                                <div className="flex gap-2 flex-shrink-0">
                                                    <textarea
                                                        value={newMemo}
                                                        onChange={(e) => setNewMemo(e.target.value)}
                                                        placeholder="메모를 입력하세요..."
                                                        className="flex-1 px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none h-16"
                                                    />
                                                    <div className="flex items-end">
                                                        <button
                                                            type="button"
                                                            onClick={handleAddMemo}
                                                            disabled={!newMemo.trim()}
                                                            className="px-4 py-2 bg-secondary/50 text-muted-foreground rounded-lg hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
                                                        >
                                                            등록
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right Column: Rental Section */}
                                        {/* Right Column: Rental Section & Company News */}
                                        <div className="w-1/3 flex flex-col h-full px-6 overflow-hidden pb-2">
                                            <div className="flex-1 min-h-0 mb-4">
                                                <RentalManager opportunityId={editingOpportunity.id} />
                                            </div>
                                            <div className="h-[300px] min-h-0">
                                                <CompanyNews companyName={editingOpportunity.company} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border-t border-border flex justify-end gap-2 bg-secondary/30">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
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
                            </form >
                        </div >
                    </div >
                )
            }
        </div >
    );
}

