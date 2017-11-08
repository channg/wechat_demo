var app = getApp();

var pageno = 1;
var pagecount = -1;
var PAGENUM = 10;
var cate = 'lol';

Page({

  tabClick: function(e) {
    var that = this;
    that.setData({
      id: e.currentTarget.id,
      ename: e.currentTarget.dataset.ename
    });
    pageno = 1;
    pagecount = -1;
    cate = this.data.ename;
    this.loadMore();
  },

  onReachBottom: function(e) {
    var that = this;
    if(pageno > pagecount) {
      return;
    }
    this.loadMore();
  },

  onLoad: function(params) {
    var that = this;
    cate = params.cate;

    console.log(pagecount);

    wx.request({
      url: 'https://api.m.panda.tv/index.php',
      method: 'GET',
      data: {
        'method': 'category.list',
        'type': 'game'
      },
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        var categories = [{
          id: 0,
          ename: 'lol',
          cname: "娱乐联盟"
        }];
        if (res.data.errno == 0) {
          for (var i = 1; i < res.data.data.length; i++) {
            categories.push({
              id: i,
              ename: res.data.data[i].ename,
              cname: res.data.data[i].cname
            });
          }
        }
        that.setData({
          categories: categories,
          id: 0
        });
      }
    })

    this.loadMore();
  },

  loadMore: function() {
    var that = this;
    wx.request({
      url: 'https://api.m.panda.tv/ajax_get_live_list_by_cate',
      method: 'GET',
      data: {
        'pageno': pageno,
        'pagenum': '10',
        '__plat': 'h5',
        'cate': cate
      },
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        var items = [];
        if (pagecount === -1) {
          pagecount = Math.ceil(res.data.data.total / PAGENUM);
        }
        if (res.data.errno != 0 || res.data.data.total == 0) {
          that.setData({
            loadingMoreHidden: false,
          });
          return;
        }
        for (var i = 0; i < res.data.data.items.length; i++) {
          items.push(res.data.data.items[i]);
        }
        that.setData({
          items: items,
        });
        pageno++;
      }
    })
  }
})