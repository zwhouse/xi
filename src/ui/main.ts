import {UiBoard} from "./ui-board";

export function load(boardId: string) {

    const moves: string[] = [];

    const boardDiv = document.getElementById(boardId) as HTMLElement;

    new UiBoard(boardDiv, moves);
}