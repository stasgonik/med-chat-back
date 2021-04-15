import {Router} from 'express';

import {chatController} from '../../controllers';

const router = Router();

router.get('/:chatId', chatController.getChatById);

router.post('/', chatController.createChat);

export const chatRouter = router;
