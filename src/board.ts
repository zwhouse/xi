import {Square} from "./square";
import {No, Piece} from "./piece";
import {Move} from "./move";
import {Color} from "./color";
import {Soldier} from "./soldier";
import {Cannon} from "./cannon";
import {Rook} from "./rook";
import {Horse} from "./horse";
import {Elephant} from "./elephant";
import {Adviser} from "./adviser";
import {General} from "./general";

export class Board {

    private static readonly beginState =
        `r h e a g a e h r
         . . . . . . . . .
         . c . . . . . c .
         s . s . s . s . s
         . . . . . . . . .
         . . . . . . . . .
         S . S . S . S . S
         . C . . . . . C .
         . . . . . . . . .
         R H E A G A E H R`;

    private readonly grid: Square[][] = [];
    private readonly moves: Move[] = [];
    private readonly capturedPieces: { [color: string]: Piece[] } = { "red": [], "black": [] };

    constructor(state: string = "") {
        this.init(state || Board.beginState);
    }

    makeMove(move: Move) {

        if (!move.from.isOccupied())
            throw new Error("from square is not occupied");

        if (move.from.getPiece().color !== this.getTurn())
            throw new Error(`it's not ${move.from.getPiece().color}'s turn`);

        if (move.from.isColor(move.to.getPiece().color))
            throw new Error("cannot capture own piece");

        const attacking = move.from.getPiece().getAttackingSquares(move.from);

        if (attacking.indexOf(move.to) < 0)
            throw new Error("illegal move");

        move.captured = move.to.setPiece(move.from.getPiece());
        move.from.setPiece(No.piece);

        if (this.isCheck(this.getTurn())) {
            // Cannot self-check: undo the move
            move.from.setPiece(move.to.getPiece());
            move.to.setPiece(move.captured);

            throw new Error("cannot self check");
        }

        if (move.captured.color !== Color.None) {
            this.capturedPieces[`${move.captured.color}`].push(move.captured);
        }

        this.moves.push(move);
    }

    isCheck(color: Color): boolean {

        if (this.areGeneralsLookingAtEachOther()) {
            // Regardless of the color, this is always check
            return true;
        }

        const generalSquare = this.findGeneral(color);
        const otherSquares = [];
        let otherAttackingSquares: Square[] = [];

        // Find all square occupied by `Color.opposite(color)`
        for (const row of this.grid) {
            for (const square of row) {
                if (square.isOccupied() && square.isColor(Color.opposite(color))) {
                    otherSquares.push(square);
                }
            }
        }

        // Find all squares being attacked by `Color.opposite(color)`
        for (const square of otherSquares) {
            otherAttackingSquares = otherAttackingSquares.concat(square.getPiece().getAttackingSquares(square));
        }

        // If the `generalSquare` is part of `otherAttackingSquares`, then `color` is check
        return otherAttackingSquares.indexOf(generalSquare) >= 0;
    }

    areGeneralsLookingAtEachOther(): boolean {

        const redGeneralSquare = this.findGeneral(Color.Red);
        const blackGeneralSquare = this.findGeneral(Color.Black);

        if (redGeneralSquare.x !== blackGeneralSquare.x) {
            return false;
        }

        // Inspect all squares between the 2 generals
        for (let y = blackGeneralSquare.y + 1; y < redGeneralSquare.y; y++) {
            if (this.getSquare(blackGeneralSquare.x, y).isOccupied()) {
                // If there's 1 occupied, the generals can't be facing each other
                return false;
            }
        }

        return true;
    }

    getTurn(): Color {
        return this.moves.length === 0 || this.moves.length % 2 === 0 ? Color.Red : Color.Black;
    }

    isTurn(color: Color): boolean {
        return this.getTurn() === color;
    }

    getCapturedPieces(color: Color): Piece[] {
        return this.capturedPieces[`${color}`];
    }

    getSquare(x: number, y: number): Square {

        if (y < 0 || y >= this.grid.length || x < 0 || x >= this.grid[0].length) {
            throw new Error(`index out of bounds: ${x}, ${y}`)
        }

        return this.grid[y][x];
    }

    toString(): string {

        let str = "";

        for (let y = 0; y < this.grid.length; y++) {

            for (let x = 0; x < this.grid[y].length; x++) {
                str += this.grid[y][x].getPiece().toString() + " ";
            }

            str += "\n";
        }

        return str;
    }

    static createPiece(char: string): Piece {

        switch (char.toLowerCase()) {
            case "s": return new Soldier(char);
            case "c": return new Cannon(char);
            case "r": return new Rook(char);
            case "h": return new Horse(char);
            case "e": return new Elephant(char);
            case "a": return new Adviser(char);
            case "g": return new General(char);
            case ".": return No.piece;
        }

        throw new Error(`unknown piece: ${char}`);
    }

    private findGeneral(color: Color): Square {

        for (const row of this.grid) {
            for (const square of row) {
                if (square.isOccupied() && square.isColor(color) && square.getPiece() instanceof General) {
                    return square;
                }
            }
        }

        // This will not happen since the generals cannot be captured
        throw new Error();
    }

    private init(state: string) {

        for (let y = 0; y < 10; y++) {
            const row = [];

            for (let x = 0; x < 9; x++) {
                row.push(new Square(this, x, y));
            }

            this.grid.push(row);
        }

        const cleanedState = state.replace(/[^scrheag.]/ig, "");

        if (cleanedState.length !== 90) {
            throw new Error(`invalid state: ${cleanedState}, expected to contain 90 chars`);
        }

        let x = 0, y = 0;

        for (let char of cleanedState) {

            this.grid[y][x].setPiece(Board.createPiece(char));

            x++;

            if (x > 8) {
                x = 0;
                y++;
            }
        }
    }
}
