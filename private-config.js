const Gitalk = require('gitalk');
const md5 = require('md5');

var gitalk = new Gitalk({
    clientID: '548bd7170b285f9d5c22',
    clientSecret: 'c70ea31537fb553d2d59622c5aca57fdf91b8fe5',
    repo: 'xjl271314.github.io-my-blogs',
    owner: 'xjl271314',
    admin: ['xjl271314'],
    id: md5(location.pathname), 
    distractionFreeMode: false
})

module.exports = { 
    gitalk 
};

