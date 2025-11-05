"use client";

import { useMemo } from "react";

export interface PieDatum {
  label: string;
  value: number;
}

export function PieChart({ data, colors = [], size = 200 }: { data: PieDatum[]; colors?: string[]; size?: number; }) {
  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);
  const geometry = useMemo(() => {
    const r = size / 2 - 10;
    const cx = size / 2;
    const cy = size / 2;
    let angle = -Math.PI / 2;
    const paths: { d: string; fill: string }[] = [];
    data.forEach((g, idx) => {
      const slice = total ? (g.value / total) * Math.PI * 2 : 0;
      const x1 = cx + r * Math.cos(angle);
      const y1 = cy + r * Math.sin(angle);
      const x2 = cx + r * Math.cos(angle + slice);
      const y2 = cy + r * Math.sin(angle + slice);
      const largeArc = slice > Math.PI ? 1 : 0;
      const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
      paths.push({ d, fill: colors[idx % colors.length] || "#0d6efd" });
      angle += slice;
    });
    return { cx, cy, r, paths };
  }, [data, total, size, colors]);

  return (
    <div className="d-flex flex-column align-items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {data.length === 1 ? (
          <circle cx={geometry.cx} cy={geometry.cy} r={geometry.r} fill={colors[0] || "#0d6efd"} />
        ) : (
          geometry.paths.map((p, i) => <path key={i} d={p.d} fill={p.fill} />)
        )}
      </svg>
      <div className="mt-2" style={{ maxWidth: size + 60 }}>
        {data.map((g, idx) => (
          <div key={idx} className="d-flex align-items-center small mb-1">
            <div className="d-flex align-items-center">
              <span
                className="me-2 d-inline-block"
                style={{ width: 12, height: 12, background: colors[idx % colors.length] || "#0d6efd" }}
              ></span>
              <span>{g.label}</span>
            </div>
            <div className="flex-grow-1"></div>
            <span className="ms-4">{g.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PieChart;


