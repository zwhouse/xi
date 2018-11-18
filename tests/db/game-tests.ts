import {expect} from 'chai';
import 'mocha';
import {User} from "../../src/db/user";
import {Game} from "../../src/db/game";

describe("Game", () => {

    describe("#draw", () => {

        it("should set isGameOver to true", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            red.id = 1;
            black.id = 2;

            const game = new Game(red, black);
            expect(game.isGameOver).to.equal(false);
            game.draw();
            expect(game.isGameOver).to.equal(true);
        });

        it("should reset drawProposalCode", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            red.id = 1;
            black.id = 2;

            const game = new Game(red, black);
            game.drawProposalCode = "code";
            game.draw();
            expect(game.drawProposalCode).to.equal("");
        });

        it("should leave winner undefined", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            red.id = 1;
            black.id = 2;

            const game = new Game(red, black);
            expect(game.winner).to.equal(undefined);
            game.draw();
            expect(game.winner).to.equal(undefined);
        });

        it("should leave pointsRed as 0 for equally rated users", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            red.id = 1;
            black.id = 2;

            const game = new Game(red, black);
            expect(game.pointsRed).to.equal(0);
            game.draw();
            expect(game.pointsRed).to.equal(0);
        });

        it("should set pointsRed to -12 for a high rated user", () => {
            const redHigh = new User("R", "rr@mail.com", "...", true, 1600);
            const blackLow = new User("B", "bb@mail.com", "...", true, 800);

            redHigh.id = 3;
            blackLow.id = 4;

            const game = new Game(redHigh, blackLow);
            expect(game.pointsRed).to.equal(0);
            game.draw();
            expect(game.pointsRed).to.equal(-12);
        });

        it("should set pointsBlack to 12 for a low rated user", () => {
            const redHigh = new User("R", "rr@mail.com", "...", true, 1600);
            const blackLow = new User("B", "bb@mail.com", "...", true, 800);

            redHigh.id = 3;
            blackLow.id = 4;

            const game = new Game(redHigh, blackLow);
            expect(game.pointsBlack).to.equal(0);
            game.draw();
            expect(game.pointsBlack).to.equal(12);
        });

        it("should decrease rating by 12 for a high rated user", () => {
            const redHigh = new User("R", "rr@mail.com", "...", true, 1600);
            const blackLow = new User("B", "bb@mail.com", "...", true, 800);

            redHigh.id = 3;
            blackLow.id = 4;

            const game = new Game(redHigh, blackLow);
            expect(game.redPlayer!.rating).to.equal(1600);
            game.draw();
            expect(game.redPlayer!.rating).to.equal(1600 - 12);
        });

        it("should increase rating by 12 for a low rated user", () => {
            const redHigh = new User("R", "rr@mail.com", "...", true, 1600);
            const blackLow = new User("B", "bb@mail.com", "...", true, 800);

            redHigh.id = 3;
            blackLow.id = 4;

            const game = new Game(redHigh, blackLow);
            expect(game.blackPlayer!.rating).to.equal(800);
            game.draw();
            expect(game.blackPlayer!.rating).to.equal(800 + 12);
        });
    });

    describe("#forfeit", () => {

        it("should set isGameOver to true", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            red.id = 1;
            black.id = 2;

            const game = new Game(red, black);
            expect(game.isGameOver).to.equal(false);
            game.forfeit(red);
            expect(game.isGameOver).to.equal(true);
        });

        it("should reset drawProposalCode", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            red.id = 1;
            black.id = 2;

            const game = new Game(red, black);
            game.drawProposalCode = "code";
            game.forfeit(red);
            expect(game.drawProposalCode).to.equal("");
        });

        it("should set winner", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            red.id = 1;
            black.id = 2;

            const game = new Game(red, black);
            expect(game.winner).to.equal(undefined);
            game.forfeit(red);
            expect(game.winner).to.equal(game.blackPlayer);
        });

        it("should have negative pointsRed after red forfeits", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            red.id = 1;
            black.id = 2;

            const game = new Game(red, black);
            expect(game.pointsRed).to.equal(0);
            game.forfeit(red);
            expect(game.pointsRed).to.equal(-13);
        });

        it("should have positive pointsBlack after red forfeits", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            red.id = 1;
            black.id = 2;

            const game = new Game(red, black);
            expect(game.pointsBlack).to.equal(0);
            game.forfeit(red);
            expect(game.pointsBlack).to.equal(13);
        });

        it("should decrease rating by 6 for a low rated user", () => {
            const redLow = new User("R", "rr@mail.com", "...", true, 1100);
            const blackHigh = new User("B", "bb@mail.com", "...", true, 1300);

            redLow.id = 3;
            blackHigh.id = 4;

            const game = new Game(redLow, blackHigh);
            expect(game.redPlayer!.rating).to.equal(1100);
            game.forfeit(redLow);
            expect(game.redPlayer!.rating).to.equal(1100 - 6);
        });

        it("should decrease rating by 19 for a high rated user", () => {
            const redLow = new User("R", "rr@mail.com", "...", true, 1100);
            const blackHigh = new User("B", "bb@mail.com", "...", true, 1300);

            redLow.id = 3;
            blackHigh.id = 4;

            const game = new Game(redLow, blackHigh);
            expect(game.blackPlayer!.rating).to.equal(1300);
            game.forfeit(blackHigh);
            expect(game.blackPlayer!.rating).to.equal(1300 - 19);
        });
    });

    describe("#checkmate", () => {

        it("should set isGameOver to true", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            red.id = 1;
            black.id = 2;

            const game = new Game(red, black);
            expect(game.isGameOver).to.equal(false);
            game.checkmate();
            expect(game.isGameOver).to.equal(true);
        });

        it("should reset drawProposalCode", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            red.id = 1;
            black.id = 2;

            const game = new Game(red, black);
            game.drawProposalCode = "code";
            game.checkmate();
            expect(game.drawProposalCode).to.equal("");
        });

        it("should set winner black", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            red.id = 1;
            black.id = 2;

            const game = new Game(red, black);
            expect(game.winner).to.equal(undefined);
            game.checkmate();
            expect(game.winner).to.equal(game.blackPlayer);
        });

        it("should set winner red", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            red.id = 1;
            black.id = 2;

            const game = new Game(red, black);
            game.move("炮 (32)-35");
            expect(game.winner).to.equal(undefined);
            game.checkmate();
            expect(game.winner).to.equal(game.redPlayer);
        });

        it("should have negative pointsRed after checkmate", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            red.id = 1;
            black.id = 2;

            const game = new Game(red, black);
            expect(game.pointsRed).to.equal(0);
            game.checkmate();
            expect(game.pointsRed).to.equal(-13);
        });

        it("should have positive pointsBlack after checkmate", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            red.id = 1;
            black.id = 2;

            const game = new Game(red, black);
            expect(game.pointsBlack).to.equal(0);
            game.checkmate();
            expect(game.pointsBlack).to.equal(13);
        });

        it("should decrease rating by 6 for a low rated user", () => {
            const redLow = new User("R", "rr@mail.com", "...", true, 1100);
            const blackHigh = new User("B", "bb@mail.com", "...", true, 1300);

            redLow.id = 3;
            blackHigh.id = 4;

            const game = new Game(redLow, blackHigh);
            expect(game.redPlayer!.rating).to.equal(1100);
            game.checkmate();
            expect(game.redPlayer!.rating).to.equal(1100 - 6);
        });

        it("should decrease rating by 19 for a high rated user", () => {
            const redLow = new User("R", "rr@mail.com", "...", true, 1100);
            const blackHigh = new User("B", "bb@mail.com", "...", true, 1300);

            redLow.id = 3;
            blackHigh.id = 4;

            const game = new Game(redLow, blackHigh);
            game.move("炮 (32)-35");
            expect(game.blackPlayer!.rating).to.equal(1300);
            game.checkmate();
            expect(game.blackPlayer!.rating).to.equal(1300 - 19);
        });
    });

    describe("#move", () => {

        it("should reset drawProposalCode", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            red.id = 1;
            black.id = 2;

            const game = new Game(red, black);
            game.drawProposalCode = "code";
            game.move("炮 (32)-35");
            expect(game.drawProposalCode).to.equal("");
        });

        it("should add move to movesJson", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            red.id = 1;
            black.id = 2;

            const game = new Game(red, black);
            expect(game.movesJson).to.equal("[]");
            game.move("炮 (32)-35");
            expect(game.movesJson).to.equal("[\"炮 (32)-35\"]");
            game.move("馬 (18)-37");
            expect(game.movesJson).to.equal("[\"炮 (32)-35\",\"馬 (18)-37\"]");
        });

        it("should add timestamp to moveDatesJson", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            red.id = 1;
            black.id = 2;

            const game = new Game(red, black);
            expect(game.moveDatesJson).to.equal("[]");
            game.move("炮 (32)-35");
            expect(game.moveDatesJson).to.match(/^\[\d{13}]$/);
            game.move("馬 (18)-37");
            expect(game.moveDatesJson).to.match(/^\[\d{13},\d{13}]$/);
        });

        it("should change turnPlayer", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            red.id = 1;
            black.id = 2;

            const game = new Game(red, black);
            expect(game.turnPlayer).to.equal(red);
            game.move("炮 (32)-35");
            expect(game.turnPlayer).to.equal(black);
            game.move("馬 (18)-37");
            expect(game.turnPlayer).to.equal(red);
        });

        it("should reset countdownMinutes", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            const game = new Game(red, black, true, 42);
            expect(game.countdownMinutes).to.equal(42);
            game.minutesPerMove = 100;
            game.move("炮 (32)-35");
            expect(game.countdownMinutes).to.equal(100);
        });
    });

    describe("#moveCount", () => {

        it("should return 1 for a new game", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            const game = new Game(red, black);
            expect(game.moveCount()).to.equal(1);
        });

        it("should return 1 after red moves", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            const game = new Game(red, black);

            game.move("炮 (32)-35");

            expect(game.moveCount()).to.equal(1);
        });

        it("should return 2 after red and black moves", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            const game = new Game(red, black);

            game.move("炮 (32)-35");
            game.move("馬 (18)-37");

            expect(game.moveCount()).to.equal(2);
        });
    });

    describe("#updateCountdownMinutes", () => {

        it("should use created-time when no move has been made", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            const game = new Game(red, black, true, 10);

            expect(game.countdownMinutes).to.equal(10);

            game.created = new Date(2000, 1, 1, 12, 0);
            const now =  new Date(2000, 1, 1, 12, 6).getTime();

            const remaining = game.updateCountdownMinutes(now);

            expect(remaining).to.equal(4);
            expect(game.countdownMinutes).to.equal(4);
        });

        it("should use last move timestamp", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            const game = new Game(red, black, true, 10);

            expect(game.countdownMinutes).to.equal(10);

            const moveTimestamps = [
                new Date(2000, 1, 1, 12, 5).getTime(),
                new Date(2000, 1, 1, 12, 10).getTime(),
                new Date(2000, 1, 1, 12, 15).getTime()
            ];

            game.moveDatesJson = JSON.stringify(moveTimestamps);

            const now =  new Date(2000, 1, 1, 12, 20).getTime();

            const remaining = game.updateCountdownMinutes(now);

            expect(remaining).to.equal(5);
            expect(game.countdownMinutes).to.equal(5);
        });

        it("should return 0 when exceeding time", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            const game = new Game(red, black, true, 10);

            expect(game.countdownMinutes).to.equal(10);

            const moveTimestamps = [
                new Date(2000, 1, 1, 12, 5).getTime(),
                new Date(2000, 1, 1, 12, 10).getTime(),
                new Date(2000, 1, 1, 12, 15).getTime()
            ];

            game.moveDatesJson = JSON.stringify(moveTimestamps);

            const now =  new Date(2000, 1, 1, 12, 25).getTime();

            const remaining = game.updateCountdownMinutes(now);

            expect(remaining).to.equal(0);
            expect(game.countdownMinutes).to.equal(0);
        });

        it("should return 0 when exceeding time by a lot", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            const game = new Game(red, black, true, 10);

            expect(game.countdownMinutes).to.equal(10);

            const moveTimestamps = [
                new Date(2000, 1, 1, 12, 5).getTime(),
                new Date(2000, 1, 1, 12, 10).getTime(),
                new Date(2000, 1, 1, 12, 15).getTime()
            ];

            game.moveDatesJson = JSON.stringify(moveTimestamps);

            const now =  new Date(2000, 1, 1, 12, 45).getTime();

            const remaining = game.updateCountdownMinutes(now);

            expect(remaining).to.equal(0);
            expect(game.countdownMinutes).to.equal(0);
        });

        it("should end game when exceeding time", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            red.id = 1;
            black.id = 2;

            const game = new Game(red, black, true, 10);

            expect(game.countdownMinutes).to.equal(10);

            const moveTimestamps = [
                new Date(2000, 1, 1, 12, 5).getTime(),
                new Date(2000, 1, 1, 12, 10).getTime(),
                new Date(2000, 1, 1, 12, 15).getTime()
            ];

            game.moveDatesJson = JSON.stringify(moveTimestamps);

            const now =  new Date(2000, 1, 1, 12, 25).getTime();

            expect(game.isGameOver).to.equal(false);

            game.updateCountdownMinutes(now);

            expect(game.isGameOver).to.equal(true);
        });

        it("should make red winner when black exceeds time", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            red.id = 1;
            black.id = 2;

            const game = new Game(red, black, true, 10);

            expect(game.countdownMinutes).to.equal(10);

            // Red makes a move
            game.move("炮 (32)-35");

            // Change the time of the move
            game.moveDatesJson = JSON.stringify([new Date(2000, 1, 1, 12, 0).getTime()]);

            // Let the time be 11 minutes after the last move
            const now =  new Date(2000, 1, 1, 12, 11).getTime();

            expect(game.winner).to.equal(undefined);

            game.updateCountdownMinutes(now);

            expect(game.winner).to.equal(red);
        });
    });

    describe("#timeRemaining", () => {

        it("should return plural when unit is more than 1", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            const days = 2 * 24 * 60;
            const hours = 2 * 60;
            const minutes = 2;

            const game = new Game(red, black, true, days + hours + minutes);

            expect(game.timeRemaining()).to.equal("2 days, 2 hours and 2 minutes");
        });

        it("should return singular when unit is 1", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            const days = 24 * 60;
            const hours = 60;
            const minutes = 1;

            const game = new Game(red, black, true, days + hours + minutes);

            expect(game.timeRemaining()).to.equal("1 day, 1 hour and 1 minute");
        });

        it("should return two parts when one unit is 0", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            const days = 7 * 24 * 60;
            const hours = 60;
            const minutes = 0;

            const game = new Game(red, black, true, days + hours + minutes);

            expect(game.timeRemaining()).to.equal("7 days and 1 hour");
        });

        it("should return one part when two units are 0", () => {
            const red = new User("R", "r@mail.com", "...", true, 1200);
            const black = new User("B", "b@mail.com", "...", true, 1200);

            const days = 0;
            const hours = 3 * 60;
            const minutes = 0;

            const game = new Game(red, black, true, days + hours + minutes);

            expect(game.timeRemaining()).to.equal("3 hours");
        });
    });
});
