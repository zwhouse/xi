import {Square} from "./square";
import {Piece} from "./piece";
import {Direction} from "./direction";

export class Elephant extends Piece {

    constructor(charWestern: string) {
        super(charWestern);
    }

    getAttackingSquares(position: Square): Square[] {

        const squares: Square[] = [];

        if (position.isSquare(Direction.Up, Direction.Left) && !position.getSquare(Direction.Up, Direction.Left).isOccupied()) {
            super.safeAdd(squares, position, Direction.Up, Direction.Up, Direction.Left, Direction.Left);
        }

        if (position.isSquare(Direction.Up, Direction.Right) && !position.getSquare(Direction.Up, Direction.Right).isOccupied()) {
            super.safeAdd(squares, position, Direction.Up, Direction.Up, Direction.Right, Direction.Right);
        }

        if (position.isSquare(Direction.Down, Direction.Left) && !position.getSquare(Direction.Down, Direction.Left).isOccupied()) {
            super.safeAdd(squares, position, Direction.Down, Direction.Down, Direction.Left, Direction.Left);
        }

        if (position.isSquare(Direction.Down, Direction.Right) && !position.getSquare(Direction.Down, Direction.Right).isOccupied()) {
            super.safeAdd(squares, position, Direction.Down, Direction.Down, Direction.Right, Direction.Right);
        }

        return squares
            .filter(x =>  !x.isOverTheRiver(position.getPiece().color))
            .filter(x => !x.isOccupied() || x.getPiece().color !== position.getPiece().color);
    }
}