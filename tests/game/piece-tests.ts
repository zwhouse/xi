import { expect } from 'chai';
import 'mocha';
import {Piece} from "../../src/game/piece";
import {Color} from "../../src/game/color";
import {Board} from "../../src/game/board";

describe("Piece", () => {

    describe("#constructor", () => {

        it("should initialise `Color.Red` for /[ACEGHRS]/i", () => {
            for (let char of "ACEGHRS") {
                expect(Board.createPiece(char).color).to.equal(Color.Red);
            }
        });

        it("should initialise `Color.Black` for /[aceghrs]/i", () => {
            for (let char of "aceghrs") {
                expect(Board.createPiece(char).color).to.equal(Color.Black);
            }
        });

        it("should initialise the same `charWestern` for /[ACEGHRS]/i", () => {
            for (let char of "ACEGHRS") {
                expect(Board.createPiece(char).charWestern).to.equal(char);
            }
        });

        it("should initialise the same `charWestern` for /[aceghrs]/i", () => {
            for (let char of "aceghrs") {
                expect(Board.createPiece(char).charWestern).to.equal(char);
            }
        });

        it("should map 'S' to '兵'", () => {
            expect(Board.createPiece('S').charChinese).to.equal('兵');
        });

        it("should map 'C' to '炮'", () => {
            expect(Board.createPiece('C').charChinese).to.equal('炮');
        });

        it("should map 'R' to '俥'", () => {
            expect(Board.createPiece('R').charChinese).to.equal('俥');
        });

        it("should map 'H' to '傌'", () => {
            expect(Board.createPiece('H').charChinese).to.equal('傌');
        });

        it("should map 'E' to '相'", () => {
            expect(Board.createPiece('E').charChinese).to.equal('相');
        });

        it("should map 'A' to '仕'", () => {
            expect(Board.createPiece('A').charChinese).to.equal('仕');
        });

        it("should map 'G' to '帥'", () => {
            expect(Board.createPiece('G').charChinese).to.equal('帥');
        });

        it("should map 's' to '卒'", () => {
            expect(Board.createPiece('s').charChinese).to.equal('卒');
        });

        it("should map 'c' to '砲'", () => {
            expect(Board.createPiece('c').charChinese).to.equal('砲');
        });

        it("should map 'r' to '車'", () => {
            expect(Board.createPiece('r').charChinese).to.equal('車');
        });

        it("should map 'h' to '馬'", () => {
            expect(Board.createPiece('h').charChinese).to.equal('馬');
        });

        it("should map 'e' to '象'", () => {
            expect(Board.createPiece('e').charChinese).to.equal('象');
        });

        it("should map 'a' to '士'", () => {
            expect(Board.createPiece('a').charChinese).to.equal('士');
        });

        it("should map 'g' to '將'", () => {
            expect(Board.createPiece('g').charChinese).to.equal('將');
        });
    });

    describe("#isValidPieceChar", () => {

        it("should return false for [ .?,'\"~\\t]", () => {
            for (let char of " .?,'\"~\t") {
                expect(Piece.isValidPieceChar(char)).to.equal(false);
            }
        });

        it("should return false for /[bdfijklmnopqtuvwxyz]/i", () => {
            for (let char of "bdfijklmnopqtuvwxyz") {
                expect(Piece.isValidPieceChar(char)).to.equal(false);
                expect(Piece.isValidPieceChar(char.toUpperCase())).to.equal(false);
            }
        });

        it("should return true for /[aceghrs]/i", () => {
            for (let char of "aceghrs") {
                expect(Piece.isValidPieceChar(char)).to.equal(true);
                expect(Piece.isValidPieceChar(char.toUpperCase())).to.equal(true);
            }
        });
    });

    describe("#getColor", () => {

        it("should create `Color.Red` for both western and Chinese chars", () => {
            for (let char of "SCRHEAG兵炮俥傌相仕帥") {
                expect(Piece.getColor(char)).to.equal(Color.Red);
            }
        });

        it("should create `Color.Black` for both western and Chinese chars", () => {
            for (let char of "scrheag卒砲車馬象士將") {
                expect(Piece.getColor(char)).to.equal(Color.Black);
            }
        });

        it("should create `Color.None` for both non-piece chars", () => {
            for (let char of " \t.") {
                expect(Piece.getColor(char)).to.equal(Color.None);
            }
        });
    });
});
