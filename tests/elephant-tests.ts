import {expect} from 'chai';
import 'mocha';
import {Board} from "../src/board";

describe("Elephant", ()  => {

    describe("#getAttackingSquares", ()  => {

        it("should return 4 squares when in the center", () => {

            const board = new Board(
                `. . . . . . . . .
                       . . . . . . . . .
                       . . . . e . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . E . . . .
                       . . . . . . . . .
                       . . . . . . . . .`);

            const redElephantSquare = board.getSquare(4, 7);
            const blackElephantSquare = board.getSquare(4, 2);
            const redAttacking = redElephantSquare.getPiece().getAttackingSquares(redElephantSquare);
            const blackAttacking = blackElephantSquare.getPiece().getAttackingSquares(blackElephantSquare);

            expect(redAttacking.length).to.equal(4);
            expect(blackAttacking.length).to.equal(4);
        });

        it("should return 2 squares when on the bottom rank", () => {

            const board = new Board(
                `. . . . . . e . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . E . . . . . .`);

            const redElephantSquare = board.getSquare(2, 9);
            const blackElephantSquare = board.getSquare(6, 0);
            const redAttacking = redElephantSquare.getPiece().getAttackingSquares(redElephantSquare);
            const blackAttacking = blackElephantSquare.getPiece().getAttackingSquares(blackElephantSquare);

            expect(redAttacking.length).to.equal(2);
            expect(blackAttacking.length).to.equal(2);
        });

        it("should return 2 squares when on the left rank", () => {

            const board = new Board(
                `. . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . e
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       E . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .`);

            const redElephantSquare = board.getSquare(0, 7);
            const blackElephantSquare = board.getSquare(8, 2);
            const redAttacking = redElephantSquare.getPiece().getAttackingSquares(redElephantSquare);
            const blackAttacking = blackElephantSquare.getPiece().getAttackingSquares(blackElephantSquare);

            expect(redAttacking.length).to.equal(2);
            expect(blackAttacking.length).to.equal(2);
        });

        it("should return 2 squares when on the rank below the river", () => {

            const board = new Board(
                `. . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . e . .
                       . . E . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .`);

            const redElephantSquare = board.getSquare(2, 5);
            const blackElephantSquare = board.getSquare(6, 4);
            const redAttacking = redElephantSquare.getPiece().getAttackingSquares(redElephantSquare);
            const blackAttacking = blackElephantSquare.getPiece().getAttackingSquares(blackElephantSquare);

            expect(redAttacking.length).to.equal(2);
            expect(blackAttacking.length).to.equal(2);

            expect(redAttacking).to.have.members([board.getSquare(0, 7), board.getSquare(4, 7)]);
            expect(blackAttacking).to.have.members([board.getSquare(8, 2), board.getSquare(4, 2)]);
        });

        it("should return 0 squares when surrounded", () => {

            const board = new Board(
                `. . . . . . . . .
                       . S . . . . . . .
                       e . . . . . . . .
                       . S . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . s .
                       . . . . . . . . E
                       . . . . . . . s .
                       . . . . . . . . .`);

            const redElephantSquare = board.getSquare(8, 7);
            const blackElephantSquare = board.getSquare(0, 2);
            const redAttacking = redElephantSquare.getPiece().getAttackingSquares(redElephantSquare);
            const blackAttacking = blackElephantSquare.getPiece().getAttackingSquares(blackElephantSquare);

            expect(redAttacking.length).to.equal(0);
            expect(blackAttacking.length).to.equal(0);
        });
    });
});