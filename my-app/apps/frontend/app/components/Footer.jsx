'use client';
import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Productos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">PRODUCTOS</h3>
            <ul className="space-y-2">
              {['Pantalones', 'Remeras', 'Buzos', 'Camperas', 'Shorts', 'Gorras', 'Calzas'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Hombre */}
          <div>
            <h3 className="text-lg font-semibold mb-4">HOMBRE</h3>
            <ul className="space-y-2">
              {['Pantalones', 'Remeras', 'Buzos', 'Camperas', 'Shorts', 'Gorras'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mujer */}
          <div>
            <h3 className="text-lg font-semibold mb-4">MUJER</h3>
            <ul className="space-y-2">
              {['Pantalones', 'Remeras', 'Buzos', 'Camperas', 'Shorts', 'Calzas'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Las Bravas */}
          <div>
            <h3 className="text-lg font-semibold mb-4">LAS BRAVAS</h3>
            <ul className="space-y-2">
              {['Jeans', 'Sweater', 'Buzos', 'Remeras', 'Shorts'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-semibold mb-4">CONTACTO</h3>
            <ul className="space-y-2">
              <li>daysport.ok@gmail.com</li>
              <li>(11) 2176-4065</li>
              <li>Merlo, Buenos Aires</li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <Link href="#">
                <Image src="/iconos/icono-instagram.png" alt="Instagram" width={35} height={35} />
              </Link>
              <Link href="#">
                <Image src="/iconos/icono-facebook.png" alt="Facebook" width={35} height={35} />
              </Link>
              <Link href="#">
                <Image src="/iconos/icono-whatsapp.png" alt="WhatsApp" width={35} height={35} />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Image
              src="/logo-daysport-00.png"
              alt="Daysport Logo"
              width={120}
              height={40}
            />
          </div>
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Daysport. Todos los derechos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}