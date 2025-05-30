import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1748493163751 implements MigrationInterface {
    name = 'Migrations1748493163751'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`username\` varchar(30) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` (\`username\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`username\``);
    }

}
