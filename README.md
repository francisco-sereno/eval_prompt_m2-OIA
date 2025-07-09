# ¿Qué aprendimos? Práctica de Prompts - Paquete SCORM

## Descripción

Este paquete SCORM contiene una actividad interactiva diseñada para que los estudiantes practiquen y mejoren sus habilidades en la redacción de prompts efectivos para inteligencia artificial. La actividad proporciona retroalimentación automática basada en criterios académicos establecidos y registra las calificaciones en el sistema LMS.

## Características

- ✅ Compatible con SCORM 1.2 y SCORM 2004
- ✅ Evaluación automática con IA (GPT-4o-mini)
- ✅ 15+ escenarios de práctica diversos
- ✅ Retroalimentación inmediata y detallada
- ✅ Registro automático de calificaciones en LMS
- ✅ Interfaz responsive y accesible
- ✅ Seguimiento de progreso en tiempo real
- ✅ Modo offline para desarrollo

## Estructura del Paquete

```
tutor-mo-ia-scorm/
├── imsmanifest.xml          # Manifiesto SCORM principal
├── metadata.xml             # Metadatos del contenido educativo
├── index.html              # Aplicación principal
├── README.md              # Este archivo
├── js/
│   ├── scorm_api.js       # API de comunicación SCORM
│   └── config.js          # Configuración del sistema
└── css/
    └── styles.css         # Estilos de la aplicación
```

## Instalación y Configuración

### Paso 1: Configurar API de OpenAI

1. Abra el archivo `js/config.js`
2. Localice la línea que contiene:
   ```javascript
   apiKey: "INSERTE_AQUI_SU_CLAVE_DE_OPENAI",
   ```
3. Reemplace `"INSERTE_AQUI_SU_CLAVE_DE_OPENAI"` con su clave de API real de OpenAI
4. Guarde el archivo

### Paso 2: Subir a su LMS

1. Comprima todo el contenido de la carpeta `tutor-mo-ia-scorm/` en un archivo ZIP
2. Asegúrese de que `imsmanifest.xml` esté en la raíz del archivo ZIP
3. Suba el archivo ZIP a su LMS compatible con SCORM
4. Configure la actividad según las necesidades de su curso

### Paso 3: Configuración Adicional (Opcional)

Puede personalizar la configuración editando `js/config.js`:

- **Tiempo límite**: Modifique `SCORM_CONFIG.timeLimit` (en segundos)
- **Puntaje de aprobación**: Modifique `SCORM_CONFIG.passingScore` (60% por defecto)
- **Intentos máximos**: Cambie `SCORM_CONFIG.maxAttempts` (3 por defecto)
- **Debug**: Active/desactive `SCORM_CONFIG.debug` para logs detallados

## Uso de la Actividad

### Para Estudiantes

1. **Seleccionar escenario**: Elija uno de los 15+ escenarios disponibles
2. **Leer objetivo**: Revise cuidadosamente el objetivo del escenario
3. **Redactar prompt**: Escriba su prompt en el área de texto
4. **Obtener evaluación**: Haga clic en "Analizar mi prompt"
5. **Revisar retroalimentación**: Examine los comentarios detallados
6. **Ver estructura ideal**: Explore la anatomía de un prompt perfecto
7. **Finalizar actividad**: Complete la actividad cuando esté satisfecho

### Para Instructores

- **Seguimiento**: Monitoree el progreso de los estudiantes a través del LMS
- **Calificaciones**: Las notas se registran automáticamente (escala 1.0-7.0)
- **Analytics**: Revise los datos de tiempo e intentos en el LMS
- **Personalización**: Ajuste criterios de evaluación en el código si es necesario

## Control de Intentos

### 📊 **Sistema de Intentos Limitados**

**Configuración Actual:**
- **Máximo de intentos**: 3 por estudiante
- **Seguimiento automático**: El sistema registra cada análisis como un intento
- **Bloqueo automático**: Al alcanzar 3 intentos, el botón se deshabilita
- **Persistencia**: Los intentos se guardan en SCORM entre sesiones

**Funcionalidades Implementadas:**
- ✅ Contador visual en la barra de progreso: "Intentos: 2/3"
- ✅ Actualización del botón: "Analizar mi prompt (1/3 intentos)"
- ✅ Bloqueo automático al alcanzar el límite
- ✅ Recuperación de intentos previos al recargar
- ✅ Registro en LMS de todos los intentos

**Visualización para el Estudiante:**
```
Barra de progreso: "Progreso: 45% | Intentos: 2/3"
Botón: "Analizar mi prompt (1/3 intentos)"
```

**Al alcanzar el límite:**
```
Botón deshabilitado: "Límite de intentos alcanzado"
```

### 🔧 **Personalización de Intentos**

Para cambiar el número máximo de intentos, edite `js/config.js`:

```javascript
const SCORM_CONFIG = {
    maxAttempts: 3, // Cambiar este número
    // ... resto de configuración
};
```

**Opciones sugeridas:**
- **1 intento**: Evaluación única (examen)
- **3 intentos**: Práctica con retroalimentación (recomendado)
- **5 intentos**: Aprendizaje extensivo
- **-1 o 999**: Intentos ilimitados (no recomendado)

## Sistema de Puntuación Corregido

### 📊 **Cómo Funciona la Calificación**

**Puntuación Interna de la Actividad:**
- Cada escenario tiene 4 criterios
- Cada criterio vale exactamente 10 puntos (cumple) o 0 puntos (no cumple)
- Puntaje máximo por escenario: 40 puntos
- No hay puntos parciales

**Envío a LMS/SCORM (Compatible Universal):**
- Se envía el puntaje bruto: `score.raw = puntaje_obtenido` (0-40)
- Se envía el máximo: `score.max = 40`
- Se envía el mínimo: `score.min = 0`
- Se establece puntaje de maestría: `mastery_score = 60%`
- Estado: "passed" si ≥60%, "failed" si <60%

**Interpretación por LMS:**
- **Moodle**: Calcula (score.raw / score.max) × escala_configurada
- **Blackboard**: Usa score.raw/score.max × 100 como porcentaje
- **Canvas**: Aplica su configuración de escala de calificación
- **Brightspace**: Interpreta según configuración del libro de calificaciones

**Ejemplo Universal:**
```
Puntaje del estudiante: 30/40 puntos
Enviado al LMS: score.raw=30, score.max=40, score.min=0
Porcentaje: (30/40) × 100 = 75%
Estado: "passed" (porque 75% ≥ 60%)
Nota final: Depende de la configuración del LMS
```

### 🔧 **Evaluador de IA Mejorado**

**Cambios Implementados:**
- ✅ Evaluación binaria estricta (10 puntos o 0 puntos por criterio)
- ✅ Instrucciones más específicas y rigurosas
- ✅ Validación automática de consistencia en puntajes
- ✅ Logging detallado para debugging
- ✅ Justificaciones más precisas citando el texto del prompt

**Criterios de Evaluación Estrictos:**
- Un criterio SOLO se cumple si está explícitamente presente
- No hay interpretaciones benevolentes o implícitas
- El estudiante debe demostrar dominio claro del criterio
- Elementos vagos o generales no califican

### 🐛 **Debugging y Verificación**

**Para Verificar Puntuaciones:**
1. Abra la consola del navegador (F12)
2. Active `debug: true` en `js/config.js`
3. Complete una evaluación
4. Revise los logs detallados:

```javascript
=== EVALUACIÓN DETALLADA ===
Escenario: Crear una receta...
Puntaje obtenido: 30 de 40
Porcentaje: 75%
Nota: 5.5
Desglose por criterio:
  1. Lista explícita de ingredientes: ✅ 10/10
  2. Definición de restricciones de tiempo: ✅ 10/10  
  3. Definición de restricciones de dieta: ✅ 10/10
  4. Solicitud de formato de salida claro: ❌ 0/10
===============================
```

**Datos SCORM Enviados:**
```javascript
Datos SCORM enviados: raw=75, max=100, status=passed
```

### ⚠️ **Problemas Comunes y Soluciones**

- **Contextual Prompting**: Proporcionar contexto relevante
- **Role Prompting**: Asignar roles específicos a la IA
- **Zero-shot**: Instrucciones directas y específicas
- **Chain of Thought**: Pensamiento paso a paso
- **Tree of Thoughts**: Exploración de múltiples opciones

## Escenarios Disponibles

1. Crear receta con ingredientes disponibles
2. Redactar correo difícil
3. Crear plan de estudio personalizado
4. Planificar actividad de fin de semana
5. Brainstorming de regalos
6. Explicar tema a un amigo
7. Solicitar ascenso laboral
8. Redactar queja formal
9. Crear post para redes sociales
10. Crear itinerario de viaje
11. Simular conversación difícil
12. Elegir mascota adecuada
13. Definir término financiero
14. Decidir entre carreras
15. Solucionar problema técnico

## Compatibilidad

### LMS Compatibles
- ✅ **Moodle** (todas las versiones con SCORM)
- ✅ **Canvas LMS**
- ✅ **Blackboard Learn**
- ✅ **Brightspace (D2L)**
- ✅ **Schoology**
- ✅ **Google Classroom** (con complementos SCORM)
- ✅ **Cualquier LMS con soporte SCORM 1.2/2004**

### Cómo Funciona en Cada LMS
- **Moodle**: Los puntajes aparecen en Calificaciones con el porcentaje correcto
- **Canvas**: SpeedGrader muestra el puntaje según la configuración de puntos
- **Blackboard**: Grade Center registra automáticamente score.raw/score.max
- **Brightspace**: Grades aplica la escala configurada en la actividad
- **Otros LMS**: Interpretan según sus configuraciones específicas

### Navegadores Soportados
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Requisitos Técnicos
- JavaScript habilitado
- Conexión a internet (para funcionalidad de IA)
- Resolución mínima: 1024x768
- API Key de OpenAI válida

## Google Analytics Integrado

### 📊 **Seguimiento de Métricas Educativas**

**Eventos Rastreados Automáticamente:**
- ✅ **Inicio de sesión**: Cuando un estudiante carga la actividad
- ✅ **Selección de escenario**: Qué escenarios prefieren los estudiantes
- ✅ **Envío de prompts**: Puntajes obtenidos y número de intentos
- ✅ **Finalización de actividad**: Puntaje final y tiempo total

**Datos Capturados:**
```javascript
// Ejemplo de datos enviados a Analytics
{
  event: 'prompt_submitted',
  scenario_id: 'recipe',
  scenario_name: 'Crear una receta...',
  score: 30,
  max_score: 40,
  percentage: 75,
  attempt_number: 2,
  event_category: 'assessment'
}
```

**Beneficios para Instituciones:**
- **Análisis de uso**: Qué escenarios son más populares
- **Métricas de aprendizaje**: Distribución de puntajes y intentos
- **Optimización pedagógica**: Identificar áreas de mejora
- **Reportes automáticos**: Dashboard en Google Analytics

**ID de Google Analytics**: `G-F5DXVF2JX3`

### 🔒 **Privacidad y Datos**

**Datos NO recopilados:**
- ❌ Información personal identificable
- ❌ Contenido específico de los prompts
- ❌ Datos del LMS institucional

**Datos SÍ recopilados:**
- ✅ Métricas de rendimiento académico (anónimas)
- ✅ Patrones de uso de la aplicación
- ✅ Estadísticas de finalización y puntajes
- ✅ Tiempo de interacción con la actividad

**Configuración de Privacidad:**
Para deshabilitar Google Analytics, comente o elimine el código en `index.html`:
```html
<!-- Para deshabilitar, comente estas líneas:
<script async src="https://www.googletagmanager.com/gtag/js?id=G-F5DXVF2JX3"></script>
<script>
  // Código de Analytics aquí
</script>
-->
```

### 🌐 **Compatibilidad Universal LMS**

**Diseñado para funcionar con cualquier LMS:**
- ✅ **Moodle** (todas las versiones)
- ✅ **Canvas LMS**
- ✅ **Blackboard Learn**
- ✅ **Brightspace (D2L)**
- ✅ **Schoology**
- ✅ **Google Classroom** (con complementos SCORM)
- ✅ **Cualquier LMS compatible con SCORM 1.2/2004**

**Campos SCORM Estándar Utilizados:**
- `cmi.core.score.raw` = Puntaje obtenido (0-40)
- `cmi.core.score.max` = Puntaje máximo (40)
- `cmi.core.score.min` = Puntaje mínimo (0)
- `cmi.core.lesson_status` = passed/failed/completed
- `cmi.student_data.mastery_score` = 60% (para aprobar)
- `cmi.suspend_data` = Datos de sesión completos

**Garantías de Compatibilidad:**
- ✅ Porcentajes siempre correctos: (raw/max) × 100
- ✅ Estados de aprobación estándar
- ✅ Múltiples métodos de commit para diferentes LMS
- ✅ Recuperación automática en caso de errores

## Solución de Problemas

### Problema: "API Key no configurada"
**Solución**: Verifique que ha configurado correctamente su clave de OpenAI en `js/config.js`

### Problema: "No se puede conectar a la IA"
**Solución**: 
- Verifique su conexión a internet
- Confirme que su API Key de OpenAI es válida y tiene créditos
- Revise las restricciones de firewall de su institución

### Problema: "Las calificaciones no se registran en el LMS"
**Solución**:
- Verifique que el LMS soporta SCORM correctamente
- Confirme que el paquete fue subido como contenido SCORM
- Revise los logs del navegador (F12) para errores SCORM

### Problema: "La actividad no carga completamente"
**Solución**:
- Limpie la caché del navegador
- Verifique que todos los archivos del paquete estén presentes
- Confirme que el archivo ZIP fue creado correctamente

## Modo de Desarrollo

Para pruebas locales sin LMS:

1. Active el modo debug en `js/config.js`:
   ```javascript
   debug: true
   ```

2. Abra `index.html` directamente en el navegador

3. La aplicación funcionará en modo offline con logging detallado

## Logs y Debugging

Para activar logs detallados:

```javascript
const DEBUG_CONFIG = {
    enabled: true,
    logScormCalls: true,
    logAiRequests: true,
    logUserInteractions: true
};
```

Los logs aparecerán en la consola del navegador (F12 > Console).

## Personalización

### Modificar Escenarios

1. Edite el objeto `scenarios` en `index.html`
2. Añada nuevos escenarios siguiendo la estructura existente:

```javascript
'nuevo_escenario': {
    name: 'Nombre del escenario',
    goal: 'Descripción del objetivo',
    technique: 'Técnica de prompting',
    rubric: [
        { criterion: 'Criterio 1', score: 10 },
        { criterion: 'Criterio 2', score: 10 },
        { criterion: 'Criterio 3', score: 10 },
        { criterion: 'Criterio 4', score: 10 }
    ]
}
```

### Modificar Criterios de Evaluación

Edite la rúbrica de cada escenario en la propiedad `rubric` del objeto `scenarios`.

### Personalizar Interfaz

Modifique `css/styles.css` para cambiar:
- Colores (variables CSS al inicio del archivo)
- Tipografía
- Espaciado
- Responsive design

## Soporte y Documentación

### Recursos Adicionales
- [Documentación SCORM](https://scorm.com/scorm-explained/)
- [API de OpenAI](https://platform.openai.com/docs/)
- [Mejores prácticas para prompts](https://help.openai.com/en/articles/6654000-best-practices-for-prompt-engineering-with-openai-api)

### Contacto

Para soporte técnico o consultas sobre el contenido:

**Contenido académico**: Francisco Sereño | Damaris Reinoso (practicante)  
**Desarrollo**: Google Gemini 2.5 Pro y Claude Sonnet 4 bajo dirección académica

## Licencia y Derechos

Este material educativo ha sido desarrollado por Francisco Sereño y Damaris Reinoso (practicante) con asistencia de Google Gemini 2.5 Pro y Claude Sonnet 4. El código base ha sido generado por IA bajo la dirección y refinamiento de los autores.

**Versión**: 1.0 - Julio 2025  
**Tecnologías**: HTML5, CSS3, JavaScript, OpenAI API, SCORM 2004

---

## Changelog

### Versión 1.0 (Julio 2025)
- ✅ Lanzamiento inicial
- ✅ 15 escenarios de práctica
- ✅ Compatibilidad SCORM 1.2 y 2004
- ✅ Evaluación automática con IA
- ✅ Interfaz responsive
- ✅ Registro de calificaciones en LMS
- ✅ Modo de desarrollo offline
- ✅ Sistema de calificación con 60% de exigencia
- ✅ Control de intentos máximos (3 intentos)
- ✅ Seguimiento de progreso en tiempo real
- ✅ Evaluador estricto con validación automática
- ✅ Integración con Google Analytics para métricas educativas
- ✅ **Persistencia ultra-robusta**: Datos guardados permanentemente en OpenEdX y Moodle
- ✅ **Bloqueo automático**: Interfaz bloqueada una vez finalizada la actividad
- ✅ **Pantalla de resumen**: Muestra puntaje final y estado de aprobación/reprobación
- ✅ **Compatibilidad específica**: Optimizado para OpenEdX xBlock y Moodle SCORM
- ✅ **Desarrollo colaborativo**: Google Gemini 2.5 Pro y Claude Sonnet 4

---

*¡Esperamos que esta actividad mejore significativamente las habilidades de prompting de sus estudiantes!* 🚀