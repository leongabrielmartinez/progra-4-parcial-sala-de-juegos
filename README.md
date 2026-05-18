# Sala de Juegos — Trabajo Práctico (Primer Parcial)

## 📌 Datos del Alumno
* **Nombre y Apellido:** [Leon Gabriel Martinez Aquino]
* **Materia:** Programación IV ($4^{\circ}$ Cuatrimestre)
* **Institución:** UTN Avellaneda (Tecnicatura Universitaria en Programación)

---

## 🚀 Despliegue de la Aplicación
* **Enlace al Deploy:** [https://vercel.com/leon-gabriel-martinez-aquinos-projects/progra-4-parcial-sala-de-juegos/EWxLq84Xrgcxj1SA1wYA1hkBQnaj]

**Enlace del dominio Vercel:** [https://progra-4-parcial-sala-de-juegos.vercel.app/]

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

### ⏳ Sprint #2 (Próximamente)
* **Estado:** *Pendiente de desarrollo*
* **Alcance planificado:** Funcionalidad del Home principal con visibilidad adaptativa según el estado de sesión del usuario. Sistema de inicio de sesión rápido (botones automatizados) y validación de credenciales frente a servicios de autenticación (Supabase/Firebase). Formulario de registro interactivo con captura de metadatos del jugador (edad, nombre, apellido) y redirección automática tras el alta exitosa.

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