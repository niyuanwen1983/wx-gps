
//初始化数据
function tabbarinit() {
  return [
    {
      "current": 0,
      "pagePath": "/pages/index/index",
      "iconPath": "/imgs/index_unselected.png",
      "selectedIconPath": "/imgs/index_selected.png",
      "text": "首页"
    },
    {
      "current": 0,
      "pagePath": "/pages/news/news",
      "iconPath": "/imgs/task_unselected.png",
      "selectedIconPath": "/imgs/task_selected.png",
      "text": "工单"

    },
    {
      "current": 0,
      "pagePath": "/pages/me/me",
      "iconPath": "/imgs/me_unselected.png",
      "selectedIconPath": "/imgs/me_selected.png",
      "text": "我的"
    }
  ]

}

/**
 * tabbar主入口
 * @param  {String} bindName 
 * @param  {[type]} id       [表示第几个tabbar，以0开始]
 * @param  {[type]} target   [当前对象]
 */
function tabbarmain(bindName = "tabdata", id, target) {
  var that = target;
  var bindData = {};
  var otabbar = tabbarinit();
  otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']//换当前的icon
  otabbar[id]['current'] = 1;
  bindData[bindName] = otabbar
  that.setData({ bindData });
}


module.exports = {
  tabbar: tabbarmain
}