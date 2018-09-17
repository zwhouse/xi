import {Square} from "./square";
import {Piece} from "./piece";
import {Direction} from "./direction";

export class Soldier extends Piece {

    constructor(charWestern: string) {
        super(charWestern);
    }

    getAttackingSquares(position: Square): Square[] {

        const squares: Square[] = [];

        super.safeAdd(squares, position, Direction.Up);

        if (position.isOverTheRiver()) {
            super.safeAdd(squares, position, Direction.Left);
            super.safeAdd(squares, position, Direction.Right);
        }

        return squares.filter(x => !x.isOccupied() || x.getPiece().color !== position.getPiece().color);
    }
}