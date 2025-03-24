module.exports = {
    collection: '@nestjs/schematics',
    sourceRoot: 'src',
    // 自定义生成器配置
    generateOptions: {
        spec: false,  // 是否生成测试文件
    },
    compilerOptions: {
        // 编译器选项
        plugins: [],
    },
    // 自定义模板路径
    schematics: {
        // 自定义 module 模板
        'module': {
            path: './schematics/module',
        },
        // 自定义 controller 模板
        'controller': {
            path: './schematics/controller',
        },
        // 等等
    }
}; 