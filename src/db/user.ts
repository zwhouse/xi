import {Entity, PrimaryGeneratedColumn, Column, Index} from "typeorm";

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
    confirmedEmail?: boolean;

    constructor(name: string, email: string, hashedPassword: string, confirmedEmail: boolean = false) {
        this.name = name;
        this.email = email;
        this.passwordHash = hashedPassword;
        this.confirmedEmail = confirmedEmail;
    }
}