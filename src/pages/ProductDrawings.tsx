import { useState, useCallback } from 'react';
import { Search, FileText, Send, Download, Loader2, CheckCircle, X, Mail, ExternalLink, FileImage, Box, AlertCircle } from 'lucide-react';

// Drawing file interface
interface DrawingFile {
    id: string;
    name: string;
    fileId: string;
    type: '2D' | '3D' | 'PDF' | 'OTHER';
    extension: string;
    viewUrl: string;
    downloadUrl: string;
    modifiedTime?: string;
}

// Drawing folder ID
const DRAWING_FOLDER_ID = '1vSETx8c-dLU5Pmtg6-0RlB_mJ9L3so88';

export default function ProductDrawings() {
    const [searchQuery, setSearchQuery] = useState('');
    const [drawings, setDrawings] = useState<DrawingFile[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

    // Determine file type based on extension
    const getFileType = (filename: string): DrawingFile['type'] => {
        const ext = filename.toLowerCase().split('.').pop() || '';
        if (ext === 'pdf') return 'PDF';
        if (['dwg', 'dxf', 'dwf'].includes(ext)) return '2D';
        if (['stp', 'step', 'igs', 'iges', 'stl', 'x_t', 'x_b', 'sat', 'sldprt', 'prt'].includes(ext)) return '3D';
        return 'OTHER';
    };

    // Get file icon based on type
    const getFileIcon = (type: DrawingFile['type']) => {
        switch (type) {
            case 'PDF': return <FileText className="text-red-400" size={24} />;
            case '2D': return <FileImage className="text-blue-400" size={24} />;
            case '3D': return <Box className="text-green-400" size={24} />;
            default: return <FileText className="text-gray-400" size={24} />;
        }
    };

    // Get file type badge color
    const getTypeBadgeColor = (type: DrawingFile['type']) => {
        switch (type) {
            case 'PDF': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case '2D': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case '3D': return 'bg-green-500/20 text-green-400 border-green-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    // Get all subfolders in the root folder
    const getSubfolders = async (parentFolderId: string, apiKey: string): Promise<string[]> => {
        const query = `'${parentFolderId}' in parents and mimeType='application/vnd.google-apps.folder'`;
        const response = await fetch(
            `https://www.googleapis.com/drive/v3/files?` +
            `q=${encodeURIComponent(query)}` +
            `&fields=files(id)` +
            `&pageSize=100` +
            `&key=${apiKey}`
        );

        if (!response.ok) return [];

        const data = await response.json();
        return data.files?.map((f: any) => f.id) || [];
    };

    // Search files in a specific folder
    const searchInFolder = async (folderId: string, searchTerm: string, apiKey: string): Promise<any[]> => {
        const query = `'${folderId}' in parents and name contains '${searchTerm}'`;
        const response = await fetch(
            `https://www.googleapis.com/drive/v3/files?` +
            `q=${encodeURIComponent(query)}` +
            `&fields=files(id,name,mimeType,modifiedTime)` +
            `&pageSize=100` +
            `&key=${apiKey}`
        );

        if (!response.ok) return [];

        const data = await response.json();
        return data.files || [];
    };

    // Search Google Drive for drawings (including subfolders)
    const searchDrawings = useCallback(async () => {
        if (!searchQuery.trim()) {
            alert('형번을 입력해 주세요.');
            return;
        }

        setIsSearching(true);
        setSearchError(null);
        setHasSearched(true);

        try {
            const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

            if (!GOOGLE_API_KEY) {
                throw new Error('Google API 키가 설정되지 않았습니다.');
            }

            const searchTerm = searchQuery.trim();

            // 1. Get all subfolders in the root folder
            const subfolderIds = await getSubfolders(DRAWING_FOLDER_ID, GOOGLE_API_KEY);

            // 2. Search in root folder and all subfolders
            const folderIds = [DRAWING_FOLDER_ID, ...subfolderIds];

            // 3. For deeper nesting, get subfolders of subfolders
            for (const subfolderId of subfolderIds) {
                const nestedFolders = await getSubfolders(subfolderId, GOOGLE_API_KEY);
                folderIds.push(...nestedFolders);
            }

            // 4. Search in all folders in parallel
            const searchPromises = folderIds.map(folderId =>
                searchInFolder(folderId, searchTerm, GOOGLE_API_KEY)
            );

            const results = await Promise.all(searchPromises);
            const allFiles = results.flat();

            if (allFiles.length > 0) {
                const drawingFiles: DrawingFile[] = allFiles.map((file: any) => {
                    const extension = file.name.split('.').pop()?.toLowerCase() || '';
                    return {
                        id: file.id,
                        name: file.name,
                        fileId: file.id,
                        type: getFileType(file.name),
                        extension,
                        viewUrl: `https://drive.google.com/file/d/${file.id}/view`,
                        downloadUrl: `https://drive.google.com/uc?export=download&id=${file.id}`,
                        modifiedTime: file.modifiedTime
                    };
                });

                // Sort by type (PDF first, then 2D, then 3D)
                drawingFiles.sort((a, b) => {
                    const order = { 'PDF': 0, '2D': 1, '3D': 2, 'OTHER': 3 };
                    return order[a.type] - order[b.type];
                });

                setDrawings(drawingFiles);
            } else {
                setDrawings([]);
            }
        } catch (error: any) {
            console.error('Search error:', error);
            setSearchError(error.message || '검색 중 오류가 발생했습니다.');
            setDrawings([]);
        } finally {
            setIsSearching(false);
        }
    }, [searchQuery]);

    // Toggle file selection
    const toggleFileSelection = (fileId: string) => {
        setSelectedFiles(prev => {
            const newSet = new Set(prev);
            if (newSet.has(fileId)) {
                newSet.delete(fileId);
            } else {
                newSet.add(fileId);
            }
            return newSet;
        });
    };

    // Select all files
    const selectAllFiles = () => {
        if (selectedFiles.size === drawings.length) {
            setSelectedFiles(new Set());
        } else {
            setSelectedFiles(new Set(drawings.map(d => d.id)));
        }
    };

    // Open email modal
    const openEmailModal = () => {
        if (selectedFiles.size === 0) {
            alert('발송할 파일을 선택해 주세요.');
            return;
        }
        setIsEmailModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                            <FileImage size={20} className="text-white" />
                        </div>
                        제품 도면
                    </h1>
                    <p className="text-muted-foreground mt-1">형번으로 도면 파일을 검색하고 고객에게 패키지로 발송합니다.</p>
                </div>
            </div>

            {/* Search Section */}
            <div className="bg-card/80 backdrop-blur-sm p-6 rounded-xl border border-border">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Search size={20} className="text-blue-400" />
                    도면 검색
                </h2>
                <div className="flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="형번 입력 (예: CKV010, BMC-22...)"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && searchDrawings()}
                            className="w-full pl-10 pr-4 py-3 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>
                    <button
                        onClick={searchDrawings}
                        disabled={isSearching}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all shadow-lg disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSearching ? (
                            <>
                                <Loader2 className="animate-spin" size={18} />
                                검색 중...
                            </>
                        ) : (
                            <>
                                <Search size={18} />
                                도면 검색
                            </>
                        )}
                    </button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                    * 형번이 파일명에 포함된 모든 도면을 검색합니다 (PDF, 2D CAD, 3D CAD)
                </p>
            </div>

            {/* Search Results */}
            {hasSearched && (
                <div className="bg-card/80 backdrop-blur-sm rounded-xl border border-border overflow-hidden">
                    {/* Results Header */}
                    <div className="p-4 border-b border-border flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-white">검색 결과</h3>
                            {drawings.length > 0 && (
                                <span className="text-sm text-muted-foreground">
                                    {drawings.length}개 파일 | {selectedFiles.size}개 선택됨
                                </span>
                            )}
                        </div>
                        {drawings.length > 0 && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={selectAllFiles}
                                    className="px-3 py-1.5 text-sm bg-secondary/50 text-muted-foreground rounded-lg hover:bg-secondary hover:text-white transition-colors"
                                >
                                    {selectedFiles.size === drawings.length ? '전체 해제' : '전체 선택'}
                                </button>
                                <button
                                    onClick={openEmailModal}
                                    disabled={selectedFiles.size === 0}
                                    className="px-4 py-1.5 text-sm bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                    <Mail size={16} />
                                    패키지 메일 발송
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Results Content */}
                    <div className="p-4">
                        {searchError ? (
                            <div className="text-center py-8">
                                <AlertCircle className="mx-auto text-red-400 mb-3" size={40} />
                                <p className="text-red-400">{searchError}</p>
                            </div>
                        ) : drawings.length === 0 ? (
                            <div className="text-center py-8">
                                <FileText className="mx-auto text-muted-foreground/30 mb-3" size={48} />
                                <p className="text-muted-foreground">'{searchQuery}'에 해당하는 도면 파일이 없습니다.</p>
                                <p className="text-sm text-muted-foreground mt-1">다른 형번으로 검색해 보세요.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {drawings.map((drawing) => (
                                    <div
                                        key={drawing.id}
                                        onClick={() => toggleFileSelection(drawing.id)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedFiles.has(drawing.id)
                                            ? 'bg-blue-500/10 border-blue-500 ring-2 ring-blue-500/30'
                                            : 'bg-secondary/30 border-border hover:border-blue-500/50'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            {/* Checkbox */}
                                            <div className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 ${selectedFiles.has(drawing.id)
                                                ? 'bg-blue-500 text-white'
                                                : 'bg-secondary/50 border border-border'
                                                }`}>
                                                {selectedFiles.has(drawing.id) && <CheckCircle size={14} />}
                                            </div>

                                            {/* File Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    {getFileIcon(drawing.type)}
                                                    <span className={`text-xs px-2 py-0.5 rounded-full border ${getTypeBadgeColor(drawing.type)}`}>
                                                        {drawing.type}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-white font-medium truncate">{drawing.name}</p>
                                                <p className="text-xs text-muted-foreground mt-1">.{drawing.extension}</p>

                                                {/* Actions */}
                                                <div className="flex items-center gap-2 mt-3">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            window.open(drawing.viewUrl, '_blank');
                                                        }}
                                                        className="p-1.5 text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                                                        title="보기"
                                                    >
                                                        <ExternalLink size={14} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            window.open(drawing.downloadUrl, '_blank');
                                                        }}
                                                        className="p-1.5 text-muted-foreground hover:text-green-400 hover:bg-green-500/10 rounded transition-colors"
                                                        title="다운로드"
                                                    >
                                                        <Download size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Email Modal */}
            {isEmailModalOpen && (
                <DrawingEmailModal
                    modelNo={searchQuery}
                    selectedFiles={drawings.filter(d => selectedFiles.has(d.id))}
                    onClose={() => setIsEmailModalOpen(false)}
                />
            )}
        </div>
    );
}

// Email Modal Component
interface DrawingEmailModalProps {
    modelNo: string;
    selectedFiles: DrawingFile[];
    onClose: () => void;
}

function DrawingEmailModal({ modelNo, selectedFiles, onClose }: DrawingEmailModalProps) {
    const [recipientEmail, setRecipientEmail] = useState('');
    const [emailSubject, setEmailSubject] = useState(`[${modelNo}] 제품 도면 자료 안내`);
    const [additionalMessage, setAdditionalMessage] = useState('안녕하세요,\n\n요청하신 제품 도면 자료를 보내드립니다.\n아래 링크를 통해 파일을 다운로드하실 수 있습니다.');

    // Group files by type
    const pdfFiles = selectedFiles.filter(f => f.type === 'PDF');
    const cadFiles2D = selectedFiles.filter(f => f.type === '2D');
    const cadFiles3D = selectedFiles.filter(f => f.type === '3D');
    const otherFiles = selectedFiles.filter(f => f.type === 'OTHER');

    // Generate email body with file links
    const generateEmailBody = () => {
        let body = additionalMessage + '\n\n';
        body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        body += `📦 [${modelNo}] 도면 패키지\n`;
        body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

        if (pdfFiles.length > 0) {
            body += `📄 PDF 문서 (${pdfFiles.length}개)\n`;
            pdfFiles.forEach(f => {
                body += `• ${f.name}\n  ${f.viewUrl}\n`;
            });
            body += '\n';
        }

        if (cadFiles2D.length > 0) {
            body += `📐 2D CAD 도면 (${cadFiles2D.length}개)\n`;
            cadFiles2D.forEach(f => {
                body += `• ${f.name}\n  ${f.downloadUrl}\n`;
            });
            body += '\n';
        }

        if (cadFiles3D.length > 0) {
            body += `🧊 3D CAD 도면 (${cadFiles3D.length}개)\n`;
            cadFiles3D.forEach(f => {
                body += `• ${f.name}\n  ${f.downloadUrl}\n`;
            });
            body += '\n';
        }

        if (otherFiles.length > 0) {
            body += `📎 기타 파일 (${otherFiles.length}개)\n`;
            otherFiles.forEach(f => {
                body += `• ${f.name}\n  ${f.downloadUrl}\n`;
            });
            body += '\n';
        }

        body += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
        body += '문의사항이 있으시면 언제든 연락주세요.\n감사합니다.';

        return body;
    };

    // Send email via API
    const [isSending, setIsSending] = useState(false);

    const sendEmail = async () => {
        if (!recipientEmail.trim()) {
            alert('받는 사람 이메일을 입력해 주세요.');
            return;
        }

        setIsSending(true);

        try {
            const body = generateEmailBody();

            const response = await fetch('/api/send-drawing-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: recipientEmail,
                    subject: emailSubject,
                    body: body,
                    modelNo: modelNo,
                    fileCount: selectedFiles.length
                }),
            });

            const result = await response.json();

            if (response.ok) {
                alert(`✅ 도면 패키지(${selectedFiles.length}개)가 ${recipientEmail}로 발송되었습니다!`);
                onClose();
            } else {
                throw new Error(result.details || result.error || '이메일 발송에 실패했습니다.');
            }
        } catch (error: any) {
            console.error('Email send error:', error);
            alert(`❌ 이메일 발송 실패: ${error.message}`);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-card rounded-2xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Modal Header */}
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                            <Mail size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">도면 패키지 발송</h2>
                            <p className="text-sm text-muted-foreground">{selectedFiles.length}개 파일 선택됨</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-muted-foreground hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto flex-1 space-y-4">
                    {/* Recipient */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">받는 사람 *</label>
                        <input
                            type="email"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            placeholder="customer@example.com"
                            className="w-full px-4 py-3 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">제목</label>
                        <input
                            type="text"
                            value={emailSubject}
                            onChange={(e) => setEmailSubject(e.target.value)}
                            className="w-full px-4 py-3 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        />
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">인사말</label>
                        <textarea
                            value={additionalMessage}
                            onChange={(e) => setAdditionalMessage(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 bg-secondary/50 text-white border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
                        />
                    </div>

                    {/* File Preview */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">첨부 파일 목록</label>
                        <div className="bg-secondary/30 rounded-lg p-4 space-y-2 max-h-40 overflow-y-auto">
                            {selectedFiles.map((file) => (
                                <div key={file.id} className="flex items-center gap-3 text-sm">
                                    {getFileIcon(file.type)}
                                    <span className={`text-xs px-2 py-0.5 rounded border ${getTypeBadgeColor(file.type)}`}>
                                        {file.type}
                                    </span>
                                    <span className="text-white truncate">{file.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-border flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-secondary/50 text-muted-foreground rounded-lg hover:bg-secondary hover:text-white transition-colors"
                    >
                        취소
                    </button>
                    <button
                        onClick={sendEmail}
                        disabled={isSending}
                        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-lg hover:from-blue-600 hover:to-cyan-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSending ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                발송 중...
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                메일 발송
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// Helper function for badge colors in modal
function getTypeBadgeColor(type: DrawingFile['type']) {
    switch (type) {
        case 'PDF': return 'bg-red-500/20 text-red-400 border-red-500/30';
        case '2D': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        case '3D': return 'bg-green-500/20 text-green-400 border-green-500/30';
        default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
}

function getFileIcon(type: DrawingFile['type']) {
    switch (type) {
        case 'PDF': return <FileText className="text-red-400" size={16} />;
        case '2D': return <FileImage className="text-blue-400" size={16} />;
        case '3D': return <Box className="text-green-400" size={16} />;
        default: return <FileText className="text-gray-400" size={16} />;
    }
}
