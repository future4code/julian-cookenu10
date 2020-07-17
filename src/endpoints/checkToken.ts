import {UserDatabase} from '../data/UserDatabase';
import {Response, Request} from 'express';
import HashManager from '../services/utils/HashManager';
import Authenticator, {ROLE} from '../services/utils/Authenticator';

const useUserDataBase = new UserDatabase();
const hashGen = new HashManager();
const tokenGen = new Authenticator();

const checkToken = async (req: Request, res: Response) =>{
  try{

  }catch(e){

  };
};

export {checkToken};