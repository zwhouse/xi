import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";
import {Color} from "../game/color";
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

    constructor(initiator: User, opponent: User, initiatorWithRed: boolean) {
        this.redPlayer = initiatorWithRed ? initiator : opponent;
        this.blackPlayer = initiatorWithRed ? opponent : initiator;
        this.turnPlayer = initiatorWithRed ? initiator : opponent;
    }

    draw() {
        this.isGameOver = true;
        this.winner = undefined;
        this.drawProposalCode = "";

        this.pointsRed = this.redPlayer!.pointsAfter(Result.Draw, this.blackPlayer!);
        this.pointsBlack = this.blackPlayer!.pointsAfter(Result.Draw, this.redPlayer!);

        this.redPlayer!.rating += this.pointsRed;
        this.blackPlayer!.rating += this.pointsBlack;
    }

    forfeit(user: User) {
        this.isGameOver = true;
        this.drawProposalCode = "";

        if (user.id === this.redPlayer!.id) {
            this.winner = this.blackPlayer;
            this.pointsBlack = this.blackPlayer!.pointsAfter(Result.Win, this.redPlayer!);
            this.pointsRed = -this.pointsBlack;
        }
        else {
            this.winner = this.redPlayer;
            this.pointsRed = this.redPlayer!.pointsAfter(Result.Win, this.blackPlayer!);
            this.pointsBlack = -this.pointsRed;
        }

        this.redPlayer!.rating += this.pointsRed;
        this.blackPlayer!.rating += this.pointsBlack;
    }

    end(colorTurn: Color) {
        this.isGameOver = true;
        this.drawProposalCode = "";

        if (colorTurn === Color.Red) {
            // It's red's turn, so black won
            this.winner = this.blackPlayer;
            this.pointsBlack = this.blackPlayer!.pointsAfter(Result.Win, this.redPlayer!);
            this.pointsRed = -this.pointsBlack;
        }
        else {
            this.winner = this.redPlayer;
            this.pointsRed = this.redPlayer!.pointsAfter(Result.Win, this.blackPlayer!);
            this.pointsBlack = -this.pointsRed;
        }

        this.redPlayer!.rating += this.pointsRed;
        this.blackPlayer!.rating += this.pointsBlack;
    }

    getOpponentOf(user: User): User {
        return user.id === this.redPlayer!.id ? this.blackPlayer! : this.redPlayer!;
    }

    move(move: string) {
        const tempMoves = JSON.parse(this.movesJson) as string[];
        tempMoves.push(move);
        this.movesJson = JSON.stringify(tempMoves);
        this.turnPlayer = this.turnPlayer!.id === this.redPlayer!.id ? this.blackPlayer : this.redPlayer;
        this.drawProposalCode = "";
    }
}