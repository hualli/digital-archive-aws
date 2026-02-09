<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <header class="max-w-7xl mx-auto flex justify-between items-center mb-10">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Control de Facturación</h1>
        <p class="text-gray-500 font-medium">Reporte de consumo en tiempo real (Región Ohio)</p>
      </div>
      <button @click="logout" class="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100">
        Cerrar Sesión
      </button>
    </header>

    <main class="max-w-7xl mx-auto space-y-8">
      
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <label class="font-bold text-gray-700">Auditando Actividad de:</label>
        <select 
          v-model="selectedUsername" 
          @change="updateSelection"
          class="block w-64 pl-3 pr-10 py-2 border-gray-300 focus:ring-blue-500 rounded-md"
        >
          <option value="" disabled>Elija un usuario...</option>
          <option v-for="u in userStatsList" :key="u.username" :value="u.username">
            {{ u.username }}
          </option>
        </select>
      </div>

      <div v-if="selectedUser" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-indigo-600">
          <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">Accesos Totales</p>
          <p class="text-3xl font-black text-gray-900">{{ selectedUser.views }}</p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-emerald-500">
          <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">Estado</p>
          <p class="text-3xl font-black text-emerald-600">ACTIVO</p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-orange-400">
          <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">A Facturar</p>
          <p class="text-3xl font-black text-gray-900">$ {{ (selectedUser.views * 0.50).toFixed(2) }}</p>
        </div>
      </div>

      <div v-if="selectedUsername" class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <h3 class="text-lg font-bold text-gray-800">Detalle de Actividad: {{ selectedUsername }}</h3>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Fecha y Hora</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tipo</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Nro. Comprobante</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">IP Origen</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="log in filteredLogs" :key="log.date + log.doc_num" class="hover:bg-gray-50">
                <td class="px-6 py-4 text-sm text-gray-600 font-mono">{{ log.date }}</td>
                <td class="px-6 py-4">
                  <span :class="log.type === 'Factura' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'" 
                        class="px-2 py-1 rounded text-[10px] font-bold uppercase">
                    {{ log.type }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm font-bold text-gray-900">{{ log.doc_num }}</td>
                <td class="px-6 py-4 text-sm text-gray-400 font-mono">{{ log.ip }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="filteredLogs.length === 0" class="p-10 text-center text-gray-400">
          Sin registros recientes para este usuario.
        </div>
      </div>

      <div v-else class="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200">
        <div class="text-gray-200 text-6xl mb-4">🔍</div>
        <p class="text-gray-400 font-medium">Seleccione un usuario para visualizar el desglose de consumos.</p>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const loading = ref(false)
const userStatsList = ref([]) 
const allLogs = ref([]) 
const selectedUsername = ref('')
const selectedUser = ref(null)

// --- FILTRADO EN EL FRONTEND ---
const filteredLogs = computed(() => {
  if (!selectedUsername.value) return []
  return allLogs.value.filter(log => log.user === selectedUsername.value)
})

onMounted(async () => {
  await fetchGlobalStats()
})

const fetchGlobalStats = async () => {
  loading.value = true
  try {
    const response = await api.getStats()
    userStatsList.value = response.data.by_user
    allLogs.value = response.data.logs
  } catch (error) {
    console.error("Error:", error)
  } finally {
    loading.value = false
  }
}

const updateSelection = () => {
  selectedUser.value = userStatsList.value.find(u => u.username === selectedUsername.value)
}

const logout = () => {
  localStorage.clear()
  router.push('/')
}
</script>