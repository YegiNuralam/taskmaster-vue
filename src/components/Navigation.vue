<template>
  <nav>
    <div class="container">
      <ul>
        <li v-for="item in navItems" :key="item.id">
          <a 
            href="#" 
            :class="['nav-link', { active: activeSection === item.id }]"
            @click.prevent="$emit('section-change', item.id)"
          >
            {{ item.label }}
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'Navigation',
  props: {
    activeSection: {
      type: String,
      required: true
    }
  },
  emits: ['section-change'],
  data() {
    return {
      navItems: [
        { id: 'tasks', label: 'Tugas Saya' },
        { id: 'categories', label: 'Kategori' },
        { id: 'stats', label: 'Statistik' }
      ]
    }
  }
}
</script>

<style scoped>
nav {
  background-color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

nav ul {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}

nav li {
  margin-right: 1rem;
}

.nav-link {
  display: block;
  padding: 1rem 1.5rem;
  text-decoration: none;
  color: var(--dark-color);
  font-weight: 500;
  transition: var(--transition);
  border-bottom: 3px solid transparent;
}

.nav-link:hover,
.nav-link.active {
  color: var(--primary-color);
  border-bottom-color: var(--primary-color);
}

/* Responsive */
@media (max-width: 768px) {
  nav ul {
    flex-direction: column;
  }
  
  nav li {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }
  
  .nav-link {
    padding: 0.8rem 1rem;
    text-align: center;
  }
}
</style>