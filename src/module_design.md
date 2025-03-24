# 项目架构规范

## 模块结构
每个功能模块必须遵循以下结构：

```
moduleName/
├── domain/ # 领域层
│ ├── entities/ # 实体定义
│ ├── interfaces/ # 接口定义
│ ├── value-objects/ # 值对象
│ └── constants/ # 常量定义
│
├── application/ # 应用层
│ └── use-cases/ # 用例实现
│
├── infrastructure/ # 基础设施层
│ ├── services/ # 服务实现
│ ├── repositories/ # 仓库实现
│ └── strategies/ # 策略实现
│
├── presentation/ # 表现层
│ ├── controllers/ # 控制器
│ ├── guards/ # 守卫
│ ├── filters/ # 过滤器
│ └── dtos/ # 数据传输对象
│
└── moduleName.module.ts # 模块定义
```

## 命名约定
- 文件命名：小写，连字符分隔 (kebab-case)
- 类命名：大驼峰 (PascalCase)
- 接口命名：前缀 "I" + 大驼峰
- 注入令牌：大写，下划线分隔，模块前缀

## 依赖注入规则
- 始终通过接口注入，不直接依赖实现
- 使用专属模块的注入令牌
- 清晰声明模块导出的服务

## 模块生成脚本
```
npm run generate:module <moduleName>
```
如:
```
npm run generate:module user
```
