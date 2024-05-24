const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database();

/**
 * 云函数入口文件
 * @param {object} event - 传递给云函数的参数
 */
exports.main = async (event, context) => {
  try {
    const { image, title, info } = event
    const messageCollection = db.collection('message');
    const result = await messageCollection.add({
      image,
      title,
      info
    });
    return {
      success: true,
      result: result,
      message: '信息公告提交成功'
    };
  } catch (e) {
    return {
      success: false,
      message: e.message
    };
  }
}