import watermark from './watermark-dom' // 水印

export default function initWatermark(value: string, wmWidth = 250) {
  if (!value) {
    return
  }

  const el = document.createElement('div') as any
  const waterID = 'js-watermark'
  el.style = 'position: fixed;top: 0;right: 0;bottom: 0;left: 0;z-index: 100000;pointer-events: none;'
  el.id = waterID
  document.body.appendChild(el)

  watermark.init({
    watermark_txt: value,
    watermark_fontsize: '13px',
    watermark_color: '#aaa',
    watermark_width: wmWidth,
    watermark_height: 30,
    watermark_angle: 20,
    watermark_parent_node: waterID,
    monitor: false,
  })
}
