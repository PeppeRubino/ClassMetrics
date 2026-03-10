import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  BarController,
  LineController,
  ScatterController,
  PieController,
  DoughnutController,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { useTheme } from "../context/ThemeContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  BarController,
  LineController,
  ScatterController,
  PieController,
  DoughnutController,
  ChartDataLabels
);

const formatDate = (input) => {
  let date;
  if (typeof input === 'number') {
    const excelBaseDate = new Date(1900, 0, 1);
    const correctedTimestamp = new Date(excelBaseDate.getTime() + (input - 2) * 86400000);
    date = correctedTimestamp;
  } else if (typeof input === 'string') {
    const parts = input.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const year = parseInt(parts[2], 10);
      date = new Date(year, month, day);
    } else {
      date = new Date(input);
    }
  } else if (input instanceof Date) {
    date = input;
  } else {
    return "Data non valida";
  }
  if (isNaN(date.getTime())) return "Data non valida";
  return date.toLocaleDateString('it-IT');
};

export default function ClassCharts({
  gaussianData,
  gradeDistData,
  oralVsWrittenData,
  gradeDistDonutData,
  scatterPlotData,
  maxMinGradeData,
  stats,
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Shared chart options for axis/grid dark mode
  const axisColor = isDark ? '#475569' : '#9ca3af';
  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const legendColor = isDark ? '#94a3b8' : '#6b7280';
  const tooltipBg = isDark ? '#1e293b' : '#ffffff';
  const tooltipBorder = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';
  const titleColor = isDark ? '#f1f5f9' : '#111827';

  const baseScales = {
    x: {
      ticks: { color: axisColor },
      grid: { color: gridColor },
    },
    y: {
      ticks: { color: axisColor },
      grid: { color: gridColor },
    },
  };

  const basePlugins = {
    datalabels: { display: false },
    legend: {
      labels: { color: legendColor, boxWidth: 10, padding: 10 },
    },
    tooltip: {
      backgroundColor: tooltipBg,
      borderColor: tooltipBorder,
      borderWidth: 1,
      titleColor: isDark ? '#f1f5f9' : '#0f172a',
      bodyColor: isDark ? '#94a3b8' : '#374151',
    },
  };

  const titleStyle = {
    fontSize: '0.875rem',
    fontWeight: 600,
    color: titleColor,
    marginBottom: '1rem',
    textAlign: 'center',
    margin: '0 0 1rem 0',
  };

  const cardStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 md:gap-x-12 lg:gap-x-32 gap-y-10 w-full px-4 sm:px-8 md:px-16 lg:px-32 mt-10">

      {/* Distribuzione Normale */}
      <div style={cardStyle}>
        <p style={titleStyle}>Distribuzione Normale (Gaussiana)</p>
        <div className="w-full flex justify-center">
          <Chart
            type="line"
            data={gaussianData}
            className="w-full h-auto"
            options={{ plugins: { ...basePlugins, datalabels: { display: false } }, scales: baseScales }}
          />
        </div>
      </div>

      {/* Istogramma */}
      <div style={cardStyle}>
        <p style={titleStyle}>Istogramma</p>
        <div className="w-full flex justify-center">
          <Chart
            type="bar"
            data={gradeDistData}
            className="w-full h-auto"
            options={{ plugins: basePlugins, scales: baseScales }}
          />
        </div>
      </div>

      {/* Scatter Temporale */}
      <div style={cardStyle}>
        <p style={titleStyle}>Grafico a Dispersione Temporale</p>
        <div className="w-full flex justify-center mb-6">
          <Chart
            type="scatter"
            data={scatterPlotData}
            className="w-full h-auto"
            options={{
              responsive: true,
              plugins: {
                ...basePlugins,
                datalabels: { display: false },
                tooltip: {
                  ...basePlugins.tooltip,
                  callbacks: {
                    label: (tooltipItem) => tooltipItem.raw.tooltipData || "",
                  },
                },
              },
              scales: {
                x: {
                  display: true,
                  type: "time",
                  time: { unit: "month", tooltipFormat: "dd/MM/yyyy" },
                  suggestedMin: new Date('2024-09-01T00:00:00'),
                  suggestedMax: new Date('2025-06-30T23:59:59'),
                  ticks: { maxRotation: 0, source: "auto", color: axisColor },
                  grid: { color: gridColor },
                },
                y: {
                  display: true,
                  min: 0,
                  max: 11,
                  ticks: { color: axisColor },
                  grid: { color: gridColor },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Min/Max */}
      <div style={cardStyle}>
        <p style={titleStyle}>Grafico Minimo-Massimo</p>
        <div className="w-full flex justify-center">
          <Chart
            type="bar"
            data={maxMinGradeData}
            className="w-full h-auto"
            options={{ plugins: basePlugins, scales: baseScales }}
          />
        </div>
        <div className="hidden md:flex mt-3" style={{
          background: 'var(--bg-subtle)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '0.75rem',
          alignItems: 'center',
        }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Max: {stats.maxDetails?.name} ({formatDate(stats.maxDetails?.date)}) <br />
            Min: {stats.minDetails?.name} ({formatDate(stats.minDetails?.date)})
          </p>
        </div>
      </div>

      {/* Torta */}
      <div style={cardStyle}>
        <p style={titleStyle}>Grafico a Torta</p>
        <div className="w-full flex justify-center lg:px-10">
          <Chart
            type="pie"
            data={oralVsWrittenData}
            className="w-full h-auto"
            options={{
              responsive: true,
              plugins: {
                ...basePlugins,
                tooltip: { ...basePlugins.tooltip, enabled: false },
                legend: { position: "right", labels: { color: legendColor, boxWidth: 10, padding: 15 } },
              },
            }}
          />
        </div>
      </div>

      {/* Ciambella */}
      <div style={{ ...cardStyle }} className="lg:px-10">
        <p style={titleStyle}>Grafico a Ciambella</p>
        <div className="w-full flex justify-center">
          <Chart
            type="doughnut"
            data={gradeDistDonutData}
            className="w-full h-auto"
            options={{
              responsive: true,
              plugins: {
                ...basePlugins,
                datalabels: {
                  display: true,
                  color: isDark ? '#0f172a' : '#ffffff',
                  font: { size: 10 },
                  formatter: (value, ctx) => {
                    const sum = ctx.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
                    return ((value / sum) * 100).toFixed(2) + "%";
                  },
                },
                legend: { position: "left", labels: { color: legendColor, boxWidth: 10, padding: 10 } },
              },
            }}
          />
        </div>
      </div>

    </div>
  );
}
