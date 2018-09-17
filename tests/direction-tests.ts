import {expect} from 'chai';
import 'mocha';
import {Direction} from "../src/game/direction";
import {Color} from "../src/game/color";

describe("Direction", () => {

    describe("#dX", () => {

        it("should return -1 for delta x for `Red` + `Left` and `Black` + `Right`", () => {
            expect(Direction.dX(Direction.Left, Color.Red)).to.equal(-1);
            expect(Direction.dX(Direction.Right, Color.Black)).to.equal(-1);
        });

        it("should return 0 for delta x for `Up` and `Down` regardless of color", () => {
            expect(Direction.dX(Direction.Up, Color.Red)).to.equal(0);
            expect(Direction.dX(Direction.Up, Color.Black)).to.equal(0);
            expect(Direction.dX(Direction.Down, Color.Red)).to.equal(0);
            expect(Direction.dX(Direction.Down, Color.Black)).to.equal(0);
        });

        it("should return 1 for delta x for `Red` + `Right` and `Black` + `Left`", () => {
            expect(Direction.dX(Direction.Right, Color.Red)).to.equal(1);
            expect(Direction.dX(Direction.Left, Color.Black)).to.equal(1);
        });

        it("should throw an error when color is `None`", () => {
            expect(() => {Direction.dX(Direction.Right, Color.None) }).to.throw(Error);
        });
    });

    describe("#dY", () => {

        it("should return -1 for delta y for `Red` + `Up` and `Black` + `Down`", () => {
            expect(Direction.dY(Direction.Up, Color.Red)).to.equal(-1);
            expect(Direction.dY(Direction.Down, Color.Black)).to.equal(-1);
        });

        it("should return 0 for delta y for `Left` and `Right` regardless of color", () => {
            expect(Direction.dY(Direction.Left, Color.Red)).to.equal(0);
            expect(Direction.dY(Direction.Left, Color.Black)).to.equal(0);
            expect(Direction.dY(Direction.Right, Color.Red)).to.equal(0);
            expect(Direction.dY(Direction.Right, Color.Black)).to.equal(0);
        });

        it("should return 1 for delta y for `Red` + `Down` and `Black` + `Up`", () => {
            expect(Direction.dY(Direction.Down, Color.Red)).to.equal(1);
            expect(Direction.dY(Direction.Up, Color.Black)).to.equal(1);
        });

        it("should throw an error when color is `None`", () => {
            expect(() => {Direction.dY(Direction.Up, Color.None) }).to.throw(Error);
        });
    });
});
