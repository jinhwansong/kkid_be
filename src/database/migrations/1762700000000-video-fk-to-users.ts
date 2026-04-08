import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * 레거시 `user`(uuid PK, userId=jammit id) 제거 전,
 * video / comment / like 의 FK를 `users`(Jammit) 정수 id로 옮긴다.
 * 신규 DB에 `user` 테이블이 없으면 스킵한다.
 */
export class VideoFkToUsers1762700000000 implements MigrationInterface {
  name = 'VideoFkToUsers1762700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasLegacy = await queryRunner.hasTable('user');
    if (!hasLegacy) {
      return;
    }

    const dropUserFks = async (table: string) => {
      const fks: { constraint_name: string }[] = await queryRunner.query(
        `
        SELECT tc.constraint_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        WHERE tc.table_schema = 'public'
          AND tc.table_name = $1
          AND tc.constraint_type = 'FOREIGN KEY'
          AND kcu.column_name = 'userId'
        `,
        [table],
      );
      for (const { constraint_name } of fks) {
        await queryRunner.query(
          `ALTER TABLE "${table}" DROP CONSTRAINT "${constraint_name}"`,
        );
      }
    };

    for (const t of ['video', 'comment', 'like']) {
      await dropUserFks(t);
      await queryRunner.query(
        `ALTER TABLE "${t}" ADD COLUMN IF NOT EXISTS "userId_new" integer`,
      );
      await queryRunner.query(
        `
        UPDATE "${t}" x
        SET "userId_new" = su."userId"
        FROM "user" su
        WHERE x."userId"::text = su.id::text
        `,
      );
      await queryRunner.query(
        `DELETE FROM "${t}" WHERE "userId_new" IS NULL`,
      );
      await queryRunner.query(
        `ALTER TABLE "${t}" ALTER COLUMN "userId_new" SET NOT NULL`,
      );
      await queryRunner.query(`ALTER TABLE "${t}" DROP COLUMN "userId"`);
      await queryRunner.query(
        `ALTER TABLE "${t}" RENAME COLUMN "userId_new" TO "userId"`,
      );
      await queryRunner.query(
        `
        ALTER TABLE "${t}"
        ADD CONSTRAINT "FK_${t}_users_userId"
        FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE
        `,
      );
    }

    await queryRunner.query(`DROP TABLE IF EXISTS "user"`);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // 데이터 이전은 되돌리지 않음
  }
}
