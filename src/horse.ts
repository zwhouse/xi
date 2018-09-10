import {Square} from "./square";
import {Piece} from "./piece";
import {Direction} from "./direction";

export class Horse extends Piece {

    constructor(charWestern: string) {
        super(charWestern);
    }

    getAttackingSquares(position: Square): Square[] {

        const squares: Square[] = [];

        if (position.isSquare(Direction.Up) && !position.getSquare(Direction.Up).isOccupied()) {
            super.safeAdd(squares, position, Direction.Up, Direction.Up, Direction.Left);
            super.safeAdd(squares, position, Direction.Up, Direction.Up, Direction.Right);
        }

        if (position.isSquare(Direction.Right) && !position.getSquare(Direction.Right).isOccupied()) {
            super.safeAdd(squares, position, Direction.Right, Direction.Right, Direction.Up);
            super.safeAdd(squares, position, Direction.Right, Direction.Right, Direction.Down);
        }

        if (position.isSquare(Direction.Down) && !position.getSquare(Direction.Down).isOccupied()) {
            super.safeAdd(squares, position, Direction.Down, Direction.Down, Direction.Left);
            super.safeAdd(squares, position, Direction.Down, Direction.Down, Direction.Right);
        }

        if (position.isSquare(Direction.Left) && !position.getSquare(Direction.Left).isOccupied()) {
            super.safeAdd(squares, position, Direction.Left, Direction.Left, Direction.Up);
            super.safeAdd(squares, position, Direction.Left, Direction.Left, Direction.Down);
        }

        return squares.filter(x => !x.isOccupied() || x.getPiece().color !== position.getPiece().color);
    }
}