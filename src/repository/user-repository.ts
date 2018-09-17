import {EntityRepository, Repository, EntityManager, createConnection} from "typeorm";
import {User} from "../db/user";
import * as bcrypt from "bcrypt";

@EntityRepository()
export class UserRepository {

    constructor(private manager: EntityManager) {
    }

    async createAndSave(name: string, email: string, password: string): Promise<User> {
        const hashedPassword = await this.hashedPassword(password);
        const user = new User(name, email, hashedPassword);
        return this.manager.save(user);
    }

    findByUsername(email: string): Promise<User | undefined> {
        return this.manager.findOne(User, { "email": email });
    }

    correctPassword(user: User, enteredPassword: string): Promise<boolean> {
        return bcrypt.compare(enteredPassword, user.passwordHash as string);
    }

    save(user: User): Promise<User> {
        return this.manager.save(user);
    }

    hashedPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 14);
    }
}
