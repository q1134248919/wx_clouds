Page({
  data: {
    image: "",
    hasimg: false,
    title: "",
    info: "",
  },
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      success: (chooseResult) => {
        that.setData({
          hasimg: true,
          image: chooseResult.tempFilePaths[0],
        });
        var cloudPath = new Date().getTime() + ".png";
        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: chooseResult.tempFilePaths[0],
          success: (res) => {
            if (res.statusCode === 200) {
              that.setData({
                image: res.fileID,
              });
            }
          },
          fail: (err) => {
            console.error("图片上传失败: ", err);
            wx.showToast({
              title: "图片上传失败",
              icon: "none",
              duration: 2000,
            });
          },
        });
      },
    });
  },

  handleTxtTitle: function (e) {
    this.data.title = e.detail.value;
  },

  handleTxtRemarks: function (e) {
    this.data.info = e.detail.value;
  },
  handleOk: function (e) {
    var that = this;
    var image = this.data.image;
    var title = this.data.title;
    var info = this.data.info;
    if (image && title && info) {
      var newData = {
        image: image,
        title: title,
        info: info,
      };

      const db = wx.cloud.database();
      console.log(db, "213");
      db.collection("message").add({
        data: newData,
        success(res) {
          console.log("提交成功，记录的ID:", res.id);
          // 清空表单数据
          that.setData(
            {
              image: "", // 重置图片路径
              hasimg: false, // 重置图片状态
              title: "", // 清空标题
              info: "", // 清空描述
            },
            () => {
              wx.showToast({
                title: "提交成功",
                duration: 1000,
              });

              setTimeout(function () {
                wx.switchTab({
                  url: "../index/index",
                });
              }, 1000);
            }
          );
        },
        fail(err) {
          // 提交失败的处理
          console.error("提交失败:", err);
          wx.showToast({
            title: "提交失败",
            icon: "none",
            duration: 2000,
          });
        },
      });
    } else {
      wx.showToast({
        title: "请填写完整信息",
        duration: 2000,
      });
    }
  },
});
