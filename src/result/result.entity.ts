import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Student } from '../student/student.entity';
import { Course } from '../course/course.entity';
import { Grade } from '../type';

@Entity()
export class Result {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  score: string;

  @Column({
    type: 'enum',
    enum: Grade,
    default: Grade.F,
  })
  grade: Grade;

  @ManyToOne(() => Student)
  @JoinColumn({ name: 'student_id' })
  student: Student;

  @ManyToOne(() => Course)
  @JoinColumn({ name: 'course_id' })
  course: Course;

  @Column()
  session: string;

  @CreateDateColumn()
  createdAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  calculateGrade() {
    this.score = Math.max(Number(this.score), 0).toString();
    const score = parseFloat(this.score);
    if (score >= 70) {
      this.grade = Grade.A;
    } else if (score >= 60) {
      this.grade = Grade.B;
    } else if (score >= 50) {
      this.grade = Grade.C;
    } else if (score >= 45) {
      this.grade = Grade.D;
    } else if (score >= 40) {
      this.grade = Grade.E;
    } else {
      this.grade = Grade.F;
    }
  }
}
