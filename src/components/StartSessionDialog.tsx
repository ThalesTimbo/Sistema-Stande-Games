import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface StartSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStart: (duration: number, playerName?: string) => void;
  equipmentName: string;
}

export const StartSessionDialog = ({
  open,
  onOpenChange,
  onStart,
  equipmentName,
}: StartSessionDialogProps) => {
  const [duration, setDuration] = useState('30');
  const [playerName, setPlayerName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const durationNum = parseInt(duration);
    if (durationNum > 0) {
      onStart(durationNum, playerName.trim() || undefined);
      setDuration('30');
      setPlayerName('');
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Iniciar Sessão - {equipmentName}</DialogTitle>
          <DialogDescription>
            Configure o tempo de uso e opcionalmente o nome do jogador
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="playerName">Nome do Jogador (opcional)</Label>
            <Input
              id="playerName"
              placeholder="Ex: João Silva"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Tempo (minutos)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              max="240"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDuration('15')}
              className="flex-1"
            >
              15 min
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDuration('30')}
              className="flex-1"
            >
              30 min
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDuration('60')}
              className="flex-1"
            >
              60 min
            </Button>
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-primary to-secondary">
            Iniciar Sessão
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
