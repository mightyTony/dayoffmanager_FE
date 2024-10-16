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

    <v-img
        src="https://d1d3d1g2pexoba.cloudfront.net/image/say.jpg"
        alt="github_link"
        class="my-5"
        @click="goToGitHub"
        style="cursor: pointer; max-width: 20%; height: auto;"
    ></v-img>

  </v-container>
</template>

<script setup>
import { ref } from 'vue';

const usage = ref([
  {
    title: '!!! 테스트 용 데이터',
    items: [
      '사업자등록번호: 6518100883',
      '회사 관리자',
      '아이디: admin, 비밀번호: password123',
      '일반 사원',
      '아이디: test123, 비밀번호: password123',
      '팀장',
      '아이디: leader, 비밀번호: password123'
    ]
  },
  {
    title: '회사 대표 혹은 관리자',
    items: [
      '로그인 버튼 - 회사 등록',
      '회사 등록 후 연락 주세요! (01053612197) - 마스터의 승인 필요(추후 sms로 승인예정)',
      '등록 후 부여 받은 어드민 아이디로 로그인'
    ]
  },
  {
    title: '일반 사원',
    items: [
      '로그인 버튼 - 회원가입',
      '회사 관리자 가입 승인이 되어야 로그인이 가능합니다.',
    ]
  },
  {
    title: '휴가 신청',
    items: [
      '휴가 신청 버튼 클릭',
      '휴가 종류 선택',
      '휴가 시작일, 종료일 선택',
      '신청',
      '기본 휴가는 15일이며 가입 월에 따라 계산 됩니다. 3년 이상 근속 후 2년마다 추가 휴가 됩니다.'
    ]
  },
]);

const memoirLink = 'https://synclair.tistory.com/category/Spring/%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8';
const githubLink = 'https://github.com/mightyTony'; // GitHub 링크로 변경하세요.

function goToGitHub() {
  window.open(githubLink, '_blank');
}
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
