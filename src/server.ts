import App from '@/app';
import HealthRoute from '@routes/health.route';
import IndexRoute from '@routes/index.route';
import PaymentRoute from './routes/payment.route';
import WebhookRoute from '@/routes/webhook.route';
import UserRoute from './routes/user.route';
import validateEnv from '@utils/validateEnv';

console.log('test0');
validateEnv();
console.log('test1');

const app = new App({
  client: [new IndexRoute(), new HealthRoute(), new PaymentRoute(), new UserRoute()],
  server: [new WebhookRoute()],
});
console.log('test2');

app.listen();
console.log('test3');
