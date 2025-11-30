-- Import contacts from Excel
-- Maps '업체명' to account_id


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

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김군재', '생산기술본부장 / 전무', '중국공장 총괄', '01094670348', 'kjkim@guyoungtech.com', '근무처 팩스: 053-592-6567'
FROM accounts
WHERE name = '구영테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김규섭', '대표', NULL, '01041288337', 'dawon7789@naver.com', '근무처 팩스: 043-215-7790'
FROM accounts
WHERE name = '다원';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김규완', '대리', '부산지사', '01074260039', 'kgw0313@kccpr.com', '근무처 팩스: 051-316-3857'
FROM accounts
WHERE name = '케이시시정공';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김규환', '주임', '생산본부 설계팀', '01038294651', 'khkim1@avaco.com', '근무처 팩스: 053-588-9209'
FROM accounts
WHERE name = '아바코';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김기두', '책임', '설비기술.선행.설비표준화팀', '01072535553', 'kidoo.k@lgensol.com', NULL
FROM accounts
WHERE name = 'LG에너지솔루션';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김기성', '수석연구원', '기구설계', '01089691211', 'ks.kim2@ateco.co.kr', '근무처 팩스: 031-548-1509'
FROM accounts
WHERE name = '아테코';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김기영', '대표', NULL, '01020751479', 'CMD735@daum.net', '근무처 팩스: 055-905-2099'
FROM accounts
WHERE name = '씨엠디테크놀로지';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김남국', '부장', '기술부', '01088235042', 'skytech7@daum.net', '근무처 팩스: 055-374-1549'
FROM accounts
WHERE name = '스카이테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김남홍', '대표', NULL, '01025934477', 'knh_2002@naver.com', '근무처 팩스: 051-643-6777'
FROM accounts
WHERE name = '신용정밀미싱';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김대일', '대표', NULL, '01048465069', 'daeil70@chol.com', '근무처 팩스: 055-383-4062'
FROM accounts
WHERE name = '엠텍에프에이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김대희', '과장', '설계부', '01085028142', 'rlaeogml79@hanmail.net', '근무처 팩스: 055-266-7617'
FROM accounts
WHERE name = '덕성엠텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김도현', '부장', '기술연구소 자동화사업부', '01063937151', 'artrip1127@ekdm.co.kr', '근무처 팩스: 054-977-5214'
FROM accounts
WHERE name = 'KDM INTERNATIONAL';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김도형', '선임', 'ME사업부 설계기술Gr', '01075333744', 'szloves2@avaco.com', '근무처 팩스: 053-588-9209'
FROM accounts
WHERE name = 'AVACO';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김도훈', '부장', NULL, '01093253452', 'segovia9@naver.com', '근무처 팩스: 30309402791'
FROM accounts
WHERE name = '화인';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김동명', '선임연구원', 'C4팀', '01034325236', 'dmkim@topengnet.com', '근무처 팩스: 054-482-0346'
FROM accounts
WHERE name = '탑엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김동원', '주임연구원', '플랜트 사업부', '01041822347', 'dw.kim@dyto.co.kr', '근무처 팩스: 02-2098-9820'
FROM accounts
WHERE name = '디와이티오코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김동준', '대리', '구매팀', '01091182126', 'preng@korea.com', '근무처 팩스: 052-294-1078'
FROM accounts
WHERE name = 'PR';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김동현', '차장', '계측솔루션 영업팀', '01068254491', 'sales02@testa.co.kr', '근무처 팩스: 051-332-4501'
FROM accounts
WHERE name = '테스타';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김동협', '과장', '사업구매팀', '01098221775', 'donghyeop.kim@3tst.co.kr', '근무처 팩스: 054-471-5696'
FROM accounts
WHERE name = 'TST';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김동환', '수석연구원', '기술연구소', '01065199855', 'dhkim071@coretechsys.co.kr', '근무처 팩스: 054-975-3147'
FROM accounts
WHERE name = '코아테크시스템';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김두용', '대표이사', NULL, '01036108584', 'dykim@palbokin.com', '근무처 팩스: 063-236-8765'
FROM accounts
WHERE name = 'Palbok Industry';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김만기', '대리', '부산T-PLEX', '0517960114', '900z9g00@e-ncom.co.kr', '근무처 팩스: 051-796-0113'
FROM accounts
WHERE name = '엔컴';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김맹진', '대표', NULL, '01035820813', 'jisystems@hanmail.net', '근무처 팩스: 055-273-4564'
FROM accounts
WHERE name = '제이아이시스템즈';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김명', '선임', '구매Gr', '01040403252', 'mkim@avaco.com', '근무처 팩스: 053-588-9209'
FROM accounts
WHERE name = 'AVACO';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김민규', '科长', '技术营销部', '01025683801', 'mk@gpico.co.kr', '근무처 팩스: 055-912-7056'
FROM accounts
WHERE name = '지피아이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김민성', '사원', '선행생기실', '01086093466', 'kms0202@sjku.co.kr', '근무처 팩스: 052-290-1889'
FROM accounts
WHERE name = 'SEJONG';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김민정', '주임', '총무부', '01051568635', 'mj.kim@rotal.kr', '근무처 팩스: 051-911-2801'
FROM accounts
WHERE name = 'ROTAL';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김민지', '책임', '운영그룹 / 수출운영팀', '01039327876', 'mjkim1@serveone.co.kr', '근무처 팩스: 031-647-2210'
FROM accounts
WHERE name = '서브원';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김민찬', '부장', '기술부(설계팀)', '01079175580', 'mc_Kim@sungjoon.co.kr', '근무처 팩스: 031-376-6448'
FROM accounts
WHERE name = '성준전기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김민창', '대리', '관리부', '01073715555', 'whekfvo@sangsin.com', '근무처 팩스: 053-355-7466'
FROM accounts
WHERE name = '상신ENG';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김민철', '과장', '기술영업.설계팀', '01086418756', 'chris930@covatec.co.kr', '근무처 팩스: 054-462-6680'
FROM accounts
WHERE name = '코바텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김민호', '책임매니저', '설비관리4부', '01026994124', 'minhokim81@hyundai.com', NULL
FROM accounts
WHERE name = 'Hyundai Motor Company';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김민호', '과장', '구매부', '01054012029', 'younghofa@hanmail.net', '근무처 팩스: 054-475-6870'
FROM accounts
WHERE name = '영호엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김민환', '대리', 'FA제작관리팀', '01088584182', '30328@hyundai-wia.com', NULL
FROM accounts
WHERE name = '현대위아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김범석', '주임연구원', 'C3팀', '01040447603', 'bskim@topengnet.com', '근무처 팩스: 031-956-3599'
FROM accounts
WHERE name = '탑엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김병민', '이사', '생산기술부', '01083598359', 'slt0816@naver.com', '근무처 팩스: 054-777-6739'
FROM accounts
WHERE name = '에스엘티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김보현', '매니저', '경영기획부', '01042713326', 'kbh1124@convum.co.kr', '근무처 팩스: 02-6111-8006'
FROM accounts
WHERE name = '컨범코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김상기', '과장', '기업부설연구소 / 연구 1팀', '01031088064', 'ksk8064@nate.com', '근무처 팩스: 054-462-8675'
FROM accounts
WHERE name = '브이엔에스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김상민', '대리', '총무관리부', '01066682257', 'sammico@chol.com', '근무처 팩스: 052-281-7848'
FROM accounts
WHERE name = '삼미기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김상열', '차장', '기술영업부', '01045626280', 'wstechno@naver.com', '근무처 팩스: 031-236-8121'
FROM accounts
WHERE name = '우성테크노';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김상열', '과장', '경영기획실', '01058227311', 'knp.sykim19@kncorp.net', NULL
FROM accounts
WHERE name = '케이앤피';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김상용', '과장', '환경안전공무부', '01035194423', 'ksy@okfcorp.co.kr', '근무처 팩스: 054-856-1876'
FROM accounts
WHERE name = '오케이에프음료';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김상의', '책임', 'Display 사업본부 / ME사업부 설계기술Gr.', '01093738952', 'scroll12@avaco.com', '근무처 팩스: 053-588-9209'
FROM accounts
WHERE name = 'AVACO';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김상일', '그룹장', '설계기술 2그룹', '01045419598', 'sikim9598@wonik.com', '근무처 팩스: 043-218-7059'
FROM accounts
WHERE name = '원익피앤이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김상준', '센터장', '영업본부 구미Solution Center', '01077418836', 'abcd311@tanhay.com', '근무처 팩스: 070-4332-1588'
FROM accounts
WHERE name = 'TPC메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김석준', '주임', '설계실', '01065667420', 'lpt_md@naver.com', '근무처 팩스: 053-269-8999'
FROM accounts
WHERE name = '엘피티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김선영', '대표', NULL, '01098538622', 'ky8622@hanmail.net', '근무처 팩스: 051-715-2616'
FROM accounts
WHERE name = '금영산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김선우', '차장', 'FPD사업부 / 설계', '01092156643', 'sunwoo025@daewonfnc.com', '근무처 팩스: 054-474-7376'
FROM accounts
WHERE name = '대원에프엔씨';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김선우', '과장', '로봇자동화사업부', '01086270004', 'ksw0403@hcnc.co.kr', '근무처 팩스: 053-214-7086'
FROM accounts
WHERE name = '에이치씨엔씨';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김성길', '차장', '자동화기술팀 / 부산영업소', '01025781071', 'jrtbu@daum.net', NULL
FROM accounts
WHERE name = '주강로보테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김성동', '차장', '구매기획팀 / 구매담당', '01074554956', 'pmt@swmv.co.kr', '근무처 팩스: 055-289-0015'
FROM accounts
WHERE name = '성우테크론';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김성묵', '부장', '생산기술팀', '01025057831', 'win6867@naver.com', '근무처 팩스: 054-434-0637'
FROM accounts
WHERE name = '삼송';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김성민', '과장대리', '영업본부 / 경인영업소', '01085916932', 'sm4176@tanhay.com', '근무처 팩스: 032-578-0786'
FROM accounts
WHERE name = 'TPC메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김성봉', '책임 / Service and Solutions Manager', '유체제어사업부', '01082098727', 'SKim@emerson.com', '근무처 팩스: 051-265-0061'
FROM accounts
WHERE name = '아벤틱스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김성빈', '소장', '기계사업부 / 부산영업소', '01094670353', 'sbk6179@daesung.co.kr', '근무처 팩스: 051-831-4046'
FROM accounts
WHERE name = '대성산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김성식', '대표', NULL, '01055485041', 'bmtc0530@naver.com', '근무처 팩스: 051-925-5472'
FROM accounts
WHERE name = '부민테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김성준', '대리', '서울영업소', '01023432918', 'sjkim@daesung.co.kr', '근무처 팩스: 02-462-5925'
FROM accounts
WHERE name = '대성산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김소연', NULL, '설계팀', '01064701664', 'SoYeon.Kim@daejinmc.com', '근무처 팩스: 054-463-1465'
FROM accounts
WHERE name = '대진기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김수철', '이사', '설계부', '01093193637', 'hd@hyunduk.or.kr', '근무처 팩스: 052-261-3449'
FROM accounts
WHERE name = '현덕산기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김수훈', '차장', '기술관리부', '01027632288', 'ava@avao.co.kr', '근무처 팩스: 055-382-0310'
FROM accounts
WHERE name = '아바';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김승배', NULL, NULL, '01089023573', 'nts2795@naver.com', '근무처 팩스: 031-8042-3590'
FROM accounts
WHERE name = '앤티에스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김승현', '과장', '개발팀', '01073160725', 'minjungcat@yujinprecision.com', '근무처 팩스: 054-335-4985'
FROM accounts
WHERE name = '유진정밀';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '김승현', '차장', '설계팀', '01023648246', 'zipmman@hanmail.net', '근무처 팩스: 053-556-6808'
FROM accounts
WHERE name = '에이치엠티';

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

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박경태', '부산영업소장', '영업본부', '01020072101', 'ktpark@tanhay.com', '근무처 팩스: 051-312-8553'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박관수', '과장', '설계팀', '01090605645', 'pks@dmview.co.kr', '근무처 팩스: 070-5029-3234'
FROM accounts
WHERE name = '디엠뷰';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박관홍', '대리', '설계팀', '01090596465', 'pkh@lcd.co.kr', '근무처 팩스: 02-892-5090'
FROM accounts
WHERE name = '신도기연';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박광복', '차장', NULL, '01027478802', 'dwulsan1@hanmail.net', '근무처 팩스: 052-286-9393'
FROM accounts
WHERE name = '대응';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박기락', '부장', '연구개발팀', '01045039238', 'cnco2010@hanmail.net', '근무처 팩스: 070-7500-8245'
FROM accounts
WHERE name = '씨엔-코';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박기재', '매니저', '생산기술팀', '01027174301', 'kjpark1107@guyoungtech.com', '근무처 팩스: 053-592-6567'
FROM accounts
WHERE name = '구영테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박기형', '책임연구원 / 팀장', '기술연구소', '01046161128', 'pkh@taeyang.biz', '근무처 팩스: 051-305-6582'
FROM accounts
WHERE name = '티와이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박노익', '부장', NULL, '01048420481', 'noik6@nate.com', '근무처 팩스: 051-319-0483'
FROM accounts
WHERE name = '해동유공압';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박대영', '부장', '자동화팀', '01094181973', 'dy.park@tk.t2group.co.kr', '근무처 팩스: 055-330-1699'
FROM accounts
WHERE name = '태광실업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박덕규', '대표이사', NULL, '01038117887', 'pdg@kccpr.com', '근무처 팩스: 02-2679-8924'
FROM accounts
WHERE name = '케이시시정공';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박도섭', '팀장', NULL, '01049249882', 'parkzara@nate.com', '근무처 팩스: 051-314-1846'
FROM accounts
WHERE name = '우성뉴메틱';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박동민', '팀장', '영업부', '01087235770', 'dm_park@sungjoon.co.kr', '근무처 팩스: 031-376-6448'
FROM accounts
WHERE name = '성준전기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박동식', '기술기사', '울산공장-보전5부', '01035769197', 'SDP9197@dreamwiz.com', '근무처 팩스: 052-280-8932'
FROM accounts
WHERE name = 'Hyundai Motor Company';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박동준', '부장 / 팀장', '품질경영본부 제조기술팀', '01031248213', 'djpark@mirae.com', '근무처 팩스: 041-559-8909'
FROM accounts
WHERE name = '미래산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박명수', '차장', NULL, '01085021585', 'wwwskypms@naver.com', '근무처 팩스: 051-832-1491'
FROM accounts
WHERE name = '지티에스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박병갑', NULL, NULL, '01045801979', 'hitechwithyou@naver.com', '근무처 팩스: 054-613-5895'
FROM accounts
WHERE name = '에이치아이테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박병갑', '구미영업소장', '영업본부', '0175801979', 'byung@tanhay.com', '근무처 팩스: 054-474-8683'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박병곤', '부장', NULL, '01027872874', 'bgpark@addfa.co.kr', '근무처 팩스: 041-415-0012'
FROM accounts
WHERE name = '에드파';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박병규', '사원', '뉴비즈팀', '01051408545', 'pbkkong@eli-corp.com', '근무처 팩스: 031-306-0571'
FROM accounts
WHERE name = '이엘아이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박병규', '대리', '구매팀', '01093997172', 'buy@daebong.com', '근무처 팩스: 051-831-8880'
FROM accounts
WHERE name = '대봉기연';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박상원', '상무이사', NULL, '01026778296', 'handrobot@empas.com', '근무처 팩스: 053-556-6808'
FROM accounts
WHERE name = '에이치엠티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박상철', '차장', '설비 · 개발팀', '01049496559', 'bmwpsc@yujinprecision.com', '근무처 팩스: 054-335-4985'
FROM accounts
WHERE name = '유진정밀';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박상협', '프로', '구매팀', '01095969230', 'hyub@hb-solution.co.kr', '근무처 팩스: 041-549-1611'
FROM accounts
WHERE name = '에이치비솔루션';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박상호', '차장', '영업부', '01030344366', 'sh_park@sungjoon.co.kr', '근무처 팩스: 031-376-6448'
FROM accounts
WHERE name = '성준전기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박선용', '대리', '영업부', '01038952061', 'parksy@daeji.com', '근무처 팩스: 053-582-1614'
FROM accounts
WHERE name = '대지메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박성규', '대표', NULL, '01032894020', 'mypark4020@naver.com', '근무처 팩스: 055-276-7753'
FROM accounts
WHERE name = '신영에프앤티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박성민', '대리', '기술연구소', '01052854532', 'world-total@hanmail.net', '근무처 팩스: 054-976-1622'
FROM accounts
WHERE name = '월드이엔지';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박성용', '선임', 'OLight 기술팀', '01047550743', 'sy.park@lgdisplay.com', NULL
FROM accounts
WHERE name = 'LG디스플레이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박성우', '팀장', NULL, '01051048298', 'psw@jwrt.net', '근무처 팩스: 051-714-5738'
FROM accounts
WHERE name = '제이더블유이엔지';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박성재', '과장', '영업3파트', '01041679817', 'dk9817@dkautomation.co.kr', NULL
FROM accounts
WHERE name = '디케이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박성준', '선임', '자동화팀', '01086022291', 'sj.park4@taekwang.com', NULL
FROM accounts
WHERE name = 'TKG TAEKWANG CO., LTD.';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박성철', '상무이사 / 공장장', NULL, '01045876401', 'il6400@paran.com', '근무처 팩스: 052-288-6401'
FROM accounts
WHERE name = '일신테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박성하', '책임', '제조혁신.울산생산기술팀', '01076511397', 'sungha@lghausys.com', NULL
FROM accounts
WHERE name = 'LG하우시스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박수민', '과장', '기획부', '01093400331', 'sm_park@sungjoon.co.kr', '근무처 팩스: 031-376-6448'
FROM accounts
WHERE name = '성준전기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박수진', '대표이사', NULL, '01020284807', 'sjpark@saemtech.co.kr', '근무처 팩스: 054-716-2511'
FROM accounts
WHERE name = '샘테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박수혁', '책임연구원', '연구팀', '01071571053', 'ispark@jeilmach.com', '근무처 팩스: 054-773-3464'
FROM accounts
WHERE name = '제일기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박수현', '과장', '설계', '01077470842', 'act0310@naver.com', '근무처 팩스: 054-476-7803'
FROM accounts
WHERE name = '에이씨티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박순철', '공장장', '금속사업부', '01035578111', 'scpark@firebow.co.kr', '근무처 팩스: 055-345-2594'
FROM accounts
WHERE name = '디에프아이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박승규', '선임', '녹산공장 / 녹산환경공무팀', '01049206368', 'zeus909@nongshim.com', '근무처 팩스: 051-810-8761'
FROM accounts
WHERE name = '농심';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박승필', '매니저', '보전4부', '01091689418', 'sp.park@hyundai.com', '근무처 팩스: 052-215-7421'
FROM accounts
WHERE name = 'Hyundai Motor Company';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박영목', '과장', '설계팀', '01095110299', 'roam1@naver.com', '근무처 팩스: 054-474-9708'
FROM accounts
WHERE name = '에스케이테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박영수', '책임', '고객지원본부', '01049948059', 'youngsoop@smckorea.co.kr', '근무처 팩스: 02-3219-0702'
FROM accounts
WHERE name = '한국SMC';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박영수', '부장', NULL, '01050412692', 'samjungrobotics@naver.com', '근무처 팩스: 055-294-0476'
FROM accounts
WHERE name = '삼정로보틱스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박영진', '이사', NULL, '01047594611', 'pyj0918@hanmail.net', '근무처 팩스: 054-975-4612'
FROM accounts
WHERE name = '중원기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박영진', '차장', '관리부 / 구매팀', '01096967663', 'sm.u@sammico.com', '근무처 팩스: 052-298-2316'
FROM accounts
WHERE name = '삼미정공';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박영학', '이사', NULL, '01028248813', 'world-eng@hanmail.net', '근무처 팩스: 054-976-1622'
FROM accounts
WHERE name = '월드이엔지';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박원석', '대표', NULL, '01096278177', 'pslove0703@empal.com', '근무처 팩스: 053-588-3130'
FROM accounts
WHERE name = '로봇인포';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박원창', '차장', NULL, '01035556631', 'han_ljh@naver.com', '근무처 팩스: 54931990'
FROM accounts
WHERE name = '한성엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박유현', '상무이사', NULL, '01093143201', 'slt0816@naver.com', '근무처 팩스: 054-777-6739'
FROM accounts
WHERE name = '에스엘티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박윤미', '실장', NULL, '01074209994', NULL, '근무처 팩스: 051-796-0045'
FROM accounts
WHERE name = '삼덕공인중개사사무소';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박은비', '주임', '구매부', '01093715466', 'vvvv94@ost87.co.kr', '근무처 팩스: 053-710-5509'
FROM accounts
WHERE name = '오에스티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박재기', '상무', '기술영업부', '01086506198', 'jkpark@bmi-tech.kr', '근무처 팩스: 031-624-5504'
FROM accounts
WHERE name = '비엠아이텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박재민', '팀장', '개발', '07046522406', 'pjm5998@convum.co.kr', '근무처 팩스: 070-8668-2405'
FROM accounts
WHERE name = '컨범코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박재석', '대표', 'Industry Business', '01057594090', 'plsauto@naver.com', '근무처 팩스: 051-326-3302'
FROM accounts
WHERE name = '피엘에스 오토메이션';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박재현', '과장', '구매부', '01045754050', 'jhpark@hanjootech.co.kr', '근무처 팩스: 054-464-7032'
FROM accounts
WHERE name = '한주반도체';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박재호', '과장', '기업부설연구소 / 연구 1팀', '01090632678', 'pbarakisss@nate.com', '근무처 팩스: 054-462-8675'
FROM accounts
WHERE name = '브이엔에스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박재홍', '대표', NULL, '01034668103', 'hmt8103@nate.com', '근무처 팩스: 053-241-8102'
FROM accounts
WHERE name = '현민테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박정규', '부장', '기구개발팀', '01093231352', 'jgpark@gpico.co.kr', '근무처 팩스: 055-912-7056'
FROM accounts
WHERE name = '지피아이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박정민', '차장', '기술팀', '01074006615', 'jungmin.park@jscoltd.com', '근무처 팩스: 054-471-0729'
FROM accounts
WHERE name = '제이에스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박정배', '대리', '실린더기술팀', '01058916960', 'jbpark@tanhay.com', '근무처 팩스: 032-577-6896'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박정식', '소장 / 부장', '영업본부 / 부산영업소', '01035500454', 'jspark@tanhay.com', '근무처 팩스: 051-312-8553'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박정완', '이사', '기구개발팀', '01036405783', 'pjw@gpico.co.kr', '근무처 팩스: 055-912-7056'
FROM accounts
WHERE name = '지피아이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박정진', '책임', '영업본부 대구Solution Center', '01025082483', 'pgc@tanhay.com', '근무처 팩스: 070-4332-1588'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박제영', '책임연구원', 'G2팀', '01096771917', 'jypark@topengnet.com', '근무처 팩스: 054-482-0346'
FROM accounts
WHERE name = '탑엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박종범', '대리', '로봇사업부', '01050265938', 'Jongbeom.park@mail.robotech.co.kr', '근무처 팩스: 051-305-3908'
FROM accounts
WHERE name = 'ROBOTECH CO., LTD.';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박종웅', '과장', '설계팀', '01041337377', 'jajw10@hdm87.com', '근무처 팩스: 053-710-5509'
FROM accounts
WHERE name = '오에스티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박종현', '주임', NULL, '01063850338', 'geumha3341@naver.com', '근무처 팩스: 051-319-3342'
FROM accounts
WHERE name = '금하산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박종환', '선임연구원', 'G1팀', '01066755793', 'jonghwan@topengnet.com', '근무처 팩스: 054-480-0356'
FROM accounts
WHERE name = '탑엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박주범', '대표이사', NULL, '01041516963', 'svt6457@naver.com', '근무처 팩스: 053-616-6694'
FROM accounts
WHERE name = '성부팩';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박준언', '이사', '생산총괄', '01027075186', 'juneunp@hanmail.net', '근무처 팩스: 054-971-3449'
FROM accounts
WHERE name = '성우플라텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박준영', '매니저', '설비관리5부', '01031136828', 'jun0park@hyundai.com', NULL
FROM accounts
WHERE name = 'Hyundai Motor Company';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박준택', '차장', '자동화사업부', '01026216951', 'jeil0684@hanmail.net', '근무처 팩스: 062-956-1690'
FROM accounts
WHERE name = '제일';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박준형', '주임', '원가혁신팀', '01040760306', 'everwb6@gieng.com', '근무처 팩스: 054-471-9138'
FROM accounts
WHERE name = '구일엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박지수', '매니저', '기술영업 / 3D 메트롤로지 사업부', '01048018675', 'suya@is-soft.co.kr', '근무처 팩스: 031-436-1420'
FROM accounts
WHERE name = '이즈소프트';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박지호', '본부장', '영남지역영업본부', '01047472897', 'jiho.park@wjpim.com', '근무처 팩스: 051-831-3590'
FROM accounts
WHERE name = '우진플라임';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박지호', '대표', NULL, '01091888516', 'seungwon1315@naver.com', '근무처 팩스: 050-4342-8516'
FROM accounts
WHERE name = '승원산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박지훈', '대표이사', NULL, '01036584853', 'yr-4mll@hanmail.net', '근무처 팩스: 063-251-8812'
FROM accounts
WHERE name = 'eden story corporated';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박진철', '수석연구원', '기술연구소', '01051807940', 'j.c.park@sunstat.com', '근무처 팩스: 051-720-7501'
FROM accounts
WHERE name = 'SUNJE';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박진현', '책임', 'Robotics / Robotics and Motion', '01033823847', 'jin-hyun.park@kr.abb.com', NULL
FROM accounts
WHERE name = 'ABB 코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박진형', NULL, NULL, '01098793502', 'pjh3502@naver.com', '근무처 팩스: 051-918-2060'
FROM accounts
WHERE name = '다올SC';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박진흥', '과장', '자재관리팀', '01037919812', '2001kdm@hanmail.net', '근무처 팩스: 054-977-5214'
FROM accounts
WHERE name = 'K.D.M';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박찬영', '부장', NULL, '01056611438', 'techone7937@daum.net', '근무처 팩스: 055-323-7939'
FROM accounts
WHERE name = '테크원코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박철웅', '차장', '기술영업부', '01062419207', 'tomo@tomo-x.com', NULL
FROM accounts
WHERE name = 'TOMO';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박충현', '과장', 'FA제작관리팀', '01085188461', 'pcndgus@hyundai-wia.com', '근무처 팩스: 055-264-1646'
FROM accounts
WHERE name = '현대위아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박태용', '차장 / 책임연구원', NULL, '01093835306', 'whiteboom@ldk.kr', '근무처 팩스: 054-472-8483'
FROM accounts
WHERE name = '엘디케이';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박태웅', '주임', '부산영업소', '01043216104', 'jlcmjl@daesung.co.kr', '근무처 팩스: 051-831-4046'
FROM accounts
WHERE name = '대성산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박현수', '차장', '관리팀', '01087819347', 'phs0224@naver.com', '근무처 팩스: 054-773-3464'
FROM accounts
WHERE name = '제일기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박현정', '과장', '영업본부 / 부산영업소', '01025082166', 'hyunjung81@tanhay.com', '근무처 팩스: 051-312-8553'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '박호덕', '대표', NULL, '01038056558', 'vision-6558@hanmail.net', '근무처 팩스: 053-591-1339'
FROM accounts
WHERE name = '세원이엔지';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '배경영', 'Engineer', '기판솔루션사업부', '01025065379', 'kybbky.bae@samsung.com', '근무처 팩스: 051-970-7100'
FROM accounts
WHERE name = '삼성전기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '배민욱', '부사장', NULL, '01090772177', 'djmc2177@daejinmc.com', '근무처 팩스: 054-463-1465'
FROM accounts
WHERE name = '대진기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '배상용', '대표', NULL, '01023628674', 'sybae@nate.com', '근무처 팩스: 054-462-8675'
FROM accounts
WHERE name = '브이엔에스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '배영철', '대표', NULL, '01038447197', 'byc0987@chol.com', '근무처 팩스: 055-364-6466'
FROM accounts
WHERE name = '만리 유.공압 상사';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '배재곤', '차장', '사출팀', '01076751730', 'jgon1011@naver.com', '근무처 팩스: 054-476-3704'
FROM accounts
WHERE name = '태진A&T';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '배재현', '과장 / 책임', NULL, '01098715758', 'CMD735@daum.net', '근무처 팩스: 055-905-2099'
FROM accounts
WHERE name = '씨엠디테크놀로지';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '백민수', '연구원', 'C2기구팀', '01026633726', 'msbaek@topengnet.com', '근무처 팩스: 054-480-0398'
FROM accounts
WHERE name = '탑엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '백민승', '부장', '기술영업팀', '01056018642', 'anh8642@anh21.com', '근무처 팩스: 041-415-1116'
FROM accounts
WHERE name = '에이엔에이치';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '백성빈', '과장', '설계팀', '01097782084', 'bsb@dmview.co.kr', '근무처 팩스: 070-5029-3234'
FROM accounts
WHERE name = '디엠뷰';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '백성철', '대리', NULL, '01052671937', 'baek@glcompany.kr', '근무처 팩스: 070-4275-1728'
FROM accounts
WHERE name = 'GL COMPANY';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '백승록', '팀장', '기술연구소', '01093164916', 'starind.bsr@daum.net', '근무처 팩스: 051-609-9978'
FROM accounts
WHERE name = '스타인더스트리';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '백승식', '부장', '설계팀', '01084847431', 'satech21@daum.net', '근무처 팩스: 031-503-1642'
FROM accounts
WHERE name = '에스에이텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '백승헌', '과장대리', '영업본부 / 창원영업소', '01091962465', 'superz@tanhay.com', '근무처 팩스: 055-283-8502'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '백운남', '차장', '기술부', '01033201734', 'karate1@poweragv.com', '근무처 팩스: 051-305-4554'
FROM accounts
WHERE name = '한성웰텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '백운수', '과장', NULL, '01099563972', 'b2@nat21.co.kr', '근무처 팩스: 051-925-9950'
FROM accounts
WHERE name = '엔에이티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '백현민', '수석', '자동화팀', '01085100190', 'hm.baek@taekwang.com', NULL
FROM accounts
WHERE name = 'TKG TAEKWANG CO.,LTD.';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '변의민', NULL, NULL, '01047996052', 'eraesys@chol.com', '근무처 팩스: 054-475-5220'
FROM accounts
WHERE name = '이래 KOREA';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '변정식', '차장', '경영지원팀', '01085659272', 'bjs100425@nicsint.com', '근무처 팩스: 070-7596-2318'
FROM accounts
WHERE name = '닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '변진우', '과장', '생산1부', '01044885115', 'jwbyeon@sungmi.co.kr', '근무처 팩스: 055-901-0396'
FROM accounts
WHERE name = '성미';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '삼성전기 패드 테스트 담당자 프로', 'Professional', '패키지솔루션사업부 패키지부산제조G', '01022681125', 'dk9202.kim@samsung.com', NULL
FROM accounts
WHERE name = '삼성전기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '서경일', '과장', 'CA장비PM팀 / IT솔루션사업부', '01028090454', 'kiseo@hanwha.com', '근무처 팩스: 041-538-4949'
FROM accounts
WHERE name = '한화모멘텀';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '서대규', '실장', '개발부', '01085858495', 'sss@dks2004.com', '근무처 팩스: 054-472-5691'
FROM accounts
WHERE name = '디케이에스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '서대용', '차장', '생산관리팀', '01093301395', 'daeyong_seo@caltech.co.kr', '근무처 팩스: 050-7803-6484'
FROM accounts
WHERE name = '칼텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '서동현', '책임', '자동화팀', '01035668116', 'dh.seo@taekwang.com', NULL
FROM accounts
WHERE name = 'TKG TAEKWANG CO.,LTD.';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '서민수', '사원', '보전팀', '01071553275', 'akseb27@ihantec.com', '근무처 팩스: 051-726-9091'
FROM accounts
WHERE name = '한텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '서성희', '대표', '자동화 사업부', '01034797228', 'line_tech@nate.com', '근무처 팩스: 054-473-7229'
FROM accounts
WHERE name = '라인테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '서영수', '이사', 'PJT사업부 / 기술영업팀', '01038895098', 'seoysoo@thtech1.com', '근무처 팩스: 055-253-8406'
FROM accounts
WHERE name = '태현테크원';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '서원홍', '대리', '기계설계팀', '01026204250', 'psswh@jeilmach.com', '근무처 팩스: 054-773-3464'
FROM accounts
WHERE name = '제일기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '서유진', '대표', NULL, '01038321660', 'sat1660@naver.com', '근무처 팩스: 051-941-1665'
FROM accounts
WHERE name = '썬 오토텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '서윤석', '사원', '영업부', '01041581430', 'ys_seo@sungjoon.co.kr', '근무처 팩스: 031-376-6448'
FROM accounts
WHERE name = '성준전기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '서은석', '과장', '설계', '01028106340', 'ses@fosys.net', '근무처 팩스: 054-472-0634'
FROM accounts
WHERE name = '포시스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '서재석', '차장', '기술연구소 / 연구개발팀', '01085203596', 'unigeni@naver.com', '근무처 팩스: 054-773-6662'
FROM accounts
WHERE name = '영풍기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '서재석', '책임매니저', '개발구매팀', '01036701620', 'unigeni01@y-poong.co.kr', '근무처 팩스: 054-773-4101'
FROM accounts
WHERE name = '영풍기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '서재우', '책임', '연구·개발 & 설계 그룹', '01031574800', 'jwseo121@coretechsys.co.kr', '근무처 팩스: 054-975-3147'
FROM accounts
WHERE name = 'core tech system';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '서재철', '대표', NULL, '01038246832', 'sjcccc@naver.com', '근무처 팩스: 054-473-8691'
FROM accounts
WHERE name = 'Hanasys Co.Ltd';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '서정래', '팀장', NULL, '01091737711', 'hunter007@hanmail.net', '근무처 팩스: 30309402791'
FROM accounts
WHERE name = '화인';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '서정현', '책임연구원', '소재/생산기술원', '01084300821', 'junghyun.seo@lge.com', '근무처 팩스: 031-8054-2384'
FROM accounts
WHERE name = 'LG전자';

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

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이관우', '대리', NULL, '01062457900', 'koreaco89@naver.com', '근무처 팩스: 054-457-7751'
FROM accounts
WHERE name = '코리아 코퍼레이션';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이광규', NULL, NULL, '01025717429', 'sbmariolee@gmail.com', '근무처 팩스: 1'
FROM accounts
WHERE name = '에스비 코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이규웅', '대리', '생산기술팀', '01095064702', 'gyuwoong.lee@donghee.co.kr', '근무처 팩스: 041-541-7022'
FROM accounts
WHERE name = '베바스토동희';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이근대', '과장', '설계팀', '01055367098', 'lgd@global-tec.co.kr', '근무처 팩스: 054-472-0805'
FROM accounts
WHERE name = '글로벌텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이근수', '실장', NULL, '01047509155', 'lks10@eraekorea.net', '근무처 팩스: 054-475-5220'
FROM accounts
WHERE name = '이래코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이대기', '설계부장', NULL, '01075041309', 'hujtech@naver.com', NULL
FROM accounts
WHERE name = '현진테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이대성', '부장', NULL, '01045210402', 'nmtool@hanmail.net', '근무처 팩스: 052-260-0959'
FROM accounts
WHERE name = '농민산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이대영', '대리', '설계부', '01048174530', 'leedaeyoung01@gmail.com', '근무처 팩스: 054-715-7101'
FROM accounts
WHERE name = '트리엔';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이덕천', '기술주임', '울산공장-차체5부', '01075086305', 'ldc6305@naver.com', '근무처 팩스: 052-280-5977'
FROM accounts
WHERE name = 'Hyundai Motor Company';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이덕희', '이사', NULL, '01094080989', 'leedh@autotec.co.kr', '근무처 팩스: 052-923-4725'
FROM accounts
WHERE name = '오토텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이도현', '소장', '창원영업소', '01071356376', 'jrtmt@jrtfa.com', NULL
FROM accounts
WHERE name = '주강로보테크';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이동규', '과장', '구매팀', '01054285830', 'leedongkyu@ureafac.co.kr', '근무처 팩스: 055-261-9188'
FROM accounts
WHERE name = '우레아텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이동규', '과장', '연구소', '01087813947', 'leedg@daewon.com', '근무처 팩스: 054-979-2276'
FROM accounts
WHERE name = '대원GSI';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이동배', '대표이사', NULL, '01038521584', 'magic4@chol.com', '근무처 팩스: 052-277-6101'
FROM accounts
WHERE name = '매직시스템';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이동언', '과장', '설계부', '01064883655', 'tst4312@naver.com', '근무처 팩스: 054-471-5696'
FROM accounts
WHERE name = '티에스티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이동철', NULL, NULL, '01099507750', 'koreaco89@naver.com', '근무처 팩스: 054-457-7751'
FROM accounts
WHERE name = '코리아 코퍼레이션';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이동현', '사원', '설비기술.선행.제어표준화팀', '01027720227', 'mmig611@lgensol.com', NULL
FROM accounts
WHERE name = 'LG 에너지솔루션';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이두원', '대리', '울산사무소', '01043445201', 'leeduwon@ckd-k.co.kr', '근무처 팩스: 052-288-5084'
FROM accounts
WHERE name = 'CKD한국';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이명식', '과장', '부산영업본부', '01076448048', 'mslee@daesung.co.kr', '근무처 팩스: 070-4360-3711'
FROM accounts
WHERE name = '대성산업';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이문기', '대표', NULL, '01091208723', 'ceo.advance@daum.net', '근무처 팩스: 054-771-4840'
FROM accounts
WHERE name = 'Advance';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이민성', '사원', '기술부', '01075724688', 'younghofa@hanmail.net', '근무처 팩스: 054-715-6828'
FROM accounts
WHERE name = '영호엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이민수', '부장', '관리팀', '01038220816', 'mslee@jscoltd.com', '근무처 팩스: 054-471-0729'
FROM accounts
WHERE name = '제이에스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이민형', '수석연구원 / 팀장', 'G3팀', '01095513815', 'mhlee@topengnet.com', '근무처 팩스: 054-482-0346'
FROM accounts
WHERE name = '탑엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이범일', '부장', NULL, '01075774452', 'bilee@fusionenc.com', '근무처 팩스: 054-461-7110'
FROM accounts
WHERE name = 'FUSION.ENC';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이병곤', '부장', '설계부', '01074856565', 'leebg@ost87.co.kr', '근무처 팩스: 053-710-5501'
FROM accounts
WHERE name = '오에스티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이병재', '소장', '부산영업소', '01050628602', 'bjlee@abimaneng.com', '근무처 팩스: 055-785-5052'
FROM accounts
WHERE name = '아비만엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이병현', '과장', '탈기사업부', '01091869095', 'pk@phloxkorea.com', '근무처 팩스: 031-314-7379'
FROM accounts
WHERE name = '프록스코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이병환', '센터장', '영업본부 울산Solution Center', '01052304579', 'leebh@tanhay.com', '근무처 팩스: 070-4332-1588'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이병희', '차장', '제어기술부', '01029717430', 'system@ropick.com', '근무처 팩스: 032-875-3273'
FROM accounts
WHERE name = '로픽';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이보용', '대표', NULL, '01065162388', 'lcdlap@naver.com', '근무처 팩스: 054-478-6754'
FROM accounts
WHERE name = '엘텍';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이상국', '부장', '설계영업1팀', '01042007483', 'sangguk.lee@3tst.co.kr', '근무처 팩스: 054-471-5696'
FROM accounts
WHERE name = '티에스티';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이상민', '대리', '자동화기술팀', '01040872860', 'smlee78@hyundai-wia.com', '근무처 팩스: 052-264-9811'
FROM accounts
WHERE name = '현대위아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이상민', '팀장', '영업부', '01049472533', 'smlee@yu-han.co.kr', '근무처 팩스: 02-2635-5149'
FROM accounts
WHERE name = '제이에스 자동화';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이상석', '차장', '대구공장 생산관리팀', '01074260059', 'morich@hanmail.net', '근무처 팩스: 053-586-4138'
FROM accounts
WHERE name = '케이시시정공';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이상수', '과장', NULL, '01051694550', 'leess@novainc.co.kr', '근무처 팩스: 054-475-2536'
FROM accounts
WHERE name = '노바';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이상엽', '대표', NULL, '01093836544', 'ceo@tesko.kr', '근무처 팩스: 053-584-7521'
FROM accounts
WHERE name = '테스코';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이상용', '팀장 / 국제공인 구매관리사(CPSM)', '구매그룹 / 구매3담당 / 건설/유공압팀', '01020578345', '77forever@serveone.co.kr', NULL
FROM accounts
WHERE name = '서브원';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이상인', '책임', '로봇사업본부', '01093412918', 'silee@electrix.co.kr', '근무처 팩스: 051-972-8387'
FROM accounts
WHERE name = 'ELECTRIX';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이상준', '과장', '설계', '01052925808', 'lsj@novainc.co.kr', '근무처 팩스: 054-475-2536'
FROM accounts
WHERE name = '노바';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이상진', '매니저', '영업본부 대전Solution Center', '01063233844', 'lsj6323@tanhay.com', '근무처 팩스: 070-4332-1588'
FROM accounts
WHERE name = 'TPC 메카트로닉스';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이상혁', '대표이사', NULL, '01039031010', 'skfa1013@naver.com', '근무처 팩스: 053-604-1017'
FROM accounts
WHERE name = '세광F·A SYSTEM';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이상호', '대표', '울산영업소', '0175816980', 'lhhyd@hanmail.net', '근무처 팩스: 052-265-1810'
FROM accounts
WHERE name = '이화유공압';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이상훈', '과장', '국내영업팀', '01038286767', 'gageplus@sanga2000.com', '근무처 팩스: 053-583-5209'
FROM accounts
WHERE name = '상아뉴매틱';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이상희', '자동화팀장 / 이사', NULL, '01044602310', 'steve.lee@taekwang.com', NULL
FROM accounts
WHERE name = 'TKG TAEKWANG CO., LTD.';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이선예', '책임', '자동화팀', '01095582046 ::: 01024428477', 'sy.lee2@taekwang.com', '근무처 팩스: 055-330-1699'
FROM accounts
WHERE name = 'TKG TAEKWANG CO., LTD.';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이선준', '주임', '영업부', '01093705213', 'sj_lee@sungjoon.co.kr', '근무처 팩스: 031-376-6448'
FROM accounts
WHERE name = '성준전기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이성국', '대리', '장비사업부 / 기구설계', '01091797913', 'design@swmv.co.kr', '근무처 팩스: 055-289-0015'
FROM accounts
WHERE name = '성우테크론';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이성규', 'CEO', NULL, '01046594655', 'sion@sionak.com', '근무처 팩스: 050-4236-4655'
FROM accounts
WHERE name = '시온오토메이션';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이성근', '책임', '특수선구매팀 / 특수선사업부', '01029694678', 'mrleesg@hanwha.com', NULL
FROM accounts
WHERE name = '한화오션';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이성무', '사원', '설계팀', '01068286883', 'lsm@hansong.co.kr', '근무처 팩스: 054-462-9932'
FROM accounts
WHERE name = '한송';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이성훈', '차장', 'Robotics / Robotics and Motion', '01087074528', 'sung-hoon.lee@kr.abb.com', NULL
FROM accounts
WHERE name = 'ABB 코리아';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이성훈', '과장대리', 'Robot사업부 / INR부 / 기술Team', '01093624528', 'shlee@yaskawa.co.kr', '근무처 팩스: 053-581-1220'
FROM accounts
WHERE name = '한국야스카와전기';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이수진', '팀장', '설계팀', '01020905036', 'soojin.lee@daejinmc.com', '근무처 팩스: 054-463-1465'
FROM accounts
WHERE name = '대진기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이수형', '팀장', '기계베어링2팀 / 영남사업부 / 무역', '01047193652', 'soohlee@hanwha.com', '근무처 팩스: 051-320-9930'
FROM accounts
WHERE name = '한화';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이순기', '차장', '영업부', '01093530970', 'younghofa@hanmail.net', '근무처 팩스: 054-715-6828'
FROM accounts
WHERE name = '영호엔지니어링';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이승민', '팀장', '구매팀', '01021662682', 'seungmin.lee@daejinmc.com', '근무처 팩스: 054-463-1465'
FROM accounts
WHERE name = '대진기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이승아', '차장', '자동화사업부', '01097440987', 'sa.lee@rotal.kr', '근무처 팩스: 051-911-2801'
FROM accounts
WHERE name = 'ROTAL';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이승일', '차장', '설계팀', '01071023152', 'seungil.lee@daejinmc.com', '근무처 팩스: 054-463-1465'
FROM accounts
WHERE name = '대진기계';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이승철', '선임연구원', '연구소', '01074746020', 'sclee099@coretechsys.co.kr', '근무처 팩스: 054-975-3147'
FROM accounts
WHERE name = '코아테크시스템';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이승학', '대표이사', NULL, '01093818947', 'shlee7472@nate.com', '근무처 팩스: 054-462-7108'
FROM accounts
WHERE name = '티. 엔. 아이 Tech';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이승호', '과장', '부산)OEM관리파트', '01093407127', 'sh.lee16@cj.net', NULL
FROM accounts
WHERE name = 'CJ 제일제당';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이승희', '대표이사', NULL, '01055281143', 'sungjinfa1@naver.com', '근무처 팩스: 055-237-9851'
FROM accounts
WHERE name = '성진자동화';

INSERT INTO contacts (account_id, name, position, department, phone, email, memo)
SELECT id, '이영석', '대리', '부산지사', '01074260062', 'lys2@kccpr.com', '근무처 팩스: 051-316-3857'
FROM accounts
WHERE name = '케이시시정공';

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
