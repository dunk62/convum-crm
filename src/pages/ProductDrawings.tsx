import { useState, useCallback, useEffect, useRef } from 'react';
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
    const [previewFile, setPreviewFile] = useState<DrawingFile | null>(null);

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

            {/* Search Results - Split Layout */}
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

                    {/* Split Layout: File List (40%) + Preview (60%) */}
                    <div className="flex flex-col lg:flex-row min-h-[500px]">
                        {/* Left: File List (40%) */}
                        <div className="w-full lg:w-[40%] border-b lg:border-b-0 lg:border-r border-border overflow-y-auto max-h-[600px]">
                            {searchError ? (
                                <div className="text-center py-8">
                                    <AlertCircle className="mx-auto text-red-400 mb-3" size={40} />
                                    <p className="text-red-400">{searchError}</p>
                                </div>
                            ) : drawings.length === 0 ? (
                                <div className="text-center py-8">
                                    <FileText className="mx-auto text-muted-foreground/30 mb-3" size={48} />
                                    <p className="text-muted-foreground">'{searchQuery}'에 해당하는 도면 파일이 없습니다.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border">
                                    {drawings.map((drawing) => (
                                        <div
                                            key={drawing.id}
                                            onClick={() => setPreviewFile(drawing)}
                                            className={`p-3 cursor-pointer transition-all flex items-center gap-3 ${previewFile?.id === drawing.id
                                                ? 'bg-blue-500/20 border-l-4 border-l-blue-500'
                                                : 'hover:bg-secondary/50'
                                                }`}
                                        >
                                            {/* Selection Checkbox */}
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleFileSelection(drawing.id);
                                                }}
                                                className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${selectedFiles.has(drawing.id)
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-secondary/50 border border-border hover:border-blue-400'
                                                    }`}
                                            >
                                                {selectedFiles.has(drawing.id) && <CheckCircle size={14} />}
                                            </div>

                                            {/* File Icon */}
                                            <div className="flex-shrink-0">
                                                {getFileIcon(drawing.type)}
                                            </div>

                                            {/* File Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white font-medium truncate">{drawing.name}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`text-xs px-1.5 py-0.5 rounded border ${getTypeBadgeColor(drawing.type)}`}>
                                                        {drawing.type}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">.{drawing.extension}</span>
                                                </div>
                                            </div>

                                            {/* Quick Actions */}
                                            <div className="flex items-center gap-1">
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
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Preview Panel (60%) */}
                        <div className="w-full lg:w-[60%] bg-slate-900/50">
                            <PreviewPanel file={previewFile} />
                        </div>
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
        body += '문의사항이 있으시면 언제든 연락주세요.\n\n';
        body += '컨범 코리아\n';
        body += '남부전략영업소\n';
        body += '탁현호 배상\n\n';
        body += '**************************************************\n';
        body += 'CONVUM KOREA CO., LTD.\n';
        body += 'Southern Strategic Sales Office / 남부전략영업소 탁현호 (TAK HYEON HO) 소장\n';
        body += '〒46721 부산광역시 강서구 유통단지1로 41 (대저2동) 부산티플렉스 128동 208호\n';
        body += 'FAX) 051-987-2352\n';
        body += 'H.P) 010-4981-8390\n';
        body += 'E-mail : thh0222@convum.co.kr\n';
        body += 'Home page : http://www.convum.co.kr\n';
        body += 'CONVUM은 CONVUM Ltd.의 브랜드명입니다.\n';
        body += '**************************************************';

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

// Preview Panel Component
interface PreviewPanelProps {
    file: DrawingFile | null;
}

function PreviewPanel({ file }: PreviewPanelProps) {
    const [isLoading, setIsLoading] = useState(true);

    // Determine viewer type based on extension
    const getViewerType = (extension: string): 'document' | '3d' | 'unsupported' => {
        const ext = extension.toLowerCase();
        if (['pdf', 'png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)) return 'document';
        if (['stp', 'step', 'igs', 'iges', 'stl'].includes(ext)) return '3d';
        return 'unsupported';
    };

    if (!file) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
                <div className="w-20 h-20 rounded-2xl bg-slate-800/50 flex items-center justify-center mb-4">
                    <FileText size={40} className="text-muted-foreground/30" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">파일을 선택하세요</h3>
                <p className="text-sm text-muted-foreground">
                    좌측 목록에서 파일을 클릭하면<br />미리보기가 표시됩니다.
                </p>
            </div>
        );
    }

    const viewerType = getViewerType(file.extension);

    // TYPE A: Document/Image Viewer (PDF, PNG, JPG)
    if (viewerType === 'document') {
        const embedUrl = `https://drive.google.com/file/d/${file.fileId}/preview`;

        return (
            <div className="h-full flex flex-col min-h-[500px]">
                {/* Preview Header */}
                <div className="p-3 border-b border-border flex items-center justify-between bg-slate-900/80">
                    <div className="flex items-center gap-2">
                        <FileText size={18} className="text-red-400" />
                        <span className="text-sm font-medium text-white truncate max-w-[300px]">{file.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={file.viewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-muted-foreground hover:text-blue-400 hover:bg-blue-500/10 rounded transition-colors"
                            title="새 탭에서 열기"
                        >
                            <ExternalLink size={16} />
                        </a>
                        <a
                            href={file.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-muted-foreground hover:text-green-400 hover:bg-green-500/10 rounded transition-colors"
                            title="다운로드"
                        >
                            <Download size={16} />
                        </a>
                    </div>
                </div>

                {/* Document Viewer */}
                <div className="flex-1 relative">
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 z-10">
                            <div className="text-center">
                                <Loader2 className="animate-spin mx-auto text-blue-400 mb-2" size={32} />
                                <p className="text-sm text-muted-foreground">문서 로딩 중...</p>
                            </div>
                        </div>
                    )}
                    <iframe
                        src={embedUrl}
                        className="w-full h-full min-h-[450px] border-0"
                        onLoad={() => setIsLoading(false)}
                        title={file.name}
                    />
                </div>
            </div>
        );
    }

    // TYPE B: 3D Model Viewer (STEP, STP, IGS) - Using Proxy API
    if (viewerType === '3d') {
        return (
            <div className="h-full flex flex-col min-h-[500px]">
                {/* Preview Header */}
                <div className="p-3 border-b border-border flex items-center justify-between bg-slate-900/80">
                    <div className="flex items-center gap-2">
                        <Box size={18} className="text-green-400" />
                        <span className="text-sm font-medium text-white truncate max-w-[300px]">{file.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30">3D</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">마우스로 회전/확대 가능</span>
                        <a
                            href={file.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 text-sm bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors flex items-center gap-2"
                        >
                            <Download size={14} />
                            다운로드
                        </a>
                    </div>
                </div>

                {/* 3D Viewer with Proxy */}
                <ThreeDViewer file={file} />
            </div>
        );
    }

    // TYPE C: Unsupported Format (DWG, DXF)
    return (
        <div className="h-full flex flex-col min-h-[500px]">
            {/* Preview Header */}
            <div className="p-3 border-b border-border flex items-center justify-between bg-slate-900/80">
                <div className="flex items-center gap-2">
                    <FileImage size={18} className="text-blue-400" />
                    <span className="text-sm font-medium text-white truncate max-w-[300px]">{file.name}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">2D CAD</span>
                </div>
            </div>

            {/* Unsupported Format Message */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-blue-900/20 to-slate-900">
                <div className="w-24 h-24 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-4">
                    <AlertCircle size={48} className="text-amber-400" />
                </div>
                <h3 className="text-lg font-medium text-white mb-2">미리보기를 지원하지 않는 형식입니다</h3>
                <p className="text-sm text-muted-foreground mb-6">
                    이 파일 형식(.{file.extension})은 웹 브라우저에서<br />
                    직접 미리보기가 불가능합니다.
                </p>
                <a
                    href={file.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl hover:from-blue-600 hover:to-cyan-700 transition-all shadow-lg flex items-center gap-3 text-lg"
                >
                    <Download size={24} />
                    파일 다운로드
                </a>
                <p className="text-xs text-muted-foreground mt-4">
                    AutoCAD 또는 호환 프로그램에서 열어주세요.
                </p>
            </div>
        </div>
    );
}


// 3D Viewer Component using online-3d-viewer with Proxy API
interface ThreeDViewerProps {
    file: DrawingFile;
}

function ThreeDViewer({ file }: ThreeDViewerProps) {
    const viewerContainerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const viewerRef = useRef<any>(null);

    useEffect(() => {
        let mounted = true;
        
        const loadViewer = async () => {
            if (!viewerContainerRef.current) return;
            
            try {
                setIsLoading(true);
                setError(null);
                
                if (viewerRef.current) {
                    viewerContainerRef.current.innerHTML = '';
                    viewerRef.current = null;
                }

                const OV = await import('online-3d-viewer');
                
                if (!mounted) return;

                const parentDiv = viewerContainerRef.current;
                parentDiv.innerHTML = '';
                
                const bgColor = new OV.RGBAColor(30, 41, 59, 255);
                
                const viewer = new OV.EmbeddedViewer(parentDiv, {
                    backgroundColor: bgColor,
                    defaultColor: new OV.RGBColor(200, 200, 200),
                    edgeSettings: new OV.EdgeSettings(false, new OV.RGBColor(0, 0, 0), 1)
                });
                
                viewerRef.current = viewer;

                const proxyUrl = `/api/fetch-drive-file?fileId=${file.fileId}`;
                
                (viewer as any).LoadModelFromUrlList([proxyUrl]);

                const checkLoaded = setInterval(() => {
                    if (!mounted) {
                        clearInterval(checkLoaded);
                        return;
                    }
                    const viewerElement = parentDiv.querySelector('canvas');
                    if (viewerElement) {
                        setIsLoading(false);
                        clearInterval(checkLoaded);
                    }
                }, 500);

                setTimeout(() => {
                    clearInterval(checkLoaded);
                    if (mounted) {
                        setIsLoading(false);
                    }
                }, 20000);
                
            } catch (err) {
                console.error('Viewer initialization error:', err);
                if (mounted) {
                    setError('3D 뷰어 초기화에 실패했습니다.');
                    setIsLoading(false);
                }
            }
        };

        loadViewer();

        return () => {
            mounted = false;
            if (viewerRef.current && viewerContainerRef.current) {
                viewerContainerRef.current.innerHTML = '';
                viewerRef.current = null;
            }
        };
    }, [file.id, file.fileId]);

    return (
        <div className="flex-1 relative bg-slate-800 min-h-[400px]">
            {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 z-20">
                    <div className="relative">
                        <div className="w-16 h-16 border-4 border-green-500/30 border-t-green-500 rounded-full animate-spin" />
                        <Box size={24} className="text-green-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">⏳ 3D 모델링 로딩 중...</p>
                    <p className="text-xs text-muted-foreground mt-1">파일 크기에 따라 시간이 소요될 수 있습니다.</p>
                </div>
            )}

            {error && !isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 p-8 text-center z-20">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center mb-4">
                        <AlertCircle size={32} className="text-amber-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white mb-2">로딩 실패</h3>
                    <p className="text-sm text-muted-foreground mb-4 max-w-sm">{error}</p>
                    <a
                        href={file.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg flex items-center gap-2"
                    >
                        <Download size={18} />
                        파일 다운로드
                    </a>
                </div>
            )}

            <div 
                ref={viewerContainerRef} 
                className="w-full h-full min-h-[400px]"
                style={{ touchAction: 'none' }}
            />

            {!isLoading && !error && (
                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-white/70">
                    <span>🖱️ 드래그: 회전 | 스크롤: 확대/축소 | Shift+드래그: 이동</span>
                </div>
            )}
        </div>
    );
}
