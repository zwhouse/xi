import {Square} from "./square";
import {Piece} from "./piece";
import {Direction} from "./direction";

export class General extends Piece {

    constructor(charWestern: string) {
        super(charWestern);
    }

    getAttackingSquares(position: Square): Square[] {

        const squares: Square[] = [];

        super.safeAdd(squares, position, Direction.Up);
        super.safeAdd(squares, position, Direction.Right);
        super.safeAdd(squares, position, Direction.Down);
        super.safeAdd(squares, position, Direction.Left);

        return squares
            .filter(x => x.isInOwnCastle(position.getPiece().color))
            .filter(x => !x.isOccupied() || x.getPiece().color !== position.getPiece().color);
    }
}
