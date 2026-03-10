import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
  ReferenceLine,
} from "recharts";
import { useTheme } from "../context/ThemeContext";

function generateSchoolYearDates() {
  const months = ["09", "10", "11", "12", "01", "02", "03", "04", "05", "06"];
  const currentYear = new Date().getFullYear();
  return months.map((month, index) => {
    const year = index < 4 ? currentYear - 1 : currentYear;
    return `${month}/${year}`;
  });
}

function convertExcelDate(excelSerial) {
  const baseDate = new Date(1899, 11, 30);
  const date = new Date(baseDate.getTime() + excelSerial * 86400000);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return { fullDate: `${day}/${month}/${year}`, monthYear: `${month}/${year}` };
}

export default function StudentChart({ grades, studentName }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const schoolYearDates = generateSchoolYearDates();
  const [selectedMonth, setSelectedMonth] = useState(null);

  const data = grades.map((grade) => {
    const { fullDate, monthYear } = convertExcelDate(grade.Data);
    return {
      Voto: grade.Voto,
      Tipo: grade.Tipo,
      monthYear,
      Data: fullDate,
    };
  });

  const getMonthData = (monthYear) => {
    const [month, year] = monthYear.split("/");
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, index) => {
      const day = (index + 1).toString().padStart(2, "0");
      const fullDate = `${day}/${month}/${year}`;
      const gradeOrale = data.find((g) => g.Data === fullDate && g.Tipo === "Orale");
      const gradeScritto = data.find((g) => g.Data === fullDate && g.Tipo === "Scritto");
      return {
        Data: fullDate,
        VotoOrale: gradeOrale ? gradeOrale.Voto : null,
        VotoScritto: gradeScritto ? gradeScritto.Voto : null,
      };
    });
  };

  const fullYearData = schoolYearDates.map((date) => {
    const orale = data.find((g) => g.monthYear === date && g.Tipo === "Orale");
    const scritto = data.find((g) => g.monthYear === date && g.Tipo === "Scritto");
    return {
      Data: date,
      VotoOrale: orale ? orale.Voto : null,
      VotoScritto: scritto ? scritto.Voto : null,
    };
  });

  const getDotColor = (voto) => {
    if (isDark) {
      if (voto >= 1 && voto <= 3) return "#f1f5f9";
      if (voto >= 4 && voto <= 5) return "#94a3b8";
      return "#475569";
    }
    if (voto >= 1 && voto <= 3) return "#111827";
    if (voto >= 4 && voto <= 5) return "#6b7280";
    return "#d1d5db";
  };

  const lineOral = isDark ? "#e2e8f0" : "#374151";
  const lineWritten = isDark ? "#64748b" : "#9ca3af";
  const refLine = isDark ? "#334155" : "#d1d5db";
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const axisColor = isDark ? "#475569" : "#9ca3af";
  const tooltipBg = isDark ? "#1e293b" : "#ffffff";
  const tooltipBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <p style={{
          fontSize: '0.6rem', fontWeight: 600, textTransform: 'uppercase',
          letterSpacing: '0.25em', color: 'var(--text-faint)', marginBottom: '2px',
        }}>
          Andamento voti
        </p>
        <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', margin: 0 }}>
          {studentName}
        </h2>
      </div>

      {/* Month filter buttons */}
      <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '0.25rem' }}>
        {schoolYearDates.map((month) => (
          <button
            key={month}
            onClick={() => setSelectedMonth(month)}
            style={{
              padding: '0.375rem 0.75rem',
              borderRadius: 'var(--radius)',
              fontSize: '0.75rem',
              fontWeight: 500,
              border: '1px solid var(--border)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontFamily: 'inherit',
              background: selectedMonth === month ? 'var(--accent)' : 'var(--bg-subtle)',
              color: selectedMonth === month ? 'var(--accent-fg)' : 'var(--text-muted)',
              borderColor: selectedMonth === month ? 'var(--accent)' : 'var(--border)',
            }}
          >
            {month.split("/")[0]}
          </button>
        ))}
        <button
          onClick={() => setSelectedMonth(null)}
          style={{
            padding: '0.375rem 0.75rem',
            borderRadius: 'var(--radius)',
            fontSize: '0.75rem',
            fontWeight: 500,
            border: '1px solid var(--border)',
            cursor: 'pointer',
            transition: 'all 0.2s',
            fontFamily: 'inherit',
            background: selectedMonth === null ? 'var(--accent)' : 'var(--bg-subtle)',
            color: selectedMonth === null ? 'var(--accent-fg)' : 'var(--text-muted)',
            borderColor: selectedMonth === null ? 'var(--accent)' : 'var(--border)',
          }}
        >
          Anno
        </button>
      </div>

      <ResponsiveContainer width="99%" height={400}>
        <LineChart data={selectedMonth ? getMonthData(selectedMonth) : fullYearData}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis
            dataKey="Data"
            tickFormatter={(tick) => {
              if (selectedMonth) {
                const [day, month] = tick.split("/");
                return `${day}/${month}`;
              } else {
                const [month, year] = tick.split("/");
                return `${month}/${year}`;
              }
            }}
            interval={0}
            angle={-15}
            textAnchor="end"
            fontSize="13"
            stroke={axisColor}
            tick={{ fill: axisColor }}
          />
          <YAxis domain={[0, 10]} stroke={axisColor} tick={{ fill: axisColor }} />
          <Tooltip
            contentStyle={{
              background: tooltipBg,
              border: `1px solid ${tooltipBorder}`,
              borderRadius: '0.5rem',
              color: isDark ? '#f1f5f9' : '#0f172a',
              fontSize: '0.8rem',
            }}
          />
          <Line
            type="monotone"
            dataKey="VotoOrale"
            stroke={lineOral}
            strokeWidth={2}
            connectNulls={true}
            dot={({ cx, cy, payload }) =>
              payload.VotoOrale !== null && payload.Data ? (
                <Dot cx={cx} cy={cy} r={6} fill={getDotColor(payload.VotoOrale)} />
              ) : null
            }
          />
          <Line
            type="monotone"
            dataKey="VotoScritto"
            stroke={lineWritten}
            strokeWidth={2}
            connectNulls={true}
            dot={({ cx, cy, payload }) =>
              payload.VotoScritto !== null && payload.Data ? (
                <Dot cx={cx} cy={cy} r={6} fill={getDotColor(payload.VotoScritto)} />
              ) : null
            }
          />
          <ReferenceLine y={6} stroke={refLine} strokeWidth={2} strokeDasharray="3 3" />
        </LineChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-block', width: '1rem', height: '1rem', borderRadius: '50%', background: isDark ? '#f1f5f9' : '#111827' }} />
            <span>Voti bassi (1-3)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-block', width: '1rem', height: '1rem', borderRadius: '50%', background: isDark ? '#94a3b8' : '#6b7280' }} />
            <span>Voti medi (4-5)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-block', width: '1rem', height: '1rem', borderRadius: '50%', background: isDark ? '#475569' : '#d1d5db' }} />
            <span>Voti alti (6-10)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-block', width: '1.5rem', height: '3px', background: lineOral }} />
            <span>Voto Orale</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-block', width: '1.5rem', height: '3px', background: lineWritten }} />
            <span>Voto Scritto</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ display: 'inline-block', width: '1.5rem', height: '0', borderTop: `2px dashed ${refLine}` }} />
            <span>Riferimento: Voto 6</span>
          </div>
        </div>
      </div>
    </div>
  );
}
