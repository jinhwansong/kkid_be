import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1748493163751 implements MigrationInterface {
    name = 'Migrations1748493163751'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 컬럼 구조를 수정할 경우
  await queryRunner.query(`ALTER TABLE \`user\` MODIFY COLUMN \`username\` varchar(30) NOT NULL`);

  // unique 인덱스가 없다면 추가 (MySQL은 중복 시 무시 안 함 주의)
  await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_78a916df40e02a9deb1c4b75ed\` ON \`user\` (\`username\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP INDEX \`IDX_78a916df40e02a9deb1c4b75ed\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`username\``);
    }

}
