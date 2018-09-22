import {expect} from 'chai';
import 'mocha';
import {Board} from "../../src/game/board";

describe("General", () => {

    describe("#getAttackingSquares", () => {

        it("should return 4 squares when in the center", () => {

            const board = new Board(
                `. . . . . . . . .
                       . . . . g . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . G . . . .
                       . . . . . . . . .`);
                
            const redGeneralSquare = board.getSquare(4, 8);
            const blackGeneralSquare = board.getSquare(4, 1);
            const redAttacking = redGeneralSquare.getPiece().getAttackingSquares(redGeneralSquare);
            const blackAttacking = blackGeneralSquare.getPiece().getAttackingSquares(blackGeneralSquare);

            expect(redAttacking.length).to.equal(4);
            expect(blackAttacking.length).to.equal(4);
        });

        it("should return 2 squares when in a bottom corner", () => {

            const board = new Board(
                `. . . g . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . G . . . . .`);
            
            const redGeneralSquare = board.getSquare(3, 9);
            const blackGeneralSquare = board.getSquare(3, 0);
            const redAttacking = redGeneralSquare.getPiece().getAttackingSquares(redGeneralSquare);
            const blackAttacking = blackGeneralSquare.getPiece().getAttackingSquares(blackGeneralSquare);

            expect(redAttacking.length).to.equal(2);
            expect(blackAttacking.length).to.equal(2);
        });

        it("should return 2 squares when in a top corner", () => {

            const board = new Board(
                `. . . . . . . . .
                       . . . . . . . . .
                       . . . . . g . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . . . . .
                       . . . . . G . . .
                       . . . . . . . . .
                       . . . . . . . . .`);
            
            const redGeneralSquare = board.getSquare(5, 7);
            const blackGeneralSquare = board.getSquare(5, 2);
            const redAttacking = redGeneralSquare.getPiece().getAttackingSquares(redGeneralSquare);
            const blackAttacking = blackGeneralSquare.getPiece().getAttackingSquares(blackGeneralSquare);

            expect(redAttacking.length).to.equal(2);
            expect(blackAttacking.length).to.equal(2);
        });

        it("should return 3 squares when in the start position", () => {

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
            
            const redGeneralSquare = board.getSquare(4, 9);
            const blackGeneralSquare = board.getSquare(4, 0);
            const redAttacking = redGeneralSquare.getPiece().getAttackingSquares(redGeneralSquare);
            const blackAttacking = blackGeneralSquare.getPiece().getAttackingSquares(blackGeneralSquare);

            expect(redAttacking.length).to.equal(3);
            expect(blackAttacking.length).to.equal(3);
        });
    });
});