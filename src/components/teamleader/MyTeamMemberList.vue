<template>
  <div>
    <div class="the-title">
      <h1>팀원 목록</h1>
      <p>이 페이지에서는 나의 팀원들의 목록을 확인할 수 있습니다.</p>
    </div>
    <div class="table-container">
      <h2>등록된 팀원 목록</h2>
      <table>
        <thead>
        <tr>
          <th>이름</th>
          <th>등록 날짜</th>
          <th>역할</th>
          <th>상세 보기</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="member in displayRows" :key="member.userId">
          <td>{{ member.name || '-' }}</td>
          <td>{{ member.hireDate || '-' }}</td>
          <td>{{ member.role || '-' }}</td>
          <td class="td_btn">
            <button @click="handleOpen(member)">상세 보기</button>
          </td>
        </tr>
        </tbody>
      </table>
      <nav class="pagination">
        <button @click="fetchTeamMembers(currentPage - 1)" :disabled="currentPage <= 0">Prev</button>
        <button v-for="page in paginationRange" :key="page" @click="fetchTeamMembers(page - 1)" :class="{ active: page === currentPage + 1 }">
          {{ page }}
        </button>
        <button @click="fetchTeamMembers(currentPage + 1)" :disabled="currentPage + 1 >= teamMembers.totalPages">Next</button>
      </nav>

      <!-- 사용자 정보 수정 모달 -->
      <TeamDetailView v-if="listStore.modalVisible" :member="listStore.selectedMember" @close="listStore.closeModal()"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import apiClient from "../../config/axios.js";
import { useRouter } from 'vue-router';
import { useUserStore } from '../../store/userStore';
import {useListStore} from "../../store/listStore.js";
import TeamDetailView from "./TeamDetailView.vue";

const router = useRouter();
const userStore = useUserStore();
const listStore = useListStore();
const { companyId, departmentId } = userStore.userData; // 팀장의 팀 ID
const teamMembers = ref({ content: [], totalPages: 0, totalElements: 0, pageNumber: 0 });
const currentPage = ref(0);

const fetchTeamMembers = async (page = 0) => {
  try {
    const response = await apiClient.get(`/teamleader/company/${companyId}/departments/${departmentId}/members`, { params: { page, size: 10 } });
    teamMembers.value = response.data.data;
    currentPage.value = page;
  } catch (error) {
    console.error('Failed to fetch team members:', error);
  }
};

const displayRows = computed(() => {
  return teamMembers.value.content.length ? teamMembers.value.content : Array.from({ length: 10 }, () => ({}));
});

const paginationRange = computed(() => {
  const start = Math.max(1, currentPage.value + 1 - 5);
  const end = Math.min(start + 9, teamMembers.value.totalPages);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const handleOpen = (member) => {
  // 팀원 상세 정보 모달을 열거나 상세 페이지로 이동
  listStore.selectMember(member);
};

onMounted(() => {
  fetchTeamMembers();
});
</script>


<style scoped>
table {
  width: 100%;
  margin: 20px auto;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #cccccc;
  padding: 8px;
  text-align: center;
  background-color: white;
  color: black;
  border-block-color: black;
}

thead {
  background-color: #f4f4f4;
}

div.table-container {
  background-color: lightsteelblue;
  padding: 20px;
  width: 50%;
  margin: 0 auto;
}

.pagination {
  text-align: center;
  margin-top: 10px;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  background-color: #f4f4f4;
  color: black;
  border-color: black;
}

button {
  padding: 5px 10px;
  border: 1px solid #ccc;
}

.the-title {
  padding: 20px;
  width: 93%;
  margin: 0 auto;
  text-align: center;
}

.td_btn {
  width: 20%;
}

.td_btn button {
  margin: 0 5px;
  padding: 5px 10px;
  background-color: #f4f4f4;
  color: black;
  border-color: black;
}

.pagination button.active {
  color: red;
}
</style>
