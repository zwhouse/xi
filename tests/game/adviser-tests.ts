import {expect} from 'chai';
import 'mocha';
import {Board} from "../../src/game/board";

describe("Adviser", () => {

    describe("#getAttackingSquares", () => {

        it("should return 4 squares when in the center", () => {

            const board = new Board(
                `. . . . . . . . .
                       . . . . a . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . A . . . .
                       . . . . . . . . .`);

            const redAdviserSquare = board.getSquare(4, 8);
            const blackAdviserSquare = board.getSquare(4, 1);
            const redAttacking = redAdviserSquare.getPiece().getAttackingSquares(redAdviserSquare);
            const blackAttacking = blackAdviserSquare.getPiece().getAttackingSquares(blackAdviserSquare);

            expect(redAttacking.length).to.equal(4);
            expect(blackAttacking.length).to.equal(4);
        });

        it("should return 1 squares when in a bottom corner", () => {

            const board = new Board(
                `. . . a . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . A . . . . .`);

            const redAdviserSquare = board.getSquare(3, 9);
            const blackAdviserSquare = board.getSquare(3, 0);
            const redAttacking = redAdviserSquare.getPiece().getAttackingSquares(redAdviserSquare);
            const blackAttacking = blackAdviserSquare.getPiece().getAttackingSquares(blackAdviserSquare);

            expect(redAttacking.length).to.equal(1);
            expect(blackAttacking.length).to.equal(1);
        });

        it("should return 1 squares when in a top corner", () => {

            const board = new Board(
                `. . . . . . . . .
                       . . . . . . . . .
                       . . . . . a . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . A . . .
                       . . . . . . . . .
                       . . . . . . . . .`);

            const redAdviserSquare = board.getSquare(5, 7);
            const blackAdviserSquare = board.getSquare(5, 2);
            const redAttacking = redAdviserSquare.getPiece().getAttackingSquares(redAdviserSquare);
            const blackAttacking = blackAdviserSquare.getPiece().getAttackingSquares(blackAdviserSquare);

            expect(redAttacking.length).to.equal(1);
            expect(blackAttacking.length).to.equal(1);
        });
    });
});