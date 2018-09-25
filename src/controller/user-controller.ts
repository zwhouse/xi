import {Router, Request, Response} from "express";
import {getCustomRepository} from "typeorm";
import {UserRepository} from "../repository/user-repository";
import {check, validationResult} from "express-validator/check";
import {arrayToObject} from "../util/collection";
import {MailService} from "../service/mail-service";
import {CryptoUtils} from "../util/crypto-utils";
import {secret} from "../server";
import {CookieJar} from "../middleware/cookie-jar";
import {render} from "../util/response-utils";
import {confirmationRegister, resetPassword} from "../template/mail";
import {UserRankingModel} from "../viewmodel/user-ranking-model";

const mailService = new MailService();
const router: Router = Router();
const create = getCustomRepository;

router.get("/login", (req: Request, res: Response) => {
    res.render("user/login");
});

router.post("/login", async (req: Request, res: Response) => {

    const repo = create(UserRepository);
    const user = await repo.findByUsername(req.body.email);

    if (user === undefined || !(await repo.correctPassword(user, req.body.password))) {
        res.render("user/login", { "error": "Oops, check email + password again please!", data: { email: req.body.email }});
        return;
    }

    if (!user.confirmedEmail) {
        res.render("user/login", { "error": "Please confirm your email address first", data: { email: req.body.email }});
        return;
    }

    const cookieJar = CookieJar.from(req);
    cookieJar.email = user.email!;

    let redirectUrl = "/game/list";

    if (cookieJar.redirectTo !== "") {
        redirectUrl = cookieJar.redirectTo;
        cookieJar.redirectTo = "";
    }

    res.cookie("xi" , cookieJar.encryptedJson()).redirect(`..${redirectUrl}`);
});

router.get("/register", (req: Request, res: Response) => {
    res.render("user/register");
});

router.post("/register", [
        check("name", "use at least 2 chars").isLength({ min: 2, max: 30 }),
        check("email", "that\"s not an email address").isEmail(),
        check("password", "too easy to guess").isLength({ min: 6 })
    ], async (req: Request, res: Response) => {

    const errorArray = validationResult(req).array();
    const data = { name: req.body.name, email: req.body.email };

    if (errorArray.length > 0)
        return render(res, "user/register", { errors: arrayToObject(errorArray, "param"), data: data });

    const userRepo = create(UserRepository);
    const user = await userRepo.createAndSave(req.body.name, req.body.email, req.body.password).catch(e => console.log("error:", e));
    const encrypted = CryptoUtils.encrypt(user.email!, secret) as string;

    await mailService.send(user.email!, "Xi - confirm email address", confirmationRegister(req, encrypted));

    res.render("user/register-success");
});

router.get("/confirm", async (req: Request, res: Response) => {

    const decoded = decodeURIComponent(req.query.code);
    const decrypted = CryptoUtils.decrypt(decoded, secret);
    const repo = create(UserRepository);

    if (decrypted === undefined) {
        res.send("No no no...");
        return;
    }

    const user = await repo.findByUsername(decrypted);

    if (user === undefined || user.confirmedEmail) {
        res.send("No no no...");
        return;
    }

    user.confirmedEmail = true;
    await repo.save(user);

    res.render("user/login", { "info": "confirmation successful, please login", data: { email: user.email }});
});

router.get("/reset-request", (req: Request, res: Response) => {
    res.render("user/reset-request");
});

router.post("/reset-request", async (req: Request, res: Response) => {

    const repo = create(UserRepository);
    const user = await repo.findByUsername(req.body.email);

    if (user === undefined)
        return render(res, "user/reset-pending");

    const encrypted = CryptoUtils.encrypt(user.email!, secret) as string;
    await mailService.send(user.email!, "Xi - reset password", resetPassword(req, encrypted));

    res.render("user/reset-pending");
});

router.get("/reset", (req: Request, res: Response) => {
    if (!req.query.code === undefined) {
        return render(res, "error/hacker");
    }
    res.render("user/reset", { code: decodeURIComponent(req.query.code) });
});

router.post("/reset", [
        check("password", "too easy to guess").isLength({ min: 6 })
    ], async (req: Request, res: Response) => {

    const errorArray = validationResult(req).array();

    if (errorArray.length > 0)
        return render(res, "user/reset", { errors: arrayToObject(errorArray, "param") });

    const decoded = decodeURIComponent(req.body.code);
    const decrypted = CryptoUtils.decrypt(decoded, secret);
    const newPassword = req.body.password;

    if (decrypted === undefined) {
        return render(res, "error/hacker");
    }

    const repo = create(UserRepository);
    const user = await repo.findByUsername(decrypted);

    if (user === undefined) {
        return render(res, "error/hacker");
    }

    user.passwordHash = await repo.hashedPassword(newPassword);
    user.confirmedEmail = true;
    await repo.save(user);

    res.render("user/login", { data: { email: user.email }, info: "password reset, please log in" });
});

router.get("/rankings", async (req: Request, res: Response) => {

    const repo = create(UserRepository);
    const users = await repo.getAll();

    res.render("user/rankings", { users: new UserRankingModel(users) });
});

export const UserController: Router = router;
