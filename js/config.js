/**
 * Configuración del paquete SCORM - Práctica de Prompts
 * Versión: 2.1
 * Autor: Francisco Sereño
 * Descripción: Configuración para la práctica de prompts utilizando OpenAI y SCORM.
 * Fecha: Julio 2025
 */

const OPENAI_CONFIG = {
    // CRÍTICO: Inserte su clave de API de OpenAI aquí.
    apiKey: "XXX",
    model: "gpt-4o-mini",
    apiUrl: "https://api.openai.com/v1/chat/completions"
};

const SCORM_CONFIG = {
    version: "2004",
    debug: false,
    passingScore: 60, // 60% de exigencia para aprobar.
    maxAttempts: 3
};

const UI_TEXTS = {
    es: {
        analyzing: "El evaluador experto está analizando su prompt...",
        connectionError: "No se pudo contactar al evaluador de IA. Verifique su clave de API o la conexión a internet.",
        emptyPrompt: "Por favor, escriba un prompt antes de solicitar el análisis.",
        maxAttemptsReached: "Ha alcanzado el límite máximo de 3 intentos para esta actividad."
    }
};

function getLocalizedText(key, lang = 'es') {
    return UI_TEXTS[lang]?.[key] || key;
}
