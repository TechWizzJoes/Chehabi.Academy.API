// import * as mssql from 'mssql';
// import * as mariadb from 'mariadb';
// import * as mysql from 'mysql2/promise';
// import { Injectable } from '@nestjs/common';
// import { Sequelize } from 'sequelize';
// import { AppConfig, Config } from '@App/Config/App.Config';
// import { initModels } from './Entities/init-models';
// import { DialerDbContext, Models } from './Dialer.DbContext';
// import { promises } from 'dns';
// import { WinstonService } from '@App/Common/Logs/Winston.Helper';

// @Injectable()
// export class DbConnections {
// 	Config: Config;
// 	private _MotherDbContext: Promise<mssql.ConnectionPool>;
// 	private _DialerDbContext: DialerDbContext;
// 	private _AsteriskDbConnection: mariadb.Pool;
// 	private _DialerNativeDbContext: Promise<mysql.Pool>;

// 	public get MotherDbContext(): Promise<mssql.ConnectionPool> {
// 		return this._MotherDbContext;
// 	}

// 	public get DialerDbContext(): DialerDbContext {
// 		return this._DialerDbContext;
// 	}

// 	public get AsteriskDbConnection(): mariadb.Pool {
// 		return this._AsteriskDbConnection;
// 	}

// 	public get DialerNativeDbContext(): Promise<mysql.Pool> {
// 		return this._DialerNativeDbContext;
// 	}

// 	constructor(private AppConfig: AppConfig, private WinstonService: WinstonService) {
// 		this.Config = this.AppConfig.Config;
// 		console.log('\n\nDatabase initialization\n\n');
// 		this._MotherDbContext = this.Mother_init();
// 		this._DialerDbContext = this.Dialer_init();
// 		this._DialerNativeDbContext = this.DialerNative_init();
// 		this._AsteriskDbConnection = this.Asterisk_init();
// 	}

// 	Dialer_init() {
// 		const sequelize = new Sequelize({
// 			dialect: 'mariadb',
// 			host: this.Config.Database.Client.Host,
// 			port: this.Config.Database.Client.Port,
// 			username: this.Config.Database.Client.Username,
// 			password: this.Config.Database.Client.Password,
// 			database: this.Config.Database.Client.Dialer,
// 			pool: {
// 				min: this.Config.Database.Client.Min,
// 				max: this.Config.Database.Client.Max,
// 				idle: this.Config.Database.Client.Idle
// 			},
// 			logging: (message, timing) => {
// 				this.WinstonService.DataBase(message, timing);
// 			},
// 			benchmark: true //to fill the timing with the query time
// 		});

// 		const models: Models = initModels(sequelize);
// 		const dialerDbContext: DialerDbContext = { Sequelize: sequelize, Models: models };
// 		return dialerDbContext;
// 	}

// 	private async Mother_init() {
// 		const DbConfig = {
// 			server: this.Config.Database.Mother.Host,
// 			user: this.Config.Database.Mother.Username,
// 			password: this.Config.Database.Mother.Password,
// 			database: this.Config.Database.Mother.Name,
// 			pool: {
// 				max: this.Config.Database.Mother.Max,
// 				min: this.Config.Database.Mother.Min,
// 				idleTimeoutMillis: this.Config.Database.Mother.Idle
// 			},
// 			options: {
// 				encrypt: true, // for azure
// 				trustServerCertificate: true // change to true for local dev / self-signed certs
// 			}
// 		};
// 		return await mssql.connect(DbConfig);
// 		// return pool.request();
// 	}

// 	private Asterisk_init(): mariadb.Pool {
// 		return mariadb.createPool({
// 			host: this.Config.Database.Client.Host, //accountHost,
// 			port: this.Config.Database.Client.Port,
// 			user: this.Config.Database.Client.Username,
// 			password: this.Config.Database.Client.Password,
// 			database: this.Config.Database.Client.Asterisk,
// 			connectionLimit: 10,
// 			idleTimeout: 60000 // idle connections timeout, in milliseconds, the default value 60000
// 		});
// 	}

// 	private async DialerNative_init(): Promise<mysql.Pool> {
// 		return await mysql.createPool({
// 			host: this.Config.Database.Client.Host, //accountHost,
// 			port: this.Config.Database.Client.Port,
// 			user: this.Config.Database.Client.Username,
// 			password: this.Config.Database.Client.Password,
// 			database: this.Config.Database.Client.Dialer,
// 			timezone: 'UTC',
// 			connectionLimit: 10,
// 			connectTimeout: 180000, // increase the connection timeout value
// 			acquireTimeout: 180000, // increase the request timeout value
// 			idleTimeout: 60000 // idle connections timeout, in milliseconds, the default value 60000
// 		});
// 	}

// 	async Dialer() {
// 		// const accountHost = this.AsyncLocalStorage.getStore().AccountHost;

// 		console.log('<DialerSequelize>');
// 		console.log('rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
// 		// console.log('</DialerSequelize>');

// 		const sequelize = new Sequelize({
// 			dialect: 'mariadb',
// 			host: this.Config.Database.Client.Host, // accountHost,
// 			port: this.Config.Database.Client.Port,
// 			username: this.Config.Database.Client.Username,
// 			password: this.Config.Database.Client.Password,
// 			database: this.Config.Database.Client.Dialer,
// 			dialectOptions: {
// 				connectTimeout: 180000, // increase the connection timeout value
// 				requestTimeout: 180000 // increase the request timeout value
// 			},
// 			pool: {
// 				min: 5,
// 				max: 10,
// 				idle: 10000
// 			}
// 		});

// 		initModels(sequelize);
// 		const dbContext: any = {};
// 		dbContext.sequelize = sequelize;
// 		dbContext.Models = dbContext.sequelize.models;
// 		return dbContext;
// 	}
// }
