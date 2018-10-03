import {EntityRepository, Repository, EntityManager, createConnection, Not, Equal} from "typeorm";
import {User} from "../db/user";
import * as bcrypt from "bcrypt";
import {Game} from "../db/game";

@EntityRepository()
export class UserRepository {

    constructor(private manager: EntityManager) {
    }

    async createAndSave(name: string, email: string, password: string, confirmedEmail: boolean = false): Promise<User> {
        const hashedPassword = await this.hashedPassword(password);
        const user = new User(name, email.toLowerCase(), hashedPassword, confirmedEmail);
        return this.manager.save(user);
    }

    async getAllBut(email: string): Promise<User[]> {
        return (await this.manager.find(User)).filter(x => x.email !== email.toLowerCase());
    }

    getAll(desc: boolean = true): Promise<User[]> {
        return this.manager
            .getRepository(User)
            .createQueryBuilder("user")
            .orderBy("user.rating", desc ? "DESC" : "ASC")
            .getMany();
    }

    findByUsername(email: string): Promise<User | undefined> {
        return this.manager.findOne(User, { "email": email.toLowerCase() });
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
