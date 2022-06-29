import {
  ref, createApp, ComponentPublicInstance, h, Component, App
} from 'vue'
import ConfigProvider from 'ant-design-vue/lib/config-provider'
import locale from 'ant-design-vue/es/locale/zh_CN'

function initGlobalComponents(app: App) {
  if (app?.use) {
    [].forEach(comp => app.use(comp))
  }
}

export default function useDynamicComponent(CustomComponent: Component, props?: any): Promise<any[]> {
  return new Promise(resolve => {
    const visible = ref(true)
    const div = document.createElement('div')
    let instance: ComponentPublicInstance | null = null

    document.body.appendChild(div)
    function closeComponent() {
      visible.value = false
      setTimeout(() => {
        if (instance && div.parentNode) {
          div.parentNode.removeChild(div)
          instance = null
        }
      }, 500)
    }

    function confirm(...args: any[]) {
      closeComponent()
      resolve(args)
    }

    function close() {
      closeComponent()
      // reject() we do not need reject
    }

    function componentMounted() {
      const app = createApp({
        render() {
          const options = {
            ...(props || {}),
            onClose: close,
            onConfirm: confirm,
            visible: visible.value,
            getContainer: () => div,
          }

          return h(ConfigProvider, {
            locale,
          }, h(CustomComponent, options))
        },
      })
      // 注入需要的全局组件
      initGlobalComponents(app)

      return app.mount(div)
    }

    // 动态创建组件
    instance = componentMounted()
  })
}
