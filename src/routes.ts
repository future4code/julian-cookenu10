import {Router} from 'express';
import {signup}  from './endpoints/signup'; 

const routes = Router();

routes.post('/signup', signup);
routes.post('/login',);
routes.get('/user/profile',);
routes.get('/user/:id',);
routes.post('/recipe',);
routes.get('/recipe/:id',);
routes.post('/user/follow',);
routes.post('/user/unfollow',);
routes.get('/user/feed',);

export default routes;