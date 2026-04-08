-- ============================================================
-- 시드 데이터 전체 삭제
-- gathering / user_review 시드 후 DB 초기화용
-- 실행: npm run seed:cleanup
-- ============================================================

-- FK 순서대로 삭제
DELETE FROM review;
DELETE FROM gathering_participant;
DELETE FROM gathering_genres;
DELETE FROM gathering_session;
DELETE FROM gathering;

-- 더미 유저만 지우려면 아래 주석 해제
-- DELETE FROM users WHERE email LIKE 'dummy%@jammit.test';
