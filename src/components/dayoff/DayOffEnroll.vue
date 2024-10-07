<template>
  <v-card class="mx-auto my-12 pa-16" elevation="12" max-width="600" rounded="lg">
    <div class="header-container">
      <div class="text-subtitle-1 text-medium-emphasis">휴가 신청</div>
      <div class="text-subtitle-1 text-medium-emphasis">남은 휴가 : {{ dayOffCount }} 일</div>
    </div>
    <br/>
    <v-form ref="form" v-model="valid" class="form-style">
      <!-- 휴가 유형 선택 -->
      <v-select
          v-model="dayOffType"
          :items="dayOffTypes"
          label="휴가 유형"
          :rules="dayOffTypeRules"
          required
          outlined
          dense
      ></v-select>
      <br>
      <!-- 휴가 기간 입력 -->
      <v-text-field
        v-model="duration"
        label="휴가 기간 (일수)"
        type="number"
        :step="0.5"
        :rules="durationRules"
        outlined
        dense
        required
    ></v-text-field>

      <br>
      <!-- 휴가 시작일 -->
      <div>
        <DatePicker
            v-model="startDate"
            :format="formatDate"
            locale="ko"
            :enable-time-picker="false"
            placeholder="휴가 시작 일"
        ></DatePicker>
      </div>

      <br><br>
      <!-- 휴가 종료일 -->
      <div>
        <DatePicker
            v-model="endDate"
            :format="formatDate"
            locale="ko"
            :enable-time-picker="false"
            placeholder="휴가 종료 일"
        ></DatePicker>
      </div>

      <br><br><br><br><br><br><br><br><br><br><br>
      <!-- 등록 버튼 -->
      <v-btn
          color="primary"
          large
          :disabled="!valid"
          @click="submitForm"
      >
        휴가 신청
      </v-btn>
    </v-form>
  </v-card>
</template>

<script setup>
import { ref, computed } from 'vue';
import apiClient from "../../config/axios.js";
import DatePicker from "@vuepic/vue-datepicker";
import { useUserStore } from "../../store/userStore.js";

const userStore = useUserStore();
const { dayOffCount,role } = userStore.userData;
const valid = ref(false);
const dayOffType = ref('');
const duration = ref('');
const startDate = ref('');
const endDate = ref('');

// 휴가 유형 데이터, 문자열 키워드로 설정
const dayOffTypes = [
  'NORMAL', 'AM_HALF', 'PM_HALF', 'EARLY', 'SICK', 'REWARD', 'AM_QUARTER', 'PM_QUARTER', 'ETC'
];

// 규칙
const dayOffTypeRules = [v => !!v || '휴가 유형을 선택해야 합니다.'];
const durationRules = [
  v => !!v || '휴가 기간을 입력해 주세요',
  v => parseFloat(v) > 0 || '휴가 기간은 0일보다 많아야 합니다.',
  v => /^\d+(\.\d+)?$/.test(v) || '휴가 기간은 숫자여야 합니다.'
];


const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  let month = `${d.getMonth() + 1}`; // 월은 0부터 시작하므로 1을 추가합니다.
  let day = `${d.getDate()}`;
  const year = d.getFullYear();

  // 한 자리 수 월과 일에 '0'을 추가합니다.
  month = month.length < 2 ? '0' + month : month;
  day = day.length < 2 ? '0' + day : day;

  return `${year}-${month}-${day}`; // ISO 형식인 YYYY-mm-DD 로 변환
  //return date.toISOString().substring(0,10); Timezone 이슈
}

// 폼 제출
const submitForm = async () => {
  console.log(role)
  if (valid.value) {
    const payload = {
      dayOffType: dayOffType.value,
      duration: parseFloat(duration.value),
      startDate: startDate.value,
      endDate: endDate.value,
      role: role
    };
    try {
      const response = await apiClient.post('/dayoff/register', payload);
      if (response.status === 200 || response.status === 201) {
        alert('휴가 신청이 완료되었습니다.');
      } else {
        alert('휴가 신청에 실패했습니다.');
      }
    } catch (error) {
      alert(`휴가 신청 오류: ${error.message}`);
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
