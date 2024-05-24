// 获取数据库引用
const db = wx.cloud.database();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    messagelist: [],  //新闻消息列表
    listHeight: 0    //列表高度
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("messagelist:", this.data.messagelist);
    var that = this, selectQuery = wx.createSelectorQuery();
    //直接使用小程序API拉取云数据库数据
    db.collection('message').get({
      success: function(res){
        console.log("res:", res);
        that.setData({
          messagelist: res.data  //把获取的数据给messagelist
        })
        //获取用户信息结构高度
        selectQuery.select(".user").boundingClientRect(function (e) {
          var winHeight = wx.getSystemInfoSync().windowHeight;
          if (e && e.height) {
            that.setData({
              listHeight: winHeight - e.height
            });
          }
        }).exec();
      }
    })
  }
})