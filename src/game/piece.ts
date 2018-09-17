import {Color} from "./color";
import {Square} from "./square";
import {Direction} from "./direction";

export abstract class Piece {

    static charsMap: {[key: string]: string} = {
        "S": "兵", "C": "炮", "R": "俥", "H": "傌", "E": "相", "A": "仕", "G": "帥", // red chars
        "s": "卒", "c": "砲", "r": "車", "h": "馬", "e": "象", "a": "士", "g": "將" // black chars
    };

    readonly color: Color;
    readonly charWestern: string;
    readonly charChinese: string;

    protected constructor(charWestern: string) {
        this.color = Piece.getColor(charWestern);
        this.charWestern = charWestern;
        this.charChinese = Piece.charsMap[charWestern];
    }

    abstract getAttackingSquares(position: Square): Square[];

    protected safeAdd(squares: Square[], position: Square, ...direction: Direction[]) {
        if (position.isSquare(...direction)) {
            squares.push(position.getSquare(...direction));
        }
    }

    toString(): string {
        return this.charWestern;
    }

    static getColor(char: string): Color {

        if ("SCRHEAG兵炮俥傌相仕帥".indexOf(char) >= 0)
            return Color.Red;

        if ("scrheag卒砲車馬象士將".indexOf(char) >= 0)
            return Color.Black;

        return Color.None;
    }

    static isValidPieceChar(char: string): boolean {
        return Piece.charsMap[char] !== undefined;
    }
}

export class No extends Piece {

    static readonly piece = new No(".");

    private constructor(charWestern: string) {
        super(charWestern);
    }

    getAttackingSquares(position: Square): Square[] {
        throw new Error("cannot get attacking squares for `No.piece`");
    }
}
