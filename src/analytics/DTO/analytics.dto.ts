import { ApiProperty } from "@nestjs/swagger";
import { AVGIF } from "../../enum/enum";

// 부모 클래스
export class CommonDTO {
  // 검색 시작 날짜
  @ApiProperty({ example: "yyyy-MM-dd(2022-01-01)", description: "검색 시작 날짜" })
  public firstDate: string;

  // 검색 종료 날짜
  @ApiProperty({ example: "yyyy-MM-dd(2022-01-01)", description: "검색 종료 날짜" })
  public lastDate: string;
}

// 나라 별 검색조건
class Country extends CommonDTO {
  @ApiProperty({
    example: "KR",
    description: "국가 별 국가코드 입력(영문), signup & secession & login  통계를 보고자 할 땐 입력하지 않아도 됨.",
    required: false,
  })
  public countryName: string;
}

// 전체 통계의 합계를 위한 클래스
export class FindAllSumRequest extends Country {
  public contains: string;
}

// 특정 통계의 합계를 위한 클래스
export class FindOneSumRequest extends Country {
  @ApiProperty({ example: "signup", description: "검색조건(signup & secession & login & country)", required: true })
  public contains: string;
}

// 전체 통계의 평균을 위한 클래스
export class FindAllAvgRequest extends FindAllSumRequest {
  @ApiProperty({ description: "년(y), 월(M), 일(d) 평균 검색에 대한 조건" })
  public avgIf: AVGIF;
}

// 특정 통계의 평균을 위한 클래스
export class FindOneAvgRequest extends FindOneSumRequest {
  @ApiProperty({ description: "년(y), 월(M), 일(d) 평균 검색에 대한 조건" })
  public avgIf: AVGIF;
}

// 유저의 기간 별 누적 접속 횟수를 위한 클래스
export class FindUserRequest extends CommonDTO {
  // 검색할 유저 ID
  @ApiProperty({ example: "1", description: "검색할 유저 ID" })
  public userPk: string;
}

// 전체 유저의 기간 별 누적 접속 횟수를 위한 클래스
export class FindAllUserRequest extends CommonDTO {
  public userPk: string;
}

// 유저가 접속을 얼마나 하지 않았는지
export class FindUserUnusedRequest {
  // 검색할 유저 ID
  @ApiProperty({ example: "1", description: "검색할 유저 ID" })
  public userPk: string;
}
