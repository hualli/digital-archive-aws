<template>
  <div class="flex min-h-screen bg-gray-50">
    <aside class="w-80 bg-white shadow-md p-6 border-r border-gray-200">
      <h2 class="text-xl font-bold text-gray-800 mb-6 font-mono tracking-tight">Filtros de Búsqueda</h2>
      
      <div class="space-y-4">
        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider">Nombre Cliente</label>
          <input v-model="filters.name" type="text" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Ej: Logística...">
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider">Nro. Cuenta</label>
          <input v-model="filters.account" type="text" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="ACC-123">
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider">CUIT</label>
          <input v-model="filters.cuit" type="text" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="20-XXXXXXXX-X">
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider">Nro. Factura</label>
          <input v-model="filters.invoice" type="text" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="FAC-001">
        </div>
        <div>
          <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider">Nro. Recibo</label>
          <input v-model="filters.receipt" type="text" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="REC-001">
        </div>

        <button 
          @click="performSearch" 
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2.5 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-all font-semibold mt-6 shadow-sm active:scale-95"
        >
          {{ loading ? 'Buscando...' : 'Buscar' }}
        </button>
      </div>
    </aside>

    <main class="flex-1 p-10">
      <header class="flex justify-between items-center mb-10">
        <div>
          <h1 class="text-3xl font-extrabold text-gray-900">Consulta de Documentos</h1>
          <p class="text-gray-500 mt-1">Acceso a sus comprobantes digitalizados</p>
        </div>
        <button @click="logout" class="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
          Cerrar Sesión
        </button>
      </header>

      <div class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Nro. Cuenta</th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-widest">Cliente</th>
              <th class="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-widest bg-blue-50/30">Factura</th>
              <th class="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-widest bg-green-50/30">Recibo</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="item in results" :key="item.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">{{ item.account }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-semibold text-gray-900">{{ item.client }}</div>
                <div class="text-xs text-gray-400">CUIT: {{ item.cuit }}</div>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div v-if="item.invoice_num" class="flex flex-col items-center space-y-1">
                  <span class="text-[10px] font-bold text-blue-500 uppercase tracking-tighter">Nro: {{ item.invoice_num }}</span>
                  <button 
                    @click="viewPdf(item.id, 'invoice')"
                    class="px-4 py-1 text-[11px] font-black rounded text-blue-700 bg-blue-100 hover:bg-blue-200 transition-all shadow-sm"
                  >
                    VER PDF
                  </button>
                </div>
                <span v-else class="text-xs text-gray-300 italic font-medium">Sin Factura</span>
              </td>

              <td class="px-6 py-4 whitespace-nowrap text-center">
                <div v-if="item.receipt_num" class="flex flex-col items-center space-y-1">
                  <span class="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Nro: {{ item.receipt_num }}</span>
                  <button 
                    @click="viewPdf(item.id, 'receipt')" 
                    class="px-4 py-1 text-[11px] font-black rounded text-green-700 bg-green-100 hover:bg-green-200 transition-all shadow-sm"
                  >
                    VER PDF
                  </button>
                </div>
                <span v-else class="text-xs text-gray-300 italic font-medium">Sin Recibo</span>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="results.length === 0" class="p-20 text-center">
          <div class="text-gray-200 text-6xl mb-4">📂</div>
          <div class="text-gray-400 font-medium">{{ loading ? 'Cargando documentos...' : 'Utilice los filtros laterales para buscar comprobantes.' }}</div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const userId = ref(null)
const results = ref([])
const loading = ref(false)

const filters = reactive({
  name: '',
  account: '',
  cuit: '',
  invoice: '',
  receipt: ''
})

onMounted(() => {
  userId.value = localStorage.getItem('user_id')
  if (!userId.value) {
    router.push('/')
  }
})

// --- CAMBIO CLAVE PARA LA SEGURIDAD ---
const performSearch = async () => {
  loading.value = true
  try {
    // Enviamos el userId.value para que la Lambda filtre solo SUS documentos
    const response = await api.search({ 
      ...filters, 
      user_id: userId.value 
    })
    results.value = response.data
  } catch (error) {
    console.error("Error en búsqueda:", error)
    alert("No se pudo conectar con el servidor de Ohio.")
  } finally {
    loading.value = false
  }
}

const viewPdf = async (docId, type) => {
  try {
    const response = await api.getDocUrl(docId, type, userId.value)
    if (response.data.url) {
      window.open(response.data.url, '_blank')
    }
  } catch (error) {
    console.error("Error al obtener PDF:", error)
    alert("Error al generar el acceso seguro.")
  }
}

const logout = () => {
  localStorage.clear()
  router.push('/')
}
</script>