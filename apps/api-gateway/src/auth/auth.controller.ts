import { BadRequestException, Body, Controller, Headers, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiTags } from '@nestjs/swagger';
import { RefreshResDto, SigninResDto, SingupResDto } from './dto/res.dto';
import { AuthService } from './auth.service';
import { ApiPostResponse } from '../common/decorator/swagger.decorator';
import { SigninReqDto, SignupReqDto } from './dto/req.dto';
import { Public } from '../common/decorator/public.decorator';
import { User, UserAfterAuth } from '../common/decorator/user.decorator';

@ApiTags('Auth')
@ApiExtraModels(SingupResDto, SigninResDto, RefreshResDto)
@Controller('api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiPostResponse(SingupResDto)
  @Public()
  @Post('signup')
  async sinup(@Body() { email, password, passwordConfirm }: SignupReqDto): Promise<SingupResDto> {
    if (password !== passwordConfirm) throw new BadRequestException();
    const { id, accessToken, refreshToken } = await this.authService.singup(email, password);

    return { id, accessToken, refreshToken };
  }

  @ApiPostResponse(SigninResDto)
  @Public()
  @Post('signin')
  async signin(@Body() { email, password }: SigninReqDto) {
    return this.authService.signin(email, password);
  }

  @ApiPostResponse(RefreshResDto)
  @ApiBearerAuth()
  @Post('refresh')
  async refresh(@Headers('authorization') authorization, @User() user: UserAfterAuth) {
    const token = /Bearer\s(.+)/.exec(authorization)[1];
    const { accessToken, refreshToken } = await this.authService.refresh(token, user.id);

    return { accessToken, refreshToken };
  }
}
