import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1750339581946 implements MigrationInterface {
    name = 'Migrations1750339581946'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`video\` ADD \`duration\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_e2364281027b926b879fa2fa1e\` (\`nickname\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_e2364281027b926b879fa2fa1e\``);
        await queryRunner.query(`ALTER TABLE \`video\` DROP COLUMN \`duration\``);
    }

}
