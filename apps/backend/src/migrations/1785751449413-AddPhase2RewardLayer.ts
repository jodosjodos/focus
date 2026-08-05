import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhase2RewardLayer1785751449413 implements MigrationInterface {
    name = 'AddPhase2RewardLayer1785751449413'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."weekly_quests_category_enum" AS ENUM('Strength', 'Discipline', 'Focus', 'Wisdom', 'Confidence', 'Custom')`);
        await queryRunner.query(`CREATE TYPE "public"."weekly_quests_status_enum" AS ENUM('active', 'complete', 'failed')`);
        await queryRunner.query(`CREATE TABLE "weekly_quests" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "programId" uuid NOT NULL, "weekIndex" integer NOT NULL, "startDay" integer NOT NULL, "endDay" integer NOT NULL, "category" "public"."weekly_quests_category_enum" NOT NULL, "targetCount" integer NOT NULL, "progressCount" integer NOT NULL DEFAULT '0', "status" "public"."weekly_quests_status_enum" NOT NULL DEFAULT 'active', "xpAwarded" integer NOT NULL DEFAULT '0', "resolvedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_18b94a3bd51325d148e91517e96" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_c132d7c907610ea526680bef4b" ON "weekly_quests"  ("programId", "weekIndex") `);
        await queryRunner.query(`CREATE TYPE "public"."achievements_type_enum" AS ENUM('milestone', 'hidden')`);
        await queryRunner.query(`CREATE TABLE "achievements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "type" "public"."achievements_type_enum" NOT NULL, "milestoneCheckpointIndex" integer, "hiddenRuleKey" character varying, "title" character varying NOT NULL, "quoteOrDescription" text NOT NULL, "unlockConditionText" character varying NOT NULL, "iconKey" character varying NOT NULL, "colorKey" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4fe946ae1fdbc64abf0c48ecb8a" UNIQUE ("key"), CONSTRAINT "UQ_9103eb85111686b70e2549488d7" UNIQUE ("hiddenRuleKey"), CONSTRAINT "PK_1bc19c37c6249f70186f318d71d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "achievement_unlocks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "achievementId" uuid NOT NULL, "programId" uuid, "unlockedAt" TIMESTAMP NOT NULL DEFAULT now(), "acknowledgedAt" TIMESTAMP WITH TIME ZONE, "dayNumberAtUnlock" integer, "statsSnapshot" jsonb, CONSTRAINT "PK_eafd69af94371223d7023d44023" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_182fde4cef2e2bb9810695f793" ON "achievement_unlocks"  ("userId", "achievementId") `);
        await queryRunner.query(`CREATE TYPE "public"."motivation_cards_rarity_enum" AS ENUM('common', 'rare', 'master_rare', 'x_rare')`);
        await queryRunner.query(`CREATE TABLE "motivation_cards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "quoteText" text NOT NULL, "rarity" "public"."motivation_cards_rarity_enum" NOT NULL, "tags" jsonb NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_82a2586fcb8fe853304e0deb1c5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."motivation_card_pulls_rarity_enum" AS ENUM('common', 'rare', 'master_rare', 'x_rare')`);
        await queryRunner.query(`CREATE TABLE "motivation_card_pulls" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "motivationCardId" uuid NOT NULL, "programId" uuid, "pulledForDate" date NOT NULL, "rarity" "public"."motivation_card_pulls_rarity_enum" NOT NULL, "serial" character varying NOT NULL, "acknowledgedAt" TIMESTAMP WITH TIME ZONE, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f07729b91035bbef212338362bb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_fc7a1e0ea0f80284ed344a9269" ON "motivation_card_pulls"  ("userId", "pulledForDate") `);
        await queryRunner.query(`ALTER TABLE "quests" ADD "wasRestored" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "weekly_quests" ADD CONSTRAINT "FK_f93800508f99a874efc8e6f1e2b" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "achievement_unlocks" ADD CONSTRAINT "FK_d23a397760c3a2397a06447bd8c" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "achievement_unlocks" ADD CONSTRAINT "FK_2f858eb50a3706c4886f04d7287" FOREIGN KEY ("achievementId") REFERENCES "achievements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "achievement_unlocks" ADD CONSTRAINT "FK_f81b3a661fe0bcbd4e2e18ef206" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "motivation_card_pulls" ADD CONSTRAINT "FK_c29667ba4a1bedd5a479983b199" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "motivation_card_pulls" ADD CONSTRAINT "FK_c0e9edc0da838af82fcf55f5d8f" FOREIGN KEY ("motivationCardId") REFERENCES "motivation_cards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "motivation_card_pulls" ADD CONSTRAINT "FK_42d0a2a85581144dba5427cce54" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        // One monotonic serial counter per rarity tier (decision: real Postgres
        // sequences — atomic, lock-free, no extra table needed). Not tied to
        // any entity column, so TypeORM can't diff/generate these.
        await queryRunner.query(`CREATE SEQUENCE "motivation_card_serial_common_seq" START 1`);
        await queryRunner.query(`CREATE SEQUENCE "motivation_card_serial_rare_seq" START 1`);
        await queryRunner.query(`CREATE SEQUENCE "motivation_card_serial_master_rare_seq" START 1`);
        await queryRunner.query(`CREATE SEQUENCE "motivation_card_serial_x_rare_seq" START 1`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP SEQUENCE "motivation_card_serial_x_rare_seq"`);
        await queryRunner.query(`DROP SEQUENCE "motivation_card_serial_master_rare_seq"`);
        await queryRunner.query(`DROP SEQUENCE "motivation_card_serial_rare_seq"`);
        await queryRunner.query(`DROP SEQUENCE "motivation_card_serial_common_seq"`);
        await queryRunner.query(`ALTER TABLE "motivation_card_pulls" DROP CONSTRAINT "FK_42d0a2a85581144dba5427cce54"`);
        await queryRunner.query(`ALTER TABLE "motivation_card_pulls" DROP CONSTRAINT "FK_c0e9edc0da838af82fcf55f5d8f"`);
        await queryRunner.query(`ALTER TABLE "motivation_card_pulls" DROP CONSTRAINT "FK_c29667ba4a1bedd5a479983b199"`);
        await queryRunner.query(`ALTER TABLE "achievement_unlocks" DROP CONSTRAINT "FK_f81b3a661fe0bcbd4e2e18ef206"`);
        await queryRunner.query(`ALTER TABLE "achievement_unlocks" DROP CONSTRAINT "FK_2f858eb50a3706c4886f04d7287"`);
        await queryRunner.query(`ALTER TABLE "achievement_unlocks" DROP CONSTRAINT "FK_d23a397760c3a2397a06447bd8c"`);
        await queryRunner.query(`ALTER TABLE "weekly_quests" DROP CONSTRAINT "FK_f93800508f99a874efc8e6f1e2b"`);
        await queryRunner.query(`ALTER TABLE "quests" DROP COLUMN "wasRestored"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fc7a1e0ea0f80284ed344a9269"`);
        await queryRunner.query(`DROP TABLE "motivation_card_pulls"`);
        await queryRunner.query(`DROP TYPE "public"."motivation_card_pulls_rarity_enum"`);
        await queryRunner.query(`DROP TABLE "motivation_cards"`);
        await queryRunner.query(`DROP TYPE "public"."motivation_cards_rarity_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_182fde4cef2e2bb9810695f793"`);
        await queryRunner.query(`DROP TABLE "achievement_unlocks"`);
        await queryRunner.query(`DROP TABLE "achievements"`);
        await queryRunner.query(`DROP TYPE "public"."achievements_type_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c132d7c907610ea526680bef4b"`);
        await queryRunner.query(`DROP TABLE "weekly_quests"`);
        await queryRunner.query(`DROP TYPE "public"."weekly_quests_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."weekly_quests_category_enum"`);
    }

}
