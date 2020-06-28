# selenium 常用操作

- 2020.06.16

> `selenium`是一款自动化测试利器，可以自动化模拟人的浏览器操作行为，所以也常用于网络爬虫。

## 安装与配置

### 安装

```py
pip install selenium
```

### 配置

当我们使用`selenium`用来爬取数据的时候，需要安装对应浏览器下的driver插件。

以`Chrome`为例，需要到 `http://chromedriver.chromium.org/downloads`下载的时候注意当前的浏览器版本和`driver`插件版本需要对应 否则无法正常的运行。


## 基本使用

罗列一些常用的方法。

```py
# 导入webdriver模块
from selenium import webdriver   

# firefox加载器地址
firefox_path = r'/Users/xjlmacbookpro/geckodriver'

# 限制图片的加载
fp = webdriver.FirefoxProfile()
# 设置不显示图片
fp.set_preference("permissions.default.image", 2)
# 设置可以执行javascript脚本
fp.set_preference("javascript.enabled", True)
# 配置firefox drive
driver = webdriver.Firefox(firefox_profile=fp, executable_path=firefox_path)
# 隐性等待，最长等20秒 20秒之内只要找到了就执行 20秒后未找到 就超时
driver.implicitly_wait(20)
# 获取指定url地址
driver.get(url)

# chromedriver 加载器地址
chrome_path = r'/Users/xjlmacbookpro/chromedriver'

# 设置chrome启动参数
options = init_chrome_options()
# 设置driver
driver = webdriver.Chrome(executable_path=chrome_path, chrome_options=options)
# 打开指定url
driver.get(url)

# 返回爬取需要设置的chrome扩展
def init_chrome_options():
    options = webdriver.ChromeOptions()
    # 去掉chrome正在受到自动测试软件的控制的 提示
    options.add_argument('disable-infobars')
    # 启动浏览器最大化
    options.add_argument("--start-maximized")
    # 设置user-agent
    options.add_argument(
        'user-agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.75 Safari/537.36"')
    # 设置Content-Type
    options.add_argument(
        'content-type="application/x-www-form-urlencoded; charset=UTF-8"')
    # 设置以开发者模式打开
    options.add_experimental_option('excludeSwitches', ['enable-automation'])

    return options

# 关闭页面
driver.close() 

# 关闭整个浏览器
driver.quit() 
```

## Xpath知识补充

> `xpath`是`XML路径语言`，它可以用来确定`xml`文档中的元素位置，通过元素的路径来完成对元素的查找。`HTML`就是`XML`的一种实现方式，所以`xpath`是一种非常强大的定位方式。

`xpath`也分几种不同类型的定位方法。

- `绝对路径定位`。这种定位方式是利用html标签名的层级关系来定位元素的绝对路径，一般从`<html>`标签开始依次往下进行查找。

```py
driver.find_element_by_xpath("/html/body/div[1]/div[1]/div/div[1]/div/form/span[1]/input")
```

- `相对路径定位`。从根元素写起，当元素层级很深的时候，路径写的会很长，阅读性不好，也很难维护。这时推荐使用相对路径，这种是利用元素属性来进行xpath定位。

```py
# 表示 整个文档当中的id属性为id的input标签 默认为第一个  * 第一个“//” 表示 在整个文档中 
driver.find_element_by_xpath("//input[@id='id']")

# 指定页面中的第二个 input框 没有就报错 所以查找的时候 可以使用 try ... except ....
driver.find_element_by_xpath("//input[2]") 

# 返回input的父节点 form 标签
driver.find_element_by_xpath("//form//input/..")

# 返回form下input的当前节点
driver.find_element_by_xpath("//form//input/.")
```

## 匹配单个标签

selenium提供了多种方式可以找到指定的元素。

```py
driver = webdriver.Chrome(executable_path=chrome_path, chrome_options=options)

# 通过id定位
driver.find_element_by_id("id")

# 通过name属性定位
driver.find_element_by_name("name")

# 通过class属性定位
driver.find_element_by_class_name("classname")

# 通过标签类型名定位
driver.find_element_by_tag_name("tagname")

# 通过匹配a标签内部的text文本属性来定位 仅支持a标签
driver.find_element_by_link_text("a标签中的内容 准确定位")

# 通过匹配a标签内部的text文本属性来定位 仅支持a标签 采用模糊查询 比如a标签内 康师傅 可以用康来模糊匹配
driver.find_element_by_partial_link_text("a标签中的内容 模糊定位 ")

# 通过强大的xpath进行定位
driver.find_element_by_xpath("xpath")

# 通过css表达式进行定位
driver.find_element_by_css_selector("css表达式")
```

## 匹配多个标签

上述匹配单个标签的方法均存在对应的匹配多标签的方法,匹配多个标签常用于处理一些列表及共性的元素。

```py
driver = webdriver.Chrome(executable_path=chrome_path, chrome_options=options)

# 通过id定位
driver.find_elements_by_id("id")

# 通过name属性定位
driver.find_elements_by_name("name")

# 通过class属性定位
driver.find_elements_by_class_name("classname")

# 通过标签类型名定位
driver.find_elements_by_tag_name("tagname")

# 通过匹配a标签内部的text文本属性来定位 仅支持a标签
driver.find_elements_by_link_text("a标签中的内容 准确定位")

# 通过匹配a标签内部的text文本属性来定位 仅支持a标签 采用模糊查询 比如a标签内 康师傅 可以用康来模糊匹配
driver.find_elements_by_partial_link_text("a标签中的内容 模糊定位 ")

# 通过强大的xpath进行定位
driver.find_elements_by_xpath("xpath")

# 通过css表达式进行定位
driver.find_elements_by_css_selector("css表达式")
```

## 父子、兄弟、相邻节点定位方式详解

有些时候我们经常需要通过定位某个元素，然后找到对应的相邻节点等。

### 1. 由父节点定位子节点

最简单的肯定就是由父节点定位子节点了，举个例子：

```html
<html>
<body>
<div id="A">
    <!--父节点定位子节点-->
    <div id="B">
        <div>parent to child</div>
    </div>
</div>
</body>
</html>
```

想要根据 B节点 定位无id的子节点，代码示例如下:

```py
# -*- coding: utf-8 -*-
from selenium import webdriver

driver = webdriver.Chrome(executable_path=chrome_path, chrome_options=options)
driver.get('test.html')

# 1.串联寻找
print driver.find_element_by_id('B').find_element_by_tag_name('div').text

# 2.xpath父子关系寻找
print driver.find_element_by_xpath("//div[@id='B']/div").text

# 3.css selector父子关系寻找
print driver.find_element_by_css_selector('div#B>div').text

# 4.css selector nth-child
print driver.find_element_by_css_selector('div#B div:nth-child(1)').text

# 5.css selector nth-of-type
print driver.find_element_by_css_selector('div#B div:nth-of-type(1)').text

# 6.xpath轴 child
print driver.find_element_by_xpath("//div[@id='B']/child::div").text

driver.quit()
```

### 2. 由子节点定位父节点

由子节点想要定位到父节点就有点难度了，对以下代码：

```html
<html>
<body>
<div id="A">
    <!--子节点定位父节点-->
    <div>
        <div>child to parent
            <div>
                <div id="C"></div>
            </div>
        </div>
    </div>
</div>
</body>
</html>
```

我们想要由 C节点 定位其两层父节点的div，示例代码如下：

```py
# -*- coding: utf-8 -*-
from selenium import webdriver

driver = webdriver.Chrome(executable_path=chrome_path, chrome_options=options)
driver.get('test.html')

# 1.xpath: `.`代表当前节点; '..'代表父节点
print driver.find_element_by_xpath("//div[@id='C']/../..").text

# 2.xpath轴 parent
print driver.find_element_by_xpath("//div[@id='C']/parent::*/parent::div").text

driver.quit()
```

### 3. 由弟弟节点定位哥哥节点

我们这里要定位的是兄弟节点了。如以下：

```html
<html>
<body>
<div id="A">
    <!--下面两个节点用于兄弟节点定位-->
    <div>brother 1</div>
    <div id="D"></div>
    <div>brother 2</div>
</div>
</body>
</html>
```

怎么通过 D节点 定位其哥哥节点呢？看代码示例：

```py
# -*- coding: utf-8 -*-
from selenium import webdriver

driver = webdriver.Chrome(executable_path=chrome_path, chrome_options=options)
driver.get('test.html')

# 1.xpath,通过父节点获取其哥哥节点
print driver.find_element_by_xpath("//div[@id='D']/../div[1]").text

# 2.xpath轴 preceding-sibling 能够获取当前节点的所有同级哥哥节点，注意括号里的标号，1 代表着离当前节点最近的一个哥哥节点，数字越大表示离当前节点越远
print driver.find_element_by_xpath("//div[@id='D']/preceding-sibling::div[1]").text

driver.quit()
```

### 4. 由哥哥节点定位弟弟节点

通过 D节点 定位其弟弟节点，看代码示例：

```py
# -*- coding: utf-8 -*-
from selenium import webdriver

driver = webdriver.Chrome(executable_path=chrome_path, chrome_options=options)
driver.get(test.html')

# 1.xpath，通过父节点获取其弟弟节点
print driver.find_element_by_xpath("//div[@id='D']/../div[3]").text

# 2.xpath轴 following-sibling 获取当前节点的所有同级弟弟节点，同样，1 代表离当前节点最近的一个弟弟节点，数字越大表示离当前节点越远
print driver.find_element_by_xpath("//div[@id='D']/following-sibling::div[1]").text

# 3.xpath轴 following
print driver.find_element_by_xpath("//div[@id='D']/following::*").text

# 4.css selector +
print driver.find_element_by_css_selector('div#D + div').text

# 5.css selector ~
print driver.find_element_by_css_selector('div#D ~ div').text

driver.quit()
```

### XPath、CSS定位速查表

| 描述  | XPath | CSS
| :--- | :---- | :----
| 直接子元素 | 	//div/p	 | div > p
| 子元素或后代元素 | //div//p  | div p
| 以id定位 |	//div[@id=’idValue’]//a	 | div#idValue a
| 以class定位 |	//div[@class=’classValue’]//a  | div.classValue a
| 同级弟弟元素 | //ul/li[@class=’first’]/following-sibling::li |	ul>li.first + li
| 属性 |	//form/input[@name=’username’] | form input[name=’username’]
| 多个属性 | //input[@name=’continue’ and @type=‘button’] | input[name=’continue’][type=’button’]
| 第n个子元素 |	//ul[@id=’list’]/li[n]	| ul#list li:nth-child(n)
| 第1个子元素 |	//ul[@id=’list’]/li[1]	| ul#list li:first-child
| 最后1个子元素 |	//ul[@id=’list’]/li[last()]	 | ul#list li:last-child
| 属性包含某字段 |	//div[contains(@title,’Title’)]	 | div[title*=”Title”]
| 属性以某字段开头 |	//input[starts-with(@name,’user’)] |	input[name^=”user”]
| 属性以某字段结尾 |	//input[ends-with(@name,’name’)]	 |input[name$=”name”]
| text中包含某字段 |	//div[contains(text(), 'text')]	 | 无法定位
| 元素有某属性 |	//div[@title]	| div[title]
| 父节点 |	//div/.. | 无法定位
| 同级哥哥节点 | //li/preceding-sibling::div[1]	 | 无法定位


**使用selenium爬取数据的时候有时需要一些交互比如点击、滚动、缩放等，这时候就要使用到其提供的模拟事件。**

## 模拟鼠标操作


```py 
from selenium import webdriver
# 鼠标事件模块
from selenium.webdriver import ActionChains

driver = webdriver.Chrome(executable_path=chrome_path, chrome_options=options)

obj = driver.find_element_by_tag_name('a')

# 存储当前行为
action = ActionChains(driver)

# 模拟a标签的hover事件
action.move_to_element(obj).perform()

# 鼠标移动到指定的坐标上，参数接受 driverElement, x, y 模拟单击事件
action.move_to_element_with_offset(obj, 5, 0).click().perform()

# 鼠标移动到指定的坐标上，参数接受 driverElement, x, y 模拟双击事件
action.move_to_element_with_offset(obj, 5, 0).double_click().perform()

# 模拟鼠标右击
action.move_to_element(obj).countext_lick().perform()

# 模拟元素拖动
action.move_to_element(obj).drag_and_drop().perform()

# 模拟按住鼠标左键不动
action.move_to_element(obj).click_and_hold().perform()
```

## 模拟键盘操作

```py
# 键盘事件
from selenium.webdriver.common.keys import Keys

# 用户名输入框
account_input = driver.find_element_by_css_selector('input#account')

# 清空输入框
account_input.clear()

# 输入自定义内容
account_input.send_keys('112233')

# 输入退格键
account_input.send_keys(Keys.BACK_SPANCE)  

# 执行自定义指令
account_input.send_keys(Keys.CONTRL,'a')  # 全选
 
account_input.send_keys(Keys.CONTRL,'v')  # 粘贴
 
account_input.send_keys(Keys.CONTRL,'c')  # 复制
 
account_input.send_keys(Keys.CONTRL,'x')  # 剪切
 
account_input.send_keys(Keys.ENTER)       # 回车
```

## 处理多个窗口

有的时候我们在打开的第一个页面点击了一个链接跳转到了另外的页面上，我们的driver窗口默认还是停留在上个窗口，这时候执行相应的元素获取是获取不到的，我们需要将指针移到当前的窗口上。

```py
driver = webdriver.Chrome(executable_path=chrome_path, chrome_options=options)

# 当前的句柄
driver.window_handles

# 重置为当前窗口的句柄
driver.switch_to.window(driver.current_window_handle)

# 由于window_handles 是一个数组 也可以使用下标访问当前地址
driver.switch_to.window(driver.window_handles[0]) 
```

## 执行js脚本

有时候我们需要模拟的行为需要用到脚本。

```py
driver = webdriver.Chrome(executable_path=chrome_path, chrome_options=options)

# 滚动350px
driver.execute_script('document.body.scrollTop=350')

# 滚动页面到底部
driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
```

## 处理显示和隐式等待

有的时候我们的元素是懒加载或者其他操作后才会显示的，这种情况下去定位元素最好等待一会再执行。

```py
'''
    显示等待使用selenium.webdriver.support.excepted_condition期望条件 和 selenium.webdriver.support.ui.webDriverWait配合完成
'''
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

driver = webdriver.Chrome(executable_path=chrome_path, chrome_options=options)

# 设置隐式等待时间 
driver.implicitly_wait(10)  

# 在30s内 每隔0.5s扫描一次知道 .cat-bd 元素加载完成 为什么是0.5s扫描一次————>因为源码中默认为0.5s
WebDriverWait(driver, 30).until(EC.presence_of_element_located((By.CLASS_NAME, 'cat-bd')))

WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR,'#description img')))
```

## 一些常用的user-agent

```py
mobile_agents = [
    "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1",
    "Mozilla/5.0 (iPhone; U; CPU iPhone OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5",
    "Mozilla/5.0 (iPod; U; CPU iPhone OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5",
    "Mozilla/5.0 (iPad; U; CPU OS 4_3_3 like Mac OS X; en-us) AppleWebKit/533.17.9 (KHTML, like Gecko) Version/5.0.2 Mobile/8J2 Safari/6533.18.5",
    "Mozilla/5.0 (Linux; U; Android 2.3.7; en-us; Nexus One Build/FRF91) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
    "Opera/9.80 (Android 2.3.4; Linux; Opera Mobi/build-1107180945; U; en-GB) Presto/2.8.149 Version/11.10",
    "MQQBrowser/26 Mozilla/5.0 (Linux; U; Android 2.3.7; zh-cn; MB200 Build/GRJ22; CyanogenMod-7) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1",
    "Mozilla/5.0 (Linux; U; Android 3.0; en-us; Xoom Build/HRI39) AppleWebKit/534.13 (KHTML, like Gecko) Version/4.0 Safari/534.13",
    "UCWEB7.0.2.37/28/999",
    "Mozilla/4.0 (compatible; MSIE 6.0; ) Opera/UCWEB7.0.2.37/28/999"
]

```

## 处理登录后的cookie

网站的登录等一些信息都会存在cookie，storage中，访问一些页面需要登录后才可以访问，这时我们的请求就应该带上所需的信息。

```py
# 获取所有的cookie
for cookie in driver.get_cookies():
    print(cookie)
    
# 根据cookie的key获取value
value = driver.get_cookie(key)

# 删除所有的cookie
driver.delete_all_cookies()

# 删除某一个cookie
driver.delete_cookie(key)

```

一个完整的例子:

```py
# coding:utf-8
# 用webdriver登录并获取cookies，并用requests发送请求，以豆瓣为例
from selenium import webdriver
import requests
import time
import json
import sys
reload(sys)
sys.setdefaultencoding('utf-8')

def main():
    # 从命令行参数获取登录用户名和密码
    user_name = sys.argv[1]
    password = sys.argv[2]

    # 豆瓣登录页面URL
    login_url = 'https://www.douban.com/accounts/login'

    # 获取chrome的配置
    opt = webdriver.ChromeOptions()
    # 在运行的时候不弹出浏览器窗口
    # opt.set_headless()

    # 获取driver对象
    driver = webdriver.Chrome(chrome_options = opt)
    # 打开登录页面
    driver.get(login_url)

    print('opened login page...')
    
    # 向浏览器发送用户名、密码，并点击登录按钮
    driver.find_element_by_name('form_email').send_keys(user_name)
    driver.find_element_by_name('form_password').send_keys(password)
    # 多次登录需要输入验证码，这里给一个手工输入验证码的时间
    time.sleep(6)
    driver.find_element_by_class_name('btn-submit').submit()
    print('submited...')
    # 等待2秒钟
    time.sleep(2)

    # 创建一个requests session对象
    s = requests.Session()
    # 从driver中获取cookie列表（是一个列表，列表的每个元素都是一个字典）
    cookies = driver.get_cookies()
    # 把cookies设置到session中
    for cookie in cookies:
        s.cookies.set(cookie['name'],cookie['value'])
    # 关闭driver
    driver.close()

    # 需要登录才能看到的页面URL
    page_url = 'https://www.douban.com/accounts/'
    # 获取该页面的HTML
    resp = s.get(page_url)
    resp.encoding = 'utf-8'
    print('status_code = {0}'.format(resp.status_code))
    # 将网页内容存入文件
    with open('html.txt','w+') as  fout:
        fout.write(resp.text)
    
    print('end')

if __name__ == '__main__':
    main()
```

## 常用构造滑块验证移动规矩

```py
def get_track(distance):
	track = []
	current = 0
	mid = distance * 3 / 4
	t = 0.2
	v = 0
	while current < distance:
		if current < mid:
			a = 2
		else:
			a = -3
		v0 = v
		v = v0 + a * t
		move = v0 * t + 1 / 2 * a * t * t
		current += move
		track.append(round(move))
	return track
```

## 多进程爬虫示例

- 2020.06.28

```py
'''
    1.开多个进程，并行运行多个chrome浏览器。
    2.将所有的关键字放入同一个queue中，其他进程从中获取关键字，进行搜索数据。
'''
import configure
import multiprocessing
import time

# 由mark标记是哪个进程执行的动作
def getkeyWordFunc(queue, lock, mark):
    while not queue.empty():
        # def get(self, block=True, timeout=None):
        keyWord = queue.get()

        # 加锁，是为了防止散乱的打印。 保护一些临界状态
        # 多个进程运行的状态下，如果同一时刻都调用到print，那么显示的打印结果将会混乱
        lock.acquire()
        print(f"keyWord = {keyWord}, markProcess = {mark}")
        lock.release()
        time.sleep(1)

if __name__ == '__main__':
    lock = multiprocessing.Lock()       # 进程锁
    queue = multiprocessing.Queue(150)  # 队列，用于存放所有的初始关键字

    for keyWord, keyWordValue in configure.keySearchWords.items():
        print(f"keyWord = {keyWord}")
        # 如果queue定的太小，剩下的放不进去，程序就会block住，等待队列有空余空间
        # def put(self, obj, block=True, timeout=None):
        queue.put(keyWord)
    print(f"queueBefore = {queue}")

    getKeyProcessLst = []
    # 生成两个进程，并启动
    for i in range(2):
        # 携带的args 必须是python原有的数据类型，不能是自定义的。否则会出现下面的error（见后面）
        process = multiprocessing.Process(target = getkeyWordFunc, args = (queue, lock, i))
        process.start()
        getKeyProcessLst.append(process)

    # 守护线程
    # join 等待线程终止，如果不使用join方法对每个线程做等待终止，那么线程在运行过程中，可能会去执行最后的打印
    # 如果没有join，父进程就不会阻塞，启动子进程之后，父进程就直接执行最后的打印了
    for p in getKeyProcessLst:
        p.join()

    print(f"queueAfter = {queue}")
    queue.close()
    print(f"all queue used.")
```