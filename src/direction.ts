import {Color} from "./color";

export enum Direction {
    Up = "up",
    Right = "right",
    Down = "down",
    Left = "left"
}

export namespace Direction {

    export function dX(direction: Direction, color: Color): number {

        if (color === Color.None) {
            throw new Error("cannot calculate delta x of an unoccupied square");
        }

        switch (direction) {
            case Direction.Left:
                return color == Color.Red ? -1 : 1;
            case Direction.Right:
                return color == Color.Red ? 1 : -1;
            default:
                // `Up` and `Down` don't change for `x`
                return 0;
        }
    }

    export function dY(direction: Direction, color: Color): number {

        if (color === Color.None) {
            throw new Error("cannot calculate delta y of an unoccupied square");
        }

        switch (direction) {
            case Direction.Up:
                return color == Color.Red ? -1 : 1;
            case Direction.Down:
                return color == Color.Red ? 1 : -1;
            default:
                // `Left` and `Right` don't change for `y`
                return 0;
        }
    }
}