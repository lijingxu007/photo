// pages/index/index.js
// import { getText } from '../../common/lib/api.js'
import { questionData} from '../../common/lib/idx.js'
import { rnd } from '../../utils/util.js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '看不'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.showLoading()
    questionData().then(res => {
      let index = rnd(1, 3)
      console.log('/images/index-middle' + index + '.jpg')
      this.setData({
        index_image: '/images/index-middle' + index + '.jpg'
      })
      app.soliloquy = res.desc
      app.share_image = '/images/index-middle' + index + '.jpg'
      wx.hideLoading()
    }).catch(res => {
      let index = rnd(1,3)
      this.setData({
        index_image: '/images/index-middle' + index +'.jpg'
      })
      wx.hideLoading()
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // listenScreenEvent(this)
    // if (wx.getStorageSync('screenData')){
    //   wx.navigateTo({
    //     url: '/pages/index/index',
    //   })
    // }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  play(e) {
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值
        app.src = src
        wx.navigateTo({
          url: '/pages/detail/detail',
        })
      }
    })
  },
  onShareAppMessage(){
    return {
        title:"把生活拍成电影",
        path:"pages/index/index",
        imageUrl:'/images/share.jpg'
    }
  }

})