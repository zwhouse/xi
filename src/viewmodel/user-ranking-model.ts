import {User} from "../db/user";

export class UserRankingModel {

    readonly userRankings: UserRanking[] = [];

    constructor(users: User[]) {

        if (users.length > 0) {

            this.userRankings.push(new UserRanking(1, users[0].name!, users[0].rating));

            for (let index = 1; index < users.length; index++) {

                const nextRanking = users[index].rating === users[index - 1].rating
                    ? this.userRankings[index - 1].ranking
                    : this.userRankings[index - 1].ranking + 1;

                this.userRankings.push(new UserRanking(nextRanking, users[index].name!, users[index].rating));
            }
        }
    }
}

class UserRanking {

    readonly ranking: number;
    readonly name: string;
    readonly rating: number;

    constructor(ranking: number, name: string, rating: number) {
        this.ranking = ranking;
        this.name = name;
        this.rating = rating;
    }
}