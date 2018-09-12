import {Square} from "./square";
import {Color} from "./color";
import {Board} from "./board";
import {No, Piece} from "./piece";

/**
 * The book The Chess of China describes a move notation method in which the ranks
 * of the board are numbered 1 to 10 from closest to farthest away, followed by a
 * digit 1 to 9 for files from right to left. Both values are relative to the moving
 * player. Moves are then indicated as follows:
 *
 *   [piece name] ([former rank][former file])-[new rank][new file]
 *
 * Thus, the most common opening in the game would be written as:
 *
 *   炮 (32)–35   馬 (18)–37
 */
export class Move {

    readonly color: Color;
    readonly from: Square;
    readonly to: Square;
    readonly fromRank: number;
    readonly fromFile: number;
    readonly toRank: number;
    readonly toFile: number;
    readonly moveStr: string;
    captured: Piece = No.piece;

    constructor(from: Square, to: Square) {

        this.color = from.getPiece().color;

        if (!from.isOccupied()) {
            throw new Error(`invalid move for ${this.color}: ${from.str(this.color)} is not occupied`);
        }

        this.from = from;
        this.to = to;
        this.fromRank = from.getRank(this.color);
        this.fromFile = from.getFile(this.color);
        this.toRank = to.getRank(this.color);
        this.toFile = to.getFile(this.color);
        this.moveStr = `${this.from.getPiece().charChinese} (${this.from.str(this.color)})-${this.to.str(this.color)}`;
    }

    static create(move: string, board: Board): Move {

        const matches = /^\s*?([^\s])\s*\(\s*(\d\d?)\s*(\d)\s*\)\s*-\s*(\d\d?)\s*(\d)\s*$/.exec(move);

        if (matches === null || matches.length !== 6) {
            throw new Error(`could not parse move: ${move}`);
        }

        const color = Piece.getColor(matches[1]);
        const fromRank = parseInt(matches[2]);
        const fromFile = parseInt(matches[3]);
        const toRank = parseInt(matches[4]);
        const toFile = parseInt(matches[5]);

        const from = Move.getSquare(fromRank, fromFile, color, board);
        const to = Move.getSquare(toRank, toFile, color, board);

        return new Move(from, to);
    }

    /*
           (i)     0 1 2 3 4 5 6 7 8 (x)

               (B) 1 2 3 4 5 6 7 8 9
            0   1  . . . . . . . . . 10
            1   2  . . . . . . . . .  9
            2   3  . . . . . . . . .  8
            3   4  . . . . . . . . .  7
            4   5  . . . . . . . . .  6
            5   6  . . . . . . . . .  5
            6   7  . . . . . . . . .  4
            7   8  . . . . . . . . .  3
            8   9  . . . . . . . . .  2
            9  10  . . . . . . . . .  1
           (y)     9 8 7 6 5 4 3 2 1 (R)
    */
    private static getSquare(rank: number, file: number, color: Color, state: Board): Square {

        const y = color === Color.Red ? 10 - rank : rank - 1;
        const x = color === Color.Red ? 9 - file : file - 1;

        return state.getSquare(x, y);
    }
}