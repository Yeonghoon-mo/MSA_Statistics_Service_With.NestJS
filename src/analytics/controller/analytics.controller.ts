import { Controller, Get, Post, Query } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from "@nestjs/swagger";
import { TYPE } from "src/enum/enum";
import { FindAllAvgRequest, FindAllSumRequest, FindAllUserRequest, FindOneAvgRequest, FindOneSumRequest, FindUserRequest, FindUserUnusedRequest } from "../DTO/analytics.dto";
import { AnalyticsService } from "../service/analytics.service";

@ApiTags("애널리틱스 API")
@Controller("/analytics")
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @ApiOperation({ summary: "전체 통계 기간별 합계를 구하는 API" })
  @ApiResponse({
    type: FindAllSumRequest,
    status: 200,
    description: "전체 통계 기간별 합계 조회완료.",
  })
  @Get("/sum/all")
  async findBySumAll(@Query() analyticsRequest: FindAllSumRequest) {
    return await this.analyticsService.findBySumAll(analyticsRequest);
  }

  @ApiOperation({ summary: "전체 통계 기간별 평균을 구하는 API" })
  @ApiResponse({
    type: FindAllAvgRequest,
    status: 200,
    description: "전체 통계 기간별 평균 조회완료.",
  })
  @ApiQuery({ name: "avgIf", enum: ["y", "M", "d"] })
  @Get("/avg/all")
  async findByAvgAll(@Query() analyticsAvgRequest: FindAllAvgRequest) {
    return await this.analyticsService.findByAvgAll(analyticsAvgRequest);
  }

  @ApiOperation({ summary: "각 통계 기간별 합계를 구하는 API" })
  @ApiResponse({
    type: FindOneSumRequest,
    status: 200,
    description: "각 통계 기간별 합계 조회완료.",
  })
  @ApiQuery({ name: "contains", enum: TYPE })
  @Get("/sum")
  async findBySum(@Query() analyticsRequest: FindOneSumRequest) {
    return await this.analyticsService.findBySum(analyticsRequest);
  }

  @ApiOperation({ summary: "각 통계 기간별 평균을 구하는 API" })
  @ApiResponse({
    type: FindOneAvgRequest,
    status: 200,
    description: "각 통계 기간별 평균 조회완료.",
  })
  @ApiQuery({ name: "contains", enum: TYPE })
  @ApiQuery({ name: "avgIf", enum: ["y", "M", "d"] })
  @Get("/avg")
  async findByAvg(@Query() analyticsRequest: FindOneAvgRequest) {
    return await this.analyticsService.findByAvg(analyticsRequest);
  }

  @ApiOperation({ summary: "각 유저의 기간 별 누적 접속 횟수", description: "유저의 접속 횟수는 하루에 여러 번 로그인 시에도, 1일에 1번만 누적됩니다." })
  @ApiResponse({
    type: FindUserRequest,
    status: 200,
    description: "유저 기간별 접속 횟수 조회 성공.",
  })
  @Get("/user")
  async findByUserUsed(@Query() analyticsRequest: FindUserRequest) {
    return await this.analyticsService.findByUserUsed(analyticsRequest);
  }

  @ApiOperation({
    summary: "각 유저가 얼마나 접속을 하지 않았는지",
    description: "접속 안한 기간은 일(d) 수로 리턴됩니다.",
  })
  @ApiResponse({
    type: FindUserRequest,
    status: 200,
    description: "조회 성공.",
  })
  @Get("/user/unused")
  async findByUserUnused(@Query() analyticsReuqest: FindUserUnusedRequest) {
    return await this.analyticsService.findByUserUnused(analyticsReuqest);
  }

  @ApiOperation({ summary: "전체 유저 기간 별 누적 접속 횟수" })
  @ApiResponse({
    type: FindUserRequest,
    status: 200,
    description: "조회 성공.",
  })
  @Get("/user/all")
  async findAllUserUsed(@Query() analyticsRequest: FindAllUserRequest) {
    return await this.analyticsService.findAllUserUsed(analyticsRequest);
  }

  // ! Batch Test
  @Post("/test")
  async test() {
    return await this.analyticsService.batchInsert();
  }
}
