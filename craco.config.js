const CracoLessPlugin = require("craco-less");

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: { '@primary-color': '#276fbb' },
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
    // babel: {//支持装饰器
    //     plugins: [
    //         [
    //             "import",
    //             {
    //                 "libraryName": "antd",
    //                 "libraryDirectory": "es",
    //                 "style": 'css' //设置为true即是less 这里用的是css
    //             }
    //         ]
    //     ]
    // },
}
