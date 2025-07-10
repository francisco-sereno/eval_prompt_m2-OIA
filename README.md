### `README.md` (versión final y actualizada)

# ¿Qué aprendimos? Práctica de Prompts - Paquete SCORM

## Descripción

Este paquete SCORM contiene una actividad interactiva diseñada para que los estudiantes practiquen y mejoren sus habilidades en la redacción de prompts efectivos para inteligencia artificial. La actividad proporciona retroalimentación automática basada en criterios académicos establecidos y registra las calificaciones en el sistema LMS.

## Características

- ✅ Compatible con SCORM 1.2 y SCORM 2004
- ✅ Evaluación automática con IA (GPT-4o-mini)
- ✅ 15 escenarios de práctica diversos
- ✅ Retroalimentación inmediata y detallada
- ✅ Registro automático de calificaciones en LMS
- ✅ Interfaz responsive y profesional
- ✅ Panel de instrucciones y contador de intentos
- ✅ Envío automático de la calificación en el último intento

## Estructura del Paquete

eval_prompt_m2/
├── imsmanifest.xml
├── metadata.xml
├── index.html
├── README.md
├── LICENSE.md
├── js/
│   ├── scorm\_api.js
│   ├── config.js
│   └── main.js
└── css/
└── styles.css

## Instalación y Configuración

### Paso 1: Configurar API de OpenAI

1.  Abra el archivo `js/config.js`.
2.  Reemplace `"INSERTE_AQUI_SU_CLAVE_DE_OPENAI"` con su clave de API real de OpenAI.

### Paso 2: Subir a su LMS

1.  Comprima todo el contenido de la carpeta del proyecto en un archivo ZIP.
2.  Asegúrese de que `imsmanifest.xml` esté en la raíz del archivo ZIP.
3.  Suba el archivo ZIP a su LMS compatible con SCORM.

### Paso 3: Configuración Adicional (Opcional)

Puede personalizar la configuración editando `js/config.js`:
-   **Puntaje de aprobación**: Modifique `SCORM_CONFIG.passingScore` (60% por defecto).
-   **Intentos máximos**: Cambie `SCORM_CONFIG.maxAttempts` (3 por defecto).

## Uso de la Actividad

1.  **Leer las instrucciones** en el panel superior.
2.  **Seleccionar un escenario** de la lista desplegable.
3.  **Redactar un prompt** en el área de texto para resolver el desafío.
4.  **Hacer clic en "Analizar mi prompt"** para recibir la evaluación. Dispone de 3 intentos en total.
5.  **Revisar la retroalimentación** detallada.
6.  **Finalizar la actividad**: Si aprueba, puede finalizar manualmente. Al usar el último intento, la actividad se finalizará y enviará la nota automáticamente.

## Sistema de Calificación y Persistencia

### 📊 **Cómo Funciona la Calificación**

**Envío a LMS/SCORM (Compatible Universal):**
-   Se envía un **porcentaje de logro normalizado** (`score.raw` de 0 a 100).
-   El `score.max` siempre es 100 y `score.min` es 0.
-   El estado (`cmi.core.lesson_status`) se marca como "completed" al finalizar, lo que sella la calificación.
-   **La nota registrada siempre corresponde al último intento realizado.**

**Ejemplo:**
-   Puntaje interno: 30/40.
-   Porcentaje calculado: 75%.
-   Enviado al LMS: `score.raw = 75`, `score.max = 100`.
-   Esto asegura que todos los LMS interpreten correctamente el 75% de logro.

### 🔧 **Persistencia y Bloqueo**
-   El estado de la actividad, incluyendo los intentos restantes y la última evaluación, se guarda en el LMS en cada interacción.
-   Al recargar la página, la actividad recupera su estado anterior.
-   Una vez que la actividad es finalizada (manualmente o en el último intento), la interfaz se bloquea mostrando un resumen final. Este estado es permanente y no puede ser modificado, garantizando la integridad de la calificación.

## Personalización

### Modificar Escenarios y Rúbricas
-   Edite el objeto `scenarios` en el archivo `js/main.js`.
-   Puede modificar los textos de `name`, `goal` o los `criterion` de cada rúbrica.

### Personalizar Interfaz
-   Modifique `css/styles.css` para cambiar colores, tipografía, etc.
-   Los íconos son de Google Material Symbols y se pueden cambiar en `index.html`.

## Soporte y Licenciamiento

### Soporte
Para soporte técnico o consultas sobre el contenido:
**Autor y director del proyecto**: Francisco Sereño

### Licenciamiento
-   **Contenido:** El contenido textual y pedagógico se distribuye bajo [CC BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).
-   **Código:** El código fuente (HTML, CSS, JS) se distribuye bajo [GPL-3.0](https://www.gnu.org/licenses/gpl-3.0.html).

**Asistencia en desarrollo e IA generativa**: Google Gemini & Claude Sonnet

**Versión**: 2.9 - Julio 2025

---

*¡Esperamos que esta actividad mejore significativamente las habilidades de prompting de sus estudiantes!* 🚀
