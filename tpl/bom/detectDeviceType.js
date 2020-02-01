/**
 * 返回是移动设备还是桌面设备
 */
export function getDeviceType() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|winMobile|nokiaN|Opera Mini/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop'
}

/**
 * 返回具体的浏览器终端类型
 */
export function getOsType() {
  const u = navigator.userAgent;
  // 移动终端浏览器版本信息
  return {
    trident: u.indexOf('Trident') > -1, // IE内核
    presto: u.indexOf('Presto') > -1, // opera内核
    webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
    mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 是否为移动终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1 || u.indexOf('UCBrowser') > -1, // android终端或者uc浏览器
    iPhone: u.indexOf('iPhone') > -1, // 是否为iPhone或者QQHD浏览器
    iPad: u.indexOf('iPad') > -1, // 是否iPad
    webApp: u.indexOf('Safari') === -1, // 是否web应该程序，没有头部与底部
    weixin: u.indexOf('MicroMessenger') > -1, // 是否微信
    chrome: u.indexOf('Chrome') > -1,
    ali: u.indexOf('Alipay') > -1,
    qq: u.match(/\sQQ/i), // 是否QQ
    safari: u.indexOf('Safari') > -1
  }
}