import {expect} from 'chai';
import 'mocha';
import {Board} from "../../src/game/board";

describe("Cannon", () => {

    describe("#getAttackingSquares", () => {

        it("should return opponent's occupied square", () => {

            const board = new Board(
                `. h . . . . . . .
                       . . . . . . . s .
                       . c . . . . s c s
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       S C S . . . . C .
                       . S . . . . . . .
                       . . . . . . . H .`);

            const redAdviserSquare = board.getSquare(1, 7);
            const blackAdviserSquare = board.getSquare(7, 2);
            const redAttacking = redAdviserSquare.getPiece().getAttackingSquares(redAdviserSquare);
            const blackAttacking = blackAdviserSquare.getPiece().getAttackingSquares(blackAdviserSquare);

            expect(redAttacking.length).to.equal(5);
            expect(blackAttacking.length).to.equal(5);

            expect(redAttacking[redAttacking.length - 1].getPiece().charWestern).to.equal("h");
            expect(blackAttacking[blackAttacking.length - 1].getPiece().charWestern).to.equal("H");
        });

        it("should not return own occupied square", () => {

            const board = new Board(
                `. H . . . . . . .
                       . . . . . . . s .
                       . c . . . . s c s
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       S C S . . . . C .
                       . S . . . . . . .
                       . . . . . . . h .`);

            const redAdviserSquare = board.getSquare(1, 7);
            const blackAdviserSquare = board.getSquare(7, 2);
            const redAttacking = redAdviserSquare.getPiece().getAttackingSquares(redAdviserSquare);
            const blackAttacking = blackAdviserSquare.getPiece().getAttackingSquares(blackAdviserSquare);

            expect(redAttacking.length).to.equal(4);
            expect(blackAttacking.length).to.equal(4);
        });
    });
});