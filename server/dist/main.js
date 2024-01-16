"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const format_response_interceptor_1 = require("./interceptor/format-response.interceptor");
const invoke_record_interceptor_1 = require("./interceptor/invoke-record.interceptor");
const unlogin_filter_1 = require("./filter/unlogin.filter");
const custom_exception_filter_1 = require("./filter/custom-exception.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    const configService = app.get(config_1.ConfigService);
    app.useGlobalInterceptors(new format_response_interceptor_1.FormatResponseInterceptor());
    app.useGlobalInterceptors(new invoke_record_interceptor_1.InvokeRecordInterceptor());
    app.useGlobalFilters(new unlogin_filter_1.UnLoginFilter());
    app.useGlobalFilters(new custom_exception_filter_1.CustomExceptionFilter());
    await app.listen(configService.get('nest_server_port'));
}
bootstrap();
//# sourceMappingURL=main.js.map