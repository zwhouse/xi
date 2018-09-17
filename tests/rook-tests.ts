import {expect} from 'chai';
import 'mocha';
import {Board} from "../src/game/board";

describe("Rook", () => {

    describe("#getAttackingSquares", () => {

        const board = new Board(
            `r s . . . . . S r
                   s . . . . . . . S
                   . . . . . . . . .
                   . . . . . r . . .
                   . . . . . . . . .
                   . . . . . . . . .
                   . . . R . . . . .
                   . . . . . . . . .
                   S . . . . . . . s
                   R S . . . . . s R`);

        it("should return 0 squares for own surrounded rook", () => {

            const redAdviserSquare = board.getSquare(0, 9);
            const blackAdviserSquare = board.getSquare(0, 0);
            const redAttacking = redAdviserSquare.getPiece().getAttackingSquares(redAdviserSquare);
            const blackAttacking = blackAdviserSquare.getPiece().getAttackingSquares(blackAdviserSquare);

            expect(redAttacking.length).to.equal(0);
            expect(blackAttacking.length).to.equal(0);
        });

        it("should return 2 squares for opponent surrounded rook", () => {

            const redAdviserSquare = board.getSquare(8, 9);
            const blackAdviserSquare = board.getSquare(8, 0);
            const redAttacking = redAdviserSquare.getPiece().getAttackingSquares(redAdviserSquare);
            const blackAttacking = blackAdviserSquare.getPiece().getAttackingSquares(blackAdviserSquare);

            expect(redAttacking.length).to.equal(2);
            expect(blackAttacking.length).to.equal(2);
        });

        it("should return all empty squares", () => {

            const redAdviserSquare = board.getSquare(3, 6);
            const blackAdviserSquare = board.getSquare(5, 3);
            const redAttacking = redAdviserSquare.getPiece().getAttackingSquares(redAdviserSquare);
            const blackAttacking = blackAdviserSquare.getPiece().getAttackingSquares(blackAdviserSquare);

            expect(redAttacking.length).to.equal(17);
            expect(blackAttacking.length).to.equal(17);
        });
    });
});