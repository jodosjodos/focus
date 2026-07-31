import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhase1OnboardingAndContentTables1785164098524 implements MigrationInterface {
    name = 'AddPhase1OnboardingAndContentTables1785164098524'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."reading_entries_category_enum" AS ENUM('Strength', 'Discipline', 'Focus', 'Wisdom', 'Confidence', 'Custom')`);
        await queryRunner.query(`CREATE TABLE "reading_entries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "author" character varying, "category" "public"."reading_entries_category_enum" NOT NULL, "content" text NOT NULL, "isOriginal" boolean NOT NULL DEFAULT true, "estimatedMinutes" integer NOT NULL, CONSTRAINT "PK_b653e65e56f262fd3e5b681a8da" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."video_links_category_enum" AS ENUM('Strength', 'Discipline', 'Focus', 'Wisdom', 'Confidence', 'Custom')`);
        await queryRunner.query(`CREATE TABLE "video_links" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "url" character varying NOT NULL, "category" "public"."video_links_category_enum" NOT NULL, "channel" character varying, "estimatedMinutes" integer, CONSTRAINT "PK_539d20019346d400d4908fecdb4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "programs" ADD "improvementAreas" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "programs" ADD "baseline" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "programs" ADD "notWorkingText" character varying`);
        await queryRunner.query(`ALTER TABLE "programs" ADD "timezone" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "programs" DROP COLUMN "timezone"`);
        await queryRunner.query(`ALTER TABLE "programs" DROP COLUMN "notWorkingText"`);
        await queryRunner.query(`ALTER TABLE "programs" DROP COLUMN "baseline"`);
        await queryRunner.query(`ALTER TABLE "programs" DROP COLUMN "improvementAreas"`);
        await queryRunner.query(`DROP TABLE "video_links"`);
        await queryRunner.query(`DROP TYPE "public"."video_links_category_enum"`);
        await queryRunner.query(`DROP TABLE "reading_entries"`);
        await queryRunner.query(`DROP TYPE "public"."reading_entries_category_enum"`);
    }

}
