import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

// * 6번 통계(국가별 사용자 통계) Table
@Entity({ name: "login_analytics_tb", schema: "statistics_service" })
export class LoginAnalytics extends BaseEntity {
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
