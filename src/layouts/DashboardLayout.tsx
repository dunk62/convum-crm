import React, { useState, useRef, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, BarChart2, LogOut, Package, ChevronDown, ClipboardList, Database } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';

const NavItem = ({ item }: { item: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (item.children) {
        return (
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-secondary hover:text-white",
                        isOpen ? "text-white bg-secondary" : "text-muted-foreground"
                    )}
                >
                    <item.icon size={18} />
                    {item.label}
                    <ChevronDown size={14} className={cn("transition-transform", isOpen && "rotate-180")} />
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 mt-2 w-56 bg-card rounded-lg shadow-2xl border border-border py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                        {item.children.map((child: any) => (
                            <NavLink
                                key={child.path}
                                to={child.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    cn(
                                        "block px-4 py-2.5 text-sm transition-colors hover:bg-secondary",
                                        isActive ? "text-accent font-semibold bg-secondary/50" : "text-muted-foreground hover:text-white"
                                    )
                                }
                            >
                                {child.label}
                            </NavLink>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    return (
        <NavLink
            to={item.path}
            className={({ isActive }) =>
                cn(
                    "flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors rounded-md hover:bg-secondary hover:text-white",
                    isActive ? "text-white bg-secondary" : "text-muted-foreground"
                )
            }
        >
            <item.icon size={18} />
            {item.label}
        </NavLink>
    );
};

export default function DashboardLayout() {
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

    const navItems = [
        { icon: LayoutDashboard, label: '대시보드', path: '/' },
        { icon: Briefcase, label: '영업 기회', path: '/opportunities' },
        { icon: BarChart2, label: '실적 관리', path: '/sales-performance' },
        {
            icon: ClipboardList,
            label: '재고 현황',
            path: '/inventory',
            children: [
                { label: '남부전략영업소 영업용 재고', path: '/inventory/southern-sales' }
            ]
        },
        { icon: Database, label: '데이터 관리', path: '/data-management' },
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

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="bg-background border-b border-border sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-white tracking-tight">Convum CRM</span>
                        </div>

                        {/* Navigation */}
                        <nav className="hidden md:flex items-center gap-1 ml-12">
                            {navItems.map((item) => (
                                <NavItem key={item.label} item={item} />
                            ))}
                        </nav>

                        {/* User Profile */}
                        <div className="flex items-center gap-4 ml-auto">
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-medium text-white">{userEmail}</p>
                                </div>
                                <div className="h-9 w-9 rounded-full bg-accent text-white flex items-center justify-center text-sm font-semibold">
                                    {userEmail ? userEmail[0].toUpperCase() : 'U'}
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-muted-foreground hover:text-white hover:bg-secondary rounded-md transition-colors"
                                title="로그아웃"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
}
