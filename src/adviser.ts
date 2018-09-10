import {Square} from "./square";
import {Piece} from "./piece";
import {Direction} from "./direction";

export class Adviser extends Piece {

    constructor(charWestern: string) {
        super(charWestern);
    }

    getAttackingSquares(position: Square): Square[] {

        const squares: Square[] = [];

        super.safeAdd(squares, position, Direction.Up, Direction.Left);
        super.safeAdd(squares, position, Direction.Up, Direction.Right);
        super.safeAdd(squares, position, Direction.Down, Direction.Left);
        super.safeAdd(squares, position, Direction.Down, Direction.Right);

        return squares
            .filter(x => x.isInOwnCastle(position.getPiece().color))
            .filter(x => !x.isOccupied() || x.getPiece().color !== position.getPiece().color);
    }
}