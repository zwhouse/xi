import {Request, Response} from "express";
import {CookieJar} from "./cookie-jar";

export function loggedInCheck(req: Request, res: Response, next: Function) {

    if (req.cookies["xi"] === undefined || !CookieJar.from(req).isLoggedIn()) {
        res.cookie("xi" , new CookieJar("", req.originalUrl).encryptedJson()).redirect('/user/login');
        return;
    }

    next();
}