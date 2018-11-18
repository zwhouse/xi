import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";
import {Result} from "../game/result";

@Entity()
export class Game {

    @PrimaryGeneratedColumn()
    id?: number;

    @Index()
    @Column()
    created: Date = new Date();

    @Column("text")
    movesJson: string = "[]";

    @Column("text")
    moveDatesJson: string = "[]";

    @Index()
    @ManyToOne(() => User, { eager: true })
    @JoinColumn()
    redPlayer?: User;

    @Index()
    @ManyToOne(() => User, { eager: true })
    @JoinColumn()
    blackPlayer?: User;

    @Index()
    @ManyToOne(() => User, { eager: true })
    @JoinColumn()
    turnPlayer?: User;

    @Index()
    @ManyToOne(() => User, { eager: true })
    @JoinColumn()
    winner?: User;

    @Column()
    isGameOver: boolean = false;

    @Column()
    drawProposalCode: string = "";

    @Column()
    pointsRed: number = 0;

    @Column()
    pointsBlack: number = 0;

    @Column()
    minutesPerMove: number = 0;

    @Column()
    countdownMinutes: number = 0;

    constructor(initiator: User, opponent: User, initiatorWithRed: boolean = true, minutesPerMove = 4 * 24 * 60) {
        this.redPlayer = initiatorWithRed ? initiator : opponent;
        this.blackPlayer = initiatorWithRed ? opponent : initiator;
        this.turnPlayer = initiatorWithRed ? initiator : opponent;
        this.minutesPerMove =  minutesPerMove;
        this.countdownMinutes = this.minutesPerMove;
    }

    moveCount(): number {
        return Math.floor((JSON.parse(this.movesJson) as string[]).length / 2.0) + 1;
    }

    draw() {
        this.endGame(undefined);
    }

    forfeit(user: User) {
        this.endGame(user.id === this.redPlayer!.id ? this.blackPlayer : this.redPlayer);
    }

    checkmate() {
        // If it's red's turn, black won
        this.endGame(this.turnPlayer!.id === this.redPlayer!.id ? this.blackPlayer : this.redPlayer);
    }

    getOpponentOf(user: User): User {
        return user.id === this.redPlayer!.id ? this.blackPlayer! : this.redPlayer!;
    }

    move(move: string) {

        const movesArray = JSON.parse(this.movesJson) as string[];
        const moveDatesArray = JSON.parse(this.moveDatesJson) as number[];

        movesArray.push(move);
        moveDatesArray.push(new Date().getTime());

        this.movesJson = JSON.stringify(movesArray);
        this.moveDatesJson = JSON.stringify(moveDatesArray);

        this.turnPlayer = this.turnPlayer!.id === this.redPlayer!.id ? this.blackPlayer : this.redPlayer;
        this.drawProposalCode = "";
        this.countdownMinutes = this.minutesPerMove;
    }

    updateCountdownMinutes(timestamp: number): number {

        if (this.countdownMinutes === 0) {
            // The timer already reached 0
            return 0;
        }

        const moveDatesArray = JSON.parse(this.moveDatesJson) as number[];
        const lastMoveDate = moveDatesArray.length === 0 ? this.created.getTime() : moveDatesArray[moveDatesArray.length - 1];
        const elapsedMinutes = Math.ceil((timestamp - lastMoveDate) / (1000 * 60));

        this.countdownMinutes = Math.max(0, this.minutesPerMove - elapsedMinutes);

        if (this.countdownMinutes === 0) {
            this.endGame(this.turnPlayer!.id === this.redPlayer!.id ? this.blackPlayer : this.redPlayer);
        }

        return this.countdownMinutes;
    }

    timeRemaining(): string {

        const parts: string[] = [];

        Game.stringifyAndPush(Math.floor((this.countdownMinutes / 60) / 24), "day", parts);
        Game.stringifyAndPush(Math.floor(this.countdownMinutes / 60) % 24, "hour", parts);
        Game.stringifyAndPush(this.countdownMinutes % 60, "minute", parts);

        switch (parts.length) {
            case 3:
                return `${parts[0]}, ${parts[1]} and ${parts[2]}`;
            case 2:
                return `${parts[0]} and ${parts[1]}`;
            case 1:
                return parts[0];
            default:
                return "";
        }
    }

    private static stringifyAndPush(amount: number, word: string, parts: string[]) {

        if (amount === 1) {
            parts.push(`1 ${word}`);
        }
        else if (amount > 1){
            parts.push(`${amount} ${word}s`);
        }
    }

    private endGame(winner?: User) {

        this.isGameOver = true;
        this.drawProposalCode = "";
        this.winner = winner;

        if (winner === undefined) {
            this.pointsRed = this.redPlayer!.pointsAfter(Result.Draw, this.blackPlayer!);
            this.pointsBlack = this.blackPlayer!.pointsAfter(Result.Draw, this.redPlayer!);
        }
        else if (winner!.id === this.redPlayer!.id) {
            this.pointsRed = this.redPlayer!.pointsAfter(Result.Win, this.blackPlayer!);
            this.pointsBlack = -this.pointsRed;
        }
        else {
            this.pointsBlack = this.blackPlayer!.pointsAfter(Result.Win, this.redPlayer!);
            this.pointsRed = -this.pointsBlack;
        }

        this.redPlayer!.rating += this.pointsRed;
        this.blackPlayer!.rating += this.pointsBlack;
    }
}