import { MigrationInterface, QueryRunner } from "typeorm";

export class InitPhase0Schema1785159967002 implements MigrationInterface {
    name = 'InitPhase0Schema1785159967002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_authprovider_enum" AS ENUM('apple', 'google', 'email')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "authProvider" "public"."users_authprovider_enum" NOT NULL, "passwordHash" character varying, "displayName" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "currentProgramId" character varying, "hardModeEnabled" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."programs_status_enum" AS ENUM('active', 'completed', 'abandoned')`);
        await queryRunner.query(`CREATE TABLE "programs" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "lengthDays" integer NOT NULL, "startDate" date NOT NULL, "status" "public"."programs_status_enum" NOT NULL DEFAULT 'active', "baselineStats" jsonb NOT NULL, "currentStats" jsonb NOT NULL, "currentDay" integer NOT NULL DEFAULT '1', "streakCount" integer NOT NULL DEFAULT '0', "longestStreak" integer NOT NULL DEFAULT '0', "totalXp" integer NOT NULL DEFAULT '0', "currentLevel" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_d43c664bcaafc0e8a06dfd34e05" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."quest_templates_questtype_enum" AS ENUM('checkbox', 'quantity', 'duration', 'reading', 'video', 'workout')`);
        await queryRunner.query(`CREATE TYPE "public"."quest_templates_primarystat_enum" AS ENUM('Strength', 'Discipline', 'Focus', 'Wisdom', 'Confidence', 'Custom')`);
        await queryRunner.query(`CREATE TYPE "public"."quest_templates_secondarystat_enum" AS ENUM('Strength', 'Discipline', 'Focus', 'Wisdom', 'Confidence', 'Custom')`);
        await queryRunner.query(`CREATE TYPE "public"."quest_templates_difficulty_enum" AS ENUM('easy', 'medium', 'hard')`);
        await queryRunner.query(`CREATE TYPE "public"."quest_templates_category_enum" AS ENUM('Strength', 'Discipline', 'Focus', 'Wisdom', 'Confidence', 'Custom')`);
        await queryRunner.query(`CREATE TABLE "quest_templates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "questType" "public"."quest_templates_questtype_enum" NOT NULL, "primaryStat" "public"."quest_templates_primarystat_enum" NOT NULL, "secondaryStat" "public"."quest_templates_secondarystat_enum", "difficulty" "public"."quest_templates_difficulty_enum" NOT NULL, "baseXp" integer NOT NULL, "category" "public"."quest_templates_category_enum" NOT NULL, "defaultTarget" character varying, "sourceContentId" character varying, CONSTRAINT "PK_8b4d39c76fcac0de53c28bcebbc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."quests_status_enum" AS ENUM('pending', 'complete', 'skipped')`);
        await queryRunner.query(`CREATE TABLE "quests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "programId" uuid NOT NULL, "questTemplateId" uuid NOT NULL, "dayNumber" integer NOT NULL, "isMainQuest" boolean NOT NULL DEFAULT false, "isBonusQuest" boolean NOT NULL DEFAULT false, "status" "public"."quests_status_enum" NOT NULL DEFAULT 'pending', "loggedValue" character varying, "xpAwarded" integer NOT NULL DEFAULT '0', "completedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a037497017b64f530fe09c75364" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "programs" ADD CONSTRAINT "FK_a99b3ca19aedd64a3f069cdeac2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quests" ADD CONSTRAINT "FK_057d05b43e7529697e2ab7115da" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quests" ADD CONSTRAINT "FK_50074382599aa031ae7550abb17" FOREIGN KEY ("questTemplateId") REFERENCES "quest_templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quests" DROP CONSTRAINT "FK_50074382599aa031ae7550abb17"`);
        await queryRunner.query(`ALTER TABLE "quests" DROP CONSTRAINT "FK_057d05b43e7529697e2ab7115da"`);
        await queryRunner.query(`ALTER TABLE "programs" DROP CONSTRAINT "FK_a99b3ca19aedd64a3f069cdeac2"`);
        await queryRunner.query(`DROP TABLE "quests"`);
        await queryRunner.query(`DROP TYPE "public"."quests_status_enum"`);
        await queryRunner.query(`DROP TABLE "quest_templates"`);
        await queryRunner.query(`DROP TYPE "public"."quest_templates_category_enum"`);
        await queryRunner.query(`DROP TYPE "public"."quest_templates_difficulty_enum"`);
        await queryRunner.query(`DROP TYPE "public"."quest_templates_secondarystat_enum"`);
        await queryRunner.query(`DROP TYPE "public"."quest_templates_primarystat_enum"`);
        await queryRunner.query(`DROP TYPE "public"."quest_templates_questtype_enum"`);
        await queryRunner.query(`DROP TABLE "programs"`);
        await queryRunner.query(`DROP TYPE "public"."programs_status_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_authprovider_enum"`);
    }

}
