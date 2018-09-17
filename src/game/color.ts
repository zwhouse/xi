export enum Color {
    Red = "red",
    Black = "black",
    None = "none"
}

export namespace Color {

    export function opposite(color: Color): Color {

        if (color === Color.None) {
            throw new Error("'Color.None' does not have an opposite color");
        }

        return color === Color.Red ? Color.Black : Color.Red;
    }
}