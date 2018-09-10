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
    readonly fromRank: number;
    readonly fromFile: number;
    readonly toRank: number;
    readonly toFile: number;
    captured: Piece;

    constructor(move: string) {

        const matches = /^\s*?([^\s])\s*\(\s*(\d\d?)\s*(\d)\s*\)\s*-\s*(\d\d?)\s*(\d)\s*$/.exec(move);

        if (matches === null || matches.length !== 6) {
            throw new Error(`could not parse move: ${move}`);
        }

        this.color = Piece.getColor(matches[1]);
        this.fromRank = parseInt(matches[2]);
        this.fromFile = parseInt(matches[3]);
        this.toRank = parseInt(matches[4]);
        this.toFile = parseInt(matches[5]);
        this.captured = No.piece;
    }

    fromSquare(state: Board): Square {
        return Move.getSquare(this.fromRank, this.fromFile, this.color, state);
    }

    toSquare(state: Board): Square {
        return Move.getSquare(this.toRank, this.toFile, this.color, state);
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