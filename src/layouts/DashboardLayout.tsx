import React, { useState, useRef } from 'react';
import { Outlet, NavLink, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, BarChart2, LogOut, Package, ChevronDown, ClipboardList, Database, Gauge, Layers, Home } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import AIChatbot from '../components/AIChatbot';

const NavItem = ({ item }: { item: any }) => {
    const [isOpen, setIsOpen] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    const handleMouseEnter = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        setIsOpen(true);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = window.setTimeout(() => {
            setIsOpen(false);
        }, 150); // Small delay to prevent flickering
    };

    if (item.children) {
        return (
            <div
                className="relative"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <button
                    className={cn(
                        "flex items-center gap-2 px-3 py-2 text-sm font-bold transition-colors focus:outline-none focus:ring-0",
                        isOpen ? "text-white" : "text-white/90 hover:text-white"
                    )}
                    style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.5), 0 0px 8px rgba(0, 0, 0, 0.3)' }}
                >
                    <item.icon size={18} style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4))' }} />
                    {item.label}
                    <ChevronDown size={14} className={cn("transition-transform", isOpen && "rotate-180")} />
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-[#1a2d4a] rounded-lg shadow-2xl border border-[#2a4266] py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                        {item.children.map((child: any) => (
                            <NavLink
                                key={child.path}
                                to={child.path}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    cn(
                                        "block px-4 py-2.5 text-sm transition-colors hover:bg-white/10 focus:outline-none focus:ring-0",
                                        isActive ? "text-[#5a8fd4] font-semibold bg-white/5" : "text-white/80 hover:text-white"
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
                    "flex items-center gap-2 px-3 py-2 text-sm font-bold transition-colors focus:outline-none focus:ring-0",
                    isActive ? "text-white" : "text-white/90 hover:text-white"
                )
            }
            style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.5), 0 0px 8px rgba(0, 0, 0, 0.3)' }}
        >
            <item.icon size={18} style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4))' }} />
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
        { icon: Home, label: '홈', path: '/home' },
        { icon: LayoutDashboard, label: '대시보드', path: '/dashboard' },
        {
            icon: Briefcase,
            label: '영업 기회',
            path: '/opportunities',
            children: [
                { label: '영업 기회 관리', path: '/opportunities' },
                { label: '특가 견적', path: '/special-quotation' },
                { label: '견적서 이력', path: '/quote-history' },
                { label: '데이터 관리', path: '/data-management' }
            ]
        },
        {
            icon: BarChart2,
            label: '실적 관리',
            path: '/sales-performance',
            children: [
                { label: '판매 실적', path: '/sales-performance?tab=list' },
                { label: '수주 실적', path: '/sales-performance?tab=order' },
                { label: '판매점별 매출 분석', path: '/sales-performance?tab=analysis' },
                { label: '매출 인사이트 대시보드', path: '/sales-performance?tab=model' },
                { label: '업체별 매출 분석', path: '/sales-performance?tab=detail' },
                { label: '2026 매출 예측', path: '/sales-performance?tab=forecast' }
            ]
        },
        {
            icon: ClipboardList,
            label: '재고 현황',
            path: '/inventory',
            children: [
                { label: '남부전략영업소 영업용 재고', path: '/inventory/southern-sales' }
            ]
        },
        {
            icon: Package,
            label: '제품 정보',
            path: '/products',
            children: [
                { label: '제품 도면', path: '/products/drawings' },
                { label: '마케팅 자료실', path: '/products/marketing' },
                { label: '치환 가이드', path: '/cross-reference' }
            ]
        },
        {
            icon: Gauge,
            label: '진공 이송 시트',
            path: '/vacuum-transfer',
            children: [
                { label: '진공 이송 시트', path: '/vacuum-transfer' },
                { label: '패드 선정 가이드', path: '/pad-selection' }
            ]
        },
        {
            icon: Users,
            label: '고객 정보',
            path: '/accounts',
            children: [
                { label: '업체명 정보', path: '/accounts/companies' },
                { label: '담당자명 정보', path: '/accounts/contacts' },
                { label: 'Sales Map', path: '/sales-map' }
            ]
        },
    ];

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <header className="sticky top-0 z-40" style={{ background: 'rgba(74, 111, 165, 0.95)', backdropFilter: 'blur(10px)' }}>
                <div className="w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        {/* Logo */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link to="/" className="text-xl font-bold text-white tracking-tight hover:opacity-80 transition-opacity">Convum CRM</Link>
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
                                <div className="h-9 w-9 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-semibold">
                                    {userEmail ? userEmail[0].toUpperCase() : 'U'}
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                                title="로그아웃"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>

            {/* AI 챗봇 */}
            <AIChatbot />
        </div>
    );
}
