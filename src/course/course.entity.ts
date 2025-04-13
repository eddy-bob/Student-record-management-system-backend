import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { Options, Level, Semester } from '../type';

@Entity()
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  courseCode: string;

  @Column()
  option: Options;

  @Column()
  unit: string;

  @Column()
  level: Level;

  @Column()
  semester: Semester;

  @CreateDateColumn()
  createdAt: Date;
}
