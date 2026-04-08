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
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const bodyParser = __importStar(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const app_module_1 = require("./app/app.module");
const fs_1 = require("fs");
const path_1 = require("path");
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
    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => {
            void app.close();
        });
    }
}
bootstrap().catch((error) => {
    console.error('Failed to start the server:', error);
});
//# sourceMappingURL=main.js.map