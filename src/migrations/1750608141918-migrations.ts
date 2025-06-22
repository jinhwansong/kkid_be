import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1750608141918 implements MigrationInterface {
    name = 'Migrations1750608141918'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`video_metadata\` (\`id\` varchar(36) NOT NULL, \`creatorName\` varchar(255) NULL, \`creatorTitle\` varchar(255) NULL, \`thumbnailUrl\` varchar(255) NULL, \`slug\` varchar(255) NULL, \`videoId\` varchar(36) NULL, UNIQUE INDEX \`IDX_8217cf220abe89a0fa0cd34a7e\` (\`slug\`), UNIQUE INDEX \`REL_560ee663dbcf6cb8d4be7d1a7c\` (\`videoId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`video_metadata\` ADD CONSTRAINT \`FK_560ee663dbcf6cb8d4be7d1a7c6\` FOREIGN KEY (\`videoId\`) REFERENCES \`video\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`video_metadata\` DROP FOREIGN KEY \`FK_560ee663dbcf6cb8d4be7d1a7c6\``);
        await queryRunner.query(`DROP INDEX \`REL_560ee663dbcf6cb8d4be7d1a7c\` ON \`video_metadata\``);
        await queryRunner.query(`DROP INDEX \`IDX_8217cf220abe89a0fa0cd34a7e\` ON \`video_metadata\``);
        await queryRunner.query(`DROP TABLE \`video_metadata\``);
    }

}
