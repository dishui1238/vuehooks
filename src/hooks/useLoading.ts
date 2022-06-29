import {
  createApp, ComponentPublicInstance, h,
} from 'vue'
import GlobalLoading from '../components/Loading.vue'

let loadingInstance: ComponentPublicInstance | null = null
const div = document.createElement('div')

function setLoading() {
  if (loadingInstance) {
    return
  }
  document.body.appendChild(div)

  const app = createApp({
    render() {
      return h(GlobalLoading, {})
    },
  })
  loadingInstance = app.mount(div)
}

function closeLoading() {
  if (loadingInstance && div.parentNode) {
    div.parentNode.removeChild(div)
  }
  loadingInstance = null
}

function setLoadingAutoClose(maxTime = 3 * 1000) {
  setLoading()
  setTimeout(closeLoading, maxTime)
}

export function useLoading(){
  return {
    setLoading, 
    closeLoading, 
    setLoadingAutoClose
  }
}
