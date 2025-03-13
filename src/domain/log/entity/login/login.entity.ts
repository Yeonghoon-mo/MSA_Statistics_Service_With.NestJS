import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "log_user_tb", schema: "statistics_service" })
export class Login extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "log_id", comment: "ID(PK)" })
  id: number;

  @Column({ nullable: true, type: "varchar", name: "user_pk", comment: "사용자ID(PK)" })
  userPk: string;

  @Column({ type: "varchar", length: 50, name: "log_type", comment: "로그 유형" })
  logType: string;

  @CreateDateColumn({ nullable:false, name: "created_date", comment: "데이터 생성시간" })
  createdDate: Date;

  @UpdateDateColumn({ name: "last_login_time", comment: "마지막 로그인 시간" })
  lastLoginTime: Date;
}
