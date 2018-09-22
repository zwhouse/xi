import {expect} from 'chai';
import 'mocha';
import {User} from "../../src/db/user";
import {Result} from "../../src/game/result";

describe("User", () => {

    describe("#pointsAfter", () => {

        it("should return 6 points for a win of a higher rated player", () => {

            const player1 = new User("A", "", "", true, 1365);
            const player2 = new User("A", "", "", true, 1200);

            expect(player1.pointsAfter(Result.Win, player2, 20)).to.equal(6);
            expect(player2.pointsAfter(Result.Loss, player1, 20)).to.equal(-6);
        });

        it("should return 14 points for a win of a lower rated player", () => {

            const player1 = new User("A", "", "", true, 1365);
            const player2 = new User("A", "", "", true, 1200);

            expect(player2.pointsAfter(Result.Win, player1, 20)).to.equal(14);
            expect(player1.pointsAfter(Result.Loss, player2, 20)).to.equal(-14);
        });

        it("should return -4 points for a draw between a higher- and lower rated player", () => {

            const player1 = new User("A", "", "", true, 1365);
            const player2 = new User("A", "", "", true, 1200);

            expect(player1.pointsAfter(Result.Draw, player2, 20)).to.equal(-4);
            expect(player2.pointsAfter(Result.Draw, player1, 20)).to.equal(4);
        });
    });
});
