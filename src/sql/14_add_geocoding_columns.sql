-- 고객 위치 정보 및 상태 컬럼 추가 (Sales Map용)

-- 1. 위도/경도 좌표 컬럼 추가
ALTER TABLE accounts 
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- 2. 고객 상태 컬럼 추가 (마커 색상 구분용)
-- existing: 🟢 기존 거래처 (초록색)
-- prospect: 🔴 신규/가망 고객 (빨간색)
-- pending: 🟡 보류/기타 (노란색)
ALTER TABLE accounts 
ADD COLUMN IF NOT EXISTS customer_status VARCHAR(20) DEFAULT 'existing';

-- 3. 인덱스 추가 (지도 쿼리 최적화)
CREATE INDEX IF NOT EXISTS idx_accounts_coordinates ON accounts(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_accounts_status ON accounts(customer_status);

-- 4. 코멘트 추가
COMMENT ON COLUMN accounts.latitude IS '위도 좌표 (Geocoding으로 변환)';
COMMENT ON COLUMN accounts.longitude IS '경도 좌표 (Geocoding으로 변환)';
COMMENT ON COLUMN accounts.customer_status IS '고객 상태: existing(기존), prospect(신규/가망), pending(보류)';
