<template>
  <v-card class="mx-auto my-12 pa-16" elevation="12" max-width="600" rounded="lg">
    <div class="header-container">
      <div class="text-subtitle-1 text-medium-emphasis">부서 등록</div>
    </div>
    <br/>
    <v-form ref="form" v-model="valid" class="form-style">
      <!-- 부서명 입력 -->
      <v-text-field
          v-model="departmentName"
          label="부서명"
          :rules="departmentNameRules"
          outlined
          dense
          required
      ></v-text-field>

      <br><br>
      <!-- 등록 버튼 -->
      <v-btn
          color="primary"
          large
          :disabled="!valid"
          @click="submitForm"
      >
        부서 등록
      </v-btn>
    </v-form>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import apiClient from "../../config/axios.js";
import {useRouter} from "vue-router";

const router = useRouter();

const valid = ref(false);
const departmentName = ref('');

// 규칙
const departmentNameRules = [
  v => !!v || '부서명을 입력해 주세요',
  v => v.length >= 2 || '부서명은 최소 2글자 이상이어야 합니다.'
];

// 폼 제출
const submitForm = async () => {
  if (valid.value) {
    try {
      const response = await apiClient.post('/admin/register/department', {},{
        params: {
          departmentName: departmentName.value
        }
      });
      if (response.status === 200) {
        alert('부서 등록이 완료되었습니다.');
        await router.push('/');
      } else {
        alert(`부서 등록 실패: ${response.data.message}`);
      }
    } catch (error) {
      alert(`부서 등록 오류: ${error.message}`);
    }
  } else {
    alert('모든 필드를 올바르게 입력해주세요.');
  }
};
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-style {
  max-width: 600px;
}
</style>
