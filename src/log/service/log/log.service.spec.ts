import { Test, TestingModule } from "@nestjs/testing";
import { LogRequestLoginTime } from "../../../log/DTO/log.dto";
import { Log } from "../../../log/entity/log/log.entity";
import { LogRepository } from "../../../log/entity/log/log.repository";
import { LogService } from "./log.service";

describe("LogService", () => {
  let logService: LogService;
  let logRepository: LogRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LogService, LogRepository],
    }).compile();

    logService = module.get<LogService>(LogService);
    logRepository = module.get<LogRepository>(LogRepository);
  });

  describe("LogInsert", () => {
    it('회원가입 로그를 저장한 후 반환한다.', async () => {
      const requestDTO =  new LogRequestLoginTime();
      requestDTO.logType = "SIGNUP";
      requestDTO.countryName = "KR";
      requestDTO.userPk = 1;
      const createdLogEntity = requestDTO;
      const savedLog = Log.of({
        logType: "SIGNUP",
        userPk: 1,
        countryName: "KR",
      });

      const logRepositorySaveSpy = jest.spyOn(logRepository, "save").mockResolvedValue(savedLog);
      const result = await logService.logSave(requestDTO);

      expect(logRepositorySaveSpy).toBeCalledWith(createdLogEntity);
      expect(result).toBe(savedLog);
    });
  });
});
