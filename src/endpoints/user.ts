import {UserDatabase} from '../data/UserDatabase';
import {Response, Request} from 'express';
import HashManager from '../services/utils/HashManager';
import IdGenerator from '../services/utils/IdGenerator';
import Authenticator, {ROLE} from '../services/utils/Authenticator';
import { unlinkSync } from 'fs';
import { send } from 'process';

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
    const r = await useUserDataBase.getUserByEmail({
      email: body.email, 
      password: body.password
    });

    const pwdIsValid = await hashGen.checkHash(r.password, body.password);

    if(! pwdIsValid){
      throw {message:'Invalid password.'};
    };

    const token = tokenGen.generateToken({id: r.id, email: r.email, role: r.role})

    res.send({token}).status(200);
  }catch(e){
    res.send(
      {
        message: e.message
      }
    ).status(400);
  };
};

export {signup, login};
