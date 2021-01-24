import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {

    private users = [
        {email: 'michele.mastrogiovanni@stonize.com'},
        {email: 'chrome-extension-0.0.1@stonize.com'},
        {email: 'chrome-extension-0.0.2@stonize.com'}
    ]

    findUser(email: string) {
        return this.users.find(item => item.email == email)
    } 
    
}
