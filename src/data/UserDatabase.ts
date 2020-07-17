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
interface searchedUser{
  id: string,
  name: string,
  email: string,
  role: ROLE
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
         name: input.name,
         email: input.email,
         role: input.role
       });

       return {
         message: `User ${input.name} successfully created!`,
         token
       };
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