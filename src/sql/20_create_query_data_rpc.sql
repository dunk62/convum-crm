-- =====================================================
-- SQL 에이전트용 query_data RPC 함수
-- Supabase SQL Editor에서 실행하세요
-- =====================================================

-- 기존 함수 삭제 (있으면)
DROP FUNCTION IF EXISTS query_data(TEXT);

-- 1. SQL 쿼리 실행 함수 생성 (SELECT 전용)
CREATE OR REPLACE FUNCTION query_data(query TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSONB;
    query_lower TEXT;
BEGIN
    -- 쿼리를 소문자로 변환
    query_lower := LOWER(TRIM(query));
    
    -- 보안 체크: SELECT 쿼리만 허용
    IF NOT (query_lower LIKE 'select%') THEN
        RAISE EXCEPTION 'Only SELECT queries are allowed';
    END IF;
    
    -- 위험한 키워드 체크
    IF query_lower LIKE '%insert%' OR 
       query_lower LIKE '%update%' OR 
       query_lower LIKE '%delete%' OR 
       query_lower LIKE '%drop%' OR 
       query_lower LIKE '%truncate%' OR 
       query_lower LIKE '%alter%' OR 
       query_lower LIKE '%create%' OR
       query_lower LIKE '%grant%' OR
       query_lower LIKE '%revoke%' THEN
        RAISE EXCEPTION 'Modification queries are not allowed';
    END IF;
    
    -- 쿼리 실행 및 결과 반환
    EXECUTE 'SELECT COALESCE(jsonb_agg(row_to_json(t)), ''[]''::jsonb) FROM (' || query || ') t'
    INTO result;
    
    RETURN result;
END;
$$;

-- 2. 함수 설명 추가
COMMENT ON FUNCTION query_data(TEXT) IS 'AI 챗봇용 안전한 SELECT 쿼리 실행 함수';

-- 3. 테이블 목록 조회 함수 (스키마 정보용)
CREATE OR REPLACE FUNCTION get_table_schema()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN (
        SELECT jsonb_agg(jsonb_build_object(
            'table_name', table_name,
            'column_name', column_name,
            'data_type', data_type,
            'is_nullable', is_nullable
        ))
        FROM information_schema.columns
        WHERE table_schema = 'public'
        ORDER BY table_name, ordinal_position
    );
END;
$$;

COMMENT ON FUNCTION get_table_schema() IS 'public 스키마의 모든 테이블/컬럼 정보 반환';

-- 4. 권한 설정 (anon 및 authenticated 역할에 실행 권한 부여)
GRANT EXECUTE ON FUNCTION query_data(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION query_data(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_table_schema() TO anon;
GRANT EXECUTE ON FUNCTION get_table_schema() TO authenticated;

-- =====================================================
-- 실행 완료 메시지
-- =====================================================
SELECT 'query_data 및 get_table_schema 함수 생성 및 권한 설정 완료!' AS message;
