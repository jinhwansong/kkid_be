import { ApiProperty } from '@nestjs/swagger';
import { SUCCESS_CODE, SUCCESS_MESSAGE } from '../constants/api.constants';

/** Jammit API 표준 래퍼 `{ success, code, message, result }` */
export class CommonResponseDto<T> {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  code: number;
  @ApiProperty()
  message: string;
  @ApiProperty({ required: false, nullable: true })
  result?: T | null;

  static ok<T>(result?: T): CommonResponseDto<T> {
    return {
      success: true,
      code: SUCCESS_CODE,
      message: SUCCESS_MESSAGE,
      result: result ?? null,
    };
  }

  static fail<T>(
    code: number,
    message: string,
    result?: T | null,
  ): CommonResponseDto<T> {
    return {
      success: false,
      code,
      message,
      result: result ?? null,
    };
  }
}

/** 동일 클래스의 별칭 (문서·신규 코드용) */
export { CommonResponseDto as ApiResponseDto };
