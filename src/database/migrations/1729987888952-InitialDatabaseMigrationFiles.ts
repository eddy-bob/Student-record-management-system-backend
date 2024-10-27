import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialDatabaseMigrationFiles1729987888952 implements MigrationInterface {
    name = 'InitialDatabaseMigrationFiles1729987888952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`student\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`reg_number\` varchar(255) NOT NULL, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`middle_name\` varchar(255) NULL, \`gender\` enum ('Male', 'Female') NOT NULL, \`admission_set\` varchar(255) NOT NULL, \`option\` enum ('Power', 'Telecomunication', 'Electronics', 'Not Applicable') NOT NULL, UNIQUE INDEX \`IDX_0144619e1651229c6f6a34e06f\` (\`reg_number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`course\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`course_code\` varchar(255) NOT NULL, \`option\` enum ('Power', 'Telecomunication', 'Electronics', 'General') NOT NULL, \`semester\` enum ('First Semester', 'Second Semester') NOT NULL, \`level\` enum ('100 level', '200 level', '300 level', '400 level', '500 level') NOT NULL, \`unit\` decimal(10,2) NOT NULL, UNIQUE INDEX \`IDX_ac5edecc1aefa58ed0237a7ee4\` (\`title\`), UNIQUE INDEX \`IDX_e3a6d871e7e62c5cf609e892e7\` (\`course_code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`result\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`grade\` enum ('A', 'B', 'C', 'D', 'E', 'F') NOT NULL, \`session\` varchar(255) NOT NULL, \`score\` decimal(10,2) NOT NULL, \`student_id\` int NULL, \`course_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`operator\` (\`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`id\` int NOT NULL AUTO_INCREMENT, \`role\` enum ('Super_admin', 'Deparment_exco', 'Admin') NOT NULL, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_809228ed8520ca85998fe55165\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`result\` ADD CONSTRAINT \`FK_294c0344ffc38b392ed06a9cba2\` FOREIGN KEY (\`student_id\`) REFERENCES \`student\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`result\` ADD CONSTRAINT \`FK_f902fcb7f457f7cf78251d0631b\` FOREIGN KEY (\`course_id\`) REFERENCES \`course\`(\`id\`) ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`result\` DROP FOREIGN KEY \`FK_f902fcb7f457f7cf78251d0631b\``);
        await queryRunner.query(`ALTER TABLE \`result\` DROP FOREIGN KEY \`FK_294c0344ffc38b392ed06a9cba2\``);
        await queryRunner.query(`DROP INDEX \`IDX_809228ed8520ca85998fe55165\` ON \`operator\``);
        await queryRunner.query(`DROP TABLE \`operator\``);
        await queryRunner.query(`DROP TABLE \`result\``);
        await queryRunner.query(`DROP INDEX \`IDX_e3a6d871e7e62c5cf609e892e7\` ON \`course\``);
        await queryRunner.query(`DROP INDEX \`IDX_ac5edecc1aefa58ed0237a7ee4\` ON \`course\``);
        await queryRunner.query(`DROP TABLE \`course\``);
        await queryRunner.query(`DROP INDEX \`IDX_0144619e1651229c6f6a34e06f\` ON \`student\``);
        await queryRunner.query(`DROP TABLE \`student\``);
    }

}
