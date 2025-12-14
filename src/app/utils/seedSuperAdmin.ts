/* eslint-disable no-console */
import { IUser } from './../modules/user/user.interface';
import { envVars } from './../config/env';
import { User } from "../modules/user/user.model"
import bcrypt from 'bcrypt'

export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await User.findOne({ email: envVars.SUPER_ADMIN_EMAIL })
        
        if (isSuperAdminExist) {
            console.log('Super Admin exists')
            return;
        }

        console.log('Trying to create super admin.....')

        const hashedPassword = await bcrypt.hash(envVars.SUPER_ADMIN_PASSWORD, Number(envVars.BCRYPT_SALT_ROUND))



        const payload: Partial<IUser> = {
            fullName: 'Super Admin',
            email: envVars.SUPER_ADMIN_EMAIL,
            password: hashedPassword,
            role:"admin",

        }

        const superadmin = await User.create(payload)
        console.log('Super admin successfully created /n')
        

    } catch (error) {
        console.log(error)
    }

}