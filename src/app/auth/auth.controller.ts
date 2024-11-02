import { Controller, Post, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/decorators/public.decorator';
import { UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from 'src/guards/local-auth.guard';
import { CurrentUser } from 'src/decorators/user.decorator';
import { Operator } from '../operator/entities/operator.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @HttpCode(200)
  signin(@CurrentUser() user: Operator) {
    console.log(user)
    return this.authService.signin(user);
  }
}
