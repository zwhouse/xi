import {expect} from 'chai';
import 'mocha';
import {Move} from "../src/move";
import {Board} from "../src/board";

describe("Move", () => {

    describe("#constructor", () => {

        const board = new Board();

        it("should throw an error when from-square is unoccupied", () => {
            expect(() => { new Move(board.getSquare(0, 1), board.getSquare(0, 2)) }).to.throw(Error);
        });

        it("should not throw an error when from-square is occupied", () => {
            new Move(board.getSquare(0, 0), board.getSquare(0, 1));
        });

        it("should create a Chinese string representation", () => {
            const board = new Board();
            const redMove = new Move(board.getSquare(8, 6), board.getSquare(8, 5));
            expect(redMove.moveStr).to.equal("兵 (41)-51");
        });
    });

    describe("#create", () => {

        it("should parse single digit rank and file properly", () => {

            const board = new Board(
                `r h e a g a e h r
                       . . s . . . . . .
                       . c . . . . . c .
                       s . s . s . s . s
                       . . . . . . . . .
                       . . . . . . . . .
                       S . S . S . S . S
                       . C . . . . . C .
                       . . . . . . . . .
                       R H E A G A E H R`
            );

            const move = Move.create("卒 (12)-34", board);

            expect(move.fromRank).to.equal(1);
            expect(move.fromFile).to.equal(2);
            expect(move.toRank).to.equal(3);
            expect(move.toFile).to.equal(4);
        });

        it("should parse double digit rank properly", () => {

            const board = new Board(
                `r h e a g a e h r
                       . . . . . . . . .
                       . c . . . . . c .
                       s . s . s . s . s
                       . . . . . . . . .
                       . . . . . . . . .
                       S . S . S . S . S
                       . C . . . . . C .
                       . . . . . . . . .
                       R s E A G A E H R`
            );

            const move = Move.create("卒 (102)-103", board);

            expect(move.fromRank).to.equal(10);
            expect(move.fromFile).to.equal(2);
            expect(move.toRank).to.equal(10);
            expect(move.toFile).to.equal(3);
        });

        it("should parse with spaces properly", () => {

            const board = new Board(
                `r h e a g a e h r
                       . . . . . . . . .
                       . c . . . . . c .
                       s . s . s . s . s
                       . . . . . . . . .
                       . . . . . . . . .
                       S . S . S . S . S
                       . C . . . . . C .
                       . . . . . . . . .
                       R s E A G A E H R`
            );

            const move = Move.create("卒 ( 10 2 ) - 10 3 ", board);

            expect(move.fromRank).to.equal(10);
            expect(move.fromFile).to.equal(2);
            expect(move.toRank).to.equal(10);
            expect(move.toFile).to.equal(3);
        });

        it("should throw error for invalid move", () => {
            const board = new Board();
            expect(() => { Move.create("卒 (1122)-34", board) }).to.throw(Error);
            expect(() => { Move.create("卒 (12)-3344", board) }).to.throw(Error);
        });
    });

    /*
           (i)     0 1 2 3 4 5 6 7 8
                     |           |
               (B) 1 2 3 4 5 6 7 8 9
            0---1---[b]          |    10
            1   2                |    9
            2   3        b       |    8
            3   4                |    7
            4   5                |    6
            5   6                |    5
            6   7                |    4
            7   8            r   |    3
            8   9                |    2
            9--10---------------[r]   1
                   9 8 7 6 5 4 3 2 1 (R)
    */
    describe("#from", () => {

        it("should return different squares depending on color", () => {

            const board = new Board();

            const redMove = Move.create("S (12)-34", board);
            const blackMove = Move.create("s (12)-34", board);

            expect(redMove.from.x).to.equal(7);
            expect(redMove.from.y).to.equal(9);

            expect(blackMove.from.x).to.equal(1);
            expect(blackMove.from.y).to.equal(0);
        });
    });

    /*
           (i)     0 1 2 3 4 5 6 7 8
                         |   |
               (B) 1 2 3 4 5 6 7 8 9
            0   1    b   |   |        10
            1   2        |   |        9
            2---3-------[b]  |        8
            3   4            |        7
            4   5            |        6
            5   6            |        5
            6   7            |        4
            7---8-----------[r]       3
            8   9                     2
            9  10                r    1
                   9 8 7 6 5 4 3 2 1 (R)
    */
    describe("#to", () => {

        it("should return different squares depending on color", () => {

            const board = new Board();

            const redMove = Move.create("S (12)-34", board);
            const blackMove = Move.create("s (12)-34", board);

            expect(redMove.to.x).to.equal(5);
            expect(redMove.to.y).to.equal(7);

            expect(blackMove.to.x).to.equal(3);
            expect(blackMove.to.y).to.equal(2);
        });
    });
});