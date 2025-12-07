import { IUser } from './user.interface';
import { User } from './user.model';
const createUser = async(payload: Partial<IUser>)=>{
    const {fullName,email,password, ...rest} = payload;
    const user = await User.create({
        fullName,
        email,
        password,
        ...rest
    });
    return user;
   
}


export const UserService = {
    createUser,
}