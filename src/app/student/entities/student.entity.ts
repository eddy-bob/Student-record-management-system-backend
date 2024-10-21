import { PrimaryGeneratedColumn, Column } from 'typeorm';
import { Timestamp } from 'src/database/timestamp.entity';
import { Entity } from 'typeorm';
import { CapitalizeTransformer } from 'src/utils/transformers/capitalize';
import { Options } from 'src/types/student';
import { Gender } from 'src/types/student';

@Entity()
export class Student extends Timestamp {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({
    type: 'alphanum',
    name: 'reg_number',
    unique: true,
  })
  regNumber: string;
  @Column({
    name: 'first_name',
    transformer: new CapitalizeTransformer(),
  })
  firstName: string;

  @Column({
    name: 'last_name',
    transformer: new CapitalizeTransformer(),
  })
  lastName: string;

  @Column({
    name: 'middle_name',
    nullable: true,
    transformer: new CapitalizeTransformer(),
  })
  middleName: string | null;
  @Column({
    enum: Gender,
  })
  gender: Gender;
  @Column({
    name: 'admission_set',
  })
  admissionSet: string;
  @Column({
    type: 'enum',
    enum: Options,
  })
  option: Options;
}
