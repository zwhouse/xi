import {Request} from "express";
import {Game} from "../db/game";
import {User} from "../db/user";
import {DrawProposal} from "../viewmodel/draw-proposal";

export function resetPassword(req: Request, encrypted: string): string {
    const protocol = process.env.DEVELOPMENT === "true" ? "http" : "https";
    return `<p>Reset your password <a href="${protocol}://${req.get("host")}/user/reset?code=${encodeURIComponent(encrypted)}">here</a>.</p>`;
}

export function drawProposal(req: Request, game: Game, proposal: DrawProposal): string {
    const protocol = process.env.DEVELOPMENT === "true" ? "http" : "https";
    const gameLink = `${protocol}://${req.get("host")}/game/id/${game.id}`;
    const drawLink = `${gameLink}/accept-draw?code=${encodeURIComponent(proposal.encrypt())}`;

    return `<p>The proposal is for game <a href="${gameLink}">${game.id}</a>. Click <a href="${drawLink}">here</a> to accept.</p>`;
}

export function confirmationRegister(req: Request, encrypted: string) {
    const protocol = process.env.DEVELOPMENT === "true" ? "http" : "https";
    return `<p>Welcome to Xi! Click <a href="${protocol}://${req.get("host")}/user/confirm?code=${encodeURIComponent(encrypted)}">here</a> to confirm your email address</p>`;
}

export function moveNotification(req: Request, game: Game): string {
    const protocol = process.env.DEVELOPMENT === "true" ? "http" : "https";
    const gameLink = `${protocol}://${req.get("host")}/game/id/${game.id}`;

    return `<p>${game.getOpponentOf(game.turnPlayer!).name} made a move in <a href="${gameLink}">game ${game.id}</a>.</p>`;
}

export function forfeitNotification(req: Request, game: Game, user: User): string {
    const protocol = process.env.DEVELOPMENT === "true" ? "http" : "https";
    const gameLink = `${protocol}://${req.get("host")}/game/id/${game.id}`;

    return `<p>Congrats, you won: ${user.name} forfeited <a href="${gameLink}">game ${game.id}</a>.</p>`;
}

export function inviteUser(req: Request, inviter: User, game: Game): string {
    const protocol = process.env.DEVELOPMENT === "true" ? "http" : "https";
    const gameLink = `${protocol}://${req.get("host")}/game/id/${game.id}`;

    return `<p>Hi, ${inviter.name} invited you to play a game Xiangqi with ${(game.minutesPerMove / (24 * 60))} days thinking time for each move: <a href="${gameLink}">game ${game.id}</a>.</p>`;
}

export function warnUser(req: Request, user: User, game: Game): string {
    const protocol = process.env.DEVELOPMENT === "true" ? "http" : "https";
    const gameLink = `${protocol}://${req.get("host")}/game/id/${game.id}`;

    return `<p>${user.name}, you have less than 1 hour to make a move in <a href="${gameLink}">game ${game.id}</a>.</p>`;
}