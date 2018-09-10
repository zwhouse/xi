import {Square} from "./square";
import {Piece} from "./piece";
import {Direction} from "./direction";
import {Color} from "./color";

export class Cannon extends Piece {

    constructor(charWestern: string) {
        super(charWestern);
    }

    getAttackingSquares(position: Square): Square[] {

        const squares: Square[] = [];

        Cannon.addSquares(squares, position.getSquares(Direction.Up, 2), position.getPiece().color);
        Cannon.addSquares(squares, position.getSquares(Direction.Right, 2), position.getPiece().color);
        Cannon.addSquares(squares, position.getSquares(Direction.Down, 2), position.getPiece().color);
        Cannon.addSquares(squares, position.getSquares(Direction.Left, 2), position.getPiece().color);

        return squares; //.filter(x => !x.isOccupied() || x.getPiece().color !== position.getPiece().color);
    }

    private static addSquares(allSquares: Square[], squaresToAdd: Square[], color: Color) {

        // First add all unoccupied squares up until the first occupied square
        for (let square of squaresToAdd) {

            if (square.isOccupied())
                break;

            allSquares.push(square);
        }

        const occupyingSquares = squaresToAdd.filter(x => x.isOccupied()).length;

        if (occupyingSquares < 2) {
            return;
        }

        const lastSquare = squaresToAdd[squaresToAdd.length -  1];

        if (lastSquare.getPiece().color !== color) {
            // The 2nd occupying square is the opponent's color: ad it to the list
            allSquares.push(lastSquare);
        }
    }
}