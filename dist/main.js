/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var __resourceQuery = "?100";
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/* globals __resourceQuery */
if (true) {
	// eslint-disable-next-line no-implicit-coercion
	var hotPollInterval = +__resourceQuery.slice(1) || 0;
	var log = __webpack_require__(1);

	/**
	 * @param {boolean=} fromUpdate true when called from update
	 */
	var checkForUpdate = function checkForUpdate(fromUpdate) {
		if (module.hot.status() === "idle") {
			module.hot
				.check(true)
				.then(function (updatedModules) {
					if (!updatedModules) {
						if (fromUpdate) log("info", "[HMR] Update applied.");
						return;
					}
					__webpack_require__(2)(updatedModules, updatedModules);
					checkForUpdate(true);
				})
				.catch(function (err) {
					var status = module.hot.status();
					if (["abort", "fail"].indexOf(status) >= 0) {
						log("warning", "[HMR] Cannot apply update.");
						log("warning", "[HMR] " + log.formatError(err));
						log("warning", "[HMR] You need to restart the application!");
					} else {
						log("warning", "[HMR] Update failed: " + log.formatError(err));
					}
				});
		}
	};
	setInterval(checkForUpdate, hotPollInterval);
} else // removed by dead control flow
{}


/***/ }),
/* 1 */
/***/ ((module) => {

/** @typedef {"info" | "warning" | "error"} LogLevel */

/** @type {LogLevel} */
var logLevel = "info";

function dummy() {}

/**
 * @param {LogLevel} level log level
 * @returns {boolean} true, if should log
 */
function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

/**
 * @param {(msg?: string) => void} logFn log function
 * @returns {(level: LogLevel, msg?: string) => void} function that logs when log level is sufficient
 */
function logGroup(logFn) {
	return function (level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

/**
 * @param {LogLevel} level log level
 * @param {string|Error} msg message
 */
module.exports = function (level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

/**
 * @param {Error} err error
 * @returns {string} formatted error
 */
module.exports.formatError = function (err) {
	var message = err.message;
	var stack = err.stack;
	if (!stack) {
		return message;
	} else if (stack.indexOf(message) < 0) {
		return message + "\n" + stack;
	}
	return stack;
};

var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

/**
 * @param {LogLevel} level log level
 */
module.exports.setLogLevel = function (level) {
	logLevel = level;
};


/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

/**
 * @param {(string | number)[]} updatedModules updated modules
 * @param {(string | number)[] | null} renewedModules renewed modules
 */
module.exports = function (updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function (moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__(1);

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function (moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function (moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function (moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				'[HMR] Consider using the optimization.moduleIds: "named" for module names.'
			);
	}
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const common_1 = __webpack_require__(4);
const core_1 = __webpack_require__(5);
const swagger_1 = __webpack_require__(6);
const bodyParser = __importStar(__webpack_require__(7));
const dotenv_1 = __importDefault(__webpack_require__(8));
const http_exception_filter_1 = __webpack_require__(9);
const app_module_1 = __webpack_require__(10);
const fs_1 = __webpack_require__(85);
const path_1 = __webpack_require__(65);
dotenv_1.default.config();
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.set('trust proxy', 1);
    app.enableCors({
        origin: ['http://localhost:3000', process.env.FRONTEND_URL_NEXT],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie', 'Cookie'],
    });
    app.use('/video/webhook/mux', bodyParser.raw({ type: 'application/json' }));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('jammit api문서')
        .setDescription(`jammit 개발을 위한 API 문서입니다.\n\n🔗 OpenAPI 명세 다운로드: /openapi-spec.json`)
        .setVersion('1.0')
        .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'JWT access token',
        in: 'header',
    }, 'access-token')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    (0, fs_1.writeFileSync)('./openapi-spec.json', JSON.stringify(document, null, 2));
    app.useStaticAssets((0, path_1.join)(__dirname, '..'));
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    const port = process.env.PORT;
    await app.listen(port);
    if (true) {
        module.hot.accept();
        module.hot.dispose(() => {
            void app.close();
        });
    }
}
bootstrap().catch((error) => {
    console.error('Failed to start the server:', error);
});


/***/ }),
/* 4 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/common");

/***/ }),
/* 5 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core");

/***/ }),
/* 6 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/swagger");

/***/ }),
/* 7 */
/***/ ((module) => {

"use strict";
module.exports = require("body-parser");

/***/ }),
/* 8 */
/***/ ((module) => {

"use strict";
module.exports = require("dotenv");

/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpExceptionFilter = void 0;
const common_1 = __webpack_require__(4);
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const err = exception.getResponse();
        if (typeof err !== 'string' && err.statusCode === 400) {
            return response.status(status).json({
                success: false,
                code: status,
                data: err.message,
            });
        }
        response.status(status).json({
            success: false,
            data: err.message,
            code: status,
        });
    }
};
exports.HttpExceptionFilter = HttpExceptionFilter;
exports.HttpExceptionFilter = HttpExceptionFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], HttpExceptionFilter);


/***/ }),
/* 10 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const jammit_persistence_module_1 = __webpack_require__(11);
const jammit_auth_module_1 = __webpack_require__(27);
const jammit_gatherings_module_1 = __webpack_require__(47);
const jammit_review_module_1 = __webpack_require__(57);
const jammit_user_module_1 = __webpack_require__(60);
const axios_1 = __webpack_require__(28);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(29);
const typeorm_1 = __webpack_require__(12);
const schedule_1 = __webpack_require__(55);
const path_1 = __webpack_require__(65);
const typeorm_2 = __webpack_require__(15);
const comment_module_1 = __webpack_require__(66);
const logger_middleware_1 = __webpack_require__(72);
const entities_1 = __webpack_require__(13);
const redis_module_1 = __webpack_require__(31);
const video_module_1 = __webpack_require__(73);
const app_controller_1 = __webpack_require__(83);
const app_service_1 = __webpack_require__(84);
let AppModule = class AppModule {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT || '5432'),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                logging: process.env.NODE_ENV === 'production' ? false : true,
                migrations: [(0, path_1.join)(__dirname, '../database/migrations/**/*{.ts,.js}')],
                migrationsRun: process.env.NODE_ENV === 'production' ? false : true,
                migrationsTableName: 'migrations',
                autoLoadEntities: true,
                retryAttempts: 3,
                retryDelay: 3000,
                synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
                ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
                extra: {
                    max: 20,
                    connectionTimeoutMillis: 60000,
                    idleTimeoutMillis: 30000,
                },
            }),
            typeorm_1.TypeOrmModule.forFeature(entities_1.ALL_ENTITIES),
            schedule_1.ScheduleModule.forRoot(),
            jammit_persistence_module_1.JammitPersistenceModule,
            jammit_auth_module_1.JammitAuthModule,
            jammit_user_module_1.JammitUserModule,
            jammit_gatherings_module_1.JammitGatheringsModule,
            jammit_review_module_1.JammitReviewModule,
            video_module_1.VideoModule,
            comment_module_1.CommentModule,
            redis_module_1.RedisModule,
            axios_1.HttpModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
        exports: [jammit_persistence_module_1.JammitPersistenceModule, jammit_auth_module_1.JammitAuthModule],
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.DataSource !== "undefined" && typeorm_2.DataSource) === "function" ? _a : Object])
], AppModule);


/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JammitPersistenceModule = void 0;
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(12);
const entities_1 = __webpack_require__(13);
let JammitPersistenceModule = class JammitPersistenceModule {
};
exports.JammitPersistenceModule = JammitPersistenceModule;
exports.JammitPersistenceModule = JammitPersistenceModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature(entities_1.JAMMIT_ENTITIES)],
        exports: [typeorm_1.TypeOrmModule],
    })
], JammitPersistenceModule);


/***/ }),
/* 12 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/typeorm");

/***/ }),
/* 13 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ALL_ENTITIES = exports.JAMMIT_ENTITIES = exports.Review = exports.PreferredGenre = exports.PreferredBandSession = exports.JammitUser = exports.GatheringSession = exports.GatheringParticipant = exports.GatheringGenre = exports.Gathering = exports.Video = exports.Like = exports.Comment = void 0;
var comment_entity_1 = __webpack_require__(14);
Object.defineProperty(exports, "Comment", ({ enumerable: true, get: function () { return comment_entity_1.Comment; } }));
var like_entity_1 = __webpack_require__(21);
Object.defineProperty(exports, "Like", ({ enumerable: true, get: function () { return like_entity_1.Like; } }));
var video_entity_1 = __webpack_require__(20);
Object.defineProperty(exports, "Video", ({ enumerable: true, get: function () { return video_entity_1.Video; } }));
var gathering_entity_1 = __webpack_require__(22);
Object.defineProperty(exports, "Gathering", ({ enumerable: true, get: function () { return gathering_entity_1.Gathering; } }));
var gathering_genre_entity_1 = __webpack_require__(23);
Object.defineProperty(exports, "GatheringGenre", ({ enumerable: true, get: function () { return gathering_genre_entity_1.GatheringGenre; } }));
var gathering_participant_entity_1 = __webpack_require__(24);
Object.defineProperty(exports, "GatheringParticipant", ({ enumerable: true, get: function () { return gathering_participant_entity_1.GatheringParticipant; } }));
var gathering_session_entity_1 = __webpack_require__(25);
Object.defineProperty(exports, "GatheringSession", ({ enumerable: true, get: function () { return gathering_session_entity_1.GatheringSession; } }));
var jammit_user_entity_1 = __webpack_require__(16);
Object.defineProperty(exports, "JammitUser", ({ enumerable: true, get: function () { return jammit_user_entity_1.JammitUser; } }));
var preferred_band_session_entity_1 = __webpack_require__(18);
Object.defineProperty(exports, "PreferredBandSession", ({ enumerable: true, get: function () { return preferred_band_session_entity_1.PreferredBandSession; } }));
var preferred_genre_entity_1 = __webpack_require__(19);
Object.defineProperty(exports, "PreferredGenre", ({ enumerable: true, get: function () { return preferred_genre_entity_1.PreferredGenre; } }));
var review_entity_1 = __webpack_require__(26);
Object.defineProperty(exports, "Review", ({ enumerable: true, get: function () { return review_entity_1.Review; } }));
const comment_entity_2 = __webpack_require__(14);
const gathering_entity_2 = __webpack_require__(22);
const gathering_genre_entity_2 = __webpack_require__(23);
const gathering_participant_entity_2 = __webpack_require__(24);
const gathering_session_entity_2 = __webpack_require__(25);
const jammit_user_entity_2 = __webpack_require__(16);
const like_entity_2 = __webpack_require__(21);
const preferred_band_session_entity_2 = __webpack_require__(18);
const preferred_genre_entity_2 = __webpack_require__(19);
const review_entity_2 = __webpack_require__(26);
const video_entity_2 = __webpack_require__(20);
exports.JAMMIT_ENTITIES = [
    jammit_user_entity_2.JammitUser,
    preferred_genre_entity_2.PreferredGenre,
    preferred_band_session_entity_2.PreferredBandSession,
    gathering_entity_2.Gathering,
    gathering_genre_entity_2.GatheringGenre,
    gathering_session_entity_2.GatheringSession,
    gathering_participant_entity_2.GatheringParticipant,
    review_entity_2.Review,
];
exports.ALL_ENTITIES = [...exports.JAMMIT_ENTITIES, comment_entity_2.Comment, like_entity_2.Like, video_entity_2.Video];


/***/ }),
/* 14 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Comment = void 0;
const typeorm_1 = __webpack_require__(15);
const jammit_user_entity_1 = __webpack_require__(16);
const video_entity_1 = __webpack_require__(20);
let Comment = class Comment {
};
exports.Comment = Comment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Comment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], Comment.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Comment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Comment.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => jammit_user_entity_1.JammitUser, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", typeof (_c = typeof jammit_user_entity_1.JammitUser !== "undefined" && jammit_user_entity_1.JammitUser) === "function" ? _c : Object)
], Comment.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => video_entity_1.Video, (video) => video.comment, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'videoId' }),
    __metadata("design:type", typeof (_d = typeof video_entity_1.Video !== "undefined" && video_entity_1.Video) === "function" ? _d : Object)
], Comment.prototype, "video", void 0);
exports.Comment = Comment = __decorate([
    (0, typeorm_1.Entity)({ name: 'comment' })
], Comment);


/***/ }),
/* 15 */
/***/ ((module) => {

"use strict";
module.exports = require("typeorm");

/***/ }),
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JammitUser = void 0;
const typeorm_1 = __webpack_require__(15);
const jammit_enums_1 = __webpack_require__(17);
const preferred_band_session_entity_1 = __webpack_require__(18);
const preferred_genre_entity_1 = __webpack_require__(19);
let JammitUser = class JammitUser {
};
exports.JammitUser = JammitUser;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], JammitUser.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30, unique: true }),
    __metadata("design:type", String)
], JammitUser.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    __metadata("design:type", String)
], JammitUser.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30 }),
    __metadata("design:type", String)
], JammitUser.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 30, nullable: true }),
    __metadata("design:type", String)
], JammitUser.prototype, "nickname", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], JammitUser.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], JammitUser.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'oauth_platform',
        type: 'varchar',
        length: 20,
        default: jammit_enums_1.OauthPlatform.NONE,
    }),
    __metadata("design:type", typeof (_c = typeof jammit_enums_1.OauthPlatform !== "undefined" && jammit_enums_1.OauthPlatform) === "function" ? _c : Object)
], JammitUser.prototype, "oauthPlatform", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'org_file_name', length: 255, nullable: true }),
    __metadata("design:type", String)
], JammitUser.prototype, "orgFileName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'profile_image_path', length: 500, nullable: true }),
    __metadata("design:type", String)
], JammitUser.prototype, "profileImagePath", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => preferred_genre_entity_1.PreferredGenre, (pg) => pg.user, { cascade: true }),
    __metadata("design:type", Array)
], JammitUser.prototype, "preferredGenres", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => preferred_band_session_entity_1.PreferredBandSession, (pbs) => pbs.user, {
        cascade: true,
    }),
    __metadata("design:type", Array)
], JammitUser.prototype, "userBandSessions", void 0);
exports.JammitUser = JammitUser = __decorate([
    (0, typeorm_1.Entity)('users')
], JammitUser);


/***/ }),
/* 17 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OauthPlatform = exports.ParticipantStatus = exports.GatheringStatus = exports.BandSession = exports.Genre = void 0;
var Genre;
(function (Genre) {
    Genre["ROCK"] = "ROCK";
    Genre["METAL"] = "METAL";
    Genre["POP"] = "POP";
    Genre["BALLAD"] = "BALLAD";
    Genre["INDIE"] = "INDIE";
    Genre["ALTERNATIVE"] = "ALTERNATIVE";
    Genre["JAZZ"] = "JAZZ";
    Genre["PUNK"] = "PUNK";
    Genre["ACOUSTIC"] = "ACOUSTIC";
    Genre["FOLK"] = "FOLK";
    Genre["RNB"] = "RNB";
})(Genre || (exports.Genre = Genre = {}));
var BandSession;
(function (BandSession) {
    BandSession["VOCAL"] = "VOCAL";
    BandSession["ELECTRIC_GUITAR"] = "ELECTRIC_GUITAR";
    BandSession["DRUM"] = "DRUM";
    BandSession["ACOUSTIC_GUITAR"] = "ACOUSTIC_GUITAR";
    BandSession["BASS"] = "BASS";
    BandSession["STRING_INSTRUMENT"] = "STRING_INSTRUMENT";
    BandSession["PERCUSSION"] = "PERCUSSION";
    BandSession["KEYBOARD"] = "KEYBOARD";
})(BandSession || (exports.BandSession = BandSession = {}));
var GatheringStatus;
(function (GatheringStatus) {
    GatheringStatus["RECRUITING"] = "RECRUITING";
    GatheringStatus["CONFIRMED"] = "CONFIRMED";
    GatheringStatus["COMPLETED"] = "COMPLETED";
    GatheringStatus["CANCELED"] = "CANCELED";
})(GatheringStatus || (exports.GatheringStatus = GatheringStatus = {}));
var ParticipantStatus;
(function (ParticipantStatus) {
    ParticipantStatus["PENDING"] = "PENDING";
    ParticipantStatus["APPROVED"] = "APPROVED";
    ParticipantStatus["REJECTED"] = "REJECTED";
    ParticipantStatus["COMPLETED"] = "COMPLETED";
    ParticipantStatus["CANCELED"] = "CANCELED";
})(ParticipantStatus || (exports.ParticipantStatus = ParticipantStatus = {}));
var OauthPlatform;
(function (OauthPlatform) {
    OauthPlatform["NONE"] = "NONE";
})(OauthPlatform || (exports.OauthPlatform = OauthPlatform = {}));


/***/ }),
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PreferredBandSession = void 0;
const typeorm_1 = __webpack_require__(15);
const jammit_enums_1 = __webpack_require__(17);
const jammit_user_entity_1 = __webpack_require__(16);
let PreferredBandSession = class PreferredBandSession {
};
exports.PreferredBandSession = PreferredBandSession;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PreferredBandSession.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => jammit_user_entity_1.JammitUser, (u) => u.userBandSessions, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", typeof (_a = typeof jammit_user_entity_1.JammitUser !== "undefined" && jammit_user_entity_1.JammitUser) === "function" ? _a : Object)
], PreferredBandSession.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'band_session_name', type: 'varchar', length: 40 }),
    __metadata("design:type", typeof (_b = typeof jammit_enums_1.BandSession !== "undefined" && jammit_enums_1.BandSession) === "function" ? _b : Object)
], PreferredBandSession.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'band_session_priority', type: 'int' }),
    __metadata("design:type", Number)
], PreferredBandSession.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], PreferredBandSession.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], PreferredBandSession.prototype, "updatedAt", void 0);
exports.PreferredBandSession = PreferredBandSession = __decorate([
    (0, typeorm_1.Entity)({ name: 'preferred_band_session' })
], PreferredBandSession);


/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PreferredGenre = void 0;
const typeorm_1 = __webpack_require__(15);
const jammit_enums_1 = __webpack_require__(17);
const jammit_user_entity_1 = __webpack_require__(16);
let PreferredGenre = class PreferredGenre {
};
exports.PreferredGenre = PreferredGenre;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PreferredGenre.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => jammit_user_entity_1.JammitUser, (u) => u.preferredGenres, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", typeof (_a = typeof jammit_user_entity_1.JammitUser !== "undefined" && jammit_user_entity_1.JammitUser) === "function" ? _a : Object)
], PreferredGenre.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'genre_name', type: 'varchar', length: 40 }),
    __metadata("design:type", typeof (_b = typeof jammit_enums_1.Genre !== "undefined" && jammit_enums_1.Genre) === "function" ? _b : Object)
], PreferredGenre.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'genre_priority', type: 'int' }),
    __metadata("design:type", Number)
], PreferredGenre.prototype, "priority", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], PreferredGenre.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], PreferredGenre.prototype, "updatedAt", void 0);
exports.PreferredGenre = PreferredGenre = __decorate([
    (0, typeorm_1.Entity)({ name: 'preferred_genre' })
], PreferredGenre);


/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Video = void 0;
const typeorm_1 = __webpack_require__(15);
const jammit_user_entity_1 = __webpack_require__(16);
const comment_entity_1 = __webpack_require__(14);
const like_entity_1 = __webpack_require__(21);
let Video = class Video {
};
exports.Video = Video;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Video.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 50, nullable: false }),
    __metadata("design:type", String)
], Video.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: false, length: 300 }),
    __metadata("design:type", String)
], Video.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Video.prototype, "videoUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Video.prototype, "viewCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Video.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Video.prototype, "playbackId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true }),
    __metadata("design:type", String)
], Video.prototype, "uploadId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, }),
    __metadata("design:type", String)
], Video.prototype, "duration", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', nullable: true, }),
    __metadata("design:type", String)
], Video.prototype, "assetId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'integer', nullable: true }),
    __metadata("design:type", Number)
], Video.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Video.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Video.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => like_entity_1.Like, (like) => like.video),
    __metadata("design:type", Array)
], Video.prototype, "like", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => jammit_user_entity_1.JammitUser, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", typeof (_c = typeof jammit_user_entity_1.JammitUser !== "undefined" && jammit_user_entity_1.JammitUser) === "function" ? _c : Object)
], Video.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => comment_entity_1.Comment, (comment) => comment.video),
    __metadata("design:type", Array)
], Video.prototype, "comment", void 0);
exports.Video = Video = __decorate([
    (0, typeorm_1.Entity)({ name: 'video' })
], Video);


/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Like = void 0;
const jammit_user_entity_1 = __webpack_require__(16);
const typeorm_1 = __webpack_require__(15);
const video_entity_1 = __webpack_require__(20);
let Like = class Like {
};
exports.Like = Like;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Like.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Like.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Like.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => jammit_user_entity_1.JammitUser, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'userId' }),
    __metadata("design:type", typeof (_c = typeof jammit_user_entity_1.JammitUser !== "undefined" && jammit_user_entity_1.JammitUser) === "function" ? _c : Object)
], Like.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => video_entity_1.Video, (video) => video.like, { onDelete: 'CASCADE' }),
    __metadata("design:type", typeof (_d = typeof video_entity_1.Video !== "undefined" && video_entity_1.Video) === "function" ? _d : Object)
], Like.prototype, "video", void 0);
exports.Like = Like = __decorate([
    (0, typeorm_1.Entity)({ name: 'like' }),
    (0, typeorm_1.Unique)(['user', 'video'])
], Like);


/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Gathering = void 0;
const typeorm_1 = __webpack_require__(15);
const jammit_enums_1 = __webpack_require__(17);
const gathering_genre_entity_1 = __webpack_require__(23);
const gathering_participant_entity_1 = __webpack_require__(24);
const gathering_session_entity_1 = __webpack_require__(25);
const jammit_user_entity_1 = __webpack_require__(16);
const review_entity_1 = __webpack_require__(26);
let Gathering = class Gathering {
};
exports.Gathering = Gathering;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Gathering.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gathering_name', length: 30 }),
    __metadata("design:type", String)
], Gathering.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gathering_place' }),
    __metadata("design:type", String)
], Gathering.prototype, "place", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gathering_description', length: 1000 }),
    __metadata("design:type", String)
], Gathering.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gathering_thumbnail', nullable: true }),
    __metadata("design:type", String)
], Gathering.prototype, "thumbnail", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gathering_view_count', default: 0 }),
    __metadata("design:type", Number)
], Gathering.prototype, "viewCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'gathering_datetime', type: 'timestamp' }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Gathering.prototype, "gatheringDateTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recruit_deadline', type: 'timestamp' }),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Gathering.prototype, "recruitDeadline", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: jammit_enums_1.GatheringStatus.RECRUITING,
    }),
    __metadata("design:type", typeof (_c = typeof jammit_enums_1.GatheringStatus !== "undefined" && jammit_enums_1.GatheringStatus) === "function" ? _c : Object)
], Gathering.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Gathering.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], Gathering.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => jammit_user_entity_1.JammitUser, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", typeof (_f = typeof jammit_user_entity_1.JammitUser !== "undefined" && jammit_user_entity_1.JammitUser) === "function" ? _f : Object)
], Gathering.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => jammit_user_entity_1.JammitUser, { nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'updated_by' }),
    __metadata("design:type", typeof (_g = typeof jammit_user_entity_1.JammitUser !== "undefined" && jammit_user_entity_1.JammitUser) === "function" ? _g : Object)
], Gathering.prototype, "updatedBy", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => gathering_genre_entity_1.GatheringGenre, (gg) => gg.gathering, { cascade: true }),
    __metadata("design:type", Array)
], Gathering.prototype, "genreRows", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => gathering_session_entity_1.GatheringSession, (s) => s.gathering, { cascade: true }),
    __metadata("design:type", Array)
], Gathering.prototype, "gatheringSessions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => gathering_participant_entity_1.GatheringParticipant, (p) => p.gathering),
    __metadata("design:type", Array)
], Gathering.prototype, "participants", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => review_entity_1.Review, (r) => r.gathering),
    __metadata("design:type", Array)
], Gathering.prototype, "reviews", void 0);
exports.Gathering = Gathering = __decorate([
    (0, typeorm_1.Entity)('gathering')
], Gathering);


/***/ }),
/* 23 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GatheringGenre = void 0;
const typeorm_1 = __webpack_require__(15);
const jammit_enums_1 = __webpack_require__(17);
const gathering_entity_1 = __webpack_require__(22);
let GatheringGenre = class GatheringGenre {
};
exports.GatheringGenre = GatheringGenre;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'gathering_id' }),
    __metadata("design:type", Number)
], GatheringGenre.prototype, "gatheringId", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'genre_name', type: 'varchar', length: 40 }),
    __metadata("design:type", typeof (_a = typeof jammit_enums_1.Genre !== "undefined" && jammit_enums_1.Genre) === "function" ? _a : Object)
], GatheringGenre.prototype, "genreName", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => gathering_entity_1.Gathering, (g) => g.genreRows, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'gathering_id' }),
    __metadata("design:type", typeof (_b = typeof gathering_entity_1.Gathering !== "undefined" && gathering_entity_1.Gathering) === "function" ? _b : Object)
], GatheringGenre.prototype, "gathering", void 0);
exports.GatheringGenre = GatheringGenre = __decorate([
    (0, typeorm_1.Entity)('gathering_genres')
], GatheringGenre);


/***/ }),
/* 24 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GatheringParticipant = void 0;
const typeorm_1 = __webpack_require__(15);
const jammit_enums_1 = __webpack_require__(17);
const gathering_entity_1 = __webpack_require__(22);
const jammit_user_entity_1 = __webpack_require__(16);
let GatheringParticipant = class GatheringParticipant {
};
exports.GatheringParticipant = GatheringParticipant;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GatheringParticipant.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => jammit_user_entity_1.JammitUser, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", typeof (_a = typeof jammit_user_entity_1.JammitUser !== "undefined" && jammit_user_entity_1.JammitUser) === "function" ? _a : Object)
], GatheringParticipant.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => gathering_entity_1.Gathering, (g) => g.participants, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'gathering_id' }),
    __metadata("design:type", typeof (_b = typeof gathering_entity_1.Gathering !== "undefined" && gathering_entity_1.Gathering) === "function" ? _b : Object)
], GatheringParticipant.prototype, "gathering", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'band_session_name', type: 'varchar', length: 40 }),
    __metadata("design:type", typeof (_c = typeof jammit_enums_1.BandSession !== "undefined" && jammit_enums_1.BandSession) === "function" ? _c : Object)
], GatheringParticipant.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'varchar',
        length: 20,
        default: jammit_enums_1.ParticipantStatus.PENDING,
    }),
    __metadata("design:type", typeof (_d = typeof jammit_enums_1.ParticipantStatus !== "undefined" && jammit_enums_1.ParticipantStatus) === "function" ? _d : Object)
], GatheringParticipant.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500, nullable: true }),
    __metadata("design:type", String)
], GatheringParticipant.prototype, "introduction", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], GatheringParticipant.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", typeof (_f = typeof Date !== "undefined" && Date) === "function" ? _f : Object)
], GatheringParticipant.prototype, "updatedAt", void 0);
exports.GatheringParticipant = GatheringParticipant = __decorate([
    (0, typeorm_1.Entity)('gathering_participant')
], GatheringParticipant);


/***/ }),
/* 25 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GatheringSession = void 0;
const typeorm_1 = __webpack_require__(15);
const jammit_enums_1 = __webpack_require__(17);
const gathering_entity_1 = __webpack_require__(22);
let GatheringSession = class GatheringSession {
};
exports.GatheringSession = GatheringSession;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], GatheringSession.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => gathering_entity_1.Gathering, (g) => g.gatheringSessions, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'gathering_id' }),
    __metadata("design:type", typeof (_a = typeof gathering_entity_1.Gathering !== "undefined" && gathering_entity_1.Gathering) === "function" ? _a : Object)
], GatheringSession.prototype, "gathering", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'band_session_name', type: 'varchar', length: 40 }),
    __metadata("design:type", typeof (_b = typeof jammit_enums_1.BandSession !== "undefined" && jammit_enums_1.BandSession) === "function" ? _b : Object)
], GatheringSession.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'recruit_count' }),
    __metadata("design:type", Number)
], GatheringSession.prototype, "recruitCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'current_count', default: 0 }),
    __metadata("design:type", Number)
], GatheringSession.prototype, "currentCount", void 0);
exports.GatheringSession = GatheringSession = __decorate([
    (0, typeorm_1.Entity)('gathering_session')
], GatheringSession);


/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Review = void 0;
const typeorm_1 = __webpack_require__(15);
const gathering_entity_1 = __webpack_require__(22);
const jammit_user_entity_1 = __webpack_require__(16);
let Review = class Review {
};
exports.Review = Review;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Review.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Review.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_practice_helped', default: false }),
    __metadata("design:type", Boolean)
], Review.prototype, "isPracticeHelped", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_good_with_music', default: false }),
    __metadata("design:type", Boolean)
], Review.prototype, "isGoodWithMusic", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_good_with_others', default: false }),
    __metadata("design:type", Boolean)
], Review.prototype, "isGoodWithOthers", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_shares_practice_resources', default: false }),
    __metadata("design:type", Boolean)
], Review.prototype, "isSharesPracticeResources", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_managing_well', default: false }),
    __metadata("design:type", Boolean)
], Review.prototype, "isManagingWell", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_helpful', default: false }),
    __metadata("design:type", Boolean)
], Review.prototype, "isHelpful", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_good_learner', default: false }),
    __metadata("design:type", Boolean)
], Review.prototype, "isGoodLearner", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_keeping_promises', default: false }),
    __metadata("design:type", Boolean)
], Review.prototype, "isKeepingPromises", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => jammit_user_entity_1.JammitUser, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'reviewer_id' }),
    __metadata("design:type", typeof (_a = typeof jammit_user_entity_1.JammitUser !== "undefined" && jammit_user_entity_1.JammitUser) === "function" ? _a : Object)
], Review.prototype, "reviewer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => jammit_user_entity_1.JammitUser, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'reviewee_id' }),
    __metadata("design:type", typeof (_b = typeof jammit_user_entity_1.JammitUser !== "undefined" && jammit_user_entity_1.JammitUser) === "function" ? _b : Object)
], Review.prototype, "reviewee", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => gathering_entity_1.Gathering, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'gathering_id' }),
    __metadata("design:type", typeof (_c = typeof gathering_entity_1.Gathering !== "undefined" && gathering_entity_1.Gathering) === "function" ? _c : Object)
], Review.prototype, "gathering", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", typeof (_d = typeof Date !== "undefined" && Date) === "function" ? _d : Object)
], Review.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", typeof (_e = typeof Date !== "undefined" && Date) === "function" ? _e : Object)
], Review.prototype, "updatedAt", void 0);
exports.Review = Review = __decorate([
    (0, typeorm_1.Entity)('review')
], Review);


/***/ }),
/* 27 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JammitAuthModule = void 0;
const axios_1 = __webpack_require__(28);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(29);
const jwt_1 = __webpack_require__(30);
const redis_module_1 = __webpack_require__(31);
const jammit_persistence_module_1 = __webpack_require__(11);
const jammit_auth_controller_1 = __webpack_require__(34);
const jammit_auth_service_1 = __webpack_require__(41);
const jammit_email_code_service_1 = __webpack_require__(38);
const jammit_jwt_service_1 = __webpack_require__(43);
const jammit_mail_service_1 = __webpack_require__(39);
const auth_verification_service_1 = __webpack_require__(46);
let JammitAuthModule = class JammitAuthModule {
};
exports.JammitAuthModule = JammitAuthModule;
exports.JammitAuthModule = JammitAuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jammit_persistence_module_1.JammitPersistenceModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    secret: config.get('JWT_SECRET_KEY') ?? 'dev-secret-change-me',
                }),
            }),
            redis_module_1.RedisModule,
            axios_1.HttpModule,
        ],
        controllers: [jammit_auth_controller_1.JammitAuthController],
        providers: [
            jammit_jwt_service_1.JammitJwtService,
            jammit_auth_service_1.JammitAuthService,
            jammit_email_code_service_1.JammitEmailCodeService,
            jammit_mail_service_1.JammitMailService,
            auth_verification_service_1.AuthVerificationService,
        ],
        exports: [jammit_jwt_service_1.JammitJwtService, auth_verification_service_1.AuthVerificationService],
    })
], JammitAuthModule);


/***/ }),
/* 28 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/axios");

/***/ }),
/* 29 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/config");

/***/ }),
/* 30 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/jwt");

/***/ }),
/* 31 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RedisModule = void 0;
const common_1 = __webpack_require__(4);
const redis_service_1 = __webpack_require__(32);
let RedisModule = class RedisModule {
};
exports.RedisModule = RedisModule;
exports.RedisModule = RedisModule = __decorate([
    (0, common_1.Module)({
        providers: [redis_service_1.RedisService],
        exports: [redis_service_1.RedisService],
    })
], RedisModule);


/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var RedisService_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RedisService = void 0;
const common_1 = __webpack_require__(4);
const redis_1 = __webpack_require__(33);
let RedisService = RedisService_1 = class RedisService {
    constructor() {
        this.log = new common_1.Logger(RedisService_1.name);
        this.client = null;
        this.isConnected = false;
        const url = this.resolveRedisUrl();
        if (!url) {
            this.log.warn('Redis 미사용 — 이메일 코드는 프로세스 메모리, 조회수 중복 방지는 비활성');
            return;
        }
        this.client = (0, redis_1.createClient)({ url });
        this.client.on('error', (err) => {
            this.log.error(`Redis 연결 오류: ${err}`);
            this.isConnected = false;
        });
        this.client.on('connect', () => {
            this.log.log('Redis 연결 성공');
            this.isConnected = true;
        });
        void this.initialize();
    }
    resolveRedisUrl() {
        if (process.env.REDIS_DISABLED === 'true') {
            return null;
        }
        const single = process.env.REDIS_URL?.trim();
        if (single) {
            return single;
        }
        const host = process.env.REDIS_HOST?.trim();
        if (!host) {
            return null;
        }
        const port = process.env.REDIS_PORT?.trim() || '6379';
        const password = process.env.REDIS_PASSWORD;
        if (password) {
            const user = process.env.REDIS_USER?.trim() || 'default';
            return `redis://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}`;
        }
        return `redis://${host}:${port}`;
    }
    async initialize() {
        if (!this.client)
            return;
        try {
            await this.client.connect();
        }
        catch (error) {
            this.log.error('Redis 초기화 실패', error instanceof Error ? error.stack : error);
            this.isConnected = false;
        }
    }
    async saveCount(key, value) {
        if (!this.client || !this.isConnected) {
            return;
        }
        try {
            await this.client.set(key, value, { EX: 60 * 60 * 24 });
        }
        catch (error) {
            this.log.error('Redis 저장 실패', error);
        }
    }
    async existsCount(key) {
        if (!this.client || !this.isConnected) {
            return false;
        }
        try {
            const result = await this.client.exists(key);
            return result === 1;
        }
        catch (error) {
            this.log.error('Redis 조회 실패', error);
            return false;
        }
    }
    async setEx(key, value, ttlSeconds) {
        if (!this.client || !this.isConnected)
            return;
        try {
            await this.client.set(key, value, { EX: ttlSeconds });
        }
        catch (e) {
            this.log.error('Redis setEx 실패', e);
        }
    }
    async get(key) {
        if (!this.client || !this.isConnected)
            return null;
        try {
            return await this.client.get(key);
        }
        catch (e) {
            this.log.error('Redis get 실패', e);
            return null;
        }
    }
    async del(key) {
        if (!this.client || !this.isConnected)
            return;
        try {
            await this.client.del(key);
        }
        catch (e) {
            this.log.error('Redis del 실패', e);
        }
    }
};
exports.RedisService = RedisService;
exports.RedisService = RedisService = RedisService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], RedisService);


/***/ }),
/* 33 */
/***/ ((module) => {

"use strict";
module.exports = require("redis");

/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JammitAuthController = void 0;
const common_1 = __webpack_require__(4);
const swagger_1 = __webpack_require__(6);
const express_1 = __webpack_require__(35);
const api_response_dto_1 = __webpack_require__(36);
const jammit_email_code_service_1 = __webpack_require__(38);
const jammit_mail_service_1 = __webpack_require__(39);
const jammit_auth_service_1 = __webpack_require__(41);
const auth_api_dto_1 = __webpack_require__(44);
let JammitAuthController = class JammitAuthController {
    constructor(auth, emailCode, mail) {
        this.auth = auth;
        this.emailCode = emailCode;
        this.mail = mail;
    }
    async login(body) {
        const res = await this.auth.login(body.email, body.password);
        return api_response_dto_1.CommonResponseDto.ok(res);
    }
    async refresh(body) {
        const res = this.auth.refresh(body.refreshToken);
        return api_response_dto_1.CommonResponseDto.ok(res);
    }
    async sendCode(body) {
        const code = String(Math.floor(Math.random() * 900_000) + 100_000);
        await this.emailCode.saveCode(body.email, code, 180);
        await this.mail.sendHtml(body.email, '[JAMMIT] 이메일 인증번호 안내', `인증번호: <b>${code}</b> (3분 이내 입력)`);
        return api_response_dto_1.CommonResponseDto.ok(null);
    }
    async verifyCode(body, res) {
        const { statusCode, body: dto } = await this.emailCode.verifyCodeHttp(body.email, body.code);
        res.status(statusCode);
        return dto;
    }
};
exports.JammitAuthController = JammitAuthController;
__decorate([
    (0, common_1.Post)('login'),
    (0, swagger_1.ApiOperation)({ summary: '로그인', description: '이메일·비밀번호로 로그인, access/refresh 토큰 발급' }),
    (0, swagger_1.ApiBody)({ type: auth_api_dto_1.JammitLoginRequestDto }),
    (0, swagger_1.ApiOkResponse)({
        description: '성공 시 CommonResponseDto, result에 토큰·유저 정보',
        schema: {
            example: {
                success: true,
                code: 200,
                message: 'OK',
                result: { accessToken: '…', refreshToken: '…', user: {} },
            },
        },
    }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: '이메일 또는 비밀번호 불일치' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof auth_api_dto_1.JammitLoginRequestDto !== "undefined" && auth_api_dto_1.JammitLoginRequestDto) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], JammitAuthController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('refresh'),
    (0, swagger_1.ApiOperation)({ summary: '토큰 갱신', description: 'refresh token으로 새 access token 발급' }),
    (0, swagger_1.ApiBody)({ type: auth_api_dto_1.JammitRefreshRequestDto }),
    (0, swagger_1.ApiOkResponse)({ description: 'CommonResponseDto 래핑 결과' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: '유효하지 않은 refresh token' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof auth_api_dto_1.JammitRefreshRequestDto !== "undefined" && auth_api_dto_1.JammitRefreshRequestDto) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], JammitAuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)('email/send-code'),
    (0, swagger_1.ApiOperation)({
        summary: '이메일 인증 코드 발송',
        description: '6자리 코드를 메일로 전송 (개발/스테이징에서 로그 확인 가능할 수 있음)',
    }),
    (0, swagger_1.ApiBody)({ type: auth_api_dto_1.JammitEmailRequestDto }),
    (0, swagger_1.ApiOkResponse)({ description: '발송 완료 (CommonResponseDto)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof auth_api_dto_1.JammitEmailRequestDto !== "undefined" && auth_api_dto_1.JammitEmailRequestDto) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], JammitAuthController.prototype, "sendCode", null);
__decorate([
    (0, common_1.Post)('email/verify-code'),
    (0, swagger_1.ApiOperation)({ summary: '이메일 인증 코드 검증', description: '코드 일치 시 200, 실패 시 401 등' }),
    (0, swagger_1.ApiBody)({ type: auth_api_dto_1.JammitVerifyCodeRequestDto }),
    (0, swagger_1.ApiOkResponse)({ description: '검증 성공 (HTTP status는 응답 본문과 함께 설정됨)' }),
    (0, swagger_1.ApiUnauthorizedResponse)({ description: '코드 불일치 또는 만료' }),
    (0, swagger_1.ApiBadRequestResponse)({ description: '잘못된 요청' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof auth_api_dto_1.JammitVerifyCodeRequestDto !== "undefined" && auth_api_dto_1.JammitVerifyCodeRequestDto) === "function" ? _g : Object, typeof (_h = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], JammitAuthController.prototype, "verifyCode", null);
exports.JammitAuthController = JammitAuthController = __decorate([
    (0, swagger_1.ApiTags)('Jammit Auth'),
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [typeof (_a = typeof jammit_auth_service_1.JammitAuthService !== "undefined" && jammit_auth_service_1.JammitAuthService) === "function" ? _a : Object, typeof (_b = typeof jammit_email_code_service_1.JammitEmailCodeService !== "undefined" && jammit_email_code_service_1.JammitEmailCodeService) === "function" ? _b : Object, typeof (_c = typeof jammit_mail_service_1.JammitMailService !== "undefined" && jammit_mail_service_1.JammitMailService) === "function" ? _c : Object])
], JammitAuthController);


/***/ }),
/* 35 */
/***/ ((module) => {

"use strict";
module.exports = require("express");

/***/ }),
/* 36 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ApiResponseDto = exports.CommonResponseDto = void 0;
const swagger_1 = __webpack_require__(6);
const api_constants_1 = __webpack_require__(37);
class CommonResponseDto {
    static ok(result) {
        return {
            success: true,
            code: api_constants_1.SUCCESS_CODE,
            message: api_constants_1.SUCCESS_MESSAGE,
            result: result ?? null,
        };
    }
    static fail(code, message, result) {
        return {
            success: false,
            code,
            message,
            result: result ?? null,
        };
    }
}
exports.CommonResponseDto = CommonResponseDto;
exports.ApiResponseDto = CommonResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], CommonResponseDto.prototype, "success", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], CommonResponseDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CommonResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, nullable: true }),
    __metadata("design:type", Object)
], CommonResponseDto.prototype, "result", void 0);


/***/ }),
/* 37 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SUCCESS_MESSAGE = exports.UNAUTHORIZED_CODE = exports.CLIENT_FAIL_CODE = exports.SERVER_FAIL_CODE = exports.SUCCESS_CODE = void 0;
exports.SUCCESS_CODE = 200;
exports.SERVER_FAIL_CODE = 500;
exports.CLIENT_FAIL_CODE = 400;
exports.UNAUTHORIZED_CODE = 401;
exports.SUCCESS_MESSAGE = '성공';


/***/ }),
/* 38 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JammitEmailCodeService = exports.AuthCodeVerifyResult = void 0;
exports.authCodeMessage = authCodeMessage;
const api_response_dto_1 = __webpack_require__(36);
const common_1 = __webpack_require__(4);
const redis_service_1 = __webpack_require__(32);
var AuthCodeVerifyResult;
(function (AuthCodeVerifyResult) {
    AuthCodeVerifyResult["SUCCESS"] = "SUCCESS";
    AuthCodeVerifyResult["EXPIRED"] = "EXPIRED";
    AuthCodeVerifyResult["INVALID"] = "INVALID";
    AuthCodeVerifyResult["NOT_FOUND"] = "NOT_FOUND";
})(AuthCodeVerifyResult || (exports.AuthCodeVerifyResult = AuthCodeVerifyResult = {}));
function authCodeMessage(r) {
    switch (r) {
        case AuthCodeVerifyResult.SUCCESS:
            return '인증이 성공했습니다.';
        case AuthCodeVerifyResult.EXPIRED:
            return '인증번호가 만료되었습니다.';
        case AuthCodeVerifyResult.INVALID:
            return '인증번호가 일치하지 않습니다.';
        case AuthCodeVerifyResult.NOT_FOUND:
            return '해당 이메일에 인증 요청이 없습니다.';
    }
}
let JammitEmailCodeService = class JammitEmailCodeService {
    constructor(redis) {
        this.redis = redis;
        this.mem = new Map();
        this.prefix = 'jammit:email:auth:';
    }
    async saveCode(email, code, expireSeconds) {
        const key = this.prefix + email;
        await this.redis.setEx(key, code, expireSeconds);
        this.mem.set(email, {
            code,
            expireAt: Date.now() + expireSeconds * 1000,
        });
    }
    async verifyCode(email, code) {
        const key = this.prefix + email;
        const fromRedis = await this.redis.get(key);
        if (fromRedis != null) {
            if (fromRedis === code) {
                await this.redis.del(key);
                this.mem.delete(email);
                return AuthCodeVerifyResult.SUCCESS;
            }
            return AuthCodeVerifyResult.INVALID;
        }
        const info = this.mem.get(email);
        if (!info)
            return AuthCodeVerifyResult.NOT_FOUND;
        if (Date.now() > info.expireAt) {
            this.mem.delete(email);
            return AuthCodeVerifyResult.EXPIRED;
        }
        if (info.code === code) {
            this.mem.delete(email);
            return AuthCodeVerifyResult.SUCCESS;
        }
        return AuthCodeVerifyResult.INVALID;
    }
    async verifyCodeHttp(email, code) {
        const result = await this.verifyCode(email, code);
        const message = authCodeMessage(result);
        const payload = {
            success: result === AuthCodeVerifyResult.SUCCESS,
            message,
        };
        switch (result) {
            case AuthCodeVerifyResult.SUCCESS:
                return { statusCode: 200, body: api_response_dto_1.CommonResponseDto.ok(payload) };
            case AuthCodeVerifyResult.EXPIRED:
                return {
                    statusCode: 440,
                    body: api_response_dto_1.CommonResponseDto.fail(440, message, payload),
                };
            case AuthCodeVerifyResult.INVALID:
                return {
                    statusCode: 401,
                    body: api_response_dto_1.CommonResponseDto.fail(401, message, payload),
                };
            case AuthCodeVerifyResult.NOT_FOUND:
            default:
                return {
                    statusCode: 404,
                    body: api_response_dto_1.CommonResponseDto.fail(404, message, payload),
                };
        }
    }
};
exports.JammitEmailCodeService = JammitEmailCodeService;
exports.JammitEmailCodeService = JammitEmailCodeService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _a : Object])
], JammitEmailCodeService);


/***/ }),
/* 39 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var JammitMailService_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JammitMailService = void 0;
const axios_1 = __webpack_require__(28);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(29);
const rxjs_1 = __webpack_require__(40);
let JammitMailService = JammitMailService_1 = class JammitMailService {
    constructor(http, config) {
        this.http = http;
        this.config = config;
        this.log = new common_1.Logger(JammitMailService_1.name);
    }
    async sendHtml(to, subject, html) {
        const apiKey = this.config.get('RESEND_API_KEY');
        const from = this.config.get('RESEND_FROM_EMAIL') ?? 'noreply@jammit.com';
        if (!apiKey) {
            this.log.warn(`[이메일 스킵·RESEND_API_KEY 없음] to=${to} subject=${subject}`);
            return;
        }
        await (0, rxjs_1.firstValueFrom)(this.http.post('https://api.resend.com/emails', { from, to: [to], subject, html }, { headers: { Authorization: `Bearer ${apiKey}` } }));
    }
};
exports.JammitMailService = JammitMailService;
exports.JammitMailService = JammitMailService = JammitMailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], JammitMailService);


/***/ }),
/* 40 */
/***/ ((module) => {

"use strict";
module.exports = require("rxjs");

/***/ }),
/* 41 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JammitAuthService = void 0;
const entities_1 = __webpack_require__(13);
const jammit_enums_1 = __webpack_require__(17);
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(12);
const bcrypt = __importStar(__webpack_require__(42));
const typeorm_2 = __webpack_require__(15);
const jammit_jwt_service_1 = __webpack_require__(43);
let JammitAuthService = class JammitAuthService {
    constructor(userRepo, gatheringRepo, jammitJwt) {
        this.userRepo = userRepo;
        this.gatheringRepo = gatheringRepo;
        this.jammitJwt = jammitJwt;
    }
    async login(email, password) {
        const user = await this.userRepo.findOne({
            where: { email, oauthPlatform: jammit_enums_1.OauthPlatform.NONE },
            relations: ['preferredGenres', 'userBandSessions'],
        });
        if (!user) {
            throw new common_1.BadRequestException('가입되지 않은 이메일입니다.');
        }
        const ok = await bcrypt.compare(password, user.password);
        if (!ok)
            throw new common_1.BadRequestException('비밀번호가 일치하지 않습니다.');
        const totalCreatedGatheringCount = await this.gatheringRepo.count({
            where: { createdBy: { id: user.id } },
        });
        const completedGatheringCount = await this.gatheringRepo.count({
            where: { createdBy: { id: user.id }, status: jammit_enums_1.GatheringStatus.COMPLETED },
        });
        const exp = this.jammitJwt.getAccessTokenExpiredAt();
        return {
            user: this.toUserResponse(user, totalCreatedGatheringCount, completedGatheringCount),
            accessToken: this.jammitJwt.createAccessToken(email),
            refreshToken: this.jammitJwt.createRefreshToken(email),
            expiredAt: exp.toISOString().slice(0, 19),
        };
    }
    refresh(refreshToken) {
        const accessToken = this.jammitJwt.refreshAccessToken(refreshToken);
        const exp = this.jammitJwt.getAccessTokenExpiredAt();
        return {
            accessToken,
            refreshToken,
            expiredAt: exp.toISOString().slice(0, 19),
        };
    }
    toUserResponse(user, totalCreatedGatheringCount, completedGatheringCount) {
        const preferredGenres = (user.preferredGenres ?? [])
            .sort((a, b) => a.priority - b.priority)
            .map((g) => g.name);
        const preferredBandSessions = (user.userBandSessions ?? [])
            .sort((a, b) => a.priority - b.priority)
            .map((s) => s.name);
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            nickname: user.nickname,
            profileImagePath: user.profileImagePath,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            preferredGenres,
            preferredBandSessions,
            totalCreatedGatheringCount,
            completedGatheringCount,
        };
    }
};
exports.JammitAuthService = JammitAuthService;
exports.JammitAuthService = JammitAuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.JammitUser)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Gathering)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof jammit_jwt_service_1.JammitJwtService !== "undefined" && jammit_jwt_service_1.JammitJwtService) === "function" ? _c : Object])
], JammitAuthService);


/***/ }),
/* 42 */
/***/ ((module) => {

"use strict";
module.exports = require("bcrypt");

/***/ }),
/* 43 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JammitJwtService = void 0;
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(29);
const jwt_1 = __webpack_require__(30);
let JammitJwtService = class JammitJwtService {
    constructor(jwt, config) {
        this.jwt = jwt;
        this.config = config;
    }
    get secret() {
        const s = this.config.get('JWT_SECRET_KEY');
        if (!s)
            throw new Error('JWT_SECRET_KEY is required');
        return s;
    }
    get accessMs() {
        return Number(this.config.get('JWT_EXPIRED_ACCESS_MS') ?? 86400000);
    }
    get refreshMs() {
        return Number(this.config.get('JWT_EXPIRED_REFRESH_MS') ?? 86400000);
    }
    createAccessToken(loginId) {
        return this.jwt.sign({ loginId, type: 'access' }, {
            secret: this.secret,
            expiresIn: Math.floor(this.accessMs / 1000),
        });
    }
    createRefreshToken(loginId) {
        return this.jwt.sign({ loginId, type: 'refresh' }, {
            secret: this.secret,
            expiresIn: Math.floor(this.refreshMs / 1000),
        });
    }
    getAccessTokenExpiredAt() {
        return new Date(Date.now() + this.accessMs);
    }
    verifyAccessToken(token) {
        let payload;
        try {
            payload = this.jwt.verify(token, {
                secret: this.secret,
            });
        }
        catch {
            throw new common_1.UnauthorizedException('토큰이 만료되었습니다.');
        }
        if (payload.type !== 'access') {
            throw new common_1.UnauthorizedException('유효하지 않은 토큰입니다.');
        }
        return payload;
    }
    refreshAccessToken(refreshToken) {
        let payload;
        try {
            payload = this.jwt.verify(refreshToken, {
                secret: this.secret,
            });
        }
        catch {
            throw new common_1.UnauthorizedException('만료된 토큰 값입니다.');
        }
        if (payload.type !== 'refresh') {
            throw new common_1.UnauthorizedException('토큰값이 다릅니다.');
        }
        return this.createAccessToken(payload.loginId);
    }
};
exports.JammitJwtService = JammitJwtService;
exports.JammitJwtService = JammitJwtService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof jwt_1.JwtService !== "undefined" && jwt_1.JwtService) === "function" ? _a : Object, typeof (_b = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _b : Object])
], JammitJwtService);


/***/ }),
/* 44 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JammitVerifyCodeRequestDto = exports.JammitEmailRequestDto = exports.JammitRefreshRequestDto = exports.JammitLoginRequestDto = void 0;
const swagger_1 = __webpack_require__(6);
const class_validator_1 = __webpack_require__(45);
class JammitLoginRequestDto {
}
exports.JammitLoginRequestDto = JammitLoginRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user@example.com', description: '로그인 이메일' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], JammitLoginRequestDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'password123', description: '비밀번호' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], JammitLoginRequestDto.prototype, "password", void 0);
class JammitRefreshRequestDto {
}
exports.JammitRefreshRequestDto = JammitRefreshRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: '발급받은 JWT refresh token' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(1),
    __metadata("design:type", String)
], JammitRefreshRequestDto.prototype, "refreshToken", void 0);
class JammitEmailRequestDto {
}
exports.JammitEmailRequestDto = JammitEmailRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user@example.com', description: '인증 코드를 받을 이메일' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], JammitEmailRequestDto.prototype, "email", void 0);
class JammitVerifyCodeRequestDto {
}
exports.JammitVerifyCodeRequestDto = JammitVerifyCodeRequestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user@example.com' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], JammitVerifyCodeRequestDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '123456', description: '이메일로 받은 6자리 코드' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(4),
    __metadata("design:type", String)
], JammitVerifyCodeRequestDto.prototype, "code", void 0);


/***/ }),
/* 45 */
/***/ ((module) => {

"use strict";
module.exports = require("class-validator");

/***/ }),
/* 46 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthVerificationService = void 0;
const entities_1 = __webpack_require__(13);
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(12);
const typeorm_2 = __webpack_require__(15);
const jammit_jwt_service_1 = __webpack_require__(43);
let AuthVerificationService = class AuthVerificationService {
    constructor(jammitJwt, jammitUserRepo) {
        this.jammitJwt = jammitJwt;
        this.jammitUserRepo = jammitUserRepo;
    }
    async verifyTokenAndGetUser(token) {
        const { loginId } = this.jammitJwt.verifyAccessToken(token);
        const user = await this.jammitUserRepo.findOne({
            where: { email: loginId },
            relations: ['preferredGenres', 'userBandSessions'],
        });
        if (!user)
            throw new common_1.UnauthorizedException('인증되지 않은 사용자');
        const profile = {
            id: user.id,
            email: user.email,
            username: user.username,
            nickname: user.nickname,
            profileImagePath: user.profileImagePath ?? '',
        };
        return { profile, jammitUser: user };
    }
};
exports.AuthVerificationService = AuthVerificationService;
exports.AuthVerificationService = AuthVerificationService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.JammitUser)),
    __metadata("design:paramtypes", [typeof (_a = typeof jammit_jwt_service_1.JammitJwtService !== "undefined" && jammit_jwt_service_1.JammitJwtService) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object])
], AuthVerificationService);


/***/ }),
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JammitGatheringsModule = void 0;
const common_1 = __webpack_require__(4);
const jammit_persistence_module_1 = __webpack_require__(11);
const jammit_participation_controller_1 = __webpack_require__(48);
const jammit_participation_service_1 = __webpack_require__(52);
const gathering_scheduler_1 = __webpack_require__(54);
const jammit_gathering_controller_1 = __webpack_require__(56);
const jammit_gathering_service_1 = __webpack_require__(53);
let JammitGatheringsModule = class JammitGatheringsModule {
};
exports.JammitGatheringsModule = JammitGatheringsModule;
exports.JammitGatheringsModule = JammitGatheringsModule = __decorate([
    (0, common_1.Module)({
        imports: [jammit_persistence_module_1.JammitPersistenceModule],
        controllers: [jammit_gathering_controller_1.JammitGatheringController, jammit_participation_controller_1.JammitParticipationController],
        providers: [
            jammit_gathering_service_1.JammitGatheringService,
            jammit_participation_service_1.JammitParticipationService,
            gathering_scheduler_1.GatheringScheduler,
        ],
        exports: [jammit_gathering_service_1.JammitGatheringService],
    })
], JammitGatheringsModule);


/***/ }),
/* 48 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JammitParticipationController = void 0;
const current_jammit_user_decorator_1 = __webpack_require__(49);
const api_response_dto_1 = __webpack_require__(36);
const auth_guard_1 = __webpack_require__(50);
const entities_1 = __webpack_require__(13);
const common_1 = __webpack_require__(4);
const swagger_1 = __webpack_require__(6);
const jammit_participation_service_1 = __webpack_require__(52);
let JammitParticipationController = class JammitParticipationController {
    constructor(svc) {
        this.svc = svc;
    }
    async participate(gatheringId, user, body) {
        const res = await this.svc.participate(gatheringId, user, body.bandSession, body.introduction);
        return api_response_dto_1.CommonResponseDto.ok(res);
    }
    async cancel(gatheringId, participantId, user) {
        const res = await this.svc.cancelParticipation(gatheringId, participantId, user);
        return api_response_dto_1.CommonResponseDto.ok(res);
    }
    async approve(gatheringId, participantId, user) {
        const res = await this.svc.approveParticipation(gatheringId, participantId, user);
        return api_response_dto_1.CommonResponseDto.ok(res);
    }
    async reject(gatheringId, participantId, user) {
        const res = await this.svc.rejectParticipation(gatheringId, participantId, user);
        return api_response_dto_1.CommonResponseDto.ok(res);
    }
    async list(gatheringId) {
        const res = await this.svc.findParticipants(gatheringId);
        return api_response_dto_1.CommonResponseDto.ok(res);
    }
    async myCompleted(user) {
        const res = await this.svc.getMyCompletedGatherings(user);
        return api_response_dto_1.CommonResponseDto.ok(res);
    }
    async my(user, includeCanceled, page, size) {
        const res = await this.svc.getMyParticipations(user, page, size, includeCanceled);
        return api_response_dto_1.CommonResponseDto.ok(res);
    }
};
exports.JammitParticipationController = JammitParticipationController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: '모임 참가 신청' }),
    (0, swagger_1.ApiParam)({ name: 'gatheringId', type: Number }),
    (0, swagger_1.ApiBody)({
        schema: {
            example: {
                bandSession: 'VOCAL',
                introduction: '안녕하세요, 보컬 지원합니다.',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'CommonResponseDto' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '미인증' }),
    __param(0, (0, common_1.Param)('gatheringId', common_1.ParseIntPipe)),
    __param(1, (0, current_jammit_user_decorator_1.CurrentJammitUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeof (_b = typeof entities_1.JammitUser !== "undefined" && entities_1.JammitUser) === "function" ? _b : Object, Object]),
    __metadata("design:returntype", Promise)
], JammitParticipationController.prototype, "participate", null);
__decorate([
    (0, common_1.Put)(':participantId/cancel'),
    (0, swagger_1.ApiOperation)({ summary: '참가 신청 취소', description: '본인 신청만' }),
    (0, swagger_1.ApiParam)({ name: 'gatheringId', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'participantId', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CommonResponseDto' }),
    __param(0, (0, common_1.Param)('gatheringId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('participantId', common_1.ParseIntPipe)),
    __param(2, (0, current_jammit_user_decorator_1.CurrentJammitUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, typeof (_c = typeof entities_1.JammitUser !== "undefined" && entities_1.JammitUser) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], JammitParticipationController.prototype, "cancel", null);
__decorate([
    (0, common_1.Post)(':participantId/approve'),
    (0, swagger_1.ApiOperation)({ summary: '참가 승인', description: '모임 개설자' }),
    (0, swagger_1.ApiParam)({ name: 'gatheringId', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'participantId', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CommonResponseDto' }),
    __param(0, (0, common_1.Param)('gatheringId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('participantId', common_1.ParseIntPipe)),
    __param(2, (0, current_jammit_user_decorator_1.CurrentJammitUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, typeof (_d = typeof entities_1.JammitUser !== "undefined" && entities_1.JammitUser) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], JammitParticipationController.prototype, "approve", null);
__decorate([
    (0, common_1.Put)(':participantId/reject'),
    (0, swagger_1.ApiOperation)({ summary: '참가 거절', description: '모임 개설자' }),
    (0, swagger_1.ApiParam)({ name: 'gatheringId', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'participantId', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CommonResponseDto' }),
    __param(0, (0, common_1.Param)('gatheringId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('participantId', common_1.ParseIntPipe)),
    __param(2, (0, current_jammit_user_decorator_1.CurrentJammitUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, typeof (_e = typeof entities_1.JammitUser !== "undefined" && entities_1.JammitUser) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], JammitParticipationController.prototype, "reject", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: '모임별 참가자 목록', description: '공개 조회' }),
    (0, swagger_1.ApiParam)({ name: 'gatheringId', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CommonResponseDto' }),
    __param(0, (0, common_1.Param)('gatheringId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], JammitParticipationController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('my/completed'),
    (0, swagger_1.ApiOperation)({
        summary: '내가 완료한 모임 목록',
        description: '경로에 gatheringId가 있으나 서비스는 로그인 유저 기준 전체 완료 목록을 반환합니다.',
    }),
    (0, swagger_1.ApiParam)({ name: 'gatheringId', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CommonResponseDto' }),
    __param(0, (0, current_jammit_user_decorator_1.CurrentJammitUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof entities_1.JammitUser !== "undefined" && entities_1.JammitUser) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], JammitParticipationController.prototype, "myCompleted", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, swagger_1.ApiOperation)({ summary: '내 참가 신청·참여 목록' }),
    (0, swagger_1.ApiParam)({ name: 'gatheringId', type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'includeCanceled', required: false, example: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 0 }),
    (0, swagger_1.ApiQuery)({ name: 'size', required: false, example: 10 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CommonResponseDto' }),
    __param(0, (0, current_jammit_user_decorator_1.CurrentJammitUser)()),
    __param(1, (0, common_1.Query)('includeCanceled', new common_1.DefaultValuePipe(false), common_1.ParseBoolPipe)),
    __param(2, (0, common_1.Query)('page', new common_1.DefaultValuePipe(0), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('size', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof entities_1.JammitUser !== "undefined" && entities_1.JammitUser) === "function" ? _g : Object, Boolean, Number, Number]),
    __metadata("design:returntype", Promise)
], JammitParticipationController.prototype, "my", null);
exports.JammitParticipationController = JammitParticipationController = __decorate([
    (0, swagger_1.ApiTags)('Jammit Participation'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('gatherings/:gatheringId/participants'),
    __metadata("design:paramtypes", [typeof (_a = typeof jammit_participation_service_1.JammitParticipationService !== "undefined" && jammit_participation_service_1.JammitParticipationService) === "function" ? _a : Object])
], JammitParticipationController);


/***/ }),
/* 49 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CurrentJammitUser = void 0;
const common_1 = __webpack_require__(4);
exports.CurrentJammitUser = (0, common_1.createParamDecorator)((_data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    return req.jammitUser;
});


/***/ }),
/* 50 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthGuard = void 0;
const auth_verification_service_1 = __webpack_require__(46);
const bearer_token_util_1 = __webpack_require__(51);
const common_1 = __webpack_require__(4);
let AuthGuard = class AuthGuard {
    constructor(authVerifService) {
        this.authVerifService = authVerifService;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const token = (0, bearer_token_util_1.extractBearerToken)(req.headers['authorization']);
        if (!token) {
            throw new common_1.UnauthorizedException('토큰이 없습니다.');
        }
        try {
            const { profile, jammitUser } = await this.authVerifService.verifyTokenAndGetUser(token);
            req.user = profile;
            req.jammitUser = jammitUser;
            return true;
        }
        catch {
            throw new common_1.UnauthorizedException('유효하지 않은 토큰입니다.');
        }
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_verification_service_1.AuthVerificationService !== "undefined" && auth_verification_service_1.AuthVerificationService) === "function" ? _a : Object])
], AuthGuard);


/***/ }),
/* 51 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.extractBearerToken = extractBearerToken;
function extractBearerToken(authHeader) {
    if (!authHeader || Array.isArray(authHeader)) {
        return null;
    }
    const m = authHeader.match(/^Bearer\s+(.+)$/i);
    return m ? m[1].trim() : authHeader.trim() || null;
}


/***/ }),
/* 52 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JammitParticipationService = void 0;
const entities_1 = __webpack_require__(13);
const jammit_enums_1 = __webpack_require__(17);
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(12);
const typeorm_2 = __webpack_require__(15);
const jammit_gathering_service_1 = __webpack_require__(53);
let JammitParticipationService = class JammitParticipationService {
    constructor(participantRepo, gatheringService) {
        this.participantRepo = participantRepo;
        this.gatheringService = gatheringService;
    }
    async participate(gatheringId, user, bandSession, introduction) {
        const gathering = await this.gatheringService.findByIdWithSessions(gatheringId);
        if (!gathering)
            throw new common_1.BadRequestException('존재하지 않는 모임입니다.');
        if (gathering.status !== jammit_enums_1.GatheringStatus.RECRUITING) {
            return this.fail('참가 신청이 불가능한 모임 상태입니다.');
        }
        const dup = await this.participantRepo.count({
            where: {
                user: { id: user.id },
                gathering: { id: gatheringId },
                name: bandSession,
                status: (0, typeorm_2.Not)(jammit_enums_1.ParticipantStatus.CANCELED),
            },
        });
        if (dup > 0) {
            return this.fail('이미 해당 파트로 신청한 이력이 있습니다.');
        }
        const session = gathering.gatheringSessions?.find((s) => s.name === bandSession);
        if (!session)
            throw new common_1.BadRequestException('모집 중인 세션이 아닙니다.');
        const approvedCount = await this.participantRepo.count({
            where: {
                gathering: { id: gatheringId },
                name: bandSession,
                status: jammit_enums_1.ParticipantStatus.APPROVED,
            },
        });
        if (approvedCount >= session.recruitCount) {
            return this.fail('해당 세션의 모집 인원이 이미 마감되었습니다.');
        }
        const p = this.participantRepo.create({
            user,
            gathering,
            name: bandSession,
            status: jammit_enums_1.ParticipantStatus.PENDING,
            introduction: introduction ?? null,
        });
        await this.participantRepo.save(p);
        return this.waiting(gatheringId, user.id, bandSession);
    }
    async cancelParticipation(gatheringId, participantId, user) {
        const participant = await this.participantRepo.findOne({
            where: { id: participantId },
            relations: ['user', 'gathering', 'gathering.gatheringSessions'],
        });
        if (!participant)
            throw new common_1.BadRequestException('해당 참가 신청이 없습니다.');
        if (participant.user.id !== user.id) {
            throw new common_1.BadRequestException('본인의 참가 신청만 취소할 수 있습니다.');
        }
        if (participant.status === jammit_enums_1.ParticipantStatus.CANCELED) {
            return this.fail('이미 취소된 참가 신청입니다.');
        }
        if (participant.status === jammit_enums_1.ParticipantStatus.COMPLETED) {
            return this.fail('이미 참여 완료된 모임은 취소할 수 없습니다.');
        }
        const wasApproved = participant.status === jammit_enums_1.ParticipantStatus.APPROVED;
        participant.status = jammit_enums_1.ParticipantStatus.CANCELED;
        if (wasApproved) {
            const g = participant.gathering;
            const s = g.gatheringSessions?.find((x) => x.name === participant.name);
            if (s && s.currentCount > 0)
                s.currentCount -= 1;
            await this.participantRepo.manager.save(entities_1.GatheringSession, s);
        }
        await this.participantRepo.save(participant);
        return this.canceled(gatheringId, user.id, participant.name);
    }
    async approveParticipation(gatheringId, participantId, owner) {
        const gathering = await this.gatheringService.findByIdWithSessions(gatheringId);
        if (!gathering)
            throw new common_1.BadRequestException('존재하지 않은 모임입니다.');
        if (gathering.createdBy.id !== owner.id) {
            throw new common_1.BadRequestException('승인 권한이 없습니다.');
        }
        const participant = await this.participantRepo.findOne({
            where: { id: participantId },
            relations: ['user', 'gathering'],
        });
        if (!participant)
            throw new common_1.BadRequestException('해당 참가 신청이 없습니다.');
        if (participant.status === jammit_enums_1.ParticipantStatus.APPROVED) {
            return this.fail('이미 승인된 참가자 입니다.');
        }
        if (participant.status === jammit_enums_1.ParticipantStatus.CANCELED) {
            return this.fail('이미 취소된 참가자 입니다.');
        }
        if (participant.status === jammit_enums_1.ParticipantStatus.REJECTED) {
            return this.fail('이미 거절된 참가자 입니다.');
        }
        const targetSession = gathering.gatheringSessions?.find((s) => s.name === participant.name);
        if (!targetSession)
            throw new common_1.BadRequestException('밴드 세션 정보를 찾을 수 없습니다.');
        const approvedCount = await this.participantRepo.count({
            where: {
                gathering: { id: gatheringId },
                name: participant.name,
                status: jammit_enums_1.ParticipantStatus.APPROVED,
            },
        });
        if (approvedCount >= targetSession.recruitCount) {
            return this.fail('해당 세션의 모집 인원이 마감되었습니다.');
        }
        participant.status = jammit_enums_1.ParticipantStatus.APPROVED;
        targetSession.currentCount += 1;
        await this.participantRepo.manager.save(entities_1.GatheringSession, targetSession);
        await this.participantRepo.save(participant);
        const allFilled = gathering.gatheringSessions.every((s) => s.currentCount >= s.recruitCount);
        if (allFilled) {
            gathering.status = jammit_enums_1.GatheringStatus.CONFIRMED;
            await this.participantRepo.manager.save(entities_1.Gathering, gathering);
        }
        return this.approved(gatheringId, owner.id, participant.name);
    }
    async rejectParticipation(gatheringId, participantId, owner) {
        const gathering = await this.gatheringService.findByIdWithSessions(gatheringId);
        if (!gathering)
            throw new common_1.BadRequestException('존재하지 않은 모임입니다.');
        if (gathering.createdBy.id !== owner.id) {
            throw new common_1.BadRequestException('모임 주최자만 처리할 수 있습니다.');
        }
        const participant = await this.participantRepo.findOne({
            where: { id: participantId },
            relations: ['user'],
        });
        if (!participant)
            throw new common_1.BadRequestException('해당 참가 신청이 없습니다.');
        if (participant.status === jammit_enums_1.ParticipantStatus.APPROVED) {
            return this.fail('이미 승인된 신청입니다.');
        }
        if (participant.status === jammit_enums_1.ParticipantStatus.CANCELED) {
            return this.fail('이미 취소된 신청입니다.');
        }
        if (participant.status === jammit_enums_1.ParticipantStatus.REJECTED) {
            return this.fail('이미 거절된 신청입니다.');
        }
        participant.status = jammit_enums_1.ParticipantStatus.REJECTED;
        await this.participantRepo.save(participant);
        return this.rejected(gatheringId, participant.user.id, participant.name);
    }
    async findParticipants(gatheringId) {
        const list = await this.participantRepo.find({
            where: { gathering: { id: gatheringId } },
            relations: ['user'],
            order: { createdAt: 'ASC' },
        });
        if (!list.length) {
            return { participants: [], total: 0 };
        }
        return {
            participants: list.map((p) => ({
                participantId: p.id,
                userId: p.user.id,
                userEmail: p.user.email,
                userNickname: p.user.nickname,
                userProfileImagePath: p.user.profileImagePath,
                bandSession: p.name,
                status: p.status,
                createdAt: p.createdAt,
                introduction: p.introduction,
            })),
            total: list.length,
        };
    }
    async getMyParticipations(user, page, size, includeCanceled = false) {
        const qb = this.participantRepo
            .createQueryBuilder('gp')
            .leftJoinAndSelect('gp.gathering', 'g')
            .leftJoinAndSelect('g.gatheringSessions', 's')
            .leftJoinAndSelect('g.genreRows', 'gr')
            .leftJoinAndSelect('g.createdBy', 'creator')
            .where('gp.user.id = :uid', { uid: user.id });
        if (!includeCanceled) {
            qb.andWhere('gp.status != :canceled', { canceled: jammit_enums_1.ParticipantStatus.CANCELED });
        }
        qb.orderBy('gp.createdAt', 'DESC');
        const total = await qb.getCount();
        qb.skip(page * size).take(size);
        const rows = await qb.getMany();
        const gatherings = new Map();
        for (const p of rows) {
            gatherings.set(p.gathering.id, p.gathering);
        }
        const summaries = [...gatherings.values()].map((g) => this.gatheringToSummary(g));
        return {
            gatherings: summaries,
            currentPage: page,
            totalPage: Math.ceil(total / size) || 1,
            totalElements: total,
        };
    }
    async getMyCompletedGatherings(user) {
        const list = await this.participantRepo.find({
            where: {
                user: { id: user.id },
                status: jammit_enums_1.ParticipantStatus.COMPLETED,
            },
            relations: ['gathering', 'gathering.gatheringSessions', 'gathering.createdBy'],
        });
        const out = [];
        for (const p of list) {
            const g = p.gathering;
            if (g.status !== jammit_enums_1.GatheringStatus.COMPLETED)
                continue;
            const sessions = g.gatheringSessions ?? [];
            const totalRecruit = sessions.reduce((a, s) => a + s.recruitCount, 0);
            const totalCurrent = sessions.reduce((a, s) => a + s.currentCount, 0);
            out.push({
                id: g.id,
                name: g.name,
                thumbnail: g.thumbnail,
                gatheringDateTime: g.gatheringDateTime,
                place: g.place,
                totalRecruit,
                totalCurrent,
                status: g.status,
                hostNickname: g.createdBy?.nickname ?? '',
            });
        }
        return out;
    }
    async completeGathering(gatheringId, owner) {
        const gathering = await this.gatheringService.findByIdWithSessions(gatheringId);
        if (!gathering)
            throw new common_1.BadRequestException('존재하지 않은 모임입니다.');
        if (gathering.createdBy.id !== owner.id) {
            throw new common_1.BadRequestException('모임 주최자만 완료 처리할 수 있습니다.');
        }
        if (gathering.status !== jammit_enums_1.GatheringStatus.CONFIRMED) {
            throw new common_1.BadRequestException('멤버 모집이 완료된 모임만 완료 처리할 수 있습니다.');
        }
        gathering.status = jammit_enums_1.GatheringStatus.COMPLETED;
        const parts = await this.participantRepo.find({
            where: { gathering: { id: gatheringId } },
        });
        for (const p of parts) {
            if (p.status === jammit_enums_1.ParticipantStatus.APPROVED ||
                p.status === jammit_enums_1.ParticipantStatus.COMPLETED) {
                p.status = jammit_enums_1.ParticipantStatus.COMPLETED;
                await this.participantRepo.save(p);
            }
        }
        await this.participantRepo.manager.save(entities_1.Gathering, gathering);
    }
    gatheringToSummary(g) {
        const sessions = [...new Map((g.gatheringSessions ?? []).map((s) => [s.id, s])).values()];
        const genres = new Set((g.genreRows ?? []).map((r) => r.genreName));
        return {
            id: g.id,
            name: g.name,
            place: g.place,
            thumbnail: g.thumbnail,
            gatheringDateTime: g.gatheringDateTime,
            totalRecruit: sessions.reduce((a, s) => a + s.recruitCount, 0),
            totalCurrent: sessions.reduce((a, s) => a + s.currentCount, 0),
            viewCount: g.viewCount,
            recruitDeadline: g.recruitDeadline,
            status: g.status,
            genres: [...genres],
            creator: { id: g.createdBy.id, nickname: g.createdBy.nickname },
            sessions: sessions.map((s) => ({
                bandSession: s.name,
                recruitCount: s.recruitCount,
                currentCount: s.currentCount,
            })),
        };
    }
    waiting(gatheringId, userId, bandSession) {
        return {
            gatheringId,
            userId,
            bandSession,
            status: jammit_enums_1.ParticipantStatus.PENDING,
            message: '참여 신청이 완료되었습니다. 승인 대기 중입니다.',
        };
    }
    approved(gatheringId, userId, bandSession) {
        return {
            gatheringId,
            userId,
            bandSession,
            status: jammit_enums_1.ParticipantStatus.APPROVED,
            message: '참여가 승인되었습니다.',
        };
    }
    fail(message) {
        return { status: null, message };
    }
    canceled(gatheringId, userId, bandSession) {
        return {
            gatheringId,
            userId,
            bandSession,
            status: jammit_enums_1.ParticipantStatus.CANCELED,
            message: '참여가 취소되었습니다.',
        };
    }
    rejected(gatheringId, userId, bandSession) {
        return {
            gatheringId,
            userId,
            bandSession,
            status: jammit_enums_1.ParticipantStatus.REJECTED,
            message: '참여 요청이 거절되었습니다.',
        };
    }
};
exports.JammitParticipationService = JammitParticipationService;
exports.JammitParticipationService = JammitParticipationService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.GatheringParticipant)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof jammit_gathering_service_1.JammitGatheringService !== "undefined" && jammit_gathering_service_1.JammitGatheringService) === "function" ? _b : Object])
], JammitParticipationService);


/***/ }),
/* 53 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JammitGatheringService = void 0;
const entities_1 = __webpack_require__(13);
const jammit_enums_1 = __webpack_require__(17);
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(12);
const typeorm_2 = __webpack_require__(15);
function parseSort(sort) {
    const raw = sort == null
        ? ['recruitDeadline,asc']
        : Array.isArray(sort)
            ? sort
            : [sort];
    return raw.map((s) => {
        const [prop, dir] = s.split(',');
        return {
            field: prop.trim(),
            order: dir?.trim().toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
        };
    });
}
let JammitGatheringService = class JammitGatheringService {
    constructor(gatheringRepo, participantRepo) {
        this.gatheringRepo = gatheringRepo;
        this.participantRepo = participantRepo;
    }
    async findGatherings(genres, sessions, page = 0, size = 20, sort) {
        const qb = this.gatheringRepo
            .createQueryBuilder('g')
            .distinct(true)
            .leftJoinAndSelect('g.gatheringSessions', 's')
            .leftJoinAndSelect('g.genreRows', 'gr')
            .leftJoinAndSelect('g.createdBy', 'creator')
            .where('g.status = :st', { st: jammit_enums_1.GatheringStatus.RECRUITING });
        if (genres?.length) {
            qb.andWhere('gr.genreName IN (:...genres)', { genres });
        }
        if (sessions?.length) {
            qb.andWhere('s.name IN (:...sessions)', { sessions });
        }
        const orders = parseSort(sort);
        let applied = false;
        for (const o of orders) {
            if (o.field === 'viewCount') {
                qb.addOrderBy('g.viewCount', o.order);
                applied = true;
            }
            else if (o.field === 'recruitDeadline') {
                qb.addOrderBy('g.recruitDeadline', o.order);
                applied = true;
            }
        }
        if (!applied)
            qb.addOrderBy('g.recruitDeadline', 'ASC');
        const countQb = qb.clone();
        const total = await countQb.getCount();
        qb.skip(page * size).take(size);
        const list = await qb.getMany();
        return {
            gatherings: list.map((g) => this.toSummary(g)),
            currentPage: page,
            totalPage: Math.max(1, Math.ceil(total / size)),
            totalElements: total,
        };
    }
    async createGathering(user, dto) {
        if (!dto.gatheringSessions?.length) {
            throw new common_1.BadRequestException('모임에는 최소 하나의 세션이 필요합니다.');
        }
        const g = this.gatheringRepo.create({
            name: dto.name,
            thumbnail: dto.thumbnail ?? null,
            place: dto.place,
            description: dto.description,
            gatheringDateTime: new Date(dto.gatheringDateTime),
            recruitDeadline: new Date(dto.recruitDateTime),
            status: jammit_enums_1.GatheringStatus.RECRUITING,
            viewCount: 0,
            createdBy: user,
        });
        g.genreRows = [...new Set(dto.genres ?? [])].map((genreName) => {
            const row = new entities_1.GatheringGenre();
            row.genreName = genreName;
            row.gathering = g;
            return row;
        });
        g.gatheringSessions = dto.gatheringSessions.map((se) => {
            const s = new entities_1.GatheringSession();
            s.name = se.bandSession;
            s.recruitCount = se.recruitCount;
            s.currentCount = 0;
            s.gathering = g;
            return s;
        });
        const saved = await this.gatheringRepo.save(g);
        const hostSession = saved.gatheringSessions[0].name;
        const host = this.participantRepo.create({
            user,
            gathering: saved,
            name: hostSession,
            status: jammit_enums_1.ParticipantStatus.COMPLETED,
            introduction: null,
        });
        await this.participantRepo.save(host);
        const reloaded = await this.gatheringRepo.findOne({
            where: { id: saved.id },
            relations: ['gatheringSessions', 'genreRows', 'createdBy'],
        });
        return {
            ...this.toDetail(reloaded),
            message: '모임이 생성되었습니다.',
        };
    }
    async getDetail(id) {
        const g = await this.gatheringRepo.findOne({
            where: { id },
            relations: ['gatheringSessions', 'genreRows', 'createdBy'],
        });
        if (!g)
            throw new common_1.BadRequestException('모임이 존재하지 않습니다.');
        return this.toDetail(g);
    }
    async updateGathering(id, user, dto) {
        const g = await this.gatheringRepo.findOne({
            where: { id },
            relations: ['gatheringSessions', 'genreRows', 'createdBy'],
        });
        if (!g)
            throw new common_1.BadRequestException('모임을 찾을 수 없습니다.');
        if (g.createdBy.id !== user.id) {
            throw new common_1.BadRequestException('수정 권한이 없습니다.');
        }
        if (dto.name != null)
            g.name = dto.name;
        if (dto.place != null)
            g.place = dto.place;
        if (dto.description != null)
            g.description = dto.description;
        if (dto.thumbnail != null)
            g.thumbnail = dto.thumbnail;
        if (dto.gatheringDateTime != null) {
            g.gatheringDateTime = new Date(dto.gatheringDateTime);
        }
        if (dto.recruitDeadline != null) {
            g.recruitDeadline = new Date(dto.recruitDeadline);
        }
        if (dto.genres != null) {
            await this.gatheringRepo.manager.delete(entities_1.GatheringGenre, {
                gathering: { id: g.id },
            });
            g.genreRows = (dto.genres ?? []).map((genreName) => {
                const row = new entities_1.GatheringGenre();
                row.genreName = genreName;
                row.gathering = g;
                return row;
            });
        }
        const sessions = dto.gatheringSessions;
        if (sessions?.length) {
            await this.gatheringRepo.manager.delete(entities_1.GatheringSession, {
                gathering: { id: g.id },
            });
            g.gatheringSessions = sessions.map((se) => {
                const s = new entities_1.GatheringSession();
                s.name = se.bandSession;
                s.recruitCount = se.recruitCount;
                s.currentCount = 0;
                s.gathering = g;
                return s;
            });
        }
        await this.gatheringRepo.save(g);
        const re = await this.gatheringRepo.findOne({
            where: { id: g.id },
            relations: ['gatheringSessions', 'genreRows', 'createdBy'],
        });
        return this.toDetail(re);
    }
    async cancelGathering(id, user) {
        const g = await this.gatheringRepo.findOne({
            where: { id },
            relations: ['createdBy'],
        });
        if (!g)
            throw new common_1.BadRequestException('모임을 찾을 수 없습니다.');
        if (g.createdBy.id !== user.id) {
            throw new common_1.BadRequestException('취소 권한이 없습니다.');
        }
        g.status = jammit_enums_1.GatheringStatus.CANCELED;
        await this.gatheringRepo.save(g);
    }
    async getMyCreated(user, includeCanceled, page, size) {
        const qb = this.gatheringRepo
            .createQueryBuilder('g')
            .leftJoinAndSelect('g.gatheringSessions', 's')
            .leftJoinAndSelect('g.genreRows', 'gr')
            .leftJoinAndSelect('g.createdBy', 'creator')
            .where('creator.id = :uid', { uid: user.id });
        if (!includeCanceled) {
            qb.andWhere('g.status != :canceled', { canceled: jammit_enums_1.GatheringStatus.CANCELED });
        }
        qb.orderBy('g.createdAt', 'DESC');
        const total = await qb.getCount();
        qb.skip(page * size).take(size);
        const list = await qb.getMany();
        return {
            gatherings: list.map((x) => this.toSummary(x)),
            currentPage: page,
            totalPage: Math.ceil(total / size) || 1,
            totalElements: total,
        };
    }
    async findByIdWithSessions(id) {
        return this.gatheringRepo.findOne({
            where: { id },
            relations: ['gatheringSessions', 'genreRows', 'createdBy', 'participants'],
        });
    }
    async findById(id, extraRelations = []) {
        return this.gatheringRepo.findOne({
            where: { id },
            relations: ['createdBy', ...extraRelations],
        });
    }
    countByCreatedBy(userId) {
        return this.gatheringRepo.count({ where: { createdBy: { id: userId } } });
    }
    countCompletedByCreator(userId) {
        return this.gatheringRepo.count({
            where: { createdBy: { id: userId }, status: jammit_enums_1.GatheringStatus.COMPLETED },
        });
    }
    async findConfirmedGatheringsBetweenDates(start, end) {
        return this.gatheringRepo
            .createQueryBuilder('g')
            .leftJoinAndSelect('g.participants', 'p')
            .where('g.status = :st', { st: jammit_enums_1.GatheringStatus.CONFIRMED })
            .andWhere('g.gatheringDateTime >= :start', { start })
            .andWhere('g.gatheringDateTime < :end', { end })
            .getMany();
    }
    async findIncompleteGatheringsAfterDeadline(now) {
        return this.gatheringRepo
            .createQueryBuilder('g')
            .innerJoin('g.gatheringSessions', 's')
            .where('g.status = :st', { st: jammit_enums_1.GatheringStatus.RECRUITING })
            .andWhere('g.recruitDeadline < :now', { now })
            .andWhere('s.currentCount < s.recruitCount')
            .getMany();
    }
    toSummary(g) {
        const sessions = dedupeSessions(g.gatheringSessions ?? []);
        const genres = new Set((g.genreRows ?? []).map((r) => r.genreName));
        return {
            id: g.id,
            name: g.name,
            place: g.place,
            thumbnail: g.thumbnail,
            gatheringDateTime: g.gatheringDateTime,
            totalRecruit: sessions.reduce((a, s) => a + s.recruitCount, 0),
            totalCurrent: sessions.reduce((a, s) => a + s.currentCount, 0),
            viewCount: g.viewCount,
            recruitDeadline: g.recruitDeadline,
            status: g.status,
            genres: [...genres],
            creator: {
                id: g.createdBy.id,
                nickname: g.createdBy.nickname,
                profileImagePath: g.createdBy.profileImagePath ?? '',
            },
            sessions: sessions.map((s) => ({
                bandSession: s.name,
                recruitCount: s.recruitCount,
                currentCount: s.currentCount,
            })),
        };
    }
    toDetail(g) {
        const base = this.toSummary(g);
        return {
            ...base,
            description: g.description,
            sessions: base.sessions,
        };
    }
};
exports.JammitGatheringService = JammitGatheringService;
exports.JammitGatheringService = JammitGatheringService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Gathering)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.GatheringParticipant)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object])
], JammitGatheringService);
function dedupeSessions(sessions) {
    const m = new Map();
    for (const s of sessions) {
        m.set(s.id, s);
    }
    return [...m.values()];
}


/***/ }),
/* 54 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var GatheringScheduler_1;
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GatheringScheduler = void 0;
const entities_1 = __webpack_require__(13);
const jammit_enums_1 = __webpack_require__(17);
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(12);
const typeorm_2 = __webpack_require__(15);
const schedule_1 = __webpack_require__(55);
const jammit_gathering_service_1 = __webpack_require__(53);
let GatheringScheduler = GatheringScheduler_1 = class GatheringScheduler {
    constructor(gatheringSvc, gatheringRepo, participantRepo) {
        this.gatheringSvc = gatheringSvc;
        this.gatheringRepo = gatheringRepo;
        this.participantRepo = participantRepo;
        this.log = new common_1.Logger(GatheringScheduler_1.name);
    }
    async completeGatheringsCron() {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);
        const today = new Date(yesterday);
        today.setDate(today.getDate() + 1);
        const list = await this.gatheringSvc.findConfirmedGatheringsBetweenDates(yesterday, today);
        for (const g of list) {
            g.status = jammit_enums_1.GatheringStatus.COMPLETED;
            await this.gatheringRepo.save(g);
            const parts = await this.participantRepo.find({
                where: { gathering: { id: g.id } },
            });
            for (const p of parts) {
                if (p.status === jammit_enums_1.ParticipantStatus.APPROVED ||
                    p.status === jammit_enums_1.ParticipantStatus.COMPLETED) {
                    p.status = jammit_enums_1.ParticipantStatus.COMPLETED;
                    await this.participantRepo.save(p);
                }
            }
        }
        this.log.log(`모임 완료 스케줄: ${list.length}건`);
    }
    async cancelIncompleteInterval() {
        const list = await this.gatheringSvc.findIncompleteGatheringsAfterDeadline(new Date());
        for (const g of list) {
            g.status = jammit_enums_1.GatheringStatus.CANCELED;
            await this.gatheringRepo.save(g);
        }
        if (list.length) {
            this.log.log(`미완료 모임 취소: ${list.length}건`);
        }
    }
};
exports.GatheringScheduler = GatheringScheduler;
__decorate([
    (0, schedule_1.Cron)('0 0 * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GatheringScheduler.prototype, "completeGatheringsCron", null);
__decorate([
    (0, schedule_1.Interval)(30_000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GatheringScheduler.prototype, "cancelIncompleteInterval", null);
exports.GatheringScheduler = GatheringScheduler = GatheringScheduler_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Gathering)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.GatheringParticipant)),
    __metadata("design:paramtypes", [typeof (_a = typeof jammit_gathering_service_1.JammitGatheringService !== "undefined" && jammit_gathering_service_1.JammitGatheringService) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object])
], GatheringScheduler);


/***/ }),
/* 55 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/schedule");

/***/ }),
/* 56 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JammitGatheringController = void 0;
const current_jammit_user_decorator_1 = __webpack_require__(49);
const api_response_dto_1 = __webpack_require__(36);
const auth_guard_1 = __webpack_require__(50);
const entities_1 = __webpack_require__(13);
const jammit_enums_1 = __webpack_require__(17);
const common_1 = __webpack_require__(4);
const swagger_1 = __webpack_require__(6);
const jammit_gathering_service_1 = __webpack_require__(53);
const jammit_participation_service_1 = __webpack_require__(52);
let JammitGatheringController = class JammitGatheringController {
    constructor(gathering, participation) {
        this.gathering = gathering;
        this.participation = participation;
    }
    async list(page, size, genres, sessions, sort) {
        const g = genres == null ? undefined : Array.isArray(genres) ? genres : [genres];
        const s = sessions == null ? undefined : Array.isArray(sessions) ? sessions : [sessions];
        return this.gathering.findGatherings(g, s, page, size, sort);
    }
    async myCreated(user, includeCanceled, page, size) {
        const res = await this.gathering.getMyCreated(user, includeCanceled, page, size);
        return api_response_dto_1.CommonResponseDto.ok(res);
    }
    async myParticipations(user, includeCanceled, page, size) {
        const res = await this.participation.getMyParticipations(user, page, size, includeCanceled);
        return api_response_dto_1.CommonResponseDto.ok(res);
    }
    async myCompletedGatherings(user) {
        const res = await this.participation.getMyCompletedGatherings(user);
        return api_response_dto_1.CommonResponseDto.ok(res);
    }
    async create(user, body) {
        const res = await this.gathering.createGathering(user, {
            name: body.name,
            thumbnail: body.thumbnail,
            place: body.place,
            description: body.description,
            gatheringDateTime: body.gatheringDateTime,
            recruitDateTime: body.recruitDateTime,
            genres: body.genres ?? [],
            gatheringSessions: body.gatheringSessions ?? [],
        });
        return api_response_dto_1.CommonResponseDto.ok(res);
    }
    async detail(id) {
        return this.gathering.getDetail(id);
    }
    async update(id, user, body) {
        const res = await this.gathering.updateGathering(id, user, body);
        return api_response_dto_1.CommonResponseDto.ok(res);
    }
    async cancel(id, user) {
        await this.gathering.cancelGathering(id, user);
        return api_response_dto_1.CommonResponseDto.ok(null);
    }
    async complete(id, user) {
        await this.participation.completeGathering(id, user);
        return api_response_dto_1.CommonResponseDto.ok(null);
    }
};
exports.JammitGatheringController = JammitGatheringController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({
        summary: '모임 목록(공개)',
        description: '장르·세션 필터, 페이지네이션',
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 0, description: '0부터' }),
    (0, swagger_1.ApiQuery)({ name: 'size', required: false, example: 20 }),
    (0, swagger_1.ApiQuery)({
        name: 'genres',
        required: false,
        isArray: true,
        enum: jammit_enums_1.Genre,
        description: '필터 장르 (복수 가능)',
    }),
    (0, swagger_1.ApiQuery)({
        name: 'sessions',
        required: false,
        isArray: true,
        enum: jammit_enums_1.BandSession,
        description: '필터 세션 (복수 가능)',
    }),
    (0, swagger_1.ApiQuery)({ name: 'sort', required: false, description: '정렬 키 (백엔드 규약)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '모임 목록 페이지' }),
    __param(0, (0, common_1.Query)('page', new common_1.DefaultValuePipe(0), common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('size', new common_1.DefaultValuePipe(20), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('genres')),
    __param(3, (0, common_1.Query)('sessions')),
    __param(4, (0, common_1.Query)('sort')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], JammitGatheringController.prototype, "list", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('my/created'),
    (0, swagger_1.ApiOperation)({ summary: '내가 만든 모임 목록' }),
    (0, swagger_1.ApiQuery)({ name: 'includeCanceled', required: false, example: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 0 }),
    (0, swagger_1.ApiQuery)({ name: 'size', required: false, example: 10 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CommonResponseDto' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '미인증' }),
    __param(0, (0, current_jammit_user_decorator_1.CurrentJammitUser)()),
    __param(1, (0, common_1.Query)('includeCanceled', new common_1.DefaultValuePipe(false), common_1.ParseBoolPipe)),
    __param(2, (0, common_1.Query)('page', new common_1.DefaultValuePipe(0), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('size', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof entities_1.JammitUser !== "undefined" && entities_1.JammitUser) === "function" ? _e : Object, Boolean, Number, Number]),
    __metadata("design:returntype", Promise)
], JammitGatheringController.prototype, "myCreated", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('my/participations'),
    (0, swagger_1.ApiOperation)({ summary: '내가 참가 신청·참여한 모임 목록' }),
    (0, swagger_1.ApiQuery)({ name: 'includeCanceled', required: false, example: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 0 }),
    (0, swagger_1.ApiQuery)({ name: 'size', required: false, example: 10 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CommonResponseDto' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '미인증' }),
    __param(0, (0, current_jammit_user_decorator_1.CurrentJammitUser)()),
    __param(1, (0, common_1.Query)('includeCanceled', new common_1.DefaultValuePipe(false), common_1.ParseBoolPipe)),
    __param(2, (0, common_1.Query)('page', new common_1.DefaultValuePipe(0), common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('size', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof entities_1.JammitUser !== "undefined" && entities_1.JammitUser) === "function" ? _f : Object, Boolean, Number, Number]),
    __metadata("design:returntype", Promise)
], JammitGatheringController.prototype, "myParticipations", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)('my/completed'),
    (0, swagger_1.ApiOperation)({ summary: '내가 완료한 모임 목록 (영상 업로드 연동 등)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CommonResponseDto' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '미인증' }),
    __param(0, (0, current_jammit_user_decorator_1.CurrentJammitUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof entities_1.JammitUser !== "undefined" && entities_1.JammitUser) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], JammitGatheringController.prototype, "myCompletedGatherings", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: '모임 생성' }),
    (0, swagger_1.ApiBody)({
        schema: {
            example: {
                name: '주말 합주',
                thumbnail: 'https://example.com/thumb.jpg',
                place: '서울',
                description: '초보도 환영',
                gatheringDateTime: '2026-05-01T14:00:00.000Z',
                recruitDateTime: '2026-04-25T23:59:59.000Z',
                genres: ['ROCK', 'POP'],
                gatheringSessions: [
                    { bandSession: 'VOCAL', recruitCount: 2 },
                    { bandSession: 'DRUM', recruitCount: 1 },
                ],
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: '생성된 모임 (CommonResponseDto)' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '미인증' }),
    __param(0, (0, current_jammit_user_decorator_1.CurrentJammitUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof entities_1.JammitUser !== "undefined" && entities_1.JammitUser) === "function" ? _h : Object, typeof (_j = typeof Record !== "undefined" && Record) === "function" ? _j : Object]),
    __metadata("design:returntype", Promise)
], JammitGatheringController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '모임 상세(공개)' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number, description: 'gathering id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '모임 상세' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '없음' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], JammitGatheringController.prototype, "detail", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '모임 수정', description: '개설자만 가능' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiBody)({
        schema: {
            example: {
                name: '수정된 이름',
                place: '부산',
                description: '설명 변경',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CommonResponseDto' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '미인증' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: '권한 없음' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_jammit_user_decorator_1.CurrentJammitUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeof (_k = typeof entities_1.JammitUser !== "undefined" && entities_1.JammitUser) === "function" ? _k : Object, typeof (_l = typeof Record !== "undefined" && Record) === "function" ? _l : Object]),
    __metadata("design:returntype", Promise)
], JammitGatheringController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: '모임 취소', description: '개설자만 가능' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CommonResponseDto' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '미인증' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_jammit_user_decorator_1.CurrentJammitUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeof (_m = typeof entities_1.JammitUser !== "undefined" && entities_1.JammitUser) === "function" ? _m : Object]),
    __metadata("design:returntype", Promise)
], JammitGatheringController.prototype, "cancel", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)(':id/complete'),
    (0, swagger_1.ApiOperation)({ summary: '모임 완료 처리', description: '개설자만 가능' }),
    (0, swagger_1.ApiParam)({ name: 'id', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CommonResponseDto' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '미인증' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, current_jammit_user_decorator_1.CurrentJammitUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeof (_o = typeof entities_1.JammitUser !== "undefined" && entities_1.JammitUser) === "function" ? _o : Object]),
    __metadata("design:returntype", Promise)
], JammitGatheringController.prototype, "complete", null);
exports.JammitGatheringController = JammitGatheringController = __decorate([
    (0, swagger_1.ApiTags)('Jammit Gathering'),
    (0, common_1.Controller)('gatherings'),
    __metadata("design:paramtypes", [typeof (_a = typeof jammit_gathering_service_1.JammitGatheringService !== "undefined" && jammit_gathering_service_1.JammitGatheringService) === "function" ? _a : Object, typeof (_b = typeof jammit_participation_service_1.JammitParticipationService !== "undefined" && jammit_participation_service_1.JammitParticipationService) === "function" ? _b : Object])
], JammitGatheringController);


/***/ }),
/* 57 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JammitReviewModule = void 0;
const common_1 = __webpack_require__(4);
const jammit_persistence_module_1 = __webpack_require__(11);
const jammit_gatherings_module_1 = __webpack_require__(47);
const jammit_review_controller_1 = __webpack_require__(58);
const jammit_review_service_1 = __webpack_require__(59);
let JammitReviewModule = class JammitReviewModule {
};
exports.JammitReviewModule = JammitReviewModule;
exports.JammitReviewModule = JammitReviewModule = __decorate([
    (0, common_1.Module)({
        imports: [jammit_persistence_module_1.JammitPersistenceModule, jammit_gatherings_module_1.JammitGatheringsModule],
        controllers: [jammit_review_controller_1.JammitReviewController],
        providers: [jammit_review_service_1.JammitReviewService],
    })
], JammitReviewModule);


/***/ }),
/* 58 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JammitReviewController = void 0;
const current_jammit_user_decorator_1 = __webpack_require__(49);
const api_response_dto_1 = __webpack_require__(36);
const auth_guard_1 = __webpack_require__(50);
const entities_1 = __webpack_require__(13);
const common_1 = __webpack_require__(4);
const swagger_1 = __webpack_require__(6);
const jammit_review_service_1 = __webpack_require__(59);
let JammitReviewController = class JammitReviewController {
    constructor(svc) {
        this.svc = svc;
    }
    async create(user, body) {
        const res = await this.svc.createReview(user, body);
        return api_response_dto_1.CommonResponseDto.ok(res);
    }
    async remove(reviewId, user) {
        await this.svc.deleteReview(user.id, reviewId);
        return api_response_dto_1.CommonResponseDto.ok(null);
    }
    async written(user) {
        const res = await this.svc.getWritten(user.id);
        return api_response_dto_1.CommonResponseDto.ok(res);
    }
    async stats(user) {
        const res = await this.svc.getStatistics(user.id);
        return api_response_dto_1.CommonResponseDto.ok(res);
    }
    async received(user, page, pageSize) {
        const res = await this.svc.getReceivedPage(user.id, page, pageSize);
        return api_response_dto_1.CommonResponseDto.ok(res);
    }
    async byGathering(gatheringId) {
        const res = await this.svc.getByGathering(gatheringId);
        return api_response_dto_1.CommonResponseDto.ok(res);
    }
    async unwritten(user) {
        const res = await this.svc.getUnwrittenList(user);
        return api_response_dto_1.CommonResponseDto.ok(res);
    }
    async userPage(owner, gatheringId, userId) {
        return this.svc.getReviewUserPage(owner, userId, gatheringId);
    }
};
exports.JammitReviewController = JammitReviewController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: '리뷰 작성' }),
    (0, swagger_1.ApiBody)({
        schema: {
            example: {
                gatheringId: 1,
                revieweeId: 2,
                content: '좋은 합주였습니다.',
                isPracticeHelped: true,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'CommonResponseDto' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '미인증' }),
    __param(0, (0, current_jammit_user_decorator_1.CurrentJammitUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof entities_1.JammitUser !== "undefined" && entities_1.JammitUser) === "function" ? _b : Object, typeof (_c = typeof Record !== "undefined" && Record) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], JammitReviewController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':reviewId'),
    (0, swagger_1.ApiOperation)({ summary: '리뷰 삭제', description: '작성자 본인' }),
    (0, swagger_1.ApiParam)({ name: 'reviewId', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CommonResponseDto' }),
    __param(0, (0, common_1.Param)('reviewId', common_1.ParseIntPipe)),
    __param(1, (0, current_jammit_user_decorator_1.CurrentJammitUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeof (_d = typeof entities_1.JammitUser !== "undefined" && entities_1.JammitUser) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], JammitReviewController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('written'),
    (0, swagger_1.ApiOperation)({ summary: '내가 작성한 리뷰 목록' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CommonResponseDto' }),
    __param(0, (0, current_jammit_user_decorator_1.CurrentJammitUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_e = typeof entities_1.JammitUser !== "undefined" && entities_1.JammitUser) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], JammitReviewController.prototype, "written", null);
__decorate([
    (0, common_1.Get)('received/statistics'),
    (0, swagger_1.ApiOperation)({ summary: '받은 리뷰 통계' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CommonResponseDto' }),
    __param(0, (0, current_jammit_user_decorator_1.CurrentJammitUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof entities_1.JammitUser !== "undefined" && entities_1.JammitUser) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], JammitReviewController.prototype, "stats", null);
__decorate([
    (0, common_1.Get)('received'),
    (0, swagger_1.ApiOperation)({ summary: '받은 리뷰 페이지' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, example: 0 }),
    (0, swagger_1.ApiQuery)({ name: 'pageSize', required: false, example: 8 }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CommonResponseDto' }),
    __param(0, (0, current_jammit_user_decorator_1.CurrentJammitUser)()),
    __param(1, (0, common_1.Query)('page', new common_1.DefaultValuePipe(0), common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('pageSize', new common_1.DefaultValuePipe(8), common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof entities_1.JammitUser !== "undefined" && entities_1.JammitUser) === "function" ? _g : Object, Number, Number]),
    __metadata("design:returntype", Promise)
], JammitReviewController.prototype, "received", null);
__decorate([
    (0, common_1.Get)('gathering/:gatheringId'),
    (0, swagger_1.ApiOperation)({ summary: '모임별 리뷰 목록' }),
    (0, swagger_1.ApiParam)({ name: 'gatheringId', type: Number }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CommonResponseDto' }),
    __param(0, (0, common_1.Param)('gatheringId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], JammitReviewController.prototype, "byGathering", null);
__decorate([
    (0, common_1.Get)('unwritten'),
    (0, swagger_1.ApiOperation)({ summary: '작성 대기 리뷰 목록' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'CommonResponseDto' }),
    __param(0, (0, current_jammit_user_decorator_1.CurrentJammitUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof entities_1.JammitUser !== "undefined" && entities_1.JammitUser) === "function" ? _h : Object]),
    __metadata("design:returntype", Promise)
], JammitReviewController.prototype, "unwritten", null);
__decorate([
    (0, common_1.Get)(':gatheringId/participants/:userId/reviews'),
    (0, swagger_1.ApiOperation)({
        summary: '특정 모임·유저에 대한 리뷰 페이지',
        description: '모임 개설자(owner) 권한 등 서비스 로직 따름',
    }),
    (0, swagger_1.ApiParam)({ name: 'gatheringId', type: Number }),
    (0, swagger_1.ApiParam)({ name: 'userId', type: Number, description: '리뷰 대상 users.id' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '리뷰 페이지 데이터' }),
    __param(0, (0, current_jammit_user_decorator_1.CurrentJammitUser)()),
    __param(1, (0, common_1.Param)('gatheringId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_j = typeof entities_1.JammitUser !== "undefined" && entities_1.JammitUser) === "function" ? _j : Object, Number, Number]),
    __metadata("design:returntype", Promise)
], JammitReviewController.prototype, "userPage", null);
exports.JammitReviewController = JammitReviewController = __decorate([
    (0, swagger_1.ApiTags)('Jammit Review'),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Controller)('review'),
    __metadata("design:paramtypes", [typeof (_a = typeof jammit_review_service_1.JammitReviewService !== "undefined" && jammit_review_service_1.JammitReviewService) === "function" ? _a : Object])
], JammitReviewController);


/***/ }),
/* 59 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JammitReviewService = void 0;
const entities_1 = __webpack_require__(13);
const jammit_enums_1 = __webpack_require__(17);
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(12);
const typeorm_2 = __webpack_require__(15);
const jammit_gathering_service_1 = __webpack_require__(53);
let JammitReviewService = class JammitReviewService {
    constructor(reviewRepo, userRepo, gatheringRepo, participantRepo, gatheringService, dataSource) {
        this.reviewRepo = reviewRepo;
        this.userRepo = userRepo;
        this.gatheringRepo = gatheringRepo;
        this.participantRepo = participantRepo;
        this.gatheringService = gatheringService;
        this.dataSource = dataSource;
        this.reviewRelations = [
            'reviewer',
            'reviewer.userBandSessions',
            'reviewee',
            'gathering',
            'gathering.createdBy',
        ];
    }
    async createReview(reviewer, dto) {
        const revieweeId = dto.revieweeId;
        const gatheringId = dto.gatheringId;
        const reviewee = await this.userRepo.findOneBy({ id: revieweeId });
        if (!reviewee)
            throw new common_1.BadRequestException('리뷰 대상자를 찾을 수 없습니다.');
        const gathering = await this.gatheringService.findById(gatheringId);
        if (!gathering)
            throw new common_1.BadRequestException('모임을 찾을 수 없습니다.');
        if (gathering.status !== jammit_enums_1.GatheringStatus.COMPLETED) {
            throw new common_1.BadRequestException('완료된 모임만 리뷰를 작성할 수 있습니다.');
        }
        const rDone = await this.participantRepo.exists({
            where: {
                user: { id: reviewer.id },
                gathering: { id: gatheringId },
                status: jammit_enums_1.ParticipantStatus.COMPLETED,
            },
        });
        if (!rDone) {
            throw new common_1.BadRequestException('모임에 참여 완료한 사용자만 리뷰를 작성할 수 있습니다.');
        }
        const eDone = await this.participantRepo.exists({
            where: {
                user: { id: revieweeId },
                gathering: { id: gatheringId },
                status: jammit_enums_1.ParticipantStatus.COMPLETED,
            },
        });
        if (!eDone) {
            throw new common_1.BadRequestException('모임에 참여 완료한 사용자에게만 리뷰를 작성할 수 있습니다.');
        }
        const dup = await this.reviewRepo.findOne({
            where: {
                reviewer: { id: reviewer.id },
                reviewee: { id: revieweeId },
                gathering: { id: gatheringId },
            },
        });
        if (dup) {
            throw new common_1.BadRequestException('이미 이 모임에서 해당 사용자에 대한 리뷰를 작성했습니다.');
        }
        if (reviewer.id === revieweeId) {
            throw new common_1.BadRequestException('자기 자신에게 리뷰를 작성할 수 없습니다.');
        }
        const r = this.reviewRepo.create({
            reviewer,
            reviewee,
            gathering,
            content: dto.content ?? null,
            isPracticeHelped: !!dto.isPracticeHelped,
            isGoodWithMusic: !!dto.isGoodWithMusic,
            isGoodWithOthers: !!dto.isGoodWithOthers,
            isSharesPracticeResources: !!dto.isSharesPracticeResources,
            isManagingWell: !!dto.isManagingWell,
            isHelpful: !!dto.isHelpful,
            isGoodLearner: !!dto.isGoodLearner,
            isKeepingPromises: !!dto.isKeepingPromises,
        });
        await this.reviewRepo.save(r);
        const full = await this.reviewRepo.findOne({
            where: { id: r.id },
            relations: [...this.reviewRelations],
        });
        return this.toReviewResponse(full);
    }
    async deleteReview(reviewerId, reviewId) {
        const review = await this.reviewRepo.findOne({
            where: { id: reviewId },
            relations: ['reviewer'],
        });
        if (!review)
            throw new common_1.BadRequestException('리뷰를 찾을 수 없습니다.');
        if (review.reviewer.id !== reviewerId) {
            throw new common_1.BadRequestException('리뷰를 삭제할 권한이 없습니다.');
        }
        await this.reviewRepo.remove(review);
    }
    async getWritten(reviewerId) {
        const list = await this.reviewRepo.find({
            where: { reviewer: { id: reviewerId } },
            relations: [...this.reviewRelations],
        });
        return list.map((x) => this.toReviewResponse(x));
    }
    async getReceivedPage(revieweeId, page, pageSize) {
        const [content, totalElements] = await this.reviewRepo.findAndCount({
            where: { reviewee: { id: revieweeId } },
            relations: [...this.reviewRelations],
            order: { createdAt: 'DESC' },
            skip: page * pageSize,
            take: pageSize,
        });
        const totalPages = Math.ceil(totalElements / pageSize) || 1;
        return {
            content: content.map((x) => this.toReviewResponse(x)),
            page,
            size: pageSize,
            totalElements,
            totalPages,
            last: page >= totalPages - 1,
        };
    }
    async getStatistics(revieweeId) {
        const reviews = await this.reviewRepo.find({ where: { reviewee: { id: revieweeId } } });
        return this.buildStats(reviews);
    }
    async getByGathering(gatheringId) {
        const list = await this.reviewRepo.find({
            where: { gathering: { id: gatheringId } },
            relations: [...this.reviewRelations],
        });
        return list.map((x) => this.toReviewResponse(x));
    }
    async getReviewUserPage(owner, userId, gatheringId) {
        const gathering = await this.gatheringService.findById(gatheringId);
        if (!gathering)
            throw new common_1.BadRequestException('모임을 찾을 수 없습니다.');
        if (gathering.createdBy.id !== owner.id) {
            throw new common_1.BadRequestException('모임 주최자만 접근할 수 있습니다.');
        }
        const target = await this.userRepo.findOne({
            where: { id: userId },
            relations: ['preferredGenres', 'userBandSessions'],
        });
        if (!target)
            throw new common_1.BadRequestException('유저를 찾을 수 없습니다.');
        const reviews = await this.reviewRepo.find({
            where: { reviewee: { id: userId } },
            relations: [...this.reviewRelations],
        });
        const totalCreatedGatheringCount = await this.gatheringRepo.count({
            where: { createdBy: { id: target.id } },
        });
        const completedGatheringCount = await this.gatheringRepo.count({
            where: { createdBy: { id: target.id }, status: jammit_enums_1.GatheringStatus.COMPLETED },
        });
        const userInfo = {
            ...this.toUserResponse(target),
            totalCreatedGatheringCount,
            completedGatheringCount,
        };
        return {
            userInfo,
            statistics: this.buildStats(reviews),
            reviews: reviews.map((x) => this.toReviewResponse(x)),
        };
    }
    async getUnwrittenList(me) {
        const sql = `
      SELECT g.id AS "gatheringId", g.gathering_name AS "gatheringName", g.gathering_thumbnail AS "gatheringThumbnail",
             p.id AS "participantId", u.id AS "userId", u.nickname AS "userNickname", u.email AS "userEmail",
             p.band_session_name AS "bandSession", p.status AS "status", p.created_at AS "createdAt", p.introduction AS "introduction"
      FROM gathering_participant gp
      JOIN gathering g ON g.id = gp.gathering_id
      JOIN gathering_participant p ON p.gathering_id = g.id
      JOIN users u ON u.id = p.user_id
      LEFT JOIN review r ON r.gathering_id = g.id AND r.reviewer_id = $1 AND r.reviewee_id = u.id
      WHERE gp.user_id = $1
        AND gp.status = 'COMPLETED'
        AND g.status = 'COMPLETED'
        AND p.status = 'COMPLETED'
        AND p.user_id <> $1
        AND r.id IS NULL
    `;
        const rows = (await this.dataSource.query(sql, [me.id]));
        const grouped = new Map();
        for (const row of rows) {
            const gid = Number(row.gatheringId);
            if (!grouped.has(gid))
                grouped.set(gid, []);
            grouped.get(gid).push(row);
        }
        const result = [];
        for (const [, group] of grouped) {
            const first = group[0];
            result.push({
                gatheringId: first.gatheringId,
                gatheringName: first.gatheringName,
                gatheringThumbnail: first.gatheringThumbnail,
                unwrittenParticipants: group.map((p) => ({
                    participantId: p.participantId,
                    userId: p.userId,
                    userNickname: p.userNickname,
                    userEmail: p.userEmail,
                    bandSession: p.bandSession,
                    status: p.status,
                    createdAt: p.createdAt,
                    introduction: p.introduction,
                })),
            });
        }
        return result;
    }
    toUserResponse(user) {
        const preferredGenres = (user.preferredGenres ?? [])
            .sort((a, b) => a.priority - b.priority)
            .map((g) => g.name);
        const preferredBandSessions = (user.userBandSessions ?? [])
            .sort((a, b) => a.priority - b.priority)
            .map((s) => s.name);
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            nickname: user.nickname,
            profileImagePath: user.profileImagePath,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            preferredGenres,
            preferredBandSessions,
        };
    }
    toReviewResponse(review) {
        const sessions = (review.reviewer.userBandSessions ?? [])
            .sort((a, b) => a.priority - b.priority)
            .map((s) => s.name);
        const reviewerBandSession = sessions[0] ?? jammit_enums_1.BandSession.VOCAL;
        return {
            id: review.id,
            reviewerId: review.reviewer.id,
            reviewerNickname: review.reviewer.nickname,
            reviewerBandSession,
            reviewerBandSessions: sessions,
            revieweeId: review.reviewee.id,
            revieweeNickname: review.reviewee.nickname,
            gatheringId: review.gathering.id,
            gatheringName: review.gathering.name,
            gatheringThumbnail: review.gathering.thumbnail,
            gatheringHostNickname: review.gathering.createdBy.nickname,
            content: review.content,
            practiceHelped: review.isPracticeHelped,
            goodWithMusic: review.isGoodWithMusic,
            goodWithOthers: review.isGoodWithOthers,
            sharesPracticeResources: review.isSharesPracticeResources,
            managingWell: review.isManagingWell,
            helpful: review.isHelpful,
            goodLearner: review.isGoodLearner,
            keepingPromises: review.isKeepingPromises,
            isPracticeHelped: review.isPracticeHelped,
            isGoodWithMusic: review.isGoodWithMusic,
            isGoodWithOthers: review.isGoodWithOthers,
            isSharesPracticeResources: review.isSharesPracticeResources,
            isManagingWell: review.isManagingWell,
            isHelpful: review.isHelpful,
            isGoodLearner: review.isGoodLearner,
            isKeepingPromises: review.isKeepingPromises,
            createdAt: review.createdAt,
            updatedAt: review.updatedAt,
        };
    }
    buildStats(reviews) {
        const n = reviews.length;
        if (n === 0) {
            return {
                totalReviews: 0,
                practiceHelpedCount: 0,
                goodWithMusicCount: 0,
                goodWithOthersCount: 0,
                sharesPracticeResourcesCount: 0,
                managingWellCount: 0,
                helpfulCount: 0,
                goodLearnerCount: 0,
                keepingPromisesCount: 0,
                practiceHelpedPercentage: 0,
                goodWithMusicPercentage: 0,
                goodWithOthersPercentage: 0,
                sharesPracticeResourcesPercentage: 0,
                managingWellPercentage: 0,
                helpfulPercentage: 0,
                goodLearnerPercentage: 0,
                keepingPromisesPercentage: 0,
            };
        }
        const c = (pred) => reviews.filter(pred).length;
        const pct = (x) => Math.round((x / n) * 1000) / 10;
        return {
            totalReviews: n,
            practiceHelpedCount: c((r) => r.isPracticeHelped),
            goodWithMusicCount: c((r) => r.isGoodWithMusic),
            goodWithOthersCount: c((r) => r.isGoodWithOthers),
            sharesPracticeResourcesCount: c((r) => r.isSharesPracticeResources),
            managingWellCount: c((r) => r.isManagingWell),
            helpfulCount: c((r) => r.isHelpful),
            goodLearnerCount: c((r) => r.isGoodLearner),
            keepingPromisesCount: c((r) => r.isKeepingPromises),
            practiceHelpedPercentage: pct(c((r) => r.isPracticeHelped)),
            goodWithMusicPercentage: pct(c((r) => r.isGoodWithMusic)),
            goodWithOthersPercentage: pct(c((r) => r.isGoodWithOthers)),
            sharesPracticeResourcesPercentage: pct(c((r) => r.isSharesPracticeResources)),
            managingWellPercentage: pct(c((r) => r.isManagingWell)),
            helpfulPercentage: pct(c((r) => r.isHelpful)),
            goodLearnerPercentage: pct(c((r) => r.isGoodLearner)),
            keepingPromisesPercentage: pct(c((r) => r.isKeepingPromises)),
        };
    }
};
exports.JammitReviewService = JammitReviewService;
exports.JammitReviewService = JammitReviewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Review)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.JammitUser)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.Gathering)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.GatheringParticipant)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, typeof (_e = typeof jammit_gathering_service_1.JammitGatheringService !== "undefined" && jammit_gathering_service_1.JammitGatheringService) === "function" ? _e : Object, typeof (_f = typeof typeorm_2.DataSource !== "undefined" && typeorm_2.DataSource) === "function" ? _f : Object])
], JammitReviewService);


/***/ }),
/* 60 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JammitUserModule = void 0;
const axios_1 = __webpack_require__(28);
const common_1 = __webpack_require__(4);
const jammit_persistence_module_1 = __webpack_require__(11);
const jammit_user_controller_1 = __webpack_require__(61);
const jammit_user_service_1 = __webpack_require__(63);
let JammitUserModule = class JammitUserModule {
};
exports.JammitUserModule = JammitUserModule;
exports.JammitUserModule = JammitUserModule = __decorate([
    (0, common_1.Module)({
        imports: [jammit_persistence_module_1.JammitPersistenceModule, axios_1.HttpModule],
        controllers: [jammit_user_controller_1.JammitUserController],
        providers: [jammit_user_service_1.JammitUserService],
    })
], JammitUserModule);


/***/ }),
/* 61 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JammitUserController = void 0;
const current_jammit_user_decorator_1 = __webpack_require__(49);
const api_response_dto_1 = __webpack_require__(36);
const auth_guard_1 = __webpack_require__(50);
const common_1 = __webpack_require__(4);
const platform_express_1 = __webpack_require__(62);
const swagger_1 = __webpack_require__(6);
const entities_1 = __webpack_require__(13);
const jammit_user_service_1 = __webpack_require__(63);
let JammitUserController = class JammitUserController {
    constructor(userService) {
        this.userService = userService;
    }
    async register(body) {
        const res = await this.userService.register({
            email: body.email,
            password: body.password,
            username: body.username,
            nickname: body.nickname,
            preferredGenres: body.preferredGenres,
            preferredBandSessions: body.preferredBandSessions,
        });
        return api_response_dto_1.CommonResponseDto.ok(res);
    }
    async exists(email) {
        const res = await this.userService.checkEmailExists(email);
        return api_response_dto_1.CommonResponseDto.ok(res);
    }
    async me(u) {
        return this.userService.getUserInfo(u.email);
    }
    async update(u, body) {
        const res = await this.userService.updateUser(u.email, {
            email: body.email,
            username: body.username,
            password: body.password,
            preferredGenres: body.preferredGenres,
            preferredBandSessions: body.preferredBandSessions,
        });
        return api_response_dto_1.CommonResponseDto.ok(res);
    }
    async updateImage(u, body) {
        const res = await this.userService.updateProfileImage(u.email, {
            orgFileName: body.orgFileName,
            profileImagePath: body.profileImagePath,
        });
        return api_response_dto_1.CommonResponseDto.ok(res);
    }
    async uploadProfile(userId, file) {
        const url = await this.userService.uploadProfileImage(userId, file);
        return api_response_dto_1.CommonResponseDto.ok(url);
    }
};
exports.JammitUserController = JammitUserController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: '회원가입', description: 'Jammit 계정 생성' }),
    (0, swagger_1.ApiBody)({
        schema: {
            example: {
                email: 'user@example.com',
                password: 'password123',
                username: 'jammituser',
                nickname: '닉네임',
                preferredGenres: ['ROCK', 'POP'],
                preferredBandSessions: ['VOCAL', 'ELECTRIC_GUITAR'],
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: '가입 성공 (CommonResponseDto)' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '이메일 중복 등' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof Record !== "undefined" && Record) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], JammitUserController.prototype, "register", null);
__decorate([
    (0, common_1.Get)('exists'),
    (0, swagger_1.ApiOperation)({ summary: '이메일 중복 확인', description: '회원가입 전 사용 가능 여부' }),
    (0, swagger_1.ApiQuery)({ name: 'email', required: true, example: 'user@example.com' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '{ exists: boolean } 형태 (CommonResponseDto)' }),
    __param(0, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], JammitUserController.prototype, "exists", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: '내 프로필 조회', description: 'JWT 기준 로그인 유저 정보' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '프로필 객체 (CommonResponseDto)' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '미인증' }),
    __param(0, (0, current_jammit_user_decorator_1.CurrentJammitUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof entities_1.JammitUser !== "undefined" && entities_1.JammitUser) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], JammitUserController.prototype, "me", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)(),
    (0, swagger_1.ApiOperation)({ summary: '내 프로필 수정' }),
    (0, swagger_1.ApiBody)({
        schema: {
            example: {
                email: 'new@example.com',
                username: 'newname',
                password: 'newpassword',
                preferredGenres: ['JAZZ'],
                preferredBandSessions: ['DRUM'],
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '수정 후 프로필 (CommonResponseDto)' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '미인증' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '유저 없음 등' }),
    __param(0, (0, current_jammit_user_decorator_1.CurrentJammitUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof entities_1.JammitUser !== "undefined" && entities_1.JammitUser) === "function" ? _d : Object, typeof (_e = typeof Record !== "undefined" && Record) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], JammitUserController.prototype, "update", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Put)('image'),
    (0, swagger_1.ApiOperation)({ summary: '프로필 이미지 URL 갱신', description: '직접 URL을 저장할 때 사용' }),
    (0, swagger_1.ApiBody)({
        schema: {
            example: {
                orgFileName: 'photo.jpg',
                profileImagePath: 'https://example.com/profile/photo.jpg',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '갱신된 프로필 (CommonResponseDto)' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '미인증' }),
    __param(0, (0, current_jammit_user_decorator_1.CurrentJammitUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_f = typeof entities_1.JammitUser !== "undefined" && entities_1.JammitUser) === "function" ? _f : Object, typeof (_g = typeof Record !== "undefined" && Record) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], JammitUserController.prototype, "updateImage", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Post)(':userId/profile-image'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, swagger_1.ApiOperation)({ summary: '프로필 이미지 업로드', description: 'multipart file → 스토리지 업로드 후 URL 반환' }),
    (0, swagger_1.ApiParam)({ name: 'userId', type: Number, description: '본인 users.id 와 일치해야 함' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['file'],
            properties: {
                file: { type: 'string', format: 'binary', description: '이미지 파일' },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '업로드된 이미지 URL (CommonResponseDto)' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '미인증' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '파일 없음·유저 없음' }),
    __param(0, (0, common_1.Param)('userId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, typeof (_j = typeof Express !== "undefined" && (_h = Express.Multer) !== void 0 && _h.File) === "function" ? _j : Object]),
    __metadata("design:returntype", Promise)
], JammitUserController.prototype, "uploadProfile", null);
exports.JammitUserController = JammitUserController = __decorate([
    (0, swagger_1.ApiTags)('Jammit User'),
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [typeof (_a = typeof jammit_user_service_1.JammitUserService !== "undefined" && jammit_user_service_1.JammitUserService) === "function" ? _a : Object])
], JammitUserController);


/***/ }),
/* 62 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/platform-express");

/***/ }),
/* 63 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JammitUserService = void 0;
const entities_1 = __webpack_require__(13);
const jammit_enums_1 = __webpack_require__(17);
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(29);
const typeorm_1 = __webpack_require__(12);
const bcrypt = __importStar(__webpack_require__(42));
const typeorm_2 = __webpack_require__(15);
const axios_1 = __webpack_require__(28);
const crypto_1 = __webpack_require__(64);
const rxjs_1 = __webpack_require__(40);
let JammitUserService = class JammitUserService {
    constructor(userRepo, pgRepo, pbsRepo, gatheringRepo, http, config) {
        this.userRepo = userRepo;
        this.pgRepo = pgRepo;
        this.pbsRepo = pbsRepo;
        this.gatheringRepo = gatheringRepo;
        this.http = http;
        this.config = config;
    }
    async getUserInfo(email) {
        const user = await this.userRepo.findOne({
            where: { email },
            relations: ['preferredGenres', 'userBandSessions'],
        });
        if (!user)
            throw new common_1.BadRequestException('유저를 찾지 못하였습니다');
        const totalCreatedGatheringCount = await this.gatheringRepo.count({
            where: { createdBy: { id: user.id } },
        });
        const completedGatheringCount = await this.gatheringRepo.count({
            where: { createdBy: { id: user.id }, status: jammit_enums_1.GatheringStatus.COMPLETED },
        });
        return this.buildUserResponse(user, totalCreatedGatheringCount, completedGatheringCount);
    }
    async register(dto) {
        if (await this.userRepo.exists({ where: { email: dto.email } })) {
            throw new common_1.BadRequestException('이메일이 중복되었습니다.');
        }
        const user = this.userRepo.create({
            email: dto.email,
            password: await bcrypt.hash(dto.password, 10),
            username: dto.username,
            nickname: dto.nickname,
            oauthPlatform: jammit_enums_1.OauthPlatform.NONE,
        });
        await this.userRepo.save(user);
        if (dto.preferredGenres?.length) {
            await this.replacePreferredGenres(user.id, dto.preferredGenres);
        }
        if (dto.preferredBandSessions?.length) {
            await this.replacePreferredSessions(user.id, dto.preferredBandSessions);
        }
        const full = await this.userRepo.findOne({
            where: { id: user.id },
            relations: ['preferredGenres', 'userBandSessions'],
        });
        return this.buildUserResponse(full, 0, 0);
    }
    async updateUser(email, dto) {
        const user = await this.userRepo.findOne({
            where: { email },
            relations: ['preferredGenres', 'userBandSessions'],
        });
        if (!user)
            throw new common_1.BadRequestException('유저를 찾지 못하였습니다');
        if (dto.email != null)
            user.email = dto.email;
        if (dto.username != null)
            user.username = dto.username;
        if (dto.password != null)
            user.password = await bcrypt.hash(dto.password, 10);
        await this.userRepo.save(user);
        await this.pgRepo.delete({ user: { id: user.id } });
        await this.pbsRepo.delete({ user: { id: user.id } });
        if (dto.preferredGenres?.length) {
            await this.replacePreferredGenres(user.id, dto.preferredGenres);
        }
        if (dto.preferredBandSessions?.length) {
            await this.replacePreferredSessions(user.id, dto.preferredBandSessions);
        }
        const full = await this.userRepo.findOne({
            where: { id: user.id },
            relations: ['preferredGenres', 'userBandSessions'],
        });
        const totalCreatedGatheringCount = await this.gatheringRepo.count({
            where: { createdBy: { id: user.id } },
        });
        const completedGatheringCount = await this.gatheringRepo.count({
            where: { createdBy: { id: user.id }, status: jammit_enums_1.GatheringStatus.COMPLETED },
        });
        return this.buildUserResponse(full, totalCreatedGatheringCount, completedGatheringCount);
    }
    async updateProfileImage(email, dto) {
        const user = await this.userRepo.findOne({
            where: { email },
            relations: ['preferredGenres', 'userBandSessions'],
        });
        if (!user)
            throw new common_1.BadRequestException('유저를 찾지 못하였습니다');
        if (dto.profileImagePath != null && dto.profileImagePath !== '') {
            if (!dto.orgFileName) {
                throw new common_1.BadRequestException('프로필 이미지 수정시 원본 파일 이름은 필수입니다.');
            }
            user.orgFileName = dto.orgFileName;
            user.profileImagePath = dto.profileImagePath;
        }
        else {
            user.orgFileName = null;
            user.profileImagePath = null;
        }
        await this.userRepo.save(user);
        const totalCreatedGatheringCount = await this.gatheringRepo.count({
            where: { createdBy: { id: user.id } },
        });
        const completedGatheringCount = await this.gatheringRepo.count({
            where: { createdBy: { id: user.id }, status: jammit_enums_1.GatheringStatus.COMPLETED },
        });
        const full = await this.userRepo.findOne({
            where: { id: user.id },
            relations: ['preferredGenres', 'userBandSessions'],
        });
        return this.buildUserResponse(full, totalCreatedGatheringCount, completedGatheringCount);
    }
    async checkEmailExists(email) {
        return { exists: await this.userRepo.exists({ where: { email } }) };
    }
    async uploadProfileImage(userId, file) {
        if (!file?.buffer?.length) {
            throw new common_1.BadRequestException('파일을 첨부하지 않았습니다.');
        }
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.BadRequestException('유저를 찾지 못하였습니다');
        const url = await this.uploadToSupabase(file);
        user.orgFileName = file.originalname;
        user.profileImagePath = url;
        await this.userRepo.save(user);
        return url;
    }
    async uploadToSupabase(file) {
        const base = this.config.get('SUPABASE_URL');
        const key = this.config.get('SUPABASE_SERVICE_ROLE_KEY');
        const bucket = this.config.get('STORAGE_BUCKET_NAME') ?? 'jimmit';
        if (!base || !key) {
            throw new common_1.BadRequestException('Supabase 스토리지 설정이 없습니다.');
        }
        const ext = file.originalname.includes('.')
            ? file.originalname.slice(file.originalname.lastIndexOf('.') + 1)
            : 'bin';
        const path = `profile/${(0, crypto_1.randomUUID)()}.${ext}`;
        const uploadUrl = `${base.replace(/\/$/, '')}/storage/v1/object/${bucket}/${path}`;
        await (0, rxjs_1.firstValueFrom)(this.http.post(uploadUrl, file.buffer, {
            headers: {
                Authorization: `Bearer ${key}`,
                'Content-Type': file.mimetype || 'application/octet-stream',
                'x-upsert': 'true',
            },
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
        }));
        return `${base.replace(/\/$/, '')}/storage/v1/object/public/${bucket}/${path}`;
    }
    async replacePreferredGenres(userId, genres) {
        const user = await this.userRepo.findOneByOrFail({ id: userId });
        for (let i = 0; i < genres.length; i++) {
            await this.pgRepo.save(this.pgRepo.create({ user, name: genres[i], priority: i }));
        }
    }
    async replacePreferredSessions(userId, sessions) {
        const user = await this.userRepo.findOneByOrFail({ id: userId });
        for (let i = 0; i < sessions.length; i++) {
            await this.pbsRepo.save(this.pbsRepo.create({ user, name: sessions[i], priority: i }));
        }
    }
    buildUserResponse(user, totalCreated, completed) {
        const preferredGenres = (user.preferredGenres ?? [])
            .sort((a, b) => a.priority - b.priority)
            .map((g) => g.name);
        const preferredBandSessions = (user.userBandSessions ?? [])
            .sort((a, b) => a.priority - b.priority)
            .map((s) => s.name);
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            nickname: user.nickname,
            profileImagePath: user.profileImagePath,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            preferredGenres,
            preferredBandSessions,
            totalCreatedGatheringCount: totalCreated,
            completedGatheringCount: completed,
        };
    }
};
exports.JammitUserService = JammitUserService;
exports.JammitUserService = JammitUserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.JammitUser)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.PreferredGenre)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.PreferredBandSession)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.Gathering)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, typeof (_e = typeof axios_1.HttpService !== "undefined" && axios_1.HttpService) === "function" ? _e : Object, typeof (_f = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _f : Object])
], JammitUserService);


/***/ }),
/* 64 */
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),
/* 65 */
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),
/* 66 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentModule = void 0;
const entities_1 = __webpack_require__(13);
const axios_1 = __webpack_require__(28);
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(12);
const comment_controller_1 = __webpack_require__(67);
const comment_service_1 = __webpack_require__(70);
let CommentModule = class CommentModule {
};
exports.CommentModule = CommentModule;
exports.CommentModule = CommentModule = __decorate([
    (0, common_1.Module)({
        providers: [comment_service_1.CommentService],
        imports: [typeorm_1.TypeOrmModule.forFeature([entities_1.Video, entities_1.Comment]), axios_1.HttpModule],
        controllers: [comment_controller_1.CommentController],
        exports: [comment_service_1.CommentService],
    })
], CommentModule);


/***/ }),
/* 67 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentController = void 0;
const current_user_decorator_1 = __webpack_require__(68);
const auth_guard_1 = __webpack_require__(50);
const user_dto_1 = __webpack_require__(69);
const common_1 = __webpack_require__(4);
const swagger_1 = __webpack_require__(6);
const comment_service_1 = __webpack_require__(70);
const comment_dto_1 = __webpack_require__(71);
let CommentController = class CommentController {
    constructor(commentService) {
        this.commentService = commentService;
    }
    async getComment(videoId, page, take) {
        return this.commentService.getComment(videoId, page, take);
    }
    async createComment(body, user) {
        return this.commentService.createComment(body, user);
    }
};
exports.CommentController = CommentController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '댓글 목록', description: '영상별 페이지네이션' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '페이지네이션 객체 (data: 댓글 항목 배열)',
        schema: {
            example: {
                totalCount: 0,
                totalPage: 1,
                page: 1,
                data: [],
                message: '영상에 달린 댓글 리스트를 조회했습니다.',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '조회 실패(잘못된 요청 등)' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: '서버 오류' }),
    (0, swagger_1.ApiQuery)({ name: 'videoId', required: true, example: 'xxx-uuid', description: '영상 UUID' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: true, example: 1, description: '페이지 (1부터)' }),
    (0, swagger_1.ApiQuery)({ name: 'take', required: true, example: 10, description: '페이지 크기' }),
    (0, common_1.Get)(''),
    __param(0, (0, common_1.Query)('videoId')),
    __param(1, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('take', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "getComment", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '댓글 작성' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '작성된 댓글 요약' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '미인증' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '영상 없음' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: '댓글 쓰기 중 오류' }),
    (0, swagger_1.ApiBody)({ type: comment_dto_1.CreateCommentDto }),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.Post)(''),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof comment_dto_1.CreateCommentDto !== "undefined" && comment_dto_1.CreateCommentDto) === "function" ? _b : Object, typeof (_c = typeof user_dto_1.CreateUserDto !== "undefined" && user_dto_1.CreateUserDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], CommentController.prototype, "createComment", null);
exports.CommentController = CommentController = __decorate([
    (0, swagger_1.ApiTags)('Comment'),
    (0, common_1.Controller)('comment'),
    __metadata("design:paramtypes", [typeof (_a = typeof comment_service_1.CommentService !== "undefined" && comment_service_1.CommentService) === "function" ? _a : Object])
], CommentController);


/***/ }),
/* 68 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.User = exports.CurrentUser = void 0;
const common_1 = __webpack_require__(4);
exports.CurrentUser = (0, common_1.createParamDecorator)((_data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
});
exports.User = exports.CurrentUser;


/***/ }),
/* 69 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateUserDto = void 0;
const swagger_1 = __webpack_require__(6);
const class_validator_1 = __webpack_require__(45);
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'user@example.com', description: '이메일' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '트탈라레오', description: '사용자 이름' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '퉁퉁퉁퉁퉁퉁사후르', description: '사용자 닉네임' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "nickname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: '유저 고유아이디',
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CreateUserDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://torip.s3.ap-northeast-2.amazonaws.com/profile/fa66881a-e362-4f34-84c8-1679a2332295.svg', description: '사용자 프로필' }),
    (0, class_validator_1.IsBase64)(),
    __metadata("design:type", String)
], CreateUserDto.prototype, "profileImagePath", void 0);


/***/ }),
/* 70 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommentService = void 0;
const entities_1 = __webpack_require__(13);
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(12);
const typeorm_2 = __webpack_require__(15);
let CommentService = class CommentService {
    constructor(commentRepository, videoRepository) {
        this.commentRepository = commentRepository;
        this.videoRepository = videoRepository;
    }
    async getComment(videoId, page = 1, take = 10) {
        try {
            const currentPage = Math.max(1, page);
            const pageSize = Math.max(1, Math.min(100, take));
            const skip = (currentPage - 1) * pageSize;
            const queryBuilder = this.commentRepository
                .createQueryBuilder('comment')
                .leftJoinAndSelect('comment.user', 'user')
                .where('comment.videoId = :videoId', { videoId })
                .orderBy('comment.createdAt', 'DESC');
            const [results, totalCount] = await queryBuilder
                .skip(skip)
                .take(pageSize)
                .getManyAndCount();
            const data = results.map((comment) => ({
                id: comment.id,
                content: comment.content,
                nickname: comment.user?.nickname || comment.user?.username || '알 수 없음',
                profileImagePath: comment.user?.profileImagePath || null,
                createdAt: comment.createdAt,
                userId: comment.user.id,
            }));
            const totalPage = Math.ceil(totalCount / pageSize);
            return {
                totalCount,
                totalPage,
                page,
                data,
                message: '영상에 달린 댓글 리스트를 조회했습니다.',
            };
        }
        catch (error) {
            console.error('댓글 리스트 조회 오류:', error);
            throw new common_1.BadRequestException('영상에 달린 댓글 리스트를 불러오는 중 오류가 발생했습니다.');
        }
    }
    async createComment(body, info) {
        try {
            const video = await this.videoRepository.findOneByOrFail({
                id: body.videoId,
            });
            const comment = this.commentRepository.create({
                content: body.content,
                user: { id: info.id },
                video,
            });
            const saved = await this.commentRepository.save(comment);
            return {
                id: saved.id,
                content: saved.content,
                createdAt: saved.createdAt,
                nickname: info.nickname,
                profileImagePath: info.profileImagePath || null,
            };
        }
        catch (error) {
            console.error('댓글 쓰기 오류:', error);
            throw new common_1.BadRequestException('댓글 쓰기 중 오류가 발생했습니다.');
        }
    }
};
exports.CommentService = CommentService;
exports.CommentService = CommentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Comment)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Video)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object])
], CommentService);


/***/ }),
/* 71 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.GetCommentDto = exports.CreateCommentDto = void 0;
const swagger_1 = __webpack_require__(6);
const class_validator_1 = __webpack_require__(45);
class CreateCommentDto {
}
exports.CreateCommentDto = CreateCommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'b1a8f3e1-3b0f-4e9b-98a2-c4f0e6d3a3b4',
        description: '영상 UUID',
    }),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "videoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "탕탕후루후루 탕탕 후루루루루",
        description: '댓글내용',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(200),
    __metadata("design:type", String)
], CreateCommentDto.prototype, "content", void 0);
class GetCommentDto {
}
exports.GetCommentDto = GetCommentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'abc123-uuid', description: '댓글 ID' }),
    __metadata("design:type", String)
], GetCommentDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'u123', description: '작성자 유저 ID' }),
    __metadata("design:type", String)
], GetCommentDto.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '김코드', description: '작성자 닉네임' }),
    __metadata("design:type", String)
], GetCommentDto.prototype, "nickname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://cdn.example.com/profile.jpg', description: '작성자 프로필 이미지' }),
    __metadata("design:type", String)
], GetCommentDto.prototype, "profileImage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '이 영상 너무 좋아요!', description: '댓글 내용' }),
    __metadata("design:type", String)
], GetCommentDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2025-06-20T12:34:56.000Z', description: '작성일시' }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], GetCommentDto.prototype, "createdAt", void 0);


/***/ }),
/* 72 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoggerMiddleware = void 0;
const common_1 = __webpack_require__(4);
let LoggerMiddleware = class LoggerMiddleware {
    constructor() {
        this.logger = new common_1.Logger('HTTP');
    }
    use(req, res, next) {
        const { ip, method, originalUrl } = req;
        const userAgent = req.get('user-agent') || '';
        res.on('finish', () => {
            const { statusCode } = res;
            const contentLength = res.get('content-length');
            this.logger.log(`${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`);
        });
        next();
    }
};
exports.LoggerMiddleware = LoggerMiddleware;
exports.LoggerMiddleware = LoggerMiddleware = __decorate([
    (0, common_1.Injectable)()
], LoggerMiddleware);


/***/ }),
/* 73 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VideoModule = void 0;
const entities_1 = __webpack_require__(13);
const entities_2 = __webpack_require__(13);
const mux_service_1 = __webpack_require__(74);
const redis_module_1 = __webpack_require__(31);
const axios_1 = __webpack_require__(28);
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(12);
const video_controller_1 = __webpack_require__(76);
const video_service_1 = __webpack_require__(81);
let VideoModule = class VideoModule {
};
exports.VideoModule = VideoModule;
exports.VideoModule = VideoModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([entities_2.Video, entities_1.JammitUser, entities_2.Like]),
            axios_1.HttpModule,
            redis_module_1.RedisModule,
        ],
        controllers: [video_controller_1.VideoController],
        providers: [video_service_1.VideoService, mux_service_1.MuxService],
        exports: [video_service_1.VideoService],
    })
], VideoModule);


/***/ }),
/* 74 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MuxService = void 0;
const mux_node_1 = __importDefault(__webpack_require__(75));
const common_1 = __webpack_require__(4);
const config_1 = __webpack_require__(29);
let MuxService = class MuxService {
    constructor(configService) {
        this.configService = configService;
        try {
            const tokenId = this.configService.get('MUX_ACCESS_TOKEN');
            const tokenSecret = this.configService.get('MUX_SECRET_KEY');
            this.mux = new mux_node_1.default({ tokenId, tokenSecret });
            this.video = this.mux.video;
        }
        catch (error) {
            console.error('Mux 초기화 실패:', error);
        }
    }
    async createDirectUpload(_info) {
        try {
            const upload = await this.video.uploads.create({
                new_asset_settings: {
                    playback_policy: ['public'],
                },
                cors_origin: process.env.NODE_ENV === 'production'
                    ? process.env.FRONTEND_URL_NEXT
                    : process.env.FRONTEND_URL,
            });
            return { uploadUrl: upload.url, uploadId: upload.id };
        }
        catch (error) {
            console.error('업로드 URL 생성 실패:', error);
            throw new Error('업로드 URL을 생성하는 데 실패했습니다.');
        }
    }
    async deleteAsset(assetId, _info) {
        try {
            await this.mux.video.assets.delete(assetId);
            return { success: true };
        }
        catch (error) {
            console.error('Mux 영상 삭제 실패:', error);
            throw new Error('Mux 영상 삭제에 실패했습니다.');
        }
    }
};
exports.MuxService = MuxService;
exports.MuxService = MuxService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], MuxService);


/***/ }),
/* 75 */
/***/ ((module) => {

"use strict";
module.exports = require("@mux/mux-node");

/***/ }),
/* 76 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VideoController = void 0;
const current_user_decorator_1 = __webpack_require__(68);
const auth_optional_guard_1 = __webpack_require__(77);
const auth_guard_1 = __webpack_require__(50);
const mux_service_1 = __webpack_require__(74);
const common_1 = __webpack_require__(4);
const platform_express_1 = __webpack_require__(62);
const swagger_1 = __webpack_require__(6);
const express_1 = __webpack_require__(35);
const multer = __importStar(__webpack_require__(78));
const mux_dto_1 = __webpack_require__(79);
const user_dto_1 = __webpack_require__(69);
const video_dto_1 = __webpack_require__(80);
const video_service_1 = __webpack_require__(81);
let VideoController = class VideoController {
    constructor(videoService, muxService) {
        this.videoService = videoService;
        this.muxService = muxService;
    }
    async getVideosWithPagination(page, take, order) {
        return this.videoService.getVideosWithPagination(take, page, order);
    }
    async getMyVideos(user, userId, page, take, order) {
        const targetUserId = userId ?? user.id;
        return this.videoService.getMyVideos(targetUserId, take, page, order);
    }
    async getMyVideoTotal(user, userId) {
        const targetUserId = userId ?? user.id;
        return this.videoService.getMyVideoTotal(targetUserId);
    }
    async getMuxStatus(uploadId) {
        return this.videoService.getAssetStatus(uploadId);
    }
    async getVideosWithDetail(videoId) {
        return this.videoService.getVideosWithDetail(videoId);
    }
    async toggleLike(videoId, user) {
        return this.videoService.toggleLike(videoId, user);
    }
    async getLikeStatus(videoId, user) {
        return this.videoService.getLikeStatus(videoId, user.id);
    }
    async getUploadUrl(user) {
        return this.muxService.createDirectUpload(user);
    }
    async registerMuxVideo(body, user) {
        return this.videoService.registerMuxVideo(user, body);
    }
    async muxWebHook(req, res) {
        return this.videoService.muxWebHook(req, res);
    }
    async viewCountVideos(videoId, req, user, ip) {
        const clientIp = ip || req.socket.remoteAddress || 'unknown';
        return this.videoService.viewCountVideos(videoId, user, clientIp);
    }
    async deleteVideo(videoId, userId) {
        return this.videoService.deleteVideo(videoId, userId.id);
    }
};
exports.VideoController = VideoController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '전체 영상 목록' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '페이지네이션된 영상 목록',
        type: [video_dto_1.VideoListFlatDto],
    }),
    (0, swagger_1.ApiResponse)({ status: 500, description: '목록 조회 실패' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: true, example: 1, description: '페이지 (1부터)' }),
    (0, swagger_1.ApiQuery)({ name: 'take', required: true, example: 10, description: '페이지 크기' }),
    (0, swagger_1.ApiQuery)({ name: 'order', required: true, enum: ['latest', 'popular'], example: 'latest' }),
    (0, common_1.Get)(''),
    __param(0, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)('take', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)('order')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "getVideosWithPagination", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: '유저별 업로드 영상 목록' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '해당 유저가 올린 영상',
        type: video_dto_1.VideoListFlatDto,
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '미인증' }),
    (0, swagger_1.ApiQuery)({
        name: 'userId',
        required: false,
        example: 1,
        description: 'Jammit users.id — 없으면 토큰 유저 본인',
    }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: true, example: 1 }),
    (0, swagger_1.ApiQuery)({ name: 'take', required: true, example: 10 }),
    (0, swagger_1.ApiQuery)({ name: 'order', required: true, enum: ['latest', 'popular'] }),
    (0, common_1.Get)('user'),
    __param(0, (0, current_user_decorator_1.User)()),
    __param(1, (0, common_1.Query)('userId', new common_1.ParseIntPipe({ optional: true }))),
    __param(2, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('take', common_1.ParseIntPipe)),
    __param(4, (0, common_1.Query)('order')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof user_dto_1.CreateUserDto !== "undefined" && user_dto_1.CreateUserDto) === "function" ? _c : Object, Number, Number, Number, String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "getMyVideos", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: '유저별 업로드 영상 개수' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '{ count, message }',
        schema: {
            example: {
                count: 12,
                message: '업로드한 영상 개수를 조회했습니다.',
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '미인증' }),
    (0, swagger_1.ApiQuery)({
        name: 'userId',
        required: false,
        example: 1,
        description: 'Jammit users.id — 없으면 본인',
    }),
    (0, common_1.Get)('user/count'),
    __param(0, (0, current_user_decorator_1.User)()),
    __param(1, (0, common_1.Query)('userId', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof user_dto_1.CreateUserDto !== "undefined" && user_dto_1.CreateUserDto) === "function" ? _d : Object, Number]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "getMyVideoTotal", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Mux 업로드 처리 상태', description: 'uploadId 기준 playback 준비 여부' }),
    (0, swagger_1.ApiQuery)({ name: 'uploadId', required: true, example: 'abc-upload-id' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        schema: {
            example: { playbackId: 'xxxxx', status: 'ready' },
        },
    }),
    (0, common_1.Get)('status'),
    __param(0, (0, common_1.Query)('uploadId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "getMuxStatus", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '영상 상세' }),
    (0, swagger_1.ApiParam)({ name: 'videoId', description: '영상 UUID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '상세 JSON', type: video_dto_1.VideoResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '영상 없음' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: '조회 오류' }),
    (0, common_1.Get)(':videoId'),
    __param(0, (0, common_1.Param)('videoId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "getVideosWithDetail", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: '좋아요 토글' }),
    (0, swagger_1.ApiParam)({ name: 'videoId', description: '영상 UUID' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: '좋아요/취소 결과',
        schema: {
            example: { message: '좋아요', liked: true, likeCount: 5 },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '미인증' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '영상 없음' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: '처리 오류' }),
    (0, common_1.Post)('like/:videoId'),
    __param(0, (0, common_1.Param)('videoId')),
    __param(1, (0, current_user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_e = typeof user_dto_1.CreateUserDto !== "undefined" && user_dto_1.CreateUserDto) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "toggleLike", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: '좋아요 여부·개수' }),
    (0, swagger_1.ApiParam)({ name: 'videoId' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        schema: { example: { liked: true, likeCount: 10 } },
    }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '미인증' }),
    (0, common_1.Get)('like-status/:videoId'),
    __param(0, (0, common_1.Param)('videoId')),
    __param(1, (0, current_user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_f = typeof user_dto_1.CreateUserDto !== "undefined" && user_dto_1.CreateUserDto) === "function" ? _f : Object]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "getLikeStatus", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Mux Direct Upload URL 발급' }),
    (0, swagger_1.ApiResponse)({ status: 201, type: mux_dto_1.MuxUploadResponseDto }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '미인증' }),
    (0, common_1.Post)('uploadUrl'),
    __param(0, (0, current_user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_g = typeof user_dto_1.CreateUserDto !== "undefined" && user_dto_1.CreateUserDto) === "function" ? _g : Object]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "getUploadUrl", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: '업로드 완료 후 영상 등록', description: 'Mux 메타와 제목·설명 등 저장' }),
    (0, swagger_1.ApiBody)({ type: mux_dto_1.RegisterMuxVideoDto }),
    (0, swagger_1.ApiResponse)({ status: 201, description: '등록 결과' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '미인증' }),
    (0, swagger_1.ApiResponse)({ status: 500, description: '등록 실패' }),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_h = typeof mux_dto_1.RegisterMuxVideoDto !== "undefined" && mux_dto_1.RegisterMuxVideoDto) === "function" ? _h : Object, typeof (_j = typeof user_dto_1.CreateUserDto !== "undefined" && user_dto_1.CreateUserDto) === "function" ? _j : Object]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "registerMuxVideo", null);
__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Mux 웹훅',
        description: 'Raw JSON body + Mux-Signature. Swagger에서는 서명 검증이 어려우므로 실제는 Mux/Postman 등으로 호출.',
    }),
    (0, swagger_1.ApiResponse)({ status: 200, description: '{ received: true }' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: '서명 불일치' }),
    (0, common_1.Post)('webhook/mux'),
    (0, common_1.HttpCode)(200),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_k = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _k : Object, typeof (_l = typeof express_1.Response !== "undefined" && express_1.Response) === "function" ? _l : Object]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "muxWebHook", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_optional_guard_1.AuthOptionalGuard),
    (0, swagger_1.ApiOperation)({
        summary: '조회수 증가',
        description: '로그인 시 회원 UUID 기준, 비로그인 시 IP. Authorization 헤더는 선택.',
    }),
    (0, swagger_1.ApiParam)({ name: 'videoId', description: '영상 UUID' }),
    (0, swagger_1.ApiHeader)({
        name: 'x-forwarded-for',
        required: false,
        description: '프록시 뒤 비회원 IP (선택)',
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        schema: {
            example: {
                message: '조회수 처리 완료',
                videoId: '3520e5b7-af1b-405c-af5c-b0511635c6fa',
                viewCount: 42,
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 400, description: '유저·IP 식별 불가' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '영상 없음' }),
    (0, common_1.Post)(':videoId'),
    __param(0, (0, common_1.Param)('videoId')),
    __param(1, (0, common_1.Req)()),
    __param(2, (0, current_user_decorator_1.User)()),
    __param(3, (0, common_1.Ip)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_m = typeof express_1.Request !== "undefined" && express_1.Request) === "function" ? _m : Object, typeof (_o = typeof user_dto_1.CreateUserDto !== "undefined" && user_dto_1.CreateUserDto) === "function" ? _o : Object, String]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "viewCountVideos", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)('access-token'),
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, swagger_1.ApiOperation)({ summary: '영상 삭제', description: '본인 업로드만' }),
    (0, swagger_1.ApiParam)({ name: 'videoId' }),
    (0, swagger_1.ApiResponse)({ status: 200, schema: { example: { message: '영상이 삭제되었습니다.' } } }),
    (0, swagger_1.ApiResponse)({ status: 401, description: '미인증' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: '권한 없음' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: '영상 없음' }),
    (0, common_1.Delete)(':videoId'),
    __param(0, (0, common_1.Param)('videoId')),
    __param(1, (0, current_user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, typeof (_p = typeof user_dto_1.CreateUserDto !== "undefined" && user_dto_1.CreateUserDto) === "function" ? _p : Object]),
    __metadata("design:returntype", Promise)
], VideoController.prototype, "deleteVideo", null);
exports.VideoController = VideoController = __decorate([
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('video', {
        storage: multer.memoryStorage(),
    })),
    (0, swagger_1.ApiTags)('Video'),
    (0, common_1.Controller)('video'),
    __metadata("design:paramtypes", [typeof (_a = typeof video_service_1.VideoService !== "undefined" && video_service_1.VideoService) === "function" ? _a : Object, typeof (_b = typeof mux_service_1.MuxService !== "undefined" && mux_service_1.MuxService) === "function" ? _b : Object])
], VideoController);


/***/ }),
/* 77 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthOptionalGuard = void 0;
const auth_verification_service_1 = __webpack_require__(46);
const bearer_token_util_1 = __webpack_require__(51);
const common_1 = __webpack_require__(4);
let AuthOptionalGuard = class AuthOptionalGuard {
    constructor(authVerifService) {
        this.authVerifService = authVerifService;
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const token = (0, bearer_token_util_1.extractBearerToken)(req.headers['authorization']);
        if (token) {
            try {
                const { profile, jammitUser } = await this.authVerifService.verifyTokenAndGetUser(token);
                req.user = profile;
                req.jammitUser = jammitUser;
            }
            catch {
            }
        }
        return true;
    }
};
exports.AuthOptionalGuard = AuthOptionalGuard;
exports.AuthOptionalGuard = AuthOptionalGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_verification_service_1.AuthVerificationService !== "undefined" && auth_verification_service_1.AuthVerificationService) === "function" ? _a : Object])
], AuthOptionalGuard);


/***/ }),
/* 78 */
/***/ ((module) => {

"use strict";
module.exports = require("multer");

/***/ }),
/* 79 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RegisterMuxVideoDto = exports.MuxUploadResponseDto = void 0;
const swagger_1 = __webpack_require__(6);
const class_validator_1 = __webpack_require__(45);
const video_dto_1 = __webpack_require__(80);
class MuxUploadResponseDto {
}
exports.MuxUploadResponseDto = MuxUploadResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://storage.mux.com/abc123...',
        description: '프론트에서 사용할 Direct Upload URL',
    }),
    __metadata("design:type", String)
], MuxUploadResponseDto.prototype, "uploadUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'upload-xyz456',
        description: 'Mux 업로드 식별자 ID (uploadId)',
    }),
    __metadata("design:type", String)
], MuxUploadResponseDto.prototype, "uploadId", void 0);
class RegisterMuxVideoDto extends video_dto_1.VideoUploadDto {
}
exports.RegisterMuxVideoDto = RegisterMuxVideoDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'upload-xyz456',
        description: '업로드 아이디',
        required: true,
    }),
    __metadata("design:type", String)
], RegisterMuxVideoDto.prototype, "uploadId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://picsum.photos/200/300',
        description: '썸네일 이미지 URL',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterMuxVideoDto.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: '상세페이지 아이디',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], RegisterMuxVideoDto.prototype, "slug", void 0);


/***/ }),
/* 80 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VideoResponseDto = exports.VideoListFlatDto = exports.VideoListDto = exports.VideoUploadDto = void 0;
const swagger_1 = __webpack_require__(6);
const class_validator_1 = __webpack_require__(45);
class VideoUploadDto {
}
exports.VideoUploadDto = VideoUploadDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '재미있게 합주한 아이스크림',
        description: '비디오 제목',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VideoUploadDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '다같이 아이스크림 췃어요',
        description: '비디오 설명',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(300),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], VideoUploadDto.prototype, "description", void 0);
class VideoListDto {
}
exports.VideoListDto = VideoListDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'b1a8f3e1-3b0f-4e9b-98a2-c4f0e6d3a3b4',
        description: '영상 UUID',
    }),
    __metadata("design:type", String)
], VideoListDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '재미있게 합주한 아이스크림',
        description: '비디오 제목',
    }),
    __metadata("design:type", String)
], VideoListDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'https://picsum.photos/200/300',
        description: '썸네일 이미지 URL',
    }),
    __metadata("design:type", String)
], VideoListDto.prototype, "thumbnailUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2023-05-09T12:34:56Z', description: '생성일' }),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], VideoListDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '퉁퉁퉁퉁퉁퉁사후르', description: '사용자 닉네임' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VideoListDto.prototype, "nickname", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: "00:00:30",
        description: '비디오 길이',
    }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", String)
], VideoListDto.prototype, "duration", void 0);
class VideoListFlatDto {
}
exports.VideoListFlatDto = VideoListFlatDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], VideoListFlatDto.prototype, "page", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], VideoListFlatDto.prototype, "take", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], VideoListFlatDto.prototype, "total", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], VideoListFlatDto.prototype, "totalPages", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [VideoListDto] }),
    __metadata("design:type", Array)
], VideoListFlatDto.prototype, "data", void 0);
class VideoResponseDto extends VideoListDto {
}
exports.VideoResponseDto = VideoResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '다같이 아이스크림 췃어요',
        description: '비디오 설명',
    }),
    __metadata("design:type", String)
], VideoResponseDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'C52Fu8r79UfIp1GX02jE8lnLBE4th5E2TwC7YfTaYnwU',
        description: '비디오 재생 URL',
    }),
    __metadata("design:type", String)
], VideoResponseDto.prototype, "playbackId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 103, description: '조회수' }),
    __metadata("design:type", Number)
], VideoResponseDto.prototype, "viewCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: '유저 고유아이디',
    }),
    (0, swagger_1.ApiProperty)({ example: 7, description: '좋아요 수' }),
    __metadata("design:type", Number)
], VideoResponseDto.prototype, "likeCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 4, description: '댓글 수' }),
    __metadata("design:type", Number)
], VideoResponseDto.prototype, "commentCount", void 0);


/***/ }),
/* 81 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.VideoService = void 0;
const entities_1 = __webpack_require__(13);
const mux_service_1 = __webpack_require__(74);
const redis_service_1 = __webpack_require__(32);
const common_1 = __webpack_require__(4);
const typeorm_1 = __webpack_require__(12);
const crypto = __importStar(__webpack_require__(64));
const dayjs_1 = __importDefault(__webpack_require__(82));
const typeorm_2 = __webpack_require__(15);
let VideoService = class VideoService {
    constructor(videoRepository, likeRepository, redisService, muxService) {
        this.videoRepository = videoRepository;
        this.likeRepository = likeRepository;
        this.redisService = redisService;
        this.muxService = muxService;
    }
    async getVideosWithDetail(videoId) {
        try {
            const video = await this.videoRepository
                .createQueryBuilder('video')
                .leftJoinAndSelect('video.user', 'user')
                .select([
                'video.id AS id',
                'video.title AS title',
                'video.description AS description',
                'video.playbackId AS playbackId',
                'video.viewCount AS viewCount',
                'video.createdAt AS createdAt',
                'video.thumbnailUrl AS thumbnailUrl',
                'video.slug AS slug',
                'user.nickname AS nickname',
                'user.username AS username',
                'user.id AS userId',
            ])
                .where('video.id = :videoId', { videoId })
                .getRawOne();
            if (!video) {
                throw new common_1.NotFoundException('해당 영상이 존재하지 않습니다.');
            }
            const raw = video;
            console.log('raw', raw);
            return {
                id: raw.id,
                title: raw.title,
                playbackId: raw.playbackid,
                viewCount: Number(raw.viewcount ?? 0),
                creatorThumbnailUrl: raw.thumbnailurl,
                creatorName: (raw.nickname ?? raw.username),
                creatorTitle: null,
                slug: raw.slug,
                description: raw.description,
                nickname: raw.nickname,
                userId: raw.userid,
                thumbnailUrl: raw.thumbnailurl,
                createdAt: raw.createdat,
            };
        }
        catch (error) {
            console.error('영상 상세 조회 오류:', error);
            throw new common_1.BadRequestException('영상 상세데이터를 불러오는 중 오류가 발생했습니다.');
        }
    }
    async isVideoLikedByUser(videoId, userId) {
        const count = await this.likeRepository.count({
            where: { video: { id: videoId }, user: { id: userId } },
        });
        return count > 0;
    }
    async getLikeStatus(videoId, userId) {
        const likeCount = await this.likeRepository.count({
            where: { video: { id: videoId } },
        });
        const liked = await this.isVideoLikedByUser(videoId, userId);
        return { liked, likeCount };
    }
    async toggleLike(videoId, info) {
        try {
            if (!info?.id) {
                throw new common_1.UnauthorizedException('로그인이 필요합니다.');
            }
            const jammitId = info.id;
            const videoEx = await this.videoRepository
                .createQueryBuilder('video')
                .where('video.id = :video', { video: videoId })
                .getExists();
            if (!videoEx) {
                throw new common_1.NotFoundException('존재하지 않는 영상입니다.');
            }
            const likeEx = await this.likeRepository
                .createQueryBuilder('like')
                .where('like.userId = :userId', { userId: jammitId })
                .andWhere('like.videoId = :videoId', { videoId })
                .getOne();
            if (likeEx) {
                await this.likeRepository.remove(likeEx);
            }
            else {
                await this.likeRepository
                    .createQueryBuilder()
                    .insert()
                    .into('like')
                    .values({ user: { id: jammitId }, video: { id: videoId } })
                    .execute();
            }
            const likeRaw = await this.likeRepository
                .createQueryBuilder('like')
                .select('COUNT(*)', 'likeCount')
                .where('like.videoId = :videoId', { videoId })
                .getRawOne();
            const rawLike = likeRaw;
            return {
                message: likeEx ? '좋아요 취소' : '좋아요',
                liked: !likeEx,
                likeCount: Number(rawLike?.likecount ?? rawLike?.likeCount ?? 0),
            };
        }
        catch (error) {
            console.error('좋아요 처리 오류:', error);
            throw new common_1.BadRequestException('좋아요 처리 중 오류가 발생했습니다.');
        }
    }
    async muxWebHook(req, res) {
        const rawBuf = req.body;
        const rawBody = rawBuf.toString('utf8');
        const signature = req.headers['mux-signature'];
        if (!signature)
            return res.status(403).send('Missing signature');
        const [tPart, v1Part] = signature.split(',');
        const timestamp = tPart.slice(2);
        const provided = v1Part.slice(3);
        const secretRaw = process.env.MUX_WEBHOOK_SECRET;
        if (!secretRaw) {
            return res.status(500).send('Webhook secret not configured');
        }
        const secret = secretRaw.trim();
        const hmacInput = Buffer.concat([
            Buffer.from(timestamp + '.', 'utf8'),
            rawBuf
        ]);
        const expected = crypto
            .createHmac('sha256', secret)
            .update(hmacInput)
            .digest('hex');
        const isValid = crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(provided, 'hex'));
        if (!isValid) {
            console.warn('MUX Webhook Signature Invalid');
            return res.status(403).send('Invalid signature');
        }
        const payload = JSON.parse(rawBody);
        if (payload.type === 'video.asset.ready') {
            const asset = payload.data;
            const playbackId = asset.playback_ids?.[0]?.id;
            const uploadId = asset.upload_id;
            const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`;
            const playbackUrl = `https://stream.mux.com/${playbackId}.m3u8`;
            const video = await this.videoRepository.findOne({
                where: { uploadId },
            });
            const totalSeconds = Math.floor(asset.duration);
            const hours = Math.floor(totalSeconds / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);
            const seconds = totalSeconds % 60;
            const hh = String(hours).padStart(2, '0');
            const mm = String(minutes).padStart(2, '0');
            const ss = String(seconds).padStart(2, '0');
            const formatted = hh === '00' ? `${mm}:${ss}` : `${hh}:${mm}:${ss}`;
            if (video) {
                video.playbackId = playbackId;
                video.thumbnailUrl = thumbnailUrl;
                video.videoUrl = playbackUrl;
                video.duration = formatted;
                video.assetId = asset.id;
                await this.videoRepository.save(video);
            }
        }
        return res.status(200).json({ received: true });
    }
    async registerMuxVideo(info, body) {
        try {
            const video = this.videoRepository.create({
                title: body.title,
                description: body.description,
                user: { id: info.id },
                uploadId: body.uploadId,
                thumbnailUrl: body.thumbnailUrl ?? null,
                slug: body.slug ?? null,
            });
            const savedVideo = await this.videoRepository.save(video);
            return {
                message: '영상 등록 완료',
                id: savedVideo.id,
                title: savedVideo.title,
                thumbnailUrl: savedVideo.thumbnailUrl,
                nickname: info.nickname,
                createdAt: savedVideo.createdAt,
                viewCount: savedVideo.viewCount,
                duration: savedVideo.duration,
            };
        }
        catch (error) {
            console.error('영상 등록 오류:', error);
            throw new common_1.InternalServerErrorException('영상 등록 중 오류가 발생했습니다.');
        }
    }
    async viewCountVideos(videoId, info, ip) {
        try {
            let userIdForRedis;
            if (info?.id != null) {
                userIdForRedis = String(info.id);
            }
            else if (ip) {
                userIdForRedis = `guest:${ip}`;
            }
            else {
                throw new common_1.BadRequestException('유저 식별이 불가능합니다.');
            }
            const key = `view:${userIdForRedis}:${videoId}`;
            const view = await this.redisService.existsCount(key);
            if (!view) {
                await this.redisService.saveCount(key, '1');
                const video = await this.videoRepository.findOneBy({ id: videoId });
                if (!video)
                    throw new common_1.NotFoundException('존재하지 않는 영상입니다.');
                video.viewCount += 1;
                await this.videoRepository.save(video);
            }
            const video = await this.videoRepository.findOneBy({ id: videoId });
            if (!video)
                throw new common_1.NotFoundException('존재하지 않는 영상입니다.');
            return {
                message: '조회수 처리 완료',
                videoId: video.id,
                viewCount: video.viewCount,
            };
        }
        catch (error) {
            console.error('조회수 처리 오류:', error);
            throw new common_1.BadRequestException('조회수 처리 중 오류가 발생했습니다.');
        }
    }
    async getVideosWithPagination(limit = 10, page = 1, order) {
        try {
            const safePage = Math.max(1, page);
            const skip = Math.max(0, (safePage - 1) * limit);
            const [results, total] = await this.videoRepository
                .createQueryBuilder('video')
                .leftJoinAndSelect('video.user', 'user')
                .orderBy(order === 'latest' ? 'video.createdAt' : 'video.viewCount', 'DESC')
                .skip(skip)
                .take(limit)
                .getManyAndCount();
            const data = results.map((v) => ({
                id: v.id,
                title: v.title,
                thumbnailUrl: v.thumbnailUrl,
                nickname: v.user?.nickname ?? v.user?.username,
                createdAt: v.createdAt,
                viewCount: v.viewCount,
                duration: v.duration
            }));
            const weekTopVideo = await this.videoRepository
                .createQueryBuilder('video')
                .where('video.createdAt >= :weekStart', {
                weekStart: (0, dayjs_1.default)().startOf('week').toDate()
            })
                .orderBy('video.viewCount', 'DESC')
                .addOrderBy('video.createdAt', 'ASC')
                .select(['video.id'])
                .getOne();
            return {
                totalPage: Math.ceil(total / limit),
                page: Math.floor(skip / limit) + 1,
                data,
                message: '전체 영상 목록을 조회했습니다.',
                weekTopVideo
            };
        }
        catch (error) {
            console.error('영상 목록 조회 오류:', error);
            throw new common_1.BadRequestException('영상 목록을 불러오는 중 오류가 발생했습니다.');
        }
    }
    async getMyVideos(userInfo, limit = 10, page = 1, order) {
        try {
            const safePage = Math.max(1, page);
            const skip = Math.max(0, (safePage - 1) * limit);
            const [video, total] = await this.videoRepository
                .createQueryBuilder('video')
                .leftJoinAndSelect('video.user', 'user')
                .where('video.userId = :jammitId', { jammitId: userInfo })
                .orderBy(order === 'latest' ? 'video.createdAt' : 'video.viewCount', 'DESC')
                .skip(skip)
                .take(limit)
                .getManyAndCount();
            const data = video.map((v) => ({
                id: v.id,
                title: v.title,
                thumbnailUrl: v.thumbnailUrl,
                nickname: v.user?.nickname ?? v.user?.username,
                createdAt: v.createdAt,
                viewCount: v.viewCount,
                duration: v.duration
            }));
            return {
                totalPage: Math.ceil(total / limit),
                page: Math.floor(skip / limit) + 1,
                data,
                message: '유저 영상 목록을 조회했습니다.',
            };
        }
        catch (error) {
            console.error('내 영상 목록 조회 오류:', error);
            throw new common_1.BadRequestException('영상 목록을 불러오는 중 오류가 발생했습니다.');
        }
    }
    async getMyVideoTotal(userInfo) {
        try {
            const count = await this.videoRepository
                .createQueryBuilder('video')
                .where('video.userId = :jammitId', { jammitId: userInfo })
                .getCount();
            return {
                count,
                message: '업로드한 영상 개수를 조회했습니다.',
            };
        }
        catch (error) {
            console.error('영상 개수 조회 오류:', error);
            throw new common_1.BadRequestException('영상 개수를 불러오는 중 오류가 발생했습니다.');
        }
    }
    async deleteVideo(videoId, userId) {
        const video = await this.videoRepository.findOne({
            where: { id: videoId },
            relations: ['user'],
        });
        if (!video)
            throw new common_1.NotFoundException('영상이 존재하지 않습니다.');
        if (video.user.id !== userId)
            throw new common_1.ForbiddenException('삭제 권한이 없습니다.');
        try {
            await this.muxService.deleteAsset(video.assetId, {
                email: video.user.email,
                nickname: video.user.nickname ?? video.user.username,
            });
            await this.videoRepository.remove(video);
            return { message: '영상이 삭제되었습니다.' };
        }
        catch (error) {
            console.error('영상 삭제 오류:', error);
            throw new common_1.InternalServerErrorException('영상 삭제 중 오류가 발생했습니다.');
        }
    }
    async getAssetStatus(uploadId) {
        const video = await this.videoRepository.findOne({ where: { uploadId } });
        return { playbackId: video?.playbackId || null, status: video?.playbackId ? 'ready' : 'preparing' };
    }
};
exports.VideoService = VideoService;
exports.VideoService = VideoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Video)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Like)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof redis_service_1.RedisService !== "undefined" && redis_service_1.RedisService) === "function" ? _c : Object, typeof (_d = typeof mux_service_1.MuxService !== "undefined" && mux_service_1.MuxService) === "function" ? _d : Object])
], VideoService);


/***/ }),
/* 82 */
/***/ ((module) => {

"use strict";
module.exports = require("dayjs");

/***/ }),
/* 83 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const common_1 = __webpack_require__(4);
const swagger_1 = __webpack_require__(6);
const app_service_1 = __webpack_require__(84);
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
};
exports.AppController = AppController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: '헬스 체크', description: '서버 동작 여부 확인용' }),
    (0, swagger_1.ApiOkResponse)({
        description: '정상 응답',
        schema: { type: 'string', example: 'Hello World!' },
    }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiTags)('App'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);


/***/ }),
/* 84 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const common_1 = __webpack_require__(4);
let AppService = class AppService {
    getHello() {
        return 'Hello World!';
    }
};
exports.AppService = AppService;
exports.AppService = AppService = __decorate([
    (0, common_1.Injectable)()
], AppService);


/***/ }),
/* 85 */
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("main." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("917bfcdecf3a3c0401e4")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises = 0;
/******/ 		var blockingPromisesWaiting = [];
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId, fetchPriority) {
/******/ 				return trackBlockingPromise(require.e(chunkId, fetchPriority));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				// inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results).then(function () {});
/******/ 		}
/******/ 		
/******/ 		function unblock() {
/******/ 			if (--blockingPromises === 0) {
/******/ 				setStatus("ready").then(function () {
/******/ 					if (blockingPromises === 0) {
/******/ 						var list = blockingPromisesWaiting;
/******/ 						blockingPromisesWaiting = [];
/******/ 						for (var i = 0; i < list.length; i++) {
/******/ 							list[i]();
/******/ 						}
/******/ 					}
/******/ 				});
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 				/* fallthrough */
/******/ 				case "prepare":
/******/ 					blockingPromises++;
/******/ 					promise.then(unblock, unblock);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises === 0) return fn();
/******/ 			return new Promise(function (resolve) {
/******/ 				blockingPromisesWaiting.push(function () {
/******/ 					resolve(fn());
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules,
/******/ 									update.css
/******/ 								);
/******/ 								return promises;
/******/ 							}, [])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								}
/******/ 								return setStatus("ready").then(function () {
/******/ 									return updatedModules;
/******/ 								});
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error(
/******/ 						"apply() is only allowed in ready status (state: " +
/******/ 							currentStatus +
/******/ 							")"
/******/ 					);
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 		
/******/ 			var onAccepted = function () {
/******/ 				return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 					// handle errors in accept handlers and self accepted module load
/******/ 					if (error) {
/******/ 						return setStatus("fail").then(function () {
/******/ 							throw error;
/******/ 						});
/******/ 					}
/******/ 		
/******/ 					if (queuedInvalidatedModules) {
/******/ 						return internalApply(options).then(function (list) {
/******/ 							outdatedModules.forEach(function (moduleId) {
/******/ 								if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 							});
/******/ 							return list;
/******/ 						});
/******/ 					}
/******/ 		
/******/ 					return setStatus("idle").then(function () {
/******/ 						return outdatedModules;
/******/ 					});
/******/ 				});
/******/ 			};
/******/ 		
/******/ 			return Promise.all(
/******/ 				results
/******/ 					.filter(function (result) {
/******/ 						return result.apply;
/******/ 					})
/******/ 					.map(function (result) {
/******/ 						return result.apply(reportError);
/******/ 					})
/******/ 			)
/******/ 				.then(function (applyResults) {
/******/ 					applyResults.forEach(function (modules) {
/******/ 						if (modules) {
/******/ 							for (var i = 0; i < modules.length; i++) {
/******/ 								outdatedModules.push(modules[i]);
/******/ 							}
/******/ 						}
/******/ 					});
/******/ 				})
/******/ 				.then(onAccepted);
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = __webpack_require__.hmrS_require = __webpack_require__.hmrS_require || {
/******/ 			0: 1
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no chunk install function needed
/******/ 		
/******/ 		// no chunk loading
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			var update = require("./" + __webpack_require__.hu(chunkId));
/******/ 			var updatedModules = update.modules;
/******/ 			var runtime = update.runtime;
/******/ 			for(var moduleId in updatedModules) {
/******/ 				if(__webpack_require__.o(updatedModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = updatedModules[moduleId];
/******/ 					if(updatedModulesList) updatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 		}
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.requireHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					var result = newModuleFactory
/******/ 						? getAffectedModuleEffects(moduleId)
/******/ 						: {
/******/ 								type: "disposed",
/******/ 								moduleId: moduleId
/******/ 							};
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					var acceptPromises = [];
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									var result;
/******/ 									try {
/******/ 										result = callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 									if (result && typeof result.then === "function") {
/******/ 										acceptPromises.push(result);
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					var onAccepted = function () {
/******/ 						// Load self accepted modules
/******/ 						for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 							var item = outdatedSelfAcceptedModules[o];
/******/ 							var moduleId = item.module;
/******/ 							try {
/******/ 								item.require(moduleId);
/******/ 							} catch (err) {
/******/ 								if (typeof item.errorHandler === "function") {
/******/ 									try {
/******/ 										item.errorHandler(err, {
/******/ 											moduleId: moduleId,
/******/ 											module: __webpack_require__.c[moduleId]
/******/ 										});
/******/ 									} catch (err1) {
/******/ 										if (options.onErrored) {
/******/ 											options.onErrored({
/******/ 												type: "self-accept-error-handler-errored",
/******/ 												moduleId: moduleId,
/******/ 												error: err1,
/******/ 												originalError: err
/******/ 											});
/******/ 										}
/******/ 										if (!options.ignoreErrored) {
/******/ 											reportError(err1);
/******/ 											reportError(err);
/******/ 										}
/******/ 									}
/******/ 								} else {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					};
/******/ 		
/******/ 					return Promise.all(acceptPromises)
/******/ 						.then(onAccepted)
/******/ 						.then(function () {
/******/ 							return outdatedModules;
/******/ 						});
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.require = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.require = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				} else {
/******/ 					currentUpdateChunks[chunkId] = false;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.requireHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						!currentUpdateChunks[chunkId]
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = function() {
/******/ 			return Promise.resolve().then(function() {
/******/ 				return require("./" + __webpack_require__.hmrF());
/******/ 			}).catch((err) => {
/******/ 				if(['MODULE_NOT_FOUND', 'ENOENT'].includes(err.code)) return;
/******/ 				throw err;
/******/ 			});
/******/ 		}
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__(0);
/******/ 	var __webpack_exports__ = __webpack_require__(3);
/******/ 	
/******/ })()
;