import { Injectable } from '@nestjs/common';
import { Action } from 'src/types/operator';
import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  Ability,
  InferSubjects,
} from '@casl/ability';
import { Role } from 'src/types/operator';
import { Course } from 'src/app/course/entities/course.entity';
import { Operator } from 'src/app/operator/entities/operator.entity';
import { Student } from 'src/app/student/entities/student.entity';
import { Result } from 'src/app/result/entities/result.entity';

type Subjects =
  | InferSubjects<
      typeof Operator | typeof Student | typeof Course | typeof Result
    >
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: Operator) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.role === Role.Super) {
      can(Action.Manage, 'all'); // read-write access to everything
    } else if (user.role === Role.Admin) {
      can(Action.Manage, Result); //read-write access to result
      can(Action.Read, Student); //read access to student
      can(Action.Update, Student); //update access to student
      can(Action.Create, Student); //create access to student
      cannot(Action.Delete, Student); //cannot delete student

      cannot(Action.Delete, Course); //cannot delete course
      can(Action.Create, Course); //can write course
      can(Action.Read, Course); //can read student
      can(Action.Update, Course); //can update student

      cannot(Action.Delete, Operator); // cannot delete operator
      cannot(Action.Create, Operator); // cannot create operator
      can(Action.Update, Operator, {
        id: user.id,
      }); // can update operator if self
      can(Action.Read, Operator, {
        id: user.id,
      }); // can read operator if self
    } else {
      cannot(Action.Manage, Result); //cannot read-write result
      can(Action.Read, Student); //read access to student
      can(Action.Update, Student); //update access to student
      can(Action.Create, Student); //create access to student
      cannot(Action.Delete, Student); //cannot delete student
      can(Action.Read,Course); //read access to student

      cannot(Action.Delete, Course); //cannot delete course
      cannot(Action.Update, Course); //cannot update course

      cannot(Action.Delete, Operator); // cannot delete operator
      cannot(Action.Create, Operator); // cannot create operator
      can(Action.Update, Operator, {
        id: user.id,
      }); // can update operator if self
      can(Action.Read, Operator, {
        id: user.id,
      }); // can read operator if self
    }

    return build({
      detectSubjectType: (item: any) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
