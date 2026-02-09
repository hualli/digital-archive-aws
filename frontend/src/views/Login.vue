<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100">
        <div>
          <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Archivo Digital
          </h2>
          <p class="mt-2 text-center text-sm text-gray-600">
            Ingresá para gestionar tus documentos
          </p>
        </div>
        
        <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
          <div class="rounded-md shadow-sm -space-y-px">
            <div class="mb-4">
              <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
              <input 
                v-model="form.username"
                id="username" 
                type="text" 
                required 
                class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                placeholder="Ej: user_a"
              >
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
              <input 
                v-model="form.password"
                id="password" 
                type="password" 
                required 
                class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm" 
                placeholder="••••••••"
              >
            </div>
          </div>
  
          <div>
            <button 
              type="submit" 
              class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Acceder
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api' // Importamos tu nuevo servicio

const router = useRouter()
const form = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  try {
    // 1. Llamada real a tu API Gateway en Ohio
    const response = await api.login(form.username, form.password)
    
    // 2. Extraemos los datos que programamos en la Lambda
    const { id, role } = response.data

    // 3. Guardamos en localStorage para auditoría y persistencia
    // Esto es vital para que las otras Lambdas sepan quién está operando
    localStorage.setItem('user_id', id)
    localStorage.setItem('user_role', role)
    localStorage.setItem('username', form.username)

    // 4. Redirección dinámica basada en el rol de la base de datos
    if (role === 'superadmin') {
      router.push('/stats')
    } else {
      router.push('/search')
    }
    
  } catch (error) {
    // Manejo de errores (por ejemplo, el 401 que vimos antes)
    console.error("Error en login:", error)
    if (error.response && error.response.status === 401) {
      alert('Credenciales incorrectas. Por favor, verificá tu usuario y contraseña.')
    } else {
      alert('Hubo un problema al conectar con el servidor. Reintentá en unos minutos.')
    }
  }
}
</script>