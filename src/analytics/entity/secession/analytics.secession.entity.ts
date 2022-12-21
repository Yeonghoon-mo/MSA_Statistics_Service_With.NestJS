import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

// * 2번 통계(사용자 탈퇴 기간별 횟수) Table
@Entity({ name: "secession_analytics_tb", schema: "statistics_service" })
export class SecessionAnalytics extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id", comment: "ID(PK)" })
  id: number;

  @Column({ type: "int", name: "value", comment: "수집된 데이터 개수" })
  value: number;

  @CreateDateColumn({ nullable: false, name: "created_date", comment: "데이터 생성시간" })
  createdDate: Date;

  @UpdateDateColumn({ name: "modified_date", comment: "데이터 수정시간" })
  modifiedDate: Date;

  @DeleteDateColumn({ nullable: true, name: "deleted_date", comment: "데이터 삭제시간" })
  deletedDate: Date;
}
