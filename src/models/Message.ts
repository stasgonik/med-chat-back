const { Schema, model } = require('mongoose');

import { DataBaseTablesEnum } from '../constants';

const messageScheme = new Schema({
  chatId: { type: String, required: true, ref: DataBaseTablesEnum.CHAT},
  from: { type: String, required: true },
  to: { type: String, required: true },
  body: { type: String, required: true },
  type: { type: String, default: 'regularMessage' } // TODO enum
}, {
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

export const MessageModel = model(DataBaseTablesEnum.MESSAGE, messageScheme);
