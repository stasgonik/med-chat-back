import {NextFunction, Request, Response} from 'express';

import {ChatModel} from '../../models';

export const chatController = {
  getChatById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {chatId} = req.params;
      const chatWithMessages = await ChatModel.findByIdWithMessages(chatId);

      res.json(chatWithMessages);
    } catch (err) {
      next(err);
    }
  },

  createChat: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {userName} = req.body;
      // TODO real doctor name in future
      const room = await ChatModel.create({ doctorName: 'Viktor', patientName: userName });

      res.json(room);
    } catch (e) {
      next(e);
    }
  }
};
