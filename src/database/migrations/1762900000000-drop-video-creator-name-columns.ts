import { MigrationInterface, QueryRunner } from 'typeorm';

/** `creatorName` / `creatorTitle` 는 업로더 `users` 행과 중복 → 제거 */
export class DropVideoCreatorNameColumns1762900000000 implements MigrationInterface {
  name = 'DropVideoCreatorNameColumns1762900000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "video" DROP COLUMN IF EXISTS "creatorName"`,
    );
    await queryRunner.query(
      `ALTER TABLE "video" DROP COLUMN IF EXISTS "creatorTitle"`,
    );
  }

  public async down(_queryRunner: QueryRunner): Promise<void> {
    // 복구 생략
  }
}
