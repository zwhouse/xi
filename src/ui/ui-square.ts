import {Square} from "../game/square";
import {Color} from "../game/color";

export class UiSquare {

    readonly canvas: HTMLCanvasElement;
    readonly square: Square;

    constructor(canvas: HTMLCanvasElement, square: Square) {
        this.canvas = canvas;
        this.square = square;
        this.paint(false);
    }

    isColor(color: Color): boolean {
        return this.square.getPiece().color === color;
    }

    isOccupied(): boolean  {
        return this.square.isOccupied();
    }

    getAttackingSquares(): Square[] {
        return this.square.getPiece().getAttackingSquares(this.square);
    }

    paint(highlight: boolean = false): boolean {

        this.drawLines();

        const h = this.canvas.height;
        const w = this.canvas.width;
        const ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        const scalePieces = 0.92;

        if (highlight) {
            this.highlight();
        }

        if (this.square.isOccupied()) {

            const img = new Image();
            const marginHeight = h * scalePieces;
            const marginWidth = w * scalePieces;

            img.onload = function () {
                ctx.drawImage(img, marginWidth, marginHeight, w - (2 * marginWidth), h - (2 * marginHeight));
            };

            img.src = `./svg/${this.square.getPiece().charWestern.toLowerCase()}${this.square.getPiece().color === Color.Red ? "r" : "b"}.svg`;
        }

        return true;
    }

    highlight(): boolean {

        const h = this.canvas.height;
        const w = this.canvas.width;
        const ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;

        const gap = 3;
        ctx.beginPath();
        ctx.lineWidth = 1.5 * 2.5;
        ctx.ellipse(w / 2.0,h / 2.0, (w / 2.0) - gap, (h / 2.0) - gap,
            0, 0, Math.PI * 2);
        ctx.stroke();

        return true;
    }

    private drawLines() {
        const ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
        const h = this.canvas.height;
        const w = this.canvas.width;

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, w, h);
        ctx.lineWidth = 2.5;

        ctx.fillStyle = "#282828";
        ctx.strokeStyle = "#282828";

        const x = this.square.x;
        const y = this.square.y;

        // 0 degrees
        if (x < 8)
            UiSquare.drawLineSegment(ctx, w, h, w, h / 2.0);

        // 45 degrees
        if ((y === 1 && x === 4) || (y === 2 && x === 3) || (y === 8 && x === 4) || (y === 9 && x === 3))
            UiSquare.drawLineSegment(ctx, w, h, w, 0);

        // 90 degrees
        if (y > 0 && !UiSquare.isRiver(y === 5, x))
            UiSquare.drawLineSegment(ctx, w, h, w / 2.0, 0);

        // 135 degrees
        if ((y === 1 && x === 4) || (y === 2 && x === 5) || (y === 8 && x === 4) || (y === 9 && x === 5))
            UiSquare.drawLineSegment(ctx, w, h, 0, 0);

        // 180 degrees
        if (x > 0)
            UiSquare.drawLineSegment(ctx, w, h, 0, h / 2.0);

        // 225 degrees
        if ((y === 0 && x === 5) || (y === 1 && x === 4) || (y === 7 && x === 5) || (y === 8 && x === 4))
            UiSquare.drawLineSegment(ctx, w, h, 0, h);

        // 270 degrees
        if (y < 9 && !UiSquare.isRiver(y === 4, x))
            UiSquare.drawLineSegment(ctx, w, h, w / 2.0, h);

        // 315 degrees
        if ((y === 0 && x === 3) || (y === 1 && x === 4) || (y === 7 && x === 3) || (y === 8 && x === 4))
            UiSquare.drawLineSegment(ctx, w, h, w, h);

        // Cannon and soldier markers
        // quadrants 1 and 2
        if (((y === 2 || y === 7) && (x === 1 || x === 7)) ||
            ((y === 3 || y === 6) && (x === 0 || x === 2 || x === 4 || x === 6))) {
            UiSquare.drawMarker(ctx, w, h, 1);
            UiSquare.drawMarker(ctx, w, h, 2);
        }

        // quadrants 3 and 4
        if (((y === 2 || y === 7) && (x === 1 || x === 7)) ||
            ((y === 3 || y === 6) && (x === 8 || x === 2 || x === 4 || x === 6))) {
            UiSquare.drawMarker(ctx, w, h, 3);
            UiSquare.drawMarker(ctx, w, h, 4);
        }
    }

    private static drawLineSegment(ctx: CanvasRenderingContext2D, totalWidth: number, totalHeight: number, toWidth: number, toHeight: number) {
        ctx.beginPath();
        ctx.moveTo(totalWidth / 2.0, totalHeight / 2.0);
        ctx.lineTo(toWidth, toHeight);
        ctx.stroke();
    }

    private static drawMarker(ctx: CanvasRenderingContext2D, totalWidth: number, totalHeight: number, quadrant: number) {

        const scale = 25;
        const sizeWidth = totalWidth / scale;
        const sizeHeight = totalHeight / scale;

        if (quadrant === 1)
            ctx.fillRect((totalWidth / 2.0) + sizeWidth, (totalHeight / 2.0) - (2 * sizeHeight), sizeWidth, sizeHeight);
        else if (quadrant === 2)
            ctx.fillRect((totalWidth / 2.0) + sizeWidth, (totalHeight / 2.0) + sizeHeight, sizeWidth, sizeHeight);
        else if (quadrant === 3)
            ctx.fillRect((totalWidth / 2.0) - (2 * sizeWidth), (totalHeight / 2.0) + sizeHeight, sizeWidth, sizeHeight);
        else
            ctx.fillRect((totalWidth / 2.0) - (2 * sizeWidth), (totalHeight / 2.0) - (2 * sizeHeight), sizeWidth, sizeHeight);
    }

    private static isRiver(isRiverRank: boolean, x: number) {
        return isRiverRank && x > 0 && x < 8;
    }
}