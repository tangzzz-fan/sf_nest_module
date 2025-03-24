module.exports = {
    // 基础配置...
    rules: {
        // 自定义架构规则
        'import/no-restricted-paths': [
            'error',
            {
                zones: [
                    // 领域层不能导入其他层
                    {
                        target: './src/**/domain/**/*',
                        from: './src/**/!(domain)/**/*',
                        message: '领域层不能依赖其他层'
                    },
                    // 应用层可以导入领域层，但不能导入基础设施层和表现层
                    {
                        target: './src/**/application/**/*',
                        from: './src/**/!(domain|application)/**/*',
                        message: '应用层只能依赖领域层'
                    },
                    // 表现层不能直接导入基础设施层
                    {
                        target: './src/**/presentation/**/*',
                        from: './src/**/infrastructure/**/*',
                        message: '表现层不能直接依赖基础设施层'
                    },
                    // 不同模块间的依赖控制
                    {
                        target: './src/modules/*/!(domain)/**/*',
                        from: './src/modules/!(shared)/*/**/*',
                        except: ['./src/modules/$1/**/*'],
                        message: '模块只能通过领域层接口依赖其他模块'
                    }
                ]
            }
        ],
        // 强制使用路径别名
        'import/no-unresolved': 'error',
        'import/order': ['error', {
            'pathGroups': [
                { 'pattern': '@domain/**', 'group': 'internal' },
                { 'pattern': '@application/**', 'group': 'internal' },
                { 'pattern': '@infrastructure/**', 'group': 'internal' },
                { 'pattern': '@presentation/**', 'group': 'internal' },
                { 'pattern': '@modules/**', 'group': 'internal' }
            ]
        }]
    }
}; 