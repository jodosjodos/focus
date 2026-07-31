import { MigrationInterface, QueryRunner } from "typeorm";

export class AddScalingRuleToQuestTemplate1785164193693 implements MigrationInterface {
    name = 'AddScalingRuleToQuestTemplate1785164193693'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."quest_templates_scalingrule_enum" AS ENUM('water', 'workout', 'screen_time', 'sleep')`);
        await queryRunner.query(`ALTER TABLE "quest_templates" ADD "scalingRule" "public"."quest_templates_scalingrule_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quest_templates" DROP COLUMN "scalingRule"`);
        await queryRunner.query(`DROP TYPE "public"."quest_templates_scalingrule_enum"`);
    }

}
