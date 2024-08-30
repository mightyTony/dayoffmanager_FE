import axios from "axios";
import {useUserStore} from "../store/userStore.js";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        'Content-Type' : "application/json",
    },
    withCredentials: true, // 쿠키 전송 허용
    timeout: 5000 // 전역 5초 타임 아웃
});

// 요청 인터셉터
apiClient.interceptors.request.use(
    config => {
        const accessToken = useUserStore().getAccessToken // localStorage.getItem('accessToken');
        console.log("intercept accesstoken :", accessToken);
        if(accessToken) {
            config.headers['Authorization'] = `${accessToken}`;
        }

        return config;
    },
    error => {
        return Promise.reject(error);
    }
)

// 응답 인터셉터 설정
apiClient.interceptors.response.use(
    response => response, // 정상 응답 처리
    async error => { // 오류 응답 처리
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // 이 요청에 대한 재시도 플래그 설정
            try {
                await userStore.refreshAccessTokenByRefreshToken(); // 서버 에서 401 보낼 시 응답 으로 액세스 토큰 갱신 시도
                return apiClient(originalRequest); // 원래 요청 재시도
            } catch (e) {
                return Promise.reject(e); // 토큰 갱신 실패 처리
            }
        }
        return Promise.reject(error); // 기타 모든 오류를 재반환
    }
);

export default apiClient;