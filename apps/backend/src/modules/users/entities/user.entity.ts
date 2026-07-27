import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum AuthProvider {
  APPLE = 'apple',
  GOOGLE = 'google',
  EMAIL = 'email',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: 'enum', enum: AuthProvider })
  authProvider: AuthProvider;

  @Column({ type: 'varchar', nullable: true })
  passwordHash: string | null;

  @Column()
  displayName: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'varchar', nullable: true })
  currentProgramId: string | null;

  @Column({ default: false })
  hardModeEnabled: boolean;
}
