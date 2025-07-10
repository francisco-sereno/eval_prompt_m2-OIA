/**
 * SCORM API JavaScript Library (SCORM 1.2 & 2004)
 * Versión: 2.1
 * Autor: Francisco Sereño
 * Descripción: Esta biblioteca proporciona funciones para interactuar con el LMS utilizando SCORM.
 * Fecha: Julio 2025
 */
/**
 * SCORM API JavaScript Library (SCORM 1.2 & 2004)
 * Versión: 2.9
 * Autor: Francisco Sereño
 * Descripción: Biblioteca de comunicación SCORM. Ahora expone la versión detectada.
 * Fecha: Julio 2025
 */
/**
 * SCORM API JavaScript Library (SCORM 1.2 & 2004)
 * Versión: 2.9
 * Autor: Francisco Sereño
 * Descripción: Biblioteca de comunicación SCORM. Ahora expone la versión detectada.
 * Fecha: Julio 2025
 */
(function() {
    'use strict';
    let scormAPI = null, scormVersion = null, isInitialized = false;

    // AHORA EXPONE LA VERSIÓN DE SCORM DETECTADA
    window.SCORM_VERSION_DETECTED = null;

    function findSCORMAPI(win) {
        let attempts = 0;
        while (win.API_1484_11 == null && win.API == null && win.parent && win.parent != win && attempts <= 500) {
            attempts++;
            win = win.parent;
        }
        if (win.API_1484_11) { 
            scormVersion = '2004'; 
            window.SCORM_VERSION_DETECTED = '2004';
            return win.API_1484_11;
        }
        if (win.API) { 
            scormVersion = '1.2'; 
            window.SCORM_VERSION_DETECTED = '1.2';
            return win.API; 
        }
        return null;
    }

    window.initializeSCORM = function() {
        if (isInitialized) return true;
        scormAPI = findSCORMAPI(window);
        if (scormAPI) {
            const initMethod = scormVersion === '2004' ? 'Initialize' : 'LMSInitialize';
            if (scormAPI[initMethod]('') === 'true') {
                isInitialized = true;
                // Para SCORM 2004, se verifica completion_status. Si no, se usa lesson_status.
                let status = getSCORMData(scormVersion === '2004' ? 'cmi.completion_status' : 'cmi.core.lesson_status');
                if (status === 'not attempted') {
                    setSCORMData(scormVersion === '2004' ? 'cmi.completion_status' : 'cmi.core.lesson_status', 'incomplete');
                }
                return true;
            }
        }
        return false;
    };

    window.getSCORMData = function(element) {
        if (!isInitialized || !scormAPI) return '';
        const getMethod = scormVersion === '2004' ? 'GetValue' : 'LMSGetValue';
        return scormAPI[getMethod](element);
    };

    window.setSCORMData = function(element, value) {
        if (!isInitialized || !scormAPI) return false;
        const setMethod = scormVersion === '2004' ? 'SetValue' : 'LMSSetValue';
        return scormAPI[setMethod](element, value.toString()) === 'true';
    };

    window.commitSCORMData = function() {
        if (!isInitialized || !scormAPI) return false;
        const commitMethod = scormVersion === '2004' ? 'Commit' : 'LMSCommit';
        return scormAPI[commitMethod]('') === 'true';
    };

    window.closeSCORM = function() {
        if (!isInitialized || !scormAPI) return false;
        window.setSCORMData('cmi.exit', 'suspend');
        const termMethod = scormVersion === '2004' ? 'Terminate' : 'LMSFinish';
        if (scormAPI[termMethod]('') === 'true') {
            isInitialized = false;
            return true;
        }
        return false;
    };
    
    window.setSuspendData = function(data) {
        return window.setSCORMData('cmi.suspend_data', JSON.stringify(data));
    };

    window.getSuspendData = function() {
        const data = window.getSCORMData('cmi.suspend_data');
        try { return JSON.parse(data); } catch (e) { return {}; }
    };
})();
