import {
	Body,
	ClassSerializerInterceptor,
	Controller,
	Get,
	Param,
	Put,
	UseGuards,
	UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { UserEntity } from './entites/user.entity';
import { UpdateUserDto } from './dtos/update-user.dto';

@UseGuards(AccessTokenGuard)
@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@UseInterceptors(ClassSerializerInterceptor)
	@Get()
	async findAll(): Promise<UserEntity[]> {
		// return this.usersService.findAll();
		const users = await this.usersService.findAll();
		return users.map((user) => new UserEntity(user));
	}

	@UseInterceptors(ClassSerializerInterceptor)
	@Get(':id')
	async findOneById(@Param('id') id: string): Promise<UserEntity> {
		return new UserEntity(await this.usersService.findOne(Number(id)));
	}

	@Put(':id')
	updateById(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(Number(id), updateUserDto);
	}
}
