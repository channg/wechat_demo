var app = getApp();

Page({
  data: {
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    circular: true,
    interval: 3000,
    duration: 600,
    sliderData: []
  },

  onLoad: function() {
    var that = this;

    app.getUserInfo(function(userInfo) {
      console.log(userInfo);
      // 用户信息
      that.setData({
        userInfo: userInfo
      })
    })

    wx.request({
      url: 'https://api.m.panda.tv/ajax_rmd_ads_get',
      method: 'GET',
      data: {
        '__plat': 'h5'
      },
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        var result = res.data;
        that.setData({
          sliderData: result.data
        })
      }
    })

    wx.request({
      url: 'https://api.m.panda.tv/ajax_get_live_list_by_multicate',
      method: 'GET',
      data: {
        'hotroom': '1',
        '__plat': 'h5'
      },
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        var result = res.data;
        that.setData({
          blockData: result.data
        })
      }
    })
  },

  onPullDownRefresh: function() {
    wx.showNavigationBarLoading();
    setTimeout(function() {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  }
})