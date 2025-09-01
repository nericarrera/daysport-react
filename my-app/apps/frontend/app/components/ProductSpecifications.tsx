interface ProductSpecificationsProps {
  specifications: Record<string, string>;
}

export default function ProductSpecifications({ specifications }: ProductSpecificationsProps) {
  return (
    <div>
      <h3 className="font-semibold text-gray-900 mb-3">Especificaciones</h3>
      <div className="grid gap-3 text-sm">
        {Object.entries(specifications).map(([key, value]) => (
          <div key={key} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
            <span className="text-gray-600 capitalize">{key}:</span>
            <span className="text-gray-900 font-medium text-right">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}