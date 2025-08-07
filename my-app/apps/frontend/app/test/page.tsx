'use client';
import { useEffect } from 'react';
import { testBackendConnection } from '@/lib/api/testConnection';

export default function TestPage() {
  useEffect(() => {
    testBackendConnection().then(console.log);
  }, []);

  return <div>Verifica la consola del navegador (F12 > Console)</div>;
}