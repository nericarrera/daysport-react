interface SizeGuideProps {
  sizeGuide: any;
  measurements?: any;
}

export default function SizeGuide({ sizeGuide, measurements }: SizeGuideProps) {
  return (
    <div className="border rounded-lg p-6">
      <h3 className="text-xl font-bold mb-4">Guía de Talles</h3>
      
      {sizeGuide && (
        <div className="mb-6">
          <h4 className="font-semibold mb-2">Medidas generales (cm):</h4>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left">Talle</th>
                {Object.keys(sizeGuide["Guía de Talles"]?.["XS"] || {}).map(measure => (
                  <th key={measure} className="text-center">{measure}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(sizeGuide["Guía de Talles"] || {}).map(([size, measures]) => (
                <tr key={size} className="border-b">
                  <td className="font-medium">{size}</td>
                  {Object.values(measures as any).map((value: any, index) => (
                    <td key={index} className="text-center">{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}