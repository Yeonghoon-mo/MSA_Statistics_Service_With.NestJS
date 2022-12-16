import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, IsNull, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "login_user_analytics_tb", schema: "statistics_service" })
export class UserAnalytics extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id", comment: "ID(PK)" })
  id: number;

  @Column({ type: "varchar", name: "user_pk", comment: "사용자ID(PK)" })
  userPk: string;

  @CreateDateColumn({ name: "created_date", comment: "데이터 생성시간" })
  createdDate: Date;

  @UpdateDateColumn({ nullable: true, name: "modified_date", comment: "데이터 수정시간" })
  modifiedDate: Date;

  @DeleteDateColumn({ nullable: true, name: "deleted_date", comment: "데이터 삭제시간" })
  deletedDate: Date;
}
