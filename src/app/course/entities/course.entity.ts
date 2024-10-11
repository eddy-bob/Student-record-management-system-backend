import { PrimaryGeneratedColumn, Column } from 'typeorm';
import { Timestamp } from 'src/database/timestamp.entity';
import { Entity } from 'typeorm';
import { DecimalTransformer } from 'src/utils/transformers/decimal';
import { Level, Options, Semester } from 'src/types/course';
@Entity()
export class Course extends Timestamp {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    unique: true,
  })
  title: string;

  @Column({
    unique: true,
    name: 'course_code',
  })
  courseCode: string;

  @Column({
    type: 'enum',
    enum: Options,
  })
  option: Options;

  @Column({
    type: 'enum',
    enum: Semester,
  })
  semester: Semester;

  @Column({
    type: 'enum',
    enum: Level,
  })
  level: Level;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new DecimalTransformer(),
  })
  unit: number;
}
