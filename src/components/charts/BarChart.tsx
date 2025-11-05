"use client";

export interface BarItem {
  label: string;
  value: number;
}

export function BarChart({ items, colors = [] }: { items: BarItem[]; colors?: string[] }) {
  const max = Math.max(1, ...items.map(i => i.value));
  return (
    <div>
      {items.map((i, idx) => (
        <div key={idx} className="mb-2">
          <div className="d-flex justify-content-between small">
            <span>{i.label}</span>
            <span>{i.value}</span>
          </div>
          <div className="bg-light border" style={{ height: 10 }}>
            <div style={{ width: `${(i.value / max) * 100}%`, height: 10, background: colors[idx % colors.length] || "#0d6efd" }}></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default BarChart;


