import { useState, useEffect } from 'react';
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Target,
  Users,
  BarChart3,
  Zap,
  Shield,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function HomePage() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({
    monthlySales: 0,
    monthlyOrders: 0,
    activeCustomers: 0,
    opportunities: 0
  });

  useEffect(() => {
    setIsVisible(true);
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
      const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).toISOString();

      // 이번 달 매출 (탁현호, 임성렬 담당자만)
      const { data: salesData } = await supabase
        .from('sales_performance')
        .select('sales_amount')
        .gte('shipment_date', startOfMonth)
        .lte('shipment_date', endOfMonth)
        .in('sales_rep', ['탁현호', '임성렬']);

      const totalSales = salesData?.reduce((sum, item) => sum + (item.sales_amount || 0), 0) || 0;

      // 이번 달 수주 (탁현호, 임성렬 담당자만)
      const { data: orderData } = await supabase
        .from('order_performance')
        .select('total_amount')
        .gte('order_date', startOfMonth)
        .lte('order_date', endOfMonth)
        .in('sales_rep', ['탁현호', '임성렬']);

      const totalOrders = orderData?.reduce((sum, item) => sum + (item.total_amount || 0), 0) || 0;

      // 활성 고객 수
      const { count: customerCount } = await supabase
        .from('accounts')
        .select('*', { count: 'exact', head: true });

      // 진행중 영업 기회
      const { count: oppCount } = await supabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true })
        .not('stage', 'eq', 'Closed Won')
        .not('stage', 'eq', 'Closed Lost');

      setStats({
        monthlySales: totalSales,
        monthlyOrders: totalOrders,
        activeCustomers: customerCount || 0,
        opportunities: oppCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const formatCurrency = (value: number) => {
    if (value >= 100000000) {
      return `₩${(value / 100000000).toFixed(1)}억`;
    } else if (value >= 10000000) {
      return `₩${(value / 10000000).toFixed(1)}천만`;
    } else if (value >= 10000) {
      return `₩${(value / 10000).toFixed(0)}만`;
    }
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW', maximumFractionDigits: 0 }).format(value);
  };

  const salesTarget = 68600000; // 12월 예측 목표
  const achievementRate = stats.monthlySales > 0 ? Math.round((stats.monthlySales / salesTarget) * 100) : 0;

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content-wrapper">
          <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>Convum CRM</span>
            </div>

            <h1 className="hero-title">
              영업 성과를 높이는
              <br />
              <span className="highlight-text">스마트 CRM 솔루션</span>
            </h1>

            <p className="hero-description">
              고객 관리부터 영업 기회 추적, 실시간 실적 분석까지<br />
              하나의 플랫폼에서 모든 영업 활동을 효율적으로 관리하세요.
            </p>

            <div className="hero-actions">
              <button
                className="btn-primary"
                onClick={() => navigate('/dashboard')}
              >
                <span>대시보드 바로가기</span>
                <ArrowRight size={18} />
              </button>
              <button
                className="btn-secondary"
                onClick={() => navigate('/opportunities')}
              >
                영업 기회 관리
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className={`stats-grid ${isVisible ? 'visible' : ''}`}>
            <div className="stat-card">
              <div className="stat-icon-wrapper blue">
                <TrendingUp size={22} />
              </div>
              <div className="stat-content">
                <span className="stat-label">이번 달 매출</span>
                <span className="stat-value">{formatCurrency(stats.monthlySales)}</span>
                <div className="stat-progress">
                  <div className="progress-track">
                    <div className="progress-fill blue" style={{ width: `${Math.min(achievementRate, 100)}%` }}></div>
                  </div>
                  <span className="progress-text">{achievementRate}% 달성</span>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper green">
                <Target size={22} />
              </div>
              <div className="stat-content">
                <span className="stat-label">이번 달 수주</span>
                <span className="stat-value">{formatCurrency(stats.monthlyOrders)}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper purple">
                <Users size={22} />
              </div>
              <div className="stat-content">
                <span className="stat-label">등록 고객사</span>
                <span className="stat-value">{stats.activeCustomers.toLocaleString()}<span className="stat-unit">개</span></span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper orange">
                <BarChart3 size={22} />
              </div>
              <div className="stat-content">
                <span className="stat-label">진행중 기회</span>
                <span className="stat-value">{stats.opportunities}<span className="stat-unit">건</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className={`features-section ${isVisible ? 'visible' : ''}`}>
          <h2 className="features-title">주요 기능</h2>
          <div className="features-grid">
            <div className="feature-card" onClick={() => navigate('/sales-performance')}>
              <div className="feature-icon blue">
                <BarChart3 size={24} />
              </div>
              <h3>실적 분석</h3>
              <p>판매 및 수주 실적을<br />실시간으로 추적합니다</p>
            </div>
            <div className="feature-card" onClick={() => navigate('/accounts/companies')}>
              <div className="feature-icon green">
                <Users size={24} />
              </div>
              <h3>고객 관리</h3>
              <p>고객 정보를 체계적으로<br />관리하고 분석합니다</p>
            </div>
            <div className="feature-card" onClick={() => navigate('/opportunities')}>
              <div className="feature-icon purple">
                <Zap size={24} />
              </div>
              <h3>영업 기회</h3>
              <p>영업 파이프라인을<br />시각적으로 관리합니다</p>
            </div>
            <div className="feature-card" onClick={() => navigate('/inventory/southern-sales')}>
              <div className="feature-icon orange">
                <Shield size={24} />
              </div>
              <h3>재고 현황</h3>
              <p>실시간 재고 현황을<br />한눈에 파악합니다</p>
            </div>
            <div className="feature-card" onClick={() => navigate('/vacuum-transfer')}>
              <div className="feature-icon cyan">
                <Clock size={24} />
              </div>
              <h3>기술 자료</h3>
              <p>진공 이송 시트 등<br />기술 자료를 제공합니다</p>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        .home-page {
          min-height: calc(100vh - 4rem);
          background: linear-gradient(180deg, #0c1829 0%, #162337 50%, #1a2d4a 100%);
          padding: 0;
          overflow-x: hidden;
        }

        .hero-section {
          padding: 3rem 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }

        .hero-content-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
          margin-bottom: 4rem;
        }

        .hero-content {
          opacity: 0;
          transform: translateX(-30px);
          transition: all 0.8s ease-out;
        }

        .hero-content.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(90, 143, 212, 0.15);
          border: 1px solid rgba(90, 143, 212, 0.3);
          border-radius: 9999px;
          color: #5a8fd4;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          letter-spacing: 0.5px;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.3;
          margin-bottom: 1.5rem;
          letter-spacing: -0.5px;
          text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }

        .highlight-text {
          color: #5a8fd4;
          position: relative;
        }

        .hero-description {
          font-size: 1.125rem;
          color: #a8c0dc;
          line-height: 1.8;
          margin-bottom: 2.5rem;
          font-weight: 400;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-primary {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem 2rem;
          background: linear-gradient(135deg, #4a6fa5 0%, #5a8fd4 100%);
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 20px rgba(90, 143, 212, 0.4);
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(90, 143, 212, 0.5);
          background: linear-gradient(135deg, #5a8fd4 0%, #6ba3e8 100%);
        }

        .btn-secondary {
          padding: 1rem 2rem;
          background: rgba(255, 255, 255, 0.08);
          color: #e2eaf5;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.25rem;
          opacity: 0;
          transform: translateX(30px);
          transition: all 0.8s ease-out 0.2s;
        }

        .stats-grid.visible {
          opacity: 1;
          transform: translateX(0);
        }

        .stat-card {
          display: flex;
          gap: 1rem;
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1rem;
          transition: all 0.3s;
        }

        .stat-card:hover {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.06) 100%);
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .stat-icon-wrapper {
          width: 48px;
          height: 48px;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-icon-wrapper.blue {
          background: rgba(90, 143, 212, 0.2);
          color: #5a8fd4;
        }

        .stat-icon-wrapper.green {
          background: rgba(16, 185, 129, 0.2);
          color: #34d399;
        }

        .stat-icon-wrapper.purple {
          background: rgba(139, 92, 246, 0.2);
          color: #a78bfa;
        }

        .stat-icon-wrapper.orange {
          background: rgba(249, 115, 22, 0.2);
          color: #fb923c;
        }

        .stat-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #8ba4c4;
          font-weight: 500;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.5px;
        }

        .stat-unit {
          font-size: 1rem;
          font-weight: 500;
          margin-left: 0.25rem;
          color: #8ba4c4;
        }

        .stat-progress {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .progress-track {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 1s ease-out;
        }

        .progress-fill.blue {
          background: linear-gradient(90deg, #4a6fa5, #5a8fd4);
        }

        .progress-text {
          font-size: 0.75rem;
          color: #5a8fd4;
          font-weight: 600;
          white-space: nowrap;
        }

        /* Features Section */
        .features-section {
          padding-top: 2rem;
          opacity: 0;
          transform: translateY(30px);
          transition: all 0.8s ease-out 0.4s;
        }

        .features-section.visible {
          opacity: 1;
          transform: translateY(0);
        }

        .features-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem;
        }

        .feature-card {
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.02) 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
        }

        .feature-card:hover {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.04) 100%);
          border-color: rgba(255, 255, 255, 0.15);
          transform: translateY(-4px);
        }

        .feature-icon {
          width: 56px;
          height: 56px;
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .feature-icon.blue {
          background: rgba(90, 143, 212, 0.15);
          color: #5a8fd4;
        }

        .feature-icon.green {
          background: rgba(16, 185, 129, 0.15);
          color: #34d399;
        }

        .feature-icon.purple {
          background: rgba(139, 92, 246, 0.15);
          color: #a78bfa;
        }

        .feature-icon.orange {
          background: rgba(249, 115, 22, 0.15);
          color: #fb923c;
        }

        .feature-icon.cyan {
          background: rgba(6, 182, 212, 0.15);
          color: #22d3ee;
        }

        .feature-card h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 0.5rem;
        }

        .feature-card p {
          font-size: 0.875rem;
          color: #8ba4c4;
          line-height: 1.5;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .hero-content-wrapper {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .hero-content {
            text-align: center;
          }

          .hero-actions {
            justify-content: center;
          }

          .features-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 2rem 1rem;
          }

          .hero-title {
            font-size: 2rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .features-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 480px) {
          .hero-actions {
            flex-direction: column;
            width: 100%;
          }

          .btn-primary, .btn-secondary {
            width: 100%;
            justify-content: center;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
