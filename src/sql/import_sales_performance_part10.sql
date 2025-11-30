-- Part 10 of Contact Import (mapped to sales_performance filenames)

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이영수', '선임연구원', '기술연구소', '01025208813', 'yslee007@coretechsys.co.kr', '근무처 팩스: 054-975-3147'
FROM accounts
WHERE name = '코아테크시스템';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이영우', '부장', '영업관리부', '01035568234', 'dd2358@naver.com', '근무처 팩스: 051-317-2360'
FROM accounts
WHERE name = '대동유공압';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이영재', '대리', '영업본부 / 대구영업소', '01051124115', 'lyj85@tanhay.com', '근무처 팩스: 053-381-4085'
FROM accounts
WHERE name = 'TPC MOTION';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이용명', '기술선임 / 기술그룹장', '설비관리4부', '01085437119', 'hd7119@hyundai.com', NULL
FROM accounts
WHERE name = 'Hyundai Motor Company';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이용석', '과장', '기계사업부 / 부산영업소', '01025633042', 'ysjy02@daesung.co.kr', '근무처 팩스: 051-831-4046'
FROM accounts
WHERE name = '대성산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이용신', '팀장', '기술개발부 설계팀', '01045037883', 'leeys@daeji.com', '근무처 팩스: 053-582-1614'
FROM accounts
WHERE name = '대지메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이용호', '상무', NULL, '01038344285', 'erkorea119@naver.com', '근무처 팩스: 055-802-8587'
FROM accounts
WHERE name = '이알';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이우석', '프로', '설비구매 / P&A실 / 전략부문', '01089561230', 'wooseok.lee1@hanwha.com', NULL
FROM accounts
WHERE name = '한화솔루션';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이우성', '선임연구원', 'FAS 사업부', '01022828460', 'woosung@avaco.co.kr', '근무처 팩스: 053-588-9209'
FROM accounts
WHERE name = '아바코';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이우승', '대표', NULL, '01041687753', 'spatec@hanmail.net', '근무처 팩스: 055-312-7754'
FROM accounts
WHERE name = 'SPATEC VACUUM TECHNOLOGY';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이우영', '대표', NULL, '01076190023', 'dooyoung0023@naver.com', '근무처 팩스: 054-742-7442'
FROM accounts
WHERE name = '두영기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이우철', '팀장', '기구설계팀', '01085266830', 'lwc1975@motfa.com', '근무처 팩스: 055-375-6227'
FROM accounts
WHERE name = '엠오티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이원진', 'Founder', NULL, '01058050138', 'velonetic@velonetic.co.kr', NULL
FROM accounts
WHERE name = 'VELONETIC';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이유림', '매니저', '경영기획부', '01086696406', 'lym6406@convum.co.kr', '근무처 팩스: 02-6111-8006'
FROM accounts
WHERE name = '컨범코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이율재', '본부장', '영업부', '01088038101', 'yj_lee@sungjoon.co.kr', '근무처 팩스: 031-376-6448'
FROM accounts
WHERE name = '성준전기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이은실', '팀장', '영업관리', '01050361384', 'les7729@convum.co.kr', '근무처 팩스: 070-8668-2405'
FROM accounts
WHERE name = '컨범 코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이응석', '부장', '생산지원팀', '01195847399', '2001kdm@hanmail.net', '근무처 팩스: 054-977-5214'
FROM accounts
WHERE name = 'K.D.M';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이인노', '책임연구원', '기구설계', '01057973497', 'in.lee@ateco.co.kr', '근무처 팩스: 031-548-1509'
FROM accounts
WHERE name = '아테코';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이재열', '매니저', '도장생산팀 도장보전과', '01063322565', 'ljy2565@myeco.co.kr', '근무처 팩스: 054-771-3102'
FROM accounts
WHERE name = '에코플라스틱';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이재운', '부장', '설계팀', '01075203116', 'sunvi@sunvitech.com', '근무처 팩스: 053-582-5879'
FROM accounts
WHERE name = 'SUNVI TECH';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이재원', '사원', '고객지원팀 / 공작기계사업부', '01051213341', 'sgwing7@hanwha.com', '근무처 팩스: 055-280-4635'
FROM accounts
WHERE name = '한화정밀기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이재학', '차장', '자동화팀', '01027806245', 'jh.lee2@tk.t2group.co.kr', '근무처 팩스: 055-330-1699'
FROM accounts
WHERE name = '태광실업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이재헌', '부장', '공장자동화', '01087808648', 'jhlee@addfa.co.kr', '근무처 팩스: 041-415-0012'
FROM accounts
WHERE name = '에드파';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이재현', '차장', '영업부', '01085085617', 'jh_lee@sungjoon.co.kr', '근무처 팩스: 031-376-6448'
FROM accounts
WHERE name = '성준전기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이재훈', '사원', 'ME사업부 설계기술Gr', '01029346525', 'gnsdl0081@avaco.com', '근무처 팩스: 053-588-9209'
FROM accounts
WHERE name = 'AVACO';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이정규', '책임매니저', '설비관리4부', '01029477905', 'junggyeu.lee@hyundai.com', '근무처 팩스: 052-215-7421'
FROM accounts
WHERE name = 'Hyundai Motor Company';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이정만', '선임', 'Sella 2 Nonsan Site / Plant Maintenance', '01081080303', 'jungman.lee@solaredge.com', NULL
FROM accounts
WHERE name = '솔라엣지 테크놀로지스 코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이정혁', '부장', '설계기술팀', '01095856020', 'jeonghyuk100@osakorea.com', '근무처 팩스: 054-471-8933'
FROM accounts
WHERE name = '1SA Korea';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이정훈', '대표', NULL, '01085810034', 'twotopfa@daum.net', '근무처 팩스: 054-464-6001'
FROM accounts
WHERE name = '투톱FA';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이제현', '대표', NULL, '01025151069', 'ahyuntech@naver.com', NULL
FROM accounts
WHERE name = '아현테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이종건', '과장', '영업부', '01023128348', 'jg_lee@sungjoon.co.kr', '근무처 팩스: 031-376-6448'
FROM accounts
WHERE name = '성준전기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이종국', '대표', NULL, '01055667932', 'laminox@naver.com', '근무처 팩스: 054-971-4758'
FROM accounts
WHERE name = '신흥';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이종근', '책임', '자동화팀', '01045481663', 'ethan.lee@taekwang.com', NULL
FROM accounts
WHERE name = 'TKG TAEKWANG CO., LTD.';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이종욱', '대리', '생산기술실', '01051954507', 'jwlee12@donghee.co.kr', '근무처 팩스: 052-257-0171'
FROM accounts
WHERE name = '베바스토동희';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이종일', '대표', NULL, '01085543356', NULL, NULL
FROM accounts
WHERE name = '유림기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이주엽', '차장', '생산팀', '01052798448', 'leejy@mopam.co.kr', '근무처 팩스: 052-254-0106'
FROM accounts
WHERE name = 'MOPAM';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이주영', '책임연구원', 'G2팀', '01086657540', 'jylee@topengnet.com', '근무처 팩스: 054-480-0356'
FROM accounts
WHERE name = '탑엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이주원', '소장 / 차장', '모션사업부 / 포항영업소', '01082561229', 'juwon@tanhay.com', '근무처 팩스: 054-274-0784'
FROM accounts
WHERE name = '단해';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이주일', '대표', NULL, '01052131719', 'ilrak79@hanmail.net', '근무처 팩스: 02-3667-6657'
FROM accounts
WHERE name = '에스엠테크코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이주훈', '대리', '기술부', '01097350156', 'younghofa@hanmail.net', '근무처 팩스: 054-715-6828'
FROM accounts
WHERE name = '영호엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이준호', '부장', NULL, '01093323900', 'sungjinfa1@naver.com', '근무처 팩스: 055-237-9851'
FROM accounts
WHERE name = '성진자동화';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이중희', '이사', NULL, '01065234854', 'leejh@ost87.co.kr', '근무처 팩스: 053-710-5509'
FROM accounts
WHERE name = '오에스티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이지완', '차장', '기술영업팀', '01033718219', 'jiwan17@protec21.co.kr', '근무처 팩스: 032-822-9182'
FROM accounts
WHERE name = '피앤엠';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이지원', '대리', NULL, '01084460985', 'ljw501@hanmail.net', '근무처 팩스: 051-310-0153'
FROM accounts
WHERE name = '우신종합상사';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이지원', '과장', '논산)공무팀', '01029401923', 'jw.lee8@cj.net', '근무처 팩스: 041-742-7803'
FROM accounts
WHERE name = 'CJ 제일제당';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이진영', '대표', NULL, '01047178654', 'atc1203@naver.com', NULL
FROM accounts
WHERE name = '에이티씨';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이진우', '상무', NULL, '01022342115', 'bukang0827@hanmail.net', '근무처 팩스: 052-239-8083'
FROM accounts
WHERE name = '부강기업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이진한', '팀장 / 차장', '공압 기술 영업', '01044880780', 'jinhan.lee@aventics.com', '근무처 팩스: 051-265-0061'
FROM accounts
WHERE name = '아벤틱스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이진희', NULL, '영업본부 / 울산영업소', '01050086795', 'jinhee@tanhay.com', '근무처 팩스: 052-260-2549'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이진희', '부장', NULL, '01085713654', 'popoya-76@daum.net', '근무처 팩스: 051-831-3432'
FROM accounts
WHERE name = '드림에프에이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이진희', '과장', '생산기술부 도장기술과', '01054327956', 'pikaso@myeco.co.kr', '근무처 팩스: 054-770-3170'
FROM accounts
WHERE name = '에코플라스틱';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이찬민', '책임매니저', '보전4부', '01027286601', 'silverlh@hyundai.com', NULL
FROM accounts
WHERE name = 'Hyundai Motor Company';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이찬호', '차장', NULL, '01023446336', 'yanchigi3000@naver.com', '근무처 팩스: 052-273-2057'
FROM accounts
WHERE name = '충현';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이창용', '대표', NULL, '01038505437', '2436089@naver.com', '근무처 팩스: 050-2280-6090'
FROM accounts
WHERE name = '대한프로테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이창우', '대표', NULL, '01077147103', 'izi@izi.co.kr', '근무처 팩스: 051-793-0638'
FROM accounts
WHERE name = '이지테크윈';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이철', 'ME Sr. Engineer', 'ME', '01086463438', 'CHUL.LEE@WEBASTO.COM', '근무처 팩스: 052-257-0171'
FROM accounts
WHERE name = '베바스토코리아홀딩스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이태영', '책임', 'HTP 사업부', '01090662900', 'tylee@daehoteck.co.kr', '근무처 팩스: 055-292-0561'
FROM accounts
WHERE name = '대호테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이필원', '사원', '기계사업부/부산영업소', '01093143378', 'pwlee@daesung.co.kr', '근무처 팩스: 051-831-4046'
FROM accounts
WHERE name = '대성산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이하린', '주임', NULL, '01052410026', 'dham@dh-automotion.com', NULL
FROM accounts
WHERE name = 'DH AUTO MOTION';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이학준', NULL, '설계기술 2그룹', '01092991884', 'hjlee4@wonik.com', '근무처 팩스: 043-218-7059'
FROM accounts
WHERE name = '원익피앤이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이한진', '대표', NULL, '01055968110', 'hanjin0151@hanmail.net', '근무처 팩스: 051-310-0153'
FROM accounts
WHERE name = '우신종합상사';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이한진', '과장', 'SE모듈장비팀 / SE센터 / 사업본부', '01056228318', 'yhj2573@hanwha.com', NULL
FROM accounts
WHERE name = '한화/모멘텀';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이현욱', '선임연구원', 'ME사업부 설계기술Gr', '01025441019', 'hr1916@avaco.com', '근무처 팩스: 053-588-9209'
FROM accounts
WHERE name = 'AVACO';
