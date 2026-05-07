import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...', description: 'Access токен JWT' })
  access_token: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIs...', description: 'Refresh токен JWT' })
  refresh_token: string;
}