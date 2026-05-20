# Sala de Juegos — Trabajo Práctico (Primer Parcial)

## 📌 Datos del Alumno
* **Nombre y Apellido:** [Leon Gabriel Martinez Aquino]
* **Materia:** Programación IV ($4^{\circ}$ Cuatrimestre)
* **Institución:** UTN Avellaneda (Tecnicatura Universitaria en Programación)

---

## 🚀 Despliegue de la Aplicación
* **Enlace al Deploy:** [[Sala de juegos](https://progra-4-parcial-sala-de-juegos.vercel.app)]

---

## 🛠️ Tecnologías Utilizadas
* **Angular** (Arquitectura basada en componentes globales)
* **Bootstrap 5** (Diseño responsivo y grillas flexibles)
* **Bootstrap Icons** (Paquete de fuentes vectoriales para interfaces)

---

## 📦 Historial de Desarrollo por Sprints

### 🔹 Sprint #1 (Entrega Actual)
Durante este primer sprint se asentaron las bases estructurales y de diseño uniforme de la plataforma frontend:
* **Estructura Base:** Configuración global del proyecto en Angular e integración nativa de Bootstrap 5 para el maquetado.
* **Componentes Core:** Creación y enrutamiento inicial sin restricciones de los componentes esenciales (`Login`, `Registro`, `Bienvenida / Home` y `Quién Soy`).
* **Componente "Quién Soy":** Implementación de un servicio conectado a la API de GitHub (`https://api.github.com/users/USERNAME`) para consumir de forma asíncrona la información de perfil del alumno (nombre, avatar y biografía) renderizándolo en una tarjeta estilizada.
* **Elección del Juego Propio:** Maquetado estético de la propuesta didáctica para el juego personalizado titulado *"El Intruso"*, detallando de forma clara sus reglas de victoria, derrota, variables cognitivas a medir (percepción visual) y un bloque gráfico simulado a modo de ejemplo visual mediante una cuadrícula responsiva de $5 \times 5$.
* **Identidad:** Implementación e integración del Favicon propio de la sala de juegos en el navegador.

---

### 🔹 Sprint #2 (Entrega Actual)
Durante este segundo sprint se implementó el motor de autenticación completo y la reactividad global de la interfaz de usuario:
* **Integración con Supabase Auth:** Configuración de servicios de inicio de sesión y persistencia local de la sesión de usuario.
* **Arquitectura Basada en Angular Signals:** Migración del estado de autenticación a un flujo reactivo usando `signal` y `computed`. El sistema detecta automáticamente si hay una sesión activa en segundo plano sin bloquear la carga inicial del DOM de los componentes.
* **Escucha en Tiempo Real:** Implementación del listener `onAuthStateChange` de Supabase desacoplado de hilos críticos para garantizar respuestas instantáneas en la navegación e inicio de sesión.
* **Acceso Rápido (Testing):** Creación de un panel automatizado de credenciales (`Jugador 1`, `Jugador 2` y `Admin`) en el formulario de Login con inyección dinámica de datos a través de `patchValue`.
* **Registro Extendido de Usuarios:** Formulario reactivo interactivo que valida y almacena metadatos complementarios exigidos (`nombre`, `apellido`, `edad`) directamente en la tabla personalizada de base de datos vinculada al ID de autenticación.
* **Navegación Inteligente en Navbar:** El componente Header reacciona en tiempo real ocultando o mostrando las opciones de ingreso, mostrando el nombre completo del usuario activo y habilitando la destrucción segura de la sesión.
* **Experiencia de Usuario (UX):** Rediseño visual unificado alternando paletas de colores neón (Cian para Login y Violeta/Pink para Registro) e inclusión de scroll cinemático automatizado (`scrollIntoView`) en la landing al pulsar el botón principal.

---

### ⏳ Sprint #3 (Próximamente)
* **Estado:** *Pendiente de desarrollo*
* **Alcance planificado:** Desarrollo interactivo del juego *Ahorcado* mediante comandos de interfaz exclusivos por botones (sin teclado físico). Desarrollo del juego de naipes *Mayor o Menor* evaluando adivinación de secuencias numéricas de barajas. Integración de la persistencia de estadísticas básicas en base de datos al finalizar cada sesión de juego.

---

### ⏳ Sprint #4 (Próximamente)
* **Estado:** *Pendiente de desarrollo*
* **Alcance planificado:** Construcción e integración de la *Sala de Chat Global* con suscripción activa a eventos en tiempo real (Base de Datos Realtime) diferenciando mensajes propios y ajenos con marcas de tiempo explícitas. Desarrollo del juego *Preguntados* consumiendo bancos de preguntas externos mediante APIs públicas. Codificación lógica jugable del *Juego Propio* con guardado de métricas de desempeño y generación de pantallas globales de tablas de *Resultados*.

---

### ⏳ Sprint #5 (Opcional / Recuperatorio)
* **Estado:** *Pendiente de desarrollo*
* **Alcance planificado:** Formulario de encuestas integrado con controles y validaciones avanzadas en base a rangos de edad y extensiones numéricas de contacto. Panel de administración restrictivo protegido mediante Guardias de Ruta (Guards) para visualización centralizada de métricas de encuestas. Animaciones fluidas de transición entre componentes.
