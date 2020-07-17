import {Router} from 'express';
import { signup, login, getProfileInfos } from './endpoints/user'; 
import { createRecipe, getRecipe } from './endpoints/recipe';
import {followUser} from './endpoints/followUser';
import { unfollowUser } from './endpoints/unfollowUser';
import {userFeed} from './endpoints/feed'

const routes = Router();

routes.post('/signup', signup);
routes.post('/login', login);
routes.get('/user/profile', getProfileInfos);
routes.get('/user/:id',);
routes.post('/recipe', createRecipe);
routes.get('/recipe/:id', getRecipe);
routes.post('/user/follow', followUser);
routes.post('/user/unfollow', unfollowUser);
routes.get('/user/feed', userFeed);

export default routes;