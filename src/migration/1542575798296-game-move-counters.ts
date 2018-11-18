import {MigrationInterface, QueryRunner} from "typeorm";

export class gameMoveCounters1542575798296 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "game" ADD "moveDatesJson" text NOT NULL DEFAULT '[]'`);
        await queryRunner.query(`ALTER TABLE "game" ADD "minutesPerMove" integer NOT NULL DEFAULT 5760`);
        await queryRunner.query(`ALTER TABLE "game" ADD "countdownMinutes" integer NOT NULL DEFAULT 5760`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "countdownMinutes"`);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "minutesPerMove"`);
        await queryRunner.query(`ALTER TABLE "game" DROP COLUMN "moveDatesJson"`);
    }

}
