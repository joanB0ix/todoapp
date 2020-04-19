export class CreateUserDto {
    readonly username: string;
    readonly email: string;
    password: string;
    readonly _id: string;
    readonly categories: string[];
}