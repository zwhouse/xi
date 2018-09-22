import {UiBoard} from "./ui-board";

export function load(boardId: string, movesTableId: string, redPlayer: string, blackPlayer: string, gameId: number, moves: string[] = []): UiBoard {

    const boardDiv = document.getElementById(boardId) as HTMLElement;
    const movesTable = document.getElementById(movesTableId) as HTMLTableElement;

    const head = movesTable.insertRow();
    head.insertCell().appendChild(document.createTextNode(""));
    head.insertCell().appendChild(document.createTextNode(redPlayer));
    head.insertCell().appendChild(document.createTextNode(blackPlayer));

    return new UiBoard(boardDiv, movesTable, gameId, moves);
}
