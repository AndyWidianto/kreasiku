<template>
  <div>
    <h1>Infinite Scroll Demo</h1>

    <div v-for="item in items" :key="item.id" class="item">
      {{ item.title }}
    </div>

    <div ref="loadMore" v-if="hasMore">
      <p>Loading more...</p>
    </div>

    <div v-else>
      <p>No more data.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// ✅ Data dummy
const allData = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  title: `Item #${i + 1}`
}))

const items = ref([])      // data yang ditampilkan
const page = ref(1)
const limit = 10           // item per page
const hasMore = ref(true)
const loading = ref(false)
const loadMore = ref(null)

async function fetchData() {
  if (loading.value || !hasMore.value) return

  loading.value = true

  // Simulasi delay API
  await new Promise(resolve => setTimeout(resolve, 500))

  const start = (page.value - 1) * limit
  const end = start + limit
  const data = allData.slice(start, end)

  if (data.length < limit) {
    hasMore.value = false
  }

  items.value = [...items.value, ...data]
  page.value++
  loading.value = false
}

let observer = null

onMounted(() => {
  fetchData()

  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fetchData()
      }
    })
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 1.0,
  })

  if (loadMore.value) {
    observer.observe(loadMore.value)
  }
})

onUnmounted(() => {
  if (observer && loadMore.value) {
    observer.unobserve(loadMore.value)
  }
})
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 20px;
}

.item {
  padding: 16px;
  border-bottom: 1px solid #ddd;
}

p {
  text-align: center;
  padding: 16px;
}
</style>
