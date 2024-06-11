<template>
  <v-container>
    <!-- 메모장 스타일의 카드로 사용법 표시 -->
    <v-card class="notepad" outlined>
      <v-card-title>
        <span class="usage-title">사용법!</span>
      </v-card-title>
      <v-card-text>
        <div class="usage-section" v-for="(section, index) in usage" :key="index">
          <div class="text-subtitle-1">{{ section.title }}</div>
          <ul>
            <li v-for="(item, i) in section.items" :key="`item-${i}`">{{ item }}</li>
          </ul>
        </div>
      </v-card-text>
    </v-card>
    <v-card-actions class="link-section">
      <v-btn text :href="memoirLink" target="_blank">해당 프로젝트를 만들며 시행착오 스토리 링크...</v-btn>
    </v-card-actions>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const usage = ref([
  {
    title: '회사 대표 혹은 관리자',
    items: [
      '로그인 버튼 - 회사 등록',
      '회사 등록 후 연락 주세요! (01053612197)',
      '등록 후 부여 받은 어드민 아이디로 로그인'
    ]
  },
  {
    title: '일반 사원',
    items: [
      '로그인 버튼 - 회원가입',
      '회사 어드민에게 가입 승인요청 대기',
      '로그인'
    ]
  }
]);

const memoirLink = 'https://synclair.tistory.com/category/Spring/%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8';
</script>

<style scoped>
.notepad {
  background-color: #fffeec;
  border: 1px solid #d3d3d3;
  box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.2);
  font-family: 'Courier New', Courier, monospace;
}

.usage-title {
  font-size: 24px; /* 큰 글자 크기 */
  font-weight: bold; /* 굵은 글씨 */
  color: dimgray; /* 강조 색상 */
}

.usage-section {
  margin-bottom: 20px;
}

.link-section {
  margin-top: 20px;
  background-color: #e0f7fa; /* 배경색 추가 */
  color: red;
}
</style>
