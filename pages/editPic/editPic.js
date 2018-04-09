// pages/editPic/editPic.js
var app = getApp();
var that = this
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl:'',
    des:'hahahha',
    apixelRatio:0,
    windowWidth:0,
    windowHeight:0,
    default_text:"",
    user_value:"",
    canvasUrl:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: app.globalData.url + '/Emoji/Image/' + options.id,
      success:function(res){
        console.log(res.data.value.imgUrl+"=======")
        wx.downloadFile({    //此处特别注意：小程序的 wx.createCanvasContext并不能直接使用网络上的图片，必须先下载后，使用下载的图片临时路径，且绘图的代码部分包裹在success中，因为 wx.downloadFile也是异步的
          url: res.data.value.imgUrl,
          success: function (res) { 
            that.setData({
              picUrl: res.tempFilePath,
             })
            const ctx = wx.createCanvasContext('firstCanvas')
            ctx.drawImage(that.data.picUrl, 0, 0, that.data.windowWidth * 0.89, that.data.windowHeight * 0.35)
            ctx.draw();
          }, 
          fail: function () { 
            console.log('fail') 
          } 
      })
        that.setData({
          default_text: res.data.value.preText,
        })
      }
    })
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          apixelRatio:res.pixelRatio,
          windowWidth:res.windowWidth,
          windowHeight:res.windowHeight
        });
      },
    })
   
  },

  setValue:function(e){
    this.setData({
      user_value:e.detail.value
    })
  },

  saveImg:function(e){
    var that = this
    var imgUrl = "";
    const ctx = wx.createCanvasContext('firstCanvas')
    ctx.setFillStyle('white')
    ctx.fillRect(0, 0, that.data.windowWidth * 0.89, that.data.windowHeight * 0.5)
    ctx.drawImage(that.data.picUrl, 0, 0, that.data.windowWidth * 0.89, that.data.windowHeight * 0.35)
    ctx.setFontSize(19)
    ctx.setFillStyle('#000000')
    ctx.setTextAlign('left')
    if (that.data.user_value == null || that.data.user_value==""){
      ctx.fillText(that.data.default_text, 0, that.data.windowHeight * 0.43)
    }else{
      ctx.fillText(that.data.user_value, 0, that.data.windowHeight * 0.43)
    }
    ctx.stroke()
    ctx.draw();
    wx.canvasToTempFilePath({
      canvasId: 'firstCanvas',
      success: function (res) {
        wx.previewImage({
          current: [res.tempFilePath], // 当前显示图片的http链接  
          urls: [res.tempFilePath], // 需要预览的图片http链接列表  
        }) 
        //预览之后将canvas图片变回初始的样子，切要放在 wx.previewImage中，这也是个异步的，否则从预览图片退出后，不一定能顺利执行
        ctx.drawImage(that.data.picUrl, 0, 0, that.data.windowWidth * 0.89, that.data.windowHeight * 0.35)
        ctx.draw(); 
      } 
    })
  
  },
})