const path = require('path')
const axios = require('axios')
const ora = require('ora')
const Inquirer = require('inquirer')
const {promisify} = require('util')
const downLoadGit = require('download-git-repo')
let ncp = require('ncp') // 复制
const download = promisify(downLoadGit) //下载git模版
// get repo list
const downLoadDir =`${process.env[process.platform === 'darwin' ? 'HOME'
: 'USERPROFILE']}/.template`
const getList = async () => {
    const {data} = await axios.get('https://api.github.com/orgs/work-p/repos')
    console.log('data',data)
    return data
}
const getTagList = async (repo) => {
    const {data} = await axios.get(`https://api.github.com/repos/work-p/${repo}/tags`)
    return data
}
const downloadGitTemplate = async (repo, tag) => {
    let api = `work-p/${repo}`
    if (tag) {
        api += `#${tag}`
    }
    const dest = `${downLoadDir}/${repo}`
    try {
        let spinner = ora('downloading template');
        spinner.start();
        await download(api, dest).then((err) => {
            console.log(err)
        })
        spinner.succeed()
    } catch(err) {
        console.log(err)
    }
    return dest
}
module.exports = async (project) => {
    let spinner = ora('get reoponisty lists');
    spinner.start();
    let repos = await getList();
    spinner.succeed();
    let result = repos.map((item) => item.name)
    let {repo} = await Inquirer.prompt(
        {
            name: 'repo',
            type: 'list',
            message: 'please choice repo template to create project',
            choices: result
        }
    )
    spinner = ora('get repo tags')
    spinner.start()
    let tags = await getTagList(repo);
    spinner.succeed()
    let tagList = tags.map((item) => item.name)
    const {tag} = await Inquirer.prompt({
        name: 'tag',
        type: 'list',
        message: 'please choice repo template to create project',
        choices: tagList
    });
    // 下载模版到本地
    const target = await downloadGitTemplate(repo, tag)
    ncp = promisify(ncp)
    await ncp(target, path.join(path.resolve(), project))
    console.log('项目拷贝成功')
}