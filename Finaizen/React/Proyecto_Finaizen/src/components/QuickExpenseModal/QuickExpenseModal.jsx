import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/apiService';
import { extractTextFromImage, parseReceiptText } from '../../services/ocrService';
import { VoiceRecognition, isSpeechRecognitionSupported, parseVoiceExpense } from '../../services/speechService';
import styles from './QuickExpenseModal.module.css';

/**
 * Modal para registro rápido de gastos
 * Soporta: Foto de recibo, Nota de voz, Entrada manual
 */
function QuickExpenseModal({ isOpen, onClose }) {
  const { currentPerfil } = useAuth();
  const navigate = useNavigate();
  
  // Estados
  const [mode, setMode] = useState('menu'); // 'menu', 'camera', 'voice', 'manual', 'confirm'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Datos del gasto
  const [expenseData, setExpenseData] = useState({
    monto: '',
    descripcion: '',
    categoria: 'otros',
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toTimeString().slice(0, 5)
  });

  // Estados específicos
  const [imagePreview, setImagePreview] = useState(null);
  const [extractedText, setExtractedText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  
  const fileInputRef = useRef(null);
  const voiceRecognitionRef = useRef(null);

  // Categorías disponibles
  const categorias = [
    { value: 'alimentacion', label: '🍔 Alimentación' },
    { value: 'transporte', label: '🚗 Transporte' },
    { value: 'entretenimiento', label: '🎮 Entretenimiento' },
    { value: 'salud', label: '💊 Salud' },
    { value: 'educacion', label: '📚 Educación' },
    { value: 'servicios', label: '💡 Servicios' },
    { value: 'ropa', label: '👕 Ropa' },
    { value: 'hogar', label: '🏠 Hogar' },
    { value: 'otros', label: '📦 Otros' }
  ];

  useEffect(() => {
    if (!isOpen) {
      resetModal();
    }
  }, [isOpen]);

  const resetModal = () => {
    setMode('menu');
    setLoading(false);
    setError('');
    setSuccess(false);
    setImagePreview(null);
    setExtractedText('');
    setIsRecording(false);
    setVoiceTranscript('');
    setExpenseData({
      monto: '',
      descripcion: '',
      categoria: 'otros',
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toTimeString().slice(0, 5)
    });
  };

  // ========== MANEJO DE FOTO/RECIBO ==========
  const handleImageCapture = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');

    try {
      // Crear preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);

      // Extraer texto del recibo
      const text = await extractTextFromImage(file);
      setExtractedText(text);

      // Parsear información
      const parsed = parseReceiptText(text);
      
      // Determinar tipo de transacción
      const esIngreso = parsed.tipo === 'ingreso';
      
      // Preparar datos para enviar
      const ocrData = {
        monto: parsed.monto,
        descripcion: parsed.descripcion,
        categoria: esIngreso ? 'salario' : 'alimentacion',
        fecha: parsed.fecha.toISOString().split('T')[0],
        hora: parsed.hora || new Date().toTimeString().slice(0, 5)
      };

      // Redirigir a la página correspondiente con los datos
      const targetPath = esIngreso ? '/user/nuevo-ingreso' : '/user/nuevo-egreso';
      const ocrParam = encodeURIComponent(JSON.stringify(ocrData));
      navigate(`${targetPath}?ocr=${ocrParam}`);
      
      // Cerrar modal
      onClose();
    } catch (err) {
      console.error('Error procesando imagen:', err);
      setError('No se pudo procesar la imagen. Intenta nuevamente o ingresa manualmente.');
    } finally {
      setLoading(false);
    }
  };

  // ========== MANEJO DE VOZ ==========
  const startVoiceRecording = () => {
    if (!isSpeechRecognitionSupported()) {
      setError('Tu navegador no soporta reconocimiento de voz');
      return;
    }

    try {
      const recognition = new VoiceRecognition();
      voiceRecognitionRef.current = recognition;

      recognition.onResult = ({ final, interim }) => {
        setVoiceTranscript(final || interim);
      };

      recognition.onError = (errorMsg) => {
        setError(`Error: ${errorMsg}`);
        setIsRecording(false);
      };

      recognition.onEnd = (finalText) => {
        setIsRecording(false);
        if (finalText) {
          processVoiceTranscript(finalText);
        }
      };

      recognition.start();
      setIsRecording(true);
      setError('');
    } catch (err) {
      console.error('Error iniciando grabación:', err);
      setError('No se pudo iniciar la grabación');
    }
  };

  const stopVoiceRecording = () => {
    if (voiceRecognitionRef.current) {
      voiceRecognitionRef.current.stop();
    }
  };

  const processVoiceTranscript = (text) => {
    const parsed = parseVoiceExpense(text);
    
    // Preparar datos para enviar
    const ocrData = {
      monto: parsed.monto || 0,
      descripcion: parsed.descripcion || text,
      categoria: parsed.categoria || 'otros',
      fecha: new Date().toISOString().split('T')[0],
      hora: new Date().toTimeString().slice(0, 5)
    };

    // Siempre es egreso para notas de voz
    const ocrParam = encodeURIComponent(JSON.stringify(ocrData));
    navigate(`/user/nuevo-egreso?ocr=${ocrParam}`);
    
    // Cerrar modal
    onClose();
  };

  // ========== MANEJO DE GUARDADO ==========
  const handleSaveExpense = async () => {
    if (!currentPerfil) {
      setError('No hay perfil seleccionado');
      return;
    }

    if (!expenseData.monto || parseFloat(expenseData.monto) <= 0) {
      setError('El monto debe ser mayor a 0');
      return;
    }

    if (!expenseData.descripcion.trim()) {
      setError('La descripción es requerida');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Determinar si es ingreso o egreso
      const tipoTransaccion = expenseData.tipo || 'egreso';
      const esIngreso = tipoTransaccion === 'ingreso';

      const [year, month, day] = expenseData.fecha.split('-').map(Number);
      const fechaEjecucion = new Date(year, month - 1, day);

      const registroHistorial = {
        tipo: tipoTransaccion, // 'ingreso' o 'egreso'
        monto: parseFloat(expenseData.monto),
        descripcion: expenseData.descripcion,
        categoria: expenseData.categoria,
        transaccionOrigenId: null,
        esOcasional: true,
        fechaEjecucion: fechaEjecucion.toISOString(),
        mes: fechaEjecucion.getMonth() + 1,
        anio: fechaEjecucion.getFullYear(),
        metadata: {
          source: mode, // 'camera', 'voice', 'manual'
          extractedText: extractedText || undefined,
          voiceTranscript: voiceTranscript || undefined,
          confianzaOCR: expenseData.confianza || undefined
        }
      };

      await apiService.historial.create(currentPerfil.id, registroHistorial);

      console.log(`✅ ${esIngreso ? 'Ingreso' : 'Gasto'} rápido registrado:`, registroHistorial);

      setSuccess(true);
      
      setTimeout(() => {
        onClose();
        // Opcional: recargar página o actualizar estado
        window.location.reload();
      }, 1500);

    } catch (err) {
      console.error('Error guardando transacción:', err);
      setError('No se pudo guardar la transacción. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2>
            {mode === 'menu' && '⚡ Registro Rápido'}
            {mode === 'camera' && '📷 Escanear Recibo'}
            {mode === 'voice' && '🎤 Nota de Voz'}
            {mode === 'manual' && '✏️ Entrada Manual'}
            {mode === 'confirm' && (expenseData.tipo === 'ingreso' ? '✅ Confirmar Ingreso' : '✅ Confirmar Gasto')}
          </h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Content */}
        <div className={styles.modalBody}>
          
          {/* MENÚ PRINCIPAL */}
          {mode === 'menu' && (
            <div className={styles.menu}>
              <button
                className={`${styles.menuOption} ${styles.camera}`}
                onClick={() => setMode('camera')}
              >
                <span className={styles.menuIcon}>📷</span>
                <div>
                  <h3>Escanear Recibo</h3>
                  <p>Toma una foto y extrae la información automáticamente</p>
                </div>
              </button>

              <button
                className={`${styles.menuOption} ${styles.voice}`}
                onClick={() => setMode('voice')}
              >
                <span className={styles.menuIcon}>🎤</span>
                <div>
                  <h3>Nota de Voz</h3>
                  <p>Di tu gasto y lo registramos por ti</p>
                </div>
              </button>

              <button
                className={`${styles.menuOption} ${styles.manual}`}
                onClick={() => {
                  navigate('/user/nuevo-egreso');
                  onClose();
                }}
              >
                <span className={styles.menuIcon}>✏️</span>
                <div>
                  <h3>Entrada Manual</h3>
                  <p>Escribe los detalles del gasto</p>
                </div>
              </button>
            </div>
          )}

          {/* MODO CÁMARA */}
          {mode === 'camera' && (
            <div className={styles.cameraMode}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImageCapture}
                style={{ display: 'none' }}
              />

              {!imagePreview ? (
                <button
                  className={styles.captureBtn}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loading}
                >
                  {loading ? '⏳ Procesando...' : '📸 Tomar/Seleccionar Foto'}
                </button>
              ) : (
                <div className={styles.imagePreview}>
                  <img src={imagePreview} alt="Preview" />
                  <button
                    className={styles.retakeBtn}
                    onClick={() => {
                      setImagePreview(null);
                      setExtractedText('');
                      fileInputRef.current?.click();
                    }}
                  >
                    🔄 Tomar otra foto
                  </button>
                </div>
              )}

              {extractedText && (
                <div className={styles.extractedText}>
                  <strong>Texto extraído:</strong>
                  <p>{extractedText}</p>
                </div>
              )}
            </div>
          )}

          {/* MODO VOZ */}
          {mode === 'voice' && (
            <div className={styles.voiceMode}>
              <div className={`${styles.recordingIndicator} ${isRecording ? styles.recording : ''}`}>
                <span className={styles.micIcon}>🎤</span>
                {isRecording && <span className={styles.pulse}></span>}
              </div>

              <p className={styles.voiceInstructions}>
                {isRecording 
                  ? 'Escuchando... Di tu gasto' 
                  : 'Presiona el botón y describe tu gasto'}
              </p>

              {voiceTranscript && (
                <div className={styles.transcript}>
                  <strong>Transcripción:</strong>
                  <p>{voiceTranscript}</p>
                </div>
              )}

              <button
                className={`${styles.recordBtn} ${isRecording ? styles.recording : ''}`}
                onClick={isRecording ? stopVoiceRecording : startVoiceRecording}
              >
                {isRecording ? '⏹️ Detener' : '🎤 Iniciar Grabación'}
              </button>
            </div>
          )}

          {/* MODO MANUAL */}
          {mode === 'manual' && (
            <div className={styles.manualMode}>
              <div className={styles.formGroup}>
                <label>Monto</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={expenseData.monto}
                  onChange={(e) => setExpenseData({ ...expenseData, monto: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Descripción</label>
                <input
                  type="text"
                  placeholder="¿En qué gastaste?"
                  value={expenseData.descripcion}
                  onChange={(e) => setExpenseData({ ...expenseData, descripcion: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Categoría</label>
                <select
                  value={expenseData.categoria}
                  onChange={(e) => setExpenseData({ ...expenseData, categoria: e.target.value })}
                >
                  {categorias.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <button
                className={styles.nextBtn}
                onClick={() => setMode('confirm')}
                disabled={!expenseData.monto || !expenseData.descripcion}
              >
                Continuar →
              </button>
            </div>
          )}

          {/* MODO CONFIRMACIÓN */}
          {mode === 'confirm' && (
            <div className={styles.confirmMode}>
              <div className={styles.expenseSummary}>
                <div className={styles.summaryRow}>
                  <span>💰 Monto:</span>
                  <input
                    type="number"
                    step="0.01"
                    value={expenseData.monto}
                    onChange={(e) => setExpenseData({ ...expenseData, monto: e.target.value })}
                    className={styles.editableField}
                  />
                </div>

                <div className={styles.summaryRow}>
                  <span>📝 Descripción:</span>
                  <input
                    type="text"
                    value={expenseData.descripcion}
                    onChange={(e) => setExpenseData({ ...expenseData, descripcion: e.target.value })}
                    className={styles.editableField}
                  />
                </div>

                <div className={styles.summaryRow}>
                  <span>📂 Categoría:</span>
                  <select
                    value={expenseData.categoria}
                    onChange={(e) => setExpenseData({ ...expenseData, categoria: e.target.value })}
                    className={styles.editableField}
                  >
                    {categorias.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div className={styles.summaryRow}>
                  <span>📅 Fecha:</span>
                  <input
                    type="date"
                    value={expenseData.fecha}
                    onChange={(e) => setExpenseData({ ...expenseData, fecha: e.target.value })}
                    className={styles.editableField}
                  />
                </div>
              </div>

              <div className={styles.confirmActions}>
                <button
                  className={styles.backBtn}
                  onClick={() => setMode(mode === 'confirm' ? 'menu' : mode)}
                >
                  ← Atrás
                </button>
                <button
                  className={styles.saveBtn}
                  onClick={handleSaveExpense}
                  disabled={loading}
                >
                  {loading ? '⏳ Guardando...' : '✅ Guardar Gasto'}
                </button>
              </div>
            </div>
          )}

          {/* Mensajes */}
          {error && (
            <div className={styles.errorMessage}>
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className={styles.successMessage}>
              ✅ ¡Gasto registrado exitosamente!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuickExpenseModal;
