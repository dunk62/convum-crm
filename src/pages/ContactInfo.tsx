import { useState, useEffect } from 'react';
import { Search, RefreshCw, Mail, Phone, Building2, Loader2, AlertCircle, ChevronLeft, ChevronRight, PhoneCall, MessageSquare, X, ChevronDown, Plus, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

const DetailItem = ({ label, value, className = "" }: { label: string; value: string; className?: string }) => (
    <div className={`space-y-1 ${className}`}>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</label>
        <p className="text-sm font-medium text-gray-900 break-words">{value}</p>
    </div>
);

interface Contact {
    id: string;
    account_id: string;
    name: string;
    position: string;
    email: string;
    phone: string;
    department: string;
    memo: string;
    sales_rep: string;
    status: string; // Added status
    accounts?: {
        name: string;
    };
}

export default function ContactInfo() {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [activePhonePopover, setActivePhonePopover] = useState<string | null>(null);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newAccount, setNewAccount] = useState({
        name: '', industry: '', type: '잠재고객', owner: '', phone: '', email: '',
        status: 'Active', registrationDate: '', mainPhone: '', website: '', address: '',
        department: '', position: '', contactName: '', grade: '', note: ''
    });

    const itemsPerPage = 10;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (activePhonePopover && !(event.target as Element).closest('.phone-popover-trigger') && !(event.target as Element).closest('.phone-popover-menu')) {
                setActivePhonePopover(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activePhonePopover]);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('contacts')
                .select('*, accounts(name)') // Removed status from accounts
                .order('created_at', { ascending: false });

            if (error) throw error;

            setContacts(data || []);
        } catch (err: any) {
            console.error('Error fetching contacts:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Fetch accounts to calculate max ID
            const { data: accountsData, error: fetchError } = await supabase
                .from('accounts')
                .select('id');

            if (fetchError) throw fetchError;

            const maxId = (accountsData || []).reduce((max, acc) => {
                const num = parseInt(acc.id.replace('C-', ''));
                return isNaN(num) ? max : Math.max(max, num);
            }, 0);
            const id = `C-${String(maxId + 1).padStart(3, '0')}`;

            const accountPayload = {
                id,
                name: newAccount.name,
                industry: newAccount.industry,
                // type: newAccount.type, // Removed type
                // owner: newAccount.owner, // Removed owner
                // status: newAccount.status, // Removed status
                registration_date: newAccount.registrationDate,
                main_phone: newAccount.mainPhone,
                website: newAccount.website,
                address: newAccount.address,
                // grade: newAccount.grade, // Removed grade
            };

            const { error: accountError } = await supabase.from('accounts').insert([accountPayload]);
            if (accountError) throw accountError;

            // Insert into contacts table
            const contactPayload = {
                account_id: id,
                name: newAccount.contactName,
                phone: newAccount.phone,
                email: newAccount.email,
                department: newAccount.department,
                position: newAccount.position,
                memo: newAccount.note,
                sales_rep: newAccount.owner,
                status: newAccount.status, // Added status
                grade: newAccount.grade, // Added grade
                source: newAccount.type // Map type to source
            };

            const { error: contactError } = await supabase.from('contacts').insert([contactPayload]);
            if (contactError) throw contactError;

            await fetchContacts();
            setIsCreateModalOpen(false);
            setNewAccount({
                name: '', industry: '', type: '잠재고객', owner: '', phone: '', email: '',
                status: 'Active', registrationDate: '', mainPhone: '', website: '', address: '',
                department: '', position: '', contactName: '', grade: '', note: ''
            });
            alert('성공적으로 저장되었습니다.');
        } catch (err: any) {
            console.error('Error creating account:', err);
            alert('Failed to create account: ' + err.message);
        }
    };

    const filteredContacts = contacts.filter(contact => {
        const term = searchTerm.toLowerCase();
        const matchesSearch = (
            (contact.accounts?.name?.toLowerCase() || '').includes(term) ||
            (contact.name?.toLowerCase() || '').includes(term) ||
            (contact.email?.toLowerCase() || '').includes(term) ||
            (contact.department?.toLowerCase() || '').includes(term) ||
            (contact.position?.toLowerCase() || '').includes(term) ||
            (contact.phone?.toLowerCase() || '').includes(term) ||
            (contact.sales_rep?.toLowerCase() || '').includes(term) ||
            (contact.status?.toLowerCase() || '').includes(term)
        );
        return matchesSearch;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedContacts = filteredContacts.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="space-y-6">
            {/* ... Header ... */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">담당자 정보</h1>
                    <p className="text-gray-500 mt-1">고객사 담당자 연락처를 관리합니다.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchContacts}
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
                                    onClick={() => {
                                        alert('준비 중인 기능입니다.');
                                        setIsMenuOpen(false);
                                    }}
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
                            placeholder="담당자명, 업체명, 이메일 검색..."
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
                                <th className="px-6 py-3 font-bold text-gray-500">담당자명</th>
                                <th className="px-6 py-3 font-bold text-gray-500">업체명</th>
                                <th className="px-6 py-3 font-bold text-gray-500">부서</th>
                                <th className="px-6 py-3 font-bold text-gray-500">직급</th>
                                <th className="px-6 py-3 font-bold text-gray-500">휴대전화</th>
                                <th className="px-6 py-3 font-bold text-gray-500">이메일</th>
                                <th className="px-6 py-3 font-bold text-gray-500">담당자</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paginatedContacts.map((contact) => (
                                <tr key={contact.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">
                                        <button
                                            onClick={() => setSelectedContact(contact)}
                                            className="hover:text-blue-600 hover:underline text-left"
                                        >
                                            {contact.name || '-'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <Building2 size={16} className="text-gray-400" />
                                            {contact.accounts?.name || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{contact.department || '-'}</td>
                                    <td className="px-6 py-4 text-gray-600">{contact.position || '-'}</td>
                                    <td className="px-6 py-4 text-gray-600 relative">
                                        <div className="flex items-center text-xs">
                                            <Phone size={12} className="mr-1.5 text-gray-400" />
                                            {contact.phone ? (
                                                <div className="relative">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActivePhonePopover(activePhonePopover === contact.id ? null : contact.id);
                                                        }}
                                                        className="hover:text-blue-600 hover:underline text-left phone-popover-trigger"
                                                    >
                                                        {contact.phone}
                                                    </button>

                                                    {activePhonePopover === contact.id && (
                                                        <div className="absolute left-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1 animate-in fade-in zoom-in-95 duration-200 phone-popover-menu">
                                                            <a
                                                                href={`tel:${contact.phone.replace(/-/g, '')}`}
                                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <PhoneCall size={14} />
                                                                전화 걸기
                                                            </a>
                                                            <a
                                                                href={`sms:${contact.phone.replace(/-/g, '')}`}
                                                                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <MessageSquare size={14} />
                                                                문자 보내기
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        <div className="flex items-center text-xs">
                                            <Mail size={12} className="mr-1.5 text-gray-400" />
                                            {contact.email ? (
                                                <a href={`mailto:${contact.email}`} className="hover:text-blue-600 hover:underline">
                                                    {contact.email}
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{contact.sales_rep || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-sm text-gray-500">
                    <span>Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredContacts.length)} of {filteredContacts.length} contacts</span>
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
            </div>

            {/* Contact Details Modal */}
            {selectedContact && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-900">담당자 정보</h2>
                            <button
                                onClick={() => setSelectedContact(null)}
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
                                    <h3 className="font-bold text-lg text-gray-900">{selectedContact.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                        <span className="px-2 py-0.5 bg-white border border-gray-200 rounded text-xs">
                                            {selectedContact.accounts?.name}
                                        </span>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded text-xs border",
                                            selectedContact.status === 'Active' ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-50 text-gray-600 border-gray-200"
                                        )}>
                                            {selectedContact.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <DetailItem label="담당자명" value={selectedContact.name || '-'} />
                                <DetailItem label="업체명" value={selectedContact.accounts?.name || '-'} />
                                <DetailItem label="부서" value={selectedContact.department || '-'} />
                                <DetailItem label="직급" value={selectedContact.position || '-'} />
                                <DetailItem label="휴대전화" value={selectedContact.phone} />
                                <DetailItem label="이메일" value={selectedContact.email} />
                                <DetailItem label="담당자" value={selectedContact.sales_rep || '-'} />
                                <DetailItem label="거래상태" value={selectedContact.status || '-'} />
                                <DetailItem label="메모" value={selectedContact.memo || '-'} className="sm:col-span-2" />
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => setSelectedContact(null)}
                                className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Account Modal */}
            {isCreateModalOpen && (
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

                        <form onSubmit={handleCreateAccount}>
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
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase">부서</label>
                                    <input type="text" className="w-full p-2 border rounded text-sm" value={newAccount.department} onChange={e => setNewAccount({ ...newAccount, department: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase">직급</label>
                                    <input type="text" className="w-full p-2 border rounded text-sm" value={newAccount.position} onChange={e => setNewAccount({ ...newAccount, position: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase">담당자명</label>
                                    <input type="text" className="w-full p-2 border rounded text-sm" value={newAccount.contactName} onChange={e => setNewAccount({ ...newAccount, contactName: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase">휴대전화</label>
                                    <input type="text" className="w-full p-2 border rounded text-sm" value={newAccount.phone} onChange={e => setNewAccount({ ...newAccount, phone: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase">이메일</label>
                                    <input type="email" className="w-full p-2 border rounded text-sm" value={newAccount.email} onChange={e => setNewAccount({ ...newAccount, email: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase">등록자</label>
                                    <input type="text" className="w-full p-2 border rounded text-sm" value={newAccount.owner} onChange={e => setNewAccount({ ...newAccount, owner: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase">거래상태</label>
                                    <select className="w-full p-2 border rounded text-sm" value={newAccount.status} onChange={e => setNewAccount({ ...newAccount, status: e.target.value })}>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase">등급</label>
                                    <input type="text" className="w-full p-2 border rounded text-sm" value={newAccount.grade} onChange={e => setNewAccount({ ...newAccount, grade: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-500 uppercase">유입경로</label>
                                    <select className="w-full p-2 border rounded text-sm" value={newAccount.type} onChange={e => setNewAccount({ ...newAccount, type: e.target.value })}>
                                        <option value="잠재고객">잠재고객</option>
                                        <option value="Customer">Customer</option>
                                        <option value="Partner">Partner</option>
                                    </select>
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                    <label className="text-xs font-medium text-gray-500 uppercase">비고</label>
                                    <textarea className="w-full p-2 border rounded text-sm" rows={3} value={newAccount.note} onChange={e => setNewAccount({ ...newAccount, note: e.target.value })} />
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
            )}
        </div>
    );
}
