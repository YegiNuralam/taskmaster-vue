<template>
  <header>
    <div class="container">
      <h1>TaskMaster</h1>
      <p>Aplikasi Manajemen Tugas Pribadi</p>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Header'
}
</script>

<style scoped>
header {
  background: linear-gradient(135deg, var(--primary-color), var(--dark-color));
  color: white;
  padding: 2rem 0;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

header h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

header p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  header h1 {
    font-size: 2rem;
  }
  
  header p {
    font-size: 1rem;
  }
}
</style>