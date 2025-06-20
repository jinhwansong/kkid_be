import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1750435022725 implements MigrationInterface {
    name = 'Migrations1750435022725'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comment\` DROP FOREIGN KEY \`FK_e3aebe2bd1c53467a07109be596\``);
        await queryRunner.query(`ALTER TABLE \`comment\` DROP COLUMN \`parentId\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`comment\` ADD \`parentId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`comment\` ADD CONSTRAINT \`FK_e3aebe2bd1c53467a07109be596\` FOREIGN KEY (\`parentId\`) REFERENCES \`comment\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
