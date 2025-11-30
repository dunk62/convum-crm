-- Part 5 of Contact Import (mapped to sales_performance filenames)

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
