import {expect} from 'chai';
import 'mocha'
import {DbConfig} from "../../src/util/db-config";

describe("DbConfig", () => {

    describe("#constructor", () => {

        it("should parse without username and password", () => {

            const dbConfig = new DbConfig("postgres://localhost:5432/xi");

            expect(dbConfig.username).to.equal(undefined);
            expect(dbConfig.password).to.equal(undefined);
            expect(dbConfig.host).to.equal("localhost");
            expect(dbConfig.port).to.equal(5432);
            expect(dbConfig.database).to.equal("xi");
        });

        it("should parse with username and password", () => {

            const dbConfig = new DbConfig("postgres://usr:pw@some.host.com:1234/dbname");

            expect(dbConfig.username).to.equal("usr");
            expect(dbConfig.password).to.equal("pw");
            expect(dbConfig.host).to.equal("some.host.com");
            expect(dbConfig.port).to.equal(1234);
            expect(dbConfig.database).to.equal("dbname");
        });

        it("should throw an error when database is not PostgreSQL", () => {
            expect(() => { new DbConfig("sqlite://usr:pw@some.host.com:1234/dbname") }).to.throw(Error);
        });
    });
});
