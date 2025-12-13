import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Search, MapPin, Loader2, RefreshCw, Filter, X, LocateFixed, Building2, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { calculateDistance, getCurrentLocation } from '../lib/geocoding';

declare global {
    interface Window {
        kakao: any;
    }
}

interface Account {
    id: string;
    name: string;
    industry: string;
    address: string;
    mainPhone: string;
    website: string;
    latitude: number | null;
    longitude: number | null;
    customer_status: 'existing' | 'prospect' | 'pending';
}

const statusConfig = {
    existing: { label: '기존 거래처', color: '#22c55e', bgColor: 'bg-green-500', textColor: 'text-green-500', markerColor: 'green' },
    prospect: { label: '신규/가망', color: '#ef4444', bgColor: 'bg-red-500', textColor: 'text-red-500', markerColor: 'red' },
    pending: { label: '보류/기타', color: '#eab308', bgColor: 'bg-yellow-500', textColor: 'text-yellow-500', markerColor: 'yellow' },
};

const industries = ['로봇', '식품', '자동차', '자동화', '전기,전자', '반도체', '미분류'];

export default function SalesMap() {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);
    const markersRef = useRef<any[]>([]);
    const clustererRef = useRef<any>(null);
    const infoWindowRef = useRef<any>(null);

    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(new Set(['existing', 'prospect', 'pending']));
    const [selectedIndustries, setSelectedIndustries] = useState<Set<string>>(new Set(industries));
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [myLocation, setMyLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [nearbyRadius, setNearbyRadius] = useState<number | null>(null);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    // Fetch accounts from Supabase
    const fetchAccounts = useCallback(async () => {
        try {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('accounts')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;

            const mappedAccounts = (data || []).map(acc => ({
                ...acc,
                mainPhone: acc.main_phone,
                customer_status: acc.customer_status || 'existing',
            }));

            setAccounts(mappedAccounts);
        } catch (err) {
            console.error('Error fetching accounts:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAccounts();

        // Subscribe to real-time changes on accounts table
        const channel = supabase
            .channel('accounts-changes')
            .on(
                'postgres_changes',
                {
                    event: '*', // Listen to INSERT, UPDATE, DELETE
                    schema: 'public',
                    table: 'accounts'
                },
                (payload) => {
                    console.log('Accounts changed:', payload.eventType);
                    fetchAccounts(); // Refresh data on any change
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchAccounts]);

    // Initialize Kakao Map
    const [mapLoaded, setMapLoaded] = useState(false);

    useEffect(() => {
        const loadKakaoMap = () => {
            if (window.kakao && window.kakao.maps) {
                window.kakao.maps.load(() => {
                    initializeMap();
                });
            }
        };

        const scriptId = 'kakao-map-script';
        let script = document.getElementById(scriptId) as HTMLScriptElement;

        if (script) {
            if (window.kakao && window.kakao.maps) {
                loadKakaoMap();
            } else {
                // Script exists but not loaded (or still loading)
                // Poll for availability
                const checkInterval = setInterval(() => {
                    if (window.kakao && window.kakao.maps) {
                        clearInterval(checkInterval);
                        loadKakaoMap();
                    }
                }, 200);

                // Stop checking after 10 seconds to indicate failure
                setTimeout(() => {
                    clearInterval(checkInterval);
                    if (!mapLoaded && (!window.kakao || !window.kakao.maps)) {
                        console.error('Kakao Maps script found but API failed to initialize within timeout.');
                    }
                }, 10000);
            }
            return;
        }

        // Load new script
        script = document.createElement('script');
        script.id = scriptId;
        const apiKey = import.meta.env.VITE_KAKAO_MAP_KEY;
        console.log('Loading Kakao Maps with key:', apiKey ? apiKey.substring(0, 8) + '...' : 'MISSING');

        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=clusterer`;
        script.async = true;

        script.onload = () => {
            console.log('Kakao Maps SDK script loaded');
            loadKakaoMap();
        };

        script.onerror = (e) => {
            console.error('Failed to load Kakao Maps SDK:', e);
        };

        document.head.appendChild(script);

        return () => {
            // Cleanup if needed
        };
    }, []);

    const initializeMap = () => {
        if (mapRef.current && !mapInstanceRef.current) {
            try {
                const options = {
                    center: new window.kakao.maps.LatLng(35.9078, 127.7669), // 한국 중심
                    level: 12,
                };
                mapInstanceRef.current = new window.kakao.maps.Map(mapRef.current, options);
                console.log('Map instance created');

                // 클러스터러 초기화
                clustererRef.current = new window.kakao.maps.MarkerClusterer({
                    map: mapInstanceRef.current,
                    averageCenter: true,
                    minLevel: 5,
                    disableClickZoom: false,
                    styles: [
                        {
                            width: '53px',
                            height: '52px',
                            background: 'url(https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/cluster3.png)',
                            color: '#fff',
                            textAlign: 'center',
                            lineHeight: '54px',
                        },
                    ],
                });

                infoWindowRef.current = new window.kakao.maps.InfoWindow({ zIndex: 1 });
                setMapLoaded(true);
                console.log('Map initialization complete');
            } catch (err) {
                console.error('Map initialization error:', err);
            }
        }
    };

    // Filter accounts
    const filteredAccounts = useMemo(() => {
        let result = accounts.filter(acc => acc.latitude && acc.longitude);

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            result = result.filter(acc =>
                acc.name?.toLowerCase().includes(term) ||
                acc.address?.toLowerCase().includes(term) ||
                acc.industry?.toLowerCase().includes(term)
            );
        }

        // Status filter
        result = result.filter(acc => selectedStatuses.has(acc.customer_status));

        // Industry filter
        result = result.filter(acc => {
            const industry = acc.industry || '미분류';
            return selectedIndustries.has(industry);
        });

        // Nearby filter
        if (myLocation && nearbyRadius) {
            result = result.filter(acc => {
                if (!acc.latitude || !acc.longitude) return false;
                const distance = calculateDistance(myLocation.lat, myLocation.lng, acc.latitude, acc.longitude);
                return distance <= nearbyRadius;
            });
        }

        return result;
    }, [accounts, searchTerm, selectedStatuses, selectedIndustries, myLocation, nearbyRadius]);

    // Update markers when filtered accounts change
    useEffect(() => {
        if (!mapInstanceRef.current || !clustererRef.current || !window.kakao) return;

        // Clear existing markers
        clustererRef.current.clear();
        markersRef.current = [];

        const markers = filteredAccounts.map(account => {
            if (!account.latitude || !account.longitude) return null;

            const position = new window.kakao.maps.LatLng(account.latitude, account.longitude);
            const status = statusConfig[account.customer_status] || statusConfig.existing;

            // Custom SVG marker with status color
            const markerSvg = `
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
                    <defs>
                        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.3"/>
                        </filter>
                    </defs>
                    <path fill="${status.color}" filter="url(%23shadow)" d="M16 0C7.16 0 0 7.16 0 16c0 12 16 24 16 24s16-12 16-24C32 7.16 24.84 0 16 0z"/>
                    <circle cx="16" cy="14" r="6" fill="white"/>
                </svg>
            `;
            const encodedSvg = encodeURIComponent(markerSvg);

            const markerImage = new window.kakao.maps.MarkerImage(
                `data:image/svg+xml,${encodedSvg}`,
                new window.kakao.maps.Size(32, 40),
                { offset: new window.kakao.maps.Point(16, 40) }
            );

            const marker = new window.kakao.maps.Marker({
                position,
                image: markerImage,
            });

            // Click event for info window - compact and semi-transparent
            window.kakao.maps.event.addListener(marker, 'click', () => {
                const content = `
                    <div style="
                        padding: 0;
                        min-width: 220px;
                        max-width: 250px;
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        background: rgba(15, 23, 42, 0.45);
                        backdrop-filter: blur(16px);
                        -webkit-backdrop-filter: blur(16px);
                        border-radius: 12px;
                        border: 1px solid rgba(255,255,255,0.2);
                        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
                        overflow: hidden;
                    ">
                        <div style="
                            padding: 10px 12px;
                            background: rgba(${status.color === '#22c55e' ? '34,197,94' : status.color === '#ef4444' ? '239,68,68' : '234,179,8'}, 0.2);
                            border-bottom: 1px solid rgba(255,255,255,0.1);
                        ">
                            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                                <span style="width: 8px; height: 8px; border-radius: 50%; background: ${status.color}; box-shadow: 0 0 6px ${status.color};"></span>
                                <span style="font-size: 10px; color: ${status.color}; font-weight: 700; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">${status.label}</span>
                            </div>
                            <h3 style="margin: 0; font-size: 14px; font-weight: 800; color: #ffffff; text-shadow: 0 1px 3px rgba(0,0,0,0.6);">${account.name}</h3>
                        </div>
                        <div style="padding: 10px 12px;">
                            <div style="margin-bottom: 8px;">
                                <span style="display: inline-block; padding: 2px 8px; background: rgba(59,130,246,0.4); border-radius: 12px; font-size: 10px; color: white; font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.4);">${account.industry || '미분류'}</span>
                            </div>
                            <p style="margin: 0 0 6px 0; font-size: 11px; color: #ffffff; font-weight: 500; line-height: 1.3; text-shadow: 0 1px 2px rgba(0,0,0,0.5);">📍 ${account.address || '-'}</p>
                            <p style="margin: 0 0 10px 0; font-size: 12px; color: #93c5fd; font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.4);">📞 ${account.mainPhone || '-'}</p>
                            <div style="display: flex; gap: 6px;">
                                <a href="tel:${account.mainPhone}" style="
                                    flex: 1; padding: 8px; 
                                    background: rgba(59, 130, 246, 0.9);
                                    color: white; text-align: center; border-radius: 8px; 
                                    text-decoration: none; font-size: 11px; font-weight: 700;
                                    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                                ">📱 전화</a>
                                <a href="https://map.kakao.com/link/to/${encodeURIComponent(account.name)},${account.latitude},${account.longitude}" target="_blank" style="
                                    flex: 1; padding: 8px; 
                                    background: rgba(16, 185, 129, 0.9);
                                    color: white; text-align: center; border-radius: 8px; 
                                    text-decoration: none; font-size: 11px; font-weight: 700;
                                    text-shadow: 0 1px 2px rgba(0,0,0,0.3);
                                ">🚗 길찾기</a>
                            </div>
                        </div>
                    </div>
                `;

                infoWindowRef.current.setContent(content);
                infoWindowRef.current.open(mapInstanceRef.current, marker);
                setSelectedAccount(account);
            });

            return marker;
        }).filter(Boolean);

        clustererRef.current.addMarkers(markers);
        markersRef.current = markers;
    }, [filteredAccounts]);

    // Handle account click from list
    const handleAccountClick = (account: Account) => {
        if (!mapInstanceRef.current || !account.latitude || !account.longitude) return;

        const position = new window.kakao.maps.LatLng(account.latitude, account.longitude);
        mapInstanceRef.current.setLevel(3);
        mapInstanceRef.current.panTo(position);
        setSelectedAccount(account);

        // Find and trigger the marker
        const markerIndex = filteredAccounts.findIndex(a => a.id === account.id);
        if (markerIndex >= 0 && markersRef.current[markerIndex]) {
            window.kakao.maps.event.trigger(markersRef.current[markerIndex], 'click');
        }
    };

    // Get current location
    const handleGetLocation = async () => {
        try {
            setIsLoadingLocation(true);
            const location = await getCurrentLocation();
            setMyLocation(location);

            if (mapInstanceRef.current) {
                const position = new window.kakao.maps.LatLng(location.lat, location.lng);
                mapInstanceRef.current.setLevel(7);
                mapInstanceRef.current.panTo(position);

                // Add my location marker
                new window.kakao.maps.Marker({
                    map: mapInstanceRef.current,
                    position,
                    image: new window.kakao.maps.MarkerImage(
                        'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png',
                        new window.kakao.maps.Size(24, 35)
                    ),
                });
            }
        } catch (err) {
            console.error('Error getting location:', err);
            alert('위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
        } finally {
            setIsLoadingLocation(false);
        }
    };

    const toggleStatus = (status: string) => {
        const newSet = new Set(selectedStatuses);
        if (newSet.has(status)) {
            newSet.delete(status);
        } else {
            newSet.add(status);
        }
        setSelectedStatuses(newSet);
    };

    const toggleIndustry = (industry: string) => {
        const newSet = new Set(selectedIndustries);
        if (newSet.has(industry)) {
            newSet.delete(industry);
        } else {
            newSet.add(industry);
        }
        setSelectedIndustries(newSet);
    };

    return (
        <div className="flex h-[calc(100vh-80px)] gap-4">
            {/* Left Sidebar - Customer List */}
            <div className="w-80 flex-shrink-0 bg-card rounded-xl border border-border flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <MapPin size={20} className="text-primary" />
                            Sales Map
                        </h2>
                        <button
                            onClick={fetchAccounts}
                            className="p-2 text-muted-foreground hover:text-white hover:bg-secondary/50 rounded-lg transition-colors"
                            title="새로고침"
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                        </button>
                    </div>

                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                        <input
                            type="text"
                            placeholder="업체명, 주소 검색..."
                            className="w-full pl-9 pr-4 py-2 bg-secondary text-white text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Filters */}
                <div className="p-3 border-b border-border space-y-3">
                    {/* Status Filter */}
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(statusConfig).map(([key, config]) => (
                            <button
                                key={key}
                                onClick={() => toggleStatus(key)}
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${selectedStatuses.has(key)
                                    ? `${config.bgColor} text-white`
                                    : 'bg-secondary/50 text-muted-foreground'
                                    }`}
                            >
                                <span className={`w-2 h-2 rounded-full ${selectedStatuses.has(key) ? 'bg-white' : config.bgColor}`}></span>
                                {config.label}
                            </button>
                        ))}
                    </div>

                    {/* Industry Filter Toggle */}
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex items-center justify-between w-full px-3 py-2 bg-secondary/30 rounded-lg text-sm text-muted-foreground hover:text-white transition-colors"
                    >
                        <span className="flex items-center gap-2">
                            <Filter size={14} />
                            산업군 필터 ({selectedIndustries.size}/{industries.length})
                        </span>
                        <ChevronDown size={14} className={`transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isFilterOpen && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {industries.map(industry => (
                                <button
                                    key={industry}
                                    onClick={() => toggleIndustry(industry)}
                                    className={`px-2 py-1 rounded text-xs font-medium transition-all ${selectedIndustries.has(industry)
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                        }`}
                                >
                                    {industry}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Nearby Filter */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleGetLocation}
                            disabled={isLoadingLocation}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 text-white rounded-lg text-xs font-medium hover:bg-cyan-500 transition-colors"
                        >
                            {isLoadingLocation ? <Loader2 size={14} className="animate-spin" /> : <LocateFixed size={14} />}
                            내 위치
                        </button>
                        {myLocation && (
                            <>
                                <select
                                    className="bg-secondary text-white text-xs border border-border rounded-lg px-2 py-1.5"
                                    value={nearbyRadius || ''}
                                    onChange={(e) => setNearbyRadius(e.target.value ? Number(e.target.value) : null)}
                                >
                                    <option value="">전체</option>
                                    <option value="5">5km 이내</option>
                                    <option value="10">10km 이내</option>
                                    <option value="20">20km 이내</option>
                                </select>
                                <button
                                    onClick={() => { setMyLocation(null); setNearbyRadius(null); }}
                                    className="p-1.5 text-muted-foreground hover:text-white"
                                >
                                    <X size={14} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="px-4 py-2 bg-secondary/20 border-b border-border text-xs text-muted-foreground">
                    총 <span className="text-white font-medium">{filteredAccounts.length}</span>개 업체
                </div>

                {/* Customer List */}
                <div className="flex-1 overflow-y-auto">
                    {filteredAccounts.map(account => {
                        const status = statusConfig[account.customer_status] || statusConfig.existing;
                        const isSelected = selectedAccount?.id === account.id;

                        return (
                            <button
                                key={account.id}
                                onClick={() => handleAccountClick(account)}
                                className={`w-full p-3 text-left border-b border-border hover:bg-secondary/30 transition-colors ${isSelected ? 'bg-primary/10 border-l-2 border-l-primary' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${status.bgColor}/20`}>
                                        <Building2 size={16} className={status.textColor} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${status.bgColor}`}></span>
                                            <span className="font-medium text-white text-sm truncate">{account.name}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate mt-0.5">{account.address || '-'}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs px-1.5 py-0.5 bg-secondary/50 rounded text-muted-foreground">
                                                {account.industry || '미분류'}
                                            </span>
                                            {myLocation && account.latitude && account.longitude && (
                                                <span className="text-xs text-cyan-400">
                                                    {calculateDistance(myLocation.lat, myLocation.lng, account.latitude, account.longitude).toFixed(1)}km
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </button>
                        );
                    })}

                    {filteredAccounts.length === 0 && !isLoading && (
                        <div className="p-8 text-center text-muted-foreground">
                            <MapPin size={32} className="mx-auto mb-2 opacity-50" />
                            <p className="text-sm">표시할 고객이 없습니다</p>
                            <p className="text-xs mt-1">좌표가 등록된 고객만 표시됩니다</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Right - Map */}
            <div className="flex-1 bg-card rounded-xl border border-border overflow-hidden relative">
                <div ref={mapRef} className="w-full h-full" />

                {/* Map Loading Overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                        <div className="text-center">
                            <Loader2 size={32} className="animate-spin text-primary mx-auto" />
                            <p className="text-muted-foreground mt-2">지도 로딩 중...</p>
                        </div>
                    </div>
                )}

                {/* Legend */}
                <div className="absolute top-4 right-4 bg-card/95 backdrop-blur rounded-lg border border-border p-3 shadow-lg">
                    <p className="text-xs font-medium text-muted-foreground mb-2">고객 상태</p>
                    <div className="space-y-1.5">
                        {Object.entries(statusConfig).map(([key, config]) => (
                            <div key={key} className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full ${config.bgColor}`}></span>
                                <span className="text-xs text-muted-foreground">{config.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
