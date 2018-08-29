import WeCropper from '../../utils/we-cropper/we-cropper.js'
import { rnd } from '../../utils/util.js'
import {desc} from '../../mock/mock.js'
// import { listenScreenEvent } from '../../lib/idx.js'
const device = wx.getSystemInfoSync()
const app = getApp()

Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      width: device.windowWidth,
      height: device.windowWidth*0.426666,
      scale: 2.5,
      zoom: 8,
      arrow: true
    },
    index: 0
  },
  touchStart(e) {
    this.wecropper.touchStart(e)
    this.changeArrow()
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage() {
    wx.showLoading({
      title: '生成中...',
    })
    const offCanvasCtx = wx.createCanvasContext('off-canvas')
    
    this.wecropper.getCropperImage((src) => {
      offCanvasCtx.setFillStyle('#000')
      offCanvasCtx.fillRect(0, 0, device.windowWidth, device.windowWidth*0.56)
      offCanvasCtx.drawImage(src, 0, device.windowWidth*0.066, device.windowWidth, device.windowWidth*0.426666)
      offCanvasCtx.setFontSize(10)
      offCanvasCtx.setTextAlign('right')
      offCanvasCtx.setFillStyle('#fff')
      offCanvasCtx.fillText('看不小程序', device.windowWidth*0.96, device.windowWidth * 0.535)
      
      offCanvasCtx.draw( true,
        () => {
          return wx.canvasToTempFilePath({
            canvasId: 'off-canvas',
            x: 0,
            y: 0,
            width: device.windowWidth,
            height: device.windowWidth * 0.56,
            destWidth: device.windowWidth * 3,
            destHeight: device.windowWidth * 0.56 * 3,
            quality: 1,
            success: function success(res) {
              wx.previewImage({
                current: '', // 当前显示图片的http链接
                urls: [res.tempFilePath] // 需要预览的图片http链接列表
              })
              wx.saveImageToPhotosAlbum({
                filePath: res.tempFilePath,
                success(res) {
                  wx.showModal({
                    title: '保存成功',
                    content: '邀请更多好友体验大片特效吧！',
                    confirmText: '去首页',
                    confirmColor: '#00EE00',
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateBack()
                      } 
                    }
                  })
                },
                fail(res) {
                  console.log(res)
                }
              })
              wx.hideLoading()
            },
            fail: function fail(res) {
              wx.hideLoading()
            }
          })
        }
      )
    })
  },
  onLoad(option) {
    const { cropperOpt } = this.data

    if (!app.soliloquy) {
      app.soliloquy = desc
    }
    this.data.index = rnd(0, app.soliloquy.length - 1)
    app.text = app.soliloquy[this.data.index]
    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        wx.hideToast()
      })
    .on('beforeDraw', (ctx) => {
      //  那就尝试在图片上加个水印吧
      // ctx.drawImage(path, 50, 50, 50, 30)
    })
    this.wecropper.pushOrign(app.src)
  },
  changeText() {
    this.data.index = this.data.index  + 1
    if (this.data.index >= app.soliloquy .length) {
      this.data.index = 0
    }
    app.text = app.soliloquy [this.data.index ]
    this.wecropper.updateCanvas()
  },
  changeArrow() {
    this.data.cropperOpt.arrow = false
    this.setData({
      cropperOpt: this.data.cropperOpt
    })
  },
  onShow: function(){
    // listenScreenEvent(this)
    // if (wx.getStorageSync('screenData')) {  
    //   wx.navigateTo({
    //     url: '/pages/index/index',
    //   })
    // }
  },
  onShareAppMessage() {
    return {
      title:"把生活拍成电影",
      path: "pages/index/index",
      imageUrl: '/images/share.jpg'
    }
  }

})
