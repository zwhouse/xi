import {Square} from "./square";
import {Piece} from "./piece";
import {Direction} from "./direction";

export class Rook extends Piece {

    constructor(charWestern: string) {
        super(charWestern);
    }

    getAttackingSquares(position: Square): Square[] {

        let squares: Square[] = [];

        squares = squares.concat(position.getSquares(Direction.Up));
        squares = squares.concat(position.getSquares(Direction.Right));
        squares = squares.concat(position.getSquares(Direction.Down));
        squares = squares.concat(position.getSquares(Direction.Left));

        return squares.filter(x => !x.isOccupied() || x.getPiece().color !== position.getPiece().color);
    }
}