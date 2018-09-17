import {Request, Response} from "express";

export function loggedInCheck(req: Request, res: Response, next: Function) {

    if (req.cookies["xi"] === undefined) {
        // TODO get origin
        res.redirect('/user/login');
        return;
    }

    next();
}