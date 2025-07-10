document.addEventListener('DOMContentLoaded', function() {
    let scormInitialized = false;
    let totalAttempts = 0;
    let isActivityCompleted = false;

    // Referencias al DOM (sin cambios)
    const mainTitle = document.getElementById('mainTitle');
    const mainSubtitle = document.getElementById('mainSubtitle');
    const widgetMain = document.getElementById('widgetMain');
    const scenarioSelector = document.getElementById('scenarioSelector');
    const scenarioDescription = document.getElementById('scenarioDescription');
    const studentPromptEl = document.getElementById('studentPrompt');
    const analyzeButton = document.getElementById('analyzeButton');
    const feedbackContainer = document.getElementById('feedbackContainer');
    const showRubricButton = document.getElementById('showRubricButton');
    const completeActivityButton = document.getElementById('completeActivityButton');
    const aiStatusDot = document.getElementById('aiStatusDot');
    const scormStatusDot = document.getElementById('scormStatusDot');
    const infoButton = document.getElementById('infoButton');
    const rubricModal = document.getElementById('rubricModal');
    const infoModal = document.getElementById('infoModal');
    
    // Contenido del modal y escenarios (sin cambios)
    const infoContent = `
        <div class="info-section">
            <h4>Acerca del recurso</h4>
            <p>Esta es una actividad interactiva SCORM 2004 diseñada para la práctica y evaluación de habilidades en la redacción de prompts para Inteligencia Artificial.</p>
        </div>
        <div class="info-section">
            <h4>Licenciamiento</h4>
            <p>El <strong>contenido textual y pedagógico</strong> se distribuye bajo <a href="https://creativecommons.org/licenses/by-nc/4.0/" target="_blank">CC BY-NC 4.0</a>.</p>
            <p>El <strong>código fuente (HTML, CSS, JS)</strong> se distribuye bajo <a href="https://www.gnu.org/licenses/gpl-3.0.html" target="_blank">GPL-3.0</a>.</p>
        </div>
        <div class="info-section">
            <h4>Acerca del sistema</h4>
            <p>Sistema inteligente de práctica y evaluación de prompts, diseñado para el desarrollo de competencias en el uso de IA generativa.</p>
            <ul class="credits-list">
                <li><strong>Tecnología de IA:</strong> GPT-4o-mini (OpenAI)</li>
                <li><strong>Especialización:</strong> Evaluación de lenguaje natural y seguimiento de instrucciones complejas.</li>
                <li><strong>Interfaz:</strong> HTML5, CSS3, y JavaScript moderno.</li>
            </ul>
        </div>
        <div class="info-section">
            <h4>Construcción con IA</h4>
            <p>El diseño inicial fue asistido por Claude AI (Anthropic). Posteriormente, el código fue depurado, optimizado y refactorizado por Gemini (Google), quien implementó la lógica de botones dinámicos, corrigió errores de ejecución y refinó la interfaz.</p>
        </div>
        <div class="info-section author-info">
            <h4>Desarrollo y autoría</h4>
            <p>
                <strong>Francisco Sereño</strong><br>
                Profesor, Universidad de Chile<br>
                Doctor(c) en Educación, Universitat de Barcelona<br>
                Especialista en Tecnología Educativa e IA
            </p>
        </div>
    `;
    const scenarios = { 'recipe': { name: 'Crear una receta con ingredientes', goal: 'Necesita una idea para la cena, pero solo dispone de pollo, arroz, tomates y cebolla. El plato debe prepararse en menos de 45 minutos y ser una opción saludable.', rubric: [{ criterion: 'Lista explícita de ingredientes' }, { criterion: 'Restricciones de tiempo' }, { criterion: 'Restricciones de dieta' }, { criterion: 'Solicitud de formato de salida claro' }] },'email': { name: 'Redactar un correo difícil', goal: 'Debe contactar a su arrendador por una filtración de agua que no ha sido reparada. Necesita un borrador de correo que sea formal, pero que también demuestre firmeza y urgencia.', rubric: [{ criterion: 'Asignación de un tono o rol' }, { criterion: 'Inclusión del contexto del problema' }, { criterion: 'Establecimiento de un objetivo claro' }, { criterion: 'Petición de una acción o plazo' }] }, 'study-plan': { name: 'Crear un plan de estudio', goal: 'Quiere aprender a tocar guitarra desde cero y dispone de 4 horas semanales. Su meta es ser capaz de tocar una canción simple dentro de 3 meses.', rubric: [{ criterion: 'Contexto temporal y de dedicación' }, { criterion: 'Meta de aprendizaje medible' }, { criterion: 'Nivel de habilidad inicial' }, { criterion: 'Solicitud de una estructura de plan' }] }, 'conflict-resolution': { name: 'Resolver un conflicto de fin de semana', goal: 'Usted y otra persona no se deciden sobre un plan para el fin de semana: uno prefiere la playa y el otro, la montaña. Necesita 3 ideas que puedan satisfacer a ambos.', rubric: [{ criterion: 'Planteamiento claro del dilema' }, { criterion: 'Solicitud de un número de alternativas' }, { criterion: 'Definición de criterios de evaluación' }, { criterion: 'Consideración de ambas preferencias' }] }, 'summary': { name: 'Resumir un texto largo', goal: 'Tiene un artículo de 2000 palabras sobre el cambio climático y necesita explicar sus puntos principales a estudiantes de secundaria en un formato breve (máximo 150 palabras).', rubric: [{ criterion: 'Definición del texto de origen' }, { criterion: 'Especificación de la longitud del resumen' }, { criterion: 'Definición de la audiencia objetivo' }, { criterion: 'Solicitud de un enfoque temático' }] }, 'code-generation': { name: 'Generar código simple', goal: 'Necesita una pequeña pieza de código en Python. La función debe tomar una lista de números y devolver como resultado solo aquellos que son pares.', rubric: [{ criterion: 'Especificación del lenguaje de programación' }, { criterion: 'Descripción clara de la función' }, { criterion: 'Definición de los parámetros de entrada' }, { criterion: 'Definición del valor de retorno' }] }, 'translation': { name: 'Traducir con contexto', goal: 'Se encontró con la expresión en inglés "it\'s raining cats and dogs" y quiere entenderla. Necesita una traducción que capture el significado real y no sea literal.', rubric: [{ criterion: 'Texto a traducir' }, { criterion: 'Especificación de no literalidad' }, { criterion: 'Solicitud de una explicación cultural' }, { criterion: 'Petición de una equivalencia idiomática' }] }, 'brainstorming': { name: 'Lluvia de ideas para un negocio', goal: 'Está por abrir una cafetería enfocada en café de especialidad y productos orgánicos. Necesita 5 propuestas de nombres creativos para la marca.', rubric: [{ criterion: 'Descripción del negocio' }, { criterion: 'Solicitud de un número de ideas' }, { criterion: 'Especificación del tono o estilo' }, { criterion: 'Mención de atributos clave a reflejar' }] }, 'comparison': { name: 'Comparar dos productos', goal: 'Debe decidir entre un iPhone 15 Pro y un Samsung Galaxy S24 Ultra. Para ello, necesita una tabla comparativa que evalúe cámara, batería, precio y una característica única.', rubric: [{ criterion: 'Productos a comparar' }, { criterion: 'Solicitud de formato de tabla' }, { criterion: 'Definición de criterios de comparación' }, { criterion: 'Inclusión de un diferenciador clave' }] }, 'role-play': { name: 'Simular una entrevista de trabajo', goal: 'Se está preparando para una entrevista para el puesto de "Jefe de Proyecto Digital". Para practicar, necesita que la IA asuma el rol de entrevistador y le haga 3 preguntas desafiantes.', rubric: [{ criterion: 'Asignación de un rol a la IA' }, { criterion: 'Definición del contexto (puesto)' }, { criterion: 'Solicitud de un número de preguntas' }, { criterion: 'Especificación del tipo de preguntas (desafiantes)' }] }, 'explain-complex': { name: 'Explicar un tema complejo a un niño', goal: 'Tiene que explicarle a un niño de 8 años qué es un agujero negro. Necesita una analogía simple, que no utilice jerga científica.', rubric: [{ criterion: 'Tema a explicar' }, { criterion: 'Definición del público (niño de 8 años)' }, { criterion: 'Solicitud de una analogía' }, { criterion: 'Restricción de no usar jerga' }] }, 'marketing-slogan': { name: 'Crear un eslogan publicitario', goal: 'Una nueva marca de zapatillas de correr, hechas con materiales reciclados, necesita 3 eslóganes cortos y memorables para su lanzamiento.', rubric: [{ criterion: 'Descripción del producto' }, { criterion: 'Mención del diferenciador (reciclado)' }, { criterion: 'Solicitud de un número de opciones' }, { criterion: 'Definición del estilo (corto y memorable)' }] }, 'travel-itinerary': { name: 'Planificar un itinerario de viaje', goal: 'Está planeando un primer viaje de 3 días a Cusco, Perú. Su foco es la cultura e historia y cuenta con un presupuesto moderado. Necesita un posible itinerario.', rubric: [{ criterion: 'Definición del destino y duración' }, { criterion: 'Enfoque temático (cultura/historia)' }, { criterion: 'Restricción de presupuesto' }, { criterion: 'Solicitud de una estructura diaria' }] }, 'data-analysis': { name: 'Interpretar datos', goal: 'Posee los siguientes datos de ventas trimestrales: {Enero: 100, Febrero: 120, Marzo: 90}. Necesita una breve descripción de la tendencia, el promedio de ventas y una posible causa para la baja en marzo.', rubric: [{ criterion: 'Provisión de datos explícitos' }, { criterion: 'Solicitud de análisis de tendencia' }, { criterion: 'Petición de un cálculo específico' }, { criterion: 'Solicitud de una hipótesis' }] }, 'content-creation': { name: 'Crear un guion para redes sociales', goal: 'Necesita crear un video corto (30 segundos) y entretenido para TikTok que explique cómo usar una nueva aplicación de gestión de tareas.', rubric: [{ criterion: 'Definición de la plataforma (TikTok)' }, { criterion: 'Restricción de tiempo (30s)' }, { criterion: 'Tema del video (app de tareas)' }, { criterion: 'Definición del tono (entretenido)' }] }};

    function updateStatusDot(dotElement, status) { if (dotElement) dotElement.className = `status-dot ${status}`; }
    function checkConnections() { scormInitialized = window.initializeSCORM && window.initializeSCORM(); updateStatusDot(scormStatusDot, scormInitialized ? 'connected' : 'disconnected'); const hasApiKey = typeof OPENAI_CONFIG !== 'undefined' && OPENAI_CONFIG.apiKey && OPENAI_CONFIG.apiKey !== "INSERTE_AQUI_SU_CLAVE_DE_OPENAI"; updateStatusDot(aiStatusDot, hasApiKey ? 'connected' : 'disconnected'); }
    function populateScenarios() { for (const key in scenarios) { const option = document.createElement('option'); option.value = key; option.textContent = scenarios[key].name; scenarioSelector.appendChild(option); } updateDescription(); }
    function updateDescription() { const scenario = scenarios[scenarioSelector.value]; if (scenario) scenarioDescription.textContent = scenario.goal; }
    function setLoading(isLoading) { analyzeButton.disabled = isLoading; if (isLoading) { feedbackContainer.innerHTML = `<div class="feedback-placeholder"><div class="loading-icon-container"><div class="typing-indicator"><span></span><span></span><span></span></div><p class="loading-text">La IA está escribiendo su retroalimentación...</p></div></div>`; } }
    function updateAttemptsDisplay() { const remainingAttempts = SCORM_CONFIG.maxAttempts - totalAttempts; analyzeButton.disabled = remainingAttempts <= 0; if (remainingAttempts <= 0) { analyzeButton.textContent = 'No quedan intentos'; } else { analyzeButton.textContent = `Analizar mi prompt (${remainingAttempts} ${remainingAttempts > 1 ? 'intentos restantes' : 'intento restante'})`; } }
    function validateAndCorrectEvaluation(evaluation, scenario) { let score = 0; if (evaluation && Array.isArray(evaluation.feedback)) { evaluation.feedback.forEach(item => { if (item.fulfilled === true) score += 10; }); } const maxScore = scenario.rubric.length * 10; const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0; return { feedback: evaluation.feedback, score: score, maxScore: maxScore, percentage: percentage, isPassed: percentage >= SCORM_CONFIG.passingScore, scenarioKey: scenarioSelector.value, grade: calculateGrade(percentage) }; }
    function calculateGrade(percentage) { const p = percentage / 100; const passingP = SCORM_CONFIG.passingScore / 100; let grade = 1.0; if (p >= passingP) { grade = 4.0 + 3.0 * ((p - passingP) / (1 - passingP)); } else { if (passingP > 0) grade = 1.0 + 2.9 * (p / passingP); } return Math.min(7.0, grade).toFixed(1); }
    function renderFeedback(evaluation) { let feedbackHtml = `<div class="score-display">Puntaje: ${evaluation.score}/${evaluation.maxScore} (${evaluation.percentage}%) &nbsp;&nbsp;&nbsp; Nota: ${evaluation.grade}</div><ul class="feedback-list">`; evaluation.feedback.forEach(item => { const type = item.fulfilled ? 'acierto' : 'mejora'; feedbackHtml += `<li class="feedback-item ${type}"><strong>${item.criterion}</strong><span>${item.justification}</span></li>`; }); feedbackHtml += `</ul>`; feedbackContainer.innerHTML = feedbackHtml; }
    
    // --- LÓGICA DE CALIFICACIÓN UNIFICADA POR PORCENTAJE ---
    function saveStateToLMS(evaluationData) {
        if (!scormInitialized) {
            console.log("Modo desarrollo - Estado guardado:", evaluationData);
            if (evaluationData.isPassed) completeActivityButton.style.display = 'block';
            return;
        }

        const percentage = evaluationData.percentage.toString();
        const scaledScore = (evaluationData.percentage / 100).toFixed(2);

        if (window.SCORM_VERSION_DETECTED === '2004') {
            // Para SCORM 2004, enviar el porcentaje en todos los formatos compatibles para máxima robustez.
            setSCORMData('cmi.score.scaled', scaledScore); // Formato preferido (0.00-1.00)
            setSCORMData('cmi.score.raw', percentage);      // Formato bruto como %
            setSCORMData('cmi.score.max', '100');           // Escala del bruto
            setSCORMData('cmi.score.min', '0');
            if (!isActivityCompleted) {
                setSCORMData('cmi.success_status', evaluationData.isPassed ? 'passed' : 'failed');
                setSCORMData('cmi.completion_status', 'incomplete');
            }
        } else {
            // Para SCORM 1.2, enviar el porcentaje en el campo raw.
            setSCORMData('cmi.core.score.raw', percentage);
            setSCORMData('cmi.core.score.max', '100');
            setSCORMData('cmi.core.score.min', '0');
            if (!isActivityCompleted) {
                setSCORMData('cmi.core.lesson_status', evaluationData.isPassed ? 'passed' : 'incomplete');
            }
        }

        // El resto de la función para guardar el estado no cambia.
        const suspendData = { rawScore: evaluationData.score, maxScore: evaluationData.maxScore, percentage: evaluationData.percentage, grade: evaluationData.grade, attempts: totalAttempts, isPassed: evaluationData.isPassed, isCompleted: false, lastEvaluation: evaluationData };
        setSuspendData(suspendData);
        commitSCORMData();
        if (evaluationData.isPassed) completeActivityButton.style.display = 'block';
    }

    async function handleAnalysis() { if (totalAttempts >= SCORM_CONFIG.maxAttempts) return; const studentPromptText = studentPromptEl.value.trim(); if (!studentPromptText) return alert("Por favor, redacte un prompt antes de analizar."); setLoading(true); updateStatusDot(aiStatusDot, 'connecting'); totalAttempts++; const scenario = scenarios[scenarioSelector.value]; const metaPrompt = `Eres un evaluador académico. Evalúa el prompt de un estudiante para el escenario: "${scenario.goal}". La rúbrica es (10 puntos por criterio cumplido explícitamente, 0 si no): ${JSON.stringify(scenario.rubric.map(r => r.criterion))}. El prompt del estudiante es: "${studentPromptText}". Responde solo con un JSON válido con la estructura: {"feedback": [{"criterion": "string", "fulfilled": boolean, "justification": "string"}]}. IMPORTANTE: Para cada "justification", escribe el texto usando mayúscula solo al inicio de la frase (sentence case), a menos que se trate de un nombre propio.`; try { const response = await fetch(OPENAI_CONFIG.apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_CONFIG.apiKey}` }, body: JSON.stringify({ model: OPENAI_CONFIG.model, messages: [{ role: "user", content: metaPrompt }], response_format: { type: "json_object" }}) }); if (!response.ok) throw new Error(`Error de la API: ${response.statusText}`); const aiResponse = await response.json(); const content = JSON.parse(aiResponse.choices[0].message.content); updateStatusDot(aiStatusDot, 'connected'); const validatedFeedback = validateAndCorrectEvaluation(content, scenario); renderFeedback(validatedFeedback); saveStateToLMS(validatedFeedback); if (totalAttempts >= SCORM_CONFIG.maxAttempts) { alert("Ha utilizado su último intento. La actividad se finalizará y su calificación será enviada."); completeActivity(); } } catch (error) { console.error("Error en análisis:", error); updateStatusDot(aiStatusDot, 'disconnected'); feedbackContainer.innerHTML = `<div class="feedback-item mejora"><strong>Error de conexión.</strong><span>No se pudo comunicar con el evaluador. Verifique su clave de API e inténtelo de nuevo.</span></div>`; } finally { setLoading(false); updateAttemptsDisplay(); } }
    function completeActivity() { if (isActivityCompleted) return; isActivityCompleted = true; const lastEvalData = getSuspendData(); if (!lastEvalData || !lastEvalData.lastEvaluation) return alert("No hay una evaluación válida para finalizar."); const finalData = { ...lastEvalData, isCompleted: true, completionTime: new Date().toISOString() }; if (scormInitialized) { if(window.SCORM_VERSION_DETECTED === '2004') { setSCORMData('cmi.success_status', finalData.isPassed ? 'passed' : 'failed'); setSCORMData('cmi.completion_status', 'completed'); } else { setSCORMData('cmi.core.lesson_status', finalData.isPassed ? 'passed' : 'failed'); } setSCORMData('cmi.exit', 'normal'); setSuspendData(finalData); commitSCORMData(); setTimeout(() => commitSCORMData(), 500); } showCompletionScreen(finalData); }
    function showCompletionScreen(data) { isActivityCompleted = true; mainTitle.textContent = "Actividad finalizada"; mainSubtitle.textContent = "Su calificación ha sido registrada en la pestaña 'progreso' de la plataforma."; const passIcon = `<span class="material-symbols-outlined completion-icon passed">verified</span>`; const failIcon = `<span class="material-symbols-outlined completion-icon failed">cancel</span>`; widgetMain.style.display = 'block'; widgetMain.innerHTML = `<div class="completion-summary-wrapper"><div class="completion-summary">${data.isPassed ? passIcon : failIcon}<h2>Resumen de calificación</h2><div class="final-score-grid"><div>Puntaje obtenido</div><div>${data.rawScore} / ${data.maxScore}</div><div>Porcentaje de logro</div><div>${data.percentage}%</div><div>Nota (escala 1.0 a 7.0)</div><div>${data.grade}</div></div><div class="final-status ${data.isPassed ? 'passed' : 'failed'}">${data.isPassed ? 'Logrado' : 'No logrado'}</div><p class="final-message">Puede cerrar esta ventana de forma segura.</p></div></div>`; }
    function loadPreviousData() { if (!scormInitialized) return; const data = getSuspendData(); if (data && data.isCompleted === true) { showCompletionScreen(data); } else if (data) { totalAttempts = data.attempts || 0; if (data.scenarioKey) scenarioSelector.value = data.scenarioKey; updateDescription(); if(data.lastEvaluation) renderFeedback(data.lastEvaluation); if (data.isPassed) completeActivityButton.style.display = 'block'; } updateAttemptsDisplay(); }
    function displayRubric() { const scenario = scenarios[scenarioSelector.value]; const rubricModalBody = document.getElementById('rubricModalBody'); document.getElementById('rubricModalTitle').textContent = `Pauta de evaluación: ${scenario.name}`; let tableHtml = `<table class="pcw-rubric-table"><thead><tr><th>Criterio de evaluación</th><th>Puntaje</th></tr></thead><tbody>`; scenario.rubric.forEach(item => { tableHtml += `<tr><td>${item.criterion}</td><td>10</td></tr>`; }); tableHtml += `</tbody></table>`; rubricModalBody.innerHTML = tableHtml; rubricModal.style.display = 'block'; }
    function showInfoModal(title, content) { document.getElementById('infoModalTitle').textContent = title; document.getElementById('infoModalBody').innerHTML = content; infoModal.style.display = 'block'; }
    function initializeApp(){ checkConnections(); populateScenarios(); if (scormInitialized) { loadPreviousData(); } else { updateAttemptsDisplay(); } }

    analyzeButton.addEventListener('click', handleAnalysis);
    scenarioSelector.addEventListener('change', updateDescription);
    showRubricButton.addEventListener('click', displayRubric);
    completeActivityButton.addEventListener('click', completeActivity);
    infoButton.addEventListener('click', () => showInfoModal('Información y créditos', infoContent));
    document.querySelectorAll('.modal-close').forEach(btn => { btn.addEventListener('click', (e) => { const modalId = e.target.getAttribute('data-modal-id'); if(modalId) document.getElementById(modalId).style.display = 'none'; }); });
    window.addEventListener('click', (event) => { if (event.target.classList.contains('modal')) { event.target.style.display = 'none'; } });
    window.addEventListener('beforeunload', () => { if (scormInitialized && !isActivityCompleted) { closeSCORM(); } });

    initializeApp();
});
