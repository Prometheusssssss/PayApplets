

var Main = async function (oimage, page) {
  // 1mb
  var originPicInfo = await new Promise((r) => {
      wx.getImageInfo({
          src: oimage,
          success(originPicInfo) {
              r(originPicInfo)

          }
      })
  })
  return IsNeedCompressImage(originPicInfo.path, page, 1);
}

var IsNeedCompressImage = async function (path, page, quality) {
  var size = await new Promise((r) => {
      wx.getFileInfo({
          filePath: path,
          success(res) {
              r(res.size);
          }
      })
  })
  if (size > 1000000) {
      console.log('size', size, 'quality', quality);
      return compressorImage(path, page, quality)
  } else {
      return path;
  }
}

var compressorImage = async function (path, page, quality) {
  console.log('do compressorImage', path, page, quality);
  var originPicInfo = await new Promise((r) => {
      wx.getImageInfo({
          src: path,
          success(originPicInfo) {
              r(originPicInfo)

          }
      })
  })
  var ctx = wx.createCanvasContext('photo_canvas', page);//使用一个canvas
  var pWidth = parseInt((originPicInfo.width) / 16) * 16;
  var pHeight = parseInt((originPicInfo.height) / 16) * 16;
  var cWidth = 800; //设置缩略图初始宽度 //可调
  var cHeight = 800; //设置缩略图初始高度 //可调
  var r = 0;
  if (pWidth > pHeight) {
      r = pWidth / cWidth
  } else {
      r = pHeight / cHeight
  }
  var totalR = r < 1 ? 1 : r;
  console.log(pWidth, pHeight, totalR, cWidth, cHeight);
  var drawW = pWidth / totalR;
  var drawH = pHeight / totalR;
  //绘制新图
  ctx.setFillStyle("#fff");
  // ctx.clearRect(0, 0, cWidth, cHeight);
  ctx.drawImage(originPicInfo.path, 0, 0, drawW, drawH)
  ctx.restore();

  await new Promise((r) => {
      ctx.draw(true, () => {
          r()
      });
  })
  console.log("wait result")
  var result = await new Promise((r) => {
      var v = Number.parseFloat(Math.sqrt(quality).toFixed(2));
      console.log(v, 'v', drawW * drawH, quality)
      wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: drawW,
          height: drawH,
          destWidth: drawW * v,
          destHeight: drawH * v,
          canvasId: 'photo_canvas',
          success: function (res) {
              var filePath = res.tempFilePath;
              r(filePath);
          },
          fail: function (error) {
              console.log(error, 'error')
          }
      }, page)
  })
  return IsNeedCompressImage(result, page, quality - 0.2);
}


module.exports = {
  // aMapConfig: amapConfig,
  Main: Main
}