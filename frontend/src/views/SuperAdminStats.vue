<template>
    <div class="min-h-screen bg-gray-50 p-8">
      <header class="max-w-7xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Panel de Control General</h1>
          <p class="text-gray-500">Monitoreo de clientes y consumo de recursos</p>
        </div>
        <router-link to="/" class="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
          Cerrar Sesión
        </router-link>
      </header>
  
      <main class="max-w-7xl mx-auto space-y-8">
        
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <label class="font-bold text-gray-700">Seleccionar Cliente:</label>
          <select 
            v-model="selectedClientId" 
            @change="updateStats"
            class="block w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="" disabled>Elija un cliente...</option>
            <option v-for="c in clients" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>
  
        <div v-if="selectedClientId" class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-blue-500">
            <p class="text-sm font-medium text-gray-500 uppercase">Total Documentos</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.totalDocs }}</p>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-green-500">
            <p class="text-sm font-medium text-gray-500 uppercase">Consultas Realizadas</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.totalViews }}</p>
          </div>
          <div class="bg-white p-6 rounded-2xl shadow-sm border-l-4 border-purple-500">
            <p class="text-sm font-medium text-gray-500 uppercase">Storage S3 Ocupado</p>
            <p class="text-3xl font-bold text-gray-900">{{ stats.storageUsed }}</p>
          </div>
        </div>
  
        <div v-if="selectedClientId" class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <div class="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 class="text-lg font-bold text-gray-800">Historial de Auditoría (Logs)</h3>
          </div>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Fecha y Hora</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Usuario</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Acción</th>
                <th class="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Documento</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-for="log in logs" :key="log.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">{{ log.date }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{{ log.user }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span class="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-bold">{{ log.action }}</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ log.doc_num }}</td>
              </tr>
            </tbody>
          </table>
        </div>
  
        <div v-else class="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <p class="text-gray-400 text-lg">Seleccione un cliente para visualizar las métricas y el historial.</p>
        </div>
  
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  
  const selectedClientId = ref('')
  
  const clients = [
    { id: 2, name: 'Logística Global S.A.' },
    { id: 3, name: 'Suministros Industriales' }
  ]
  
  const stats = reactive({
    totalDocs: 0,
    totalViews: 0,
    storageUsed: '0 MB'
  })
  
  const logs = ref([])
  
  const updateStats = () => {
    // Simulacro de datos que vendrán de tus consultas SQL agregadas (COUNT, SUM)
    if (selectedClientId.value == 2) {
      stats.totalDocs = 450
      stats.totalViews = 128
      stats.storageUsed = '84.2 MB'
      logs.value = [
        { id: 101, date: '2026-02-05 09:15', user: 'user_a', action: 'Visualización', doc_num: 'FAC-A-001' },
        { id: 102, date: '2026-02-05 10:30', user: 'user_a', action: 'Visualización', doc_num: 'REC-A-001' }
      ]
    } else {
      stats.totalDocs = 210
      stats.totalViews = 45
      stats.storageUsed = '31.5 MB'
      logs.value = [
        { id: 201, date: '2026-02-04 15:20', user: 'user_b', action: 'Visualización', doc_num: 'FAC-B-500' }
      ]
    }
  }
  </script>