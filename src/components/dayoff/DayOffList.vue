<template>
  <div>
    <div class="the-title">
      <h1>휴가 신청 목록</h1>
      <p>모든 휴가 신청을 조회할 수 있습니다.</p>
    </div>
    <div class="table-container">
      <h2>휴가 신청 현황</h2>
      <table>
        <thead>
        <tr>
          <th>이름</th>
          <th>휴가 유형</th>
          <th>휴가 기간</th>
          <th>시작일</th>
          <th>종료일</th>
          <th>상태</th>
<!--          <th>조치</th>-->
        </tr>
        </thead>
        <tbody>
        <tr v-for="request in dayOffRequests" :key="request.userId">
          <td>{{ request.name }}</td>
          <td>{{ request.type }}</td>
          <td>{{ request.duration }} 일</td>
          <td>{{ request.startDate }}</td>
          <td>{{ request.endDate }}</td>
          <td>{{ request.status }}</td>
<!--          <td class="td_actions">-->
<!--            <button @click="approveRequest(request)">승인</button>-->
<!--            <button @click="rejectRequest(request)">반려</button>-->
<!--          </td>-->
        </tr>
        </tbody>
      </table>
      <nav class="pagination">
        <button @click="fetchDayOffRequests(currentPage - 1)" :disabled="currentPage <= 0">Prev</button>
        <button v-for="page in paginationRange" :key="page" @click="fetchDayOffRequests(page - 1)" :class="{ active: page === currentPage + 1 }">
          {{ page }}
        </button>
        <button @click="fetchDayOffRequests(currentPage + 1)" :disabled="currentPage + 1 >= totalPages">Next</button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import apiClient from "../../config/axios.js";
import { useRouter } from 'vue-router';

const router = useRouter();
const companyId = router.currentRoute.value.params.companyId || 1; // or get from userStore if global access is needed
const dayOffRequests = ref([]);
const totalPages = ref(0);
const totalElements = ref(0);
const currentPage = ref(0);

const fetchDayOffRequests = async (page = 0) => {
  try {
    const response = await apiClient.get(`/dayoff/company/${companyId}/history`, { params: { page, size: 10 } });
    if (response.data && response.data.data) {
      dayOffRequests.value = response.data.data.content;
      totalPages.value = response.data.data.totalPages;
      totalElements.value = response.data.data.totalElements;
      currentPage.value = page;
    }
  } catch (error) {
    console.error('Failed to fetch day off requests:', error);
    alert('Failed to load data: ' + error.message);
  }
};

const paginationRange = computed(() => {
  const start = Math.max(1, currentPage.value + 1 - 5);
  const end = Math.min(start + 9, totalPages.value);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const approveRequest = (request) => {
  console.log('Approving:', request);
  // TODO: Add API call for approval
};

const rejectRequest = (request) => {
  console.log('Rejecting:', request);
  // TODO: Add API call for rejection
};

onMounted(() => {
  fetchDayOffRequests();
});
</script>

<style scoped>
table {
  width: 100%;
  margin: 20px auto;
  border-collapse: collapse;
}

thead {
  background-color: #f4f4f4;
}

th, td {
  border: 1px solid #cccccc;
  padding: 8px;
  text-align: center;
  background-color: white;
  color: black;
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

.td_actions button {
  margin: 0 5px;
  padding: 5px 10px;
  background-color: #f4f4f4;
  color: black;
  border-color: black;
}

.pagination button.active {
  color: red;
}

.the-title {
  padding: 20px;
  width: 93%;
  margin: 0 auto;
  text-align: center;
}

div.table-container {
  background-color: lightsteelblue;
  padding: 20px;
  width: 80%;
  margin: 0 auto;
}
</style>
