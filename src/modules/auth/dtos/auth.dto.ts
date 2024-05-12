import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsString,
	Matches,
	MaxLength,
	MinLength,
} from 'class-validator';

export class SignupDto {
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(5)
	@MaxLength(30)
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'password too weak',
	})
	password: string;

	@IsOptional()
	@IsString()
	@Matches(/^\w+$/, {
		message: 'no space between words',
	})
	username: string;
}

export class SigninDto {
	@IsNotEmpty()
	@IsEmail()
	email: string;

	@IsNotEmpty()
	@IsString()
	@MinLength(5)
	@MaxLength(30)
	@Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
		message: 'password invalid',
	})
	password: string;
}
