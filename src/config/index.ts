export const config = {
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  PORT: process.env.PORT || 5000,
  MONGO_URL: process.env.MONGO_URL || 'mongodb://localhost:27017/med_chat'
};
