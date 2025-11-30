-- Part 2 of Contact Import (mapped to sales_performance filenames)

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
