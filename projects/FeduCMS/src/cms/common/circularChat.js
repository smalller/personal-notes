/*
 * @Author: 吴同学
 * @Date: 2022-03-01 17:30:18
 * @Last Modified by: 吴同学
 * @Last Modified time: 2022-03-02 13:41:17
 */

/**
 * drawingElem 绘制对象
 * percent 绘制圆环百分比, 范围[0, 100]
 * forecolor 绘制圆环的前景色，颜色代码
 * bgcolor  绘制圆环的背景色，颜色代码
 * lineWidth 圆环的线宽
 * fontSize 字体大小
 * flag 类型，不同地方使用传不同类型就行自定义
 */
export class CircularChat {
  constructor(opt) {
    this.drawingElem = opt.drawingElem
    this.percent = opt.percent || 0
    this.forecolor = opt.forecolor || '#4FA8F9'
    this.bgcolor = opt.bgcolor || '#FC6392'
    this.lineWidth = opt.lineWidth || 16
    this.fontSize = opt.fontSize || 32
    this.flag = opt.flag || 1

    this.context = this.drawingElem.getContext('2d')
    this.centerX = this.drawingElem.width / 2 //中心轴X点坐标
    this.centerY = this.drawingElem.height / 2 //中心轴Y点坐标
    this.rad = (Math.PI * 2) / 100 //弧度
    this.speed = 0 //圆环过度的速度

    this.drawFrame()
  }

  // 绘制背景圆圈
  backgroundCircle() {
    this.context.save()
    this.context.beginPath()
    // this.context.lineCap = 'round'
    this.context.lineWidth = this.lineWidth
    const radius = this.centerX - this.context.lineWidth
    this.context.strokeStyle = this.bgcolor
    this.context.arc(this.centerX, this.centerY, radius, 0, Math.PI * 2, false)
    this.context.stroke()
    this.context.closePath()
    this.context.restore()
  }

  //绘制运动圆环
  foregroundCircle(n) {
    this.context.save()
    // context.lineCap = 'round'
    this.context.strokeStyle = this.forecolor
    this.context.lineWidth = this.lineWidth
    const radius = this.centerX - this.context.lineWidth
    this.context.beginPath()
    this.context.arc(
      this.centerX,
      this.centerY,
      radius,
      -Math.PI / 2,
      -Math.PI / 2 + n * this.rad,
      false
    ) //用于绘制圆弧context.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
    this.context.stroke()
    this.context.closePath()
    this.context.restore()
  }

  //绘制文字
  text(n) {
    this.context.save() //save和restore可以保证样式属性只运用于该段canvas元素
    this.context.fillStyle = '#222'
    this.context.font = this.fontSize + 'px Helvetica'
    const textWidth = this.context.measureText(n.toFixed(0) + '%').width

    if (this.flag === 1) {
      this.context.fillText(
        n.toFixed(0) + '%',
        this.centerX - textWidth / 2,
        this.centerY - 5
      )
      this.context.font = '20px Helvetica'
      this.context.fillText(
        '入住率',
        this.centerX - textWidth / 2,
        this.centerX + textWidth / 2 - 5
      )
    } else if (this.flag === 2) {
      this.context.fillText(
        n.toFixed(0) + '%',
        this.centerX - textWidth / 2,
        this.centerY + this.fontSize / 2 - 5
      )
    }

    this.context.restore()
  }

  //执行动画
  drawFrame() {
    window.requestAnimationFrame(this.drawFrame.bind(this))
    this.context.clearRect(
      0,
      0,
      this.drawingElem.width,
      this.drawingElem.height
    )
    this.backgroundCircle()
    this.text(this.speed)
    this.foregroundCircle(this.speed)
    if (this.speed >= this.percent) return
    this.speed += 1
  }
}
