-- Part 11 of Contact Import (mapped to sales_performance filenames)

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이현철', '부장 / 실장', '기술부', '01089367634', 'younghofa@hanmail.net', '근무처 팩스: 054-715-6858'
FROM accounts
WHERE name = '영호엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이형진', '계장', '영업부', '01039288868', 'hjlee@sdtech.kr', '근무처 팩스: 051-329-7822'
FROM accounts
WHERE name = '에스디티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이호철', '대리', '제조팀', '01029327943', 'dlghcjf86@hansong.co.kr', '근무처 팩스: 054-462-9932'
FROM accounts
WHERE name = '한송';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이화식', '부장', '기획구매관리팀', '01054023425', 'hanagns@hanagns.com', '근무처 팩스: 055-274-8247'
FROM accounts
WHERE name = '하나지앤에스 판금자동화시스템';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이희갑', '차장', '기술부', '01053192792', 'younghofa@hanmail.net', '근무처 팩스: 054-715-6828'
FROM accounts
WHERE name = '영호엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이희걸', '이사', '국내영업본부 남부사업부', '01074260035', 'lhk@kccpr.com', '근무처 팩스: 053-586-4305'
FROM accounts
WHERE name = '케이시시정공';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이희근', '주임', NULL, '01032479654', 'dk9817@dkautomation.co.kr', '근무처 팩스: 063-857-9918'
FROM accounts
WHERE name = '디케이 오토메이션';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이희정', '주임', '자재·구매', '01054858424', 'lhj5334@yjlink.com', '근무처 팩스: 053-592-1724'
FROM accounts
WHERE name = '와이제이링크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '임강민', NULL, NULL, '01067621503', 'siwhi@naver.com', '근무처 팩스: 054-472-1504'
FROM accounts
WHERE name = '태영테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '임강현', '대표', NULL, '01029445000', 'deco35@naver.com', '근무처 팩스: 070-7838-1314'
FROM accounts
WHERE name = '강현자동화';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '임근주', '센터장', '영업본부 대전Solution Center', '01023322826', 'lkj5638@tanhay.com', '근무처 팩스: 070-4332-1588'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '임두성', '계장', '설비보전환경팀', '01093140793', 'limdoosung@seoulmilk.co.kr', '근무처 팩스: 055-940-1409'
FROM accounts
WHERE name = '서울우유협동조합';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '임병철', '대리', '울산공장-보전4부', '01039207595', 'byungchul@hyundai.com', '근무처 팩스: 052-215-7421'
FROM accounts
WHERE name = 'Hyundai Motor Company';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '임병훈', '과장', NULL, '01022887330', 'sselbs2002@yahoo.co.kr', '근무처 팩스: 051-319-0449'
FROM accounts
WHERE name = '성림산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '임성렬', '매니저', '기술영업', '01046211266', 'isr14@convum.co.kr', '근무처 팩스: 051-987-2352'
FROM accounts
WHERE name = '컨범코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '임영민', '부주임', '개발품질', '01047822488', 'ymyim@convum.co.kr', '근무처 팩스: 070-8668-2405'
FROM accounts
WHERE name = '컨범코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '임영택', '팀장 / 이사', '영업본부 / PJT 영업4팀', '01055115822', 'ytlim@tanhay.com', '근무처 팩스: 052-260-2549'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '임우근', '부서장', '관리부', '01025404771', 'lakerboy@sangsin.com', '근무처 팩스: 053-355-7466'
FROM accounts
WHERE name = '상신이엔지';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '임우현', '과장', '설계부', '01082082519', 'lwh@ost87.co.kr', '근무처 팩스: 053-710-5501'
FROM accounts
WHERE name = '오에스티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '임유선', '대리', '설계팀', '01040236581', 'r2works1@hanmail.net', '근무처 팩스: 054-977-1469'
FROM accounts
WHERE name = '알투웍스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '임재영', '대표', NULL, '01055580017', 'barobaro2018@naver.com', '근무처 팩스: 055-609-1599'
FROM accounts
WHERE name = '바로산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '임재현', 'SR.OPERATOR', '부산)햇반생산팀', '01066766495', 'jh.lim7@cj.net', NULL
FROM accounts
WHERE name = 'CJ 제일제당';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '임재환', '책임', '장비사업부 / 기술1팀', '01028617977', 'jae0852@naver.com', '근무처 팩스: 054-476-6162'
FROM accounts
WHERE name = '엘디케이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '임종기', '차장', '기술영업부 설계팀', '01065605829', 'yg2477@naver.com', '근무처 팩스: 054-463-0254'
FROM accounts
WHERE name = '와이제이텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '임태균', '부장', NULL, '01041148092', 'tdi5960@naver.com', '근무처 팩스: 041-573-5961'
FROM accounts
WHERE name = '태동산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '임환빈', '이사', '전략사업팀', '01033290007', 'lhb@sanga2000.com', '근무처 팩스: 053-583-5209'
FROM accounts
WHERE name = '상아뉴매틱';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '임환오', NULL, NULL, '01065583345', 'line3311@naver.com', '근무처 팩스: 051-302-3343'
FROM accounts
WHERE name = '라인광고사';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '임효섭', '연구원', '기술연구소', '01066250277', NULL, '근무처 팩스: 031-952-8987'
FROM accounts
WHERE name = '코아테크시스템';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '장기훈', 'Sales Manager / 한국대표', NULL, '01085648681', 'j.jang@robotiq.com', NULL
FROM accounts
WHERE name = 'ROBOTIQ';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '장두한', '대리', NULL, '01085305061', 'sj_sys@naver.com', '근무처 팩스: 051-319-2014'
FROM accounts
WHERE name = '에스제이시스템';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '장석용', '대표', NULL, '01083305788', 'steck@steck.kr', '근무처 팩스: 051-796-2390'
FROM accounts
WHERE name = '에스텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '장성환', '과장', '설계실', '01032115823', 'hd@hyunduk.or.kr', '근무처 팩스: 052-261-3449'
FROM accounts
WHERE name = '현덕산기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '장영진', '실장', NULL, '01050300625', 'japhoto@hanmail.net', '근무처 팩스: 051-319-1223'
FROM accounts
WHERE name = '하이매틱';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '장자운', '차장', '설계팀', '01063396692', 'jaun.jang@daejinmc.com', '근무처 팩스: 054-463-1465'
FROM accounts
WHERE name = '대진기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '장재영', '대리', '클린 시스템 사업부', '01084560858', 'jangynuu@naver.com', '근무처 팩스: 055-338-6878'
FROM accounts
WHERE name = '삼우엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '장재영', '대표이사 / 공학박사 / 성균관대학교 겸임교수', NULL, '01088740575', 'jjy@pure-envitech.co.kr', NULL
FROM accounts
WHERE name = 'PURE ENVITECH';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '장준호', '대표', NULL, '01048427134', 'wnsgh7134@hanmail.net', '근무처 팩스: 055-256-7135'
FROM accounts
WHERE name = '영훈테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '장형규', '이사', '영업부', '01075517358', 'dd7358@naver.com', '근무처 팩스: 051-802-3935'
FROM accounts
WHERE name = '대동유공압';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '장형식', '과장', '설계팀', '01027614100', 'r2works1@hanmail.net', '근무처 팩스: 053-585-9480'
FROM accounts
WHERE name = 'R2 WORKS';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '전광길', '대표', NULL, '01094960910', 'sales@almapack.kr', NULL
FROM accounts
WHERE name = '알마';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '전동민', '과장', '플랜트사업1팀', '01028530560', 'dongmin.jeon@nse.co.kr', '근무처 팩스: 02-827-2799'
FROM accounts
WHERE name = '농심엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '전명진', '과장', '영업관리부', '01051461677', 'dd2358@naver.com', '근무처 팩스: 051-317-2360'
FROM accounts
WHERE name = '대동유공압';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '전병옥', '기술파트장', '울산공장 / 보전5부', '01040960007', 'hitman5@hyundai.com', NULL
FROM accounts
WHERE name = '현대자동차그룹';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '전병학', '선임', '구매관리팀', '01025095224', 'hak5224@motfa.com', '근무처 팩스: 055-374-6228'
FROM accounts
WHERE name = '엠오티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '전상현', NULL, 'FPD사업부', '01049983720', 'sanghyeon@daewonfnc.com', '근무처 팩스: 054-474-7376'
FROM accounts
WHERE name = '대원에프엔씨';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '전석환', '차장', NULL, '01040217001', 'plant@iplantec.com', '근무처 팩스: 055-584-4814'
FROM accounts
WHERE name = '플랜텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '전성구', '영업1팀장', '부산영업소 / 기계사업부', '01038652352', 'sungguo@daesung.co.kr', '근무처 팩스: 051-831-4046'
FROM accounts
WHERE name = '대성산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '전성록', '수석연구원 / BU장', 'G-BU', '01088643926', 'srjeon@topengnet.com', '근무처 팩스: 054-482-0346'
FROM accounts
WHERE name = '탑엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '전성언', '차장', '생산관리팀', '01038034557', 'sam-dv@nate.com', '근무처 팩스: 054-434-0637'
FROM accounts
WHERE name = '삼송';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '전성일', '대표', NULL, '01093755404', 'twotopfa@daum.net', '근무처 팩스: 054-464-6001'
FROM accounts
WHERE name = '투톱FA';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '전세현', NULL, '자동화팀', '01045864861', 'sh.jeon2@taekwang.com', NULL
FROM accounts
WHERE name = 'TKG TAEKWANG CO.,LTD.';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '전소영', NULL, '설계기술 3그룹', '01044514585', 'jsy0440@wonik.com', '근무처 팩스: 043-218-7059'
FROM accounts
WHERE name = '원익피앤이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '전용삼', '개발품질부장', NULL, '01091446257', 'y3club@convum.co.kr', '근무처 팩스: 070-8668-2405'
FROM accounts
WHERE name = '컨범코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '전운환', '대리', '설계', '01032114860', 'eraesys@chol.com', '근무처 팩스: 054-475-5220'
FROM accounts
WHERE name = '이래 R&D';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '전유태', '대표이사', NULL, '01035975342', 'bestar2030@hanmail.net', '근무처 팩스: 055-384-1233'
FROM accounts
WHERE name = '베스타텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '전정완', '과장', NULL, '01045601340', 'b1@nat21.co.kr', '근무처 팩스: 051-925-9950'
FROM accounts
WHERE name = '엔에이티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '전종문', '대표', NULL, '01045831550', 'wooju-plant@hanmail.net', '근무처 팩스: 055-383-6927'
FROM accounts
WHERE name = '우주플랜트';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '전진수', '총괄이사', NULL, '01077457494', 'sungjinfa1@naver.com', '근무처 팩스: 055-237-9851'
FROM accounts
WHERE name = '성진자동화';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정관우', '대표이사', NULL, '01034150639', 'top@fa-ams.com', '근무처 팩스: 031-296-2683'
FROM accounts
WHERE name = '에이엠에스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정귀동', '기정', 'Solar사업팀 Solar생산기술그룹PM반', '01055353715', 'guidong.jung@lge.com', NULL
FROM accounts
WHERE name = 'LG전자';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정규택', '대표', NULL, '01054087136', 'jesusjkt11@naver.com', '근무처 팩스: 041-584-5825'
FROM accounts
WHERE name = '제이앤피(J&P)';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정기창', '대표', NULL, '0115079788', 'dyengsk@hanmail.net', '근무처 팩스: 053-604-2685'
FROM accounts
WHERE name = '동양엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '정덕화', '과장', '설계팀', '01095037697', 'jdh@dmview.co.kr', '근무처 팩스: 070-5029-3234'
FROM accounts
WHERE name = 'DMVIEW';
