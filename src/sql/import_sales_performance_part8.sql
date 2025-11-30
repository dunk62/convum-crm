-- Part 8 of Contact Import (mapped to sales_performance filenames)

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '엄성욱', '주임', '기술1팀', '01038652788', 'sweom@jct.co.kr', '근무처 팩스: 055-587-1261'
FROM accounts
WHERE name = 'JCT';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '엄정후', '계장', '부산지사', '01074260097', 'ejh0097@kccpr.com', '근무처 팩스: 051-316-3857'
FROM accounts
WHERE name = '케이시시정공';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '여동우', '차장', '관리팀', '01071310538', 'dongwoo.yeo@jscoltd.com', '근무처 팩스: 054-471-0729'
FROM accounts
WHERE name = '제이에스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '여학동', '대표', NULL, '01047138580', 'kd1970@naver.com', '근무처 팩스: 055-299-3506'
FROM accounts
WHERE name = '오토파워';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '오경진', '차장', '기술영업', '01029322588', 'hd@hyunduk.or.kr', '근무처 팩스: 052-261-3449'
FROM accounts
WHERE name = '현덕산기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '오민영', '과장', NULL, '01063306549', 'nmtool@hanmail.net', '근무처 팩스: 052-260-0959'
FROM accounts
WHERE name = '농민산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '오상균', '프로', '전자계열3팀', '01038790321', 'ohsanggu@imarketkorea.com', '근무처 팩스: 031-218-2126'
FROM accounts
WHERE name = '아이마켓코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '오상수', '이사', NULL, '01041475401', 'world-eng@daum.net', '근무처 팩스: 054-976-1622'
FROM accounts
WHERE name = '월드이엔지';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '오상흔', '과장 (연구원)', NULL, '01067834800', 'paycos@naver.com', '근무처 팩스: 051-941-5296'
FROM accounts
WHERE name = 'KM ENG';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '오세창', '責任研究員', 'ME事業部 設計技術Gr', '01035230971', 'oschang99@avaco.com', '근무처 팩스: 053-588-9209'
FROM accounts
WHERE name = 'AVACO';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '오영근', '과장', NULL, '01025243551', '98823551@jns2002.co.kr', NULL
FROM accounts
WHERE name = '제이엔에스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '오원찬', '대표', NULL, '01063807090', 'bkfa2009@hnamail.net', '근무처 팩스: 051-996-1544'
FROM accounts
WHERE name = '비케이자동화';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '오점용', '부장', NULL, '01038129476', 'dream652@daum.net', NULL
FROM accounts
WHERE name = '성신에프에이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '오천룡', NULL, '설계기술 2그룹', '01026969339', 'croh@wonik.com', '근무처 팩스: 043-218-7059'
FROM accounts
WHERE name = '원익피앤이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '오태환', '이사 / 프로젝트1팀장', '영업본부', '01081075502', 'taehwan@tanhay.com', '근무처 팩스: 032-578-0786'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '옥영식', '센터장', '장비사업부', '01045504101', 'ysok1@alpharobotics.kr', '근무처 팩스: 051-316-3137'
FROM accounts
WHERE name = '알파로보틱스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '원서희', '공장장', '재생에너지 사업부문 / 김제사업장', '01071249229', 'wsh@shinsung.co.kr', '근무처 팩스: 063-543-7889'
FROM accounts
WHERE name = '신성이엔지';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '원영규', '이사', '제조기술연구실', '01092764530', 'ykwon@hansol.com', NULL
FROM accounts
WHERE name = '한솔코에버';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '원영환', '팀장', NULL, '01040065524', 'yhwon@e-prosis.co.kr', NULL
FROM accounts
WHERE name = '프로시스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '위진현', NULL, '영업그룹 / 영업2팀', '01074720940', 'jhwi@pisco.co.kr', '근무처 팩스: 054-475-2217'
FROM accounts
WHERE name = '피스코코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '유경환', '과장', '영업부', '01082875884', 'dbrudghks88@naver.com', '근무처 팩스: 031-376-6448'
FROM accounts
WHERE name = '성준전기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '유길', '과장', '설계팀', '01041486125', 'yug@hdm87.com', '근무처 팩스: 053-710-5509'
FROM accounts
WHERE name = '오에스티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '유병욱', '책임', '자동차.H-PJT', '01074113224', 'cometic@lgensol.com', NULL
FROM accounts
WHERE name = 'LG Energy Solution';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '유상구', '전무', NULL, '01098559880', 'yg2477@naver.com', '근무처 팩스: 054-463-0254'
FROM accounts
WHERE name = '와이제이텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '유상목', '책임', NULL, '01049226657', 'ilrak79@hanmail.net', '근무처 팩스: 02-3667-6657'
FROM accounts
WHERE name = '에스엠테크코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '유성열', '과장', '울산공장 / 도장생기1팀', '01033663397', 'uc102@hyundai.com', '근무처 팩스: 052-280-7430'
FROM accounts
WHERE name = '현대자동차그룹';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '유연학', '매니저', '영업본부 / 제품전략팀', '01091923789', 'yh900902@tanhay.com', '근무처 팩스: 032-578-0786'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '유우종', '대리', '설계부', '01082269810', 'milk_bell@ost87.co.kr', '근무처 팩스: 053-710-5506'
FROM accounts
WHERE name = '오에스티투';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '유재경', '지사장', '대전지사', '01074260089', 'ujk1213@kccpr.com', '근무처 팩스: 042-670-6213'
FROM accounts
WHERE name = '케이시시정공';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '유재성', '대리', '외주구매팀 / P&Q실', '01049362344', 'jaesung.yoo@hanwha.com', '근무처 팩스: 055-280-8988'
FROM accounts
WHERE name = '한화/모멘텀';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '유정무', '차장 / 팀장', 'FA 설계 2팀', '01082521878', 'hrtsystem@naver.com', NULL
FROM accounts
WHERE name = '에이치알티시스템';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '유창태', '대리', '설계', '01050380753', 'youct@hanmail.net', '근무처 팩스: 053-563-0794'
FROM accounts
WHERE name = '성호하이텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '유효준', '계장', '부산지사', '01074260097', 'yhj@kccpr.com', '근무처 팩스: 051-316-3857'
FROM accounts
WHERE name = '케이시시정공';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '육근형', NULL, '설계기술 2그룹', '01068800473', 'ghyouk@wonik.com', '근무처 팩스: 043-218-7059'
FROM accounts
WHERE name = '원익피앤이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '윤대우', '생산총괄이사', NULL, '01092432560', 'yun.dae.woo@h-auto.co.kr', NULL
FROM accounts
WHERE name = 'HAUTO';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '윤명수', '대표', NULL, '01026302931', 'hanwhatech20@daum.net', '근무처 팩스: 051-914-2932'
FROM accounts
WHERE name = '한화테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '윤미혜', '프로', '전자계열3팀', '01021100425', 'mh425.yoon@imarketkorea.com', NULL
FROM accounts
WHERE name = '아이마켓코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '윤병덕', '전무', NULL, '01029491956', 'shinsan@shinsan.kr', '근무처 팩스: 052-261-5857'
FROM accounts
WHERE name = '신산';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '윤병익', '과장', '영업부', '01071993936', 'msco@myungshin.co.kr', NULL
FROM accounts
WHERE name = '명신 ROBOTICS';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '윤상호', '주임', '생산2팀', '01044901307', 'maml09@chunho.net', '근무처 팩스: 055-371-1046'
FROM accounts
WHERE name = '천호식품';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '윤석준', '팀장', 'Robotics / Robotics and Motion', '01094885540', 'seok-joon.yoon@kr.abb.com', NULL
FROM accounts
WHERE name = 'ABB 코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '윤세영', '대표', NULL, '01044040989', 'nmtool@hanmail.net', '근무처 팩스: 052-260-0959'
FROM accounts
WHERE name = '농민산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '윤수현', '대리', '경영지원팀', '01046222196', 'ysh137@naver.com', '근무처 팩스: 054-474-9708'
FROM accounts
WHERE name = '에스케이테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '윤양호', NULL, '설비개발 2그룹', '01065003893', 'iamfine@wonik.com', '근무처 팩스: 043-218-7059'
FROM accounts
WHERE name = '원익피앤이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '윤영남', '대리', NULL, '01085335306', 'saewon@autoswitches.co.kr', '근무처 팩스: 051-894-2482'
FROM accounts
WHERE name = '세원정밀전자';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '윤영민', '사원', '기계사업부 / 대구영업소', '01193903296', 'nainne@daesung.co.kr', '근무처 팩스: 053-354-5846'
FROM accounts
WHERE name = '대성산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '윤정욱', '대리', 'SE 사업부', '01025638582', 'hhtt138@avaco.co.kr', '근무처 팩스: 053-588-9209'
FROM accounts
WHERE name = '아바코';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '윤정한', '차장', '기술설계부', '01085584146', 'tjy0930@bldo.co.kr', '근무처 팩스: 070-8877-1203'
FROM accounts
WHERE name = '비엘두';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '윤종선', '매니저', '설비관리4부', '01040261727', 'jongsun.yoon@hyundai.com', NULL
FROM accounts
WHERE name = '현대자동차';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '윤준식', '차장', '생산관리팀', '01020150854', 'yunjs@mopam.co.kr', '근무처 팩스: 052-254-0106'
FROM accounts
WHERE name = 'MOPAM';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '윤진열', '대리', '기계사업부 / 부산영업소', '01020438608', 'jyyoon@daesung.co.kr', '근무처 팩스: 070-4360-3711'
FROM accounts
WHERE name = '대성산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '윤창수', '과장', '영업부 울산지사', '01074260057', 'ycs@kccpr.com', '근무처 팩스: 052-268-3857'
FROM accounts
WHERE name = '케이시시정공';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '윤치석', '과장', 'FA 기술', '01022130099', 'sekwangeng@hanmail.net', '근무처 팩스: 055-388-2261'
FROM accounts
WHERE name = '세광';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '윤태연', '대표이사', NULL, '01055237916', 'saewon@autoswitches.co.kr', '근무처 팩스: 051-894-2482'
FROM accounts
WHERE name = '세원정밀전자';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '윤태원', '대리', '엔지니어링팀', '01022079861', 'kukdo@kukdoprecision.com', '근무처 팩스: 052-297-1354'
FROM accounts
WHERE name = '국도정밀';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '윤현', '차장&팀장', '영업부', '01025925116', 'hk_yoon@sungjoon.co.kr', '근무처 팩스: 031-376-6448'
FROM accounts
WHERE name = '성준전기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '윤현준', '대리', '연구1팀', '01032155315', 'yhj@ti-k.co.kr', '근무처 팩스: 054-474-6374'
FROM accounts
WHERE name = '티아이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '윤현중', '과장', '도장보전과', '01040229252', 'a3023@myeco.co.kr', '근무처 팩스: 054-771-3102'
FROM accounts
WHERE name = '에코플라스틱';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '윤화식', '부장', NULL, '01096366345', 'entech51@daum.net', '근무처 팩스: 055-375-1755'
FROM accounts
WHERE name = '제일엔텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '윤효빈', '선임연구원', '생산기술팀', '01028292908', 'yhb2908@ihantec.com', '근무처 팩스: 052-270-3790'
FROM accounts
WHERE name = '한텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '은서준', '매니저', '생산기술팀', '01068808923', 'eunseo@guyoungtech.com', '근무처 팩스: 053-592-6567'
FROM accounts
WHERE name = '구영테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이경록', '대리', '구매부', '01086827016', 'grok95@younghoeng.co.kr', '근무처 팩스: 054-475-6870'
FROM accounts
WHERE name = '영호엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이계철', '부장', '기술부', '01039547456', 'lk.hanshin@gmail.com', '근무처 팩스: 02-2666-0300'
FROM accounts
WHERE name = '한신 파워텍';
