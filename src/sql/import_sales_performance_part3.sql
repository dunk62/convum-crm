-- Part 3 of Contact Import (mapped to sales_performance filenames)

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김승홍', '기술영업이사', NULL, '01023965815', 'namer5815@naver.com', '근무처 팩스: 055-374-0727'
FROM accounts
WHERE name = '지앤아이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김시환', '과장', NULL, '01064954222', 'sjtech2903@hanmail.net', '근무처 팩스: 055-265-0527'
FROM accounts
WHERE name = '선정테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김영미', '대표', NULL, '01045014033', 'woojin7404@nate.com', '근무처 팩스: 053-253-7401'
FROM accounts
WHERE name = '우진종합계기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김영운', '설계팀장', NULL, '01020414218', 'laoneng@naver.com', '근무처 팩스: 055-267-0221'
FROM accounts
WHERE name = '라온 ENG';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김영일', '파트장', '시설팀 정비', '01068480926', 'yeongil.kim@lotte.net', NULL
FROM accounts
WHERE name = '롯데웰푸드';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김영택', '대표', NULL, '01032002725', 'ystss@hanmail.net', '근무처 팩스: 054-465-2724'
FROM accounts
WHERE name = '서진엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김영표', '사원', '구매본부/ 구매3담당/ 유공압팀', '01042430518', 'pyo6021@serveone.co.kr', NULL
FROM accounts
WHERE name = '서브원';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김영훈', '설계부장', NULL, '01023400619', 'slt0816@naver.com', '근무처 팩스: 054-777-6739'
FROM accounts
WHERE name = '에스엘티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김영희', '지사장 / 총괄이사', NULL, '01077134614', 'kelly@risenenergy.com', NULL
FROM accounts
WHERE name = '라이젠코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김완수', '매니저', '설비관리2부', '01024731266', '7364418@hyundai.com', NULL
FROM accounts
WHERE name = 'Hyundai Motor Company';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김용규', '팀장', '설계팀 / 창원사업장', '01048504217', 'yongkyu.kim@dsmtech.co.kr', NULL
FROM accounts
WHERE name = '덕성엠텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김용래', '과장', '기구설계', '01023767876', 'tkdquf26@tnp-ems.co.kr', '근무처 팩스: 054-463-7739'
FROM accounts
WHERE name = '티앤피';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김용문', NULL, '구매팀', '01050166184', 'one7179@naver.com', '근무처 팩스: 055-366-3951'
FROM accounts
WHERE name = '엠에스씨';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김용석', '이사', '기계설계', '01045610887', 'jeil@jeilmach.com', '근무처 팩스: 054-773-3464'
FROM accounts
WHERE name = '제일기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김용훈', '소장', '부산영업소 / Busan Sales Office', '01094670350', 'yhkim1@daesung.co.kr', '근무처 팩스: 051-831-4046'
FROM accounts
WHERE name = '대성산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김원장', '차장', '스마트팩토리사업본부 / 로봇솔루션팀', '01092696106', 'kimwonjang@tanhay.com', '근무처 팩스: 032-580-0693'
FROM accounts
WHERE name = 'TPC메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김원철', '대표이사', NULL, '01034882042', 'rotes@rotes.co.kr', '근무처 팩스: 053-552-5709'
FROM accounts
WHERE name = '하이테크놀리지 로보트시스템';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김원태', '대리', '구매팀', '01034621256', 'kimwt@mt-system.co.kr', '근무처 팩스: 054-462-6271'
FROM accounts
WHERE name = '엠티에스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김유천', '과장', '설계개발팀', '01028983604', 'dnhtech@daum.net', '근무처 팩스: 054-473-3384'
FROM accounts
WHERE name = '디엔에이치테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김유한', '팀장', '기술영업부 설계팀', '01035337309', 'yg2477@naver.com', '근무처 팩스: 054-463-0254'
FROM accounts
WHERE name = '와이제이텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김윤석', '센터장', '설계 / 개발', '01025847616', 'ys.kim@dsmtech.co.kr', NULL
FROM accounts
WHERE name = '덕성엠텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김윤일', '대표', NULL, '01071166650', 'cross-tech@naver.com', '근무처 팩스: 051-980-5110'
FROM accounts
WHERE name = '크로스테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김의열', '소장', NULL, '01195909662', '6cmt@naver.com', '근무처 팩스: 031-949-1892'
FROM accounts
WHERE name = 'CMT';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김인기', '기술기사보', '울산공장-보전5부', '01035336459', 'godsave@hyundai.com', '근무처 팩스: 052-280-8932'
FROM accounts
WHERE name = 'Hyundai Motor Company';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김인성', '선임', '영업본부 / 울산Solution Center', '01048507054', 'insung@tanhay.com', '근무처 팩스: 070-4332-1588'
FROM accounts
WHERE name = 'TPC';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김일남', '차장', '경영지원팀', '01046339874', 'takeme100@hanmail.net', '근무처 팩스: 054-474-9708'
FROM accounts
WHERE name = '에스케이테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김재민', '부장', NULL, '01087412110', 'ytjung7@hanmail.net', '근무처 팩스: 054-976-1622'
FROM accounts
WHERE name = '월드이엔지';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김재섭', '대리', '기계사업부 / 대구영업소', '01091763349', 'jskim_1@daesung.co.kr', '근무처 팩스: 053-354-5846'
FROM accounts
WHERE name = '대성산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김재성', '과장', NULL, '01052282922', 'chjk@chjk.co.kr', '근무처 팩스: 02-2672-3157'
FROM accounts
WHERE name = '충해전기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김재수', '실장', NULL, '01068507809', 'saiilguo@hanmail.net', '근무처 팩스: 031-673-0575'
FROM accounts
WHERE name = '케이에스티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김재원', '소장', '기계사업부 / 대구영업소', '01055334995', NULL, '근무처 팩스: 053-354-5846'
FROM accounts
WHERE name = '대성산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김재인', '대리', '생산기술팀', '01066636106', 'jikim02@shym.co.kr', '근무처 팩스: 054-330-0211'
FROM accounts
WHERE name = '신영';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김재혁', '부장', '관리팀', '01091854818', 'amtec@amtec2000.com', '근무처 팩스: 053-588-5358'
FROM accounts
WHERE name = 'AMZ EC';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김재현', '차장', '영업본부 / 울산영업소', '01093319604', 'kjh9604@tanhay.com', '근무처 팩스: 052-260-2549'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김재호', '대리', '기술영업팀', '0118263191', 'jhkim3191@naver.com', '근무처 팩스: 053-604-4065'
FROM accounts
WHERE name = '창세기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김재회', NULL, '영업본부 / 울산영업소', '01094933969', 'jaehoi@tanhay.com', '근무처 팩스: 052-260-2549'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김재훈', '사원', '기술1팀', '01090533270', 'jhkim@jct.co.kr', '근무처 팩스: 055-587-1261'
FROM accounts
WHERE name = 'JCT';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김정근', '팀장', '기술부', '01063383262', 'jg_kim@sungjoon.co.kr', '근무처 팩스: 031-376-6448'
FROM accounts
WHERE name = '성준전기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김정준', '차장', '구매부', '01040511398', 'buy@daebong.com', '근무처 팩스: 051-831-8880'
FROM accounts
WHERE name = '대봉기연';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김정준', '실장', NULL, '01028090978', 'kimjj@autotec.co.kr', '근무처 팩스: 052-923-4766'
FROM accounts
WHERE name = '오토텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김정학', '책임', 'Display 사업본부 / ME사업부 설계기술Gr.', '01084354745', 'jung24@avaco.com', '근무처 팩스: 053-588-9209'
FROM accounts
WHERE name = 'AVACO';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김정호', '사원', '영업본부 / 공압기술팀', '01090837731', 'jeongho55@tanhay.com', '근무처 팩스: 054-474-8683'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김정훈', '과장', '제조3팀', '01085892660', 'kjh2660@shinsung.co.kr', '근무처 팩스: 063-543-7889'
FROM accounts
WHERE name = '신성이엔지';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김정훈', '과장', 'FA사업부 영업팀', '01025635105', 'melanius0106@gieng.com', '근무처 팩스: 054-472-9138'
FROM accounts
WHERE name = '구일엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김제혁', '부장', '영업관리총괄', '01029526646', 'jehuck.kim@atmc.co.kr', '근무처 팩스: 052-273-8726'
FROM accounts
WHERE name = '에이티엠';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김종복', '과장', '자동화기술팀', '01027820409', '30397@hyundai-wia.com', NULL
FROM accounts
WHERE name = '현대위아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김종수', '부사장 / 소장', '연구소', '01055158008', 'tech@daebong.com', '근무처 팩스: 051-831-8550'
FROM accounts
WHERE name = '대봉기연';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김종순', '상무', '기술부', '01026118670', 'kkj045@yahoo.co.kr', '근무처 팩스: 055-232-5213'
FROM accounts
WHERE name = '광진정밀';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김종신', '차장', '기구개발팀', '01035756724', 'kjs@gpico.co.kr', '근무처 팩스: 055-912-7056'
FROM accounts
WHERE name = '지피아이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김종원', '대표', NULL, '01032310081', 'jwkim@atsfu.com', '근무처 팩스: 031-5186-6337'
FROM accounts
WHERE name = '에이티에스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김주성', '대리', '설계', '01040431219', 'kjs@fosys.net', '근무처 팩스: 054-472-0634'
FROM accounts
WHERE name = '포시스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김주희', '총괄이사', NULL, '01053504879', 'kjh4879@hanmail.net', '근무처 팩스: 031-8041-3421'
FROM accounts
WHERE name = '아이엠';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김준', '과장', '로봇제어팀', '01038001613', 'jeil@jeilmach.com', '근무처 팩스: 054-773-3464'
FROM accounts
WHERE name = '제일기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김준걸', '대리', '생산본부 AE설계팀', '01090777639', 'kjk7639@avaco.com', '근무처 팩스: 053-588-9209'
FROM accounts
WHERE name = '아바코';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김지영', '주임', '생산기술팀', '01193833828', 'chisu02@naver.com', '근무처 팩스: 054-773-6662'
FROM accounts
WHERE name = '영풍기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김지형', '대리', '생산기술팀', '01088388634', 'zihyung2@gmail.com', '근무처 팩스: 054-476-3704'
FROM accounts
WHERE name = '태진A&T';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김지혜', '주임', NULL, '01099729877', NULL, '근무처 팩스: 051-996-1544'
FROM accounts
WHERE name = '비케이자동화';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김지훈', NULL, '보전 2팀', '01085078007', 'kghibli@swhitech.com', '근무처 팩스: 055-366-5656'
FROM accounts
WHERE name = '성우하이텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김진권', '팀장 / 차장', '경영지원팀', '01077278257', 'withwnh@nate.com', '근무처 팩스: 054-462-8675'
FROM accounts
WHERE name = '브이엔에스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김진년', '부장', '관리팀', '01045371366', 'svt@sunvitech.com', '근무처 팩스: 053-582-5879'
FROM accounts
WHERE name = '선비테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김진승', '대리', '구매팀', '01025182587', 'kimjs@gpi-korea.co.kr', '근무처 팩스: 052-943-7057'
FROM accounts
WHERE name = 'Gpi';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김진환', '차장', NULL, '01041529222', 'kjh@finetech-eng.net', '근무처 팩스: 054-716-2071'
FROM accounts
WHERE name = '파인텍 엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김창민', '과장', '생산기술팀', '01089567969', 'cm0777@kyunghankorea.com', '근무처 팩스: 055-237-9664'
FROM accounts
WHERE name = '경한코리아';
