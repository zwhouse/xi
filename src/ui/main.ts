import {UiBoard} from "./ui-board";

export function load(boardId: string) {
    const moves: string[] = [];  // ["炮 (32)-35", "馬 (18)-37", "俥 (11)-21", "馬 (12)-33", "傌 (18)-37", "卒 (45)-55"];
    const boardDiv = document.getElementById(boardId) as HTMLElement;
    new UiBoard(boardDiv, moves);
}