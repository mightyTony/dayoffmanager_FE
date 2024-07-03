<template>
  <v-card class="mx-auto my-12 pa-16" elevation="12" max-width="600" rounded="lg">
    <div class="header-container">
      <div class="text-subtitle-1 text-medium-emphasis">사업자 정보 등록</div>
      <v-btn @click="openSearchDialog">사업자 조회</v-btn>
    </div>
    <br/>
    <v-form ref="form" v-model="valid" class="form-style">
      <!-- 사업자등록번호 입력 필드 -->
      <v-text-field
          v-model="businessNumber"
          label="사업자등록번호"
          :rules="businessNumberRules"
          outlined
          dense
          required
          readonly
      ></v-text-field>

      <!-- 개업일자 입력 필드 -->
      <v-text-field
          v-model="startDate"
          label="개업일자"
          :rules="startDateRules"
          outlined
          dense
          required
          readonly
      ></v-text-field>

      <!-- 대표자 성명 입력 필드 -->
      <v-text-field
          v-model="representativeName"
          label="대표자 성명"
          :rules="representativeNameRules"
          outlined
          dense
          required
          readonly
      ></v-text-field>

      <!-- 상호명 입력 필드 -->
      <v-text-field
          v-model="brandName"
          label="상호명"
          :rules="brandNameRules"
          outlined
          dense
          required
          readonly
      ></v-text-field>

      <!-- 등록 버튼 -->
      <v-btn
          color="primary"
          large
          :disabled="!valid"
          @click="submitForm"
      >
        등록
      </v-btn>

      <!-- 사업자 정보 검색 Dialog -->
      <v-dialog v-model="searchDialog" persistent max-width="600px">
        <company-check @update-data="handleDataUpdate" @close-modal="searchDialog = false" />
      </v-dialog>
    </v-form>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import CompanyCheck from "./CompanyCheck.vue";
import {useRouter} from "vue-router";
import apiClient from "../config/axios.js";

const businessNumber = ref('');
const startDate = ref('');
const representativeName = ref('');
const brandName = ref('');
const valid = ref(false);
const searchDialog = ref(false);
const router = useRouter();
// 사업자등록번호 검증 규칙
const businessNumberRules = [
  v => !!v || '사업자등록번호는 필수입니다.',
  v => v.length === 10 || '사업자등록번호는 10자리여야 합니다.'
];

// 개업일자 검증 규칙
const startDateRules = [
  v => !!v || '개업일자는 필수입니다.',
  v => /^\d{4}(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01])$/.test(v) || '개업일자는 YYYYMMDD 포맷이어야 합니다.'
];

// 대표자 성명 검증 규칙
const representativeNameRules = [
  v => !!v || '대표자 성명은 필수입니다.'
];

// 상호명 검증 규칙
const brandNameRules = [
  v => !!v || '상호명은 필수입니다.'
];

// 폼 제출 처리
const submitForm = async () => {
  if (valid.value) {
    try {
      // API 호출 또는 추가 로직
      const response = await apiClient.post('/companies/join', {
        b_no : businessNumber.value,
        start_dt : startDate.value,
        p_nm : representativeName.value,
        b_nm : brandName.value,
      });

      if(response.status === 200 || response.status === 201) {
        alert('등록 완료');
        await router.push('/');
      } else {
        alert(`등록 실패 : ${response.data.data.message}`);
      }
    } catch (error) {
      if(error.response) {
        alert(`회사 등록 실패: ${error.response.data.message}`);
      } else {
        alert(`회사 등록 실패 : ${error.message}`);
      }
    }
  } else {
    alert('입력값을 확인하세요.');
  }
};

function openSearchDialog() {
  searchDialog.value = true;
}

function handleDataUpdate(data) {
  // 받은 데이터를 필드에 설정
  const request_param = data.request_param;

  businessNumber.value = request_param.b_no;
  startDate.value = request_param.start_dt;
  representativeName.value = request_param.p_nm;
  brandName.value = request_param.b_nm;
}
</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between; /* 타이틀과 버튼을 좌우 끝으로 정렬 */
  align-items: center; /* 세로 중앙 정렬 */
}

.form-style {
  max-width: 600px;
}
</style>
