# 前端轻量自动化构建方案

> https://github.com/dadaiwei/fe-deploy-cli

### 传统的前端代码打包流程

![传统的前端代码打包流程](https://img-blog.csdnimg.cn/20200320094954777.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3hqbDI3MTMxNA==,size_16,color_FFFFFF,t_70)

**传统的手工部署需要经历以下几个过程:**

1. 在项目中执行打包命令
2. 使用ftp连接工具连接服务器
3. 将需要的代码(html,css,js)上传到对应的web目录下

**传统的手工部署存在以下几个缺点:**

1. 每次项目上传都要进行一次手动的build操作
2. 当一个人负责多个项目的时候可能存在代码上传错误等情况(服务器很多/要上传的代码上传成另一个项目)


**解决方案:**

1. 使用jenkins实现完全的自动化部署(jenkins可以根据gitlab push或者merge事件自动化打包到web目录)
2. 使用gitlab内部的CI/CD部署方案
3. 使用其他轻量化的方案(类似执行一条自定义命令 `npm run deploy` 就可以实现打包操作)


为了实现上述的功能，研究发现可以通过`node-ssh`、`archiver`来实现

1. `node-ssh`

`node-ssh`是一个基于`ssh2`的轻量化`npm`包，主要用于`ssh`连接服务器，上传文件，执行命令。

> npm i node-ssh

```js
const node_ssh = require('node-ssh');
const ssh = new node_ssh();

// 连接服务器
ssh.connect({
    host: 'hostname',
    username: 'username',
    privateKey: '/home/username/.ssh/id_rsa'
})

// 上传文件
ssh.putFile(
    '/home/username/Lab/localPath',
    '/home/username/Lab/remotePath'
).then(function(){
    console.log('upload success');
},err=>{
    console.log('upload error');
    console.error(err);
})

// 执行远程服务器命令
ssh.execCommand('hh_client --json', { cwd:'/var/www' })
.then(function(res){
    console.log('stdout:' + res.stdout);
    console.log('stderr:' + res.stderr);
})
```

2. `archiver`

`archiver`是一个用于生成存档的`npm`包，主要用于打包生成`zip`、`rar`等。

```js
const archiver = require('archiver');

// 设置压缩类型与级别
const archiver = archiver('zip', {
    zlib: { level:9 }
}).on('error', err => {
    throw err;
});

// 创建文件输出流
const output = fs.createWriteStream(__dirname + '/dist.zip');

// 通过管道方法将输出流存档到文件
archiver.pipe(output);

// 从subdir子目录追加内容并重命名
archiver.directory('subdir/', 'new-subdir');

// 完成打包归档
archive.finalize();

```

**部署流程**:

1. 读取配置文件，包含服务器`host`、`port`、`web目录`及`本地目录`等信息
2. 本地打包，`npm run build`生成`dist包`
3. 打包成`zip`，使用`archiver`将`dist`包打包成`dist.zip`
4. 连接服务器，`node-ssh`读取配置连接服务器
5. 上传`zip`，使用`ssh.putFile`上传`dist.zip`
6. 解压缩`zip`，使用`ssh.execCommand`解压`dist.zip`
7. 删除本地`dist.zip`，使用`fs.unlink`删除本地`dist.zip`


**完整代码**:

```js
// deploy.js
const path = require('path');
const fs = require('fs');
const childProcess = require('child_process'); // node模块创建子进程 用于执行复杂cpu密集型任务
const ora = require('ora'); // ora包用于显示加载中的效果，类似于前端页面的loading效果
const node_ssh = require('node-ssh');
const archiver = require('archiver');
const { successLog, errorLog, underlineLog } = require('../utils/index');
const projectDir = process.cwd();

let ssh = new node_ssh(); // 生成ssh实例

// 部署流程入口
async function deploy(config) {
  const { script, webDir, distPath, projectName, name } = config;
  try {
    execBuild(script);
    await startZip(distPath);
    await connectSSH(config);
    await uploadFile(webDir);
    await unzipFile(webDir);
    await deleteLocalZip();
    successLog(`\n 恭喜您，${underlineLog(projectName)}项目${underlineLog(name)}部署成功了^_^\n`);
    process.exit(0);
  } catch (err) {
    errorLog(`  部署失败 ${err}`);
    process.exit(1);
  }
}

// 第一步，执行打包脚本
function execBuild(script) {
  try {
    console.log(`\n（1）${script}`);
    const spinner = ora('正在打包中');
    spinner.start();
    // 同步执行方式
    childProcess.execSync(script, { cwd: projectDir });
    spinner.stop();
    successLog('  打包成功');
  } catch (err) {
    errorLog(err);
    process.exit(1);
  }
}

// 第二部，打包zip
function startZip(distPath) {
  return new Promise((resolve, reject) => {
    distPath = path.resolve(projectDir, distPath);
    console.log('（2）打包成zip');
    const archive = archiver('zip', {
      zlib: { level: 9 },
    }).on('error', err => {
      throw err;
    });
    const output = fs.createWriteStream(`${projectDir}/dist.zip`);
    output.on('close', err => {
      if (err) {
        errorLog(`  关闭archiver异常 ${err}`);
        reject(err);
        process.exit(1);
      }
      successLog('  zip打包成功');
      resolve();
    });
    archive.pipe(output);
    archive.directory(distPath, '/');
    archive.finalize();
  });
}

// 第三步，连接SSH
async function connectSSH(config) {
  const { host, port, username, password, privateKey, passphrase, distPath } = config;
  const sshConfig = {
    host,
    port,
    username,
    password,
    privateKey,
    passphrase
  };
  try {
    console.log(`（3）连接${underlineLog(host)}`);
    await ssh.connect(sshConfig);
    successLog('  SSH连接成功');
  } catch (err) {
    errorLog(`  连接失败 ${err}`);
    process.exit(1);
  }
}

// 第四部，上传zip包
async function uploadFile(webDir) {
  try {
    console.log(`（4）上传zip至目录${underlineLog(webDir)}`);
    await ssh.putFile(`${projectDir}/dist.zip`, `${webDir}/dist.zip`);
    successLog('  zip包上传成功');
  } catch (err) {
    errorLog(`  zip包上传失败 ${err}`);
    process.exit(1);
  }
}


// 运行命令
async function runCommand(command, webDir) {
  await ssh.execCommand(command, { cwd: webDir });
}

// 第五步，解压zip包
async function unzipFile(webDir) {
  try {
    console.log('（5）开始解压zip包');
    await runCommand(`cd ${webDir}`, webDir);
    await runCommand('unzip -o dist.zip && rm -f dist.zip', webDir);
    successLog('  zip包解压成功');
  } catch (err) {
    errorLog(`  zip包解压失败 ${err}`);
    process.exit(1);
  }
}

// 第六步，删除本地dist.zip包
async function deleteLocalZip() {
  return new Promise((resolve, reject) => {
    console.log('（6）开始删除本地zip包');
    fs.unlink(`${projectDir}/dist.zip`, err => {
      if (err) {
        errorLog(`  本地zip包删除失败 ${err}`, err);
        reject(err);
        process.exit(1);
      }
      successLog('  本地dist.zip删除成功\n');
      resolve();
    });
  });
}


module.exports = deploy;
```

utils
```js
#!/usr/bin/env node

const fs = require('fs');
const chalk = require('chalk');
const semver = require('semver');

const DEPLOY_SCHEMA = {
  name: '',
  script: "",
  host: '',
  port: 22,
  username: '',
  password: '',
  webDir: ''
};

const PRIVATE_KEY_DEPLOY_SCHEMA = {
  name: '',
  script: "",
  host: '',
  port: 22,
  webDir: ''
};

// 开始部署日志
function startLog(...content) {
  console.log(chalk.magenta(...content));
}

// 信息日志
function infoLog(...content) {
  console.log(chalk.blue(...content));
}

// 成功日志
function successLog(...content) {
  console.log(chalk.green(...content));
}

// 错误日志
function errorLog(...content) {
  console.log(chalk.red(...content));
}

// 下划线重点输出
function underlineLog(content) {
  return chalk.blue.underline.bold(`${content}`);
}

// 检查node版本是否符合特定范围
function checkNodeVersion(wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    errorLog(`You ar using Node ${process.version}, but this version of ${id} requres Node ${wanted} .\nPlease upgrage your Node version.`);
    process.exit(1);
  }
}

// 检查配置是否符合特定schema
function checkConfigScheme(configKey, configObj, privateKey) {
  let deploySchemaKeys = null;
  const configKeys = Object.keys(configObj);
  const neededKeys = [];
  const unConfigedKeys = [];
  let configValid = true;
  if (privateKey) {
    deploySchemaKeys = Object.keys(PRIVATE_KEY_DEPLOY_SCHEMA);
  } else {
    deploySchemaKeys = Object.keys(DEPLOY_SCHEMA);
  }
  for (let key of deploySchemaKeys) {
    if (!configKeys.includes(key)) {
      neededKeys.push(key);
    }
    if (configObj[key] === '') {
      unConfigedKeys.push(key);
    }
  }
  if (neededKeys.length > 0) {
    errorLog(`${configKey}缺少${neededKeys.join(',')}配置，请检查配置`);
    configValid = false;
  }
  if (unConfigedKeys.length > 0) {
    errorLog(`${configKey}中的${unConfigedKeys.join(', ')}暂未配置，请设置该配置项`);
    configValid = false;
  }
  return configValid;
}

// 检查deploy配置是否合理
function checkDeployConfig(deployConfigPath) {
  if (fs.existsSync(deployConfigPath)) {
    const config = require(deployConfigPath);
    const { privateKey, passphrase, projectName } = config;
    const keys = Object.keys(config);
    const configs = [];
    for (let key of keys) {
      if (config[key] instanceof Object) {
        if (!checkConfigScheme(key, config[key], privateKey)) {
          return false;
        }
        config[key].command = key;
        config[key].privateKey = privateKey;
        config[key].passphrase = passphrase;
        config[key].projectName = projectName;
        configs.push(config[key]);
      }
    }
    return configs;
  }
  infoLog(`缺少部署相关的配置，请运行${underlineLog('deploy init')}下载部署配置`);
  return false;
}

module.exports = {
  startLog,
  infoLog,
  successLog,
  errorLog,
  underlineLog,
  checkNodeVersion,
  checkDeployConfig
};
```

**配置成脚手架**:

上面的方案已经可以完成一个项目的自动化部署，但是再有一个新的项目要接入自动化部署，是不是又得把整个文件拷贝过去，是不是非常麻烦？

因此可以将自动化部署做成一个脚手架f，支持生成部署配置模板、脚本部署，只需一条命令即可部署到对应环境中。


**与脚手架相关的npm包：**

- `commander`：node.js命令行界面的完整解决方案
- `download-git-repo`：git仓库代码下载
- `ora`：显示加载中的效果
- `inquirer`：用户与命令交互的工具
- `child_process`：`npm`内置模块，用于执行`package.json`中的打包`script`


### 1.初始化

初始化需要在`github`上新建一个部署配置`git`仓库，执行`deploy init`通过`download-git-repo`从`git`上拉取配置模板。

```js
// init.js

#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const download = require('download-git-repo');
const ora = require('ora');
const { successLog, infoLog, errorLog } = require('../utils/index');
let tmp = 'deploy';
const deployPath = path.join(process.cwd(), './deploy');
const deployConfigPath = `${deployPath}/deploy.config.js`;
const deployGit = 'dadaiwei/fe-deploy-cli-template';

// 检查部署目录及部署配置文件是否存在
const checkDeployExists = () => {
    if (fs.existsSync(deployPath) && fs.existsSync(deployConfigPath)) {
        infoLog('deploy目录下的deploy.config.js配置文件已经存在，请勿重新下载');
        process.exit(1);
        return;
    }
    downloadAndGenerate(deployGit);
};

// 下载部署脚本配置
const downloadAndGenerate = templateUrl => {
    const spinner = ora('开始生成部署模板');
    spinner.start();
    download(templateUrl, tmp, { clone: false }, err => {
        if (err) {
            console.log();
            errorLog(err);
            process.exit(1);
        }
        spinner.stop();
        successLog('模板下载成功，模板位置：deploy/deploy.config.js');
        infoLog('请配置deploy目录下的deploy.config.js配置文件');
        process.exit(0);
    });
};

module.exports = () => {
    checkDeployExists();
};
```

### 2.设定配置

通过修改`deploy.config.js`，设定`dev（测试环境）`和`prod（线上环境）`的配置。


```js
// deploy.config.js

module.exports = {
  privateKey: '', // 本地私钥地址，位置一般在C:/Users/xxx/.ssh/id_rsa，非必填，有私钥则配置
  passphrase: '', // 本地私钥密码，非必填，有私钥则配置
  projectName: '', // 项目名称
  dev: { // 测试环境
    name: '测试环境',
    script: "npm run build", // 测试环境打包脚本
    host: '', // 测试服务器地址
    port: 22, // ssh port，一般默认22
    username: '', // 登录服务器用户名
    password: '', // 登录服务器密码
    distPath: 'dist',  // 本地打包dist目录
    webDir: '',  // // 测试环境服务器地址
  },
  prod: {  // 线上环境
    name: '线上环境',
    script: "npm run build", // 线上环境打包脚本
    host: '', // 线上服务器地址
    port: 22, // ssh port，一般默认22
    username: '', // 登录服务器用户名
    password: '', // 登录服务器密码
    distPath: 'dist',  // 本地打包dist目录
    webDir: '' // 线上环境web目录
  }
  // 再还有多余的环境按照这个格式写即可
}

```

### 3. 注册部署命令

注册部署命令就是从`deploy.config.js`中读取`dev`和`prod`配置，然后通过`program.command`注册`dev`和`prod command`，运行`deploy dev`或者`deploy prod`即进入1.3节的部署流程。

```js
// 部署流程
function deploy() {
    // 检测部署配置是否合理
    const deployConfigs = checkDeployConfig(deployConfigPath);
    if (!deployConfigs) {
        process.exit(1);
    }

    // 注册部署命令，注册后支持deploy dev和deploy prod
    deployConfigs.forEach(config => {
        const { command, projectName, name } = config;
        program
            .command(`${command}`)
            .description(`${underlineLog(projectName)}项目${underlineLog(name)}部署`)
            .action(() => {
                inquirer.prompt([
                    {
                        type: 'confirm',
                        message: `${underlineLog(projectName)}项目是否部署到${underlineLog(name)}？`,
                        name: 'sure'
                    }
                ]).then(answers => {
                    const { sure } = answers;
                    if (!sure) {
                        process.exit(1);
                    }
                    if (sure) {
                        const deploy = require('../lib/deploy');
                        deploy(config);
                    }
                });

            });
    });
}

```