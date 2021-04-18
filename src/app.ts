import {Socket} from 'socket.io';

import * as express from 'express';
import {NextFunction, Request, Response} from 'express';
import * as mongoose from 'mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

import {config} from './config';
import {SocketEventsEnum} from './constants';

const cors = require('cors');
import * as RateLimit from 'express-rate-limit';
import * as helmet from 'helmet';

import {chatRouter} from './routes';
import {ResponseStatusCodesEnum} from './constants';
import {MessageModel} from './models';

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: config.FRONTEND_URL,
    methods: ['GET', 'POST']
  }
});

const serverRequestLimiter = RateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000
});

_connectDB();

app.use(helmet());
app.use(serverRequestLimiter);
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cors());

app.use('/chats', chatRouter);
app.use(_customErrorHandler);

io.on('connection', (socket: Socket) => {
  socket.on(SocketEventsEnum.ROOM_JOIN, async ({ chatId, chatUsers, role, oppositeRole }) => {
    socket.join(chatId);

    const incomingMessage = await MessageModel.create({
      chatId,
      from: chatUsers[role],
      to: chatUsers[oppositeRole],
      body: `User ${chatUsers[role]} connected`,
      type: 'action'
    });

    socket.to(chatId).emit(SocketEventsEnum.ROOM_NEW_MESSAGE, incomingMessage);
  });

  socket.on(SocketEventsEnum.ROOM_NEW_MESSAGE, async ({chatId, chatUsers, role, oppositeRole, body}) => {
    const incomingMessage = await MessageModel.create({ chatId, from: chatUsers[role], to: chatUsers[oppositeRole], body });

    socket.to(chatId).emit(SocketEventsEnum.ROOM_NEW_MESSAGE, incomingMessage);
  });

  socket.on('disconnect', () => {
    // TODO
    // rooms.forEach((value, roomId) => {
    //   if (value.get('users').delete(socket.id)) {
    //     const users = [...value.get('users').values()];
    //     socket.to(roomId).emit('ROOM:SET_USERS', users);
    //   }
    // });
  });
});

server.listen(config.PORT, (err: Error) => {
  if (err) {
    console.log('Error when starting server');
  }
  console.log(`App listen port ${config.PORT}`);
});


function _customErrorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  if (err.parent) {
    err.message = err.parent.sqlMessage;
  }

  res
    .status(err.status || ResponseStatusCodesEnum.SERVER_ERROR)
    .json({
      error: {
        message: err.message || 'Unknown Error',
        code: err.code,
        data: err.data
      }
    });
}

function _connectDB() {
  mongoose.connect(config.MONGO_URL, {useNewUrlParser: true, useFindAndModify: true});
}
