import {Board} from "../game/board";
import {UiSquare} from "./ui-square";
import {Move} from "../game/move";
import {Color} from "../game/color";
import {No} from "../game/piece";

export class UiBoard {

    private static readonly red = "#CC0000";
    private static readonly black = "#000000";

    private readonly boardDiv: HTMLElement;
    protected readonly movesTable: HTMLTableElement;
    private readonly gameId: number;
    private readonly board: Board;
    private readonly squares: UiSquare[][];
    private selectedSquare?: UiSquare;
    private possibleMoves: UiSquare[] = [];

    constructor(boardDiv: HTMLElement, movesTable: HTMLTableElement, gameId: number, moves: string[] = []) {
        this.boardDiv = boardDiv;
        this.movesTable = movesTable;
        this.gameId = gameId;
        this.board = new Board();
        this.squares = [];
        this.init(moves);
    }

    reverse() {
        console.log('~> reverse...');
    }

    proposeDraw() {
        console.log('~> proposeDraw...');
    }

    forfeitGame() {
        console.log('~> forfeitGame...');
    }

    private click(uiSquare: UiSquare) {

        // if (this.replayMode) {
        //     return;
        // }

        if (!uiSquare.isOccupied() && this.selectedSquare === undefined) {
            return;
        }

        if (this.selectedSquare === undefined && !uiSquare.isColor(this.board.getTurn())) {
            UiBoard.message(`it's ${this.board.getTurn()}'s turn`);
            return;
        }

        if (this.selectedSquare === uiSquare) {
            this.possibleMoves.every(x => x.paint());
            this.possibleMoves = [];
            uiSquare.paint();
            this.selectedSquare = undefined;
            return;
        }

        if (this.selectedSquare === undefined) {
            this.possibleMoves = this.getAttackingSquares(uiSquare);
            this.selectedSquare = uiSquare;
            this.selectedSquare.paint(true);
            this.possibleMoves.every(x => x.highlight());
            return;
        }

        const move = new Move(this.selectedSquare.square, uiSquare.square);

        fetch(`${this.gameId}/move/${move.moveStrSimple}`, { method: "POST", credentials: "same-origin" })
            .then((response: Response) => {
                if (!response.ok) {
                    return;
                }
                try {
                    this.move(move);
                    this.possibleMoves.every(x => x.paint());
                    this.possibleMoves = [];
                    this.selectedSquare!.paint();
                    uiSquare.paint();
                    this.selectedSquare = undefined;
                    this.checkState();
                } catch (e) {
                    UiBoard.message(`Oops: ${e}`);
                }
            }).catch(e => {
                console.log('backend says no...', e);
            });
    }

    private move(move: Move) {
        // First call `board.makeMove(...)` because it might set the captured piece
        // which is displayed in `addMoveToTable(...)`
        this.board.makeMove(move);
        this.addMoveToTable(move);
    }

    private checkState() {
        if (this.board.isCheckmate(this.board.getTurn())) {
            UiBoard.message(`${this.board.getTurn()} is checkmate, ${Color.opposite(this.board.getTurn())} wins`);
        }
        else if (this.board.isCheck(this.board.getTurn())) {
            UiBoard.message(`${this.board.getTurn()} is check`);
        }
    }

    private getAttackingSquares(from: UiSquare): UiSquare[] {
        return from.getAttackingSquares().map(square => this.squares[square.y][square.x]);
    }

    private init(moves: string[] = []) {

        for (const move of moves) {
            this.move(Move.create(move, this.board));
        }

        const cellDimension = this.boardDiv.offsetWidth / 11;

        this.boardDiv.appendChild(UiBoard.createRowDiv(cellDimension, UiBoard.black, "", "1", "2", "3", "4", "5", "6", "7", "8", "9", ""));

        for (let y = 0; y < 10; y++) {

            const rowDiv = UiBoard.createRowDiv(cellDimension);
            this.squares.push([]);

            for (let x = 0; x < 9; x++) {

                if (x === 0) {
                    rowDiv.appendChild(UiBoard.createDiv(cellDimension, `${y + 1}`, UiBoard.black));
                }

                const canvas = UiBoard.createCanvas(cellDimension);
                rowDiv.appendChild(canvas);

                const uiSquare = new UiSquare(canvas, this.board.getSquare(x, y));

                uiSquare.canvas.onmousedown = () => { this.click(uiSquare) };

                this.squares[y].push(uiSquare);

                if (x === 8) {
                    rowDiv.appendChild(UiBoard.createDiv(cellDimension, `${10 - y}`, UiBoard.red));
                }
            }

            this.boardDiv.appendChild(rowDiv);
        }

        this.boardDiv.appendChild(UiBoard.createRowDiv(cellDimension, UiBoard.red, "", "9", "8", "7", "6", "5", "4", "3", "2", "1", ""));

        this.checkState();
    }

    private static createRowDiv(cellDimension: number, textColor: string = UiBoard.black, ...childDivs: string[]) {
        const rowDiv = document.createElement("div");
        rowDiv.style.height = `${cellDimension}px`;

        for (let  i = 0; i < childDivs.length; i++) {
            rowDiv.appendChild(UiBoard.createDiv(cellDimension, childDivs[i], textColor));
        }

        return rowDiv;
    }

    private static createDiv(cellDimension: number, text: string, textColor: string = UiBoard.black) {
        const div = document.createElement("div");
        div.style.width = `${cellDimension}px`;
        div.style.height = `${cellDimension}px`;
        div.innerHTML = text;
        div.style.textAlign = "center";
        div.style.verticalAlign = "middle";
        div.style.lineHeight = `${cellDimension}px`;
        div.style.cssFloat = 'left';
        div.style.position = 'relative';

        if (textColor !== null) {
            div.style.fontSize = "11px";
            div.style.fontFamily = "Sans-serif";
            div.style.color = textColor;
        }
        return div;
    }

    private static createCanvas(cellDimension: number): HTMLCanvasElement {
        const canvas = document.createElement("canvas");
        canvas.style.width = `${cellDimension}px`;
        canvas.style.height = `${cellDimension}px`;
        canvas.style.cssFloat = 'left';
        canvas.style.position = 'relative';
        return canvas;
    }

    private addMoveToTable(move: Move) {

        const turn = Color.opposite(this.board.getTurn());
        let row: HTMLTableRowElement;

        if (turn === Color.Red) {
            row = this.movesTable.insertRow();
            const numberCell = row.insertCell();
            numberCell.className = "number-move";
            numberCell.appendChild(document.createTextNode(`${this.movesTable.rows.length - 1}`));
        }
        else {
            row = this.movesTable.rows[this.movesTable.rows.length - 1];
        }

        const moveCell = row.insertCell();
        moveCell.className = `move ${turn}-move`;
        moveCell.appendChild(document.createTextNode(move.moveStr));

        //const moveIndex = this.board.getMoveCount();
        //moveCell.addEventListener("click", () => this.showMove(moveIndex), false);

        if (move.captured !== No.piece) {
            const img = document.createElement('img');
            img.src = `/svg/${move.captured.charWestern.toLowerCase()}${move.captured.color === Color.Red ? "r" : "b"}.svg`;
            img.className = "captured";
            moveCell.appendChild(img);
        }
    }

    private static message(message: string) {
        console.log('message:', message);
    }
}