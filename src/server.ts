import App from '@/app';
import HealthRoute from '@routes/health.route';
import IndexRoute from '@routes/index.route';
import PaymentRoute from './routes/payment.route';
import WebhookRoute from '@/routes/webhook.route';
import validateEnv from '@utils/validateEnv';
import UserRoute from './routes/user.route';
import JoinRoute from './routes/join.route';

validateEnv();

const app = new App({
  client: [new IndexRoute(), new HealthRoute(), new PaymentRoute(), new UserRoute(), new JoinRoute()],
  server: [new WebhookRoute()],
});

app.listen();
