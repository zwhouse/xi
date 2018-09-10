import {expect} from 'chai';
import 'mocha';
import {Board} from "../src/board";

describe("Horse", ()  => {

    describe("#getAttackingSquares", ()  => {

        const board = new Board(
            `h . h . . . . . .
                   . . . . . . S . .
                   . . h . . S h S .
                   . . . . . . S . .
                   . . . . . . . . .
                   . . . . . . . . .
                   . . . . . . s . .
                   . . H . . s H s .
                   . . . . . . s . .
                   H . H . . . . . .`);

        it("should contain 2 squares from a corner position", () => {

            const redHorseSquare = board.getSquare(0, 9);
            const blackHorseSquare = board.getSquare(0, 0);
            const redAttacking = redHorseSquare.getPiece().getAttackingSquares(redHorseSquare);
            const blackAttacking = blackHorseSquare.getPiece().getAttackingSquares(blackHorseSquare);

            expect(redAttacking.length).to.equal(2);
            expect(blackAttacking.length).to.equal(2);

            expect(redAttacking).to.have.members([board.getSquare(1, 7), board.getSquare(2, 8)]);
            expect(blackAttacking).to.have.members([board.getSquare(1, 2), board.getSquare(2, 1)]);
        });

        it("should contain 8 squares from a center position", () => {

            const redHorseSquare = board.getSquare(2, 7);
            const blackHorseSquare = board.getSquare(2, 2);
            const redAttacking = redHorseSquare.getPiece().getAttackingSquares(redHorseSquare);
            const blackAttacking = blackHorseSquare.getPiece().getAttackingSquares(blackHorseSquare);

            expect(redAttacking.length).to.equal(8);
            expect(blackAttacking.length).to.equal(8);
        });

        it("should contain 4 squares from a center position", () => {

            const redHorseSquare = board.getSquare(2, 9);
            const blackHorseSquare = board.getSquare(2, 0);
            const redAttacking = redHorseSquare.getPiece().getAttackingSquares(redHorseSquare);
            const blackAttacking = blackHorseSquare.getPiece().getAttackingSquares(blackHorseSquare);

            expect(redAttacking.length).to.equal(4);
            expect(blackAttacking.length).to.equal(4);
        });

        it("should contain 0 squares from a surrounded position", () => {

            const redHorseSquare = board.getSquare(6, 7);
            const blackHorseSquare = board.getSquare(6, 2);
            const redAttacking = redHorseSquare.getPiece().getAttackingSquares(redHorseSquare);
            const blackAttacking = blackHorseSquare.getPiece().getAttackingSquares(blackHorseSquare);

            expect(redAttacking.length).to.equal(0);
            expect(blackAttacking.length).to.equal(0);
        });
    });
});