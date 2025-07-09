/**
 * Configuración del paquete SCORM - Práctica de Prompts
 * Versión: 1.0
 * Autores: Francisco Sereño | Damaris Reinoso (practicante)
 * Descripción: Configuración para la práctica de prompts utilizando OpenAI y SCORM.
 * Esta configuración incluye parámetros para la API de OpenAI, SCORM, y la aplicación en general.
 * Fecha: Julio 2025
 */

// Configuración de OpenAI
const OPENAI_CONFIG = {
    // IMPORTANTE: Inserte su clave de API de OpenAI aquí
    apiKey: "INSERTE_AQUI_SU_CLAVE_DE_OPENAI", // Cambie esto por su clave real
    model: "gpt-4o-mini",
    apiUrl: "https://api.openai.com/v1/chat/completions"
};

// Configuración SCORM
const SCORM_CONFIG = {
    version: "2004",
    debug: false, // Cambiado a false para producción
    timeLimit: 7200, // 2 horas en segundos
    passingScore: 60, // Porcentaje mínimo para aprobar (60% = nota 4.0 en sistema chileno)
    maxAttempts: 3, // Número máximo de intentos permitidos
    autoCommit: true, // Confirmar datos automáticamente
    commitInterval: 30000, // Intervalo de confirmación automática (30 segundos)
    
    // Configuración específica de puntuación
    scoring: {
        usePercentageScale: true, // Enviar porcentaje (0-100) en lugar de puntaje bruto
        rawScoreMax: 40, // Puntaje máximo de la actividad
        scormScoreMax: 100, // Escala SCORM (siempre 100)
        masterScore: 60 // Puntaje maestro para aprobar (60% = nota 4.0)
    }
};

// Configuración de la aplicación
const APP_CONFIG = {
    title: "¿Qué aprendimos? Práctica de Prompts",
    version: "1.0",
    authors: ["Francisco Sereño", "Damaris Reinoso (practicante)"],
    maxPromptLength: 2000, // Caracteres máximos permitidos en un prompt
    scenarios: {
        totalAvailable: 15,
        requiredForCompletion: 3, // Número mínimo de escenarios que debe completar el estudiante
        maxAttempts: 3, // Máximo de intentos por actividad
        passingPercentage: 60 // 60% de exigencia para aprobar
    },
    scoring: {
        maxScorePerScenario: 40,
        gradeScale: {
            min: 1.0,
            max: 7.0
        }
    }
};

// Textos de la interfaz (para futuras traducciones)
const UI_TEXTS = {
    es: {
        loading: "Cargando...",
        analyzing: "Analizando su propuesta...",
        error: "Error",
        success: "Éxito",
        complete: "Completado",
        notStarted: "No iniciado",
        inProgress: "En progreso",
        passed: "Aprobado",
        failed: "Reprobado",
        noApiKey: "Por favor, configure su clave de API de OpenAI en js/config.js para continuar.",
        emptyPrompt: "Por favor, escriba un prompt antes de solicitar el análisis.",
        activityCompleted: "Actividad completada exitosamente",
        scoreRegistered: "Calificación registrada en el sistema",
        connectionError: "Error de conexión. Verifique su clave de API o intente más tarde.",
        maxAttemptsReached: "Ha alcanzado el límite máximo de intentos para esta actividad",
        attemptsRemaining: "intentos restantes",
        attemptLimitReached: "Límite de intentos alcanzado"
    }
};

// Configuración de logging
const LOGGING_CONFIG = {
    enabled: false, // Deshabilitado para producción
    level: "error", // Solo errores en producción
    logToConsole: false,
    logToScorm: false
};

// Función para obtener texto localizado
function getLocalizedText(key, lang = 'es') {
    return UI_TEXTS[lang] && UI_TEXTS[lang][key] ? UI_TEXTS[lang][key] : key;
}

// Función para validar configuración
function validateConfig() {
    const errors = [];
    
    if (!OPENAI_CONFIG.apiKey || OPENAI_CONFIG.apiKey === "INSERTE_AQUI_SU_CLAVE_DE_OPENAI") {
        errors.push("Clave de API de OpenAI no configurada");
    }
    
    if (SCORM_CONFIG.passingScore < 0 || SCORM_CONFIG.passingScore > 100) {
        errors.push("Puntaje de aprobación debe estar entre 0 y 100");
    }
    
    if (APP_CONFIG.maxPromptLength < 100) {
        errors.push("Longitud máxima del prompt debe ser al menos 100 caracteres");
    }
    
    return {
        isValid: errors.length === 0,
        errors: errors
    };
}

// Configuración de debugging
const DEBUG_CONFIG = {
    enabled: false, // Deshabilitado para producción
    logScormCalls: false,
    logAiRequests: false,
    logUserInteractions: false,
    showPerformanceMetrics: false
};

// Función de utilidad para logging
function logMessage(level, message, data = null) {
    if (!LOGGING_CONFIG.enabled) return;
    
    const timestamp = new Date().toISOString();
    const logEntry = {
        timestamp: timestamp,
        level: level.toUpperCase(),
        message: message,
        data: data
    };
    
    if (LOGGING_CONFIG.logToConsole) {
        const consoleMethod = level === 'error' ? 'error' : 
                             level === 'warn' ? 'warn' : 
                             level === 'debug' ? 'debug' : 'log';
        console[consoleMethod](`[${timestamp}] ${level.toUpperCase()}: ${message}`, data || '');
    }
}

// Función para obtener información del entorno
function getEnvironmentInfo() {
    return {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        cookiesEnabled: navigator.cookieEnabled,
        onlineStatus: navigator.onLine,
        screenResolution: `${screen.width}x${screen.height}`,
        viewport: `${window.innerWidth}x${window.innerHeight}`,
        timestamp: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
}

// Configuración de rendimiento
const PERFORMANCE_CONFIG = {
    enableMetrics: false, // Deshabilitado para producción
    trackInteractions: false,
    trackApiCalls: false,
    trackScormCalls: false,
    maxLogEntries: 100 // Reducido para producción
};

// Exportar configuraciones para uso global
if (typeof window !== 'undefined') {
    window.APP_CONFIG = APP_CONFIG;
    window.SCORM_CONFIG = SCORM_CONFIG;
    window.OPENAI_CONFIG = OPENAI_CONFIG;
    window.UI_TEXTS = UI_TEXTS;
    window.DEBUG_CONFIG = DEBUG_CONFIG;
    window.LOGGING_CONFIG = LOGGING_CONFIG;
    window.PERFORMANCE_CONFIG = PERFORMANCE_CONFIG;
    
    // Funciones de utilidad globales
    window.getLocalizedText = getLocalizedText;
    window.validateConfig = validateConfig;
    window.logMessage = logMessage;
    window.getEnvironmentInfo = getEnvironmentInfo;
    
    // Log inicial del sistema
    logMessage('info', 'Configuración del sistema cargada (Google Gemini 2.5 Pro y Claude Sonnet 4)', {
        config: APP_CONFIG,
        environment: getEnvironmentInfo(),
        validation: validateConfig()
    });
}