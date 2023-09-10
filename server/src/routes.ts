import { Router } from 'express';

const email = require('./controller/Email');
const router: Router = Router();

router.post('/email/search', email.searchValidate(), email.search.bind(email));

export default router;