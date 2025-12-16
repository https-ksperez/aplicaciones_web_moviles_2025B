import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import styles from './SupervisionCharts.module.css';

function SupervisionCharts({ confidenceData, correctionsData, isCollapsed }) {
  const confidenceChartRef = useRef(null);
  const correctionsChartRef = useRef(null);
  const confidenceChartInstance = useRef(null);
  const correctionsChartInstance = useRef(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Listener para resize de ventana
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Limpiar gráficos anteriores
    if (confidenceChartInstance.current) {
      confidenceChartInstance.current.destroy();
    }
    if (correctionsChartInstance.current) {
      correctionsChartInstance.current.destroy();
    }

    // Pequeño delay para asegurar que el contenedor tenga el tamaño correcto
    const timer = setTimeout(() => {
      // Gráfico de distribución de confianza
      if (confidenceChartRef.current) {
        confidenceChartInstance.current = new Chart(confidenceChartRef.current, {
          type: 'doughnut',
          data: {
            labels: confidenceData.labels,
            datasets: [{
              data: confidenceData.values,
              backgroundColor: ['#d4edda', '#fff3cd', '#f8d7da'],
              borderColor: ['#155724', '#856404', '#721c24'],
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top'
              }
            },
            animation: {
              duration: 0 // Desactivar animación para mejor performance
            }
          }
        });
      }

      // Gráfico de tendencia de correcciones
      if (correctionsChartRef.current) {
        correctionsChartInstance.current = new Chart(correctionsChartRef.current, {
          type: 'line',
          data: {
            labels: correctionsData.labels,
            datasets: [{
              label: 'Correcciones Manuales',
              data: correctionsData.values,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(255, 99, 132, 0.1)',
              tension: 0.1,
              fill: true
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: true
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            },
            animation: {
              duration: 0 // Desactivar animación para mejor performance
            }
          }
        });
      }
    }, 350); // Aumentado el delay para dar tiempo a la transición del sidebar

    // Cleanup
    return () => {
      clearTimeout(timer);
      if (confidenceChartInstance.current) {
        confidenceChartInstance.current.destroy();
      }
      if (correctionsChartInstance.current) {
        correctionsChartInstance.current.destroy();
      }
    };
  }, [confidenceData, correctionsData, isCollapsed, windowWidth]);

  return (
    <div className={styles.chartsGrid}>
      <section className={styles.card}>
        <h4>Distribución de Confianza</h4>
        <div className={styles.chartContainer}>
          <canvas ref={confidenceChartRef}></canvas>
        </div>
      </section>
      <section className={styles.card}>
        <h4>Tendencia de Correcciones</h4>
        <div className={styles.chartContainer}>
          <canvas ref={correctionsChartRef}></canvas>
        </div>
      </section>
    </div>
  );
}

export default SupervisionCharts;
