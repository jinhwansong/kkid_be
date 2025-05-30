import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1748592912398 implements MigrationInterface {
    name = 'Migrations1748592912398'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`video\` CHANGE \`videoUrl\` \`videoUrl\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`video\` CHANGE \`videoUrl\` \`videoUrl\` varchar(255) NOT NULL`);
    }

}
