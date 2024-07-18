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
        roles: [],
    }),
    getters: {
        isMaster: (state) => {
            return state.roles?.includes('MASTER');
        },
        isAdmin: (state) => {
            //console.log("ROLE : ", state.roles);
            return state.roles?.includes('ADMIN');
        },
        isTokenExpired: (state) => {
            return state.accessTokenExpiration && Date.now() > state.accessTokenExpiration;  //Date.now() > state.accessTokenExpiration;
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
            this.roles = userData.roles || [];
            //console.log('IN userDATA roles :', userData.roles)
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

                //FIXME
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
        // FIXME 자동 로그아웃이 아닌 토큰 갱신으로 구현 필요
        async checkTokenExpirationAndRefreshToken() {
            if (this.isLoggedIn && this.isTokenExpired) {
                alert('토큰 만료되어 갱신 중');
                await this.refreshAccessTokenByRefreshToken();
                //this.refreshAccessTokenByRefreshToken();
                //this.logout();
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

        async refreshAccessTokenByRefreshToken() {
            const timeout = 5000;

            const response = await apiClient
                .post('/auth/refresh', {timeout})
                .then(response => {
                    console.log("response.data : ",response.data);
                    console.log("response.data.data : ", response.data.data)
                    console.log("response.data.data.accessToken : ", response.data.data.accessToken)
                    if(response.status === 200) {
                        this.setAccessToken(response.data.data, Date.now() + 5000);
                        //this.setAccessToken(response.data.data.accessToken, Date.now() + 5000);
                        console.log("토큰 갱신됨 !")
                    } else {
                        throw new Error("리프레시 토큰을 이용 할 수 없음");
                    }
                })
                .catch(error => {
                    // 타임아웃 또는 요청 실패
                    this.handleRefreshTokenError();
                    if (error.code === 'ECONNABORTED') {
                        console.log("요청이 타임 아웃 됨");
                    } else {
                        this.$reset();
                        //this.logout().then(r => router.push('/login'));
                        console.error('요청 실패, 홈 화면으로 이동합니다', error);
                    }
                })
        },

        handleRefreshTokenError() {
            this.logout().then(r => router.push('/login'));
        }


    },
});
