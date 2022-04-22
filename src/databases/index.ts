import { DB_HOST } from '@config';
const db_url = DB_HOST || 'mongodb://localhost:27017/tribePayment';
export const dbConnection = db_url && {
  url: db_url,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  },
};
