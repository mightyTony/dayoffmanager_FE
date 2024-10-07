<template>
  <div>
    <div class="the-title">
      <h1>등록된 유저 목록</h1>
      <p>이 페이지에서는 승인된 유저 목록을 확인할 수 있습니다.</p>
    </div>
    <div class="table-container">
      <h2>승인된 유저 목록</h2>
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
        <tr v-for="user in displayRows" :key="user.userId">
          <td>{{ user.name || '-' }}</td>
          <td>{{ user.hireDate || '-' }}</td>
          <td>{{ user.role || '-' }}</td>
          <td class="td_btn">
            <button @click="handleOpen(user)">상세 보기</button>
          </td>
        </tr>
        </tbody>
      </table>
      <nav class="pagination">
        <button @click="fetchUsers(currentPage - 1)" :disabled="currentPage <= 0">Prev</button>
        <button v-for="page in paginationRange" :key="page" @click="fetchUsers(page - 1)" :class="{ active: page === currentPage + 1 }">
          {{ page }}
        </button>
        <button @click="fetchUsers(currentPage + 1)" :disabled="currentPage + 1 >= users.totalPages">Next</button>
      </nav>

      <!-- 사용자 정보 수정 모달 -->
      <AdminMemberDetailView v-if="listStore.modalVisible" :member="listStore.selectedMember" @close="listStore.closeModal()"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import apiClient from "../../config/axios.js";
import { useListStore } from "../../store/listStore.js";
import AdminMemberDetailView from "./AdminMemberDetailView.vue";
import {useUserStore} from "../../store/userStore.js";

const userStore = useUserStore();
const listStore = useListStore();
const users = ref({ content: [], totalPages: 0, totalElements: 0, pageNumber: 0 });
const currentPage = ref(0);

const fetchUsers = async (page = 0) => {
  try {
    const response = await apiClient.get(`/admin/members`, { params: { page, size: 10 } });
    users.value = response.data.data;
    currentPage.value = page;
  } catch (error) {
    console.error('Failed to fetch users:', error);
  }
};

const displayRows = computed(() => {
  return users.value.content.length ? users.value.content : Array.from({ length: 10 }, () => ({}));
});

const paginationRange = computed(() => {
  const start = Math.max(1, currentPage.value + 1 - 5);
  const end = Math.min(start + 9, users.value.totalPages);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const handleOpen = (user) => {
  // 로직 추가: 유저 상세 정보를 표시하는 모달 또는 페이지로 이동
  //listStore.fetchUserDetail(userId);
  listStore.selectMember(user);
  //listStore.modalVisible = true;
};

onMounted(() => {
  fetchUsers();``
  //listStore.fetchDepartments(companyId);
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
