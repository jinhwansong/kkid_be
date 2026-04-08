import { MigrationInterface, QueryRunner } from 'typeorm';

/** `video_metadata` 1:1 테이블을 `video` 컬럼으로 흡수 후 드롭 */
export class MergeVideoMetadata1762800000000 implements MigrationInterface {
  name = 'MergeVideoMetadata1762800000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "video" ADD COLUMN IF NOT EXISTS "creatorName" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "video" ADD COLUMN IF NOT EXISTS "creatorTitle" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "video" ADD COLUMN IF NOT EXISTS "slug" integer`,
    );

    const hasMeta = await queryRunner.hasTable('video_metadata');
    if (hasMeta) {
      await queryRunner.query(`
        UPDATE "video" v
        SET
          "creatorName" = m."creatorName",
          "creatorTitle" = m."creatorTitle",
          "slug" = m."slug",
          "thumbnailUrl" = COALESCE(v."thumbnailUrl", m."thumbnailUrl")
        FROM "video_metadata" m
        WHERE m."videoId" = v."id"
      `);
      await queryRunner.query(`DROP TABLE IF EXISTS "video_metadata"`);
    }

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "UQ_video_slug"
      ON "video" ("slug")
      WHERE "slug" IS NOT NULL
    `);
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // 복구는 생략 (레거시 테이블 재도입 시 수동)
  }
}
