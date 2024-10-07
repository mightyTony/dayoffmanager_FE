import { defineStore } from 'pinia';
import apiClient from "../config/axios.js";

export const useListStore = defineStore('list', {
    state: () => ({
        selectedMember: null,
        modalVisible: false,
        departments: [],
        detailedUserInfo : null,
    }),
    actions: {
        setModalVisible(visible) {
            this.modalVisible = visible;
        },
        selectMember(member) {
            this.selectedMember = member;
            this.modalVisible = true;
        },
        closeModal() {
            this.modalVisible = false;
            this.selectedMember = null;
        },
        updateMember(updatedData) {
            if (this.selectedMember && updatedData) {
                this.selectedMember = { ...this.selectedMember, ...updatedData };
            }
        },
        async fetchDepartments(companyId) {
            try {
                const response = await apiClient
                    .get(`/companies/${companyId}/departments`);

                this.departments = response.data.data || [];

                console.log(response.data);
            } catch (error) {
                console.error('failed to fetch departments', error);
            }
        },
        async fetchUserDetail(userId) {
            try{
                const response = await apiClient
                    .get(`/admin`, { params: { userId: userId } });

                this.detailedUserInfo = response.data.data;
                if (this.detailedUserInfo) {
                    this.modalVisible = true; // Ensure this is set only if data is fetched
                } else {
                    console.error('No detailed user info received');
                }

            } catch (error) {
                console.error('failed to fetch user detail', error);
                this.modalVisible = false; // Ensure modal is not shown on error
            }
        }
    }
});
