<template>
  <v-dialog v-model="modalVisible" persistent max-width="600px">
    <v-card>
      <v-card-title class="text-h5">사용자 정보 수정</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-text-field label="이름"
                        v-model="editData.name"
                        :rules=nameRules>
          </v-text-field>
          <v-text-field label="이메일"
                        v-model="editData.email"
                        :rules=emailRules>
          </v-text-field>
          <v-text-field label="전화번호"
                        v-model="editData.phoneNumber"
                        :rules=phoneNumberRules>
          </v-text-field>
          <v-text-field label="입사일"
                        v-model="editData.hireDate"
                        readonly></v-text-field>
          <v-text-field label="사번"
                        v-model="editData.employeeNumber"
                        :rules=employeeNumberRules>
          </v-text-field>
          <v-select :items="departments"
                    label="부서명"
                    v-model="editData.departmentName"
                    :rules=departmentNameRules>
          </v-select>
          <v-select :items="roles"
                    label="역할"
                    v-model="editData.role"
                    :rules=roleRules>
          </v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn color="blue darken-1" text @click="close">취소</v-btn>
        <v-btn color="green darken-1" text @click="submitForm">승인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import { useListStore } from "../../store/listStore.js";
import {useUserStore} from "../../store/userStore.js";
import apiClient from "../../config/axios.js";

const userStore = useUserStore();
const { userId, companyId } = userStore.userData;
const listStore = useListStore();
const modalVisible = computed({
  get: () => listStore.modalVisible,
  set: (value) => {
    if (!value) listStore.closeModal();
  }
});
const editData = computed(() => listStore.selectedMember || {});

const valid = ref(false);
const departments = computed(() => listStore.departments);
const roles = ['EMPLOYEE', 'TEAM_LEADER', 'ADMIN'];

const close = () => {
  listStore.closeModal();
};

const nameRules = [
  v => !!v || '이름을 입력해 주세요'
];
const emailRules = [
  v => !!v || '이메일을 입력해 주세요',
  v => /.+@.+\..+/.test(v) || '유효한 이메일을 입력해 주세요'
];
const phoneNumberRules = [
  v => !!v || '전화번호를 입력해 주세요',
  v => /^010[0-9]{8}$/.test(v) || '010으로 시작해서 총 11자 이어야 합니다.'
];
const employeeNumberRules = [
  v => !!v || '사번을 입력해 주세요'
];
const departmentNameRules = [
  v => !!v || '부서명을 입력해 주세요'
];
const roleRules = [
  v => !!v || '역할을 선택해 주세요',
  v => v !== 'USER' || 'USER 역할은 선택할 수 없습니다.' // USER 역할 제한
];

// 폼 제출
const submitForm = async () => {
  if (!valid.value) {
    alert("모든 필드에 정보 기입 해주세요.");
    return;
  }

  const payload = {
    name: editData.value.name,
    email: editData.value.email,
    employeeNumber: editData.value.employeeNumber,
    departmentName: editData.value.departmentName,
    userId: editData.value.userId,
    role: editData.value.role,
  }

  try {
    console.log("payload :", payload.role);
    await apiClient.put(`/admin/register`, payload);
    alert("멤버 등록 승인.");
    window.location.reload();
    listStore.closeModal();
  } catch (error) {
    alert("멤버 등록 실패.", error);
  }
}
</script>
