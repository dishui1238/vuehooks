import { createVNode } from 'vue'
import Modal, { ModalFuncProps } from 'ant-design-vue/lib/modal'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'

export default function useConfirm(options: ModalFuncProps | string, onOk = () => { }) {
  const cdOptions: ModalFuncProps = typeof options === 'string' ? {
    onOk, content: options, title: '提示',
  } : options

  Modal.confirm({
    icon: createVNode(ExclamationCircleOutlined),
    ...cdOptions,
  })
}
