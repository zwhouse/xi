import {UiBoard} from "./ui-board";

export function load(boardId: string, gameId: number, moves: string[] = []) {

    const boardDiv = document.getElementById(boardId) as HTMLElement;

    new UiBoard(boardDiv, gameId, moves);
}