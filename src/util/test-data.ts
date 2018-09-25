import {createConnection, getCustomRepository} from "typeorm";
import {User} from "../db/user";
import {Game} from "../db/game";
import {UserRepository} from "../repository/user-repository";
import {GameRepository} from "../repository/game-repository";

const create = getCustomRepository;

async function createUsers(): Promise<User[]> {

    const repo = create(UserRepository);

    return [
        await repo.createAndSave("Bart", "bkiers@gmail.com", "Test1234", true),
        await repo.createAndSave("Annemieke", "bkiers+a@gmail.com", "Test1234", true),
        await repo.createAndSave("Jos", "bkiers+j@gmail.com", "Test1234", true),
        await repo.createAndSave("Edo", "bkiers+e@gmail.com", "Test1234", true)
    ];
}

async function createGames(users: User[]): Promise<Game[]> {

    const repo = create(GameRepository);
    const games: Game[] = [];

    for (let i = 1; i < users.length; i++) {
        const game = await repo.createAndSave(users[0], users[i], i % 2 === 1);
        games.push(game);
    }

    return games;
}

createConnection({
    type: "postgres",
    host: "localhost",
    port: 5432,
    database: "xi",
    entities: [User, Game],
    synchronize: true,
    logging: false
}).then(async connection => {
    console.log("Database connection established");

    const users = await createUsers();
    console.log('created', users.length, 'users');

    const games = await createGames(users);
    console.log('created', games.length, 'games');

    await connection.close();

}).catch(error => console.log(error));
