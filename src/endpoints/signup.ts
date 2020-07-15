import {UserDatabase} from '../data/UserDatabase';
import express, {Response, Request} from 'express';
import HashManager from '../services/utils/HashManager';
import IdGenerator from '../services/utils/IdGenerator';
import Authenticator, {ROLE} from '../services/utils/Authenticator';

const useUserDataBase = new UserDatabase();
const idGen = new IdGenerator();
const hashGen = new HashManager();
const tokenGen = new Authenticator();

const createUser = async (
 name: string, email: string, password: string, role: ROLE
): Promise<any>  =>{
  try{
    const newId = idGen.generate();
    const hashedPwd = await hashGen.hash(password);
    await useUserDataBase.getConnection()
    .insert({
      id: newId,
      name: name,
      email: email,
      password: hashedPwd, 
      role: role,
    })
    .into(process.env.USER_DB_NAME);
    const token = tokenGen.generateToken({
      id: newId,
      email,
      role
    });
    return {
      message: `User ${name} successfully created!`,
      token
    };
  }catch(e){
    throw {message: e.sqlMessage|| e.message}
  };
};

const signup = async (req: Request, res: Response): Promise<any> =>{
  const body = req.body;
  try{
    const r = await createUser(
      body.name,
      body.email,
      body.password,
      body.role
    );
    res.send(r).status(200);
  }catch(e){
    res.send(
      {message: e.message}
    )
    .status(400);
  };
};
export {signup};
