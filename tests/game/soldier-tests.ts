import {expect} from 'chai';
import 'mocha';
import {Board} from "../../src/game/board";

describe("Soldier", () => {

    describe("#getAttackingSquares", () => {

        const board = new Board(
            `. . . . S . . . S
                   . . . . . . . . .
                   . . . . . . . . .
                   s . . . . . . . .
                   . . S . . . . . .
                   . . s . . . . . .
                   S . . . . . . . .
                   . . . . . . . . .
                   . . . . . . . . .
                   . . . . s . . . s`);

        it("should return 1 square when on the own side of the river", () => {

            const redSoldierSquare = board.getSquare(0, 6);
            const blackSoldierSquare = board.getSquare(0, 3);
            const redAttacking = redSoldierSquare.getPiece().getAttackingSquares(redSoldierSquare);
            const blackAttacking = blackSoldierSquare.getPiece().getAttackingSquares(blackSoldierSquare);

            expect(redAttacking.length).to.equal(1);
            expect(blackAttacking.length).to.equal(1);

            expect(redAttacking[0]).to.equal(board.getSquare(0, 5));
            expect(blackAttacking[0]).to.equal(board.getSquare(0, 4));
        });

        it("should return 3 squares when on the other side of the river", () => {

            const redSoldierSquare = board.getSquare(2, 4);
            const blackSoldierSquare = board.getSquare(2, 5);
            const redAttacking = redSoldierSquare.getPiece().getAttackingSquares(redSoldierSquare);
            const blackAttacking = blackSoldierSquare.getPiece().getAttackingSquares(blackSoldierSquare);

            expect(redAttacking.length).to.equal(3);
            expect(blackAttacking.length).to.equal(3);

            expect(redAttacking).to.have.members([board.getSquare(1, 4), board.getSquare(2, 3), board.getSquare(3, 4)]);
            expect(blackAttacking).to.have.members([board.getSquare(1, 5), board.getSquare(2, 6), board.getSquare(3, 5)]);
        });

        it("should return 2 squares when on the last rank", () => {

            const redSoldierSquare = board.getSquare(4, 0);
            const blackSoldierSquare = board.getSquare(4, 9);
            const redAttacking = redSoldierSquare.getPiece().getAttackingSquares(redSoldierSquare);
            const blackAttacking = blackSoldierSquare.getPiece().getAttackingSquares(blackSoldierSquare);

            expect(redAttacking.length).to.equal(2);
            expect(blackAttacking.length).to.equal(2);

            expect(redAttacking).to.have.members([board.getSquare(3, 0), board.getSquare(5, 0)]);
            expect(blackAttacking).to.have.members([board.getSquare(3, 9), board.getSquare(5, 9)]);
        });

        it("should return 1 square when on the last rank in a corner", () => {

            const redSoldierSquare = board.getSquare(8, 0);
            const blackSoldierSquare = board.getSquare(8, 9);
            const redAttacking = redSoldierSquare.getPiece().getAttackingSquares(redSoldierSquare);
            const blackAttacking = blackSoldierSquare.getPiece().getAttackingSquares(blackSoldierSquare);

            expect(redAttacking.length).to.equal(1);
            expect(blackAttacking.length).to.equal(1);

            expect(redAttacking).to.have.members([board.getSquare(7, 0)]);
            expect(blackAttacking).to.have.members([board.getSquare(7, 9)]);
        });
    });
});