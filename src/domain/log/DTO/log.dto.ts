import { ApiProperty } from "@nestjs/swagger";

export class LogRequest {
  @ApiProperty({ enum: ["SIGNUP", "SECESSION", "LOGIN"], description: "통계별 로그 종류(SIGNUP & SECESSION & LOGIN)" })
  public logType: string;

  @ApiProperty({ example: "1", description: "로그인한 User PK (회원가입, 탈퇴 로그작성엔 작성하지 않아도 됨.)" })
  public userPk: string;

  // Request를 위한 나라 이름 멤버변수
  public countryName: string;
}

export class LogRequestLoginTime extends LogRequest {
  // 로그인 시간 저장을 위한 멤버변수
  public lastLoginTime: Date;
}
