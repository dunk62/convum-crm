-- Part 14 of Contact Import (mapped to sales_performance filenames)

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '한성덕', '차장', '기술영업부', '01097999608', 'astech5100@naver.com', '근무처 팩스: 055-346-3113'
FROM accounts
WHERE name = '아성테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '한성호', '소장', NULL, '01037028539', 'atc_pneumatic@naver.com', NULL
FROM accounts
WHERE name = '에이티씨 공압';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '한세영', '대리', '설계팀', '01040251302', 'seyeong.han@daejinmc.com', '근무처 팩스: 054-463-1465'
FROM accounts
WHERE name = '대진기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '한솔코에버 이창민차장님', '차장', '제조기술연구실', '01062582079', 'changmin.lee@hansol.com', NULL
FROM accounts
WHERE name = '한솔코에버';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '한우삼', '주임', '생산기술부', '01085994542', 'hanws1009@myeco.co.kr', '근무처 팩스: 054-770-3170'
FROM accounts
WHERE name = '에코플라스틱';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '한유철', '차장', '기계설계팀', '01027351672', 'jeil@jeilmach.com', '근무처 팩스: 054-773-3464'
FROM accounts
WHERE name = '제일기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '한인섭', '대표이사', NULL, '01044271285', 'ishan2303@hanmail.net', '근무처 팩스: 032-816-2108'
FROM accounts
WHERE name = '우성뉴매틱';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '한현규', '차장', NULL, '01025130056', 'syfnt@naver.com', '근무처 팩스: 055-276-7753'
FROM accounts
WHERE name = '신영에프앤티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '허수영', '차장', 'FA구매팀', '01065539218', 'syheo@gomotec.com', NULL
FROM accounts
WHERE name = '고모텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '허유성', '책임', '경영지원팀', '01067681511', 'jutso2000@dibt.co.kr', '근무처 팩스: 055-292-0561'
FROM accounts
WHERE name = '디티케이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '허재', '수석', '경영지원팀', '01041121325', 'good@dibt.co.kr', '근무처 팩스: 055-292-0561'
FROM accounts
WHERE name = '디티케이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '허준영', '대리', '자동화사업부', '01031730770', 'airbal@chol.com', '근무처 팩스: 052-288-5547'
FROM accounts
WHERE name = '동성산기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '허진석', '대리', '구매팀', '01050697892', 'han_ljh@naver.com', '근무처 팩스: 054-931-9907'
FROM accounts
WHERE name = '한성엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '허찬무', '총괄부장', '관리부', '01047997057', 'hcm123456@hanmail.net', '근무처 팩스: 043-881-4030'
FROM accounts
WHERE name = '국민패키징';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '홍경석', '책임', '생산기술팀', '01025516322', 'lastmagic7@myeco.co.kr', '근무처 팩스: 054-770-3170'
FROM accounts
WHERE name = '에코플라스틱';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '홍기만', '상무이사', '영업1그룹', '01074265549', 'hkm@kccpr.com', '근무처 팩스: 02-2679-8924'
FROM accounts
WHERE name = '케이시시정공';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '홍남기', '과장', '설계팀', '01045236662', 'namki.hong@daejinmc.com', '근무처 팩스: 054-463-1465'
FROM accounts
WHERE name = '대진기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '홍석준', '소장', '설계개발부', '01055066278', 'ingyong@bmic.co.kr', '근무처 팩스: 053-592-8824'
FROM accounts
WHERE name = '거산산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '홍성기', '주임 연구원', '생산기술팀', '01093060375', 'hsk84@ihantec.com', '근무처 팩스: 051-726-9091'
FROM accounts
WHERE name = '한텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '홍순래', '팀장', '영업기술팀', '01038744536', 'shin5124@chol.com', '근무처 팩스: 055-346-5132'
FROM accounts
WHERE name = '신풍산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '홍승환', '대리', NULL, '01091344921', 'positive921@gmail.com', '근무처 팩스: 054-715-7101'
FROM accounts
WHERE name = '트리엔';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '홍재호', '차장', '생산본부 제조관리팀', '01025436646', 'hoya@avaco.com', '근무처 팩스: 053-588-9209'
FROM accounts
WHERE name = '아바코';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '홍재훈', '계장', '영업부 대구지사', '01074260095', 'hjh@kccpr.com', '근무처 팩스: 053-586-4305'
FROM accounts
WHERE name = '케이시시정공';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '홍준영', '사원', '생산관리부/구매과', '01045467024', 'jyhong@htg.co.kr', '근무처 팩스: 054-476-7811'
FROM accounts
WHERE name = '한욱테크노글라스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '홍지상', '차장', '기계베어링팀', '01097397977', 'jhjs28@hanwha.com', '근무처 팩스: 050-5730-2288'
FROM accounts
WHERE name = '한화 / 글로벌';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '황건일', '과장', '기계설계부', '01088542670', 'kjpa@kjpa.co.kr', '근무처 팩스: 054-975-4612'
FROM accounts
WHERE name = '중원기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '황경인', '책임 / Sales Account Manager', '유체제어사업부', '01041074110', 'khwang@emerson.com', '근무처 팩스: 051-265-0061'
FROM accounts
WHERE name = '아벤틱스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '황경철', '상무이사', NULL, '01038072903', 'hwkych@hanmail.net', '근무처 팩스: 053-586-4138'
FROM accounts
WHERE name = '케이시시정공';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '황길웅', '대리', '설계2팀', '01029787089', 'zero12305@cisro.co.kr', '근무처 팩스: 053-593-1554'
FROM accounts
WHERE name = '씨아이에스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '황동석', '부장', '부산점 / 영업관리부', '0118395681', 'ddps1916@naver.com', '근무처 팩스: 051-313-1918'
FROM accounts
WHERE name = '대동유공압';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '황동수', '차장', NULL, '01057691757', 'wonfa01@naver.com', '근무처 팩스: 055-288-1757'
FROM accounts
WHERE name = '원에프에이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '황동환', '대리', NULL, '01041918071', 'sungjinfa1@naver.com', '근무처 팩스: 055-237-9851'
FROM accounts
WHERE name = '성진자동화';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '황민규', '과장', '기계사업부 / 서울영업소', '01045183018', 'mk.hwang@daesung.co.kr', '근무처 팩스: 02-462-5925'
FROM accounts
WHERE name = '대성산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '황보웅', '차장', '구매팀', '01045455835', 'ung733@naver.com', '근무처 팩스: 052-288-6401'
FROM accounts
WHERE name = '일신테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '황상준', '과장', 'Solar팀 / 신사업추진센터', '01077777505', 'hwangsj@hanwha.com', '근무처 팩스: 055-210-6447'
FROM accounts
WHERE name = '한화/기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '황성근', '제조부장', NULL, '01063559062', 'hsg6355@convum.co.kr', '근무처 팩스: 070-8668-2405'
FROM accounts
WHERE name = '컨범코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '황성래', '선임', '영업그룹 / 솔루션 영업팀', '01088995526', 'srhwang@pisco.co.kr', '근무처 팩스: 054-475-2217'
FROM accounts
WHERE name = '피스코코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '황성윤', NULL, NULL, '01025958119', NULL, '근무처 팩스: 051-337-7654'
FROM accounts
WHERE name = '동서냉열기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '황성필', '과장', '설계팀', '01043935539', 'hnm_glotech@naver.com', NULL
FROM accounts
WHERE name = '에이치엔엠 글로텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '황우성', '대표', NULL, '01093869398', 'saa211227@naver.com', '근무처 팩스: 051-831-9398'
FROM accounts
WHERE name = 'SAA';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '황운수', '연구 1팀장 / 부장', '기업부설연구소', '01045277230', 'yhhbr@nate.com', '근무처 팩스: 054-462-8675'
FROM accounts
WHERE name = '브이엔에스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '황은영', '선임', '영업본부 기술영업팀', '01046001246', 'eunyoung@tanhay.com', '근무처 팩스: 032-578-0786'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '황인호', NULL, '설계부', '01090189035', 'hwang981103@naver.com', '근무처 팩스: 055-266-7617'
FROM accounts
WHERE name = '덕성엠텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '황재섭', '주임', 'GT사업부 부산영업소 / 기술영업', '01097155650', 'jshwang@abimaneng.com', '근무처 팩스: 055-785-5052'
FROM accounts
WHERE name = '아비만엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '황정호', '이사', '기계설계팀', '01093154221', 'jeil@jeilmach.com', '근무처 팩스: 054-773-3464'
FROM accounts
WHERE name = '제일기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '황진용', '과장', '기업부설연구소 / 연구1팀', '01035358539', 'ajr1124@nate.com', '근무처 팩스: 054-462-8675'
FROM accounts
WHERE name = '브이엔에스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '황진웅', '과장', 'CLEAN SYSTEM 사업부', '01035954139', 'equal0425@hanmail.net', '근무처 팩스: 055-338-6878'
FROM accounts
WHERE name = '삼우엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '황창석', '대리', NULL, '01066544670', 'helloseok@naver.com', '근무처 팩스: 052-263-3354'
FROM accounts
WHERE name = '티엠프라자';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '황혜영', NULL, NULL, '01039019817', 'sales@daedongauto.com', '근무처 팩스: 063-841-9818'
FROM accounts
WHERE name = '대동자동화';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '황환길', '주임', '로봇사업부 / MHA기술부 / 기술1팀', '01048660760', 'hwangil1211@yaskawa.co.kr', '근무처 팩스: 053-581-1220'
FROM accounts
WHERE name = '한국야스카와전기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '金泰贤', '부장', '海外营业部', '01093256106', 'kth1014@sunstat.com', NULL
FROM accounts
WHERE name = 'Hidden Champion 100';
