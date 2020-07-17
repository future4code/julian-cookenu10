import {Router} from 'express';
import { 
  signup, login, getProfileInfos, getUserInfos, deleteUserById 
} from './endpoints/user'; 
import { createRecipe, getRecipe, editRecipe, deleteRecipe } from './endpoints/recipe';
import {followUser} from './endpoints/followUser';
import { unfollowUser } from './endpoints/unfollowUser';
import {userFeed} from './endpoints/feed';
import {checkToken} from './endpoints/checkToken';

const routes = Router();

routes.post('/signup', signup);
routes.post('/login', login);
routes.get('/user/profile', getProfileInfos);
routes.get('/user/:id', getUserInfos);
routes.post('/recipe', createRecipe);
routes.get('/recipe/:id', getRecipe);
routes.post('/user/follow', followUser);
routes.post('/user/unfollow', unfollowUser);
routes.get('/user/feed', userFeed);
routes.put('/recipe/:id', editRecipe);
routes.delete('/recipe/:id', deleteRecipe);
routes.delete('/user/:id', deleteUserById);
routes.get('/check/token', checkToken);

export default routes;