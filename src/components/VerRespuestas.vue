<template>
  <div class="container mt-5 d-flex justify-content-center">
    <div class="card p-4 bg-light border-primary shadow-lg" style="max-width: 800px; width: 100%;">
      <h2 class="text-center text-primary">Veure Respostes</h2>

      <div class="mb-3">
        <label class="form-label fw-bold text-primary">Selecciona un sociograma:</label>
        <select 
          v-model="protocoloSeleccionado" 
          class="form-select border-primary"
          required
        >
          <option disabled value="">Selecciona un sociograma</option>
          <option v-for="protocolo in protocolos" :key="protocolo.id" :value="protocolo.id">
            {{ protocolo.nombre }}
          </option>
        </select>
      </div>

      <!-- Mostrar contadores de respuestas -->
      <div v-if="protocoloSeleccionado" class="mt-3 text-primary">
        <p><strong>Alumnes que han acabat:</strong> {{ respondidos }} / {{ totalAlumnos }}</p>
        <p><strong>Alumnes pendients:</strong> {{ pendientes }}</p>
      </div>

      <!-- Lista de alumnos que han respondido con botón de eliminar -->
      <div v-if="respondidos > 0" class="mt-3">
        <h5 class="text-primary">Alumnes que han acabat:</h5>
        <ul class="list-group">
          <li v-for="(respuesta, alumnoId) in respuestas" :key="alumnoId" class="list-group-item d-flex justify-content-between align-items-center">
            {{ respuesta.nombre }}
            <button 
              class="btn btn-outline-danger btn-sm" 
              @click="eliminarRespuesta(alumnoId)"
            >
              Eliminar
            </button>
          </li>
        </ul>
      </div>

      <button 
        @click="descargarFormatoComoTexto" 
        class="btn btn-primary w-100 fw-bold mt-4" 
        :disabled="!protocoloSeleccionado"
      >
        Descarrega Respostes
      </button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { db } from '../stores/firebase';
import { collection, doc, getDoc, getDocs, onSnapshot, deleteDoc } from 'firebase/firestore';

export default {
  props: {
    protocoloId: {
      type: String,
      required: false,
    },
  },
  setup() {
    const protocolos = ref([]);
    const protocoloSeleccionado = ref('');
    const respuestas = ref({});
    const respondidos = ref(0);
    const pendientes = ref(0);
    const totalAlumnos = ref(0);
    let unsubscribe = null;

    onMounted(async () => {
      const protocolosSnapshot = await getDocs(collection(db, 'protocolos'));
      protocolos.value = protocolosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
    });

    const cargarRespuestas = async () => {
      if (unsubscribe) {
        unsubscribe(); 
      }
      if (!protocoloSeleccionado.value) return;

      const protocoloDoc = await getDoc(doc(db, 'protocolos', protocoloSeleccionado.value));
      const protocoloData = protocoloDoc.data();

      if (protocoloData && protocoloData.alumnos) {
        totalAlumnos.value = protocoloData.alumnos.length;
      }

      const respuestasRef = collection(db, 'protocolos', protocoloSeleccionado.value, 'respuestas');
      unsubscribe = onSnapshot(respuestasRef, (snapshot) => {
        respuestas.value = {};
        snapshot.forEach(doc => {
          respuestas.value[doc.id] = {
            respuestas: doc.data().respuestas,
            nombre: doc.data().nombre || `Alumno ${doc.id.replace('alumno_', '')}`
          };
        });

        respondidos.value = Object.keys(respuestas.value).length;
        pendientes.value = totalAlumnos.value - respondidos.value;
      });
    };

    const eliminarRespuesta = async (alumnoId) => {
      if (confirm('¿Estás seguro de que quieres eliminar esta respuesta?')) {
        await deleteDoc(doc(db, 'protocolos', protocoloSeleccionado.value, 'respuestas', alumnoId));
      }
    };

    const descargarFormatoComoTexto = () => {
      // Aquí puedes agregar el código para descargar el formato.
    };

    onUnmounted(() => {
      if (unsubscribe) {
        unsubscribe();
      }
    });

    watch(protocoloSeleccionado, cargarRespuestas);

    return {
      protocolos,
      protocoloSeleccionado,
      descargarFormatoComoTexto,
      respondidos,
      pendientes,
      totalAlumnos,
      respuestas,
      eliminarRespuesta,
    };
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}
.card {
  border-radius: 10px;
             width: 100%;
}
.list-group-item {
  border: 1px solid #007bff;
  font-size: 1.1em;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.list-group-item button {
  margin-left: auto;
}
</style>
