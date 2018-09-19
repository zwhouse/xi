import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user";

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

    @Column()
    isRedTurn: boolean = true;

    @Column()
    isAccepted: boolean = false;

    @Column()
    isGameOver: boolean = false;

    constructor(initiator: User, opponent: User, initiatorWithRed: boolean, isAccepted: boolean = false) {
        this.redPlayer = initiatorWithRed ? initiator : opponent;
        this.blackPlayer = initiatorWithRed ? opponent : initiator;
        this.isAccepted = isAccepted;
    }

    setMoves(moves: string[]) {
        this.movesJson = JSON.stringify(moves);
        this.isRedTurn = !this.isRedTurn;
    }
}