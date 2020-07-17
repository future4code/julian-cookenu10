import {BaseDatabase} from "../services/BaseDatabase";
import HashManager from '../services/utils/HashManager';
import IdGenerator from '../services/utils/IdGenerator';
import Authenticator, {ROLE} from '../services/utils/Authenticator';

const idGen = new IdGenerator();
const hashGen = new HashManager();
const tokenGen = new Authenticator();

//Interfaces
interface signupInput{
  id: string,
  name: string, 
  email: string, 
  password: string, 
  role: ROLE | string
};
interface searchedUser{
  id: string,
  name: string,
  email: string,
  role: ROLE | string
};

export class UserDatabase extends BaseDatabase{
  public async createUser (input: signupInput): Promise<void>{
     try{
       await this.getConnection()
       .insert({
         id: input.id,
         name: input.name,
         email: input.email,
         password: input.password, 
         role: input.role,
       })
       .into(process.env.USER_DB_NAME);
     }catch(e){
       throw {message: e.sqlMessage|| e.message}
     };
  };
  
  public async getUserByEmail(email: string): Promise<any>{
    try{
      const r = await this.getConnection()
      .select('*')
      .where('email', '=', email)
      .into(process.env.USER_DB_NAME);
      
      return r.length === 1 && r[0];
    }catch(e){
      throw {message: e.sqlMessage || e.message}
    };
  };

  public async getUserById(id: string): Promise<any>{
    try{
      const r = await this.getConnection()
      .select('*')
      .where('id', '=', id)
      .into(process.env.USER_DB_NAME);

      const userInfos: searchedUser ={
        id: r[0].id,
        name: r[0].name,
        email: r[0].email,
        role: r[0].role,
      };
      
      return r.length === 1 && userInfos;
    }catch(e){
      throw {message: e.sqlMessage || e.message}
    };
  };

  public async deleteUser(id: string){
    try{
      await this.getConnection()
      .delete()
      .from(process.env.RECIPES_DB_NAME)
      .where('creator_id', '=', id);

      await this.getConnection()
      .delete()
      .from(process.env.FOLLOWS_DB_NAME)
      .where('user_id', '=', id);

      await this.getConnection()
      .delete()
      .from(process.env.USER_DB_NAME)
      .where('id', '=', id);

      return {message:`Deleted successfully.`};
    }catch(e){
      throw {message: e.sqlMessage || e.message};
    };
  };
};