-- ============================================================
-- gathering-seed.sql 이 요구하는 소유자 계정 1명 삽입
-- 이메일·비번은 필요 시 수정 후 사용
-- 비밀번호 평문: password (BCrypt는 user-review-seed 더미와 동일 해시)
-- 실행: npm run sql:run -- db/seed/bootstrap-jammit-owner.sql
-- ============================================================

INSERT INTO users (email, password, username, nickname, oauth_platform, created_at, updated_at)
VALUES (
  'song7022556@gmail.com',
  '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG',
  '시드소유자',
  '시드소유자',
  'NONE',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO UPDATE SET
  updated_at = EXCLUDED.updated_at;
