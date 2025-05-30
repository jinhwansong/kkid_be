import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1748592437085 implements MigrationInterface {
    name = 'Migrations1748592437085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`video\` ADD \`playbackId\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`video\` ADD \`uploadId\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`video\` DROP COLUMN \`uploadId\``);
        await queryRunner.query(`ALTER TABLE \`video\` DROP COLUMN \`playbackId\``);
    }

}
