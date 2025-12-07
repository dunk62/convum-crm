import { useState, useEffect, useRef } from 'react';
import { Mail, Calendar, TrendingUp, DollarSign, Clock, ChevronRight, Star, BarChart2, Users, Briefcase, Package, Database, LayoutDashboard, ChevronDown, Target, Warehouse, UserCircle, LogIn, Loader2, Gauge, Layers } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { fetchCalendarEvents, fetchEmails, parseEmail, formatEventTime, type CalendarEvent, type ParsedEmail } from '../lib/googleApi';
import { supabase } from '../lib/supabase';

// Draggable Card Hook
const useDraggable = (initialPosition: { x: number; y: number }) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number } | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return;
      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;
      setPosition({
        x: dragRef.current.initialX + deltaX,
        y: dragRef.current.initialY + deltaY,
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

  return { position, isDragging, handleMouseDown };
};

// Snow Particle Component
const SnowParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Snow particles
    const particles: { x: number; y: number; size: number; speedY: number; speedX: number; opacity: number }[] = [];
    const particleCount = 150;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 1,
        speedY: Math.random() * 1 + 0.5,
        speedX: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.7 + 0.3,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();

        // Update position
        particle.y += particle.speedY;
        particle.x += particle.speedX + Math.sin(particle.y * 0.01) * 0.5;

        // Reset if out of screen
        if (particle.y > canvas.height) {
          particle.y = -10;
          particle.x = Math.random() * canvas.width;
        }
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.x < 0) particle.x = canvas.width;
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="snow-canvas" />;
};

export default function Home() {
  const navigate = useNavigate();
  const [_currentTime, setCurrentTime] = useState(new Date());

  // Google Auth state
  const [accessToken, setAccessToken] = useState<string | null>(() => localStorage.getItem('google_access_token'));
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [gmailMessages, setGmailMessages] = useState<ParsedEmail[]>([]);
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(false);
  const [isLoadingEmail, setIsLoadingEmail] = useState(false);
  const [_authError, setAuthError] = useState<string | null>(null);

  // Sales data state (from Supabase)
  const [monthlySales, setMonthlySales] = useState(0);
  const [monthlyOrders, setMonthlyOrders] = useState(0);
  const salesTarget = 37660000; // 12월 매출 목표
  const ordersTarget = 50000000; // 수주 목표

  // Google Login
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setAccessToken(tokenResponse.access_token);
      localStorage.setItem('google_access_token', tokenResponse.access_token);
      setAuthError(null);
    },
    onError: () => {
      setAuthError('Google 로그인에 실패했습니다.');
    },
    scope: 'https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/gmail.readonly',
  });

  // Fetch calendar events when token is available
  useEffect(() => {
    if (!accessToken) return;

    setIsLoadingCalendar(true);
    fetchCalendarEvents(accessToken, 5)
      .then(events => {
        setCalendarEvents(events);
      })
      .catch(err => {
        console.error('Calendar fetch error:', err);
        // Token might be expired
        if (err.message.includes('401')) {
          localStorage.removeItem('google_access_token');
          setAccessToken(null);
        }
      })
      .finally(() => setIsLoadingCalendar(false));
  }, [accessToken]);

  // Fetch emails when token is available
  useEffect(() => {
    if (!accessToken) return;

    setIsLoadingEmail(true);
    fetchEmails(accessToken, 5)
      .then(messages => {
        setGmailMessages(messages.map(parseEmail));
      })
      .catch(err => {
        console.error('Gmail fetch error:', err);
        if (err.message.includes('401')) {
          localStorage.removeItem('google_access_token');
          setAccessToken(null);
        }
      })
      .finally(() => setIsLoadingEmail(false));
  }, [accessToken]);

  // Draggable positions for each card
  const chatCard = useDraggable({ x: 0, y: 0 });
  const appIconsCard = useDraggable({ x: 0, y: 0 });
  const workspaceCard = useDraggable({ x: 0, y: 0 });
  const mailCard = useDraggable({ x: 0, y: 0 });
  const statsCard = useDraggable({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch sales data from Supabase (same as Dashboard)
  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
        const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString();

        // Fetch current month sales (from sales_performance)
        const { data: salesData, error: salesError } = await supabase
          .from('sales_performance')
          .select('shipment_date, sales_amount')
          .gte('shipment_date', startOfMonth)
          .lte('shipment_date', endOfMonth)
          .in('sales_rep', ['탁현호', '임성렬']);

        if (salesError) throw salesError;

        const totalSales = salesData?.reduce((sum, item) => sum + (item.sales_amount || 0), 0) || 0;
        setMonthlySales(totalSales);

        // Fetch current month orders (from order_performance)
        const { data: orderData, error: orderError } = await supabase
          .from('order_performance')
          .select('total_amount')
          .gte('order_date', startOfMonth)
          .lte('order_date', endOfMonth)
          .in('sales_rep', ['탁현호', '임성렬']);

        if (orderError) throw orderError;

        const totalOrders = orderData?.reduce((sum, item) => sum + (item.total_amount || 0), 0) || 0;
        setMonthlyOrders(totalOrders);
      } catch (err) {
        console.error('Error fetching sales data:', err);
      }
    };

    fetchSalesData();
  }, []);

  // Navigation tabs (Korean menu items)
  const navTabs = [
    { label: '대시보드', path: '/dashboard', icon: LayoutDashboard },
    { label: '영업 기회', path: '/opportunities', icon: Target },
    { label: '실적 관리', path: '/sales-performance', icon: BarChart2 },
    { label: '재고 현황', path: '/inventory', icon: Warehouse, hasDropdown: true },
    { label: '데이터 관리', path: '/data-management', icon: Database, hasDropdown: true },
    { label: '제품 정보', path: '/products/catalog', icon: Package, hasDropdown: true },
    { label: '진공 이송 시트', path: '/vacuum-transfer', icon: Gauge },
    { label: '패드 선정 가이드', path: '/pad-selection', icon: Layers },
    { label: '고객 정보', path: '/accounts/companies', icon: Users, hasDropdown: true },
  ];

  // Sample fallback data (used when not logged in)
  const sampleEmails = [
    { id: '1', from: '김영업', subject: '신규 거래처 미팅 일정 확인', snippet: '', time: '10분 전', important: true },
    { id: '2', from: '박대리', subject: '12월 매출 보고서 검토 요청', snippet: '', time: '1시간 전', important: true },
    { id: '3', from: '이과장', subject: '컨범 제품 견적서 발송 완료', snippet: '', time: '2시간 전', important: false },
    { id: '4', from: '최부장', subject: '분기 실적 회의 자료', snippet: '', time: '3시간 전', important: false },
  ];

  // Use real data if available, otherwise use sample data
  const displayEmails = accessToken && gmailMessages.length > 0 ? gmailMessages : sampleEmails;

  return (
    <div className="home-dashboard">
      {/* Snow Animation */}
      <SnowParticles />

      {/* Background with Hero Image */}
      <div className="dashboard-bg">
        <img src="/home-hero.png" alt="Hero" className="hero-bg-image" />
        <div className="gradient-overlay"></div>
      </div>

      {/* Top Navigation - Korean Menu */}
      <nav className="top-nav">
        <Link to="/" className="nav-logo">
          <span>Convum CRM</span>
        </Link>
        <div className="nav-tabs">
          {navTabs.map((tab) => (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="nav-tab-text"
            >
              {tab.icon && <tab.icon size={14} />}
              {tab.label}
              {tab.hasDropdown && <ChevronDown size={14} />}
            </button>
          ))}
        </div>
        <div className="nav-actions">
          <span className="user-email">dunk62@gmail.com</span>
          <div className="user-avatar">
            <UserCircle size={28} />
          </div>
        </div>
      </nav>

      {/* Floating Cards Container */}
      <div className="floating-cards-container">

        {/* Left Side - Chat/Schedule Card (Draggable) - Google Calendar */}
        <div
          className={`floating-card chat-card ${chatCard.isDragging ? 'dragging' : ''}`}
          style={{
            transform: `translate(${chatCard.position.x}px, ${chatCard.position.y}px)`,
            cursor: chatCard.isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={chatCard.handleMouseDown}
        >
          <div className="chat-icon">
            <Calendar size={16} />
          </div>
          {!accessToken ? (
            <>
              <p className="chat-text">Google 캘린더에 연결하여 일정을 확인하세요.</p>
              <button className="google-connect-btn" onClick={() => googleLogin()}>
                <LogIn size={14} />
                Google 캘린더 연결
              </button>
            </>
          ) : isLoadingCalendar ? (
            <div className="loading-state">
              <Loader2 size={20} className="spinner" />
              <span>일정을 가져오는 중...</span>
            </div>
          ) : calendarEvents.length > 0 ? (
            <>
              <p className="chat-text">다가오는 일정입니다.</p>
              <div className="schedule-times">
                {calendarEvents.slice(0, 3).map((event) => (
                  <span key={event.id} className="time-badge">
                    <Clock size={12} /> {formatEventTime(event)} - {event.summary}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="chat-text">예정된 일정이 없습니다.</p>
          )}
          <div className="chat-input" onClick={() => window.open('https://calendar.google.com', '_blank')}>
            <span>Google 캘린더 열기</span>
            <ChevronRight size={16} />
          </div>
        </div>

        {/* Left Side - App Icons (Draggable) */}
        <div
          className={`floating-card app-icons-card ${appIconsCard.isDragging ? 'dragging' : ''}`}
          style={{
            transform: `translate(${appIconsCard.position.x}px, ${appIconsCard.position.y}px)`,
            cursor: appIconsCard.isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={appIconsCard.handleMouseDown}
        >
          <div className="app-icon" onClick={(e) => { e.stopPropagation(); window.open('https://mail.google.com', '_blank'); }} title="Gmail">
            <Mail size={20} />
          </div>
          <div className="app-icon" onClick={(e) => { e.stopPropagation(); navigate('/accounts/companies'); }} title="고객 정보">
            <Users size={20} />
          </div>
          <div className="app-icon" onClick={(e) => { e.stopPropagation(); window.open('https://calendar.google.com', '_blank'); }} title="Google 캘린더">
            <Calendar size={20} />
          </div>
          <div className="app-icon" onClick={(e) => { e.stopPropagation(); navigate('/dashboard'); }} title="대시보드">
            <BarChart2 size={20} />
          </div>
          <div className="app-icon" onClick={(e) => { e.stopPropagation(); navigate('/opportunities'); }} title="영업 기회">
            <Briefcase size={20} />
          </div>
          {/* KakaoTalk */}
          <div className="app-icon kakao" onClick={(e) => { e.stopPropagation(); window.location.href = 'kakaotalk://launch'; }} title="카카오톡">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.88 5.34 4.7 6.77-.15.54-.52 1.94-.6 2.24-.1.37.14.37.29.27.12-.08 1.92-1.3 2.69-1.82.62.09 1.26.14 1.92.14 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
            </svg>
          </div>
          {/* Microsoft Teams */}
          <div className="app-icon teams" onClick={(e) => { e.stopPropagation(); window.location.href = 'msteams://'; }} title="Microsoft Teams">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.35 8.5c-.87 0-1.65.36-2.21.94V8c0-1.66-1.34-3-3-3h-1.5c-.24 0-.47.03-.69.08C10.84 4.4 9.54 4 8.14 4 5.21 4 2.82 6.18 2.82 8.89c0 .97.3 1.88.82 2.64-.52.77-.82 1.68-.82 2.65 0 2.71 2.39 4.89 5.32 4.89.58 0 1.14-.08 1.67-.23.11.02.22.03.33.03h6.02c1.66 0 3-1.34 3-3v-.94c.56.58 1.34.94 2.21.94 1.66 0 3-1.34 3-3s-1.34-3-3-3z" />
              <circle cx="19.5" cy="5.5" r="2.5" />
            </svg>
          </div>
        </div>

        {/* Right Side - Team Workspace Card (Draggable) */}
        <div
          className={`floating-card workspace-card ${workspaceCard.isDragging ? 'dragging' : ''}`}
          style={{
            transform: `translate(${workspaceCard.position.x}px, ${workspaceCard.position.y}px)`,
            cursor: workspaceCard.isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={workspaceCard.handleMouseDown}
        >
          <div className="workspace-header">
            <div className="workspace-icon"><Users size={14} /></div>
            <span>팀 워크스페이스</span>
            <div className="workspace-actions">
              <span className="share-btn">공유</span>
            </div>
          </div>
          <h4 className="workspace-title">영업팀 매출 분석</h4>
          <p className="workspace-desc">
            이번 분기 매출 목표 달성을 위한 전략을 수립하고 있습니다.
            현재 진행 상황을 팀원들과 공유하세요.
          </p>
          <div className="workspace-tools">
            <span className="tool-btn">T</span>
            <span className="tool-btn"><strong>B</strong></span>
            <span className="tool-btn"><em>I</em></span>
          </div>
        </div>

        {/* Bottom Left - Mail Card (Draggable) - Gmail */}
        <div
          className={`floating-card mail-card ${mailCard.isDragging ? 'dragging' : ''}`}
          style={{
            transform: `translate(${mailCard.position.x}px, ${mailCard.position.y}px)`,
            cursor: mailCard.isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={mailCard.handleMouseDown}
        >
          <div className="mail-tabs">
            <button className="mail-tab active">받은편지함 <span>{isLoadingEmail ? '...' : displayEmails.length}</span></button>
            {!accessToken && (
              <button className="mail-tab connect-tab" onClick={() => googleLogin()}>
                <LogIn size={12} /> 연결
              </button>
            )}
          </div>
          {isLoadingEmail ? (
            <div className="loading-state">
              <Loader2 size={20} className="spinner" />
              <span>메일을 가져오는 중...</span>
            </div>
          ) : (
            <div className="mail-list">
              {displayEmails.map((email) => (
                <div key={email.id} className="mail-item">
                  <div className="mail-star">
                    {email.important && <Star size={12} fill="#fbbf24" stroke="#fbbf24" />}
                  </div>
                  <div className="mail-from">{email.from}</div>
                  <div className="mail-subject">{email.subject}</div>
                  <div className="mail-time">{email.time}</div>
                </div>
              ))}
            </div>
          )}
          <div className="mail-suggestion" onClick={() => window.open('https://mail.google.com', '_blank')}>
            <span className="suggestion-icon"><Mail size={12} /></span>
            <span>Gmail 열기</span>
          </div>
        </div>

        {/* Bottom Right Small Stats (Draggable) */}
        <div
          className={`floating-card stats-card ${statsCard.isDragging ? 'dragging' : ''}`}
          style={{
            transform: `translate(${statsCard.position.x}px, ${statsCard.position.y}px)`,
            cursor: statsCard.isDragging ? 'grabbing' : 'grab'
          }}
          onMouseDown={statsCard.handleMouseDown}
        >
          <div className="stat-item">
            <div className="stat-header">
              <TrendingUp size={14} />
              <span>당월 매출</span>
            </div>
            <div className="stat-value">{new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(monthlySales)}</div>
            <div className="stat-progress">
              <div className="progress-bar-mini">
                <div
                  className="progress-fill-mini sales"
                  style={{ width: `${(monthlySales / salesTarget) * 100}%` }}
                ></div>
              </div>
              <span className="stat-percent">{((monthlySales / salesTarget) * 100).toFixed(0)}%</span>
            </div>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <div className="stat-header">
              <DollarSign size={14} />
              <span>당월 수주</span>
            </div>
            <div className="stat-value">{new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(monthlyOrders)}</div>
            <div className="stat-progress">
              <div className="progress-bar-mini">
                <div
                  className="progress-fill-mini orders"
                  style={{ width: `${(monthlyOrders / ordersTarget) * 100}%` }}
                ></div>
              </div>
              <span className="stat-percent">{((monthlyOrders / ordersTarget) * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        {/* Top Center - Title */}
        <div className="hero-title">
          <h1>why work?<br />think different</h1>
          <p className="hero-subtitle">Mail, Docs, and AI that works in every app and tab</p>
          <button className="hero-cta" onClick={() => navigate('/dashboard')}>
            Get Started <ChevronRight size={16} />
          </button>
        </div>

      </div>

      <style>{`
        .home-dashboard {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
        }

        /* Snow Canvas */
        .snow-canvas {
          position: absolute;
          inset: 0;
          z-index: 15;
          pointer-events: none;
        }

        /* Background */
        .dashboard-bg {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }

        .hero-bg-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          filter: brightness(1.02) contrast(1.02);
        }

        .gradient-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(74, 111, 165, 0.15) 0%, transparent 30%, transparent 70%, rgba(74, 111, 165, 0.1) 100%);
        }

        /* Top Navigation - Text Only */
        .top-nav {
          position: relative;
          z-index: 100;
          display: flex;
          align-items: center;
          padding: 1rem 2rem;
          background: rgba(74, 111, 165, 0.9);
          backdrop-filter: blur(10px);
        }

        .nav-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 1.1rem;
          font-weight: 700;
          color: white;
          margin-right: 3rem;
          text-decoration: none;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .nav-logo:hover {
          opacity: 0.8;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-tabs {
          display: flex;
          gap: 1.5rem;
          flex: 1;
        }

        .nav-tab-text {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.85);
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          padding: 0.5rem 0;
        }

        .nav-tab-text:hover {
          color: white;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-left: auto;
        }

        .user-email {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.875rem;
          font-weight: 400;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #f97316;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .user-avatar:hover {
          opacity: 0.8;
        }

        /* Floating Cards Container */
        .floating-cards-container {
          position: absolute;
          inset: 60px 0 0 0;
          z-index: 10;
          pointer-events: none;
        }

        .floating-cards-container > * {
          pointer-events: auto;
        }

        /* Floating Card Base */
        .floating-card {
          position: absolute;
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.9);
          border-radius: 1rem;
          color: #111827;
          transition: box-shadow 0.3s ease;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2), 0 4px 12px rgba(0, 0, 0, 0.1);
          user-select: none;
        }

        .floating-card:hover {
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
        }

        .floating-card.dragging {
          z-index: 1000;
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);
        }

        /* Chat Card - Left Top */
        .chat-card {
          top: 15%;
          left: 3%;
          width: 280px;
          padding: 1.25rem;
        }

        .chat-icon {
          width: 28px;
          height: 28px;
          background: #6366f1;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
          color: white;
        }

        .chat-text {
          font-size: 0.9rem;
          line-height: 1.5;
          color: #1f2937;
          font-weight: 500;
          margin-bottom: 1rem;
        }

        .schedule-times {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
          max-height: 120px;
          overflow-y: auto;
        }

        .time-badge {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 0.875rem;
          background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
          border: 1px solid #bbf7d0;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 500;
          color: #166534;
        }

        .chat-input {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.625rem 0.875rem;
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 9999px;
          font-size: 0.8rem;
          color: #9ca3af;
          cursor: pointer;
        }

        .chat-input:hover {
          background: #f3f4f6;
        }

        /* Google Connect Button */
        .google-connect-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.625rem 0.875rem;
          background: #4285f4;
          color: white;
          border: none;
          border-radius: 9999px;
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 0.5rem;
        }

        .google-connect-btn:hover {
          background: #3367d6;
        }

        /* Loading State */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          color: #6b7280;
          font-size: 0.8rem;
        }

        .spinner {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Connect Tab */
        .connect-tab {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #4285f4 !important;
          font-weight: 500;
        }

        .connect-tab:hover {
          color: #3367d6 !important;
        }

        /* App Icons - Left Middle */
        .app-icons-card {
          top: 55%;
          left: 3%;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          padding: 0.75rem;
        }

        .app-icon {
          width: 40px;
          height: 40px;
          background: #f3f4f6;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          color: #6b7280;
        }

        .app-icon:hover {
          background: #e5e7eb;
          color: #4b5563;
          transform: scale(1.05);
        }

        .app-icon.kakao {
          color: #3C1E1E;
          background: #FEE500;
        }

        .app-icon.kakao:hover {
          background: #E6CF00;
        }

        .app-icon.teams {
          color: white;
          background: #5059C9;
        }

        .app-icon.teams:hover {
          background: #4349A8;
        }

        /* Workspace Card - Right Top */
        .workspace-card {
          top: 40%;
          right: 3%;
          width: 300px;
          padding: 1.25rem;
        }

        .workspace-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          font-size: 0.8rem;
          color: #6b7280;
        }

        .workspace-icon {
          width: 24px;
          height: 24px;
          background: #e0e7ff;
          border-radius: 0.375rem;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6366f1;
        }

        .workspace-actions {
          margin-left: auto;
        }

        .share-btn {
          padding: 0.25rem 0.75rem;
          background: #f3f4f6;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          cursor: pointer;
        }

        .workspace-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #1f2937;
        }

        .workspace-desc {
          font-size: 0.8rem;
          line-height: 1.6;
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .workspace-tools {
          display: flex;
          gap: 0.5rem;
        }

        .tool-btn {
          width: 28px;
          height: 28px;
          background: #f3f4f6;
          border-radius: 0.375rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          cursor: pointer;
          color: #6b7280;
        }

        /* Mail Card - Bottom Left */
        .mail-card {
          bottom: 8%;
          left: 3%;
          width: 420px;
          padding: 1rem;
        }

        .mail-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.75rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .mail-tab {
          background: none;
          border: none;
          color: #9ca3af;
          font-size: 0.8rem;
          cursor: pointer;
          padding: 0;
          transition: color 0.2s;
        }

        .mail-tab.active {
          color: #1f2937;
          font-weight: 600;
        }

        .mail-tab span {
          margin-left: 0.25rem;
          color: #d1d5db;
        }

        .mail-list {
          display: flex;
          flex-direction: column;
          gap: 0.375rem;
          max-height: 200px;
          overflow-y: auto;
        }

        .mail-item {
          display: grid;
          grid-template-columns: 20px 60px 1fr auto;
          gap: 0.5rem;
          align-items: center;
          padding: 0.5rem;
          border-radius: 0.375rem;
          cursor: pointer;
          transition: background 0.2s;
          font-size: 0.8rem;
        }

        .mail-item:hover {
          background: #f9fafb;
        }

        .mail-from {
          font-weight: 700;
          font-size: 0.8rem;
          color: #111827;
        }

        .mail-subject {
          color: #374151;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 0.8rem;
        }

        .mail-time {
          font-size: 0.75rem;
          font-weight: 500;
          color: #6b7280;
        }

        .mail-suggestion {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.75rem;
          padding: 0.625rem 0.875rem;
          background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
          border-radius: 0.5rem;
          font-size: 0.8rem;
          font-weight: 600;
          color: #1e40af;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mail-suggestion:hover {
          background: linear-gradient(135deg, #bfdbfe 0%, #c7d2fe 100%);
        }

        .suggestion-icon {
          color: #6366f1;
        }

        /* Stats Card - Bottom Right (Small) */
        .stats-card {
          bottom: 8%;
          right: 3%;
          width: 200px;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .stat-header {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #374151;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .stat-value {
          font-size: 1.4rem;
          font-weight: 800;
          color: #111827;
          letter-spacing: -0.025em;
        }

        .stat-progress {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .progress-bar-mini {
          flex: 1;
          height: 4px;
          background: #e5e7eb;
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill-mini {
          height: 100%;
          border-radius: 2px;
        }

        .progress-fill-mini.sales {
          background: linear-gradient(90deg, #10b981, #34d399);
        }

        .progress-fill-mini.orders {
          background: linear-gradient(90deg, #6366f1, #a78bfa);
        }

        .stat-percent {
          font-size: 0.75rem;
          font-weight: 600;
          color: #374151;
        }

        .stat-divider {
          height: 1px;
          background: #e5e7eb;
        }

        /* Hero Title - Top Center */
        .hero-title {
          position: absolute;
          top: 10%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          z-index: 20;
        }

        .hero-title h1 {
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 1rem;
          color: #1e293b;
          font-style: italic;
          font-family: Georgia, 'Times New Roman', serif;
        }

        .hero-subtitle {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.85);
          margin-bottom: 1.5rem;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.75rem;
          background: #1e293b;
          border: none;
          border-radius: 9999px;
          color: white;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .hero-cta:hover {
          background: #334155;
          transform: translateY(-2px);
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .workspace-card {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .nav-tabs {
            display: none;
          }

          .floating-card {
            display: none;
          }

          .hero-title h1 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
