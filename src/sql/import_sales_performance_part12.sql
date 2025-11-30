-- Part 12 of Contact Import (mapped to sales_performance filenames)

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정민호', '주임', NULL, '01093735994', 'lpt_md@lptkor.com', '근무처 팩스: 053-269-8999'
FROM accounts
WHERE name = '엘피티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정병찬', '센터장 / CTO / 공학박사', 'R&D센터', '01038939286', 'bc96.jung@hanwha.com', NULL
FROM accounts
WHERE name = '한화로보틱스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정석영', '기술설계이사', NULL, '01085220429', 'quartz72@naver.com', '근무처 팩스: 055-802-8587'
FROM accounts
WHERE name = '이알';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정성문', '과장', '생산기술실', '01043866414', 'smjung@donghee.co.kr', '근무처 팩스: 052-257-0171'
FROM accounts
WHERE name = '베바스토동희';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정승혁', '과장', '울산공장 / 보전5부', '01073847533', 'haiwaystar@hyundai.com', '근무처 팩스: 052-280-8932'
FROM accounts
WHERE name = '현대자동차그룹';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정연웅', '팀장', '구매자재팀', '01035311231', 'jyw1231@e-utosys.com', '근무처 팩스: 054-473-8123'
FROM accounts
WHERE name = '유토시스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정영진', '대리', 'PO Module 기술팀', '01077523726', 'jyj9115@lgdisplay.com', '근무처 팩스: 054-717-0909'
FROM accounts
WHERE name = 'LG디스플레이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정용수', '대리', '구매부', '01035221146', 'younghofa@hanmail.net', '근무처 팩스: 054-715-6828'
FROM accounts
WHERE name = '영호엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정용재', '과장', '기술영업팀', '01090155161', 'jyj@protec21.co.kr', '근무처 팩스: 032-822-9182'
FROM accounts
WHERE name = '피앤엠';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정용진', '주임연구원', '기술연구소', '01045363442', 'yjjeong135@coretechsys.co.kr', '근무처 팩스: 054-975-3147'
FROM accounts
WHERE name = '코아테크시스템';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정용훈', '부장', '구미지사', '01071838606', 'madalsun@systemrnd.com', '근무처 팩스: 054-474-5238'
FROM accounts
WHERE name = '시스템알앤디';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정우식', '대리', '기계설계팀', '01044014586', 'jeil@jeilmach.com', '근무처 팩스: 054-773-3464'
FROM accounts
WHERE name = '제일기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정우철', '주임', '부산지사', '01074260039', 'star572@naver.com', '근무처 팩스: 051-319-3857'
FROM accounts
WHERE name = '케이시시정공';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정원동', '과장', '기술영업지원', '01038470975', 'jwd4989@naver.com', '근무처 팩스: 051-266-0111'
FROM accounts
WHERE name = '동성켐텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정원한', '상무 / 총괄', '시스템사업부 / 구매, 외주팀', '01033074129', 'whjung@protec21.co.kr', '근무처 팩스: 031-470-0701'
FROM accounts
WHERE name = '프로텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정유진', '대표', NULL, '01057123308', 'gst3308@hanmail.net', '근무처 팩스: 051-319-2786'
FROM accounts
WHERE name = '금성테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정윤모', '부장', '영업부', '01042495500', 'biz@sym21.com', '근무처 팩스: 031-499-5505'
FROM accounts
WHERE name = '신영제어기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정은주', '사원', '구매부', '01093604860', 'younghofa@hanmail.net', '근무처 팩스: 054-715-6828'
FROM accounts
WHERE name = '영호엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정재현', '지사장', '부산지사', '01074260049', 'jjh1@kccpr.com', '근무처 팩스: 051-316-3857'
FROM accounts
WHERE name = '케이시시정공';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정종춘', '부장', '기구설계 / 정밀자동화사업부', '01094394060', 'jeongjch@epnt.co.kr', '근무처 팩스: 054-462-9085'
FROM accounts
WHERE name = 'pnt';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정지용', '차장', '영업부', '01038952061', 'jungjy@daeji.com', '근무처 팩스: 053-582-1614'
FROM accounts
WHERE name = '대지메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정지현', '대리', NULL, '01071222026', 'desk@tesko.kr', '근무처 팩스: 053-584-7521'
FROM accounts
WHERE name = '테스코';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정진만', '대리', '자동화기술팀', '01095031542', 'jeongjm@hyundai-wia.com', '근무처 팩스: 052-711-7599'
FROM accounts
WHERE name = '현대위아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정찬규', '이사', 'Auto Tier 1 / Robotics and Discrete Automation', '01054502769', 'chan-kyu.jung@kr.abb.com', NULL
FROM accounts
WHERE name = 'ABB 코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정철수', '이사', NULL, '01075195229', 'dm68298@naver.com', '근무처 팩스: 052-282-3357'
FROM accounts
WHERE name = '다물기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정철호', '본부장', '영업본부', '01062635585', 'chulho@tanhay.com', '근무처 팩스: 032-578-0786'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정춘종', '과장 / 책임', NULL, '01062775781', 'CMD735@daum.net', '근무처 팩스: 055-905-2099'
FROM accounts
WHERE name = '씨엠디테크놀로지';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정치수', '차장', '기술연구소', '01095540082', 'chisoo@acddisplay.co.kr', '근무처 팩스: 054-475-8912'
FROM accounts
WHERE name = '에이시디';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정하용', '책임', 'OLight 기술팀', '01084329698', 'chylg@lgdisplay.com', NULL
FROM accounts
WHERE name = 'LG디스플레이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정학수', '부장', '설계팀', '01041344150', 'jhsjks9@korea.com', '근무처 팩스: 053-592-8672'
FROM accounts
WHERE name = '피디엠 수성';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정해석', '대표', NULL, '01093902638', 'bestec1@yahoo.co.kr', '근무처 팩스: 055-267-1305'
FROM accounts
WHERE name = '베스텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정해용', '차장', '툴링센터 / 자동화설계팀', '01050963278', 'kihotel@hyundai.com', '근무처 팩스: 052-280-7438'
FROM accounts
WHERE name = '현대자동차그룹';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정해진', '연구소장 / 이사', '연구소', '01085653112', 'Jeonghj@aegissystem.co.kr', '근무처 팩스: 054-461-2212'
FROM accounts
WHERE name = 'AEGIS SYSTEM';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정해진', '과장', NULL, '01065562991', 'heajina@naver.com', '근무처 팩스: 052-263-3354'
FROM accounts
WHERE name = '티엠프라자';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정헌주', '대리', 'MDE Task', '01063303657', 'velobe@lgdisplay.com', NULL
FROM accounts
WHERE name = 'LG디스플레이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정현근', '주임', '관리부', '01063593935', 'wlaud9999@sangsin.com', '근무처 팩스: 053-355-7466'
FROM accounts
WHERE name = '상신ENG';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정현기', '이사', NULL, '01055253660', 'hkchung3333@naver.com', '근무처 팩스: 053-813-0038'
FROM accounts
WHERE name = '두안시스텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정현우', '센터장', '영업본부 / 부산영업소', '01052390968', 'jhw@tanhay.com', '근무처 팩스: 051-312-8553'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정화영', '대표이사', NULL, '01041349991', 'hyjung76@bldo.co.kr', '근무처 팩스: 070-8877-1203'
FROM accounts
WHERE name = '비엘두';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정휘훈', '대표', NULL, '01075092114', 'jaden.jung@gravsolution.com', '근무처 팩스: 30334401237'
FROM accounts
WHERE name = '그랩';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정희옥', '차장', '기술영업', '01025057642', 'heeok.jung@daejinmc.com', '근무처 팩스: 054-463-1465'
FROM accounts
WHERE name = '대진기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '제이에스 강태욱과장님', '과장', '기술팀', '01048803978', 'taewook.kang@jscoltd.com', '근무처 팩스: 054-471-0729'
FROM accounts
WHERE name = '제이에스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '조강수', '차장', '자동화사업부 / 엔지니어링팀', '01087666524', 'cho.kang.soo@drbfatec.co.kr', '근무처 팩스: 051-790-9089'
FROM accounts
WHERE name = 'DRB파텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '조광현', '상무', '경영지원팀', '01041176043', 'andrew@kmpnt.com', '근무처 팩스: 043-877-8239'
FROM accounts
WHERE name = '국민피앤텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '조기운', '과장', NULL, '01044114585', 'samjungrobotics@naver.com', '근무처 팩스: 055-294-0476'
FROM accounts
WHERE name = '삼정로보틱스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '조대구', '팀장 / 부장', '본사 영업2팀', '01074260041', 'jdg@kccpr.com', '근무처 팩스: 02-2679-8924'
FROM accounts
WHERE name = '케이시시정공';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '조대영', '선임', '영업본부 광주Solution Center', '01066627060', 'jdy7060@tanhay.com', '근무처 팩스: 070-4332-1588'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '조범수', '대표', NULL, '01064218676', 'hnm_glotech@naver.com', NULL
FROM accounts
WHERE name = '에이치엔엠 글로텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '조상운', 'PM / 과장', 'Fluid & Motion Control', '01087147230', 'sangun.jo@emerson.com', '근무처 팩스: 051-265-0061'
FROM accounts
WHERE name = '아벤틱스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '조성현', '대표', NULL, '01087885759', 'vip222@naver.com', '근무처 팩스: 051-972-2334'
FROM accounts
WHERE name = '유림자동화';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '조세은', '부장', '본사', '01072087542', NULL, '근무처 팩스: 063-857-9918'
FROM accounts
WHERE name = '디케이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '조양재', '대리', '창원', '01022068160', 'yangjae2632@dsmtech.co.kr', NULL
FROM accounts
WHERE name = '덕성엠텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '조영래', '과장', '설계팀', '01091022742', 'svt@sunvitech.com', '근무처 팩스: 053-582-5879'
FROM accounts
WHERE name = '선비테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '조용민', '과장', NULL, '01045048526', 'ky8622@hanmail.net', '근무처 팩스: 051-715-2616'
FROM accounts
WHERE name = '금영산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '조용찬', '과장', '자재과', '01035307639', 'chan7905@yjlink.com', '근무처 팩스: 053-592-1720'
FROM accounts
WHERE name = '와이제이링크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '조원빈', 'Professional', '무선사업부 Global제조팀', '01033289420', 'wonbin.jo@samsung.com', '근무처 팩스: 054-479-5773'
FROM accounts
WHERE name = '삼성전자';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '조원학', '책임', '설계실', '01091696235', 'whjo@eunil.co.kr', '근무처 팩스: 053-591-7522'
FROM accounts
WHERE name = '은일';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '조윤호', '대표', NULL, '01053227147', 'tomayhcho@daum.net', '근무처 팩스: 051-832-6632'
FROM accounts
WHERE name = 'TOMA';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '조인호', '팀장', '자동화금형팀', '01040577411', 'joinus@intops.co.kr', '근무처 팩스: 054-471-4194'
FROM accounts
WHERE name = 'INTOPS';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '조재원', '기술사원', '울산공장-보전4부', '01055496476', 'jw.jo@hyundai.com', '근무처 팩스: 052-215-7421'
FROM accounts
WHERE name = 'Hyundai Motor Company';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '조정현', 'PL', '글로벌 제조&인프라총괄 / Package기술팀', '01031893463', 'chojh20@samsung.com', NULL
FROM accounts
WHERE name = '삼성전자';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '조중석', '실장', '설계실', '01055401783', 'jsjo@anysyst.com', '근무처 팩스: 055-326-0130'
FROM accounts
WHERE name = '애니시스템';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '조철익', '이사', '설계팀', '01077334586', 'cci@dmview.co.kr', '근무처 팩스: 070-5029-3234'
FROM accounts
WHERE name = 'DMVIEW';
