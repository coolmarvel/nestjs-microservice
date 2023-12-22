import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Res,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { CreateVideoReqDto, FindVideoReqDto } from './dto/req.dto';
import { PageReqDto } from '../common/dto/req.dto';
import { CreateVideoResDto } from './dto/res.dto';
import { PageResDto } from '../common/dto/res.dto';
import { VideoService } from './video.service';
import { ApiPostResponse } from '../common/decorator/swagger.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { User, UserAfterAuth } from '../common/decorator/user.decorator';
import { Response } from 'express';

@ApiTags('Video')
@ApiExtraModels(FindVideoReqDto, PageReqDto, CreateVideoReqDto, CreateVideoResDto, PageResDto)
@Controller('api/videos')
export class VideoController {
  constructor(private videoService: VideoService) {}

  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiPostResponse(CreateVideoReqDto)
  @UseInterceptors(FileInterceptor('video'))
  @Post()
  async upload(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'mp4' })
        .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
    @Body() createVideoReqDto: CreateVideoReqDto,
    @User() user: UserAfterAuth,
  ): Promise<CreateVideoResDto> {
    const { mimetype, originalname, buffer } = file;
    const extension = originalname.split('.')[1];
    const { title } = createVideoReqDto;
    const { id } = await this.videoService.upload(user.id, title, mimetype, extension, buffer);

    return { id, title };
  }

  @ApiBearerAuth()
  @Get(':id/download')
  async download(@Param() { id }: FindVideoReqDto, @Res({ passthrough: true }) res: Response) {
    const { stream, mimetype, size } = await this.videoService.download(id);

    res.set({ 'Content-Length': size, 'Content-Type': mimetype, 'Content-Disposition': 'attachment' });

    return new StreamableFile(stream);
  }
}
