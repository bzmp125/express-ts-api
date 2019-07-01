import { Router } from 'express';
import * as passport from 'passport';
import oauth2orize from '../oauth2'
import * as ResourceOwnerPasswordStrategy from 'passport-oauth2-resource-owner-password';

// passport.use(new ResourceOwnerPasswordStrategy(
//     function(clientId)
// ))

const router: Router = Router();

router.post('/oauth/token',
    passport.authenticate(['basic', 'oauth2-client-password', 'oauth2-resource-owner-password'], { session: false })
    , oauth2orize.token()
    , oauth2orize.errorHandler()
);

export default router;