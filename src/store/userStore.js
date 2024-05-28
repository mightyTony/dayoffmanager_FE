import { defineStore } from "pinia";
import apiClient from "../config/axios.js";

export const useUserStore = defineStore('user', {
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

                localStorage.removeItem('accessToken');
                localStorage.removeItem('accessTokenExpiration');
            } catch (error) {
                console.error('로그아웃 실패:', error);
            }
        },
    },
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    console.log("모든 쿠키: ", document.cookie);  // 모든 쿠키 로그 출력 (디버깅 용도)
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}
