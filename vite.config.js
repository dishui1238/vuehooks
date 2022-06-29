import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from "path";

const root = process.cwd();
function pathResolve(dir) {
  return resolve(root, ".", dir);
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    // 定义别名
    alias: [
      {
        find: "@/",
        replacement: pathResolve("src") + "/",
      },
      {
        find: "@comp/",
        replacement: pathResolve("src/components") + "/",
      },
    ],
  },
})
