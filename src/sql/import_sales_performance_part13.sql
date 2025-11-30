-- Part 13 of Contact Import (mapped to sales_performance filenames)

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '조필규', '대리', NULL, '01095115522', 'daeacopo@hanmail.net', '근무처 팩스: 053-588-9736'
FROM accounts
WHERE name = '대아코포레이숀';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '조하식', '프로', '구매팀', '01096684494', 'hasik.cho@qcells.com', NULL
FROM accounts
WHERE name = '한화큐셀';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '조한주', '부장', '기술설계팀', '01048422246', 'hanagns@hanagns.com', '근무처 팩스: 055-274-8247'
FROM accounts
WHERE name = '하나지앤에스 판금자동화시스템';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '조한진', '대리', '설계팀', '01048060060', 'kallin@global-tec.co.kr', '근무처 팩스: 054-472-0805'
FROM accounts
WHERE name = '글로벌텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '조현성', '사원', '설계1팀', '01057796188', 'tst4312@naver.com', '근무처 팩스: 054-471-5696'
FROM accounts
WHERE name = '티에스티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '주경진', '차장', '제조기술본부 생산기술부문 시작보전팀', '01045519430', 'kjjoo@ck-korea.co.kr', '근무처 팩스: 055-340-1196'
FROM accounts
WHERE name = '칼소닉칸세이코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '주동석', '기술이사', NULL, '01045588752', 'kelinc@hanmail.net', '근무처 팩스: 051-303-8295'
FROM accounts
WHERE name = '케이이엘';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '주병선', '과장', '반도체 사업부', '01088802727', 'pk@phloxkorea.com', '근무처 팩스: 031-314-7379'
FROM accounts
WHERE name = '프록스코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '주시온', '매니저', '생산기술팀', '01053124836', 'sion97@guyoungtech.com', '근무처 팩스: 053-592-6567'
FROM accounts
WHERE name = '구영테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '주형건', 'GMP', '생산2부', '01062662264', NULL, '근무처 팩스: 055-371-1046'
FROM accounts
WHERE name = '천호식품';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '지상봉', '대표', NULL, '01039132090', NULL, '근무처 팩스: 054-977-2848'
FROM accounts
WHERE name = 'BONG TECH';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '지창헌', '선임', '영업본부 기술영업2팀', '01085000079', 'jich@tanhay.com', '근무처 팩스: 051-312-8553'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '진근춘', '기술영업과장', NULL, '01038227425', 'master@jeesang.co.kr', '근무처 팩스: 054-462-0600'
FROM accounts
WHERE name = '지상뉴매틱';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '진상호', '대리', '생산기술팀', '01048537234', 'free7234@sjku.co.kr', '근무처 팩스: 052-287-7815'
FROM accounts
WHERE name = 'SEJONG';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '진성욱', '대표', NULL, '01065040324', 'samson74@daum.net', '근무처 팩스: 054-462-7108'
FROM accounts
WHERE name = '위드테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '진승준', '대리', '구매관리팀', '01038640758', 'sjjin@shym.co.kr', '근무처 팩스: 054-335-1311'
FROM accounts
WHERE name = '신영';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '진영근', '대표', NULL, '01055506334', 'jygb7952@hanmail.net', '근무처 팩스: 054-443-7953'
FROM accounts
WHERE name = '지우테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '진현수', '책임 / Project Manager', 'Discrete Automation', '01028793077', 'hyunsoo.jin@emerson.com', '근무처 팩스: 051-265-0061'
FROM accounts
WHERE name = '아벤틱스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '진희두', '부장', '자동화사업부', '01076807400', 'hdjin@vasim.co.kr', NULL
FROM accounts
WHERE name = '바심';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '차명성', '과장', NULL, '01033913803', 'dham@dh-automotion.com', NULL
FROM accounts
WHERE name = 'DH AUTOMOTION';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '차명진', '과장', '경영지원실 / 통합영업구매', '01094653416', 'mj.cha@sammico.com', '근무처 팩스: 052-298-2316'
FROM accounts
WHERE name = '삼미정공';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '차원우', '대표', NULL, '01030435445', 'ilsungtech@empal.com', '근무처 팩스: 055-238-1173'
FROM accounts
WHERE name = '일성테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '차정혁', '과장', 'FAV구매팀', '01076676823', 'jhcha@gomotec.com', NULL
FROM accounts
WHERE name = '고모텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '차필기', '차장', '기구개발팀', '01093407578', 'cpgpi@gpico.co.kr', '근무처 팩스: 055-912-7056'
FROM accounts
WHERE name = '지피아이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '채종훈', '이사', '기술영업팀', '01075925543', 'cjh@protec21.co.kr', '근무처 팩스: 032-822-9182'
FROM accounts
WHERE name = '피앤엠';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '천영욱', '부장', '기술설계부', '01026369041', 'ywcheon@bldo.co.kr', '근무처 팩스: 070-8877-1203'
FROM accounts
WHERE name = '비엘두';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '천재훈', '주임', '구매부', '01071747874', 'younghofa@hanmail.net', '근무처 팩스: 054-715-6828'
FROM accounts
WHERE name = '영호엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '천현창', 'Staff Engineer', NULL, '0519709702', 'hyunchang.chun@samsung.com', NULL
FROM accounts
WHERE name = '삼성전기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '최곡지', '부장', '경영기획', '01095941285', 'ckj1285@convum.co.kr', '근무처 팩스: 02-6111-8006'
FROM accounts
WHERE name = '컨범 코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '최기호', '과장', '설계팀', '01085711588', 'cgh@hansong.co.kr', '근무처 팩스: 054-462-9932'
FROM accounts
WHERE name = '한송';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '최동석', '대표이사', NULL, '01020143900', 'prosis@e-prosis.co.kr', '근무처 팩스: 031-378-6561'
FROM accounts
WHERE name = '프로시스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '최두현', '차장', '자동화팀', '01027747260', 'dh.choi@tk.t2group.co.kr', '근무처 팩스: 055-330-1699'
FROM accounts
WHERE name = '태광실업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '최민규', '센터장', '영업본부 창원Solution Center', '01028058520', 'minkyu@tanhay.com', '근무처 팩스: 055-283-8502'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '최병삼', '부장', NULL, '01025355320', 'eyekiss925@naver.com', '근무처 팩스: 052-227-8436'
FROM accounts
WHERE name = '금화상사';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '최병식', '사원', '생산기술실', '01057121287', 'byeongsik.choi@webastodonghee.com', '근무처 팩스: 052-257-0171'
FROM accounts
WHERE name = '베바스토 동희';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '최성호', '상무이사', '기술영업부', '01033737993', 'ava@avao.co.kr', '근무처 팩스: 055-382-0310'
FROM accounts
WHERE name = '아바';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '최수', '대리', '울산영업소', '01048540485', '8209choi@hanmail.net', '근무처 팩스: 052-265-1810'
FROM accounts
WHERE name = '이화유공압';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '최수영', '부장', NULL, '01087680485', '8209choi@hanmail.net', '근무처 팩스: 052-265-1810'
FROM accounts
WHERE name = '이화유공압';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '최영록', '대리', '생산개발본부 / 차량생기1팀', '01030682600', 'eins2@hyundai.com', '근무처 팩스: 052-280-7431'
FROM accounts
WHERE name = '현대자동차그룹';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '최영웅', '과장', 'FA사업부 / M-설계팀', '01025420637', 'youngwong0637@thtech1.com', '근무처 팩스: 055-253-8407'
FROM accounts
WHERE name = '태현테크원';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '최영주', '차장', '영업부', '01076407171', 'rkeld@pranasolution.co.kr', '근무처 팩스: 050-5300-2376'
FROM accounts
WHERE name = '프라나솔루션';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '최영환', '과장', '설계실', '01038839421', 'hd@hyunduk.or.kr', '근무처 팩스: 052-261-3449'
FROM accounts
WHERE name = '현덕산기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '최영효', NULL, '부산지사 / 영업지원', '01045999042', 'nadudgy@naver.com', '근무처 팩스: 051-316-3857'
FROM accounts
WHERE name = '케이시시정공';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '최우석', '대표', NULL, '01048514005', 'chois515@naver.com', '근무처 팩스: 050-4264-4005'
FROM accounts
WHERE name = '씨엔테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '최웅진', NULL, '보전5부', '0118894946', '9924927@hyundai.com', '근무처 팩스: 052-280-8832'
FROM accounts
WHERE name = '현대자동차';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '최원석', '선임연구원', '자동화담당 본딩 / 가공장비개발팀', '01055855844', 'wonseok.choi@lge.com', '근무처 팩스: 031-8054-2384'
FROM accounts
WHERE name = 'LG생산기술원';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '최원영', '대표이사', NULL, '01045871542', 'skytech7@daum.net', '근무처 팩스: 055-374-1549'
FROM accounts
WHERE name = '스카이테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '최윤하', '대리', '영업본부 / 울산영업소', '01035703122', 'ghchoi@tanhay.com', '근무처 팩스: 052-260-2549'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '최종환', '대리', '기술영업팀', '01099881126', 'wspmt@hanmail.net', '근무처 팩스: 053-351-2189'
FROM accounts
WHERE name = '우성피엠티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '최주형', '선임연구원', 'H&A사업본부 / H&A공통기술2팀', '01052912218', 'juhyung.choi@lge.com', NULL
FROM accounts
WHERE name = 'LG전자';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '최준영', '과장', '경영지원팀', '01038041611', 'kent99@nate.com', '근무처 팩스: 054-462-8675'
FROM accounts
WHERE name = '브이엔에스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '최준형', '부장', '생산기술부', '01099422042', 'choijunhyoung@bldo.co.kr', '근무처 팩스: 070-8877-1203'
FROM accounts
WHERE name = '비엘두';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '최준희', NULL, '영업본부 / 창원영업소', '01065576223', 'cjhsha2005@tanhay.com', '근무처 팩스: 055-283-8502'
FROM accounts
WHERE name = 'TPC MOTION';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '최화목', '차장', '본사 / PG사업부', '01048282168', 'hmchoi@yesemk.com', '근무처 팩스: 055-211-9860'
FROM accounts
WHERE name = '이엠코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '탁현열', '과장', 'SE모듈장비팀 / SE사업부', '01053589916', 'takhy@hanwha.com', NULL
FROM accounts
WHERE name = '한화';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '탁현호', '남부영업소장', NULL, '01049818390', 'thh0222@convum.co.kr', '근무처 팩스: 051-987-2352'
FROM accounts
WHERE name = '컨범코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '편도천', '기감', 'SLF생산그룹', '01035987426', 'dochuen.pyen@haesungds.net', '근무처 팩스: 070-4761-0318'
FROM accounts
WHERE name = '해성디에스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '표지수', '대리', NULL, '01089311643', 'pyojs@novainc.co.kr', '근무처 팩스: 054-475-2536'
FROM accounts
WHERE name = '노바';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '푸르밀 박기준대리', '대리', '대구공장 생산팀', '01092877645', 'joon011@purmil.co.kr', '근무처 팩스: 053-614-8882'
FROM accounts
WHERE name = '푸르밀';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '하종호', '반 장', '보전 1팀', '01049466704', 'ho2002kim@swhitech.com', '근무처 팩스: 055-366-5656'
FROM accounts
WHERE name = '성우하이텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '하태수', '대리', '자동화팀', '01085511417', 'ts.ha@tk.t2group.co.kr', '근무처 팩스: 055-330-1699'
FROM accounts
WHERE name = '태광실업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '한광수', '팀장', '스마트시스템개발부 / RV솔루션팀', '01036658049', 'gshan@autoconsystem.co.kr', NULL
FROM accounts
WHERE name = '오토콘시스템';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '한민호', '이사', NULL, '01090604413', 'hmh@izi.co.kr', '근무처 팩스: 051-793-0638'
FROM accounts
WHERE name = '이지테크윈';
