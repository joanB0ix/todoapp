export class UpdateUserDto {
    readonly name: string;
    readonly email: string;
    password: string;
    readonly _id: string;
    readonly categories: string[];
}