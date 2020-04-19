import * as mongoose from 'mongoose';

export const TodoSchema = new mongoose.Schema({
    name: String,
    description: String,
    username_id: String,
    category: String,
    checked: Boolean
});