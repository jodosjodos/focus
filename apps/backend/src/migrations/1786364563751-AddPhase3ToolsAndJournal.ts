import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhase3ToolsAndJournal1786364563751 implements MigrationInterface {
    name = 'AddPhase3ToolsAndJournal1786364563751'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."journal_entries_mood_enum" AS ENUM('great', 'good', 'neutral', 'low', 'strong')`);
        await queryRunner.query(`CREATE TABLE "journal_entries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "programId" uuid NOT NULL, "dayNumber" integer NOT NULL, "mood" "public"."journal_entries_mood_enum" NOT NULL, "text" text NOT NULL, "photoUri" character varying, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a70368e64230434457c8d007ab3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reading_completions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "readingEntryId" uuid NOT NULL, "completedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_64699c1f3cb65589172c6553c72" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ac52b3eacfb172a9546f175d45" ON "reading_completions"  ("userId", "readingEntryId") `);
        await queryRunner.query(`CREATE TABLE "video_completions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "videoLinkId" uuid NOT NULL, "completedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_380549ac84d96184f7e475876bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_0155a4ec34025ac31c8de4d379" ON "video_completions"  ("userId", "videoLinkId") `);
        await queryRunner.query(`ALTER TABLE "journal_entries" ADD CONSTRAINT "FK_d5c64923279c15f4bad62f30df5" FOREIGN KEY ("programId") REFERENCES "programs"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reading_completions" ADD CONSTRAINT "FK_6a6f6371d776023c5e822c26d3d" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reading_completions" ADD CONSTRAINT "FK_27bf41a320182d1efb2781eed8d" FOREIGN KEY ("readingEntryId") REFERENCES "reading_entries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "video_completions" ADD CONSTRAINT "FK_d03293eb7e8d1f5284370171d67" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "video_completions" ADD CONSTRAINT "FK_28373a72e27ddc0b4421693899c" FOREIGN KEY ("videoLinkId") REFERENCES "video_links"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "video_completions" DROP CONSTRAINT "FK_28373a72e27ddc0b4421693899c"`);
        await queryRunner.query(`ALTER TABLE "video_completions" DROP CONSTRAINT "FK_d03293eb7e8d1f5284370171d67"`);
        await queryRunner.query(`ALTER TABLE "reading_completions" DROP CONSTRAINT "FK_27bf41a320182d1efb2781eed8d"`);
        await queryRunner.query(`ALTER TABLE "reading_completions" DROP CONSTRAINT "FK_6a6f6371d776023c5e822c26d3d"`);
        await queryRunner.query(`ALTER TABLE "journal_entries" DROP CONSTRAINT "FK_d5c64923279c15f4bad62f30df5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0155a4ec34025ac31c8de4d379"`);
        await queryRunner.query(`DROP TABLE "video_completions"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ac52b3eacfb172a9546f175d45"`);
        await queryRunner.query(`DROP TABLE "reading_completions"`);
        await queryRunner.query(`DROP TABLE "journal_entries"`);
        await queryRunner.query(`DROP TYPE "public"."journal_entries_mood_enum"`);
    }

}
