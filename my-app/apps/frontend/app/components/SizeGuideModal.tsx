// components/SizeGuideModal.tsx
'use client';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  category?: string;
}

export default function SizeGuideModal({ isOpen, onClose, category }: SizeGuideModalProps) {
  if (!isOpen) return null;

  const sizeTables = {
    hombre: {
      titles: ['Talla', 'S', 'M', 'L', 'XL', 'XXL'],
      rows: [
        ['Pecho (cm)', '90-94', '94-98', '98-102', '102-106', '106-110'],
        ['Cintura (cm)', '76-80', '80-84', '84-88', '88-92', '92-96'],
        ['Cadera (cm)', '90-94', '94-98', '98-102', '102-106', '106-110']
      ]
    },
    mujer: {
      titles: ['Talla', 'XS', 'S', 'M', 'L', 'XL'],
      rows: [
        ['Busto (cm)', '82-85', '86-89', '90-93', '94-97', '98-102'],
        ['Cintura (cm)', '64-67', '68-71', '72-75', '76-79', '80-84'],
        ['Cadera (cm)', '90-93', '94-97', '98-101', '102-105', '106-110']
      ]
    },
    default: {
      titles: ['Talla', 'S', 'M', 'L', 'XL'],
      rows: [
        ['Ancho (cm)', '46-48', '50-52', '54-56', '58-60'],
        ['Largo (cm)', '66-68', '69-71', '72-74', '75-77']
      ]
    }
  };

  const table = sizeTables[category as keyof typeof sizeTables] || sizeTables.default;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Guía de Tallas</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  {table.titles.map((title, index) => (
                    <th key={index} className="px-4 py-3 font-semibold">
                      {title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {table.rows.map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-3">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Consejos para elegir tu talla:</h3>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Toma tus medidas sobre la piel, sin ropa</li>
              <li>• Mantén la cinta métrica paralela al suelo</li>
              <li>• No aprietes demasiado la cinta</li>
              <li>• Si estás entre dos tallas, elige la mayor</li>
            </ul>
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
}