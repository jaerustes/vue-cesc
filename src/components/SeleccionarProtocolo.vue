<template>
  <div class="container mt-5">
    <div class="mb-4 card p-3 bg-light border-primary">
      <label for="protocoloSelect" class="form-label fs-5 fw-bold text-primary">
        Selecciona un Sociograma:
      </label>
      <select 
        id="protocoloSelect" 
        class="form-select border-primary fw-bold"
        v-model="protocoloSeleccionado"
        required
      >
        <option disabled value="">Selecciona un protocolo</option>
        <option v-for="protocolo in protocolos" :key="protocolo.id" :value="protocolo.id">
          {{ protocolo.nombre }}
        </option>
      </select>
    </div>

    <button 
      class="btn btn-primary btn-lg w-100 fw-bold" 
      @click="irAlProtocolo"
      :disabled="!protocoloSeleccionado"
    >
      Accedeix al protocol
    </button>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { db } from '../stores/firebase'; 
import { collection, getDocs } from 'firebase/firestore';

export default {
  setup() {
    const router = useRouter();
    const protocolos = ref([]);
    const protocoloSeleccionado = ref(''); // Declaramos protocoloSeleccionado para evitar el warning

    // Cargar los protocolos desde Firebase
    const loadProtocolos = async () => {
      try {
        const protocolosRef = collection(db, 'protocolos');
        const snapshot = await getDocs(protocolosRef);
        protocolos.value = snapshot.docs.map(doc => ({
          id: doc.id,
          nombre: doc.data().nombre
        }));
      } catch (error) {
        console.error('Error al cargar los protocolos:', error);
      }
    };

    // Redirigir al protocolo seleccionado
    const irAlProtocolo = () => {
      if (protocoloSeleccionado.value) {
        router.push({ name: 'listAlumnes', params: { protocoloId: protocoloSeleccionado.value } });
      }
    };

    // Cargar los protocolos cuando el componente se monta
    onMounted(loadProtocolos);

    return {
      protocolos,
      protocoloSeleccionado, // Aseguramos que esté disponible en el template
      irAlProtocolo,
    };
  },
};
</script>

<style scoped>
/* Añadir estilos aquí si es necesario */
</style>
