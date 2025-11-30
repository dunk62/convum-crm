
import { useState, useEffect, useMemo } from 'react';
import { ChevronDown, Search, Filter, Settings, RefreshCw, Plus, X, AlertCircle, Calendar, Trash2, Building2, Mail, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';

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
}

interface Memo {
    id: string;
    content: string;
    created_at: string;
    updated_at?: string;
    parent_id?: string | null;
}

export default function Opportunities() {
    const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOpportunities();
    }, []);

    const fetchOpportunities = async () => {
        try {
            setLoading(true);
            // Add a small delay to make the refresh action visible
            await new Promise(resolve => setTimeout(resolve, 500));

            const { data, error } = await supabase
                .from('opportunities')
                .select('*')
                .order('created_at', { ascending: false });

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

    // Modal States
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
    } | null>(null);



    // Memo State
    const [memos, setMemos] = useState<Memo[]>([]);
    const [newMemo, setNewMemo] = useState('');
    const [isMemoLoading, setIsMemoLoading] = useState(false);
    const [loadingAIForMemo, setLoadingAIForMemo] = useState<string | null>(null);
    const [editingMemoId, setEditingMemoId] = useState<string | null>(null);
    const [editingMemoContent, setEditingMemoContent] = useState('');

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
            <label className="text-xs font-medium text-gray-500 uppercase">{label}</label>
            <div className="text-sm text-gray-900 font-medium break-words">{value}</div>
            {/* Account Details Modal */}
            {selectedAccountForPopup && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-900">업체 정보</h2>
                            <button
                                onClick={() => setSelectedAccountForPopup(null)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto max-h-[80vh]">
                            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 mb-6">
                                <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-primary shadow-sm">
                                    <Building2 size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-gray-900">{selectedAccountForPopup.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                        <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-xs">
                                            {selectedAccountForPopup.industry}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded text-xs border ${selectedAccountForPopup.status === 'Active' ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-600 border-gray-200"
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

                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setSelectedAccountForPopup(null)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
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

    const handleSelectCompany = async (companyName: string, address?: string) => {
        setNewOpportunity(prev => ({ ...prev, company: companyName }));
        if (editingOpportunity) {
            setEditingOpportunity(prev => prev ? { ...prev, company: companyName } : null);
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

    const saveOpportunityData = async () => {
        if (!editingOpportunity) return false;

        const updatedItem = {
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
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!apiKey) {
            alert('Gemini API 키가 설정되지 않았습니다. .env 파일을 확인해주세요.');
            return;
        }

        setLoadingAIForMemo(memoId);
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

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
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
                    parent_id: memoId
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
            fetchMemos(editingOpportunity.id);
        } catch (err: any) {
            console.error('Error adding memo:', err);
            alert('메모 저장 실패: ' + err.message);
        }
    };

    const filteredOpportunities = useMemo(() => {
        if (!searchQuery) return opportunities;
        const lowerQuery = searchQuery.toLowerCase();
        return opportunities.filter(op =>
            op.title.toLowerCase().includes(lowerQuery) ||
            op.company.toLowerCase().includes(lowerQuery)
        );
    }, [opportunities, searchQuery]);

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
            meeting_date: op.meeting_date ? (() => {
                const date = new Date(op.meeting_date);
                const offset = date.getTimezoneOffset() * 60000;
                return new Date(date.getTime() - offset).toISOString().slice(0, 16);
            })() : ''
        });
        fetchMemos(String(op.id));
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
        <div className="h-full flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden relative">
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
                <div className="bg-red-50 border-b border-red-200 p-4 flex items-center gap-3 text-red-800">
                    <AlertCircle size={20} />
                    <div>
                        <p className="font-medium">Error</p>
                        <p className="text-sm">{error}</p>
                    </div>
                </div>
            )}

            {/* Toolbar */}
            <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50/50">
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input
                            type="text"
                            placeholder="이 목록 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8 pr-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 w-64"
                        />
                    </div>
                    <button
                        className="p-1.5 text-gray-600 hover:bg-gray-200 rounded border border-gray-300 bg-white"
                        onClick={() => alert("설정 기능은 준비 중입니다.")}
                        title="설정"
                    >
                        <Settings size={14} />
                    </button>
                    <button
                        className="p-1.5 text-gray-600 hover:bg-gray-200 rounded border border-gray-300 bg-white"
                        onClick={() => alert("필터 기능은 준비 중입니다.")}
                        title="필터"
                    >
                        <Filter size={14} />
                    </button>
                    <button
                        onClick={fetchOpportunities}
                        className="p-1.5 text-gray-600 hover:bg-gray-200 rounded border border-gray-300 bg-white"
                        title="새로고침"
                    >
                        <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 mr-2">{filteredOpportunities.length}개 항목 • 정렬 기준: 기회 이름</span>
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            기능
                            <ChevronDown size={16} />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                                <button
                                    onClick={() => {
                                        setIsCreateModalOpen(true);
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    <Plus size={16} />
                                    새로 만들기
                                </button>
                                <button
                                    onClick={handleDeleteSelected}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 size={16} />
                                    삭제
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="p-2 border-b border-gray-200 w-10 text-center">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                    checked={selectedItems.length === filteredOpportunities.length && filteredOpportunities.length > 0}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th className="p-2 border-b border-gray-200 text-center text-base font-bold text-gray-700 min-w-[200px]">
                                <div className="flex items-center justify-center cursor-pointer hover:text-gray-700">
                                    안건 <ChevronDown size={12} className="ml-1" />
                                </div>
                            </th>
                            <th className="p-2 border-b border-gray-200 text-center text-base font-bold text-gray-700 min-w-[150px]">
                                <div className="flex items-center justify-center cursor-pointer hover:text-gray-700">
                                    업체명 <ChevronDown size={12} className="ml-1" />
                                </div>
                            </th>
                            <th className="p-2 border-b border-gray-200 text-center text-base font-bold text-gray-700 min-w-[120px]">
                                <div className="flex items-center justify-center cursor-pointer hover:text-gray-700">
                                    예상 매출액 <ChevronDown size={12} className="ml-1" />
                                </div>
                            </th>
                            <th className="p-2 border-b border-gray-200 text-center text-base font-bold text-gray-700 min-w-[120px]">
                                <div className="flex items-center justify-center cursor-pointer hover:text-gray-700">
                                    진행 단계 <ChevronDown size={12} className="ml-1" />
                                </div>
                            </th>
                            <th className="p-2 border-b border-gray-200 text-center text-base font-bold text-gray-700 min-w-[100px]">
                                <div className="flex items-center justify-center cursor-pointer hover:text-gray-700">
                                    성공 확률 <ChevronDown size={12} className="ml-1" />
                                </div>
                            </th>
                            <th className="p-2 border-b border-gray-200 text-center text-base font-bold text-gray-700 min-w-[100px]">
                                <div className="flex items-center justify-center cursor-pointer hover:text-gray-700">
                                    마감 일자 <ChevronDown size={12} className="ml-1" />
                                </div>
                            </th>
                            <th className="p-2 border-b border-gray-200 text-center text-base font-bold text-gray-700 min-w-[100px]">
                                <div className="flex items-center justify-center cursor-pointer hover:text-gray-700">
                                    미팅 일자 <ChevronDown size={12} className="ml-1" />
                                </div>
                            </th>
                            <th className="p-2 border-b border-gray-200 text-center text-base font-bold text-gray-700 min-w-[100px]">
                                <div className="flex items-center justify-center cursor-pointer hover:text-gray-700">
                                    영업 담당자 <ChevronDown size={12} className="ml-1" />
                                </div>
                            </th>
                            <th className="p-2 border-b border-gray-200 text-center text-base font-bold text-gray-700 min-w-[100px]">
                                <div className="flex items-center justify-center cursor-pointer hover:text-gray-700">
                                    등록일 <ChevronDown size={12} className="ml-1" />
                                </div>
                            </th>
                            <th className="p-2 border-b border-gray-200 w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredOpportunities.map((op) => (
                            <tr key={op.id} className="hover:bg-gray-50 group">
                                <td className="p-2 text-center">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        checked={selectedItems.includes(String(op.id))}
                                        onChange={() => toggleSelectItem(String(op.id))}
                                    />
                                </td>
                                <td className="p-2 font-medium text-blue-600 hover:underline cursor-pointer" onClick={() => handleTitleClick(op)}>
                                    {op.title}
                                </td>
                                <td className="p-2">
                                    <button
                                        onClick={() => handleCompanyClick(op.company)}
                                        className="text-gray-700 hover:text-blue-600 hover:underline text-left"
                                    >
                                        {op.company}
                                    </button>
                                </td>
                                <td className="p-2 text-gray-700">
                                    {formatCurrency(op.value)}
                                </td>
                                <td className="p-2">
                                    <div className="relative group/edit">
                                        <select
                                            value={op.stage}
                                            onChange={(e) => handleStageChange(String(op.id), e.target.value)}
                                            className="appearance-none bg-transparent w-full pr-6 py-1 text-gray-700 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 rounded cursor-pointer"
                                        >
                                            {STAGE_OPTIONS.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 opacity-0 group-hover/edit:opacity-100">
                                            <Settings size={12} />
                                        </div>
                                    </div>
                                </td>
                                <td className="p-2 text-gray-700">
                                    {op.success_probability ? `${op.success_probability}% ` : '-'}
                                </td>
                                <td className="p-2 text-gray-700">
                                    {op.date}
                                </td>
                                <td className="p-2 text-gray-700">
                                    {op.meeting_date ? (() => {
                                        const date = new Date(op.meeting_date);
                                        const offset = date.getTimezoneOffset() * 60000;
                                        return new Date(date.getTime() - offset).toISOString().slice(0, 16).replace('T', ' ');
                                    })() : '-'}
                                </td>
                                <td className="p-2">
                                    <div className="relative group/edit">
                                        <select
                                            value={op.owner}
                                            onChange={(e) => handleOwnerChange(String(op.id), e.target.value)}
                                            className="appearance-none bg-transparent w-full pr-6 py-1 text-blue-600 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 rounded cursor-pointer"
                                        >
                                            {OWNER_OPTIONS.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 opacity-0 group-hover/edit:opacity-100">
                                            <Settings size={12} />
                                        </div>
                                    </div>
                                </td>
                                <td className="p-2 text-gray-700">
                                    {op.created_at ? new Date(op.created_at).toISOString().split('T')[0] : '-'}
                                </td>
                                <td className="p-2 text-center">
                                    <button className="text-gray-400 hover:text-blue-600 border border-gray-300 rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronDown size={12} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Create Modal */}
            {isCreateModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">새로운 기회 생성</h2>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCreateSubmit} className="flex flex-col flex-1 overflow-hidden">
                            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">안건</label>
                                        <input
                                            type="text"
                                            name="title"
                                            required
                                            value={newOpportunity.title}
                                            onChange={handleCreateInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="예: 클라우드 도입 프로젝트"
                                        />
                                    </div>
                                    <div>
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">업체명</label>
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
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="예: (주)미래시스템"
                                                autoComplete="off"
                                            />
                                            {isAccountDropdownOpen && (
                                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                                                    {isSearching ? (
                                                        <div className="px-4 py-2 text-sm text-gray-500">검색 중...</div>
                                                    ) : searchedAccounts.length > 0 ? (
                                                        searchedAccounts.map((account) => (
                                                            <button
                                                                key={account.id}
                                                                type="button"
                                                                onClick={() => handleSelectCompany(account.name, account.address)}
                                                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                                                            >
                                                                {account.name}
                                                            </button>
                                                        ))
                                                    ) : accountSearchQuery.trim() !== '' ? (
                                                        <div className="px-4 py-2 text-sm text-gray-500">검색 결과가 없습니다.</div>
                                                    ) : null}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="relative">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">담당자</label>
                                            <input
                                                type="text"
                                                name="contact_name"
                                                value={newOpportunity.contact_name}
                                                onChange={handleCreateInputChange}
                                                onFocus={() => contactOptions.length > 0 && setIsContactDropdownOpen(true)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="고객 담당자 입력 또는 선택"
                                                autoComplete="off"
                                            />
                                            {isContactDropdownOpen && contactOptions.length > 0 && (
                                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                                                    {contactOptions.map((contact, index) => (
                                                        <button
                                                            key={index}
                                                            type="button"
                                                            onClick={() => {
                                                                setNewOpportunity(prev => ({ ...prev, contact_name: contact }));
                                                                setIsContactDropdownOpen(false);
                                                            }}
                                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                                                        >
                                                            {contact}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">예상 매출액</label>
                                        <input
                                            type="text"
                                            name="value"
                                            value={newOpportunity.value === '' ? '' : Number(newOpportunity.value).toLocaleString()}
                                            onChange={handleCreateInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">진행 단계</label>
                                        <select
                                            name="stage"
                                            value={newOpportunity.stage}
                                            onChange={handleCreateInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            {STAGE_OPTIONS.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">성공 확률</label>
                                        <select
                                            name="success_probability"
                                            value={newOpportunity.success_probability ? `${newOpportunity.success_probability}% ` : '10%'}
                                            onChange={handleCreateInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            {PROBABILITY_OPTIONS.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">영업 담당자</label>
                                        <select
                                            name="owner"
                                            value={newOpportunity.owner}
                                            onChange={handleCreateInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            {OWNER_OPTIONS.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">마감 일자</label>
                                        <input
                                            type="date"
                                            name="date"
                                            required
                                            value={newOpportunity.date}
                                            onChange={handleCreateInputChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                </div>
                            </div>
                            <div className="p-4 border-t border-gray-200 flex justify-end gap-2 bg-gray-50">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    저장
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {
                isEditModalOpen && editingOpportunity && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-[95vw] h-[90vh] overflow-hidden animate-in flex flex-col">
                            <div className="flex justify-between items-center p-6 border-b border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900">기회 수정</h2>
                                <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleEditSubmit} className="flex-1 overflow-hidden flex flex-col">
                                <div className="flex-1 overflow-y-auto p-6">
                                    <div className="flex gap-6 h-full">
                                        {/* Left Column: Form Fields */}
                                        <div className="w-1/3 space-y-4 overflow-y-auto pr-2">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">안건</label>
                                                <input
                                                    type="text"
                                                    name="title"
                                                    required
                                                    value={editingOpportunity.title}
                                                    onChange={handleEditInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">업체명</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            name="company"
                                                            required
                                                            value={editingOpportunity.company}
                                                            onChange={handleCompanyInputChange}
                                                            onBlur={handleCompanyInputBlur}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            autoComplete="off"
                                                        />
                                                        {isAccountDropdownOpen && searchedAccounts.length > 0 && (
                                                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                                                {searchedAccounts.map(account => (
                                                                    <button
                                                                        key={account.id}
                                                                        type="button"
                                                                        onClick={() => handleSelectCompany(account.name, account.address)}
                                                                        className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                                                                    >
                                                                        <div className="font-medium">{account.name}</div>
                                                                        {account.address && <div className="text-xs text-gray-500">{account.address}</div>}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">담당자</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            name="contact_name"
                                                            value={editingOpportunity.contact_name || ''}
                                                            onChange={handleEditInputChange}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">예상 매출액</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            name="value"
                                                            value={editingOpportunity.value ? Number(editingOpportunity.value).toLocaleString() : ''}
                                                            onChange={handleEditInputChange}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">진행 단계</label>
                                                    <select
                                                        name="stage"
                                                        value={editingOpportunity.stage}
                                                        onChange={handleEditInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        {STAGE_OPTIONS.map(stage => (
                                                            <option key={stage} value={stage}>{stage}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">성공 확률</label>
                                                    <select
                                                        name="success_probability"
                                                        value={editingOpportunity.success_probability ? `${editingOpportunity.success_probability}%` : '10%'}
                                                        onChange={handleEditInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        {PROBABILITY_OPTIONS.map(prob => (
                                                            <option key={prob} value={prob}>{prob}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">영업 담당자</label>
                                                    <select
                                                        name="owner"
                                                        value={editingOpportunity.owner}
                                                        onChange={handleEditInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    >
                                                        {OWNER_OPTIONS.map(owner => (
                                                            <option key={owner} value={owner}>{owner}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">마감 일자</label>
                                                    <input
                                                        type="date"
                                                        name="date"
                                                        required
                                                        value={editingOpportunity.date}
                                                        onChange={handleEditInputChange}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">미팅 일자</label>
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
                                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                        />
                                                        <select
                                                            value={editingOpportunity.meeting_date ? editingOpportunity.meeting_date.split('T')[1] : '09:00'}
                                                            onChange={(e) => {
                                                                const time = e.target.value;
                                                                const date = editingOpportunity.meeting_date ? editingOpportunity.meeting_date.split('T')[0] : new Date().toISOString().split('T')[0];
                                                                setEditingOpportunity(prev => ({ ...prev!, meeting_date: `${date}T${time}` }));
                                                            }}
                                                            className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

                                            {/* Company Sales Chart */}
                                        </div>

                                        {/* Right Column: Memo Section */}
                                        <div className="w-2/3 flex flex-col h-full border-l border-gray-200 pl-6">
                                            <h3 className="text-lg font-bold text-gray-900 mb-3">미팅 및 통화 메모</h3>
                                            <div className="flex-1 overflow-y-auto bg-gray-50 p-4 rounded-lg mb-4 space-y-3">
                                                {isMemoLoading ? (
                                                    <p className="text-xs text-gray-500 text-center">로딩 중...</p>
                                                ) : memos.length > 0 ? (
                                                    memos.filter(m => !m.parent_id).map(memo => (
                                                        <div key={memo.id} className="space-y-2">
                                                            <div className="bg-white p-2 rounded border border-gray-200 shadow-sm group relative">
                                                                {editingMemoId === memo.id ? (
                                                                    <div className="space-y-2">
                                                                        <textarea
                                                                            value={editingMemoContent}
                                                                            onChange={(e) => setEditingMemoContent(e.target.value)}
                                                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                                                                            rows={3}
                                                                        />
                                                                        <div className="flex justify-end gap-2 mt-2">
                                                                            <button
                                                                                onClick={() => setEditingMemoId(null)}
                                                                                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                                                            >
                                                                                취소
                                                                            </button>
                                                                            <button
                                                                                onClick={() => handleUpdateMemo(memo.id)}
                                                                                className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                                                                            >
                                                                                저장
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        <p className="text-sm text-gray-800 whitespace-pre-wrap pr-6">{memo.content}</p>
                                                                        <div className="flex items-center justify-between mt-1">
                                                                            <p className="text-xs text-gray-400">
                                                                                {new Date(memo.created_at).toLocaleString()}
                                                                                {memo.updated_at && ` (수정됨: ${new Date(memo.updated_at).toLocaleString()})`}
                                                                            </p>


                                                                            <div className="flex items-center gap-2">
                                                                                <button
                                                                                    onClick={() => handleAIFollowUp(memo.id, memo.content)}
                                                                                    disabled={loadingAIForMemo === memo.id}
                                                                                    className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 bg-purple-50 px-2 py-0.5 rounded transition-colors"
                                                                                    title="AI F/U 제안"
                                                                                >
                                                                                    {loadingAIForMemo === memo.id ? (
                                                                                        <RefreshCw size={12} className="animate-spin" />
                                                                                    ) : (
                                                                                        <Sparkles size={12} />
                                                                                    )}
                                                                                    AI F/U 제안
                                                                                </button>
                                                                                <button
                                                                                    onClick={() => startEditingMemo(memo)}
                                                                                    className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                                                                                    title="수정"
                                                                                >
                                                                                    <Settings size={16} />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {/* Replies */}
                                                            {memos.filter(reply => reply.parent_id === memo.id).map(reply => (
                                                                <div key={reply.id} className="ml-6 bg-purple-50 p-2 rounded border border-purple-100 shadow-sm relative">
                                                                    <p className="text-sm text-gray-800 whitespace-pre-wrap">{reply.content}</p>
                                                                    <div className="flex items-center justify-between mt-1">
                                                                        <p className="text-xs text-gray-400">
                                                                            {new Date(reply.created_at).toLocaleString()}
                                                                        </p>
                                                                        <div className="flex items-center gap-2">
                                                                            <button
                                                                                onClick={() => handleSendEmail(reply.content)}
                                                                                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-0.5 rounded transition-colors"
                                                                                title="이메일 발송"
                                                                            >
                                                                                <Mail size={12} />
                                                                                이메일 발송
                                                                            </button>
                                                                            <button
                                                                                onClick={() => startEditingMemo(reply)}
                                                                                className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                                                                                title="수정"
                                                                            >
                                                                                <Settings size={16} />
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-xs text-gray-400 text-center">등록된 메모가 없습니다.</p>
                                                )}
                                            </div>
                                            <div className="flex gap-2 mt-auto">
                                                <textarea
                                                    value={newMemo}
                                                    onChange={(e) => setNewMemo(e.target.value)}
                                                    placeholder="메모를 입력하세요..."
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-24"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleAddMemo}
                                                    disabled={!newMemo.trim()}
                                                    className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed h-24"
                                                >
                                                    등록
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 border-t border-gray-200 flex justify-end gap-2 bg-gray-50">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditModalOpen(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        저장
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

