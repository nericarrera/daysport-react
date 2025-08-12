'use client';
import { useEffect } from 'react';
import { testBackendConnection } from '../../lib/api/test-connection';

export default function TestPage() {
  useEffect(() => {
    testBackendConnection().then(console.log);
  }, []);


}