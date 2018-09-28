import {Entity, PrimaryGeneratedColumn, Column, Index} from "typeorm";
import {Result} from "../game/result";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ length: 50 })
    name?: string;

    @Index()
    @Column({ length: 200, unique: true })
    email?: string;

    @Column({ length: 100 })
    passwordHash?: string;

    @Column()
    confirmedEmail: boolean = false;

    @Index()
    @Column()
    rating: number = 1200;

    constructor(name: string, email: string, hashedPassword: string, confirmedEmail: boolean = false, rating: number = 1200) {
        this.name = name;
        this.email = email;
        this.passwordHash = hashedPassword;
        this.confirmedEmail = confirmedEmail;
        this.rating = rating;
    }

    pointsAfter(result: Result, opponent: User, k: number = 25): number {
        const winChance = 1.0 / (1 + Math.pow(10, (opponent.rating - this.rating) / 400.0));
        const points = (result - winChance) * k;
        return Math.round(Math.abs(points)) * (points < 0 ? -1 : 1);
    }
}