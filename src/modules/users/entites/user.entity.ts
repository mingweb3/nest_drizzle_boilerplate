import { Exclude } from 'class-transformer';

export const GROUP_USER = 'group_user_details';
export const GROUP_ALL_USERS = 'group_all_users';

export class UserEntity {
	id: number;
	email: string;
	username?: string;
	profile?: ProfileEntity;

	@Exclude()
	password?: string;

	@Exclude()
	refreshToken?: string;

	constructor(partial: Partial<UserEntity>) {
		Object.assign(this, partial);
	}
}

export class ProfileEntity {
	id: number;
	name: string;
	bio: string;
	userId?: number;

	constructor(partial: Partial<UserEntity>) {
		Object.assign(this, partial);
	}
}
