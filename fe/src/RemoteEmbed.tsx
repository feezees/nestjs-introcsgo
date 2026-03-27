import React, { Suspense, useEffect, useState } from 'react';
import { loadRemoteModule } from './loadRemoteModule';

const RemoteEmbed = ({ url }: { url: string }) => {
  const [Component, setComponent] = useState<React.ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const init = async () => {
    try {
      const module = await loadRemoteModule(url, 'embed', './App');

      if (module && module.default) {
        setComponent(() => module.default);
      } else {
        setError('Не удалось загрузить микросервис. Это может быть вызвано политикой CORS на GitHub Pages.');
      }
    } catch (e) {
      setError('Критическая ошибка при инициализации');
    }
  };

  useEffect(() => {
    init();
  }, []);

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-xl border border-red-100">
        <h3 className="text-lg font-semibold mb-2">Ошибка загрузки микросервиса</h3>
        <p className="text-sm mb-4">{error}</p>
      </div>
    );
  }

  if (!Component) {
    return (
      <div className="p-4 text-center text-gray-500">
        Загрузка микросервиса...
      </div>
    );
  }

  return (
    <Suspense fallback={<div>Loading component...</div>}>
      <Component />
    </Suspense>
  );
}

export default RemoteEmbed;
