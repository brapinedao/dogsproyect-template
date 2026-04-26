import { ref, onMounted } from 'vue'
import { usePetsStore } from '@/modules/pets/store/usePetsStore'
import type { Pet } from '@/modules/pets/store/usePetsStore'
import type { QTableColumn } from 'quasar'

function usePetsList() {
  const petsStore = usePetsStore()

  const rows = ref<Pet[]>([])
  const loading = ref(false)

  const columns: QTableColumn[] = [
    { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
    { name: 'name', label: 'Nombre', field: 'name', align: 'left', sortable: true },
    { name: 'breed', label: 'Raza', field: 'breed', align: 'left', sortable: true },
    { name: 'age', label: 'Edad', field: 'age', align: 'center', sortable: true },
    { name: 'ownerName', label: 'Propietario', field: 'ownerName', align: 'left', sortable: true },
  ]

  const tableProps = { rows, loading, columns }

  onMounted(async () => {
    loading.value = true
    await petsStore._getPets()
    rows.value = petsStore.pets
    loading.value = false
  })

  return { tableProps }
}

export default usePetsList()
