Page({

  onReady: function(res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },

  inputValue: '',

  data: {
    src: '',
    danmuList: [{
      text: '第 1s 出现的弹幕',
      color: '#ff0000',
      time: 1
    }, {
      text: '第 3s 出现的弹幕',
      color: '#ff00ff',
      time: 3
    }]
  },

  bindInputBlur: function(e) {
    this.inputValue = e.detail.value
  },

  bindButtonTap: function() {
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: ['front', 'back'],
      success: function(res) {
        that.setData({
          src: res.tempFilePath
        })
      }
    })
  },

  bindSendDanmu: function() {
    this.videoContext.sendDanmu({
      text: this.inputValue,
      color: getRandomColor()
    })
  },

  onLoad: function(options) {
    var that = this,
      roomid = options.roomid;

    wx.request({
      url: 'https://room.api.m.panda.tv/index.php',
      method: 'GET',
      data: {
        'method': 'room.shareapi',
        'roomid': roomid
      },
      header: {
        'Accept': 'application/json'
      },
      success: function(data) {
        var result = data.data.data;
        var roomkey = result.videoinfo.room_key;
        console.log(roomkey);
        wx.request({
          url: 'https://api.m.panda.tv/stream/room/pull/get',
          method: 'GET',
          data: {
            'roomid': roomid,
            'roomkey': roomkey,
            'definition_option': 1,
            'hardware': 1
          },
          header: {
            'Accept': 'application/json'
          },
          success: function(res) {

            console.log(res);

            result.videoinfo.address = result.videoinfo.address ? result.videoinfo.address.replace(/^http/, 'https') : result.videoinfo.address;
            result.videoinfo.address = result.videoinfo.address + '?sign=' + res.data.data[roomid].sign + res.data.data[roomid].ts;
            
            that.setData({
              roomData: result
            })
          }
        })
      }
    })

    wx.request({
      url: 'https://api.m.panda.tv/index.php',
      method: 'GET',
      data: {
        'method': 'room.alllist',
        'pageno': 1,
        'pagenum': 6,
        'status': 2
      },
      header: {
        'Accept': 'application/json'
      },
      success: function(res) {
        var result = res.data;
        that.setData({
          items: result.data.items
        })
      }
    })
  }
})