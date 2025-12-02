import { useState, useEffect } from 'react';
import { CheckSquare, Plus, X, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Todo {
    id: string;
    task_content: string;
    is_completed: boolean;
    created_at: string;
}

interface TodoListProps {
    opportunityId?: string | number;
}

export default function TodoList({ opportunityId }: TodoListProps) {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (opportunityId) {
            fetchTodos();
        } else {
            setTodos([]);
        }
    }, [opportunityId]);

    const fetchTodos = async () => {
        if (!opportunityId) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('opportunity_todos')
                .select('*')
                .eq('opportunity_id', opportunityId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTodos(data || []);
        } catch (error) {
            console.error('Error fetching todos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTodo = async () => {
        if (!inputValue.trim() || !opportunityId) return;

        try {
            const { data, error } = await supabase
                .from('opportunity_todos')
                .insert([
                    {
                        opportunity_id: opportunityId,
                        task_content: inputValue.trim(),
                        is_completed: false
                    }
                ])
                .select()
                .single();

            if (error) throw error;
            setTodos([data, ...todos]);
            setInputValue('');
        } catch (error) {
            console.error('Error adding todo:', error);
            alert('할 일을 추가하는데 실패했습니다.');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
            handleAddTodo();
        }
    };

    const toggleTodo = async (id: string, currentStatus: boolean) => {
        try {
            // Optimistic update
            setTodos(todos.map(todo =>
                todo.id === id ? { ...todo, is_completed: !currentStatus } : todo
            ));

            const { error } = await supabase
                .from('opportunity_todos')
                .update({ is_completed: !currentStatus })
                .eq('id', id);

            if (error) {
                // Revert on error
                setTodos(todos.map(todo =>
                    todo.id === id ? { ...todo, is_completed: currentStatus } : todo
                ));
                throw error;
            }
        } catch (error) {
            console.error('Error updating todo:', error);
            alert('상태 업데이트에 실패했습니다.');
        }
    };

    const deleteTodo = async (id: string) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;

        try {
            // Optimistic update
            const previousTodos = [...todos];
            setTodos(todos.filter(todo => todo.id !== id));

            const { error } = await supabase
                .from('opportunity_todos')
                .delete()
                .eq('id', id);

            if (error) {
                // Revert on error
                setTodos(previousTodos);
                throw error;
            }
        } catch (error) {
            console.error('Error deleting todo:', error);
            alert('삭제에 실패했습니다.');
        }
    };

    if (!opportunityId) return null;

    return (
        <div className="h-full flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <div className="p-1.5 bg-green-50 rounded-lg text-green-600">
                        <CheckSquare size={16} />
                    </div>
                    해야 할 일 리스트
                </h3>
                <span className="text-xs text-gray-400 font-medium">
                    {todos.filter(t => t.is_completed).length}/{todos.length} 완료
                </span>
            </div>

            <div className="p-4 border-b border-gray-100 bg-white">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="새로운 할 일을 입력하세요..."
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <button
                        type="button"
                        onClick={handleAddTodo}
                        disabled={!inputValue.trim()}
                        className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2 min-h-[100px]">
                        <Loader2 size={24} className="animate-spin text-green-500" />
                        <p className="text-xs">로딩 중...</p>
                    </div>
                ) : todos.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2 min-h-[100px]">
                        <CheckSquare size={24} className="text-gray-300" />
                        <p className="text-xs">등록된 할 일이 없습니다.</p>
                    </div>
                ) : (
                    <div className="space-y-1">
                        {todos.map((todo) => (
                            <div
                                key={todo.id}
                                className={`group flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${todo.is_completed ? 'bg-gray-50/50' : ''}`}
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleTodo(todo.id, todo.is_completed)}
                                    className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${todo.is_completed
                                        ? 'bg-green-500 border-green-500 text-white'
                                        : 'bg-white border-gray-300 text-transparent hover:border-green-400'
                                        }`}
                                >
                                    <CheckSquare size={12} fill="currentColor" className={todo.is_completed ? 'opacity-100' : 'opacity-0'} />
                                </button>

                                <span
                                    className={`flex-1 text-sm transition-all ${todo.is_completed
                                        ? 'text-gray-400 line-through decoration-gray-400'
                                        : 'text-gray-700'
                                        }`}
                                >
                                    {todo.task_content}
                                </span>

                                <button
                                    type="button"
                                    onClick={() => deleteTodo(todo.id)}
                                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                                    title="삭제"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
