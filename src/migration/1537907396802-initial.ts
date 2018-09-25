import {MigrationInterface, QueryRunner} from "typeorm";

export class initial1537907396802 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "email" character varying(200) NOT NULL, "passwordHash" character varying(100) NOT NULL, "confirmedEmail" boolean NOT NULL, "rating" integer NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user"("email") `);
        await queryRunner.query(`CREATE INDEX "IDX_ad2ee31db1205877c80f23cca9" ON "user"("rating") `);
        await queryRunner.query(`CREATE TABLE "game" ("id" SERIAL NOT NULL, "created" TIMESTAMP NOT NULL, "movesJson" text NOT NULL, "isGameOver" boolean NOT NULL, "drawProposalCode" character varying NOT NULL, "pointsRed" integer NOT NULL, "pointsBlack" integer NOT NULL, "redPlayerId" integer, "blackPlayerId" integer, "turnPlayerId" integer, "winnerId" integer, CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b962fe326f65f42a9e38479c5b" ON "game"("created") `);
        await queryRunner.query(`CREATE INDEX "IDX_f01f3e2613212299e4cd72ca8c" ON "game"("redPlayerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_aeb7adfc37d1757192a10d2c98" ON "game"("blackPlayerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_782c398497a5cf5de1c63a9d17" ON "game"("turnPlayerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cd57acb58d1147c23da5cd09ca" ON "game"("winnerId") `);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_f01f3e2613212299e4cd72ca8c4" FOREIGN KEY ("redPlayerId") REFERENCES "user"("id")`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_aeb7adfc37d1757192a10d2c983" FOREIGN KEY ("blackPlayerId") REFERENCES "user"("id")`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_782c398497a5cf5de1c63a9d172" FOREIGN KEY ("turnPlayerId") REFERENCES "user"("id")`);
        await queryRunner.query(`ALTER TABLE "game" ADD CONSTRAINT "FK_cd57acb58d1147c23da5cd09cae" FOREIGN KEY ("winnerId") REFERENCES "user"("id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_cd57acb58d1147c23da5cd09cae"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_782c398497a5cf5de1c63a9d172"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_aeb7adfc37d1757192a10d2c983"`);
        await queryRunner.query(`ALTER TABLE "game" DROP CONSTRAINT "FK_f01f3e2613212299e4cd72ca8c4"`);
        await queryRunner.query(`DROP INDEX "IDX_cd57acb58d1147c23da5cd09ca"`);
        await queryRunner.query(`DROP INDEX "IDX_782c398497a5cf5de1c63a9d17"`);
        await queryRunner.query(`DROP INDEX "IDX_aeb7adfc37d1757192a10d2c98"`);
        await queryRunner.query(`DROP INDEX "IDX_f01f3e2613212299e4cd72ca8c"`);
        await queryRunner.query(`DROP INDEX "IDX_b962fe326f65f42a9e38479c5b"`);
        await queryRunner.query(`DROP TABLE "game"`);
        await queryRunner.query(`DROP INDEX "IDX_ad2ee31db1205877c80f23cca9"`);
        await queryRunner.query(`DROP INDEX "IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
