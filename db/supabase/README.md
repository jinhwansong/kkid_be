# Supabase에서 SQL 실행하기

## 0) 테이블이 없을 때

대시보드에서 DB를 비우거나 새 Supabase 프로젝트라 `users` 등 테이블이 없으면, SQL 시드만으로는 시작할 수 없습니다. 로컬에서 마이그레이션을 적용합니다.

```bash
# JAMMIT_BE2 루트, .env에 Supabase DB 연결 정보
npm run db:migrate
```

이후 아래 SQL Editor 또는 `npm run sql:run`으로 시드하면 됩니다.

## 1) 대시보드 SQL Editor

1. [Supabase Dashboard](https://supabase.com/dashboard) → 프로젝트 → **SQL Editor**
2. `db/seed/*.sql` 또는 직접 작성한 SQL을 붙여 넣고 **Run**

스키마는 Nest(TypeORM 마이그레이션·`synchronize`)로 이미 있다고 가정합니다. 여기서는 시드·수정용 스크립트만 올립니다.

## 2) 로컬에서 Node로 실행 (동일 DB)

Supabase **Settings → Database → Connection string → URI** 를 복사해 `.env`에 넣습니다.

```env
# 예: pooler(6543) 또는 direct(5432) URI
DATABASE_URL=postgresql://postgres.[ref]:[PASSWORD]@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres
DB_SSL=true
```

`JAMMIT_BE2` 루트에서:

```bash
npm run sql:run -- db/seed/gathering-seed.sql
```

`scripts/run-sql.ts`가 `pg`로 파일 전체를 한 번에 실행합니다. `DB_HOST` / `DB_PORT` / `DB_USERNAME` … 방식도 그대로 지원합니다 (`dataSource.ts`와 동일).

## 3) Supabase CLI 마이그레이션 (선택)

CLI로 버전 관리하려면 프로젝트 루트에 `supabase/` 초기화 후 `supabase/migrations/`에 `.sql`을 두고 `supabase db push` 등을 사용합니다. 이 레포는 Nest 쪽 시드를 `db/seed/`에 두었으므로, CLI용으로 파일을 복사해 넣어도 됩니다.
