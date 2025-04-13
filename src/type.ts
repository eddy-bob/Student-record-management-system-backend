export enum Options {
  NONE = 'Not Applicable',
  POWER = 'Power',
  TELECOM = 'Telecommunication',
  ELECTRONICS = 'Electronics',
  GENERAL = 'General',
}

export enum Semester {
  FIRST = 'First Semester',
  SECOND = 'Second Semester',
}

export enum Level {
  FIRST = '100 level',
  SECOND = '200 level',
  THIRD = '300 level',
  FOURTH = '400 level',
  FIFTH = '500 level',
}

export enum Role {
  Super = 'Super_admin',
  Exco = 'Department_exco',
  Admin = 'Admin',
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

export enum Grade {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
}

export interface AddCourse {
  title: string;
  courseCode: string;
  option: Options;
  unit: string;
  level: Level;
  semester: Semester;
}

export interface AddOperator {
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  password: string;
  adminPassword: string;
}

export interface Signin {
  email: string;
  password: string;
}

export interface UpdateOperator
  extends Omit<AddOperator, 'role' | 'adminPassword'> {
  newPassword: string;
}

export interface OperatorData {
  email: string;
  firstName: string;
  lastName: string;
  role: Role | string;
}

export interface AddResult {
  score: string;
  student: string;
  course: string;
  session: string;
}

export interface AddStudent {
  regNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  admissionSet: string;
  option?: Options;
  gender: Gender;
}
