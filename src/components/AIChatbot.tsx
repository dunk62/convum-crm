import { useState, useRef, useEffect } from 'react';
import { Send, X, RefreshCw, Loader2, Bot, User, Minimize2, Maximize2, Expand, Shrink } from 'lucide-react';
import { getChatService, resetChatService } from '../lib/chatService';

// 채팅 메시지 타입 (로컬 정의)
interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

// 사이즈 모드 타입
type SizeMode = 'normal' | 'large' | 'fullscreen';

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [sizeMode, setSizeMode] = useState<SizeMode>('normal');
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: 'assistant',
            content: '안녕하세요! 저는 컨범 AI 입니다. 무엇을 도와드릴까요?',
            timestamp: new Date()
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 드래그 관련 상태
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);

    // 메시지 영역 자동 스크롤
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 드래그 핸들러
    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        dragRef.current = {
            startX: e.clientX,
            startY: e.clientY,
            initialX: position.x,
            initialY: position.y
        };
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !dragRef.current) return;
            const deltaX = e.clientX - dragRef.current.startX;
            const deltaY = e.clientY - dragRef.current.startY;
            setPosition({
                x: dragRef.current.initialX + deltaX,
                y: dragRef.current.initialY + deltaY
            });
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            dragRef.current = null;
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);


    // 메시지 전송
    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessage = {
            role: 'user',
            content: input.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const chatService = getChatService();

            // 스트리밍 응답 사용
            let assistantContent = '';
            const assistantMessage: ChatMessage = {
                role: 'assistant',
                content: '',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);

            for await (const chunk of chatService.sendMessageStream(userMessage.content)) {
                assistantContent += chunk;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = {
                        ...assistantMessage,
                        content: assistantContent
                    };
                    return newMessages;
                });
            }
        } catch (error: any) {
            console.error('채팅 오류:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `죄송합니다. 오류가 발생했습니다: ${error.message}`,
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // 채팅 초기화
    const handleReset = () => {
        resetChatService();
        setMessages([{
            role: 'assistant',
            content: '안녕하세요! 저는 컨범 AI 입니다. 무엇을 도와드릴까요?',
            timestamp: new Date()
        }]);
    };

    // Enter 키 처리
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* 플로팅 버튼 - 컨범 AI 브랜딩 */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 group z-50"
                >
                    {/* 글로우 효과 */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 blur-lg opacity-70 group-hover:opacity-100 transition-opacity animate-pulse"></div>

                    {/* 메인 버튼 */}
                    <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-700 text-white shadow-2xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 border border-white/20">
                        {/* 컨범 로고 - C 형태 */}
                        <div className="relative">
                            <span className="text-xl font-bold tracking-tight">AI</span>
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full"></div>
                        </div>
                    </div>

                    {/* 호버 시 라벨 표시 */}
                    <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-slate-800/90 backdrop-blur-sm text-white text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-700/50">
                        컨범 AI
                    </div>
                </button>
            )}

            {/* 채팅 창 */}
            {isOpen && (
                <div
                    style={{ transform: sizeMode === 'fullscreen' ? 'none' : `translate(${position.x}px, ${position.y}px)` }}
                    className={`fixed bg-slate-900 border border-slate-700/50 shadow-2xl flex flex-col z-50 ${isMinimized
                        ? 'right-6 bottom-6 w-80 h-14 rounded-2xl'
                        : sizeMode === 'fullscreen'
                            ? 'inset-4 rounded-3xl'
                            : sizeMode === 'large'
                                ? 'right-6 bottom-6 w-[600px] h-[700px] rounded-2xl'
                                : 'right-6 bottom-6 w-96 h-[32rem] rounded-2xl'
                        } ${isDragging ? '' : 'transition-all duration-300'}`}
                >
                    {/* 헤더 - 드래그 영역 */}
                    <div
                        onMouseDown={handleMouseDown}
                        className={`flex items-center justify-between px-4 py-3 bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border-b border-slate-700/50 rounded-t-2xl ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                <Bot size={18} className="text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white text-sm">컨범 AI</h3>
                                <p className="text-xs text-slate-400">SQL 에이전트</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleReset}
                                className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors"
                                title="대화 초기화"
                            >
                                <RefreshCw size={16} className="text-slate-400" />
                            </button>
                            {/* 크기 조절 버튼 */}
                            <button
                                onClick={() => {
                                    const modes: SizeMode[] = ['normal', 'large', 'fullscreen'];
                                    const currentIndex = modes.indexOf(sizeMode);
                                    const nextIndex = (currentIndex + 1) % modes.length;
                                    setSizeMode(modes[nextIndex]);
                                    if (modes[nextIndex] === 'fullscreen') {
                                        setPosition({ x: 0, y: 0 });
                                    }
                                }}
                                className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors"
                                title={sizeMode === 'normal' ? '크게 보기' : sizeMode === 'large' ? '전체화면' : '기본 크기'}
                            >
                                {sizeMode === 'fullscreen' ? (
                                    <Shrink size={16} className="text-slate-400" />
                                ) : (
                                    <Expand size={16} className="text-slate-400" />
                                )}
                            </button>
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors"
                            >
                                {isMinimized ? (
                                    <Maximize2 size={16} className="text-slate-400" />
                                ) : (
                                    <Minimize2 size={16} className="text-slate-400" />
                                )}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors"
                            >
                                <X size={16} className="text-slate-400" />
                            </button>
                        </div>
                    </div>

                    {/* 메시지 영역 */}
                    {!isMinimized && (
                        <>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`flex items-start gap-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'user'
                                                ? 'bg-blue-500/20'
                                                : 'bg-purple-500/20'
                                                }`}>
                                                {message.role === 'user' ? (
                                                    <User size={14} className="text-blue-400" />
                                                ) : (
                                                    <Bot size={14} className="text-purple-400" />
                                                )}
                                            </div>
                                            <div className={`rounded-2xl px-4 py-2 ${message.role === 'user'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-slate-700/50 text-slate-200'
                                                }`}>
                                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {isLoading && messages[messages.length - 1]?.content === '' && (
                                    <div className="flex justify-start">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-full bg-purple-500/20 flex items-center justify-center">
                                                <Bot size={14} className="text-purple-400" />
                                            </div>
                                            <div className="bg-slate-700/50 rounded-2xl px-4 py-2">
                                                <Loader2 size={16} className="animate-spin text-purple-400" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* 입력 영역 */}
                            <div className="p-4 border-t border-slate-700/50">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="메시지를 입력하세요..."
                                        className="flex-1 px-4 py-2.5 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500/50"
                                        disabled={isLoading}
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!input.trim() || isLoading}
                                        className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
