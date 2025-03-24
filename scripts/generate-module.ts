import * as fs from 'fs';
import * as path from 'path';

const moduleName = process.argv[2];
if (!moduleName) {
    console.error('请提供模块名称');
    process.exit(1);
}

// 模块目录结构
const structure = [
    `src/modules/${moduleName}/domain/entities`,
    `src/modules/${moduleName}/domain/interfaces`,
    `src/modules/${moduleName}/domain/value-objects`,
    `src/modules/${moduleName}/domain/constants`,
    `src/modules/${moduleName}/application/use-cases`,
    `src/modules/${moduleName}/infrastructure/services`,
    `src/modules/${moduleName}/infrastructure/repositories`,
    `src/modules/${moduleName}/presentation/controllers`,
    `src/modules/${moduleName}/presentation/guards`,
    `src/modules/${moduleName}/presentation/dtos`,
];

// 创建目录
structure.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`创建目录: ${dir}`);
    }
});

// 创建基础文件
const moduleFile = `src/modules/${moduleName}/${moduleName}.module.ts`;
const moduleContent = `import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: [],
  exports: []
})
export class ${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Module {}
`;

fs.writeFileSync(moduleFile, moduleContent);
console.log(`创建模块文件: ${moduleFile}`);

// 创建注入令牌
const tokenFile = `src/modules/${moduleName}/domain/constants/injection-tokens.ts`;
const tokenContent = `// ${moduleName} 模块专用的注入令牌
export const ${moduleName.toUpperCase()}_INJECTION_TOKENS = {
  // 服务
  // 仓库
  // 其他令牌...
};
`;

fs.writeFileSync(tokenFile, tokenContent);
console.log(`创建注入令牌文件: ${tokenFile}`);

console.log(`${moduleName} 模块已成功创建！`); 