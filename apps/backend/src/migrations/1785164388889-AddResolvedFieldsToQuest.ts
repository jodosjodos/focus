import { MigrationInterface, QueryRunner } from "typeorm";

export class AddResolvedFieldsToQuest1785164388889 implements MigrationInterface {
    name = 'AddResolvedFieldsToQuest1785164388889'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."quests_resolveddifficulty_enum" AS ENUM('easy', 'medium', 'hard')`);
        await queryRunner.query(`ALTER TABLE "quests" ADD "resolvedDifficulty" "public"."quests_resolveddifficulty_enum" NOT NULL`);
        await queryRunner.query(`ALTER TABLE "quests" ADD "resolvedTarget" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quests" DROP COLUMN "resolvedTarget"`);
        await queryRunner.query(`ALTER TABLE "quests" DROP COLUMN "resolvedDifficulty"`);
        await queryRunner.query(`DROP TYPE "public"."quests_resolveddifficulty_enum"`);
    }

}
