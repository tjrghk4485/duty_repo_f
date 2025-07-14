// src/apiClient.js (또는 API 호출을 담당하는 파일)
import axios from 'axios';

// Vite에서는 import.meta.env를 통해 환경 변수에 접근합니다.
// 변수 이름은 .env 파일에서 정의한 VITE_ 접두사를 포함한 이름과 동일해야 합니다.
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL;

if (!API_BASE_URL) {
  console.error("VITE_APP_API_BASE_URL 환경 변수가 설정되지 않았습니다.");
  // 필요하다면 기본값 설정 또는 에러 처리
}

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

export default apiClient;