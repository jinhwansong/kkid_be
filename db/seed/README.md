# DB 시드 데이터 (Nest / Supabase PostgreSQL 공통)

SQL 파일은 Supabase **SQL Editor**에 붙여 넣어 실행하거나, 아래 npm 스크립트로 같은 DB에 실행할 수 있습니다.

## 테이블이 아예 없을 때 (DB를 비우거나 새 프로젝트)

`users` 등 테이블이 없으면 시드 SQL은 **실행되지 않습니다.** 먼저 TypeORM 마이그레이션으로 스키마를 만듭니다.

```bash
npm run db:migrate
```

`.env`의 `DB_*`(또는 `DATABASE_URL`)가 같은 DB를 가리키는지 확인하세요. 평소에는 `TYPEORM_SYNCHRONIZE`는 `false`를 권장합니다.

## 한 번에 “전부 밀고” 데모 데이터까지

`JAMMIT_BE2` 루트, `.env`의 `DB_*` 또는 `DATABASE_URL` 설정 후:

```bash
npm run seed:fresh
```

순서: **`reset-all-data.sql`** (비디오·Jammit·댓글·좋아요 전부) → **`bootstrap-jammit-owner.sql`** (모임 시드용 계정) → **`gathering-seed.sql`** → **`user-review-seed.sql`**

> 스키마까지 지운 직후라면 **먼저** `npm run db:migrate`로 테이블을 만든 뒤 `seed:fresh`를 실행하세요. (`migrations`만 비운 경우에도 마이그레이션을 다시 적용해야 합니다.)

- `bootstrap-jammit-owner.sql` 기본 계정: `song7022556@gmail.com` / 비밀번호 **`password`** (해시는 더미 유저와 동일). 이메일·닉은 파일에서 바꿀 수 있습니다.

## 개별 스크립트

| 명령 | 내용 |
|------|------|
| `npm run seed:reset-data` | 앱 데이터만 전부 삭제 (`migrations` 테이블은 유지) |
| `npm run seed:bootstrap-owner` | gathering 시드용 Jammit `users` 1명 |
| `npm run seed:gathering` | 모임 100건 |
| `npm run seed:user-review` | 더미 유저 15명 + 리뷰 |
| `npm run seed:cleanup` | 모임·리뷰 등만 삭제 (`users`는 유지, 더미만 지울 땐 파일 내 주석 참고) |

임의 SQL:

```bash
npm run sql:run -- db/seed/gathering-seed.sql
```

연결 문자열 한 줄: `.env`에 `DATABASE_URL` 또는 `SUPABASE_DB_URL`, `DB_SSL=true`.

## 파일 요약

- **reset-all-data.sql** — `comment`, `like`, `video`, `"user"`(있을 때), Jammit 전 테이블 등 TRUNCATE
- **bootstrap-jammit-owner.sql** — `song7022556@gmail.com` (gathering-seed 전제)
- **gathering-seed.sql** — 모임 100건 + 장르·세션
- **user-review-seed.sql** — `dummy*@jammit.test`, 비밀번호 `password`
- **cleanup.sql** — 모임·리뷰 위주 부분 삭제 (전체 초기화는 `seed:reset-data` 사용)

## gathering-seed.sql

- `created_by` / `updated_by`: `email = song7022556@gmail.com` 인 유저 필요 (`seed:fresh`가 자동 삽입)

## user-review-seed.sql

- `ON CONFLICT (email) DO NOTHING` (더미 유저)
- COMPLETED 모임에 리뷰 추가 — 중복 실행 시 리뷰만 계속 쌓일 수 있음
