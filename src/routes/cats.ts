import { Router } from 'express';
import { getCats, getCat } from '../controllers';

const router: Router = Router();

router.get('/', getCats);

router.get('/:catId', getCat);

export default router;