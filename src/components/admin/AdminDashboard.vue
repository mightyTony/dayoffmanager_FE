<template>
  <div>
    <div class="the-title">
      <h1>관리자 대시보드</h1>
      <p>관리자 페이지입니다. 등록 신청한 유저 목록을 확인할 수 있습니다.</p>
    </div>
    <div class="table-container">
      <h2>등록 신청한 유저 목록</h2>
      <table>
        <thead>
        <tr>
          <th>이름</th>
          <th>신청 날짜</th>
          <th>승인/거절</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="member in displayRows" :key="member.userId || member">
          <td>{{ member.name || '-' }}</td>
          <td>{{ member.hireDate || '-' }}</td>
          <td v-if="member.userId" class="td_btn">
            <button @click="approveMember(member.userId)">승인</button>
            <button @click="rejectMember(member.userId)">거절</button>
          </td>
          <td v-else class="td_btn">—</td>
        </tr>
        </tbody>
      </table>
      <nav class="pagination">
        <button @click="fetchMembers(currentPage - 1)" :disabled="currentPage <= 0">Prev</button>
        <button v-for="page in paginationRange" :key="page" @click="fetchMembers(page - 1)" :class="{ active: page === currentPage + 1 }">
          {{ page }}
        </button>
        <button @click="fetchMembers(currentPage + 1)" :disabled="currentPage + 1 >= members.totalPages">Next</button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import apiClient from "../../config/axios.js";

const members = ref({
  content: [],
  totalPages: 0,
  totalElements: 0,
  pageNumber: 0
});
const currentPage = ref(0);

const fetchMembers = async (page = 0) => {
  try {
    const response = await apiClient.get(`/admin/members/pending`, {
      params: { page, size: 10 }
    });
    members.value = response.data.data;
    currentPage.value = page;
  } catch (error) {
    console.error('Failed to fetch members:', error);
  }
};

const displayRows = computed(() => {
  const rows = [...members.value.content];
  for (let i = rows.length; i < 10; i++) {
    rows.push({});
  }
  return rows;
});

const paginationRange = computed(() => {
  const start = Math.max(1, currentPage.value + 1 - 5);
  const end = Math.min(start + 9, members.value.totalPages);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const approveMember = (userId) => {
  console.log("Approve member with ID:", userId);

};

const rejectMember = async(userId) => {
  console.log("Reject member with ID:", userId);
  try{
    const response = await apiClient.delete(`/admin/reject/${userId}`);

    if(response.status === 200){
      window.location.reload();
    }
    // console.log(status, success);
  }catch(e){
    console.log(e);
  }
};

onMounted(() => {
  fetchMembers();
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

/* existing styles */
.pagination button.active {
  color: red; /* Active page number highlighted */
}
</style>
