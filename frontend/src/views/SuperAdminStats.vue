<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <header class="max-w-7xl mx-auto flex justify-between items-center mb-10">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Control de Facturación por Usuario</h1>
        <p class="text-gray-500 font-medium">Reporte de actividad y consumo individual para facturación</p>
      </div>
      <router-link to="/" class="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
        Cerrar Sesión
      </router-link>
    </header>

    <main class="max-w-7xl mx-auto space-y-8">
      
      <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
        <label class="font-bold text-gray-700">Seleccionar Usuario para Auditar:</label>
        <select 
          v-model="selectedUserId" 
          @change="updateStats"
          class="block w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
          <option value="" disabled>Elija un usuario...</option>
          <option v-for="u in userAccounts" :key="u.id" :value="u.id">{{ u.username }} ({{ u.client }})</option>
        </select>
      </div>

      <div v-if="selectedUserId" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-indigo-600">
          <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">Accesos Totales</p>
          <p class="text-3xl font-black text-gray-900">{{ stats.totalViews }}</p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-emerald-500">
          <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">Documentos Consultados</p>
          <p class="text-3xl font-black text-gray-900">{{ stats.uniqueDocs }}</p>
        </div>
        <div class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-orange-400">
          <p class="text-sm font-bold text-gray-400 uppercase tracking-widest">Costo Estimado Acceso</p>
          <p class="text-3xl font-black text-gray-900">$ {{ (stats.totalViews * 0.50).toFixed(2) }}</p>
        </div>
      </div>

      <div v-if="selectedUserId" class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
        <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
          <h3 class="text-lg font-bold text-gray-800">Detalle de Actividad del Usuario</h3>
          <span class="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase">Reporte Generado: {{ new Date().toLocaleDateString() }}</span>
        </div>
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Fecha y Hora</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tipo Recurso</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Identificador</th>
              <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">IP Origen</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="log in logs" :key="log.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">{{ log.date }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="log.type === 'Factura' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'" class="px-2 py-1 rounded text-[10px] font-bold uppercase">
                  {{ log.type }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{{ log.doc_num }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-400 font-mono">{{ log.ip }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="text-center py-24 bg-white rounded-2xl border-2 border-dashed border-gray-200">
        <div class="text-gray-200 text-6xl mb-4">👤</div>
        <p class="text-gray-400 font-medium">Seleccione un usuario de la lista para desglosar sus consumos.</p>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const selectedUserId = ref('')

// Lista de usuarios basada en tu base de datos RDS
const userAccounts = [
  { id: 2, username: 'user_a', client: 'Logística Global S.A.' },
  { id: 3, username: 'user_b', client: 'Suministros Industriales' },
  { id: 4, username: 'user_uno_a', client: 'Distribuidora Norte' }
]

const stats = reactive({
  totalViews: 0,
  uniqueDocs: 0
})

const logs = ref([])

const updateStats = () => {
  // Simulación de datos filtrados por UserID
  if (selectedUserId.value == 2) {
    stats.totalViews = 42
    stats.uniqueDocs = 15
    logs.value = [
      { id: 1, date: '2026-02-08 14:20', type: 'Factura', doc_num: 'FAC-A-001', ip: '192.168.1.45' },
      { id: 2, date: '2026-02-08 14:22', type: 'Recibo', doc_num: 'REC-A-001', ip: '192.168.1.45' },
      { id: 3, date: '2026-02-07 10:05', type: 'Factura', doc_num: 'FAC-A-102', ip: '192.168.1.45' }
    ]
  } else {
    stats.totalViews = 18
    stats.uniqueDocs = 8
    logs.value = [
      { id: 50, date: '2026-02-08 09:00', type: 'Factura', doc_num: 'FAC-B-500', ip: '200.45.12.3' }
    ]
  }
}
</script>