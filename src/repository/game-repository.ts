import {EntityRepository, Repository, EntityManager, createConnection, Not, Equal} from "typeorm";
import {User} from "../db/user";
import * as bcrypt from "bcrypt";
import {Game} from "../db/game";

@EntityRepository()
export class GameRepository {

    constructor(private manager: EntityManager) {
    }

    getById(id: number): Promise<Game | undefined> {
        return this.manager.findOne(Game, id);
    }

    getAll(desc: boolean = true): Promise<Game[]> {
        return this.manager
            .getRepository(Game)
            .createQueryBuilder("game")
            .leftJoinAndSelect("game.redPlayer", "red")
            .leftJoinAndSelect("game.blackPlayer", "black")
            .orderBy("game.created", desc ? "DESC" : "ASC")
            .getMany();
    }

    createAndSave(initiator: User, opponent: User, ownColorIsRed: boolean, isAccepted: boolean = false): Promise<Game> {
        const game = new Game(initiator, opponent, ownColorIsRed, isAccepted);
        return this.manager.save<Game>(game);
    }

    save(game: Game): Promise<Game> {
        return this.manager.save(game);
    }
}
