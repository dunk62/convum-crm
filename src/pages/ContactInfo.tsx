import { useState, useEffect } from 'react';
import { Search, RefreshCw, Mail, Phone, Building2, Loader2, AlertCircle, ChevronLeft, ChevronRight, PhoneCall, MessageSquare, X, ChevronDown, Plus, Trash2, Send, ArrowUpDown, Edit2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

const DetailItem = ({ label, value, className = "" }: { label: string; value: string; className?: string }) => (
    <div className={`space-y-1 ${className}`}>
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</label>
        <p className="text-sm font-medium text-white break-words">{value}</p>
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
    intro_mail_status?: string; // Added intro_mail_status
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
    const [pageInput, setPageInput] = useState('1');
    const [selectedContactIds, setSelectedContactIds] = useState<Set<string>>(new Set());
    const [isSendingEmails, setIsSendingEmails] = useState(false);
    const [activePhonePopover, setActivePhonePopover] = useState<string | null>(null);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newAccount, setNewAccount] = useState({
        name: '', industry: '', type: '잠재고객', owner: '', phone: '', email: '',
        status: 'Active', registrationDate: '', mainPhone: '', website: '', address: '',
        department: '', position: '', contactName: '', grade: '', note: ''
    });
    const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

    // Edit Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Partial<Contact>>({});

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

    useEffect(() => {
        setPageInput(String(currentPage));
    }, [currentPage]);

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

    const handleCheckboxChange = (id: string) => {
        const newSelected = new Set(selectedContactIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedContactIds(newSelected);
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedContactIds(new Set(paginatedContacts.map(c => c.id)));
        } else {
            setSelectedContactIds(new Set());
        }
    };

    const handleSendEmails = async () => {
        if (selectedContactIds.size === 0) return;

        const contactIdArray = Array.from(selectedContactIds);
        if (!confirm(`총 ${contactIdArray.length}명에게 회사소개서 메일을 발송하시겠습니까?\n(순차적으로 발송되며 시간이 걸릴 수 있습니다)`)) return;

        setIsSendingEmails(true);
        let successCount = 0;
        let failCount = 0;

        try {
            // 순차적으로 대기열에 추가 (1초 간격)
            for (let i = 0; i < contactIdArray.length; i++) {
                const contactId = contactIdArray[i];

                try {
                    const { error } = await supabase
                        .from('email_queue')
                        .insert({ contact_id: contactId, status: 'pending' });

                    if (error) {
                        console.error(`Error queuing contact ${contactId}:`, error);
                        failCount++;
                    } else {
                        successCount++;
                    }
                } catch (err) {
                    console.error(`Error queuing contact ${contactId}:`, err);
                    failCount++;
                }

                // 각 요청 사이에 1초 대기 (마지막 요청 제외)
                if (i < contactIdArray.length - 1) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }

            if (failCount > 0) {
                alert(`메일 발송 요청 완료\n성공: ${successCount}건\n실패: ${failCount}건`);
            } else {
                alert(`${successCount}건의 메일 발송 요청이 대기열에 등록되었습니다.\n순차적으로 발송됩니다.`);
            }
            setSelectedContactIds(new Set());
        } catch (err: any) {
            console.error('Error queuing emails:', err);
            alert('메일 발송 요청 중 오류가 발생했습니다: ' + err.message);
        } finally {
            setIsSendingEmails(false);
        }
    };

    // Delete contacts handler
    const handleDeleteContacts = async (id?: string) => {
        const idsToDelete = id ? [id] : Array.from(selectedContactIds);
        if (idsToDelete.length === 0) {
            alert('삭제할 항목을 선택해주세요.');
            return;
        }
        if (!confirm(`${idsToDelete.length}개의 담당자 정보를 삭제하시겠습니까?`)) return;

        try {
            const { error } = await supabase
                .from('contacts')
                .delete()
                .in('id', idsToDelete);

            if (error) throw error;
            await fetchContacts();
            setSelectedContactIds(new Set());
            setIsMenuOpen(false);
            alert('삭제되었습니다.');
        } catch (err: any) {
            console.error('Error deleting contacts:', err);
            alert('삭제 중 오류가 발생했습니다: ' + err.message);
        }
    };

    // Edit contact handler
    const handleEditContact = (contact?: Contact) => {
        if (contact) {
            setEditingContact(contact);
        } else if (selectedContactIds.size === 1) {
            const id = Array.from(selectedContactIds)[0];
            const found = contacts.find(c => c.id === id);
            if (found) setEditingContact(found);
        } else {
            alert('수정할 항목을 하나만 선택해주세요.');
            return;
        }
        setIsEditModalOpen(true);
        setIsMenuOpen(false);
    };

    const handleSaveContact = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingContact.id) return;

        try {
            const payload = {
                name: editingContact.name,
                department: editingContact.department,
                position: editingContact.position,
                phone: editingContact.phone,
                email: editingContact.email,
                sales_rep: editingContact.sales_rep,
                status: editingContact.status,
                memo: editingContact.memo,
            };

            const { error } = await supabase
                .from('contacts')
                .update(payload)
                .eq('id', editingContact.id);

            if (error) throw error;

            await fetchContacts();
            setIsEditModalOpen(false);
            setEditingContact({});
            alert('저장되었습니다.');
        } catch (err: any) {
            console.error('Error updating contact:', err);
            alert('저장 중 오류가 발생했습니다: ' + err.message);
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

    // Sorting Logic
    const handleSort = (key: string) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedContacts = [...filteredContacts].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;

        let aValue = '';
        let bValue = '';

        if (key === 'name') {
            aValue = a.name || '';
            bValue = b.name || '';
        } else if (key === 'company') {
            aValue = a.accounts?.name || '';
            bValue = b.accounts?.name || '';
        } else if (key === 'intro_mail_status') {
            aValue = a.intro_mail_status || '';
            bValue = b.intro_mail_status || '';
        }

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    // Pagination Logic
    const totalPages = Math.ceil(sortedContacts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedContacts = sortedContacts.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="space-y-6">
            {/* ... Header ... */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">담당자 정보</h1>
                    <p className="text-muted-foreground mt-1">고객사 담당자 연락처를 관리합니다.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchContacts}
                        className="p-2 text-muted-foreground hover:text-muted-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                        title="새로고침"
                    >
                        {isLoading ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
                    </button>
                    <button
                        onClick={handleSendEmails}
                        disabled={isSendingEmails || selectedContactIds.size === 0}
                        className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSendingEmails ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        메일 발송 {selectedContactIds.size > 0 ? `(${selectedContactIds.size})` : ''}
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
                            <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border py-1 z-10">
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
                                    onClick={() => handleEditContact()}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-muted-foreground hover:bg-secondary/30"
                                >
                                    <Edit2 size={16} />
                                    수정
                                </button>
                                <button
                                    onClick={() => handleDeleteContacts()}
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

            {error && (
                <div className="bg-danger/10 border border-danger/20 text-danger px-4 py-3 rounded-lg flex items-center gap-2">
                    <AlertCircle size={20} />
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="p-4 border-b border-border flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                        <input
                            type="text"
                            placeholder="담당자명, 업체명, 이메일 검색..."
                            className="w-full pl-10 pr-4 py-2 bg-secondary text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
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
                        <thead className="bg-secondary/30 border-b border-border">
                            <tr>
                                <th className="px-6 py-3 text-center text-base font-bold text-muted-foreground whitespace-nowrap">
                                    <div className="flex items-center justify-center gap-2 cursor-pointer" onClick={() => handleSort('name')}>
                                        <input
                                            type="checkbox"
                                            onChange={handleSelectAll}
                                            checked={paginatedContacts.length > 0 && selectedContactIds.size === paginatedContacts.length}
                                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        담당자명
                                        <ArrowUpDown size={14} className="text-muted-foreground" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-center text-base font-bold text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-secondary/50" onClick={() => handleSort('company')}>
                                    <div className="flex items-center justify-center gap-1">
                                        업체명
                                        <ArrowUpDown size={14} className="text-muted-foreground" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-center text-base font-bold text-muted-foreground whitespace-nowrap">부서</th>
                                <th className="px-6 py-3 text-center text-base font-bold text-muted-foreground whitespace-nowrap">직급</th>
                                <th className="px-6 py-3 text-center text-base font-bold text-muted-foreground whitespace-nowrap">휴대전화</th>
                                <th className="px-6 py-3 text-center text-base font-bold text-muted-foreground whitespace-nowrap">이메일</th>
                                <th className="px-6 py-3 text-center text-base font-bold text-muted-foreground whitespace-nowrap">영업 담당자</th>
                                <th className="px-6 py-3 text-center text-base font-bold text-muted-foreground whitespace-nowrap cursor-pointer hover:bg-secondary/50" onClick={() => handleSort('intro_mail_status')}>
                                    <div className="flex items-center justify-center gap-1">
                                        회사소개서 발송
                                        <ArrowUpDown size={14} className="text-muted-foreground" />
                                    </div>
                                </th>
                                <th className="px-6 py-3 w-20"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {paginatedContacts.map((contact) => (
                                <tr key={contact.id} className="hover:bg-secondary/30 transition-colors group">
                                    <td className="px-6 py-4 font-medium text-white">
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedContactIds.has(contact.id)}
                                                onChange={() => handleCheckboxChange(contact.id)}
                                                className="w-4 h-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                            <button
                                                onClick={() => setSelectedContact(contact)}
                                                className="hover:text-accent hover:underline text-left"
                                            >
                                                {contact.name || '-'}
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        <div className="flex items-center gap-2">
                                            <Building2 size={16} className="text-muted-foreground" />
                                            {contact.accounts?.name || '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">{contact.department || '-'}</td>
                                    <td className="px-6 py-4 text-muted-foreground">{contact.position || '-'}</td>
                                    <td className="px-6 py-4 text-muted-foreground relative">
                                        <div className="flex items-center text-xs">
                                            <Phone size={12} className="mr-1.5 text-muted-foreground" />
                                            {contact.phone ? (
                                                <div className="relative">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActivePhonePopover(activePhonePopover === contact.id ? null : contact.id);
                                                        }}
                                                        className="hover:text-accent hover:underline text-left phone-popover-trigger"
                                                    >
                                                        {contact.phone}
                                                    </button>

                                                    {activePhonePopover === contact.id && (
                                                        <div className="absolute left-0 top-full mt-1 w-48 bg-card rounded-lg shadow-lg border border-border z-50 py-1 animate-in fade-in zoom-in-95 duration-200 phone-popover-menu">
                                                            <a
                                                                href={`tel:${contact.phone.replace(/-/g, '')}`}
                                                                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-secondary/30 hover:text-accent transition-colors"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <PhoneCall size={14} />
                                                                전화 걸기
                                                            </a>
                                                            <a
                                                                href={`sms:${contact.phone.replace(/-/g, '')}`}
                                                                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-secondary/30 hover:text-accent transition-colors"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <MessageSquare size={14} />
                                                                문자 보내기
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">
                                        <div className="flex items-center text-xs">
                                            <Mail size={12} className="mr-1.5 text-muted-foreground" />
                                            {contact.email ? (
                                                <a href={`mailto:${contact.email}`} className="hover:text-accent hover:underline">
                                                    {contact.email}
                                                </a>
                                            ) : (
                                                <span className="text-muted-foreground">-</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">{contact.sales_rep || '-'}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={cn(
                                            "px-2 py-1 rounded-full text-xs font-medium",
                                            contact.intro_mail_status === '발송완료'
                                                ? "bg-green-100 text-success"
                                                : "bg-secondary/50 text-muted-foreground"
                                        )}>
                                            {contact.intro_mail_status || '미발송'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleEditContact(contact)}
                                                className="p-1.5 text-muted-foreground hover:text-cyan-400 hover:bg-cyan-500/10 rounded"
                                                title="수정"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteContacts(contact.id)}
                                                className="p-1.5 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded"
                                                title="삭제"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 border-t border-border bg-secondary/30 flex items-center justify-between text-sm text-muted-foreground">
                    <span>Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredContacts.length)} of {filteredContacts.length} contacts</span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="flex items-center gap-1 px-3 py-1 border border-border rounded hover:bg-card disabled:opacity-50 disabled:hover:bg-transparent"
                        >
                            <ChevronLeft size={16} />
                            Previous
                        </button>

                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={pageInput}
                                onChange={(e) => setPageInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        const val = parseInt(pageInput);
                                        if (!isNaN(val) && val >= 1 && val <= totalPages) {
                                            setCurrentPage(val);
                                        } else {
                                            setPageInput(String(currentPage));
                                        }
                                    }
                                }}
                                onBlur={() => {
                                    const val = parseInt(pageInput);
                                    if (!isNaN(val) && val >= 1 && val <= totalPages) {
                                        setCurrentPage(val);
                                    } else {
                                        setPageInput(String(currentPage));
                                    }
                                }}
                                className="w-12 px-2 py-1 text-center border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            />
                            <span className="text-muted-foreground">/ {totalPages}</span>
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="flex items-center gap-1 px-3 py-1 border border-border rounded hover:bg-card disabled:opacity-50 disabled:hover:bg-transparent"
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
                    <div className="bg-card rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-xl font-semibold text-white">담당자 정보</h2>
                            <button
                                onClick={() => setSelectedContact(null)}
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
                                    <h3 className="font-bold text-lg text-white">{selectedContact.name}</h3>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                        <span className="px-2 py-0.5 bg-card border border-border rounded text-xs">
                                            {selectedContact.accounts?.name}
                                        </span>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded text-xs border",
                                            selectedContact.status === 'Active' ? "bg-success/10 text-success border-green-200" : "bg-secondary/30 text-muted-foreground border-border"
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

                        <div className="p-4 bg-secondary/30 border-t border-border flex justify-end">
                            <button
                                onClick={() => setSelectedContact(null)}
                                className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/30 transition-colors"
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
                    <div className="bg-card rounded-xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-xl font-semibold text-white">새 고객 정보 등록</h2>
                            <button
                                onClick={() => setIsCreateModalOpen(false)}
                                className="text-muted-foreground hover:text-muted-foreground transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleCreateAccount}>
                            <div className="p-6 overflow-y-auto max-h-[70vh] grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">업체명</label>
                                    <input required type="text" className="w-full p-2 bg-secondary text-white border border-border rounded text-sm" value={newAccount.name} onChange={e => setNewAccount({ ...newAccount, name: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">업종</label>
                                    <input type="text" className="w-full p-2 bg-secondary text-white border border-border rounded text-sm" value={newAccount.industry} onChange={e => setNewAccount({ ...newAccount, industry: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">등록일</label>
                                    <input type="date" className="w-full p-2 bg-secondary text-white border border-border rounded text-sm" value={newAccount.registrationDate} onChange={e => setNewAccount({ ...newAccount, registrationDate: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">대표전화</label>
                                    <input type="text" className="w-full p-2 bg-secondary text-white border border-border rounded text-sm" value={newAccount.mainPhone} onChange={e => setNewAccount({ ...newAccount, mainPhone: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">홈페이지</label>
                                    <input type="text" className="w-full p-2 bg-secondary text-white border border-border rounded text-sm" value={newAccount.website} onChange={e => setNewAccount({ ...newAccount, website: e.target.value })} />
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">주소</label>
                                    <input type="text" className="w-full p-2 bg-secondary text-white border border-border rounded text-sm" value={newAccount.address} onChange={e => setNewAccount({ ...newAccount, address: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">부서</label>
                                    <input type="text" className="w-full p-2 bg-secondary text-white border border-border rounded text-sm" value={newAccount.department} onChange={e => setNewAccount({ ...newAccount, department: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">직급</label>
                                    <input type="text" className="w-full p-2 bg-secondary text-white border border-border rounded text-sm" value={newAccount.position} onChange={e => setNewAccount({ ...newAccount, position: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">담당자명</label>
                                    <input type="text" className="w-full p-2 bg-secondary text-white border border-border rounded text-sm" value={newAccount.contactName} onChange={e => setNewAccount({ ...newAccount, contactName: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">휴대전화</label>
                                    <input type="text" className="w-full p-2 bg-secondary text-white border border-border rounded text-sm" value={newAccount.phone} onChange={e => setNewAccount({ ...newAccount, phone: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">이메일</label>
                                    <input type="email" className="w-full p-2 bg-secondary text-white border border-border rounded text-sm" value={newAccount.email} onChange={e => setNewAccount({ ...newAccount, email: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">등록자</label>
                                    <input type="text" className="w-full p-2 bg-secondary text-white border border-border rounded text-sm" value={newAccount.owner} onChange={e => setNewAccount({ ...newAccount, owner: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">거래상태</label>
                                    <select className="w-full p-2 bg-secondary text-white border border-border rounded text-sm" value={newAccount.status} onChange={e => setNewAccount({ ...newAccount, status: e.target.value })}>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">등급</label>
                                    <input type="text" className="w-full p-2 bg-secondary text-white border border-border rounded text-sm" value={newAccount.grade} onChange={e => setNewAccount({ ...newAccount, grade: e.target.value })} />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">유입경로</label>
                                    <select className="w-full p-2 bg-secondary text-white border border-border rounded text-sm" value={newAccount.type} onChange={e => setNewAccount({ ...newAccount, type: e.target.value })}>
                                        <option value="잠재고객">잠재고객</option>
                                        <option value="Customer">Customer</option>
                                        <option value="Partner">Partner</option>
                                    </select>
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">비고</label>
                                    <textarea className="w-full p-2 bg-secondary text-white border border-border rounded text-sm" rows={3} value={newAccount.note} onChange={e => setNewAccount({ ...newAccount, note: e.target.value })} />
                                </div>
                            </div>
                            <div className="p-4 bg-secondary/30 border-t border-border flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsCreateModalOpen(false)}
                                    className="px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/30 transition-colors"
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

            {/* Edit Contact Modal */}
            {isEditModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-card rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-border">
                            <h2 className="text-xl font-semibold text-white">담당자 정보 수정</h2>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-muted-foreground hover:text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveContact}>
                            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">담당자명</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-2 bg-secondary text-white border border-border rounded text-sm"
                                        value={editingContact.name || ''}
                                        onChange={e => setEditingContact({ ...editingContact, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">업체명</label>
                                    <input
                                        type="text"
                                        disabled
                                        className="w-full p-2 bg-secondary/50 text-muted-foreground border border-border rounded text-sm cursor-not-allowed"
                                        value={editingContact.accounts?.name || ''}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">부서</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 bg-secondary text-white border border-border rounded text-sm"
                                        value={editingContact.department || ''}
                                        onChange={e => setEditingContact({ ...editingContact, department: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">직급</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 bg-secondary text-white border border-border rounded text-sm"
                                        value={editingContact.position || ''}
                                        onChange={e => setEditingContact({ ...editingContact, position: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">휴대전화</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 bg-secondary text-white border border-border rounded text-sm"
                                        value={editingContact.phone || ''}
                                        onChange={e => setEditingContact({ ...editingContact, phone: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">이메일</label>
                                    <input
                                        type="email"
                                        className="w-full p-2 bg-secondary text-white border border-border rounded text-sm"
                                        value={editingContact.email || ''}
                                        onChange={e => setEditingContact({ ...editingContact, email: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">영업 담당자</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 bg-secondary text-white border border-border rounded text-sm"
                                        value={editingContact.sales_rep || ''}
                                        onChange={e => setEditingContact({ ...editingContact, sales_rep: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">거래상태</label>
                                    <select
                                        className="w-full p-2 bg-secondary text-white border border-border rounded text-sm"
                                        value={editingContact.status || ''}
                                        onChange={e => setEditingContact({ ...editingContact, status: e.target.value })}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>
                                </div>
                                <div className="space-y-1 sm:col-span-2">
                                    <label className="text-xs font-medium text-muted-foreground uppercase">메모</label>
                                    <textarea
                                        className="w-full p-2 bg-secondary text-white border border-border rounded text-sm"
                                        rows={2}
                                        value={editingContact.memo || ''}
                                        onChange={e => setEditingContact({ ...editingContact, memo: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="p-4 bg-secondary/30 border-t border-border flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
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
