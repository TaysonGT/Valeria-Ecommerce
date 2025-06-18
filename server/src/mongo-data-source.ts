import { DataSource } from "typeorm"

export const mongoDataSource = new DataSource({
    type: 'mongodb',
    host: 'localhost',
    port: 27017,
    username: 'tayson',
    password: '123456',
    database: 'Valeria',
    authSource: 'admin',
    entities: [__dirname + "/entity/*.js"],
    migrations: [],
    subscribers: [],
    logging: true,
    synchronize: true,
})