import { defineStore } from "pinia";
import apiClient from "../config/axios.js";

export const useUserStore = defineStore('user', {
    persist: true,
    state: () => ({
        accessToken: null,
        userData: null,
        isLoggedIn: false,
        userName: 'Anonymous',
    }),
    actions: {
        setAccessToken(accessToken) {
            this.accessToken = accessToken;
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

                this.setAccessToken(accessToken);
                localStorage.setItem('accessToken', accessToken);
                const expirationTime = Date.now() + 60 * 60 * 1000; // 1시간
                localStorage.setItem('accessTokenExpiration', expirationTime);

                const userData = response.data.data;

                if (userData.status === 'PENDING') {
                    throw new Error('해당 업체에 승인 되지 않은 유저 입니다.');
                }

                this.setUserData(userData);

                //router = useRouter();
                //router.push('/'); // 로그인 후 홈페이지로 리다이렉트

            } catch (error) {
                console.error('로그인 요청 실패:', error.message);
                throw error; // 에러를 던져주어 UI에서 처리할 수 있게 함
            }
        },
        async logout() {
            try {

                //AccessToken
                const token = localStorage.getItem('accessToken');

                const headers = {
                    'Authorization': `${token}`
                };

                // 서버에 로그아웃 요청
                await apiClient.post('/auth/logout', {}, { headers });
                console.log('Logged out on server.');

                // 클라이언트 측 정리
                this.accessToken = null;
                this.userData = null;
                this.isLoggedIn = false;
                this.userName = 'Anonymous';

                localStorage.removeItem('user');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('accessTokenExpiration');
            } catch (error) {
                console.error('로그아웃 실패:', error);
            }
        },
    },
});

