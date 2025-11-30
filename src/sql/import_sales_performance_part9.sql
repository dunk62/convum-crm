-- Part 9 of Contact Import (mapped to sales_performance filenames)

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
