import { useState, useEffect } from 'react';
import { Search, Plus, MoreHorizontal, Building2, X, ChevronLeft, ChevronRight, Loader2, RefreshCw, ChevronDown, Trash2, AlertCircle, Edit2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

const DetailItem = ({ label, value, className = "" }: { label: string; value: string; className?: string }) => (
    <div className={`space-y-1 ${className}`}>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</label>
        <p className="text-sm font-medium text-gray-900 break-words">{value}</p>
    </div>
);

interface Account {
    id: string;
    name: string;
    industry: string;
    registrationDate: string;
    mainPhone: string;
    website: string;
    address: string;
    created_at: string;
}

interface Contact {
    id: string;
    account_id: string;
    name: string;
    position: string;
    email: string;
    phone: string;
    department: string;
    memo: string;
    created_at: string;
}

export default function Accounts() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // const [activePhonePopover, setActivePhonePopover] = useState<string | null>(null);

    // Contact Management State
    const [activeTab, setActiveTab] = useState<'details' | 'contacts'>('details');
    const [contacts, setContacts] = useState<Contact[]>([]);
    // const [isContactLoading, setIsContactLoading] = useState(false); // Unused for now

    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [isContactFormOpen, setIsContactFormOpen] = useState(false);
    const [newContact, setNewContact] = useState<Partial<Contact>>({});


    const itemsPerPage = 10;

    // Filter State


    const [newAccount, setNewAccount] = useState({
        name: '',
        industry: '',
        registrationDate: '',
        mainPhone: '',
        website: '',
        address: ''
    });



    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('accounts')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Map snake_case from DB to camelCase for frontend
            const mappedAccounts = (data || []).map(acc => ({
                ...acc,
                registrationDate: acc.registration_date,
                mainPhone: acc.main_phone,
            }));

            setAccounts(mappedAccounts);
        } catch (err: any) {
            console.error('Error fetching accounts:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchContacts = async (accountId: string) => {
        try {
            // setIsContactLoading(true);
            const { data, error } = await supabase
                .from('contacts')
                .select('*')
                .eq('account_id', accountId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setContacts(data || []);
        } catch (err) {
            console.error('Error fetching contacts:', err);
        } finally {
            // setIsContactLoading(false);
        }
    };

    const handleSaveContact = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedAccount) return;

        try {
            const payload = {
                ...newContact,
                account_id: selectedAccount.id
            };

            let error;
            if (editingContact) {
                const { error: updateError } = await supabase
                    .from('contacts')
                    .update(payload)
                    .eq('id', editingContact.id);
                error = updateError;
            } else {
                const { error: insertError } = await supabase
                    .from('contacts')
                    .insert([payload]);
                error = insertError;
            }

            if (error) throw error;

            await fetchContacts(selectedAccount.id);
            setIsContactFormOpen(false);
            setEditingContact(null);
            setNewContact({});
            alert('저장되었습니다.');
        } catch (err: any) {
            console.error('Error saving contact:', err);
            alert('저장 중 오류가 발생했습니다: ' + err.message);
        }
    };

    const handleDeleteContact = async (contactId: string) => {
        if (!confirm('삭제하시겠습니까?')) return;
        if (!selectedAccount) return;

        try {
            const { error } = await supabase
                .from('contacts')
                .delete()
                .eq('id', contactId);

            if (error) throw error;
            await fetchContacts(selectedAccount.id);
        } catch (err: any) {
            console.error('Error deleting contact:', err);
            alert('삭제 중 오류가 발생했습니다: ' + err.message);
        }
    };

    const filteredAccounts = accounts.filter(account => {
        const matchesSearch = (
            (account.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (account.industry?.toLowerCase() || '').includes(searchTerm.toLowerCase())
        );

        return matchesSearch;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedAccounts = filteredAccounts.slice(startIndex, startIndex + itemsPerPage);

    const handleCheckboxChange = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(new Set(paginatedAccounts.map(a => a.id)));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.size === 0) return;

        if (!confirm(`${selectedIds.size}개의 항목을 삭제하시겠습니까 ? `)) return;

        try {
            const { error } = await supabase
                .from('accounts')
                .delete()
                .in('id', Array.from(selectedIds));

            if (error) throw error;

            setSelectedIds(new Set());
            setSelectedIds(new Set());
            await fetchAccounts();
            setIsMenuOpen(false);
            alert('삭제되었습니다.');
        } catch (err: any) {
            console.error('Error deleting accounts:', err);
            alert('삭제 중 오류가 발생했습니다: ' + err.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">고객 정보</h1>
                    <p className="text-gray-500 mt-1">고객사 및 관계를 관리합니다.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchAccounts}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        title="새로고침"
                    >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto justify-center"
                        >
                            기능
                            <ChevronDown size={16} />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
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

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle size={20} />
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="업체명 검색..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                            value={searchTerm}
                            onChange={(e) => {
                                setSearchTerm(e.target.value);
                                setCurrentPage(1);
                            }}
                        />
                    </div>

                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 font-bold text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={paginatedAccounts.length > 0 && selectedIds.size === paginatedAccounts.length}
                                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                        />
                                        업체명
                                    </div>
                                </th>
                                <th className="px-6 py-3 font-bold text-gray-500">산업군</th>
                                <th className="px-6 py-3 font-bold text-gray-500">대표전화</th>
                                <th className="px-6 py-3 font-bold text-gray-500">홈페이지</th>
                                <th className="px-6 py-3 font-bold text-gray-500">주소</th>
                                <th className="px-6 py-3 font-bold text-gray-500">등록일</th>
                                <th className="px-6 py-3 font-medium text-gray-500"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paginatedAccounts.map((account, index) => (
                                <tr key={account.id} className="hover:bg-gray-50 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <span className="text-gray-500 font-medium min-w-[20px]">{startIndex + index + 1}.</span>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.has(account.id)}
                                                onChange={() => handleCheckboxChange(account.id)}
                                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                                <Building2 size={16} />
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedAccount(account);
                                                    setActiveTab('details');
                                                    fetchContacts(account.id);
                                                }}
                                                className="font-medium text-gray-900 hover:text-primary hover:underline text-left"
                                            >
                                                {account.name}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{account.industry}</td>
                                    <td className="px-6 py-4 text-gray-600">{account.mainPhone || '-'}</td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {account.website ? (
                                            <a href={account.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                                {account.website}
                                            </a>
                                        ) : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 truncate max-w-xs" title={account.address}>{account.address || '-'}</td>
                                    <td className="px-6 py-4 text-gray-600">{account.registrationDate || '-'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </td>
                                </tr >
                            ))}
                        </tbody >
                    </table >
                </div >

                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-sm text-gray-500">
                    <span>Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAccounts.length)} of {filteredAccounts.length} accounts</span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1 px-3 py-1 border border-gray-200 rounded hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent"
                        >
                            <ChevronLeft size={16} />
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1 px-3 py-1 border border-gray-200 rounded hover:bg-white disabled:opacity-50 disabled:hover:bg-transparent"
                        >
                            Next
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div >

            {/* Account Details Modal */}
            {
                selectedAccount && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <h2 className="text-xl font-semibold text-gray-900">업체 정보</h2>
                                <button
                                    onClick={() => setSelectedAccount(null)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b border-gray-200 px-6">
                                <button
                                    onClick={() => setActiveTab('details')}
                                    className={cn(
                                        "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                                        activeTab === 'details'
                                            ? "border-primary text-primary"
                                            : "border-transparent text-gray-500 hover:text-gray-700"
                                    )}
                                >
                                    상세 정보
                                </button>
                                <button
                                    onClick={() => setActiveTab('contacts')}
                                    className={cn(
                                        "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                                        activeTab === 'contacts'
                                            ? "border-primary text-primary"
                                            : "border-transparent text-gray-500 hover:text-gray-700"
                                    )}
                                >
                                    담당자 목록
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto flex-1">
                                {activeTab === 'details' ? (
                                    <>
                                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 mb-6">
                                            <div className="w-12 h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-primary shadow-sm">
                                                <Building2 size={24} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg text-gray-900">{selectedAccount.name}</h3>
                                                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                                    <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-xs">
                                                        {selectedAccount.industry}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                            <DetailItem label="No" value={selectedAccount.id} />
                                            <DetailItem label="등록일" value={selectedAccount.registrationDate || '-'} />
                                            <DetailItem label="업종" value={selectedAccount.industry} />
                                            <DetailItem label="업체명" value={selectedAccount.name} />
                                            <DetailItem label="대표전화" value={selectedAccount.mainPhone || '-'} />
                                            <DetailItem label="홈페이지" value={selectedAccount.website || '-'} />
                                            <DetailItem label="주소" value={selectedAccount.address || '-'} className="sm:col-span-2" />
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => {
                                                    setEditingContact(null);
                                                    setNewContact({});
                                                    setIsContactFormOpen(true);
                                                }}
                                                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
                                            >
                                                <Plus size={16} />
                                                담당자 추가
                                            </button>
                                        </div>

                                        {isContactFormOpen ? (
                                            <form onSubmit={handleSaveContact} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">이름</label>
                                                        <input required type="text" className="w-full p-2 border rounded text-sm" value={newContact.name || ''} onChange={e => setNewContact({ ...newContact, name: e.target.value })} />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">직급</label>
                                                        <input type="text" className="w-full p-2 border rounded text-sm" value={newContact.position || ''} onChange={e => setNewContact({ ...newContact, position: e.target.value })} />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">부서</label>
                                                        <input type="text" className="w-full p-2 border rounded text-sm" value={newContact.department || ''} onChange={e => setNewContact({ ...newContact, department: e.target.value })} />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">전화번호</label>
                                                        <input type="text" className="w-full p-2 border rounded text-sm" value={newContact.phone || ''} onChange={e => setNewContact({ ...newContact, phone: e.target.value })} />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">이메일</label>
                                                        <input type="email" className="w-full p-2 border rounded text-sm" value={newContact.email || ''} onChange={e => setNewContact({ ...newContact, email: e.target.value })} />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className="block text-xs font-medium text-gray-500 mb-1">메모</label>
                                                        <textarea className="w-full p-2 border rounded text-sm" rows={2} value={newContact.memo || ''} onChange={e => setNewContact({ ...newContact, memo: e.target.value })} />
                                                    </div>
                                                </div>
                                                <div className="flex justify-end gap-2">
                                                    <button type="button" onClick={() => setIsContactFormOpen(false)} className="px-3 py-1.5 text-sm bg-white border rounded hover:bg-gray-50">취소</button>
                                                    <button type="submit" className="px-3 py-1.5 text-sm bg-primary text-white rounded hover:bg-primary/90">저장</button>
                                                </div>
                                            </form>
                                        ) : (
                                            <div className="space-y-3">
                                                {contacts.map(contact => (
                                                    <div key={contact.id} className="p-4 bg-white border border-gray-200 rounded-lg hover:border-primary/50 transition-colors group">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium text-gray-900">{contact.name}</span>
                                                                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{contact.position}</span>
                                                                </div>
                                                                <div className="mt-2 space-y-1 text-sm text-gray-600">
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-xs text-gray-400 w-12">부서</span>
                                                                        {contact.department || '-'}
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-xs text-gray-400 w-12">연락처</span>
                                                                        {contact.phone || '-'}
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <span className="text-xs text-gray-400 w-12">이메일</span>
                                                                        {contact.email || '-'}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingContact(contact);
                                                                        setNewContact(contact);
                                                                        setIsContactFormOpen(true);
                                                                    }}
                                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                                                                >
                                                                    <Edit2 size={14} />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDeleteContact(contact.id)}
                                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                                >
                                                                    <Trash2 size={14} />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {contacts.length === 0 && (
                                                    <p className="text-center text-gray-500 py-8">등록된 담당자가 없습니다.</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                                <button
                                    onClick={() => setSelectedAccount(null)}
                                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    닫기
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {/* Create Account Modal */}
            {
                isCreateModalOpen && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <h2 className="text-xl font-semibold text-gray-900">새 고객 정보 등록</h2>
                                <button
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                    // Find max ID and increment
                                    const maxId = accounts.reduce((max, acc) => {
                                        const num = parseInt(acc.id.replace('C-', ''));
                                        return isNaN(num) ? max : Math.max(max, num);
                                    }, 0);
                                    const id = `C-${String(maxId + 1).padStart(3, '0')}`;

                                    const insertPayload = {
                                        id,
                                        name: newAccount.name,
                                        industry: newAccount.industry,
                                        registration_date: newAccount.registrationDate,
                                        main_phone: newAccount.mainPhone,
                                        website: newAccount.website,
                                        address: newAccount.address
                                    };

                                    const { error } = await supabase.from('accounts').insert([insertPayload]);

                                    if (error) throw error;

                                    await fetchAccounts();
                                    setIsCreateModalOpen(false);
                                    setNewAccount({
                                        name: '', industry: '', registrationDate: '', mainPhone: '', website: '', address: ''
                                    });
                                    alert('성공적으로 저장되었습니다.');
                                } catch (err: any) {
                                    console.error('Error creating account:', err);
                                    alert('Failed to create account: ' + err.message);
                                }
                            }}>
                                <div className="p-6 overflow-y-auto max-h-[70vh] grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase">업체명</label>
                                        <input required type="text" className="w-full p-2 border rounded text-sm" value={newAccount.name} onChange={e => setNewAccount({ ...newAccount, name: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase">업종</label>
                                        <input type="text" className="w-full p-2 border rounded text-sm" value={newAccount.industry} onChange={e => setNewAccount({ ...newAccount, industry: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase">등록일</label>
                                        <input type="date" className="w-full p-2 border rounded text-sm" value={newAccount.registrationDate} onChange={e => setNewAccount({ ...newAccount, registrationDate: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase">대표전화</label>
                                        <input type="text" className="w-full p-2 border rounded text-sm" value={newAccount.mainPhone} onChange={e => setNewAccount({ ...newAccount, mainPhone: e.target.value })} />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-500 uppercase">홈페이지</label>
                                        <input type="text" className="w-full p-2 border rounded text-sm" value={newAccount.website} onChange={e => setNewAccount({ ...newAccount, website: e.target.value })} />
                                    </div>
                                    <div className="space-y-1 sm:col-span-2">
                                        <label className="text-xs font-medium text-gray-500 uppercase">주소</label>
                                        <input type="text" className="w-full p-2 border rounded text-sm" value={newAccount.address} onChange={e => setNewAccount({ ...newAccount, address: e.target.value })} />
                                    </div>
                                </div>
                                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        저장
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
        </div >

    );
}
