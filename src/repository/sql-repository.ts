import {EntityRepository, EntityManager} from "typeorm";

@EntityRepository()
export class SqlRepository {

    constructor(private manager: EntityManager) {
    }

    execute(query: string): Promise<any> {
        return this.manager.query(query).catch(reason => reason);
    }
}
