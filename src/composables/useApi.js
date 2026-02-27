import { ref } from 'vue'
import { Notify } from 'quasar'

export function useApi(serviceMethod) {
  const loading = ref(false)
  const error = ref(null)
  const data = ref(null)

  const execute = async (...args) => {
    loading.value = true
    error.value = null

    try {
      data.value = await serviceMethod(...args)
      return data.value
    } catch (err) {
      error.value = err
      
      Notify.create({
        type: 'negative',
        message: err.message || 'Erro ao processar requisição',
        position: 'top'
      })
      
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    data,
    execute
  }
}
