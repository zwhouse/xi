import {Request, Response} from "express";
import {response} from "../util/response-utils";

export function apiSecretCheck(req: Request, res: Response, next: Function) {

    if (!req.get("X-ApiSecret")) {
        return response(res, 400, "missing API secret");
    }

    if (req.get("X-ApiSecret") !== process.env.API_SECRET) {
        return response(res, 401, "No no no...");
    }

    next();
}