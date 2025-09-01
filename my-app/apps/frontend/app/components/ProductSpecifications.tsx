'use client';

interface ProductSpecificationsProps {
  specifications: Record<string, string>;
}

export default function ProductSpecifications({ specifications }: ProductSpecificationsProps) {
  if (!specifications || Object.keys(specifications).length === 0) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Especificaciones</h3>
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
        {Object.entries(specifications).map(([key, value]) => (
          <div key={key} className="border-b border-gray-200 pb-2">
            <dt className="text-sm font-medium text-gray-500">{key}</dt>
            <dd className="mt-1 text-sm text-gray-900">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}