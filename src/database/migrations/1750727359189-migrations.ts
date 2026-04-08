import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1750727359189 implements MigrationInterface {
    name = 'Migrations1750727359189'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_8217cf220abe89a0fa0cd34a7e"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX IF NOT EXISTS "IDX_8217cf220abe89a0fa0cd34a7e" ON "video_metadata" ("slug")`);
    }

}
