import {UiBoard} from "./ui-board";

export function load(boardId: string) {

    const moves = [
        "兵 (45)-55", "卒 (45)-55",
        "兵 (55)-65", "將 (15)-25",
        "俥 (11)-21", "將 (25)-26",
        "兵 (65)-66"/*, "將 (26)-36",
        "俥 (21)-24"*/
    ];

    const boardDiv = document.getElementById(boardId) as HTMLElement;

    new UiBoard(boardDiv, moves);
}