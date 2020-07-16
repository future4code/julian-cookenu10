import {Router} from 'express';
import {signup}  from './endpoints/signup'; 
import { createRecipe, getRecipe } from './endpoints/recipe';
import {followUser} from './endpoints/followUser';
import { unfollowUser } from './endpoints/unfollowUser';

const routes = Router();

routes.post('/signup', signup);
routes.post('/login',);
routes.get('/user/profile',);
routes.get('/user/:id',);
routes.post('/recipe', createRecipe);
routes.get('/recipe/:id', getRecipe);
routes.post('/user/follow', followUser);
routes.post('/user/unfollow', unfollowUser);
routes.get('/user/feed',);

export default routes;