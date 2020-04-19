export class CreateTodoDto {
    readonly name: string;
    readonly description: string;
    readonly id: string;
    username_id: string;
    readonly category: string;
    readonly checked: boolean;
}