import {BaseDatabase} from "../services/BaseDatabase";
import HashManager from '../services/utils/HashManager';
import IdGenerator from '../services/utils/IdGenerator';
import Authenticator, {ROLE} from '../services/utils/Authenticator';

const idGen = new IdGenerator();
const hashGen = new HashManager();
const tokenGen = new Authenticator();

//Interfaces
interface signupInput{
  name: string, 
  email: string, 
  password: string, 
  role: ROLE
};
interface loginInput{
  email: string,
  password: string
};

export class UserDatabase extends BaseDatabase{
  public async createUser (input: signupInput): Promise<any>{
     try{
       const newId = idGen.generate();
       const hashedPwd = await hashGen.hash(input.password);

       await this.getConnection()
       .insert({
         id: newId,
         name: input.name,
         email: input.email,
         password: hashedPwd, 
         role: input.role,
       })
       .into(process.env.USER_DB_NAME);
       const token = tokenGen.generateToken({
         id: newId,
         email: input.email,
         role: input.role
       });
       return {
         message: `User ${name} successfully created!`,
         token
       };
     }catch(e){
       throw {message: e.sqlMessage|| e.message}
     };
  };
  
  public async getUserByEmail (input: loginInput): Promise <any>{
    try{
      
      const r = await this.getConnection()
      .select('*')
      .where('email', '=', input.email)
      .into(process.env.USER_DB_NAME);
  
      return r[0]
    }catch(e){
      throw {message: e.sqlMessage || e.message}
    };
  };
};