import {MessageModel} from './Message';

const {Schema, model} = require('mongoose');

import {DataBaseTablesEnum} from '../constants';

const chatScheme = new Schema({
  doctorName: {type: String, required: true},
  patientName: {type: String}
}, {
  timestamps: true,
  toObject: {virtuals: true},
  toJSON: {virtuals: true}
});

chatScheme.statics = {
  async findByIdWithMessages(chatId: string) {
    const chat = await this.findById(chatId).lean();
    const messages = await MessageModel.find({ chatId }).sort({ createdAt: -1 }).lean();

    return { ...chat, messages };
  }
};

export const ChatModel = model(DataBaseTablesEnum.CHAT, chatScheme);
