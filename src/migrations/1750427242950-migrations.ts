import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1750427242950 implements MigrationInterface {
    name = 'Migrations1750427242950'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`profileImagePath\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`profileImagePath\``);
    }

}
