import {expect} from 'chai';
import 'mocha';
import {Move} from "../src/move";
import {Board} from "../src/board";

describe("Move", ()  => {

    describe("#constructor", ()  => {

        it("should parse single digit rank and file properly", () => {

            const move = new Move("卒 (12)-34");

            expect(move.fromRank).to.equal(1);
            expect(move.fromFile).to.equal(2);
            expect(move.toRank).to.equal(3);
            expect(move.toFile).to.equal(4);
        });

        it("should parse double digit rank properly", () => {

            const move = new Move("卒 (102)-103");

            expect(move.fromRank).to.equal(10);
            expect(move.fromFile).to.equal(2);
            expect(move.toRank).to.equal(10);
            expect(move.toFile).to.equal(3);
        });

        it("should parse with spaces properly", () => {

            const move = new Move("卒 ( 10 2 ) - 10 3 ");

            expect(move.fromRank).to.equal(10);
            expect(move.fromFile).to.equal(2);
            expect(move.toRank).to.equal(10);
            expect(move.toFile).to.equal(3);
        });

        it("should throw error for invalid move", () => {
            expect(() => { new Move("卒 (1122)-34") }).to.throw(Error);
            expect(() => { new Move("卒 (12)-3344") }).to.throw(Error);
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
    describe("#fromSquare", ()  => {

        it("should return different squares depending on color", () => {
            const board = new Board();
            const redMove = new Move("S (12)-34");
            const blackMove = new Move("s (12)-34");

            const redSquareFrom = redMove.fromSquare(board);
            const blackSquareFrom = blackMove.fromSquare(board);

            expect(redSquareFrom.x).to.equal(7);
            expect(redSquareFrom.y).to.equal(9);

            expect(blackSquareFrom.x).to.equal(1);
            expect(blackSquareFrom.y).to.equal(0);
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
    describe("#toSquare", ()  => {

        it("should return different squares depending on color", () => {
            const board = new Board();
            const redMove = new Move("S (12)-34");
            const blackMove = new Move("s (12)-34");

            const redSquareTo = redMove.toSquare(board);
            const blackSquareTo = blackMove.toSquare(board);

            expect(redSquareTo.x).to.equal(5);
            expect(redSquareTo.y).to.equal(7);

            expect(blackSquareTo.x).to.equal(3);
            expect(blackSquareTo.y).to.equal(2);
        });
    });
});