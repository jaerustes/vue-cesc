<template>
  <div class="mt-5">
    <div class="shadow-sm p-4">
      <h1 class="mb-4 text-center text-primary">Protocolo CESC-ESO</h1>

      <!-- Selección del propio alumno -->
      <!-- Selección del propio alumno -->
<div class="mb-4 p-3 bg-light border-primary">
  <label for="alumnoSelect" class="form-label fs-5 fw-bold text-primary">
    Introduce tu nombre:
  </label>
  <select 
    id="alumnoSelect" 
    class="form-select border-primary fw-bold"
    v-model="alumnoSeleccionado"
    required
  >
    <option disabled value="">Selecciona un alumno</option>
    <option v-for="alumno in alumnosFiltrados" :key="alumno.id" :value="alumno.id">
      {{ alumno.nombre }}
    </option>
  </select>
</div>

      <!-- Formulario de preguntas -->
      <form @submit.prevent="handleSubmit">
        <div v-for="(pregunta, preguntaIndex) in preguntas" :key="pregunta.id" class="mb-4">
          <h3 class="h5 text-secondary">{{ pregunta.texto }}</h3>
          
          <div class="row gy-2">
            <div v-for="respuestaIndex in 3" :key="respuestaIndex" class="col-md-4">
              <select 
                class="form-select" 
                v-model="respuestas[preguntaIndex][respuestaIndex - 1]" 
                @change="verificarDuplicados(preguntaIndex)"
                required
              >
                <option disabled value="">Selecciona un alumno</option>
                <option 
                  v-for="alumno in filtrarAlumnosDisponibles(preguntaIndex, respuestaIndex - 1)" 
                  :key="alumno.id" 
                  :value="alumno.id"
                >
                  {{ alumno.nombre }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <div class="text-center">
          <button type="submit" class="btn btn-success mt-4">Enviar Respuestas</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted, computed } from 'vue';
import { db } from '../stores/firebase'; 
import { doc, getDoc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';

export default {
  props: {
    protocoloId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const alumnos = ref([]);
    const preguntas = [
      { id: 1, texto: 'Me cae bien (Selecciona 3 compañeros)' },
      { id: 2, texto: 'No me cae bien (Selecciona 3 compañeros)' },
      { id: 3, texto: 'Difunde rumores (Selecciona 3 compañeros)' },
      { id: 4, texto: 'Ayuda a los demás (Selecciona 3 compañeros)' },
      { id: 5, texto: 'Da empujones (Selecciona 3 compañeros)' },
      { id: 6, texto: 'No deja participar (Selecciona 3 compañeros)' },
      { id: 7, texto: 'Anima a los demás (Selecciona 3 compañeros)' },
      { id: 8, texto: 'Insulta (Selecciona 3 compañeros)' },
      { id: 9, texto: '¿A quién dan empujones? (Selecciona 3 compañeros)' },
      { id: 10, texto: '¿A quién insultan o ridiculizan? (Selecciona 3 compañeros)' },
      { id: 11, texto: '¿A quién no dejan participar? (Selecciona 3 compañeros)' },
      { id: 12, texto: 'Mis amigos / amigas (Selecciona 3 compañeros)' },
    ];

    const alumnoSeleccionado = ref(null);
    const respuestas = reactive(Array.from({ length: preguntas.length }, () => Array(3).fill(null)));
    const alumnosCompletados = ref(new Set());

    const fetchAlumnosCompletados = async () => {
      const respuestasSnapshot = await getDocs(
        query(collection(db, 'protocolos', props.protocoloId, 'respuestas'), where("completado", "==", true))
      );

      respuestasSnapshot.docs.forEach(doc => {
        const alumnoId = doc.id.split('_')[1];
        alumnosCompletados.value.add(alumnoId);
      });
    };

    const alumnosFiltrados = computed(() => {
      return alumnos.value.filter(alumno => !alumnosCompletados.value.has(alumno.id.toString()));
    });

    const filtrarAlumnosDisponibles = (preguntaIndex, respuestaIndex) => {
      const seleccionados = respuestas[preguntaIndex].filter((id, index) => index !== respuestaIndex);
      return alumnosFiltrados.value.filter(alumno => 
        alumno.id !== alumnoSeleccionado.value && 
        !seleccionados.includes(alumno.id)
      );
    };

    const verificarDuplicados = (preguntaIndex) => {
      const seleccionados = new Set();
      respuestas[preguntaIndex] = respuestas[preguntaIndex].map(id => {
        if (id && seleccionados.has(id)) {
          return null;
        } else {
          seleccionados.add(id);
          return id;
        }
      });
    };

    const handleSubmit = async () => {
      if (!alumnoSeleccionado.value) {
        alert('Selecciona tu nombre antes de enviar el formulario');
        return;
      }

      const respuestasPlanas = {};
      preguntas.forEach((pregunta, index) => {
        respuestasPlanas[`pregunta_${pregunta.id}`] = respuestas[index];
      });

      try {
        await setDoc(doc(db, 'protocolos', props.protocoloId, 'respuestas', `alumno_${alumnoSeleccionado.value}`), {
          respuestas: respuestasPlanas,
          completado: true
        });
        alert('Formulario enviado correctamente');
      } catch (error) {
        console.error("Error al guardar en Firebase:", error);
      }
    };

    const cargarAlumnos = async () => {
      try {
        const protocoloDoc = await getDoc(doc(db, 'protocolos', props.protocoloId));
        
        if (protocoloDoc.exists() && protocoloDoc.data().alumnos) {
          alumnos.value = protocoloDoc.data().alumnos;
        } else {
          console.log('No hay alumnos disponibles en Firebase');
        }
        
      } catch (error) {
        console.error('Error al cargar alumnos:', error);
      }
    };

    onMounted(async () => {
      await fetchAlumnosCompletados();
      await cargarAlumnos();
    });

    return {
      alumnosFiltrados,
      alumnoSeleccionado,
      respuestas,
      preguntas,
      handleSubmit,
      filtrarAlumnosDisponibles,
      verificarDuplicados,
    };
  },
};
</script>

<style scoped>
/* Ajustes adicionales si es necesario */
</style>
