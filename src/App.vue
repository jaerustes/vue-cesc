<template>
  <div id="app" class="app-container">
    <!-- Barra de navegación -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand" href="#">Sociograma</a>
        <button 
          class="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="accederRuta('/CrearProtocolo')">Nou Sociograma</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="accederRuta('/')">Respostes</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" @click.prevent="accederRuta('/ver-respuestas')">Veure Resptes</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Modal para login -->
    <div v-if="mostrarModal" class="modal fade show" tabindex="-1" style="display: block;">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Acceso Requerido</h5>
            <button type="button" class="btn-close" @click="cerrarModal"></button>
          </div>
          <div class="modal-body">
            <input type="text" v-model="usuario" placeholder="Usuario" class="form-control mb-3">
            <input type="password" v-model="password" placeholder="Contraseña" class="form-control">
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click="validarAcceso">Acceder</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Vista principal -->
    <div class="main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const usuario = ref('');
    const password = ref('');
    const mostrarModal = ref(false);
    const rutaDestino = ref('');

    const accederRuta = (ruta) => {
      rutaDestino.value = ruta;
      // Si la ruta es "Nuevo Sociograma" o "Respuestas", mostrar el modal; si es "Ver Respuestas", redirigir directamente
      if (ruta === '/CrearProtocolo' || ruta === '/') {
        mostrarModal.value = true;
      } else {
        router.push(ruta);
      }
    };

    const validarAcceso = () => {
      if (usuario.value === 'orientacio' && password.value === 'manolo') {
        mostrarModal.value = false;
        router.push(rutaDestino.value);
      } else {
        alert('Usuario o contraseña incorrectos');
      }
    };

    const cerrarModal = () => {
      mostrarModal.value = false;
    };

    return {
      usuario,
      password,
      mostrarModal,
      rutaDestino,
      accederRuta,
      validarAcceso,
      cerrarModal,
    };
  },
};
</script>

<style scoped>
/* Estructura principal y estilos para pantalla completa */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Flex para asegurar que el contenido ocupe el espacio restante */
.main-content {
  flex-grow: 1;
  padding: 20px;
  max-width: 1200px; /* Ajusta el ancho máximo */
  margin: 0 auto; /* Centra el contenido en pantallas grandes */
}

.navbar {
  margin-bottom: 20px;
}
</style>
