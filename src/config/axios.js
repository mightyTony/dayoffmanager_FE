import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type' : "application/json",
    },
    withCredentials: true, // 쿠키 전송 허용
    timeout: 5000 // 전역 5초 타임 아웃
});

export default apiClient;