import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1750529664396 implements MigrationInterface {
    name = 'Migrations1750529664396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`video\` ADD \`assetId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`video\` DROP COLUMN \`title\``);
        await queryRunner.query(`ALTER TABLE \`video\` ADD \`title\` varchar(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`video\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`video\` ADD \`description\` varchar(300) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`video\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`video\` ADD \`description\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`video\` DROP COLUMN \`title\``);
        await queryRunner.query(`ALTER TABLE \`video\` ADD \`title\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`video\` DROP COLUMN \`assetId\``);
    }

}
