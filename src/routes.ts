import {Router} from 'express';
import {signup}  from './endpoints/signup'; 
import { createRecipe, getRecipe } from './endpoints/recipe';

const routes = Router();

routes.post('/signup', signup);
routes.post('/login',);
routes.get('/user/profile',);
routes.get('/user/:id',);
routes.post('/recipe', createRecipe);
routes.get('/recipe/:id', getRecipe);
routes.post('/user/follow',);
routes.post('/user/unfollow',);
routes.get('/user/feed',);

export default routes;