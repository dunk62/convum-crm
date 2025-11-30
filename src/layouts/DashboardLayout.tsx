import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, Menu, X, BarChart2, LogOut, Package } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';

const Sidebar = ({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (v: boolean) => void }) => {
    const [expandedItems, setExpandedItems] = React.useState<string[]>(['/products']);

    const navItems = [
        { icon: LayoutDashboard, label: '홈', path: '/' },
        { icon: Briefcase, label: '영업 기회', path: '/opportunities' },
        { icon: BarChart2, label: '판매 실적', path: '/sales-performance' },
        {
            icon: Package,
            label: '제품 정보',
            path: '/products',
            children: [
                { label: '제품 카탈로그', path: '/products/catalog' },
                { label: '제품 도면', path: '/products/drawings' }
            ]
        },
        {
            icon: Users,
            label: '고객 정보',
            path: '/accounts',
            children: [
                { label: '업체명 정보', path: '/accounts/companies' },
                { label: '담당자명 정보', path: '/accounts/contacts' }
            ]
        },
    ];

    const toggleExpand = (path: string) => {
        setExpandedItems(prev =>
            prev.includes(path)
                ? prev.filter(p => p !== path)
                : [...prev, path]
        );
    };

    return (
        <aside
            className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}
        >
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
                <span className="text-xl font-bold text-primary tracking-tight">Convum CRM</span>
                <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-500">
                    <X size={24} />
                </button>
            </div>
            <nav className="p-4 space-y-1">
                {navItems.map((item) => (
                    <div key={item.path}>
                        {item.children ? (
                            <>
                                <button
                                    onClick={() => toggleExpand(item.path)}
                                    className={cn(
                                        "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg text-lg font-bold transition-colors text-gray-900 hover:bg-gray-50 hover:text-black",
                                        expandedItems.includes(item.path) && "bg-gray-50 text-black"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon size={24} />
                                        {item.label}
                                    </div>
                                    <svg
                                        className={cn("w-5 h-5 transition-transform", expandedItems.includes(item.path) ? "rotate-180" : "")}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {expandedItems.includes(item.path) && (
                                    <div className="pl-11 pr-2 py-1 space-y-1">
                                        {item.children.map((child) => (
                                            <NavLink
                                                key={child.path}
                                                to={child.path}
                                                className={({ isActive }) =>
                                                    cn(
                                                        "block px-3 py-2 rounded-lg text-base transition-colors",
                                                        isActive
                                                            ? "text-blue-600 bg-blue-50 font-bold"
                                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-medium"
                                                    )
                                                }
                                            >
                                                {child.label}
                                            </NavLink>
                                        ))}
                                    </div>
                                )}
                            </>
                        ) : (
                            <NavLink
                                to={item.path}
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-bold transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "text-gray-900 hover:bg-gray-50 hover:text-black"
                                    )
                                }
                            >
                                <item.icon size={24} />
                                {item.label}
                            </NavLink>
                        )}
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default function DashboardLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const [userEmail, setUserEmail] = React.useState<string>('');
    const navigate = useNavigate();

    React.useEffect(() => {
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user?.email) {
                setUserEmail(user.email);
            }
        });
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-background flex">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex items-center gap-4 ml-auto">
                        <span className="text-sm text-gray-600 hidden md:block">{userEmail}</span>
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                            {userEmail ? userEmail[0].toUpperCase() : 'U'}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                            title="로그아웃"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </header>

                <main className="flex-1 p-4 lg:p-8 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
