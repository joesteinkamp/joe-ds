import { getManifestEntry } from "@/lib/manifest";

interface PropsTableProps {
  slug: string;
}

export default function PropsTable({ slug }: PropsTableProps) {
  const entry = getManifestEntry(slug);

  if (!entry?.props) {
    return (
      <div className="docs-card">
        <div className="docs-card-title">Props</div>
        <div className="docs-card-meta">No manifest data yet for this component.</div>
      </div>
    );
  }

  const rows = Object.entries(entry.props);

  return (
    <div className="docs-section">
      <h3 className="docs-h3">Props</h3>
      <table className="docs-props-table">
        <thead>
          <tr>
            <th>Prop</th>
            <th>Type</th>
            <th>Default</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([propName, propValue]) => (
            <tr key={propName}>
              <td>{propName}</td>
              <td>{String((propValue as any).type ?? "-")}</td>
              <td>{String((propValue as any).default ?? "-")}</td>
              <td>{String((propValue as any).description ?? "-")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
