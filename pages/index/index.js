// pages/editPic/editPic.js
var that = this;
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: 0,
    right_arrow: "inline-block",
    down_arrow:"none",
    isLists:"block",
    arrHight:[],
    tagList: [],
    imgList: [],
    arry: [],
    seeHeight:900,
    searchIcon: "inline-block",
    searchKey:"搜索",
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取屏幕高宽
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight*2
        });
      },
    });
    if(options.url==null || options.url==""){
      var url = '/Emoji/Hot';
    }else{
      var url = options.url; 
    }

    if(options.data!=null && options.data!=""){
      var url = url + encodeURI(options.data);
    }
    //获取tagList
    wx.request({
      url: app.globalData.url + '/Emoji/Tag',
      success: function (res) {
        var tagList = new Array();
        for (let i = 0; i < res.data.Value.length; i++){
            var tag = {};
            tag.tagId = res.data.Value[i].tagId;
            tag.tagName = res.data.Value[i].tagName;
            tagList.push(tag);
        }
        that.setData({
          tagList: tagList
        })
      }
    })
    //获取默认主页热图的imgList
    wx.request({
      url: app.globalData.url + url,
      method: 'GET',
      header: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      success: function (res) {
        var imgList = new Array();
        if (res.data.Value == null || res.data.Value=="" ){
          var value = res.data.value;
        }else{
          var value = res.data.Value;
        }
        for (let i = 0; i < value.length; i++) {
          var img = {};
          img.imgId = value[i].imgId;
          img.imgUrl = value[i].imgUrl;
          imgList.push(img);
        }
        that.setData({
          imgList: imgList
        })
        //在确保获取到图片列表后初始化arry
        var arry = new Array();
        var arrHight = new Array();
        for (let i = 0; i < that.data.imgList.length; i++) {
          arrHight[i] = Math.floor(i / 3) * 175 ;
          if (arrHight[i] < that.data.seeHeight) {  //初次打开页面时，可见范围内处理为true
            arry.push(true);
          }else{
            arry.push(false);
          }
        };
        that.setData({
          arry: arry,
          arrHight: arrHight,
        })
      }
    })
   
  },
//图片列表部分滚动事件（懒加载）
  scroll: function (e) {
    var scrollTop = e.detail.scrollTop * 2 + this.data.seeHeight;  
    var arry=this.data.arry;
    for (let i = 0; i < this.data.imgList.length; i++){
      if (this.data.arrHight[i] < scrollTop) {  
        if (arry[i] == false) {  
          arry[i] = true;  
        }
      }
    }
    this.setData({
      arry: arry,
    })  
  },
  //点击tag
  selectTag:function(e){
    var toUrl = '/Emoji/TagList/' + e.currentTarget.dataset.tagid
    wx.redirectTo({
      url: '/pages/index/index?url='+toUrl,
    })
  },
  //显示或隐藏tag展开
  showList:function(){
    if (this.data.right_arrow=="none"){
      this.setData({
        right_arrow: "inline-block",
        down_arrow: "none",
      })
    }else{
      this.setData({
        right_arrow: "none",
        down_arrow: "block",
      })
    }
  },
  //搜索框获取焦点
  focusSearch:function() {
    this.setData({
      searchIcon: "none",
      searchKey:"",
    })
  },
    //搜索框失去焦点
  blurSearch: function (e) {
    if (e.detail.value ==""){
      this.setData({
        searchIcon: "inline-block",
        searchKey:"搜索",
      })
    }else{
      var tagName = e.detail.value;
      var toUrl = '/Emoji/Search/'  
      wx.redirectTo({
        url: '/pages/index/index?url=' + toUrl + '&data=' + tagName,
      })
    }
  },
//搜索事件
  search:function(e){
    var tagName = e.detail.value;
    var toUrl = '/Emoji/Search/';
    wx.redirectTo({
      url: '/pages/index/index?url=' + toUrl + '&data=' + tagName,
    })
  }

})