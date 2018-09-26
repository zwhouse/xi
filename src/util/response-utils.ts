import {Response} from "express";

export function response(res: Response, code: number, message: string, body?: any): boolean {
    res.statusMessage = message;
    if (body === undefined) {
        res.status(code).end();
    }
    else {
        res.status(code).send(body);
    }
    return true;
}

export function render(res: Response, template: string, options?: Object): boolean {
    res.render(template, options);
    return true;
}