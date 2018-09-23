import {Request} from "express";
import {Game} from "../db/game";

export function resetPassword(req: Request, encrypted: string): string {
    return `<p>Reset your password <a href="${req.protocol}://${req.get("host")}/user/reset?code=${encodeURIComponent(encrypted)}">here</a>.</p>`;
}

export function drawProposal(req: Request, game: Game): string {

    const gameLink = `${req.protocol}://${req.get("host")}/game/id/${game.id}`;
    const drawLink = `${gameLink}/accept-draw?code=${game.drawProposalCode}`;

    return `<p>The proposal is for game <a href="${gameLink}">${game.id}</a>. Click <a href="${drawLink}">here</a> to accept.</p>`;
}

export function confirmationRegister(req: Request, encrypted: string) {
    return `<h1>Welcome to Xi!</h1>
            <p>Click <a href="${req.protocol}://${req.get("host")}/user/confirm?code=${encodeURIComponent(encrypted)}">here</a> to confirm your email address</p>`;
}