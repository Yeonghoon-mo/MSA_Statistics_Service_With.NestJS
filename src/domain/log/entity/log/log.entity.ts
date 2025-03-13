import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "log_collection_tb", schema: "statistics_service" })
export class Log extends BaseEntity {
  @PrimaryGeneratedColumn({ type: "bigint", name: "log_id", comment: "ID(PK)" })
  id: number;

  @Column({ nullable: true, type: "varchar", name: "user_pk", comment: "사용자 ID(PK)" })
  userPk: string;

  @Column({ nullable: true, type: "varchar", length: 10, name: "country_name", comment: "국가 이름" })
  countryName: string;

  @Column({ type: "varchar", length: 50, name: "log_type", comment: "로그 유형" })
  logType: string;

  @CreateDateColumn({ name: "created_date", comment: "데이터 생성시간" })
  createdDate: Date;
}
