/* eslint-disable  */
interface ISetting {
  watermark_id: string
  watermark_parent_node: string
  watermark_x: number
  watermark_y: number
  watermark_width: number
  watermark_height: number
  watermark_txt: string

  watermark_fontsize: string
  watermark_color: string
  watermark_angle: number
  monitor: boolean
  watermark_prefix: string
  watermark_rows: number
  watermark_cols: number
  watermark_x_space: number
  watermark_y_space: number
  watermark_font: string
  watermark_alpha: string
  watermark_parent_width: number
  watermark_parent_height: number
}
// watermark-dom 插件
// 直接引入的函数库不生效，转换成ts
function Watermark() {
  /* Just return a value to define the module export. */
  const watermark = {
    init: (...args: any) => {},
    load: (...args: any) => {},
    remove: (...args: any) => {},
  }

  let forceRemove = false

  const defaultSettings: ISetting = {
    watermark_txt: '小红书',
    watermark_fontsize: '13px',
    watermark_color: '#ccc',
    watermark_width: 120,
    watermark_height: 60,
    watermark_angle: 20,
    monitor: false,
    watermark_id: 'wm_div_id', // 水印总体的id
    watermark_prefix: 'mask_div_id', // 小水印的id前缀
    watermark_x: 20, // 水印起始位置x轴坐标
    watermark_y: 20, // 水印起始位置Y轴坐标
    watermark_rows: 0, // 水印行数
    watermark_cols: 0, // 水印列数
    watermark_x_space: 50, // 水印x轴间隔
    watermark_y_space: 50, // 水印y轴间隔
    watermark_alpha: '0.15', // 水印透明度，要求设置在大于等于0.005
    watermark_parent_width: 0, // 水印的总体宽度（默认值：body的scrollWidth和clientWidth的较大值）
    watermark_parent_height: 0, // 水印的总体高度（默认值：body的scrollHeight和clientHeight的较大值）
    watermark_parent_node: 'js-watermark', // 水印插件挂载的父元素element,不输入则默认挂在body上
    watermark_font: '\'PingFang SC\', \'SF Pro Text\', \'Microsoft YaHei\', Helvetica, Arial, \'-apple-system\', sans-serif',
  }

  let globalSetting: any = {}

  // 监听dom是否被移除或者改变属性的回调函数
  const domChangeCallback = function (records: any) {
    if (forceRemove) {
      forceRemove = false
      return
    }
    if ((globalSetting && records.length === 1) || records.length === 1 && records[0].removedNodes.length >= 1) {
      loadMark(globalSetting)
    }
  }

  const hasObserver = MutationObserver !== undefined
  let watermarkDom = hasObserver ? new MutationObserver(domChangeCallback) : null
  const option = {
    childList: true,
    attributes: true,
    subtree: true,
    attributeFilter: ['style'],
    attributeOldValue: true,
  }

  /* 加载水印 */
  var loadMark = function (settings: ISetting) {
    /* 采用配置项替换默认值，作用类似jquery.extend */
    if (arguments.length === 1 && typeof arguments[0] === 'object') {
      const src: ISetting = settings || {}
      Object.keys(src).forEach(k => {
        const key = k as keyof ISetting
        if (src[key] && defaultSettings[key] && src[key] === defaultSettings[key]) {
          // no-op
        } else if (src[key] || src[key] === 0) {
          defaultSettings[key] = src[key] as never
        }
      })
    }

    /* 如果元素存在则移除 */
    const watermark_element = document.getElementById(defaultSettings.watermark_id)
    watermark_element && watermark_element.parentNode && watermark_element.parentNode.removeChild(watermark_element)

    /* 如果设置水印挂载的父元素的id */
    const watermark_parent_element = document.getElementById(defaultSettings.watermark_parent_node)
    const watermark_hook_element = watermark_parent_element || document.body

    /* 获取页面宽度 */
    // var page_width = Math.max(watermark_hook_element.scrollWidth,watermark_hook_element.clientWidth) - defaultSettings.watermark_width/2;
    const page_width = Math.max(watermark_hook_element.scrollWidth, watermark_hook_element.clientWidth)
    /* 获取页面最大长度 */
    // var page_height = Math.max(watermark_hook_element.scrollHeight,watermark_hook_element.clientHeight,document.documentElement.clientHeight)-defaultSettings.watermark_height/2;
    const page_height = Math.max(watermark_hook_element.scrollHeight, watermark_hook_element.clientHeight)

    const setting = arguments[0] || {}
    const parentEle = watermark_hook_element

    let page_offsetTop = 0
    let page_offsetLeft = 0
    if (setting.watermark_parent_width || setting.watermark_parent_height) {
      /* 指定父元素同时指定了宽或高 */
      if (parentEle) {
        page_offsetTop = parentEle.offsetTop || 0
        page_offsetLeft = parentEle.offsetLeft || 0
        defaultSettings.watermark_x += page_offsetLeft
        defaultSettings.watermark_y += page_offsetTop
      }
    } else if (parentEle) {
      page_offsetTop = parentEle.offsetTop || 0
      page_offsetLeft = parentEle.offsetLeft || 0
    }

    /* 创建水印外壳div */
    let otdiv = document.getElementById(defaultSettings.watermark_id)
    let shadowRoot:ShadowRoot|HTMLElement|null = null

    if (!otdiv) {
      otdiv = document.createElement('div')
      /* 创建shadow dom */
      otdiv.id = defaultSettings.watermark_id
      otdiv.setAttribute('style', 'pointer-events: none !important; display: block !important')
      /* 判断浏览器是否支持attachShadow方法 */
      if (typeof otdiv.attachShadow === 'function') {
        /* createShadowRoot Deprecated. Not for use in new websites. Use attachShadow */
        shadowRoot = otdiv.attachShadow({ mode: 'open' })
      } else {
        shadowRoot = otdiv
      }
      /* 将shadow dom随机插入body内的任意位置 */
      const nodeList = watermark_hook_element.children
      const index = Math.floor(Math.random() * (nodeList.length - 1))
      if (nodeList[index]) {
        watermark_hook_element.insertBefore(otdiv, nodeList[index])
      } else {
        watermark_hook_element.appendChild(otdiv)
      }
    } else if (otdiv.shadowRoot) {
      shadowRoot = otdiv.shadowRoot
    }
    /* 三种情况下会重新计算水印列数和x方向水印间隔：1、水印列数设置为0，2、水印宽度大于页面宽度，3、水印宽度小于于页面宽度 */
    defaultSettings.watermark_cols = Math.round((page_width - defaultSettings.watermark_x) / (defaultSettings.watermark_width + defaultSettings.watermark_x_space))
    const temp_watermark_x_space = Math.round((page_width - defaultSettings.watermark_x - defaultSettings.watermark_width * defaultSettings.watermark_cols) / (defaultSettings.watermark_cols))
    defaultSettings.watermark_x_space = temp_watermark_x_space ? defaultSettings.watermark_x_space : temp_watermark_x_space
    let allWatermarkWidth

    /* 三种情况下会重新计算水印行数和y方向水印间隔：1、水印行数设置为0，2、水印长度大于页面长度，3、水印长度小于于页面长度 */
    defaultSettings.watermark_rows = Math.round((page_height - defaultSettings.watermark_y) / (defaultSettings.watermark_height + defaultSettings.watermark_y_space))
    const temp_watermark_y_space = Math.round((page_height - defaultSettings.watermark_y - defaultSettings.watermark_height * defaultSettings.watermark_rows) / (defaultSettings.watermark_rows))
    defaultSettings.watermark_y_space = temp_watermark_y_space ? defaultSettings.watermark_y_space : temp_watermark_y_space
    let allWatermarkHeight

    if (watermark_parent_element) {
      allWatermarkWidth = defaultSettings.watermark_x + defaultSettings.watermark_width * defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)
      allWatermarkHeight = defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)
    } else {
      allWatermarkWidth = page_offsetLeft + defaultSettings.watermark_x + defaultSettings.watermark_width * defaultSettings.watermark_cols + defaultSettings.watermark_x_space * (defaultSettings.watermark_cols - 1)
      allWatermarkHeight = page_offsetTop + defaultSettings.watermark_y + defaultSettings.watermark_height * defaultSettings.watermark_rows + defaultSettings.watermark_y_space * (defaultSettings.watermark_rows - 1)
    }

    let x
    let y
    for (let i = 0; i < defaultSettings.watermark_rows; i++) {
      if (watermark_parent_element) {
        y = page_offsetTop + defaultSettings.watermark_y + (page_height - allWatermarkHeight) / 2 + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i
      } else {
        y = defaultSettings.watermark_y + (page_height - allWatermarkHeight) / 2 + (defaultSettings.watermark_y_space + defaultSettings.watermark_height) * i
      }
      for (let j = 0; j < defaultSettings.watermark_cols; j++) {
        if (watermark_parent_element) {
          x = page_offsetLeft + defaultSettings.watermark_x + (page_width - allWatermarkWidth) / 2 + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j
        } else {
          x = defaultSettings.watermark_x + (page_width - allWatermarkWidth) / 2 + (defaultSettings.watermark_width + defaultSettings.watermark_x_space) * j
        }
        const mask_div = document.createElement('div')
        const oText = document.createTextNode(defaultSettings.watermark_txt)
        mask_div.appendChild(oText)
        /* 设置水印相关属性start */
        mask_div.id = defaultSettings.watermark_prefix + i + j
        /* 设置水印div倾斜显示 */
        mask_div.style.webkitTransform = `rotate(-${defaultSettings.watermark_angle}deg)`;
        (mask_div.style as any).MozTransform = `rotate(-${defaultSettings.watermark_angle}deg)`;
        (mask_div.style as any).msTransform = `rotate(-${defaultSettings.watermark_angle}deg)`;
        (mask_div.style as any).OTransform = `rotate(-${defaultSettings.watermark_angle}deg)`
        mask_div.style.transform = `rotate(-${defaultSettings.watermark_angle}deg)`
        mask_div.style.visibility = ''
        mask_div.style.position = 'absolute'
        /* 选不中 */
        mask_div.style.left = `${x}px`
        mask_div.style.top = `${y}px`
        mask_div.style.overflow = 'hidden'
        mask_div.style.zIndex = '9999999'
        mask_div.style.opacity = defaultSettings.watermark_alpha
        mask_div.style.fontSize = defaultSettings.watermark_fontsize
        mask_div.style.fontFamily = defaultSettings.watermark_font
        mask_div.style.color = defaultSettings.watermark_color
        mask_div.style.textAlign = 'center'
        mask_div.style.width = `${defaultSettings.watermark_width}px`
        mask_div.style.height = `${defaultSettings.watermark_height}px`
        mask_div.style.display = 'block'
        mask_div.style.userSelect = 'none'
        /* 设置水印相关属性end */
        shadowRoot?.appendChild(mask_div)
      }
    }

    // monitor 是否监控， true: 不可删除水印; false: 可删水印。
    const minotor = settings.monitor === undefined ? defaultSettings.monitor : settings.monitor
    if (minotor && hasObserver) {
      watermarkDom?.observe(watermark_hook_element, option)
      watermarkDom?.observe(document.getElementById(defaultSettings.watermark_id)?.shadowRoot as Node, option)
    }
  }

  /* 移除水印 */
  const removeMark = function () {
    /* 采用配置项替换默认值，作用类似jquery.extend */
    if (arguments.length === 1 && typeof arguments[0] === 'object') {
      const src = arguments[0] || {}
      Object.keys(src).forEach(k => {
        const key = k as keyof ISetting
        if (src[key] && defaultSettings[key] && src[key] === defaultSettings[key]) {
          // no-op
        } else if (src[key] || src[key] === 0) {
          defaultSettings[key] = src[key] as never
        }
      })
    }

    /* 移除水印 */
    const watermark_element = document.getElementById(defaultSettings.watermark_id)
    const _parentElement = watermark_element?.parentNode
    _parentElement?.removeChild(watermark_element as Node)
    // :ambulance: remove()
    // minotor 这个配置有些冗余
    // 如果用 MutationObserver 来监听dom变化防止删除水印
    // remove() 方法里用 MutationObserver 的 disconnect() 解除监听即可
    watermarkDom?.disconnect()
  }

  /* 初始化水印，添加load和resize事件 */
  watermark.init = function (settings: any) {
    globalSetting = settings
    loadMark(settings)
    window.addEventListener('onload', () => {
      loadMark(settings)
    })
    window.addEventListener('resize', () => {
      loadMark(settings)
    })
  }

  /* 手动加载水印 */
  watermark.load = function (settings: any) {
    globalSetting = settings
    loadMark(settings)
  }

  /* 手动移除水印 */
  watermark.remove = function () {
    forceRemove = true
    removeMark()
  }

  // 监听dom是否被移除或者改变属性的回调函数
  const callback = function (records: any) {
    if ((globalSetting && records.length === 1) || records.length === 1 && records[0].removedNodes.length >= 1) {
      loadMark(globalSetting)
      return
    }

    // 监听父节点的尺寸是否发生了变化, 如果发生改变, 则进行重新绘制
    const watermark_parent_element = document.getElementById(defaultSettings.watermark_parent_node)
    if (watermark_parent_element) {
      const newWidth = Number(getComputedStyle(watermark_parent_element).getPropertyValue('width'))
      const newHeight = Number(getComputedStyle(watermark_parent_element).getPropertyValue('height'))
      if (newWidth !== recordOldValue.width || newHeight !== recordOldValue.height) {
        recordOldValue.width = newWidth
        recordOldValue.height = newHeight
        loadMark(globalSetting)
      }
    }
  }

  watermarkDom = new MutationObserver(callback)

  var recordOldValue = {
    width: 0,
    height: 0,
  }

  return watermark
}

const watermark = Watermark()

export default watermark

/* eslint-enable  */
