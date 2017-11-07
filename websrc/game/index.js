Page({

  tabClick: function(e) {
    this.setData({
      id: e.currentTarget.id,
      ename: e.currentTarget.dataset.ename
    });
    this.getCateList(1, this.data.ename);
  },
  
  aaa: function(e) {
    console.log(e);
  },

  onLoad: function() {
    var that = this;

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
        that.getCateList(1, 'lol');
      }
    })
  },

  getCateList: function(pageno, cate) {
    console.log(cate);

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
        that.setData({
          items: [],
          loadingMoreHidden: true
        });
        var items = [];
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
      }
    })
  }
})