import jwt from 'jsonwebtoken';

export enum ROLE{
  NORMAL = 'NORMAL',
  ADMIN = 'ADMIN'
};

export interface AuthenticationData{
  id: string,
  email: string,
  role: ROLE
};

class Authenticator{
  private static EXPIRES_IN = '1min';

  public generateToken(input: AuthenticationData): string{
    const token = jwt.sign(
      {id: input.id, email: input.email, role: input.role}, 
      process.env.JWT_KEY as string,
      {expiresIn: Authenticator.EXPIRES_IN}
    );
    return token;
  };

  public getData(token: string): AuthenticationData{
    const payload = jwt.verify(
      token,
      process.env.JWT_KEY as string
    ) as any;
    const result = {
      id: payload.id,
      email: payload.email,
      role: payload.role
    };
    return result;
  };
};
export default Authenticator;