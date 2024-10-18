import {
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Timestamp } from 'src/database/timestamp.entity';
import { Entity } from 'typeorm';
import { Role } from 'src/types/operator';
import * as bcrypt from 'bcryptjs';

@Entity()
export class Operator extends Timestamp {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({
    type: 'enum',
    enum: Role,
    nullable: false,
  })
  role: Role;
  @Column({
    name: 'first_name',
    type: 'varchar',
    nullable: false,
  })
  firstName: string;
  @Column({
    name: 'last_name',
    type: 'varchar',
    nullable: false,
  })
  lastName: string;
  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  email: string;
  @Column({
    type: 'varchar',
    nullable: false,
    select: false,
  })
  password: string;
  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword() {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = bcrypt.hashSync(this.password, salt);
    }
  }

  public async matchPassword(enteredPassword: string) {
    return await bcrypt.compare(enteredPassword, this.password);
  }
}
