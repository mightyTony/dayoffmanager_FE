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
          v-model="companyName"
          label="상호명"
          :rules="companyNameRules"
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
import { useRouter } from "vue-router";
import apiClient from "../config/axios.js";

const businessNumber = ref('');
const startDate = ref('');
const representativeName = ref('');
const companyName = ref('');
const valid = ref(false);
const searchDialog = ref(false);
const router = useRouter();

// 날짜 형식 변환 함수
const convertDateFormat = (dateString) => {
  if (!dateString || dateString.length !== 8) return '';
  const year = dateString.slice(0, 4);
  const month = dateString.slice(4, 6);
  const day = dateString.slice(6, 8);
  return `${year}-${month}-${day}`;
}

// 사업자등록번호 검증 규칙
const businessNumberRules = [
  v => !!v || '사업자등록번호는 필수입니다.',
  v => v.length === 10 || '사업자등록번호는 10자리여야 합니다.'
];

// 개업일자 검증 규칙
const startDateRules = [
  v => !!v || '개업일자는 필수입니다.',
  v => /^\d{4}-\d{2}-\d{2}$/.test(v) || '개업일자는 YYYY-MM-DD 포맷이어야 합니다.'
];

// 대표자 성명 검증 규칙
const representativeNameRules = [
  v => !!v || '대표자 성명은 필수입니다.'
];

// 상호명 검증 규칙
const companyNameRules = [
  v => !!v || '상호명은 필수입니다.'
];

// 폼 제출 처리
const submitForm = async () => {
  if (valid.value) {
    try {
      const response = await apiClient.post('/companies/join', {
        b_no: businessNumber.value,
        start_dt: startDate.value,
        p_nm: representativeName.value,
        b_nm: companyName.value,
      });
      if (response.status === 200 || response.status === 201) {
        alert('등록 완료');
        await router.push('/');
      } else {
        alert(`등록 실패 : ${response.data.message}`);
      }
    } catch (error) {
      alert(`회사 등록 실패: ${error.response ? error.response.data.message : error.message}`);
    }
  } else {
    alert('입력값을 확인하세요.');
  }
};

function openSearchDialog() {
  searchDialog.value = true;
}

function handleDataUpdate(data) {
  const request_param = data.request_param;
  businessNumber.value = request_param.b_no;
  startDate.value = convertDateFormat(request_param.start_dt); // 날짜 형식 변환 적용
  representativeName.value = request_param.p_nm;
  companyName.value = request_param.b_nm;
}
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
