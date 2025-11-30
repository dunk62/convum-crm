-- Part 4 of Contact Import (mapped to sales_performance filenames)

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김창섭', '차장', NULL, '01054497108', 'digitak@chol.com', '근무처 팩스: 054-931-9197'
FROM accounts
WHERE name = '디지텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김창섭', '차장', NULL, '01045386317', 'dongnam2001k@naver.com', '근무처 팩스: 051-327-1158'
FROM accounts
WHERE name = '동남산전상사';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김창열', '전무이사 / 본부장', '영업본부', '01052455515', 'changyul@tanhay.com', '근무처 팩스: 032-578-0786'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김창호', '차장', '구매부', '01080120350', 'changho.kim@3tst.co.kr', '근무처 팩스: 054-471-5696'
FROM accounts
WHERE name = '티에스티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김창훈', '대리', '연구1팀', '01093810723', 'kch@ti-k.co.kr', '근무처 팩스: 054-474-6374'
FROM accounts
WHERE name = '티아이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김태섭', '과장', '기술연구소', '01026093106', 'colla500@naver.com', '근무처 팩스: 031-8041-3421'
FROM accounts
WHERE name = '아이엠';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김태엽', '대리', 'AA사업본부 / 영업5팀 / 부산사무소', '01026034481', 't.kim.xd@kr.azbil.com', '근무처 팩스: 051-714-5746'
FROM accounts
WHERE name = '한국아즈빌';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김태엽', '사원', '기계사업부 / 대구영업소', '01046189343', 'tykim@daesung.co.kr', '근무처 팩스: 053-354-5846'
FROM accounts
WHERE name = '대성산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김태완', '과장', '영업부', '01088962912', 'twkim@keyplus21.com', '근무처 팩스: 041-544-8583'
FROM accounts
WHERE name = '키플러스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김태우', '차장', NULL, '01054344377', 'syfnt@naver.com', '근무처 팩스: 055-276-7753'
FROM accounts
WHERE name = '신영에프앤티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김태욱', '과장', '솔라모듈장비팀 / 공정장비센터', '01040937004', 'tukim82@hanwha.com', '근무처 팩스: 041-538-4999'
FROM accounts
WHERE name = '한화/기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김태윤', '매니저', '영업본부 / 고객만족팀', '01099954862', 'taeyoon2@tanhay.com', '근무처 팩스: 070-4332-1588'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김태혁', '과장', NULL, '01075330262', 'samjungrobotics@naver.com', '근무처 팩스: 055-294-0476'
FROM accounts
WHERE name = '삼정로보틱스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김태현', '대표이사', NULL, '01030391212', 'kth3039@naver.com', '근무처 팩스: 053-356-1130'
FROM accounts
WHERE name = '세광F·A SYSTEM';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김태현', '부장', '생산기술팀', '01077710221', 'alluky@naver.com', '근무처 팩스: 054-476-1071'
FROM accounts
WHERE name = '아라테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김태홍', '주임', '설계개발팀', '01045361328', 'dnhtech@daum.net', '근무처 팩스: 054-473-3384'
FROM accounts
WHERE name = '디엔에이치테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김판중', '과장', NULL, '01046290340', 'dk9817@dkautomation.co.kr', '근무처 팩스: 063-857-9918'
FROM accounts
WHERE name = '디케이 오토메이션';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김한주', '부장', NULL, '01024346676', 'hanjoo1122@naver.com', '근무처 팩스: 054-473-9633'
FROM accounts
WHERE name = '한영테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김해성', '과장', '구매생산부', '01065823338', 'kimhaesung@tecc.co.kr', '근무처 팩스: 053-321-4298'
FROM accounts
WHERE name = '티이씨씨';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김현근', '대리', NULL, '01033714644', 'dongyang0582@hanmail.net', '근무처 팩스: 051-316-0584'
FROM accounts
WHERE name = '동양콘트롤';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김현수', '과장', '대구영업소', '01099504553', 'jrtmt@jrtfa.com', NULL
FROM accounts
WHERE name = '주강로보테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김현욱', '부장', '기계팀', '01038068333', 'irueng@naver.com', '근무처 팩스: 053-592-5806'
FROM accounts
WHERE name = '이루F.A시스템';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김현태', '대리', '공정기술실', '01062103060', 'hyuntae.kim@donghee.co.kr', '근무처 팩스: 054-434-1940'
FROM accounts
WHERE name = '동희산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김현호', '팀장 / 경제학 박사', '외주구매팀 / 경영지원실', '01047422969', 'd9941570@hanwha.com', '근무처 팩스: 055-280-8998'
FROM accounts
WHERE name = '한화/모멘텀';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김형섭', '차장', '공정기술팀', '01048803134', 'hskim1@ms-global.com', '근무처 팩스: 054-746-6220'
FROM accounts
WHERE name = '명신산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김호용', '계장', 'NB(New Business) Team / 설계 · 기술부', '01085399415', 'Horyong.Kim@ap.sony.com', '근무처 팩스: 055-250-0892'
FROM accounts
WHERE name = '한국소니전자';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김화동', '대표이사', NULL, '01035280591', 'sales@cdcpneumatics.com', '근무처 팩스: 053-353-7503'
FROM accounts
WHERE name = '씨디씨뉴매틱';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김효주', '대표이사', NULL, '01038302462', 'asura079@naver.com', NULL
FROM accounts
WHERE name = 'MoDULUS';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김희홍', '차장', NULL, '01094552955', 'ddoochi2k@naver.com', '근무처 팩스: 055-607-0838'
FROM accounts
WHERE name = '우리기술';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '남궁준', '부장 / Senior Engineer', '연구소', '01082606390', 'junenk@pmccorp.kr', NULL
FROM accounts
WHERE name = '피엠씨';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '남상호', '대리', 'AE사업부 설계기술그룹', '01092394480', 'nsh@avaco.com', '근무처 팩스: 053-588-9209'
FROM accounts
WHERE name = 'AVACO';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '남수혁', '운영본부장 / Ops & Site Director', 'Discrete Automation', '01093404103', 'sooheoq.nam@emrson.com', '근무처 팩스: 051-265-0061'
FROM accounts
WHERE name = '에머슨 오토메이션 솔루션즈';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '남오성', '대표', NULL, '01050510033', 'wonfa01@naver.com', '근무처 팩스: 055-288-1757'
FROM accounts
WHERE name = '원에프에이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '남우준', '주임', '구매팀', '01041852745', 'nwj@gpi-korea.co.kr', '근무처 팩스: 052-943-7057'
FROM accounts
WHERE name = 'Gpi';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '남재혁', '부장', '부산영업소', '01085372360', 'jrtbu@jrtfa.com', NULL
FROM accounts
WHERE name = '주강로보테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '남태중', '과장', '설계팀', '01042075479', 'cyberntj@naver.com', '근무처 팩스: 054-476-1605'
FROM accounts
WHERE name = '한울MTS';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '남학수', '차장', '생산기술팀', '01068047977', 'howard@slworld.com', '근무처 팩스: 053-380-8518'
FROM accounts
WHERE name = 'SL Lighting';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '노민영', '차장', '영업본부 / 기술영업팀', '01093234684', 'minyno@tanhay.com', '근무처 팩스: 052-260-2548'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '노성훈', '연구소장 / 공학박사', '기술연구소', '01048417913', 'wonjd@daum.net', '근무처 팩스: 055-723-3571'
FROM accounts
WHERE name = '영창로보테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '노종필', '과장', '영업팀', '01092404777', 'njp0411@toptec.co.kr', '근무처 팩스: 041-629-3501'
FROM accounts
WHERE name = '톱텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '노충효', NULL, NULL, '01092763851', 'pnmco@naver.com', '근무처 팩스: 055-586-3233'
FROM accounts
WHERE name = '피엔엠';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '노태진', '사원', '부산영업소', '01028680060', 'tjnoh@daesung.co.kr', '근무처 팩스: 051-831-4046'
FROM accounts
WHERE name = '대성산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '노학명', '과장', '구매팀', '01042234986', 'nhm1211@systemrnd.com', '근무처 팩스: 031-353-2647'
FROM accounts
WHERE name = '시스템알앤디';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '도제홍', '차장', '기술부', '01063643665', 'jhdo@robot-info.co.kr', '근무처 팩스: 053-588-3130'
FROM accounts
WHERE name = '로봇인포';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '류광영', '부장', '기계설계팀', '01050257300', 'jeil@jeilmach.com', '근무처 팩스: 054-773-3464'
FROM accounts
WHERE name = '제일기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '류성호', '대리', '보전 1팀', '01092291743', 'silver3109@swhitech.com', '근무처 팩스: 055-366-5656'
FROM accounts
WHERE name = '성우하이텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '류종수', NULL, '영업본부 / 부산영업소', '01071202767', 'rjs@tanhay.com', '근무처 팩스: 051-312-8553'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '류해창', '연구원', 'PRI 모듈장비ED / PRI 본딩 / 라미장비기술팀', '01088751669', 'haechang.ryu@lge.com', NULL
FROM accounts
WHERE name = 'LG전자';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '류헌필', '부장', NULL, '01083223174', 'ryu6418@naver.com', '근무처 팩스: 051-319-2519'
FROM accounts
WHERE name = '엠에스자동화';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '류현재', '선임연구원', 'SE 사업부', '0118078951', 'shain79@avaco.co.kr', '근무처 팩스: 053-588-9209'
FROM accounts
WHERE name = '아바코';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '류형근', '책임연구원', '설계2팀', '01094344587', 'hgryu@topengnet.com', '근무처 팩스: 054-482-0346'
FROM accounts
WHERE name = '탑엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '마청운', '과장', '제어팀', '01050359066', 'mcw@hansong.co.kr', '근무처 팩스: 054-462-9932'
FROM accounts
WHERE name = '한송';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '문민영', '영업소장', '광주영업소 / 영업본부', '01052462992', 'mymoon@tanhay.com', '근무처 팩스: 062-955-2997'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '문석호', '프로', '외주구매관리팀 / 장비개발센터 / 큐셀 부문', '01025819611', 'sh.moon@qcells.com', NULL
FROM accounts
WHERE name = '한화솔루션';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '문선중', '본부장', 'Robot 본부', '01035881975', 'max.moon@daskorea.co.kr', NULL
FROM accounts
WHERE name = '다스코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '문영기', '부장', NULL, '01090147441', 'insung00@chol.com', '근무처 팩스: 052-294-4824'
FROM accounts
WHERE name = '인성기공';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '문영민', '대리', '기술영업부', '01067081727', 'alltech@hanmail.net', '근무처 팩스: 055-329-3220'
FROM accounts
WHERE name = '올텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '문윤주', '대표', NULL, '01085318787', 'srico@hanmail.net', '근무처 팩스: 051-319-0449'
FROM accounts
WHERE name = '성림산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '문일수', '부장', '기술연구소', '01085310332', 'ismoon@hnkkorea.com', '근무처 팩스: 055-582-2153'
FROM accounts
WHERE name = '한국정밀기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '문해리', '책임 / Key Supply Manager', 'Discrete Automation', '01030804080', 'haeri.moon@emerson.com', '근무처 팩스: 051-265-0061'
FROM accounts
WHERE name = '아벤틱스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '민성준', '차장', '생산기술팀', '01025549151', 'ara_minsj@naver.com', '근무처 팩스: 054-476-1071'
FROM accounts
WHERE name = '아라테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '민응식', '대표', NULL, '01025811897', 'minykys@naver.com', '근무처 팩스: 051-941-5296'
FROM accounts
WHERE name = 'KM ENG';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '민현기', '차장', '영업부', '01094834833', 'hk_min@sungjoon.co.kr', '근무처 팩스: 031-376-6448'
FROM accounts
WHERE name = '성준전기';
