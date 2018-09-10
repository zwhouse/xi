import {expect} from 'chai';
import 'mocha';
import {Square} from "../src/square";
import {Color} from "../src/color";
import {No} from "../src/piece";
import {Board} from "../src/board";
import {Direction} from "../src/direction";

describe("Square", () => {

    describe("#getFile", () => {

        //  index  red  black
        //  0      9    1
        //  1      8    2
        //  2      7    3
        //  3      6    4
        //  4      5    5
        //  5      4    6
        //  6      3    7
        //  7      2    8
        //  8      1    9
        it("index 0..8 should return 9..1 for `Color.Red`", () => {
            const board = new Board();
            expect(new Square(board, 0, 0).getFile(Color.Red)).to.equal(9);
            expect(new Square(board, 1, 0).getFile(Color.Red)).to.equal(8);
            expect(new Square(board, 2, 0).getFile(Color.Red)).to.equal(7);
            expect(new Square(board, 3, 0).getFile(Color.Red)).to.equal(6);
            expect(new Square(board, 4, 0).getFile(Color.Red)).to.equal(5);
            expect(new Square(board, 5, 0).getFile(Color.Red)).to.equal(4);
            expect(new Square(board, 6, 0).getFile(Color.Red)).to.equal(3);
            expect(new Square(board, 7, 0).getFile(Color.Red)).to.equal(2);
            expect(new Square(board, 8, 0).getFile(Color.Red)).to.equal(1);
        });

        //  index  red  black
        //  0      9    1
        //  1      8    2
        //  2      7    3
        //  3      6    4
        //  4      5    5
        //  5      4    6
        //  6      3    7
        //  7      2    8
        //  8      1    9
        it("index 0..8 should return 1..9 for `Color.Black`", () => {
            const board = new Board();
            expect(new Square(board, 0, 0).getFile(Color.Black)).to.equal(1);
            expect(new Square(board, 1, 0).getFile(Color.Black)).to.equal(2);
            expect(new Square(board, 2, 0).getFile(Color.Black)).to.equal(3);
            expect(new Square(board, 3, 0).getFile(Color.Black)).to.equal(4);
            expect(new Square(board, 4, 0).getFile(Color.Black)).to.equal(5);
            expect(new Square(board, 5, 0).getFile(Color.Black)).to.equal(6);
            expect(new Square(board, 6, 0).getFile(Color.Black)).to.equal(7);
            expect(new Square(board, 7, 0).getFile(Color.Black)).to.equal(8);
            expect(new Square(board, 8, 0).getFile(Color.Black)).to.equal(9);
        });
    });

    describe("#getRank", () => {

        //  index  red  black
        //  0      10   1
        //  1      9    2
        //  2      8    3
        //  3      7    4
        //  4      6    5
        //  5      5    6
        //  6      4    7
        //  7      3    8
        //  8      2    9
        //  9      1    10
        it("index 0..9 should return 10..1 for `Color.Red`", () => {
            const board = new Board();
            expect(new Square(board, 0, 0).getRank(Color.Red)).to.equal(10);
            expect(new Square(board, 0, 1).getRank(Color.Red)).to.equal(9);
            expect(new Square(board, 0, 2).getRank(Color.Red)).to.equal(8);
            expect(new Square(board, 0, 3).getRank(Color.Red)).to.equal(7);
            expect(new Square(board, 0, 4).getRank(Color.Red)).to.equal(6);
            expect(new Square(board, 0, 5).getRank(Color.Red)).to.equal(5);
            expect(new Square(board, 0, 6).getRank(Color.Red)).to.equal(4);
            expect(new Square(board, 0, 7).getRank(Color.Red)).to.equal(3);
            expect(new Square(board, 0, 8).getRank(Color.Red)).to.equal(2);
            expect(new Square(board, 0, 9).getRank(Color.Red)).to.equal(1);
        });

        //  index  red  black
        //  0      10   1
        //  1      9    2
        //  2      8    3
        //  3      7    4
        //  4      6    5
        //  5      5    6
        //  6      4    7
        //  7      3    8
        //  8      2    9
        //  9      1    10
        it("index 0..9 should return 1..10 for `Color.Black`", () => {
            const board = new Board();
            expect(new Square(board, 0, 0).getRank(Color.Black)).to.equal(1);
            expect(new Square(board, 0, 1).getRank(Color.Black)).to.equal(2);
            expect(new Square(board, 0, 2).getRank(Color.Black)).to.equal(3);
            expect(new Square(board, 0, 3).getRank(Color.Black)).to.equal(4);
            expect(new Square(board, 0, 4).getRank(Color.Black)).to.equal(5);
            expect(new Square(board, 0, 5).getRank(Color.Black)).to.equal(6);
            expect(new Square(board, 0, 6).getRank(Color.Black)).to.equal(7);
            expect(new Square(board, 0, 7).getRank(Color.Black)).to.equal(8);
            expect(new Square(board, 0, 8).getRank(Color.Black)).to.equal(9);
            expect(new Square(board, 0, 9).getRank(Color.Black)).to.equal(10);
        });
    });

    describe("#getNotation", () => {

        it("should return different notation for different colors", () => {
            const board = new Board();
            expect(new Square(board, 0, 0).getNotation(Color.Red)).to.equal("109");
            expect(new Square(board, 0, 0).getNotation(Color.Black)).to.equal("11");
        });
    });

    describe("#setPiece", () => {

        it("should return `No.piece` when square is not occupied", () => {
            const board = new Board();
            const blackSoldier = Board.createPiece("s");

            expect(new Square(board, 0, 0).setPiece(blackSoldier)).to.equal(No.piece);
        });

        it("should throw error when square is occupied by the same color", () => {
            const board = new Board();
            const square = new Square(board, 0, 0);
            
            const blackSoldier = Board.createPiece("s");
            const blackGeneral = Board.createPiece("g");

            square.setPiece(blackSoldier);
            expect(() => { square.setPiece(blackGeneral) }).to.throw(Error);
        });

        it("should return captured piece when square is occupied by other color", () => {
            const board = new Board();
            const square = new Square(board, 0, 0);
            const blackSoldier = Board.createPiece("s");
            const redRook = Board.createPiece("R");

            square.setPiece(blackSoldier);

            const capturedPiece = square.setPiece(redRook);

            expect(capturedPiece.charWestern).to.equal(blackSoldier.charWestern);
        });
    });

    describe("#isSquare", () => {

        it("should return true for multiple directions at once when still on the board", () => {

            const board = new Board(
                `. . . . . . . . .
                       . H . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .`);

            const redHorse = board.getSquare(1, 1);

            expect(redHorse.isSquare(Direction.Right, Direction.Right, Direction.Up)).to.equal(true);
            expect(redHorse.isSquare(Direction.Right, Direction.Right, Direction.Down)).to.equal(true);
            expect(redHorse.isSquare(Direction.Down, Direction.Down, Direction.Right)).to.equal(true);
            expect(redHorse.isSquare(Direction.Down, Direction.Down, Direction.Left)).to.equal(true);
        });

        it("should return false for multiple directions at once when not on the board", () => {

            const board = new Board(
                `. . . . . . . . .
                       . H . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .`);

            const redHorse = board.getSquare(1, 1);

            expect(redHorse.isSquare(Direction.Left, Direction.Left, Direction.Up)).to.equal(false);
            expect(redHorse.isSquare(Direction.Left, Direction.Left, Direction.Down)).to.equal(false);
            expect(redHorse.isSquare(Direction.Up, Direction.Up, Direction.Right)).to.equal(false);
            expect(redHorse.isSquare(Direction.Up, Direction.Up, Direction.Left)).to.equal(false);
        });

        it("should return true for inner square in all directions for red", () => {

            const board = new Board(
                `. . . . . . . . .
                       . R . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .`);

            const redRook = board.getSquare(1, 1);

            expect(redRook.isSquare(Direction.Up)).to.equal(true);
            expect(redRook.isSquare(Direction.Right)).to.equal(true);
            expect(redRook.isSquare(Direction.Down)).to.equal(true);
            expect(redRook.isSquare(Direction.Left)).to.equal(true);
        });

        it("should return true for inner square in all directions for black", () => {

            const board = new Board(
                `. . . . . . . . .
                       . r . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .`);

            const blackRook = board.getSquare(1, 1);

            expect(blackRook.isSquare(Direction.Up)).to.equal(true);
            expect(blackRook.isSquare(Direction.Right)).to.equal(true);
            expect(blackRook.isSquare(Direction.Down)).to.equal(true);
            expect(blackRook.isSquare(Direction.Left)).to.equal(true);
        });

        it("should return false for red going `Up` when on the upper row", () => {

            const board = new Board(
                `. R . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .`);

            const redRook = board.getSquare(1, 0);

            expect(redRook.isSquare(Direction.Up)).to.equal(false);
            expect(redRook.isSquare(Direction.Right)).to.equal(true);
            expect(redRook.isSquare(Direction.Down)).to.equal(true);
            expect(redRook.isSquare(Direction.Left)).to.equal(true);
        });

        it("should return false for black going `Up` when on the bottom row", () => {

            const board = new Board(
                `. . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . r . . . . . . .`);

            const blackRook = board.getSquare(1, 9);

            expect(blackRook.isSquare(Direction.Up)).to.equal(false);
            expect(blackRook.isSquare(Direction.Right)).to.equal(true);
            expect(blackRook.isSquare(Direction.Down)).to.equal(true);
            expect(blackRook.isSquare(Direction.Left)).to.equal(true);
        });

        it("should return false for red going `Down` when on the bottom row", () => {

            const board = new Board(
                `. . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . R . . . . . . .`);

            const redRook = board.getSquare(1, 9);

            expect(redRook.isSquare(Direction.Up)).to.equal(true);
            expect(redRook.isSquare(Direction.Right)).to.equal(true);
            expect(redRook.isSquare(Direction.Down)).to.equal(false);
            expect(redRook.isSquare(Direction.Left)).to.equal(true);
        });

        it("should return false for black going `Down` when on the upper row", () => {

            const board = new Board(
                `. r . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .`);

            const blackRook = board.getSquare(1, 0);

            expect(blackRook.isSquare(Direction.Up)).to.equal(true);
            expect(blackRook.isSquare(Direction.Right)).to.equal(true);
            expect(blackRook.isSquare(Direction.Down)).to.equal(false);
            expect(blackRook.isSquare(Direction.Left)).to.equal(true);
        });

        it("should return false for red going `Left` when on the left row", () => {

            const board = new Board(
                `. . . . . . . . .
                       R . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .`);

            const redRook = board.getSquare(0, 1);

            expect(redRook.isSquare(Direction.Up)).to.equal(true);
            expect(redRook.isSquare(Direction.Right)).to.equal(true);
            expect(redRook.isSquare(Direction.Down)).to.equal(true);
            expect(redRook.isSquare(Direction.Left)).to.equal(false);
        });

        it("should return false for black going `Left` when on the right row", () => {

            const board = new Board(
                `. . . . . . . . .
                       . . . . . . . . r
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .`);

            const blackRook = board.getSquare(8, 1);

            expect(blackRook.isSquare(Direction.Up)).to.equal(true);
            expect(blackRook.isSquare(Direction.Right)).to.equal(true);
            expect(blackRook.isSquare(Direction.Down)).to.equal(true);
            expect(blackRook.isSquare(Direction.Left)).to.equal(false);
        });

        it("should return false for red going `Right` when on the right row", () => {

            const board = new Board(
                `. . . . . . . . .
                       . . . . . . . . R
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .`);

            const redRook = board.getSquare(8, 1);

            expect(redRook.isSquare(Direction.Up)).to.equal(true);
            expect(redRook.isSquare(Direction.Right)).to.equal(false);
            expect(redRook.isSquare(Direction.Down)).to.equal(true);
            expect(redRook.isSquare(Direction.Left)).to.equal(true);
        });

        it("should return false for black going `Right` when on the left row", () => {

            const board = new Board(
                `. . . . . . . . .
                       r . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .`);

            const blackRook = board.getSquare(0, 1);

            expect(blackRook.isSquare(Direction.Up)).to.equal(true);
            expect(blackRook.isSquare(Direction.Right)).to.equal(false);
            expect(blackRook.isSquare(Direction.Down)).to.equal(true);
            expect(blackRook.isSquare(Direction.Left)).to.equal(true);
        });

        it("should throw an error when square is unoccupied", () => {
            const board = new Board(
                `. . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .`);

            const square = new Square(board, 0, 0);

            expect(() => { square.isSquare(Direction.Down) }).to.throw(Error);
        });
    });
    
    describe("#isInOwnCastle", () => {

        const board = new Board(
            `g g g g g g g g g
                   . . . G . g . . .
                   . . . G . g . . .
                   . . . G . g . . .
                   . . . G . g . . .
                   . . . G . g . . .
                   . . . G . g . . .
                   . . . G . g . . .
                   . . . G . g . . .
                   G G G G G G G G G`);

        it("should return false for red when x <= 2", () => {

            for (let x = 0; x <= 2; x++) {
                const general = board.getSquare(x, 9);
                expect(general.isInOwnCastle()).to.equal(false);
            }
        });

        it("should return true for red when x >= 3 and x <= 5", () => {

            for (let x = 3; x <= 5; x++) {
                const general = board.getSquare(x, 9);
                expect(general.isInOwnCastle()).to.equal(true);
            }
        });

        it("should return false for red when x >= 6", () => {

            for (let x = 6; x <= 8; x++) {
                const general = board.getSquare(x, 9);
                expect(general.isInOwnCastle()).to.equal(false);
            }
        });

        it("should return false for red when y <= 6", () => {

            for (let y = 1; y <= 6; y++) {
                const general = board.getSquare(3, y);
                expect(general.isInOwnCastle()).to.equal(false);
            }
        });

        it("should return true for red when y >= 7", () => {

            for (let y = 7; y <= 9; y++) {
                const general = board.getSquare(3, y);
                expect(general.isInOwnCastle()).to.equal(true);
            }
        });

        it("should return false for black when x <= 2", () => {

            for (let x = 0; x <= 2; x++) {
                const general = board.getSquare(x, 0);
                expect(general.isInOwnCastle()).to.equal(false);
            }
        });

        it("should return true for black when x >= 3 and x <= 5", () => {

            for (let x = 3; x <= 5; x++) {
                const general = board.getSquare(x, 0);
                expect(general.isInOwnCastle()).to.equal(true);
            }
        });

        it("should return false for black when x >= 6", () => {

            for (let x = 6; x <= 8; x++) {
                const general = board.getSquare(x, 0);
                expect(general.isInOwnCastle()).to.equal(false);
            }
        });

        it("should return false for black when y >= 3", () => {

            for (let y = 3; y <= 8; y++) {
                const general = board.getSquare(5, y);
                expect(general.isInOwnCastle()).to.equal(false);
            }
        });

        it("should return true for black when y <= 2", () => {

            for (let y = 0; y <= 2; y++) {
                const general = board.getSquare(5, y);
                expect(general.isInOwnCastle()).to.equal(true);
            }
        });
    });

    describe("#isOverTheRiver", () => {

        it("should return false for red when y is 5..9", () => {
            const board = new Board(
                `S . . . . . . . .
                       S . . . . . . . .
                       S . . . . . . . .
                       S . . . . . . . .
                       S . . . . . . . .
                       S . . . . . . . .
                       S . . . . . . . .
                       S . . . . . . . .
                       S . . . . . . . .
                       S . . . . . . . .`);

            for (let y = 5; y <= 9; y++) {
                const soldier = board.getSquare(0, y);
                expect(soldier.isOverTheRiver()).to.equal(false);
            }
        });

        it("should return true for red when y is 0..4", () => {
            const board = new Board(
                `S . . . . . . . .
                       S . . . . . . . .
                       S . . . . . . . .
                       S . . . . . . . .
                       S . . . . . . . .
                       S . . . . . . . .
                       S . . . . . . . .
                       S . . . . . . . .
                       S . . . . . . . .
                       S . . . . . . . .`);

            for (let y = 0; y <= 4; y++) {
                const soldier = board.getSquare(0, y);
                expect(soldier.isOverTheRiver()).to.equal(true);
            }
        });

        it("should return false for black when y is 0..4", () => {
            const board = new Board(
                `s . . . . . . . .
                       s . . . . . . . .
                       s . . . . . . . .
                       s . . . . . . . .
                       s . . . . . . . .
                       s . . . . . . . .
                       s . . . . . . . .
                       s . . . . . . . .
                       s . . . . . . . .
                       s . . . . . . . .`);

            for (let y = 0; y <= 4; y++) {
                const soldier = board.getSquare(0, y);
                expect(soldier.isOverTheRiver()).to.equal(false);
            }
        });

        it("should return true for black when y is 5..9", () => {
            const board = new Board(
                `s . . . . . . . .
                       s . . . . . . . .
                       s . . . . . . . .
                       s . . . . . . . .
                       s . . . . . . . .
                       s . . . . . . . .
                       s . . . . . . . .
                       s . . . . . . . .
                       s . . . . . . . .
                       s . . . . . . . .`);

            for (let y = 5; y <= 9; y++) {
                const soldier = board.getSquare(0, y);
                expect(soldier.isOverTheRiver()).to.equal(true);
            }
        });
    });

    describe("#getSquare", () => {

        it("should return expected squares for red", () => {
            const board = new Board(
                `. . . . . . . . .
                       . R . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .`);

            const redRook = board.getSquare(1, 1);

            const up = board.getSquare(1, 0);
            const right = board.getSquare(2, 1);
            const down = board.getSquare(1, 2);
            const left = board.getSquare(0, 1);

            expect(redRook.getSquare(Direction.Up)).to.equal(up);
            expect(redRook.getSquare(Direction.Right)).to.equal(right);
            expect(redRook.getSquare(Direction.Down)).to.equal(down);
            expect(redRook.getSquare(Direction.Left)).to.equal(left);
        });

        it("should return expected squares for black", () => {
            const board = new Board(
                `. . . . . . . . .
                       . r . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .`);

            const blackRook = board.getSquare(1, 1);

            const up = board.getSquare(1, 0);
            const right = board.getSquare(2, 1);
            const down = board.getSquare(1, 2);
            const left = board.getSquare(0, 1);

            expect(blackRook.getSquare(Direction.Up)).to.equal(down);
            expect(blackRook.getSquare(Direction.Right)).to.equal(left);
            expect(blackRook.getSquare(Direction.Down)).to.equal(up);
            expect(blackRook.getSquare(Direction.Left)).to.equal(right);
        });

        it("should throw an error when going off the board", () => {
            const board = new Board(
                `r . . . . . . . S
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       R . . . . . . . s`);

            const redSoldier = board.getSquare(8, 0);
            const redRook = board.getSquare(0, 9);

            const blackSoldier = board.getSquare(8, 9);
            const blackRook = board.getSquare(0, 0);

            expect(() => { redSoldier.getSquare(Direction.Up) }).to.throw(Error);
            expect(() => { redSoldier.getSquare(Direction.Right) }).to.throw(Error);
            expect(() => { redRook.getSquare(Direction.Down) }).to.throw(Error);
            expect(() => { redRook.getSquare(Direction.Left) }).to.throw(Error);

            expect(() => { blackSoldier.getSquare(Direction.Up) }).to.throw(Error);
            expect(() => { blackSoldier.getSquare(Direction.Left) }).to.throw(Error);
            expect(() => { blackRook.getSquare(Direction.Down) }).to.throw(Error);
            expect(() => { blackRook.getSquare(Direction.Right) }).to.throw(Error);
        });
    });

    describe("#getSquares", () => {

        const board = new Board(
            `. . . . . . . . .
                   . . . . . . . . .
                   . . . . . . . . .
                   . . . . . . s . .
                   . . . . R . . . .
                   . . . . . . s . .
                   S . . . . . R . S
                   . . . . . . . . .
                   . . . . . . . . .
                   . . . . . . E . .`);

        it("should return all unoccupied squares", () => {
            const redRookSquare = board.getSquare(4, 4);

            const squaresUp = redRookSquare.getSquares(Direction.Up);
            const squaresRight = redRookSquare.getSquares(Direction.Right);
            const squaresDown = redRookSquare.getSquares(Direction.Down);
            const squaresLeft = redRookSquare.getSquares(Direction.Left);

            expect(squaresUp.length).to.equal(4);
            expect(squaresRight.length).to.equal(4);
            expect(squaresDown.length).to.equal(5);
            expect(squaresLeft.length).to.equal(4);
        });

        it("should include occupied squares", () => {
            const redRookSquare = board.getSquare(6, 6);

            const squaresUp = redRookSquare.getSquares(Direction.Up);
            const squaresRight = redRookSquare.getSquares(Direction.Right);
            const squaresDown = redRookSquare.getSquares(Direction.Down);
            const squaresLeft = redRookSquare.getSquares(Direction.Left);

            expect(squaresUp.length).to.equal(1);
            expect(squaresRight.length).to.equal(2);
            expect(squaresDown.length).to.equal(3);
            expect(squaresLeft.length).to.equal(6);
        });

        it("should include 2 occupied squares", () => {
            const redRookSquare = board.getSquare(6, 6);

            const squaresUp = redRookSquare.getSquares(Direction.Up, 2);

            expect(squaresUp.length).to.equal(3);
        });
    });

    describe("#isColor", () => {

        const board = new Board(
            `r . . . . . . . .
                   . R . . . . . . .
                   . . . . . . . . .
                   . . . . . . . . .
                   . . . . . . . . .
                   . . . . . . . . .
                   . . . . . . . . .
                   . . . . . . . . .
                   . . . . . . . . .
                   . . . . . . . . .`);

        it("should return expected values for a black square", () => {

            const square = board.getSquare(0, 0);

            expect(square.isColor(Color.Red)).to.equal(false);
            expect(square.isColor(Color.Black)).to.equal(true);
            expect(square.isColor(Color.None)).to.equal(false);
        });

        it("should return expected values for a red square", () => {

            const square = board.getSquare(1, 1);

            expect(square.isColor(Color.Red)).to.equal(true);
            expect(square.isColor(Color.Black)).to.equal(false);
            expect(square.isColor(Color.None)).to.equal(false);
        });

        it("should return expected values for an empty square", () => {

            const square = board.getSquare(2, 2);

            expect(square.isColor(Color.Red)).to.equal(false);
            expect(square.isColor(Color.Black)).to.equal(false);
            expect(square.isColor(Color.None)).to.equal(true);
        });
    });
});
