<template>
  <v-card class="mx-auto my-12 pa-16" elevation="12" max-width="600" rounded="lg">
    <div class="text-subtitle-1 text-medium-emphasis">사업자 정보 검색</div>
    <br/>
    <v-form ref="form" v-model="valid" class="form-style">

      <v-text-field
          v-model="businessNumber"
          placeholder="사업자 등록번호"
          prepend-inner-icon="mdi-domain"
          variant="outlined"
          :rules="businessNumberRules"
          class="input-field"
      ></v-text-field>

      <DatePicker
          v-model="startDate"
          :format="formatStartDate"
          placeholder="개업일자"
          class="date-picker input-field"
          :input-props="{ dense: false, outlined: true, prependInnerIcon: 'mdi-calendar', useUtc: false }"
          locale="ko"
          :enable-time-picker="false"
          :menu-props="{ maxWidth: '100%' }"
      />

      <v-text-field
          v-model="representativeName"
          placeholder="대표자 성명"
          prepend-inner-icon="mdi-account"
          variant="outlined"
          :rules="nameRules"
          class="input-field"
      ></v-text-field>

      <v-text-field
          v-model="companyName"
          placeholder="회사 이름"
          prepend-inner-icon="mdi-briefcase"
          variant="outlined"
          :rules="companyNameRules"
          class="input-field"
      ></v-text-field>

      <v-btn
          class="mb-8"
          color="blue"
          size="large"
          variant="tonal"
          block
          @click="searchCompany"
          :disabled="!valid"
      >사업자 정보 검색</v-btn>
    </v-form>
  </v-card>
</template>

<script setup>
import { ref } from 'vue';
import apiClient from "../config/axios.js";
import DatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const businessNumber = ref('');
const startDate = ref('');
const representativeName = ref('');
const companyName = ref('');
const valid = ref(false);
const form = ref(null);

const formatStartDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  let month = `${d.getMonth() + 1}`; // 월은 0부터 시작하므로 1을 추가합니다.
  let day = `${d.getDate()}`;
  const year = d.getFullYear();

  // 한 자리 수 월과 일에 '0'을 추가합니다.
  month = month.length < 2 ? '0' + month : month;
  day = day.length < 2 ? '0' + day : day;

  return `${year}${month}${day}`; // ISO 형식인 YYYYmmDD로 반환
}


const businessNumberRules = [
  v => !!v || '사업자 등록번호를 입력해 주세요',
  v => v.length === 10 || '사업자등록번호는 10자리여야 합니다.'
];

const nameRules = [
  v => !!v || '대표자 성명을 입력해 주세요'
];

const companyNameRules = [
  v => !!v || '회사 이름을 입력해 주세요'
];

const searchCompany = async () => {
  if (!form.value.validate()) {
    return;
  }

  try {
    const response = await apiClient.post('/companies/search-companies', {
      b_no: businessNumber.value,
      start_dt: startDate.value,
      p_nm: representativeName.value,
      b_nm: companyName.value,
    });

    if (response.status === 200) {
      alert('사업자 정보 검색 성공');
    } else {
      throw new Error(`Error: ${response.status} - ${response.data.message}`);
    }
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      alert(`사업자 정보 검색 실패: ${error.response.data.message}`);
    } else {
      alert(`사업자 정보 검색 실패: ${error.message}`);
    }
  }
};
</script>

<style scoped>
.form-style {
  max-height: 800px; /* 폼의 최대 높이 설정 */
}

.input-field {
  margin-bottom: 24px; /* 입력 필드 간의 마진을 늘림 */
  height: 56px; /* 입력 필드의 높이를 조정 */
}
.date-picker-menu .v-menu__content {
  max-height: 300px;
}
</style>
