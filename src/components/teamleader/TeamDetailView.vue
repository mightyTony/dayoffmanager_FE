<template>
  <v-dialog v-model="modalVisible" persistent max-width="600px">
    <v-card>
      <v-card-title class="text-h5">{{ member.name }}의 상세 정보</v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <div class="caption mb-2">프로필</div>
          <div class="text-center mb-5">
            <div class="image-preview mb-2">
              <img :src="member.profileImage || 'https://randomuser.me/api/portraits/lego/7.jpg'" alt="Profile Image">
            </div>
            <input type="file" @change="onFileSelected" hidden ref="fileInput">
          </div>
          <v-text-field
              label="이름"
              v-model="member.name"
              :rules="nameRules"
              outlined
              readonly
          ></v-text-field>
          <v-text-field
              label="이메일"
              v-model="member.email"
              :rules="emailRules"
              outlined
              readonly
          ></v-text-field>
          <v-text-field
              label="전화번호"
              v-model="member.phoneNumber"
              :rules="phoneNumberRules"
              outlined
              readonly
          ></v-text-field>
          <v-text-field
              label="사번"
              v-model="member.employeeNumber"
              :rules="employeeNumberRules"
              outlined
              readonly
          ></v-text-field>
          <v-select
              label="부서명"
              :items="departments"
              v-model="member.departmentName"
              item-text="name"
              item-value="id"
              outlined
              readonly
          ></v-select>
          <v-select
              label="역할"
              :items="roles"
              v-model="member.role"
              item-text="name"
              item-value="id"
              outlined
              readonly
          ></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
<!--        <v-btn color="green darken-1" text @click="submitChanges">수정</v-btn>-->
        <v-btn color="red darken-1" text @click="closeModal">닫기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue';
import { useListStore } from "../../store/listStore.js";
import apiClient from "../../config/axios.js";

const props = defineProps({
  member: Object
});

const emit = defineEmits(['close']);
const departments = computed(() => listStore.departments);
const listStore = useListStore();
const modalVisible = computed({
  get: () => listStore.modalVisible,
  set: value => listStore.setModalVisible(value)
});
const valid = ref(true);

const roles = ref(['EMPLOYEE', 'TEAM_LEADER', 'ADMIN']); // 이 역시 API 데이터 로드 필요

const nameRules = [v => !!v || '이름을 입력해 주세요'];
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

// // 데이터를 서버로 전송
// const submitChanges = async () => {
//   if (!valid.value) {
//     alert("모든 필드를 올바르게 입력해 주세요.");
//     return;
//   }
//
//   const payload = {
//     name: props.member.name,
//     email: props.member.email,
//     phoneNumber: props.member.phoneNumber,
//     profileImage: props.member.profileImage, // 프로필 이미지 처리 필요
//     departmentName: props.member.departmentName,
//     employeeNumber: props.member.employeeNumber,
//     role: props.member.role,
//     dayOffCount: props.member.dayOffCount // 만약 dayOffCount가 필요하다면
//   };
//
//   try {
//     const response = await apiClient.patch(`/admin/${props.member.companyId}/${props.member.userId}`, payload);
//     if (response.status === 200) {
//       listStore.updateMember(response.data.data);
//       console.log("response.data.data", response.data.data);
//       alert(`${props.member.name}의 멤버 정보가 성공적으로 수정되었습니다.`);
//       closeModal();
//     } else {
//       console.log("response.data.code", response.data.code);
//       alert('멤버 정보 수정에 실패했습니다.1');
//     }
//   } catch (error) {
//     console.error('멤버 정보 수정 중 오류가 발생했습니다:', error);
//     alert('멤버 정보 수정에 실패했습니다.2');
//   }
// };

const closeModal = () => {
  modalVisible.value = false;
  emit('close');
};
</script>
