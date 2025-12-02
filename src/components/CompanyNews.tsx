import { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Loader2 } from 'lucide-react';

interface NewsItem {
    title: string;
    pubDate: string;
    link: string;
    source: string;
}

interface CompanyNewsProps {
    companyName: string;
}

export default function CompanyNews({ companyName }: CompanyNewsProps) {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (companyName) {
            fetchNews(companyName);
        } else {
            setNews([]);
        }
    }, [companyName]);

    const fetchNews = async (query: string) => {
        setLoading(true);
        setError(null);
        try {
            // Using rss2json to convert Google News RSS to JSON
            // Google News RSS URL: https://news.google.com/rss/search?q={query}&hl=ko&gl=KR&ceid=KR:ko
            const rssUrl = encodeURIComponent(`https://news.google.com/rss/search?q=${query}&hl=ko&gl=KR&ceid=KR:ko`);
            const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${rssUrl}`);
            const data = await response.json();

            if (data.status === 'ok') {
                setNews(data.items.slice(0, 5)); // Limit to 5 items
            } else {
                setNews([]); // Fail silently or show empty state
            }
        } catch (err) {
            console.error('Error fetching news:', err);
            setError('뉴스를 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                    <div className="p-1.5 bg-green-50 rounded-lg text-green-600">
                        <Newspaper size={16} />
                    </div>
                    업체 관련 주요 뉴스
                </h3>
                {companyName && (
                    <span className="text-xs text-gray-500 font-medium px-2 py-1 bg-gray-100 rounded-full">
                        {companyName}
                    </span>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
                {loading ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2 min-h-[150px]">
                        <Loader2 size={24} className="animate-spin text-blue-500" />
                        <span className="text-xs">뉴스를 검색중입니다...</span>
                    </div>
                ) : error ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2 min-h-[150px]">
                        <p className="text-xs text-red-500">{error}</p>
                    </div>
                ) : news.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-2 min-h-[150px]">
                        <Newspaper size={24} className="text-gray-300" />
                        <p className="text-xs">관련된 뉴스가 없습니다.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {news.map((item, index) => (
                            <a
                                key={index}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block group"
                            >
                                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-600 line-clamp-2 leading-snug mb-1.5 transition-colors">
                                            {item.title}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                            <span>{new Date(item.pubDate).toLocaleDateString()}</span>
                                            {/* <span className="w-0.5 h-0.5 bg-gray-300 rounded-full"></span>
                                            <span>{item.source}</span> */}
                                        </div>
                                    </div>
                                    <ExternalLink size={14} className="text-gray-300 group-hover:text-blue-400 flex-shrink-0 mt-1" />
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
