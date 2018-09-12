import {expect} from 'chai';
import 'mocha';
import {Board} from "../src/board";
import {Move} from "../src/move";
import {Color} from "../src/color";

describe("Board", () => {

    describe("#constructor", () => {

        it("should throw an error when state has less than 90 chars", () => {
            expect(() => { new Board(".........................................................................................") }).to.throw(Error);
        });

        it("should throw an error when state has more than 90 chars", () => {
            expect(() => { new Board("...........................................................................................") }).to.throw(Error);
        });

        it("should not throw an error when state has 90 chars", () => {
            expect(() => { new Board("..........................................................................................") }).to.not.throw(Error);
        });

        it("should not throw an error without providing a state", () => {
            expect(() => { new Board() }).to.not.throw(Error);
        });
    });

    describe("#getSquare", () => {

        it("outside 0..8 should throw error for `x`", () => {
            expect(() => { new Board().getSquare(-1, 4) }).to.throw(Error);
            expect(() => { new Board().getSquare(9, 4) }).to.throw(Error);
        });

        it("outside 0..9 should throw error for `y`", () => {
            expect(() => { new Board().getSquare(4, -1) }).to.throw(Error);
            expect(() => { new Board().getSquare(4, 10) }).to.throw(Error);
        });

        it("in bounds should return expected `Square`", () => {

            // upper left corner
            expect(new Board().getSquare(0, 0).x).to.equal(0);
            expect(new Board().getSquare(0, 0).y).to.equal(0);

            // upper right corner
            expect(new Board().getSquare(0, 9).x).to.equal(0);
            expect(new Board().getSquare(0, 9).y).to.equal(9);

            // lower left corner
            expect(new Board().getSquare(8, 0).x).to.equal(8);
            expect(new Board().getSquare(8, 0).y).to.equal(0);

            // lower right corner
            expect(new Board().getSquare(8, 9).x).to.equal(8);
            expect(new Board().getSquare(8, 9).y).to.equal(9);
        });
    });

    describe("#isTurn", () => {

        it("should start with red's turn", () => {

            const board = new Board();

            expect(board.isTurn(Color.Red));
        });

        it("should change to black's turn after making a move", () => {

            const board = new Board();
            const move = Move.create("炮 (32)-35", board);

            expect(board.isTurn(Color.Red));

            board.makeMove(move);

            expect(board.isTurn(Color.Black));
        });
    });

    describe("#getCapturedPieces", () => {

        it("should return empty lists for a new Board", () => {

            const board = new Board();

            expect(board.getCapturedPieces(Color.Red).length).to.equal(0);
            expect(board.getCapturedPieces(Color.Black).length).to.equal(0);
        });

        it("should contain 1 black horse after capturing it by the red cannon", () => {

            const board = new Board();
            const move = Move.create("炮 (32)-102", board);

            board.makeMove(move);

            expect(board.getCapturedPieces(Color.Red).length).to.equal(0);

            const blackPiecesCaptured = board.getCapturedPieces(Color.Black);

            expect(blackPiecesCaptured.length).to.equal(1);
            expect(blackPiecesCaptured[0].charWestern).to.equal("h");
        });
    });

    describe("#areGeneralsLookingAtEachOther", () => {

        it("should return true test 1", () => {

            const board = new Board(
                `. . . . g . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . G . . . .`);

            expect(board.areGeneralsLookingAtEachOther()).to.equal(true);
        });

        it("should return true test 2", () => {

            const board = new Board(
                `. . . . . . . . .
                       . . . . . . . . .
                       . . . g . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . G . . . . .
                       . . . . . . . . .
                       . . . . . . . . .`);

            expect(board.areGeneralsLookingAtEachOther()).to.equal(true);
        });

        it("should return true test 3", () => {

            const board = new Board(
                `. . . . . g . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . G . . .`);

            expect(board.areGeneralsLookingAtEachOther()).to.equal(true);
        });

        it("should return false when not on the same file", () => {

            const board = new Board(
                `. . . . . g . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . G . . . .
                       . . . . . . . . .
                       . . . . . . . . .`);

            expect(board.areGeneralsLookingAtEachOther()).to.equal(false);
        });

        it("should return false with piece in between", () => {

            const board = new Board(
                `. . . . . g . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . s . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . G . . .
                       . . . . . . . . .`);

            expect(board.areGeneralsLookingAtEachOther()).to.equal(false);
        });
    });

    describe("#isCheck", () => {

        it("should return true for a cannon check", () => {

            const board = new Board(
                `. . . . g . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . S . . . .
                       . . . . C . . . .
                       . . . . . . . . .
                       . . . G . . . . .`);

            expect(board.isCheck(Color.Black)).to.equal(true);
        });

        it("should return true for a rook check", () => {

            const board = new Board(
                `. . . . g . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . R . . . .
                       . . . . . . . . .
                       . . . G . . . . .`);

            expect(board.isCheck(Color.Black)).to.equal(true);
        });

        it("should return true for a horse check 1", () => {

            const board = new Board(
                `. . . . g . . . .
                       . . . . . . . . .
                       . . . H . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . G . . . . .`);

            expect(board.isCheck(Color.Black)).to.equal(true);
        });

        it("should return true for a horse check 2", () => {

            const board = new Board(
                `. . . . g . . . .
                       . . . . . . H . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . G . . . . .`);

            expect(board.isCheck(Color.Black)).to.equal(true);
        });

        it("should return true for a soldier check", () => {

            const board = new Board(
                `. . . . g . . . .
                       . . . . S . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . G . . . . .`);

            expect(board.isCheck(Color.Black)).to.equal(true);
        });

        it("should return true for opposing generals", () => {

            const board = new Board(
                `. . . . g . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . G . . . .`);

            expect(board.isCheck(Color.Red)).to.equal(true);
            expect(board.isCheck(Color.Black)).to.equal(true);
        });
    });

    describe("#makeMove", () => {

        /*
              | 0 1 2 3 4 5 6 7 8
            --+------------------
            0 | r h e a g a e h r
            1 | . . . . . . . . .
            2 | . c . . . . . c .
            3 | s . s . s . s . s
            4 | . . . . . . . . .
            5 | . . . . . . . . .
            6 | S . S . S . S . S
            7 | . C . .[.]. .[C].
            8 | . . . . . . . . .
            9 | R H E A G A E H R
                        ^     ^
                        5     2
        */
        it("should move the red cannon from file 2 to 5", () => {

            const board = new Board();
            const move = Move.create("炮 (32)-35", board);

            expect(board.getSquare(7, 7).isOccupied()).to.equal(true);
            expect(board.getSquare(4, 7).isOccupied()).to.equal(false);

            board.makeMove(move);

            expect(board.getSquare(7, 7).isOccupied()).to.equal(false);
            expect(board.getSquare(4, 7).isOccupied()).to.equal(true);
        });

        it("should change the turn color after a move", () => {

            const board = new Board();
            const move = Move.create("炮 (32)-35", board);

            expect(board.isTurn(Color.Red));

            board.makeMove(move);

            expect(board.isTurn(Color.Black));
        });

        it("should throw an error when capturing own piece", () => {

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
                       R H E A G A E H R`
            );

            expect(() => { board.makeMove(Move.create("C (32)-38", board)) }).to.throw(Error);
        });

        it("should throw an error when square is empty", () => {

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
                       R H E A G A E H R`
            );

            expect(() => { board.makeMove(Move.create("C (33)-38", board)) }).to.throw(Error);
        });

        it("should throw an error for an illegal move", () => {

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
                       R H E A G A E H R`
            );

            expect(() => { board.makeMove(Move.create("C (33)-39", board)) }).to.throw(Error);
        });

        it("should throw an error when it's not the color's turn", () => {

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
                       R H E A G A E H R`
            );

            expect(() => { board.makeMove(Move.create("c (32)-35", board)) }).to.throw(Error);
        });

        it("should throw an error when performing a self-check", () => {

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
                       R H E A G A E H R`
            );

            board.makeMove(Move.create("C (32)-35", board));
            board.makeMove(Move.create("s (45)-55", board));
            board.makeMove(Move.create("S (45)-55", board));

            expect(() => { board.makeMove(Move.create("s (55)-65", board)) }).to.throw(Error);

            // The move "s (55)-65" should have been made undone
            expect(board.getSquare(4, 4).getPiece().charWestern).to.equal("s");
        });
    });
});
