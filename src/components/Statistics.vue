<template>
  <section class="section">
    <h2>Statistik Tugas</h2>
    
    <div class="stats-container">
      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <h3>Total Tugas</h3>
        <p class="stat-number">{{ stats.total }}</p>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <h3>Tugas Selesai</h3>
        <p class="stat-number">{{ stats.completed }}</p>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">⏳</div>
        <h3>Tugas Tertunda</h3>
        <p class="stat-number">{{ stats.pending }}</p>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">📈</div>
        <h3>Persentase Selesai</h3>
        <p class="stat-number">{{ stats.completionRate }}%</p>
      </div>
    </div>

    <div class="chart-container">
      <h3>Distribusi Tugas per Kategori</h3>
      
      <div v-if="categoryData.length === 0" class="no-data">
        <p>📊 Tidak ada data untuk ditampilkan</p>
        <p class="subtext">Tambahkan tugas dan kategori untuk melihat statistik</p>
      </div>
      
      <div v-else class="category-chart">
        <div 
          v-for="item in categoryData" 
          :key="item.category.id"
          class="chart-bar"
        >
          <div class="chart-label">
            <span 
              class="category-color-dot"
              :style="{ backgroundColor: item.category.color }"
            ></span>
            {{ item.category.name }}
          </div>
          <div class="chart-bar-outer">
            <div 
              class="chart-bar-inner"
              :style="{
                width: `${item.percentage}%`,
                backgroundColor: item.category.color
              }"
            ></div>
          </div>
          <div class="chart-value">
            {{ item.count }} ({{ item.percentage }}%)
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Statistics',
  props: {
    tasks: {
      type: Array,
      required: true
    },
    categories: {
      type: Array,
      required: true
    }
  },
  computed: {
    stats() {
      const total = this.tasks.length
      const completed = this.tasks.filter(task => task.status === 'completed').length
      const pending = total - completed
      const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0
      
      return { total, completed, pending, completionRate }
    },
    
    categoryData() {
      if (this.tasks.length === 0) return []
      
      const categoryCounts = {}
      
      // Hitung tugas per kategori
      this.tasks.forEach(task => {
        const category = this.categories.find(c => c.id === task.categoryId) || 
                        { id: 'uncategorized', name: 'Tidak Berkategori', color: '#95a5a6' }
        
        if (!categoryCounts[category.id]) {
          categoryCounts[category.id] = {
            category,
            count: 0
          }
        }
        categoryCounts[category.id].count++
      })
      
      // Convert ke array dan hitung persentase
      return Object.values(categoryCounts)
        .map(item => ({
          ...item,
          percentage: Math.round((item.count / this.tasks.length) * 100)
        }))
        .sort((a, b) => b.count - a.count) // Urutkan dari terbanyak
    }
  }
}
</script>

<style scoped>
.section h2 {
  font-size: 1.8rem;
  color: var(--dark-color);
  margin-bottom: 2rem;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
  text-align: center;
  transition: var(--transition);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.stat-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.stat-card h3 {
  font-size: 1rem;
  color: var(--gray-color);
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
}

.stat-card:nth-child(2) .stat-number {
  color: var(--secondary-color);
}

.stat-card:nth-child(3) .stat-number {
  color: var(--warning-color);
}

.stat-card:nth-child(4) .stat-number {
  color: #9b59b6;
}

.chart-container {
  background-color: white;
  border-radius: var(--border-radius);
  padding: 1.5rem;
  box-shadow: var(--box-shadow);
}

.chart-container h3 {
  font-size: 1.3rem;
  color: var(--dark-color);
  margin-bottom: 1.5rem;
  font-weight: 600;
}

.no-data {
  text-align: center;
  padding: 3rem 2rem;
  color: var(--gray-color);
}

.no-data p {
  margin: 0;
  font-size: 1.1rem;
}

.no-data .subtext {
  font-size: 0.9rem;
  margin-top: 0.5rem;
  opacity: 0.7;
}

.category-chart {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chart-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.chart-label {
  width: 150px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
}

.category-color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.chart-bar-outer {
  flex: 1;
  height: 30px;
  background-color: #f8f9fa;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
}

.chart-bar-inner {
  height: 100%;
  border-radius: 15px;
  transition: width 1s ease-in-out;
  min-width: 30px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 15px;
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-value {
  width: 80px;
  text-align: right;
  font-weight: 600;
  color: var(--dark-color);
  flex-shrink: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
  
  .stat-card {
    padding: 1rem;
  }
  
  .stat-icon {
    font-size: 2rem;
  }
  
  .stat-number {
    font-size: 1.5rem;
  }
  
  .chart-bar {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .chart-label {
    width: 100%;
  }
  
  .chart-bar-outer {
    width: 100%;
  }
  
  .chart-value {
    width: 100%;
    text-align: left;
  }
}

@media (max-width: 480px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
}
</style>