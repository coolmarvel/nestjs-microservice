import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class PageReqDto {
  @ApiPropertyOptional({ description: 'page. default = 1' })
  @Transform((param) => Number(param.value))
  @IsInt()
  page?: number = 1;

  @ApiPropertyOptional({ description: 'number of data per page. default = 20' })
  @Transform((param) => Number(param.value))
  @IsInt()
  size?: number = 20;
}
