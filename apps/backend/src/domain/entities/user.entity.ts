export enum UserRole {
  admin = 'admin',
  student = 'user',
}

export interface UserProps {
  id?: string; // PK
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export class UserEntity {
  public readonly id?: string; // PK
  public name: string;
  public email: string;
  public passwordHash: string;
  public role: UserRole;
  public readonly createdAt?: Date;
  public updatedAt?: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.name = props.name;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.role = props.role;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  public isAdmin(): boolean {
    return this.role === UserRole.admin;
  }
}
