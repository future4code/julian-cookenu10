import {UserDatabase} from '../data/UserDatabase';
import {Response, Request} from 'express';
import HashManager from '../services/utils/HashManager';
import Authenticator, {ROLE} from '../services/utils/Authenticator';

const useUserDataBase = new UserDatabase();
const hashGen = new HashManager();
const tokenGen = new Authenticator();

//Endpoints 
const signup = async (req: Request, res: Response): Promise<any> =>{
  const body = req.body;
  if( 
    ! body.name || body.name.trim() === '' ||
    ! body.email || body.email.trim() === '' || 
    ! body.password || body.password.trim() === ''
    )
  {
    throw res.send({message: 'Missing info is not allowed.'}).status(400);
  };
  try{
    const r = await useUserDataBase.createUser({
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role
    });

    res.send(r).status(200);
    await useUserDataBase.destroyConnection();
  }catch(e){
    res.send(
      {message: e.message}
    )
    .status(400);
  };
};
const login = async (req: Request, res: Response): Promise<any> =>{
  const body = req.body;

  if( 
    ! body.email || body.email.trim() === '' || 
    ! body.password || body.password.trim() === ''
    )
  {
    throw res.send({message: 'Missing e-mail or password.'}).status(400);
  };

  try{
    const r = await useUserDataBase.getUserByEmail(body.email);

    const pwdIsValid = await hashGen.checkHash(r.password, body.password);

    if(! pwdIsValid){
      throw {message:'Invalid password.'};
    };

    const token = tokenGen.generateToken({
      id: r.id, 
      name: r.name, 
      email: r.email, 
      role: r.role
    });

    res.send({token}).status(200);
    await useUserDataBase.destroyConnection();
  }catch(e){
    res.send(
      {
        message: e.message
      }
    ).status(400);
  };
};
const getProfileInfos = async (req: Request, res: Response): Promise<any> =>{
  try{
    const token = req.headers.authorization;
    const userInfos = tokenGen.getData(token);
    const r = await useUserDataBase.getUserByEmail(userInfos.email);
    if(r){
      res.send(userInfos).status(200)
    }else{
      throw {message: 'User not found.'}
    };
  }catch(e){
    res.send(
      {
        message: e.message
      }
    ).status(400);
  };
};
const getUserInfos = async (req: Request, res: Response): Promise<any> =>{
  try{
    const token = req.headers.authorization;
    const searchedUserId = req.params.id;

    const tokenIsValid = tokenGen.getData(token);
    const searchedUserInfos = await useUserDataBase.getUserById(searchedUserId);

    if(searchedUserInfos){
      res.send(searchedUserInfos).status(200);
    }else{
      throw {message: 'User not found.'};
    };
  }catch(e){
    res.send({
      message: e.message
    }).status(400);
  };
};
export {signup, login, getProfileInfos, getUserInfos};
