import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 같은 네트워크의 다른 기기(팀원 노트북, 휴대폰)도 http://<이 PC의 IP>:5173 으로 접속할 수 있게 한다.
    host: true,
    // 개발 서버에서 /api 요청을 백엔드로 넘긴다. 브라우저 입장에서 같은 주소라
    // CORS와 세션 쿠키(SameSite) 문제가 생기지 않는다. 배포 시에는 Vercel rewrites로 같은 구조를 만든다.
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})
