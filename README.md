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

### 🔹 Sprint #1 
Durante este primer sprint se asentaron las bases estructurales y de diseño uniforme de la plataforma frontend:
* **Estructura Base:** Configuración global del proyecto en Angular e integración nativa de Bootstrap 5 para el maquetado.
* **Componentes Core:** Creación y enrutamiento inicial sin restricciones de los componentes esenciales (`Login`, `Registro`, `Bienvenida / Home` y `Quién Soy`).
* **Componente "Quién Soy":** Implementación de un servicio conectado a la API de GitHub (`https://api.github.com/users/USERNAME`) para consumir de forma asíncrona la información de perfil del alumno (nombre, avatar y biografía) renderizándolo en una tarjeta estilizada.
* **Elección del Juego Propio:** Maquetado estético de la propuesta didáctica para el juego personalizado titulado *"El Intruso"*, detallando de forma clara sus reglas de victoria, derrota, variables cognitivas a medir (percepción visual) y un bloque gráfico simulado a modo de ejemplo visual mediante una cuadrícula responsiva de $5 \times 5$.
* **Identidad:** Implementación e integración del Favicon propio de la sala de juegos en el navegador.

---

### 🔹 Sprint #2 
Durante este segundo sprint se implementó el motor de autenticación completo y la reactividad global de la interfaz de usuario:
* **Integración con Supabase Auth:** Configuración de servicios de inicio de sesión y persistencia local de la sesión de usuario.
* **Arquitectura Basada en Angular Signals:** Migración del estado de autenticación a un flujo reactivo usando `signal` y `computed`. El sistema detecta automáticamente si hay una sesión activa en segundo plano sin bloquear la carga inicial del DOM de los componentes.
* **Escucha en Tiempo Real:** Implementación del listener `onAuthStateChange` de Supabase desacoplado de hilos críticos para garantizar respuestas instantáneas en la navegación e inicio de sesión.
* **Acceso Rápido (Testing):** Creación de un panel automatizado de credenciales (`Jugador 1`, `Jugador 2` y `Admin`) en el formulario de Login con inyección dinámica de datos a través de `patchValue`.
* **Registro Extendido de Usuarios:** Formulario reactivo interactivo que valida y almacena metadatos complementarios exigidos (`nombre`, `apellido`, `edad`) directamente en la tabla personalizada de base de datos vinculada al ID de autenticación.
* **Navegación Inteligente en Navbar:** El componente Header reacciona en tiempo real ocultando o mostrando las opciones de ingreso, mostrando el nombre completo del usuario activo y habilitando la destrucción segura de la sesión.
* **Experiencia de Usuario (UX):** Rediseño visual unificado alternando paletas de colores neón (Cian para Login y Violeta/Pink para Registro) e inclusión de scroll cinemático automatizado (`scrollIntoView`) en la landing al pulsar el botón principal.

---

### 🔹 Sprint #3 
Durante este tercer sprint se implementará el núcleo de entretenimiento interactivo y el sistema global de comunicación en tiempo real:
* **Juego "Ahorcado" por Interfaz:** Desarrollo del motor del juego utilizando un panel interactivo con botones dedicados para cada letra del abecedario. La entrada de datos queda estrictamente restringida a clics en la interfaz de usuario, inhabilitando de forma deliberada el uso del teclado físico.
* **Juego de Naipes "Mayor o Menor":** Implementación de la lógica probabilística basada en una baraja de cartas, donde el usuario debe predecir secuencialmente si el siguiente naipe será numéricamente superior o inferior al visible.
* **Sala de Chat Global y Reactiva:** Creación de una única interfaz de mensajería unificada accesible únicamente para usuarios autenticados y logueados. La plataforma estará vinculada a una suscripción activa del servicio de base de datos en tiempo real, garantizando que los mensajes enviados se rendericen automáticamente en todos los clientes conectados sin necesidad de recargar la página.
* **Persistencia de Métricas y Mensajes:** Diseño e integración de servicios que guardan en la base de datos la información crítica al finalizar cada partida (vínculo con el ID del jugador, tiempo de finalización, cantidad de letras seleccionadas y volumen de cartas acertadas), así como el almacenamiento de cada mensaje del chat con su emisor y fecha de envío.
* **Diferenciación Visual en Chat:** Formateo dinámico del flujo de mensajes para estructurar de forma clara quién envía el contenido y la hora exacta de emisión, aplicando estilos diferenciados en la burbuja de chat para que el mensaje propio se distinga visualmente del resto.
* **Condiciones de Finalización:** Programación de flujos de control estrictos con interfaces explícitas (utilizando modales en lugar de alerts) que definen mecánicas claras de victoria y derrota para cada juego.
---

### ⏳ Sprint #4 (Próximamente)
* **Estado:** *Pendiente de desarrollo*
* **Alcance planificado:** Construcción e integración de la *Sala de Chat Global* con suscripción activa a eventos en tiempo real (Base de Datos Realtime) diferenciando mensajes propios y ajenos con marcas de tiempo explícitas. Desarrollo del juego *Preguntados* consumiendo bancos de preguntas externos mediante APIs públicas. Codificación lógica jugable del *Juego Propio* con guardado de métricas de desempeño y generación de pantallas globales de tablas de *Resultados*.

---

### ⏳ Sprint #5 (Opcional / Recuperatorio)
* **Estado:** *Pendiente de desarrollo*
* **Alcance planificado:** Formulario de encuestas integrado con controles y validaciones avanzadas en base a rangos de edad y extensiones numéricas de contacto. Panel de administración restrictivo protegido mediante Guardias de Ruta (Guards) para visualización centralizada de métricas de encuestas. Animaciones fluidas de transición entre componentes.
