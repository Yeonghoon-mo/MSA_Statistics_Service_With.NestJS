import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { LogRequest, LogRequestLoginTime } from "../DTO/log.dto";
import { LogService } from "../service/log/log.service";

@ApiTags("로그 API")
@Controller("/log")
export class LogController {
  constructor(private readonly logService: LogService) {}

  //* Log Insert
  @ApiOperation({
    summary: "Log Insert API",
    description: "Log Table에 Log를 생성. userPk 매개변수는 로그인 시에만 입력받으면 됩니다. <br> logType 멤버변수의 값 = SIGNUP & SECESSION & LOGIN ",
  })
  @ApiResponse({
    type: LogRequest,
    status: 201,
    description: "성공적으로 로그가 등록되었습니다.",
  })
  @ApiResponse({
    type: LogRequest,
    status: 202,
    description: "최종 로그인 시간 업데이트 성공",
  })
  @ApiBody({ type: LogRequest })
  @Post("/insert")
  async logSave(@Body() logRequest: LogRequestLoginTime) {
    console.log(logRequest);
    return await this.logService.logSave(logRequest);
  }
}
