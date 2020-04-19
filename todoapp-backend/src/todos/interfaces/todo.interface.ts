import * as mongoose from 'mongoose';

export interface Todo extends mongoose.Document{
    name: string;
    description: string;
    username_id: string;
    category: String;
    checked: Boolean;
}