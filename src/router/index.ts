// src/router/index.js o src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import ListAlumnes from '../components/ListAlumnes.vue';
import VerRespuestas from '../components/VerRespuestas.vue';
import SeleccionarProtocolo from '../components/SeleccionarProtocolo.vue'
import CrearProtocolo from '@/components/CrearProtocolo.vue';

const routes = [
  {
    path: '/cesc',
    name: 'Seleccionar Sociograma',
    component: SeleccionarProtocolo,
  },
  {
    path: '/cesc/:protocoloId',
    name: 'listAlumnes',
    component: ListAlumnes,
    props: true,
  },
  {
    path: '/ver-respuestas/:protocoloId', // Asegúrate de que esta ruta esté presente
    name: 'VerRespuestas',
    component: VerRespuestas,
    props: true, // Habilitar el uso de props para pasar protocoloId
  },
  {
    path: '/ver-respuestas/', // Asegúrate de que esta ruta esté presente
    name: 'VerRespuestas',
    component: VerRespuestas,
  },
  {
    path: '/crearProtocolo/',
    name: 'crearProtocolo',
    component: CrearProtocolo,
  },
  {
    path: '/',
    redirect: '/CESC', // Redirecciona a la ruta inicial
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
