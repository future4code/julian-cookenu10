import {UserDatabase} from '../data/UserDatabase';
import {Response, Request} from 'express';
import HashManager from '../services/utils/HashManager';
import Authenticator, {ROLE} from '../services/utils/Authenticator';
import IdGenerator from '../services/utils/IdGenerator';
import RefreshTokenDatabase from '../data/RefreshTokenDatabase';

const useUserDataBase = new UserDatabase();
const useRTokenDatabase = new RefreshTokenDatabase();

const hashGen = new HashManager();
const tokenGen = new Authenticator();
const idGen = new IdGenerator();

//Endpoints 
const signup = async (req: Request, res: Response): Promise<any> =>{
  interface signupRequestBody{
    name: string,
    email: string,
    password: string,
    device: string,
    role?: string,
  };
  const body: signupRequestBody = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    device: req.body.device,
    role: req.body.role
  };
  const newId = idGen.generate();
  const hashedPwd = await hashGen.hash(body.password);
  if( 
    ! body.name || body.name.trim() === '' ||
    ! body.email || body.email.trim() === '' || 
    ! body.password || body.password.trim() === ''
    )
  {
    throw res.send({message: 'Missing info is not allowed.'}).status(400);
  };
  try{
    await useUserDataBase.createUser({
      id: newId,
      name: body.name,
      email: body.email,
      password: hashedPwd,
      role: body.role
    });

    const accToken = tokenGen.generateToken({
      id: newId,
      role: body.role
    });

    const rToken = tokenGen.generateToken({
      id: newId,
      device: body.device
      },
      process.env.RTOKEN_EXPIRES_IN
    );

    await useRTokenDatabase.createRToken({
      token: rToken,
      device: body.device,
      isActive: true,
      userId: newId
    });

    res.send(
      {
        message: `User ${body.name} successfully created!`,
        accessToken: accToken,
        refreshToken: rToken,
      }
    ).status(200);
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
      res.send(userInfos).status(200);
      await useUserDataBase.destroyConnection();
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
      await useUserDataBase.destroyConnection();
    }else{
      throw {message: 'User not found.'};
    };
  }catch(e){
    res.send({
      message: e.message
    }).status(400);
  };
};
const deleteUserById = async (req: Request, res: Response): Promise<any> =>{
  try{
    const token = req.headers.authorization;
    const adminInfos = tokenGen.getData(token);
    const toDeleteUserId = req.params.id;
    if(adminInfos.role != ROLE.ADMIN){
      throw {message: 'Not an Admin user. Only Admins are allowed to delete other users.'};
    };

    const r = await useUserDataBase.deleteUser(toDeleteUserId);
    res.send(r).status(200);
    await useUserDataBase.destroyConnection();
  }catch(e){
    res.send({
      message: e.message
    }).status(400);
  };
};
export {signup, login, getProfileInfos, getUserInfos, deleteUserById};
