import {BaseDatabase} from '../services/BaseDatabase';
import jwt from 'jsonwebtoken';

interface refreshTokenData{
  token: string,
  device: string,
  isActive: boolean,
  userId: string
};

export default class RefreshTokenDatabase extends BaseDatabase{
  public async createRToken(input: refreshTokenData): Promise<any>{

      try{
        await this.getConnection()
        .insert({
        refresh_token: input.token,
        device: input.device,
        is_active: Number(input.isActive), //TODO ver se Number ou Bool
        user_id: input.userId,
        })
        .into(process.env.RTOKEN_DB_NAME);

      return 'Refresh token created successfully.'
    }catch(e){
      throw new Error(e.sqlMessage || e.message);
    };
  };

  public async getRToken(token: string): Promise<any>{
    const r = await this.getConnection()
    .select('*')
    .from(process.env.RTOKEN_DB_NAME)
    .where('refresh_token', '=', token);
    
    return{
      token: r[0][0].refresh_token,
      device: r[0][0].device,
      isActive: r[0][0].is_active,
      userId: r[0][0].user_id
    };
  };
};