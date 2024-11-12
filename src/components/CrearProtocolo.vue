<template>
    <div class="container mt-5">
      <div class="card p-4 bg-light border-primary">
        <h1 class="text-center text-primary">Crea Sociograma</h1>
        
        <div class="mb-3">
          <label class="form-label fw-bold">Nom del protocol (grup per exemple):</label>
          <input 
            v-model="nombreProtocolo" 
            placeholder="Introduce el nombre del protocolo" 
            class="form-control border-primary" 
            required
          />
        </div>
  
        <div class="mb-3">
          <label class="form-label fw-bold">Importa la llista d'alumnes (.txt):</label>
          <input 
            type="file" 
            @change="importarArchivoTxt" 
            accept=".txt" 
            class="form-control border-primary"
          />
        </div>
  
        <button 
          @click="crearProtocolo" 
          class="btn btn-primary w-100 fw-bold mb-4"
        >
          Crea Sociograma
        </button>
        
        <div v-if="protocolos.length" class="mt-4">
          <h2 class="text-center text-primary">Protocolos Existentes</h2>
          <ul class="list-group mt-3">
            <li v-for="protocolo in protocolos" :key="protocolo.id" class="list-group-item d-flex justify-content-between align-items-center">
              <span class="fw-bold">{{ protocolo.nombre }}</span>
              <div>
                <button 
                  @click="eliminarProtocolo(protocolo.id)" 
                  class="btn btn-danger btn-sm me-2"
                >
                  Elimina
                </button>
                <button 
                  @click="activarProtocolo(protocolo.id, true)" 
                  class="btn btn-success btn-sm me-2"
                >
                  Activa
                </button>
                <button 
                  @click="activarProtocolo(protocolo.id, false)" 
                  class="btn btn-secondary btn-sm"
                >
                  Desactiva
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  import { db } from '../stores/firebase';
  import { collection, addDoc, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
  
  export default {
    setup() {
      const nombreProtocolo = ref('');
      const alumnos = ref([]);
      const protocolos = ref([]);
  
      const cargarProtocolos = async () => {
        try {
          const snapshot = await getDocs(collection(db, 'protocolos'));
          protocolos.value = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
        } catch (error) {
          console.error('Error al cargar protocolos:', error);
        }
      };
  
      const importarArchivoTxt = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
  
        const reader = new FileReader();
        reader.onload = (e) => {
          const lines = e.target.result.split('\n');
          alumnos.value = lines.map(line => {
            const [id, name] = line.trim().split('\t');
            return {
              id: id.trim(),
              nombre: name ? name.trim() : '',
            };
          }).filter(alumno => alumno.id && alumno.nombre);
        };
        reader.readAsText(file);
      };
  
      const crearProtocolo = async () => {
        if (!nombreProtocolo.value || alumnos.value.length === 0) {
          alert('Introduce un nombre de protocolo y carga un archivo de alumnos.');
          return;
        }
  
        try {
          await addDoc(collection(db, 'protocolos'), {
            nombre: nombreProtocolo.value,
            alumnos: alumnos.value,
            activo: true,
          });
          alert('Protocolo creado correctamente');
          nombreProtocolo.value = '';
          alumnos.value = [];
          await cargarProtocolos();
        } catch (error) {
          console.error('Error al crear el protocolo:', error);
        }
      };
  
      const eliminarProtocolo = async (protocoloId) => {
        try {
          await deleteDoc(doc(db, 'protocolos', protocoloId));
          alert('Protocolo eliminado correctamente');
          await cargarProtocolos();
        } catch (error) {
          console.error('Error al eliminar el protocolo:', error);
        }
      };
  
      const activarProtocolo = async (protocoloId, activo) => {
        try {
          await updateDoc(doc(db, 'protocolos', protocoloId), { activo });
          alert(`Protocolo ${activo ? 'activado' : 'desactivado'} correctamente`);
          await cargarProtocolos();
        } catch (error) {
          console.error('Error al actualizar el estado del protocolo:', error);
        }
      };
  
      onMounted(() => {
        cargarProtocolos();
      });
  
      return {
        nombreProtocolo,
        alumnos,
        protocolos,
        importarArchivoTxt,
        crearProtocolo,
        eliminarProtocolo,
        activarProtocolo,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Añadir estilos adicionales si es necesario */
  </style>  