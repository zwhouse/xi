import {expect} from 'chai';
import 'mocha';
import {Color} from "../../src/game/color";

describe("Color", () => {

    describe("#opposite", () => {

        it("should return `Color.Red` for `Color.Black`", () => {
            expect(Color.opposite(Color.Black)).to.equal(Color.Red);
        });

        it("should return `Color.Black` for `Color.`", () => {
            expect(Color.opposite(Color.Red)).to.equal(Color.Black);
        });

        it("should throw an error when color is `None`", () => {
            expect(() => { Color.opposite(Color.None) }).to.throw(Error);
        });
    });
});