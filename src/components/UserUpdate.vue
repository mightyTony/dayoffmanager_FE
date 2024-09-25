<template>
  <v-card class="mx-auto pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
<!--    <div class="caption mb-2 bold font-weight-bold">정보 수정</div>-->
<!--    <br>-->
    <v-form ref="form" v-model="valid">
      <div class="caption mb-2">프로필</div>
      <div class="text-center mb-5">
        <div v-if="previewUrl" class="image-preview mb-2">
          <img :src="previewUrl" alt="Profile Image">
        </div>
        <input type="file" @change="onFileSelected" hidden ref="fileInput">
        <v-btn small color="primary" @click="triggerFileInput">새 이미지 불러오기</v-btn>
        <v-btn small color="secondary" @click="uploadImage" :disabled="!file">변경</v-btn>
      </div>


      <div class="caption mb-2">아이디</div>
      <v-text-field
          v-model="userId"
          dense
          prepend-inner-icon="mdi-account-outline"
          variant="outlined"
          :rules="userIdRules"
          readonly
      ></v-text-field>
<!--      <div class="caption mb-2">비밀번호</div>-->
<!--      <v-text-field-->
<!--          v-model="password"-->
<!--          :type="visible ? 'text' : 'password'"-->
<!--          dense-->
<!--          placeholder="새 비밀번호 (변경시 입력)"-->
<!--          prepend-inner-icon="mdi-lock-outline"-->
<!--          variant="outlined"-->
<!--          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"-->
<!--          @click:append-inner="toggleVisibility"-->
<!--          :rules="passwordRules"-->
<!--      ></v-text-field>-->
      <div class="caption mb-2">이름</div>
      <v-text-field
          v-model="name"
          dense
          placeholder="이름"
          prepend-inner-icon="mdi-account"
          variant="outlined"
          :rules="nameRules"
      ></v-text-field>
      <div class="caption mb-2">이메일</div>
      <v-text-field
          v-model="email"
          dense
          placeholder="이메일"
          prepend-inner-icon="mdi-email"
          variant="outlined"
          :rules="emailRules"
      ></v-text-field>
      <div class="caption mb-2">전화번호</div>
      <v-text-field
          v-model="phoneNumber"
          dense
          prepend-inner-icon="mdi-phone"
          variant="outlined"
          :rules="phoneNumberRules"
      ></v-text-field>
      <div class="caption mb-2">회사명</div>
      <v-text-field
          v-model="companyName"
          dense
          prepend-inner-icon="mdi-domain"
          variant="outlined"
          :rules="companyNameRules"
          readonly
      ></v-text-field>
      <div class="caption mb-2">입사날짜</div>
      <v-text-field
          v-model="hireDate"
          dense
          :format="formatDate"
          prepend-inner-icon="mdi-calendar-account"
          variant="outlined"
          readonly>
      </v-text-field>
<!--      <div>-->
<!--        <DatePicker v-model="hireDate" -->
<!--                    :format="formatDate" -->
<!--                    locale="ko" -->
<!--                    :enable-time-picker="false" -->
<!--                    :disabled/>-->
<!--      </div>-->

      <v-btn
          class="mb-8"
          color="blue"
          size="large"
          variant="tonal"
          block
          @click="handleUpdate"
          :disabled="!valid"
      >정보 수정</v-btn>
    </v-form>
  </v-card>
</template>

<script setup>
import {ref, toRef, watch} from 'vue';
import apiClient from "../config/axios.js";
import DatePicker from '@vuepic/vue-datepicker';
import { useUserStore } from '../store/userStore';

const userStore = useUserStore();
const { userId, name, email, phoneNumber, companyName, hireDate, profileImage } = userStore.userData;
const password = ref('');
const visible = ref(false);
const valid = ref(false);
const form = ref(null);
const fileInput = ref(null);
const file = ref(null); // 파일 데이터 저장용

//const cloudfrontUrl = "https://d1d3d1g2pexoba.cloudfront.net"; // 클라우드프론트 URL
const initialProfileImage = profileImage ? profileImage : 'https://randomuser.me/api/portraits/lego/7.jpg';
const previewUrl = ref(initialProfileImage); // 미리보기 URL

// 파일 선택 핸들러
const onFileSelected = event => {
  const files = event.target.files;
  if (files.length === 0) return;
  file.value = files[0];
  previewUrl.value = URL.createObjectURL(file.value);
};

// 파일 인풋 트리거
const triggerFileInput = () => {
  fileInput.value.click();
};

// 이미지 업로드
const uploadImage = async () => {
  if (!file.value) return;

  const formData = new FormData();
  formData.append('file', file.value);
  try {
    const response = await apiClient.post(`auth/info/${userId}/profileImage`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (response.status === 200) {
      alert('프로필 사진 업데이트 성공!');
      // 서버에서 반환된 URL을 사용하여 추가 조치를 취할 수 있습니다.
      console.log(response.data);
      previewUrl.value = response.data.data; // 새로운 이미지로 미리보기 갱신
      await userStore.updateProfileImage(previewUrl.value);

    }
  } catch (error) {
    alert('프로필 사진 업데이트 실패: ' + error.message);
  }
};

// 날짜 형식 함수
const formatDate = (date) => {
  return date.toISOString().substring(0,10);
}

const userIdRules = [
  v => !!v || '아이디를 입력해 주세요',
];
const passwordRules = [
  v => !v || v.length >= 4 || '비밀번호는 4글자 이상이어야 합니다.',
  v => !v || v.length <= 30 || '비밀번호는 30글자 이하이어야 합니다.',
];
const emailRules = [
  v => !!v || '이메일을 입력해 주세요',
  v => /.+@.+\..+/.test(v) || '유효한 이메일을 입력해 주세요',
];
const phoneNumberRules = [
  v => !!v || '전화번호를 입력해 주세요',
  v => /^010[0-9]{8}$/.test(v) || '010으로 시작해서 총 11자 이어야 합니다.',
];
const nameRules = [
  v => !!v || '이름을 입력해 주세요',
];
const companyNameRules = [
  v => !!v || '회사명을 입력해 주세요',
];

const toggleVisibility = () => {
  visible.value = !visible.value;
};

const handleUpdate = async () => {
  if (!form.value.validate()) {
    return;
  }

  try {
    const response = await apiClient.patch(`/auth/info/${userId}`, {
      name: name,
      email: email,
      phone_number: phoneNumber,
      profile_image: profileImage,
    });

    if (response.status === 200) {
      alert('정보 수정 성공');
    } else {
      throw new Error('정보 수정 실패');
    }
  } catch (error) {
    alert('정보 수정 요청 실패: ' + error.message);
  }
};
</script>

<style scoped>
@import '@vuepic/vue-datepicker/dist/main.css';
.image-preview img {
  width: 100px; /* 너비를 컨테이너에 맞춤 */
  height: 140px; /* 높이 설정 */
  object-fit: cover; /* 내용을 자르지 않고 비율을 유지하면서 요소의 전체 내용을 채움 */
}
</style>
