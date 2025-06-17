import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1750162912213 implements MigrationInterface {
    name = 'Migrations1750162912213'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`userId\` varchar(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_d72ea127f30e21753c9e229891\` (\`userId\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_e2364281027b926b879fa2fa1e\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_d72ea127f30e21753c9e229891\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`userId\``);
    }

}
