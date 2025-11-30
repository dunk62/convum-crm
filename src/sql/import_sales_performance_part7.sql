-- Part 7 of Contact Import (mapped to sales_performance filenames)

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '서정환', '부장', '기술영업부', '01084108010', 'alltech@hanmail.net', '근무처 팩스: 055-329-3220'
FROM accounts
WHERE name = '올텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '서진효', '울산본사', '기술영업부', '01064751630', 'jhseo@sammico.co.kr', '근무처 팩스: 052-281-7848'
FROM accounts
WHERE name = '삼미기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '서효창', '주임', 'AE사업부 설계기술그룹', '01037280810', 'hcseo@avaco.com', '근무처 팩스: 053-588-9238'
FROM accounts
WHERE name = 'AVACO';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '서희창', '이사', '생산기술부', '01047594612', 'kjpa@kjpa.co.kr', '근무처 팩스: 054-975-4612'
FROM accounts
WHERE name = '중원기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '석현호', '부장', '설계팀', '01085833763', 'man@hansong.co.kr', '근무처 팩스: 054-462-9932'
FROM accounts
WHERE name = '한송';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '성기호', '과장', NULL, '01094429770', 'world-eng@daum.net', '근무처 팩스: 054-976-1622'
FROM accounts
WHERE name = '월드이엔지';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '성병일', '대표', NULL, '01038247441', 'irueng@naver.com', '근무처 팩스: 053-592-5806'
FROM accounts
WHERE name = '이루F.A시스템';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '성병화', '차장', '제조/기술본부 / 김천공장 생산1팀 / 전자', '01026627654', 'byunghwa.sung@doosan.com', '근무처 팩스: 054-420-8199'
FROM accounts
WHERE name = '두산';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '성우하이텍 최종권매니저', '매니저', '보전2팀', '01033908278', 'dongkwonchoi@swhitech.com', NULL
FROM accounts
WHERE name = '성우하디텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '성진우', '대리', '물류사업부', '01074424613', 'sst1717@hanmail.net', '근무처 팩스: 054-472-1718'
FROM accounts
WHERE name = '신생테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '세광F·ASYSTEM 김병기 과장', '과장', NULL, '01045115426', 'skfa1212@naver.com', NULL
FROM accounts
WHERE name = '세광F·A SYSTEM';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '손강영', '상무이사', '경영조정실', '01035419034', 'sky1017@sunstat.com', '근무처 팩스: 051-720-7501'
FROM accounts
WHERE name = 'SUNJE';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '손기윤', '대리', '기술연구소', '01093808309', 'sku@addtec.co.kr', '근무처 팩스: 02-6670-9510'
FROM accounts
WHERE name = '애드테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '손도호', '부장', NULL, '01065095205', 'eraesys@chol.com', '근무처 팩스: 054-475-5220'
FROM accounts
WHERE name = '이래 KOREA';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '손병희', '차장', 'PO Module 기술팀', '01084428288', 'indy33@lgdisplay.com', '근무처 팩스: 054-717-0909'
FROM accounts
WHERE name = 'LG디스플레이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '손영락', '대표이사', NULL, '01038059048', 'hyundai-fa@hanmail.net', '근무처 팩스: 054-471-4751'
FROM accounts
WHERE name = '현대FA';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '손제원', '선임', '구매Gr', '01093565459', 'jwson@avaco.com', '근무처 팩스: 053-588-9209'
FROM accounts
WHERE name = 'AVACO';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '손호영', '주임', '구매팀', '01047559496', 'ibis-99@hanmail.net', '근무처 팩스: 054-473-4369'
FROM accounts
WHERE name = '아이비스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '송광영', '팀장', '모듈장비기술팀', '01038876682', 'kwangyoung.song@hanwha-qcells.com', '근무처 팩스: 043-880-2681'
FROM accounts
WHERE name = '한화큐셀&첨단소재';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '송민석', '책임', '기구설계팀', '01077704120', 'sms77@motfa.com', '근무처 팩스: 055-375-6227'
FROM accounts
WHERE name = '엠오티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '송승목', '과장', '솔라모듈장비팀 / 공정장비센터 / 사업본부', '01034856891', 'seungmok@hanwha.com', NULL
FROM accounts
WHERE name = '한화/기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '송우근', '대표', NULL, '01038519750', 'youngjin09233@hanmail.net', '근무처 팩스: 052-286-9393'
FROM accounts
WHERE name = '영진테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '송원도', '차장', '기술팀', '01093065097', 'wondo.song@jscoltd.com', '근무처 팩스: 054-471-0729'
FROM accounts
WHERE name = '제이에스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '송재무', '부장', '설계팀', '0177881318', 'song1972@global-tec.co.kr', '근무처 팩스: 054-472-0805'
FROM accounts
WHERE name = '글로벌텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '송재식', '차장', '로봇자동화사업부', '01063009173', 'ellong1225@hcnc.co.kr', NULL
FROM accounts
WHERE name = '에이치씨엔씨';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '송준호', '차장', '제어개발부', '01035137686', 'jhsong@ekdm.co.kr', '근무처 팩스: 054-977-5214'
FROM accounts
WHERE name = 'KDM INTERNATIONAL';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '송지운', '과장', '기술설계팀', '01023718622', 'hanagns@hanagns.com', '근무처 팩스: 055-274-8247'
FROM accounts
WHERE name = '하나지앤에스 판금자동화시스템';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '송현윤주태', '이사', '영업', '01074260029', 'yjt@kccpr.com', '근무처 팩스: 051-316-3857'
FROM accounts
WHERE name = '케이시시정공';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '송화섭', '책임연구원', NULL, '01033947799', 'hs.song@dyto.co.kr', '근무처 팩스: 02-2098-9820'
FROM accounts
WHERE name = '디와이티오코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '신갑주', '상무', '생산본부', '01096009104', 'shin.kabjoo@hd.com', NULL
FROM accounts
WHERE name = 'HD현대에너지솔루션';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '신강석', '사원', 'SE모듈장비팀 / SE사업부', '01093044204', 'gsshin@hanwha.com', NULL
FROM accounts
WHERE name = '한화/모멘텀';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '신광환', '주임', '설계팀', '01092594159', 'kwanghwan.shin@daejinmc.com', '근무처 팩스: 054-463-1465'
FROM accounts
WHERE name = '대진기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '신동출', '이사', '영업관리', '01046888902', 'sdc3350@naver.com', '근무처 팩스: 053-353-7503'
FROM accounts
WHERE name = '씨디씨뉴매틱';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '신동현', '본부장', '기계사업부 / 부산영업본부', '01031435118', 'dhshin@daesung.co.kr', '근무처 팩스: 070-4360-3711'
FROM accounts
WHERE name = '대성산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '신명동', '파트장', 'PRI 패키지기술팀', '01042888971', 'myungdong.shin@lge.com', NULL
FROM accounts
WHERE name = 'LG Electronics';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '신문수', '대표', NULL, '01024102593', 'ats2593@naver.com', '근무처 팩스: 041-411-1067'
FROM accounts
WHERE name = 'AT솔루션';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '신성근', '과장', NULL, '01072448220', 'ssg@finetech-eng.net', '근무처 팩스: 054-716-2071'
FROM accounts
WHERE name = '파인텍 엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '신용광', '전임연구원', NULL, '01029017233', 'syk83@kccpr.com', '근무처 팩스: 053-586-4138'
FROM accounts
WHERE name = '케이시시정공';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '신인범', '부장', '설계부', '01073021781', 'shininbum@gmail.com', '근무처 팩스: 054-715-7101'
FROM accounts
WHERE name = '트리엔';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '신종훈', '과장', '생산지원실 김해공장 생산팀', '01085315937', 'newapollo2@hsep.com', '근무처 팩스: 055-333-3339'
FROM accounts
WHERE name = '한성기업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '신준영', '아태지역 영업총괄 매니저', NULL, '01079262703', 'sinclairshin@minivalve.com', NULL
FROM accounts
WHERE name = '미니밸브 인터내셔날 유한회사';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '신현덕', '차장', '기술부', '01093713079', 'langlih@younghoeng.co.kr', '근무처 팩스: 054-418-6871'
FROM accounts
WHERE name = '영호엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '심규득', '이사', '기술영업부', '01039060771', 'alltech@hanmail.net', '근무처 팩스: 055-329-3220'
FROM accounts
WHERE name = '올텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '심길홍', '기사', '생산본부 / 생산기술팀', '01098189112', 'myskh1223@wamc.co.kr', '근무처 팩스: 053-856-9113'
FROM accounts
WHERE name = '아진산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '심성우', '사원', '구매팀', '01052998314', 'tlatjddn@autotec.co.kr', '근무처 팩스: 052-923-4766'
FROM accounts
WHERE name = '오토텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '심성웅', '과장', '구매팀', '01050647840', 'sung7840@aegissystem.co.kr', '근무처 팩스: 054-461-2212'
FROM accounts
WHERE name = 'AEGIS SYSTEM';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '심용섭', '차장', '영업본부 / 영업개발1팀', '01074590112', 'yongseop@tanhay.com', '근무처 팩스: 053-381-4085'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '안대헌', '차장', '구미지사', '01034632632', 'andea22@systemrnd.com', '근무처 팩스: 031-353-2647'
FROM accounts
WHERE name = '시스템알앤디';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '안명수', '대표이사 / 사장', NULL, '01037370066', 'msahn@yu-han.co.kr', '근무처 팩스: 02-2635-5149'
FROM accounts
WHERE name = '유한메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '안상도', '차장', 'FA영업팀 / 조립설비', '01048167615', 'sd.an@hyundai-wia.com', '근무처 팩스: 055-210-9828'
FROM accounts
WHERE name = '현대위아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '안수열', '대표', NULL, '01020562188', 'wspmt@hanmail.net', '근무처 팩스: 053-351-2189'
FROM accounts
WHERE name = '우성피엠티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '안인주', '대리', 'Fluid & Motion Control', '01022134308', 'Inju.An@Emerson.com', '근무처 팩스: 031-8034-0814'
FROM accounts
WHERE name = '한국에머슨';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '안종범', '경영지원팀장 / 차장', NULL, '01041750959', 'marlboro8010@nate.com', '근무처 팩스: 054-462-8675'
FROM accounts
WHERE name = '브이엔에스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '안종식', '과장', '영업부', '01020250993', 'jsahn@yu-han.co.kr', '근무처 팩스: 02-2635-5149'
FROM accounts
WHERE name = '유한메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '안창근', '과장', NULL, '01021882183', 'acg@tyi.kr', '근무처 팩스: 052-269-3639'
FROM accounts
WHERE name = '태양산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '안창수', '차장', '생산/생관팀', '01020658338', 'iltop12@hanmail.net', '근무처 팩스: 054-773-4101'
FROM accounts
WHERE name = '영풍기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '양승철', '부사장', NULL, '01023277021', 'scyang@sunvitech.com', '근무처 팩스: 053-582-5879'
FROM accounts
WHERE name = '선비테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '양용건', NULL, '설계실', '01045613593', 'yong727z@naver.com', '근무처 팩스: 053-269-8999'
FROM accounts
WHERE name = '엘피티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '양정용', '과장', '기구개발팀', '01098338480', 'jy@gpico.co.kr', '근무처 팩스: 055-912-7056'
FROM accounts
WHERE name = '지피아이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '양종호', '대표', NULL, '01093285405', 'freegunman@hanmail.net', '근무처 팩스: 051-319-1532'
FROM accounts
WHERE name = '효린테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '어철성', '본부장', '김해지역영업본부', '01047479594', 'chulsung.eo@wjpim.com', '근무처 팩스: 051-831-3590'
FROM accounts
WHERE name = '우진플라임';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '엄경록', '대리', '설계', '01025491719', 'imi9070@naver.com', '근무처 팩스: 052-239-9070'
FROM accounts
WHERE name = '아이엠 인더스트리';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '엄맹용', '과장', '기구개발팀', '01038762894', 'emyy@gpico.co.kr', '근무처 팩스: 055-912-7056'
FROM accounts
WHERE name = '지피아이';
