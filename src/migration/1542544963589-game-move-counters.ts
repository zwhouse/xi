import {MigrationInterface, QueryRunner} from "typeorm";

export class gameMoveCounters1542544963589 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "game" ADD "moveDatesJson" text`);
        await queryRunner.query(`ALTER TABLE "game" ADD "minutesPerMove" integer`);
        await queryRunner.query(`ALTER TABLE "game" ADD "countdownMinutes" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "countdownMinutes"`);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "minutesPerMove"`);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "moveDatesJson"`);
    }

}
