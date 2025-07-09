/**
 * SCORM API JavaScript Library
 * Compatible con SCORM 1.2 y SCORM 2004
 * Práctica de Prompts - Módulo 2
 * 
 * Autores: Francisco Sereño | Damaris Reinoso (practicante)
 * Descripción: Esta biblioteca proporciona funciones para interactuar con el LMS utilizando SCORM.
 * Permite inicializar la API, obtener y establecer datos, confirmar cambios, y manejar el estado del SCO.
 * Además, incluye funciones para manejar calificaciones y estados de lección.
 * Configuración para la práctica de prompts utilizando OpenAI y SCORM.
 * Esta configuración incluye parámetros para la API de OpenAI, SCORM, y la aplicación en general.
 * Versión: 1.0 - Julio 2025
 */

(function() {
    'use strict';

    // Variables globales SCORM
    let scormAPI = null;
    let scormVersion = null;
    let isInitialized = false;
    let commitTimer = null;
    let sessionStartTime = new Date();
    let lastCommitTime = new Date();
    
    // Estado interno del SCO
    let scoState = {
        lessonStatus: 'not attempted',
        scoreRaw: '',
        scoreMax: '100',
        scoreMin: '0',
        sessionTime: 'PT0H0M0S',
        lessonLocation: '',
        suspendData: '',
        exit: '',
        entry: 'ab-initio',
        totalTime: 'PT0H0M0S',
        mode: 'normal',
        credit: 'credit'
    };

    /**
     * Busca la API SCORM en la jerarquía de ventanas
     */
    function findSCORMAPI(win) {
        let attempts = 0;
        const maxAttempts = 500;
        
        while (win && attempts < maxAttempts) {
            try {
                // Buscar SCORM 2004 API
                if (win.API_1484_11) {
                    scormVersion = '2004';
                    logMessage('info', 'SCORM 2004 API encontrada');
                    return win.API_1484_11;
                }
                
                // Buscar SCORM 1.2 API
                if (win.API) {
                    scormVersion = '1.2';
                    logMessage('info', 'SCORM 1.2 API encontrada');
                    return win.API;
                }
                
                // Continuar búsqueda en ventana padre
                if (win.parent && win.parent !== win) {
                    win = win.parent;
                } else {
                    break;
                }
            } catch (error) {
                logMessage('error', 'Error buscando SCORM API', error);
                break;
            }
            attempts++;
        }
        
        logMessage('warn', 'SCORM API no encontrada después de ' + attempts + ' intentos');
        return null;
    }

    /**
     * Inicializa la comunicación SCORM
     */
    function initializeSCORM() {
        if (isInitialized) {
            logMessage('warn', 'SCORM ya ha sido inicializado');
            return true;
        }

        // Buscar API SCORM
        scormAPI = findSCORMAPI(window);
        
        if (!scormAPI) {
            logMessage('warn', 'Funcionando en modo offline - no se encontró API SCORM');
            return false;
        }

        try {
            // Determinar método de inicialización según versión
            const initMethod = scormVersion === '2004' ? 'Initialize' : 'LMSInitialize';
            const result = scormAPI[initMethod]('');
            
            if (result === 'true') {
                isInitialized = true;
                loadInitialData();
                setupAutoCommit();
                logMessage('info', `SCORM ${scormVersion} inicializado correctamente`);
                return true;
            } else {
                const errorCode = getLastError();
                const errorMessage = getErrorString(errorCode);
                logMessage('error', `Error al inicializar SCORM: ${errorCode} - ${errorMessage}`);
                return false;
            }
        } catch (error) {
            logMessage('error', 'Excepción al inicializar SCORM', error);
            return false;
        }
    }

    /**
     * Carga datos iniciales del LMS
     */
    function loadInitialData() {
        if (!isInitialized || !scormAPI) return;

        try {
            // Cargar estado de la lección
            scoState.lessonStatus = getSCORMData('cmi.core.lesson_status') || 'not attempted';
            scoState.entry = getSCORMData('cmi.core.entry') || 'ab-initio';
            scoState.lessonLocation = getSCORMData('cmi.core.lesson_location') || '';
            scoState.scoreRaw = getSCORMData('cmi.core.score.raw') || '';
            scoState.scoreMax = getSCORMData('cmi.core.score.max') || '100';
            scoState.scoreMin = getSCORMData('cmi.core.score.min') || '0';
            scoState.totalTime = getSCORMData('cmi.core.total_time') || 'PT0H0M0S';
            scoState.suspendData = getSCORMData('cmi.suspend_data') || '';
            scoState.mode = getSCORMData('cmi.core.mode') || 'normal';
            scoState.credit = getSCORMData('cmi.core.credit') || 'credit';

            // Si es la primera vez, establecer estado inicial
            if (scoState.lessonStatus === 'not attempted') {
                setSCORMData('cmi.core.lesson_status', 'incomplete');
                scoState.lessonStatus = 'incomplete';
            }

            logMessage('info', 'Datos iniciales cargados', scoState);
        } catch (error) {
            logMessage('error', 'Error cargando datos iniciales', error);
        }
    }

    /**
     * Obtiene datos del SCORM LMS
     */
    function getSCORMData(element) {
        if (!isInitialized || !scormAPI) {
            logMessage('warn', `Intento de obtener datos sin inicializar: ${element}`);
            return '';
        }

        try {
            const getMethod = scormVersion === '2004' ? 'GetValue' : 'LMSGetValue';
            const value = scormAPI[getMethod](element);
            
            if (DEBUG_CONFIG && DEBUG_CONFIG.logScormCalls) {
                logMessage('debug', `SCORM GET: ${element} = ${value}`);
            }
            
            return value;
        } catch (error) {
            logMessage('error', `Error obteniendo ${element}`, error);
            return '';
        }
    }

    /**
     * Establece datos en el SCORM LMS
     */
    function setSCORMData(element, value) {
        if (!isInitialized || !scormAPI) {
            logMessage('warn', `Intento de establecer datos sin inicializar: ${element} = ${value}`);
            return false;
        }

        try {
            const setMethod = scormVersion === '2004' ? 'SetValue' : 'LMSSetValue';
            const result = scormAPI[setMethod](element, value.toString());
            
            if (DEBUG_CONFIG && DEBUG_CONFIG.logScormCalls) {
                logMessage('debug', `SCORM SET: ${element} = ${value} (result: ${result})`);
            }
            
            // Actualizar estado interno
            updateInternalState(element, value);
            
            return result === 'true';
        } catch (error) {
            logMessage('error', `Error estableciendo ${element} = ${value}`, error);
            return false;
        }
    }

    /**
     * Actualiza el estado interno del SCO
     */
    function updateInternalState(element, value) {
        switch (element) {
            case 'cmi.core.lesson_status':
                scoState.lessonStatus = value;
                break;
            case 'cmi.core.score.raw':
                scoState.scoreRaw = value;
                break;
            case 'cmi.core.score.max':
                scoState.scoreMax = value;
                break;
            case 'cmi.core.score.min':
                scoState.scoreMin = value;
                break;
            case 'cmi.core.lesson_location':
                scoState.lessonLocation = value;
                break;
            case 'cmi.core.session_time':
                scoState.sessionTime = value;
                break;
            case 'cmi.suspend_data':
                scoState.suspendData = value;
                break;
            case 'cmi.core.exit':
                scoState.exit = value;
                break;
        }
    }

    /**
     * Confirma los datos al LMS
     */
    function commitSCORMData() {
        if (!isInitialized || !scormAPI) {
            logMessage('warn', 'Intento de confirmar datos sin inicializar');
            return false;
        }

        try {
            // Actualizar tiempo de sesión antes de confirmar
            updateSessionTime();
            
            const commitMethod = scormVersion === '2004' ? 'Commit' : 'LMSCommit';
            const result = scormAPI[commitMethod]('');
            
            if (result === 'true') {
                lastCommitTime = new Date();
                logMessage('info', 'Datos confirmados en LMS exitosamente');
                return true;
            } else {
                const errorCode = getLastError();
                const errorMessage = getErrorString(errorCode);
                logMessage('error', `Error al confirmar datos: ${errorCode} - ${errorMessage}`);
                return false;
            }
        } catch (error) {
            logMessage('error', 'Excepción al confirmar datos', error);
            return false;
        }
    }

    /**
     * Actualiza el tiempo de sesión
     */
    function updateSessionTime() {
        const currentTime = new Date();
        const sessionDuration = currentTime - sessionStartTime;
        const sessionTimeISO = convertMillisecondsToISO8601(sessionDuration);
        
        setSCORMData('cmi.core.session_time', sessionTimeISO);
    }

    /**
     * Convierte milisegundos a formato ISO 8601 (PTnHnMnS)
     */
    function convertMillisecondsToISO8601(milliseconds) {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        return `PT${hours}H${minutes}M${seconds}S`;
    }

    /**
     * Obtiene el último código de error
     */
    function getLastError() {
        if (!scormAPI) return '0';
        
        try {
            const errorMethod = scormVersion === '2004' ? 'GetLastError' : 'LMSGetLastError';
            return scormAPI[errorMethod]();
        } catch (error) {
            logMessage('error', 'Error obteniendo último error', error);
            return '999';
        }
    }

    /**
     * Obtiene la descripción del error
     */
    function getErrorString(errorCode) {
        if (!scormAPI) return 'SCORM no disponible';
        
        try {
            const errorStringMethod = scormVersion === '2004' ? 'GetErrorString' : 'LMSGetErrorString';
            return scormAPI[errorStringMethod](errorCode);
        } catch (error) {
            logMessage('error', 'Error obteniendo descripción del error', error);
            return 'Error desconocido';
        }
    }

    /**
     * Obtiene información diagnóstica del error
     */
    function getDiagnostic(errorCode) {
        if (!scormAPI) return '';
        
        try {
            const diagnosticMethod = scormVersion === '2004' ? 'GetDiagnostic' : 'LMSGetDiagnostic';
            return scormAPI[diagnosticMethod](errorCode);
        } catch (error) {
            logMessage('error', 'Error obteniendo diagnóstico', error);
            return '';
        }
    }

    /**
     * Configura confirmación automática
     */
    function setupAutoCommit() {
        if (SCORM_CONFIG && SCORM_CONFIG.autoCommit && SCORM_CONFIG.commitInterval) {
            commitTimer = setInterval(() => {
                if (isInitialized) {
                    commitSCORMData();
                }
            }, SCORM_CONFIG.commitInterval);
            
            logMessage('info', `Auto-commit configurado cada ${SCORM_CONFIG.commitInterval}ms`);
        }
    }

    /**
     * Finaliza la sesión SCORM
     */
    function closeSCORM() {
        if (!isInitialized || !scormAPI) {
            logMessage('warn', 'Intento de cerrar sesión sin inicializar');
            return false;
        }

        try {
            // Detener auto-commit
            if (commitTimer) {
                clearInterval(commitTimer);
                commitTimer = null;
            }

            // Actualizar tiempo final
            updateSessionTime();
            
            // Confirmar datos finales
            commitSCORMData();
            
            // Finalizar sesión
            const finishMethod = scormVersion === '2004' ? 'Terminate' : 'LMSFinish';
            const result = scormAPI[finishMethod]('');
            
            if (result === 'true') {
                isInitialized = false;
                logMessage('info', 'Sesión SCORM finalizada correctamente');
                return true;
            } else {
                const errorCode = getLastError();
                const errorMessage = getErrorString(errorCode);
                logMessage('error', `Error al finalizar sesión: ${errorCode} - ${errorMessage}`);
                return false;
            }
        } catch (error) {
            logMessage('error', 'Excepción al finalizar sesión SCORM', error);
            return false;
        }
    }

    /**
     * Funciones de utilidad para el manejo de calificaciones
     */
    function setScore(raw, max = 100, min = 0) {
        const success = setSCORMData('cmi.core.score.raw', raw.toString()) &&
                       setSCORMData('cmi.core.score.max', max.toString()) &&
                       setSCORMData('cmi.core.score.min', min.toString());
        
        if (success) {
            // Determinar estado basado en puntaje (sistema chileno: 60% = nota 4.0 = aprobado)
            const percentage = (raw / max) * 100;
            const passingScore = SCORM_CONFIG && SCORM_CONFIG.passingScore ? SCORM_CONFIG.passingScore : 60;
            
            if (percentage >= passingScore) {
                setSCORMData('cmi.core.lesson_status', 'passed');
            } else {
                setSCORMData('cmi.core.lesson_status', 'failed');
            }
            
            logMessage('info', `Calificación establecida: ${raw}/${max} (${percentage.toFixed(1)}%)`);
        }
        
        return success;
    }

    function setLessonStatus(status) {
        const validStatuses = ['passed', 'completed', 'failed', 'incomplete', 'browsed', 'not attempted'];
        
        if (validStatuses.includes(status)) {
            return setSCORMData('cmi.core.lesson_status', status);
        } else {
            logMessage('error', `Estado de lección inválido: ${status}`);
            return false;
        }
    }

    function setLessonLocation(location) {
        return setSCORMData('cmi.core.lesson_location', location);
    }

    function setSuspendData(data) {
        // Convertir objeto a JSON si es necesario
        const dataString = typeof data === 'object' ? JSON.stringify(data) : data.toString();
        return setSCORMData('cmi.suspend_data', dataString);
    }

    function getSuspendData() {
        const data = getSCORMData('cmi.suspend_data');
        
        // Intentar parsear como JSON
        try {
            return JSON.parse(data);
        } catch (error) {
            return data;
        }
    }

    /**
     * Función para obtener información del estado actual
     */
    function getScormStatus() {
        return {
            initialized: isInitialized,
            version: scormVersion,
            state: scoState,
            sessionStartTime: sessionStartTime,
            lastCommitTime: lastCommitTime,
            hasAPI: !!scormAPI
        };
    }

    /**
     * Función de utilidad para debugging
     */
    function debugSCORM() {
        if (!DEBUG_CONFIG || !DEBUG_CONFIG.enabled) return;
        
        console.group('SCORM Debug Information');
        console.log('Estado de inicialización:', isInitialized);
        console.log('Versión SCORM:', scormVersion);
        console.log('API disponible:', !!scormAPI);
        console.log('Estado interno:', scoState);
        console.log('Tiempo de sesión:', sessionStartTime);
        console.log('Último commit:', lastCommitTime);
        
        if (scormAPI) {
            console.log('Último error:', getLastError());
            console.log('Descripción del error:', getErrorString(getLastError()));
        }
        console.groupEnd();
    }

    // Exponer funciones públicas al objeto global window
    if (typeof window !== 'undefined') {
        window.initializeSCORM = initializeSCORM;
        window.getSCORMData = getSCORMData;
        window.setSCORMData = setSCORMData;
        window.commitSCORMData = commitSCORMData;
        window.closeSCORM = closeSCORM;
        window.setScore = setScore;
        window.setLessonStatus = setLessonStatus;
        window.setLessonLocation = setLessonLocation;
        window.setSuspendData = setSuspendData;
        window.getSuspendData = getSuspendData;
        window.getScormStatus = getScormStatus;
        window.debugSCORM = debugSCORM;
        window.getLastError = getLastError;
        window.getErrorString = getErrorString;
        window.getDiagnostic = getDiagnostic;
    }

    // Auto-inicialización cuando el DOM esté listo (opcional)
    if (typeof document !== 'undefined') {
        document.addEventListener('DOMContentLoaded', function() {
            logMessage('info', 'SCORM API JavaScript cargado y listo');
        });
    }

})();