import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, IsNull, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

// * 1번 통계(신규 사용자 가입 기간별 횟수) Table
@Entity({ name: "signup_analytics_tb", schema: "statistics_service" })
export class SignupAnalytics extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id", comment: "ID(PK)" })
  id: number;

  @Column({ type: "int", name: "value", comment: "수집된 데이터 개수" })
  value: number;

  @CreateDateColumn({ name: "created_date", comment: "데이터 생성시간" })
  createdDate: Date;

  @UpdateDateColumn({ nullable: true, name: "modified_date", comment: "데이터 수정시간" })
  modifiedDate: Date;

  @DeleteDateColumn({ nullable: true, name: "deleted_date", comment: "데이터 삭제시간" })
  deletedDate: Date;
}
