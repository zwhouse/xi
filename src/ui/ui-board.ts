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
    private readonly reversed: boolean;
    private readonly board: Board;
    private readonly squares: UiSquare[][];
    private selectedSquare?: UiSquare;
    private possibleMoves: UiSquare[] = [];
    private movesMade: number = 0;
    private firstMove?: Move;
    private firstSquare?: UiSquare;

    constructor(boardDiv: HTMLElement, movesTable: HTMLTableElement, gameId: number, reversed: boolean, moves: string[] = []) {
        this.boardDiv = boardDiv;
        this.movesTable = movesTable;
        this.gameId = gameId;
        this.reversed = reversed;
        this.board = new Board();
        this.squares = [];
        this.init(moves);
    }

    getSubmitMoveTitle(): string {
        return !!this.firstMove ? `Submit move ${this.firstMove.moveStr}?`: "No move made yet";
    }

    async submitMove(): Promise<boolean> {

        if (this.movesMade === 0) {
            UiBoard.message("no move made yet");
            return false;
        }

        while (this.movesMade > 0) {
            // Undo all the moves the player made, and make the first move for real by POST-ing it to the backend
            this.board.popMove();
            this.movesMade--;
        }

        this.selectedSquare = this.firstSquare;

        const response = await fetch(`${this.gameId}/move/${this.firstMove!.moveStrSimple}`, {method: "POST", credentials: "same-origin"});

        if (response.ok) {
            this.handle(this.firstMove!, this.firstSquare!);
        }
        else {
            UiBoard.message(response.statusText);
            return false;
        }

        return true;
    }

    proposeDraw() {
        fetch(`${this.gameId}/propose-draw`, { method: "POST", credentials: "same-origin" })
            .then((response: Response) => {
                if (!response.ok) {
                    UiBoard.message(response.statusText);
                    return;
                }
                UiBoard.message("Proposal sent!");
            })
            .catch(e => {
                UiBoard.message(`Oops: ${e}`);
                console.log('Exception: ', e);
            });
    }

    forfeitGame() {
        fetch(`${this.gameId}/forfeit`, { method: "POST", credentials: "same-origin" })
            .then((response: Response) => {
                if (!response.ok) {
                    UiBoard.message(response.statusText);
                    return;
                }
                location.reload();
            })
            .catch(e => {
                UiBoard.message(`Oops: ${e}`);
                console.log('Exception: ', e);
            });
    }

    private click(uiSquare: UiSquare) {

        if (!uiSquare.isOccupied() && this.selectedSquare === undefined) {
            return;
        }

        if (this.selectedSquare === undefined && !uiSquare.isColor(this.board.getTurn())) {
            UiBoard.message(`it's ${this.board.getTurn()}'s turn`);
            return;
        }

        this.lastMove(false);

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

        this.handle(move, uiSquare);
    }

    private handle(move: Move, uiSquare: UiSquare) {

        this.movesMade++;

        if (this.firstMove === undefined) {
            this.firstMove = move;
            this.firstSquare = uiSquare;
        }

        try {
            this.move(move);
            setTimeout(() => {
                this.possibleMoves.every(x => x.paint());
                this.possibleMoves = [];
                this.selectedSquare!.paint();
                uiSquare.paint();
                this.selectedSquare = undefined;
                this.checkState();
            }, 50);
        } catch (e) {
            UiBoard.message(`Oops: ${e}`);
        }
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

        this.insert(this.boardDiv, this.createRowDiv(cellDimension, UiBoard.black, "", "1", "2", "3", "4", "5", "6", "7", "8", "9", ""));

        for (let y = 0; y < 10; y++) {

            const rowDiv = this.createRowDiv(cellDimension);
            this.squares.push([]);

            for (let x = 0; x < 9; x++) {

                if (x === 0) {
                    this.insert(rowDiv, UiBoard.createDiv(cellDimension, `${y + 1}`, UiBoard.black));
                }

                const canvas = UiBoard.createCanvas(cellDimension);
                this.insert(rowDiv, canvas);

                const uiSquare = new UiSquare(canvas, this.board.getSquare(x, y), this.reversed);

                uiSquare.canvas.onmousedown = () => { this.click(uiSquare) };

                this.squares[y].push(uiSquare);

                if (x === 8) {
                    this.insert(rowDiv, UiBoard.createDiv(cellDimension, `${10 - y}`, UiBoard.red));
                }
            }

            this.insert(this.boardDiv, rowDiv);
        }

        this.insert(this.boardDiv, this.createRowDiv(cellDimension, UiBoard.red, "", "9", "8", "7", "6", "5", "4", "3", "2", "1", ""));
        this.lastMove(true);

        this.checkState();
    }

    private lastMove(highlight: boolean) {
        if (this.board.moves.length > 0) {
            const lastMove = this.board.moves[this.board.moves.length - 1];
            this.possibleMoves.push(this.squares[lastMove!.from.y][lastMove!.from.x]);
            this.possibleMoves.push(this.squares[lastMove!.to.y][lastMove!.to.x]);
            this.possibleMoves.every(x => highlight ? x.highlight() : x.paint());
        }
    }

    private createRowDiv(cellDimension: number, textColor: string = UiBoard.black, ...childDivs: string[]) {
        const rowDiv = document.createElement("div");
        rowDiv.style.height = `${cellDimension}px`;

        for (let  i = 0; i < childDivs.length; i++) {
            this.insert(rowDiv, UiBoard.createDiv(cellDimension, childDivs[i], textColor));
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
            this.insert(numberCell, document.createTextNode(`${this.movesTable.rows.length - 1}`));
        }
        else {
            row = this.movesTable.rows[this.movesTable.rows.length - 1];
        }

        const moveCell = row.insertCell();
        moveCell.className = `move ${turn}-move`;
        this.insert(moveCell, document.createTextNode(move.moveStr));

        if (move.captured !== No.piece) {
            const img = document.createElement('img');
            img.src = `/svg/${move.captured.charWestern.toLowerCase()}${move.captured.color === Color.Red ? "r" : "b"}.svg`;
            img.className = "captured";
            this.insert(moveCell, img);
        }
    }


    private insert(parent: HTMLElement, child: Node) {
        if (this.reversed) {
            parent.insertBefore(child, parent.childNodes[0] || null);
        }
        else {
            parent.appendChild(child);
        }
    }

    private static message(message: string) {
        const div = document.createElement("div");
        div.id = "message";
        div.className = "alert alert-danger alert-dismissible";
        const a = document.createElement("a");
        a.className = "close";
        a.setAttribute("data-dismiss", "alert");
        a.setAttribute("aria-label", "close");
        a.innerHTML = "&times;";
        const span = document.createElement("span");
        span.innerText = message;
        div.appendChild(a);
        div.appendChild(span);
        document.body.appendChild(div);

        setTimeout(() => {
            if (document.body.contains(div)) {
                document.body.removeChild(div);
            }
        }, 5000);
    }
}