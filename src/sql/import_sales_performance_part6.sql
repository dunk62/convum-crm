-- Part 6 of Contact Import (mapped to sales_performance filenames)

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
