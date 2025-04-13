import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { Gender, Options } from '../type';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  regNumber: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true })
  middleName?: string;

  @Column()
  admissionSet: string;

  @Column({ nullable: true })
  option?: Options;

  @Column()
  gender: Gender;
  @CreateDateColumn()
  createdAt: Date;
}
