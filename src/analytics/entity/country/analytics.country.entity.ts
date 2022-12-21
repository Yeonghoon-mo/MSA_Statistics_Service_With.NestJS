import { BaseEntity, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

// * 3번 통계(사용자 기간별 로그인 횟수) Table
@Entity({ name: "country_analytics_tb", schema: "statistics_service" })
export class CountryAnalytics extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "int", name: "id", comment: "ID(PK)" })
  id: number;

  @Column({ nullable: true, type: "varchar", length: 20, name: "country_name", comment: "국가 이름" })
  countryName: number;

  @Column({ type: "int", name: "value", comment: "수집된 데이터 개수" })
  value: number;

  @CreateDateColumn({ nullable: false, name: "created_date", comment: "데이터 생성시간" })
  createdDate: Date;

  @UpdateDateColumn({ nullable: true, name: "modified_date", comment: "데이터 수정시간" })
  modifiedDate: Date;

  @DeleteDateColumn({ nullable: true, name: "deleted_date", comment: "데이터 삭제시간" })
  deletedDate: Date;
}
