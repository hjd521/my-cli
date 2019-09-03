const {version} = require('./constants.js')
const path = require('path')
const program = require('commander');
const actionMap = {
    create: {
        description: 'crcate project',
        alias: 'cr',
        examples: [
            'c-webpack-cli create <template-name>'
        ]
    },
    config: {
        description: 'config info',
        alias: 'c',
        examples: [
            'c-webpack-cli config set <k> <v>'
        ]
    },
    '*': {
        description: 'command not found'
    }
}
// 自定义配置参数命令
Object.keys(actionMap).forEach((item) => {                        
    program.command(item).alias(actionMap[item].alias)
    .description(actionMap[item].description)
    .action(() => {
        if (item === '*') {
            console.log('command is not found')
        } else {
            console.log('传入的命令是',process.argv)
            require(path.resolve(__dirname, item))(...process.argv.slice(3))
        }
    })
})
program.version(version).parse(process.argv)
// 编写help命令
program.on('--help', () => {
    console.log('examples')
    Object.keys(actionMap).forEach((item) =>{
        actionMap[item].examples.forEach((example) => {
            console.log(example)
        })
    })
})