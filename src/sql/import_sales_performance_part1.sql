-- Part 1 of Contact Import (mapped to sales_performance filenames)
-- Optional: TRUNCATE TABLE contacts;


INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, 'Ik-Ki Choi', 'Professional', 'ENG Dept. Design Engineering Team', '01077260080', 'cik@avaco.com', '근무처 팩스: 053-588-9209'
FROM accounts
WHERE name = 'Advanced VAcuum & Clean Equipment Optimizer';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, 'Ki-Hwan Oh', 'Specialist', 'ME Dept. Production Technology Team', '01041827901', 'kihwan@avaco.com', NULL
FROM accounts
WHERE name = 'AVACO';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, 'Sang-Min Yoon', 'Senior Research Engineer', 'ME Dept. Design Technical Gr', '01084483993', 'ysm@avaco.com', '근무처 팩스: 053-588-9209'
FROM accounts
WHERE name = 'AVACO';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, 'Shin Ju Woon', 'President', NULL, '01087658910', 'juzzangkku1215@hanmail.net', '근무처 팩스: 051-925-1400'
FROM accounts
WHERE name = 'JM-TEC';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, 'Sung-Tae Shin', 'Specialist', 'ME Dept.', '01047177711', 'sst@avaco.com', '근무처 팩스: 053-588-9209'
FROM accounts
WHERE name = 'AVACO';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, 'YUTAKA SATO', 'President & CEO', NULL, '+81337591491', 'sato@convum.co.jp', '근무처 팩스: 019-735-1022'
FROM accounts
WHERE name = 'CONVUM';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '가수현', '대표이사', NULL, '01062286073', 'shka@pmccorp.kr', NULL
FROM accounts
WHERE name = '피엠씨';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '감병국', '과장', '기계기술부', '01044489972', 'samyeontech@hanmail.net', '근무처 팩스: 053-591-4226'
FROM accounts
WHERE name = '삼연기술';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '강경남', '차장', 'R&D 센터', '01063079604', 'knkang@alpharobotics.kr', '근무처 팩스: 051-316-3137'
FROM accounts
WHERE name = '알파로보틱스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '강구완', '기술그룹장', '보전5부', '01065662410', 'kgw@hyundai.com', '근무처 팩스: 052-215-8832'
FROM accounts
WHERE name = 'Hyundai Motor Company';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '강동길', '부장', '영업부', '01086398136', 'dk_kang@sungjoon.co.kr', '근무처 팩스: 031-376-6448'
FROM accounts
WHERE name = '성준전기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '강동원', '대표이사', '천안본사/스마트공장', '01023223227', '01023223227@nate.com', NULL
FROM accounts
WHERE name = '제이원로보틱스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '강동화', '부장', NULL, '01093509364', 'greeree@naver.com', '근무처 팩스: 055-383-4062'
FROM accounts
WHERE name = '엠텍에프에이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '강상용', '사원', '기술지원팀', '01028292811', 'syms114@sjku.co.kr', '근무처 팩스: 052-287-7815'
FROM accounts
WHERE name = 'SEJONG INDUSTRIAL CO.,LTD.';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '강석창', '기술주임', '보전5부', '01055951953', 'kangsc1225@naver.com', '근무처 팩스: 052-280-8932'
FROM accounts
WHERE name = 'Hyundai Motor Company';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '강성일', '부장', NULL, '01031549823', 'ksngsungil@naver.com', '근무처 팩스: 30309402791'
FROM accounts
WHERE name = '화인';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '강억태', '대표', '총괄 / 설계', '01029358996', 'act0310@naver.com', '근무처 팩스: 054-476-7803'
FROM accounts
WHERE name = '에이씨티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '강인철', '이사', '기획', '01057973477', 'ickang@alpharobotics.kr', '근무처 팩스: 051-316-3137'
FROM accounts
WHERE name = '알파로보틱스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '강인호', '이사', NULL, '01085124432', 'samjungrobotics@naver.com', '근무처 팩스: 055-294-0476'
FROM accounts
WHERE name = '삼정로보틱스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '강일우', '차장', '생산', '01099546666', 'bk6666@bkmedicare.co.kr', '근무처 팩스: 055-388-1889'
FROM accounts
WHERE name = 'BK메디케어';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '강정혁', '연구소장 / 상무', '로봇융합연구소', '01063023691', 'jh.kang@rotal.kr', '근무처 팩스: 051-911-2801'
FROM accounts
WHERE name = 'ROTAL';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '강중원', '팀장 / 부장', '영업본부 / 기술영업팀', '01032273826', 'joongwon@tanhay.com', '근무처 팩스: 032-578-0786'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '강현우', '팀장 / 책임', '영업본부 영업기획팀', '01030000487', 'hwkang@tanhay.com', '근무처 팩스: 032-578-0786'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '고덕영', '부장', 'GT사업부', '01034067959', 'dyko@abimaneng.com', '근무처 팩스: 031-659-7323'
FROM accounts
WHERE name = '아비만엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '고용재', '이사', NULL, '01054505960', 'tdi5960@naver.com', '근무처 팩스: 041-573-5961'
FROM accounts
WHERE name = '태동산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '고필규', '프로', '자동화팀', '01058984855', 'filkyu.ko@samkwang.com', '근무처 팩스: 053-856-1153'
FROM accounts
WHERE name = '삼광';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '고현철', '차장', '설계부 / FA2 Div.', '01051107230', 'hc.hanshin@gmail.com', '근무처 팩스: 02-2666-0300'
FROM accounts
WHERE name = '한신 파워텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '공근택', '수석연구원', '기업부설연구소', '01026254306', 'kt3025.kong@powerautomation.co.kr', '근무처 팩스: 041-417-0156'
FROM accounts
WHERE name = '파워오토메이션';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '곽광원', 'Professional', '아산/천안단지총괄 A제조기술팀', '01066390638', 'kw.gwak@samsung.com', NULL
FROM accounts
WHERE name = '삼성디스플레이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '곽영수', '대리', '논산)생산2팀', '01067249876', 'youngsu.kwak@cj.net', NULL
FROM accounts
WHERE name = 'CJ 제일제당';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '곽용호', '책임매니저', '생산기술팀', '01054599066', 'yhkwak@guyoungtech.com', '근무처 팩스: 053-592-6567'
FROM accounts
WHERE name = '구영테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '곽진혁', '책임매니저', '샤시시스템사업본부 김천공장 시설운영팀', '01092444479', 'jinhyeok.kwak@donghee.co.kr', '근무처 팩스: 054-434-1940'
FROM accounts
WHERE name = '동희산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '곽해민', '과장', NULL, '01051057175', 'hyundai-fa@hanmail.net', '근무처 팩스: 054-471-4751'
FROM accounts
WHERE name = '현대FA';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '곽해진', '과장', '설계팀', '01064563515', 'kkwag2000@naver.com', '근무처 팩스: 031-613-9127'
FROM accounts
WHERE name = '원텍 F.A';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '구본흥', '대표이사', NULL, '01035042622', 'gni9783@naver.com', '근무처 팩스: 053-582-9785'
FROM accounts
WHERE name = '지엔아이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '구봉현', '부장', NULL, '01024673649', 'techone7937@daum.net', '근무처 팩스: 055-323-7939'
FROM accounts
WHERE name = '테크원 코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '구원희', '차장', NULL, '01073031567', 'g2@nat21.co.kr', '근무처 팩스: 02-2698-1406'
FROM accounts
WHERE name = '엔에이티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '구해조', '차장', '생산기술부', '01051484475', 'gu0704@myeco.co.kr', '근무처 팩스: 054-771-3102'
FROM accounts
WHERE name = '에코플라스틱';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '권기용', '대표', NULL, '01085945706', 'kky8055@naver.com', '근무처 팩스: 054-613-5706'
FROM accounts
WHERE name = '케이씨디';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '권기혁', '사원', '영업부', '01086000622', 'gh_kwon@sungjoon.co.kr', '근무처 팩스: 031-376-6448'
FROM accounts
WHERE name = '성준전기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '권기형', '관리이사', NULL, '01038424063', 'areng.khkwon@gmail.com', '근무처 팩스: 051-796-0498'
FROM accounts
WHERE name = '에이알 엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '권성근', '팀장', '공정기술팀', '01022023229', 'skkweon1@ms-global.com', '근무처 팩스: 054-776-0502'
FROM accounts
WHERE name = '명신산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '권영수', '대표', NULL, '01062420186', 'nonimano@naver.com', '근무처 팩스: 053-604-6106'
FROM accounts
WHERE name = '비 에스 씨';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '권오영', '차장', '개발 설계', '01031881023', 'kwonohyoung@nate.com', '근무처 팩스: 054-435-7860'
FROM accounts
WHERE name = '영성하이테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '권오혁', '과장대리', NULL, '01049160186', 'koh1542@naver.com', '근무처 팩스: 053-604-6106'
FROM accounts
WHERE name = '비에스 씨';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '권재민', '과장', '관리부 / 구매팀', '01048070362', 'pur4@msckorea.com', '근무처 팩스: 055-366-3951'
FROM accounts
WHERE name = 'MSC CO.,LTD.';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '권준', '책임매니저', '국내영업 2팀', '01045025577', 'jun.kwon@hd.com', NULL
FROM accounts
WHERE name = 'HD현대에너지솔루션';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '권태훈', NULL, NULL, '01026257651', 'yoosung09@gmail.com', '근무처 팩스: 055-327-5609'
FROM accounts
WHERE name = '유성기공';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '권해용', '이사', NULL, '01023301998', 'imikorea@imikorea.co.kr', '근무처 팩스: 052-239-9070'
FROM accounts
WHERE name = '아이엠아이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '권혁수', '3팀장 / 대리', NULL, '01028898834', 'hyeoksu112@eraekorea.net', '근무처 팩스: 054-475-5220'
FROM accounts
WHERE name = '이래코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '금용순', '이사', '기계설계', '01025550667', 'jeil@jeilmach.com', '근무처 팩스: 054-773-3464'
FROM accounts
WHERE name = '제일기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '기현우', '차장', '영업부', '01048019091', 'hw_ki@sungjoon.co.kr', '근무처 팩스: 031-376-6448'
FROM accounts
WHERE name = '성준전기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '길태용', '부장', 'General Industry / Robotics and Discrete Automation', '01064504203', 'tae-yong.kil@kr.abb.com', NULL
FROM accounts
WHERE name = 'ABB 코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김건우', '매니저', '신사업추진센터 / Solar팀 / 창원사업장', '01026037821', 'hbkim0329@hanwha.com', '근무처 팩스: 055-210-6447'
FROM accounts
WHERE name = '한화';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김견빈', '주임', NULL, '01050062811', 'bill@tesko.kr', '근무처 팩스: 053-584-7521'
FROM accounts
WHERE name = '테스코';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김경범', '차장', '기계설계팀', '01074970109', 'jeil@jeilmach.com', '근무처 팩스: 054-773-3464'
FROM accounts
WHERE name = '제일기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김경섭', '부장', '관리팀', '01095956369', 'jeil@jeilmach.com', '근무처 팩스: 054-773-3464'
FROM accounts
WHERE name = '제일기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김경수', 'CQO / 상무', NULL, '01052452193', 'kskim@motfa.com', '근무처 팩스: 055-375-6227'
FROM accounts
WHERE name = '엠오티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김경열', '대표', NULL, '01042910128', 'k1021404@naver.com', NULL
FROM accounts
WHERE name = '투윈테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김경호', NULL, '설계기술팀', '01093818225', 'kola112@epnt.co.kr', '근무처 팩스: 054-972-9206'
FROM accounts
WHERE name = '피엔티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김경환', '부장 / 제품기술팀장', NULL, '01030253466', 'solder3896@tanhay.com', '근무처 팩스: 032-577-6896'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김광원', '대표', NULL, '01085220074', 'kkw0074@naver.com', '근무처 팩스: 051-319-4935'
FROM accounts
WHERE name = '케이원유공압';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김광중', '북부영업소장', NULL, '01031212323', 'go1000k@convum.co.kr', '근무처 팩스: 070-8668-2405'
FROM accounts
WHERE name = '컨범코리아';
