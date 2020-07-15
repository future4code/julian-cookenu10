import {v4} from 'uuid';

class IdGenerator{
  public generate():string{
    return v4();
  };
};
export default IdGenerator;