import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";
import {Color} from "../game/color";

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
    isAccepted: boolean = false;

    @Column()
    isGameOver: boolean = false;

    @Column()
    drawProposalCode: string = "";

    // TODO points earned

    constructor(initiator: User, opponent: User, initiatorWithRed: boolean, isAccepted: boolean = false) {
        this.redPlayer = initiatorWithRed ? initiator : opponent;
        this.blackPlayer = initiatorWithRed ? opponent : initiator;
        this.turnPlayer = initiatorWithRed ? initiator : opponent;
        this.isAccepted = isAccepted;
    }

    end(colorTurn: Color) {
        this.isGameOver = true;
        this.winner = colorTurn === Color.Red ? this.blackPlayer : this.redPlayer;
        this.drawProposalCode = "";
    }

    setMoves(moves: string[]) {
        this.movesJson = JSON.stringify(moves);
        this.turnPlayer = this.turnPlayer!.id === this.redPlayer!.id ? this.blackPlayer : this.redPlayer;
        this.drawProposalCode = "";
    }
}