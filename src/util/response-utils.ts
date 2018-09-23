import {Response} from "express";

export function response(res: Response, code: number, message: string): boolean {
    res.statusMessage = message;
    res.status(code).end();
    return true;
}

export function render(res: Response, template: string, options?: Object): boolean {
    res.render(template, options);
    return true;
}