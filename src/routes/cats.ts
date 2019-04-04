import { Router } from 'express';
import { getCats, getCat, createCat } from '../controllers';

const router: Router = Router();

router.get('/', getCats);

router.get('/:catId', getCat);

router.post('/', createCat);

export default router;