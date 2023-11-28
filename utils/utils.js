// 验证手机格式
function Reg(num){
  var reg = new RegExp(/^1[3456789]\d{9}$/)
  return reg.test(num)
}

module.exports = Reg;

