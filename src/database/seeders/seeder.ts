import { Injectable } from '@nestjs/common';
import { CourseSeederService } from './course/course.service';
import { OperatorSeederService } from './operator/operator.service';

@Injectable()
export class Seeder {
  constructor(
    private readonly courseSeederService: CourseSeederService,
    private readonly OperatorSeederService: OperatorSeederService,
  ) {}

  async seed() {
    // Seed Operator
    await this.operators()
      .then((completed) => {
        const dateString = new Date().toLocaleString();
        console.log(
          `[Seeder] ${process.pid} - ${dateString}    LOG [Operator] Seeding completed`,
        );
        Promise.resolve(completed);
      })
      .catch((error) => {
        const dateString = new Date().toLocaleString();
        console.log(
          `[Seeder] ${process.pid} - ${dateString}    LOG [Operator] Seeding failed`,
        );
        Promise.reject(error);
      });
    // Seed courses
    await this.courses()
      .then((completed) => {
        const dateString = new Date().toLocaleString();
        console.log(
          `[Seeder] ${process.pid} - ${dateString}    LOG [Course] Seeding completed`,
        );
        Promise.resolve(completed);
      })
      .catch((error) => {
        const dateString = new Date().toLocaleString();
        console.log(
          `[Seeder] ${process.pid} - ${dateString}    LOG [Course] Seeding failed`,
        );
        Promise.reject(error);
      });
  }

  async operators() {
    return await this.OperatorSeederService.create();
  }

  async courses() {
    return await this.courseSeederService.create();
  }
}
