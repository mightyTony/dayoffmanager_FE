import {defineStore} from "pinia";

export const useUserStore = defineStore('user', {
    // (상태)state
    state: () => ({
        accessToken: null,
        userData : null,
        isLoggedIn : false,
        userName: 'Anonymous',
    }),

    // getter
    // getters: {
    //     isLoggedIn: (state) => !!state.accessToken,
    //     getUser: (state) => state.userData,
    //     getUsername() {
    //         return this.userData ? this.userData.username : null;
    //     }
    // },

    // action
    actions: {
      //접근 토큰 설정
        setAccessToken(accessToken) {
            this.accessToken = accessToken;
        },

        // 사용자 정보 설정
        setUserData(userData) {
            this.userData = userData;
            this.isLoggedIn = true;
            this.userName = userData.name;
        },

        // 로그아웃
        logout() {
            this.accessToken = null;
            this.userData = null;
            this.isLoggedIn = false;
            this.userName = 'Anonymous';
        },
    },
});