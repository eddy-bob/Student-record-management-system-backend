import { MigrationInterface, QueryRunner } from "typeorm";

export class InitializeDB1745008049532 implements MigrationInterface {
    name = 'InitializeDB1745008049532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`student\` (\`id\` varchar(36) NOT NULL, \`regNumber\` varchar(255) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`middleName\` varchar(255) NULL, \`admissionSet\` varchar(255) NOT NULL, \`option\` varchar(255) NULL, \`gender\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`operator\` (\`id\` varchar(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`role\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`course\` (\`id\` varchar(36) NOT NULL, \`title\` varchar(255) NOT NULL, \`courseCode\` varchar(255) NOT NULL, \`option\` varchar(255) NOT NULL, \`unit\` varchar(255) NOT NULL, \`level\` varchar(255) NOT NULL, \`semester\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`result\` (\`id\` varchar(36) NOT NULL, \`score\` varchar(255) NOT NULL, \`grade\` enum ('A', 'B', 'C', 'D', 'E', 'F') NOT NULL DEFAULT 'F', \`session\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`student_id\` varchar(36) NULL, \`course_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`result\` ADD CONSTRAINT \`FK_294c0344ffc38b392ed06a9cba2\` FOREIGN KEY (\`student_id\`) REFERENCES \`student\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`result\` ADD CONSTRAINT \`FK_f902fcb7f457f7cf78251d0631b\` FOREIGN KEY (\`course_id\`) REFERENCES \`course\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`result\` DROP FOREIGN KEY \`FK_f902fcb7f457f7cf78251d0631b\``);
        await queryRunner.query(`ALTER TABLE \`result\` DROP FOREIGN KEY \`FK_294c0344ffc38b392ed06a9cba2\``);
        await queryRunner.query(`DROP TABLE \`result\``);
        await queryRunner.query(`DROP TABLE \`course\``);
        await queryRunner.query(`DROP TABLE \`operator\``);
        await queryRunner.query(`DROP TABLE \`student\``);
    }

}
