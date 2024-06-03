import { defineStore } from "pinia";
import apiClient from "../config/axios.js";
import router from "../router/index.js";

export const useUserStore = defineStore('user', {
    persist: true,
    state: () => ({
        accessToken: null,
        userData: null,
        isLoggedIn: false,
        userName: 'Anonymous',
        accessTokenExpiration: null,
    }),
    getters: {
        isTokenExpired: (state) => {
            return Date.now() > state.accessTokenExpiration;
        }
    },
    actions: {
        setAccessToken(accessToken, expirationTime) {
            this.accessToken = accessToken;
            this.accessTokenExpiration = expirationTime;
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('accessTokenExpiration', expirationTime);
        },
        setUserData(userData) {
            this.userData = userData;
            this.isLoggedIn = true;
            this.userName = userData.name;
        },
        async login(userId, password) {
            try {
                const response = await apiClient.post('/auth/login', {
                    user_id: userId,
                    password: password
                });
                if (response.status !== 200) {
                    throw new Error('로그인 실패');
                }

                const accessToken = response.headers['authorization'];
                if (!accessToken) {
                    throw new Error('토큰이 없습니다.');
                }

                const expirationTime = Date.now() + 5000//60 * 60 * 1000; // 1시간 후 만료
                this.setAccessToken(accessToken, expirationTime);

                const userData = response.data.data;
                if (userData.status === 'PENDING') {
                    throw new Error('해당 업체에 승인 되지 않은 유저 입니다.');
                }
                this.setUserData(userData);
            } catch (error) {
                console.error('로그인 요청 실패:', error.message);
                throw error;
            }
        },
        checkTokenExpiration() {
            if (this.isLoggedIn && this.isTokenExpired) {
                alert('토큰 만료되어 로그아웃 합니다');
                this.logout();
            }
        },
        async logout() {
            try {
                // AccessToken
                const token = this.accessToken;
                const headers = { 'Authorization': `${token}` };
                // 서버에 로그아웃 요청
                await apiClient.post('/auth/logout', {}, { headers });
                console.log('Logged out on server.');
                // 클라이언트 측 정리
                this.$reset(); // 모든 state를 초기화
                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('accessTokenExpiration');
            } catch (error) {
                console.error('로그아웃 실패:', error);
            }
        },
    },
});
