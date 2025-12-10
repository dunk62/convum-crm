// 카카오 지도 API Geocoding 유틸리티
// 주소를 위도/경도 좌표로 변환

const KAKAO_API_KEY = import.meta.env.VITE_KAKAO_API_KEY || '';

export interface GeocodingResult {
    lat: number;
    lng: number;
    address: string;
}

/**
 * 주소를 좌표로 변환 (카카오 로컬 API)
 */
export async function geocodeAddress(address: string): Promise<GeocodingResult | null> {
    if (!address || !KAKAO_API_KEY) {
        console.warn('Address or Kakao API key is missing');
        return null;
    }

    try {
        const response = await fetch(
            `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(address)}`,
            {
                headers: {
                    Authorization: `KakaoAK ${KAKAO_API_KEY}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`Geocoding failed: ${response.status}`);
        }

        const data = await response.json();

        if (data.documents && data.documents.length > 0) {
            const doc = data.documents[0];
            return {
                lat: parseFloat(doc.y),
                lng: parseFloat(doc.x),
                address: doc.address_name || address,
            };
        }

        // 주소 검색 실패 시 키워드 검색 시도
        const keywordResponse = await fetch(
            `https://dapi.kakao.com/v2/local/search/keyword.json?query=${encodeURIComponent(address)}`,
            {
                headers: {
                    Authorization: `KakaoAK ${KAKAO_API_KEY}`,
                },
            }
        );

        if (keywordResponse.ok) {
            const keywordData = await keywordResponse.json();
            if (keywordData.documents && keywordData.documents.length > 0) {
                const doc = keywordData.documents[0];
                return {
                    lat: parseFloat(doc.y),
                    lng: parseFloat(doc.x),
                    address: doc.address_name || address,
                };
            }
        }

        return null;
    } catch (error) {
        console.error('Geocoding error:', error);
        return null;
    }
}

/**
 * 두 좌표 간의 거리 계산 (Haversine formula)
 * @returns 거리 (km)
 */
export function calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number {
    const R = 6371; // 지구 반경 (km)
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function toRad(deg: number): number {
    return deg * (Math.PI / 180);
}

/**
 * 현재 위치 가져오기 (Geolocation API)
 */
export function getCurrentLocation(): Promise<{ lat: number; lng: number }> {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (error) => {
                reject(error);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    });
}
