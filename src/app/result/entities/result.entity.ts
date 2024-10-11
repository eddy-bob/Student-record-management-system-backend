import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Timestamp } from 'src/database/timestamp.entity';
import { Entity } from 'typeorm';
import { DecimalTransformer } from 'src/utils/transformers/decimal';
import { Student } from 'src/app/student/entities/student.entity';
import { Grade } from 'src/types/result';
import { Course } from 'src/app/course/entities/course.entity';

@Entity()
export class Result extends Timestamp {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Student, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Course, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column({
    type: 'enum',
    enum: Grade,
  })
  grade: Grade;

  @Column({
    name: 'session',
  })
  session: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  score: number;

  @BeforeInsert()
  @BeforeUpdate()
  private async calculateGrade() {
    if (this.score) {
      switch (true) {
        case this.score >= 70:
          this.grade = Grade.A;
          break;
        case this.score >= 60 && this.score <= 69:
          this.grade = Grade.B;
          break;
        case this.score >= 50 && this.score <= 59:
          this.grade = Grade.C;
          break;
        case this.score >= 45 && this.score <= 49:
          this.grade = Grade.D;
          break;
        case this.score >= 40 && this.score <= 44:
          this.grade = Grade.E;
          break;
        case this.score < 40:
          this.grade = Grade.F;
          break;
      }
    }
  }
}
