import {Color} from "./color";
import {No, Piece} from "./piece";
import {Board} from "./board";
import {Direction} from "./direction";

export class Square {

    private readonly board: Board;
    readonly x: number;
    readonly y: number;
    private piece: Piece = No.piece;

    constructor(board: Board, x: number, y: number) {
        this.board = board;
        this.x = x;
        this.y = y;
    }

    isSquare(...directions: Direction[]): boolean {

        const nextXY = this.getNextXY(...directions);

        return Square.inBounds(nextXY[0], nextXY[1]);
    }

    getSquare(...directions: Direction[]): Square {

        if (!this.isSquare(...directions)) {
            throw new Error(`no neighbor ${directions} from x=${this.x}, y=${this.y}`);
        }

        const nextXY = this.getNextXY(...directions);

        return this.board.getSquare(nextXY[0], nextXY[1]);
    }

    getSquares(direction: Direction, includeAmountOfPieces = 1): Square[] {

        const squares = [];
        let amountOfPieces = 0;
        let nextX = this.x + Direction.dX(direction, this.piece.color);
        let nextY = this.y + Direction.dY(direction, this.piece.color);

        while (Square.inBounds(nextX, nextY)) {

            const square = this.board.getSquare(nextX, nextY);

            amountOfPieces += square.isOccupied() ? 1 : 0;
            squares.push(square);

            nextX += Direction.dX(direction, this.piece.color);
            nextY += Direction.dY(direction, this.piece.color);

            if (amountOfPieces === includeAmountOfPieces) {
                break;
            }
        }

        return squares;
    }

    isColor(color: Color): boolean {
        return this.getPiece().color === color;
    }

    isOccupied(): boolean {
        return this.piece.color !== Color.None;
    }

    isOverTheRiver(color: Color = this.piece.color): boolean {
        return ((color === Color.Red) && (this.y <= 4)) || ((color === Color.Black) && (this.y >= 5));
    }

    isInOwnCastle(color: Color = this.piece.color): boolean {
        return ((color === Color.Red) && (this.y >= 7) && (this.x >= 3) && (this.x <= 5)) ||
            ((color === Color.Black) && (this.y <= 2) && (this.x >= 3) && (this.x <= 5));
    }

    getPiece(): Piece {
        return this.piece;
    }

    setPiece(newPiece: Piece): Piece {

        if (this.isOccupied() && this.piece.color === newPiece.color) {
            throw new Error(`cannot move ${newPiece.charWestern} to (${this.getNotation(newPiece.color)}): already occupied by ${this.piece.charWestern}`);
        }

        const possiblyCaptured = this.piece;
        this.piece = newPiece;

        return possiblyCaptured;
    }

    getNotation(color: Color): string {
        return `${this.getRank(color)}${this.getFile(color)}`;
    }

    // index  red  black
    // 0      9    1
    // 1      8    2
    // 2      7    3
    // 3      6    4
    // 4      5    5
    // 5      4    6
    // 6      3    7
    // 7      2    8
    // 8      1    9
    getFile(color: Color): number {
        return color === Color.Red ? 9 - this.x : 1 + this.x;
    }

    // index  red  black
    // 0      10   1
    // 1      9    2
    // 2      8    3
    // 3      7    4
    // 4      6    5
    // 5      5    6
    // 6      4    7
    // 7      3    8
    // 8      2    9
    // 9      1    10
    getRank(color: Color): number {
        return color === Color.Red ? 10 - this.y : 1 + this.y;
    }

    str(color: Color): string {
        return `${this.getRank(color)}${this.getFile(color)}`;
    }

    private getNextXY(...directions: Direction[]): number[] {

        let newX = this.x;
        let newY = this.y;

        for (let direction of directions) {
            newX += Direction.dX(direction, this.piece.color);
            newY += Direction.dY(direction, this.piece.color);
        }

        return [newX, newY];
    }

    private static inBounds(x: number, y: number): boolean {
        return x >= 0 && x <= 8 && y >= 0 && y <= 9;
    }
}
