import React from 'react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DownloadCloud, LogOut } from 'lucide-react';
import { usePwaInstall } from '@/components/PwaInstallPrompt';

const VistoriaHeader = ({ userName, onLogout }) => {
  const { deferredPrompt, triggerInstall } = usePwaInstall();

  return (
    <div className="w-full flex justify-center relative">
      <Card className="w-full max-w-2xl card-shadow bg-gradient-to-r from-purple-600 to-blue-600 text-white relative overflow-visible">
        <CardHeader className="p-2 flex flex-col items-center justify-center gap-1">
          <CardTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-center mb-0 drop-shadow-lg">
            Checklist De Motos
          </CardTitle>
          {userName && (
            <span className="text-xs sm:text-sm font-medium text-white/90 mt-0.5 mb-0.5">Bem-vindo, {userName}</span>
          )}
        </CardHeader>
        {deferredPrompt && (
          <Button
            onClick={triggerInstall}
            variant="outline"
            size="sm"
            className="absolute top-1 right-12 sm:top-2 sm:right-12 bg-white/20 hover:bg-white/30 text-white border-white/50 hover:border-white backdrop-blur-sm"
            title="Instalar App"
          >
            <DownloadCloud size={16} className="mr-0 sm:mr-2" />
            <span className="hidden sm:inline">Instalar App</span>
          </Button>
        )}
        {userName && onLogout && (
          <Button
            onClick={onLogout}
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1 sm:top-2 sm:right-2 text-white hover:bg-white/10"
            title="Sair"
          >
            <LogOut size={20} />
          </Button>
        )}
      </Card>
    </div>
  );
};

export default VistoriaHeader;