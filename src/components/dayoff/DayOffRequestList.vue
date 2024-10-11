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
          <th>조치</th> <!-- 조치 열 추가 -->
        </tr>
        </thead>
        <tbody>
        <tr v-for="request in dayOffRequests" :key="request.userId">
<!--          <td>{{ request.id }}</td>-->
          <td>{{ request.name }}</td>
          <td>{{ request.type }}</td>
          <td>{{ request.duration }} 일</td>
          <td>{{ request.startDate }}</td>
          <td>{{ request.endDate }}</td>
          <td>{{ request.status }}</td>
          <td class="td_actions">
            <button @click="approveRequest(request)">승인</button> <!-- 승인 버튼 -->
            <button @click="rejectRequest(request)">반려</button> <!-- 반려 버튼 -->
          </td>
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
const companyId = router.currentRoute.value.params.companyId || 1;
const dayOffRequests = ref([]);
const totalPages = ref(0);
const totalElements = ref(0);
const currentPage = ref(0);

const fetchDayOffRequests = async (page = 0) => {
  try {
    const response = await apiClient.get(`/dayoff/${companyId}/list`, { params: { page, size: 10 } });
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

// 휴가 신청 승인/반려 API 호출
const handleDayOffAction = async (request, reject) => {
  try {
    const response = await apiClient.patch(`/dayoff/${request.companyId}/${request.id}/action`, null, {
      params: { reject }
    });
    if (response.status === 200) {
      alert(reject ? '휴가 반려 처리되었습니다.' : '휴가 승인 처리되었습니다.');
      await fetchDayOffRequests(currentPage.value);  // 목록을 다시 불러와 업데이트
    } else {
      throw new Error(`Failed to process the request: ${response.status}`);
    }
  } catch (error) {
    console.error('Error processing the day off request:', error);
    alert(`처리 중 오류가 발생했습니다: ${error.message}`);
  }
};

// 승인 버튼
const approveRequest = (request) => {
  handleDayOffAction(request, false);
};

// 반려 버튼
const rejectRequest = (request) => {
  handleDayOffAction(request, true);
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

.the-title {
  padding: 20px;
  width: 93%;
  margin: 0 auto;
  text-align: center;
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
  width: 80%;
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
</style>
