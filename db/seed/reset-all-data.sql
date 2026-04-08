-- ============================================================
-- 앱 데이터 전부 삭제 (스키마·TypeORM migrations 테이블은 유지)
-- 비디오·Jammit·댓글·좋아요·유저(양쪽) 모두 비움
-- 실행: npm run seed:reset-data
-- 다음: bootstrap-jammit-owner.sql → seed:gathering → seed:user-review
--        또는 npm run seed:fresh
-- ============================================================

TRUNCATE TABLE
  comment,
  "like",
  video,
  "user",
  review,
  gathering_participant,
  gathering_genres,
  gathering_session,
  gathering,
  preferred_genre,
  preferred_band_session,
  users
RESTART IDENTITY CASCADE;
