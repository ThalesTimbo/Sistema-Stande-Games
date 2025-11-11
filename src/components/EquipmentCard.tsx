import { Monitor, Gamepad2, Play, Pause, Trash2, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Equipment } from '@/types/equipment';
import { cn } from '@/lib/utils';

interface EquipmentCardProps {
  equipment: Equipment;
  onStartSession: (equipmentId: string) => void;
  onEndSession: (equipmentId: string) => void;
  onDelete: (equipmentId: string) => void;
}

export const EquipmentCard = ({
  equipment,
  onStartSession,
  onEndSession,
  onDelete,
}: EquipmentCardProps) => {
  const Icon = equipment.type === 'pc' ? Monitor : Gamepad2;
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        equipment.isOccupied
          ? 'border-success bg-success/5'
          : 'border-border/50 hover:border-primary/50'
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={cn(
              'p-2 rounded-lg',
              equipment.isOccupied ? 'bg-success' : 'bg-primary'
            )}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-lg">{equipment.name}</CardTitle>
          </div>
          <Badge variant={equipment.isOccupied ? 'default' : 'secondary'}>
            {equipment.isOccupied ? 'Ocupado' : 'Livre'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {equipment.currentSession && (
          <div className="mb-4 p-3 rounded-lg bg-muted">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Tempo restante:</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {formatTime(equipment.currentSession.timeRemaining)}
            </p>
            {equipment.currentSession.playerName && (
              <p className="text-sm text-muted-foreground mt-1">
                Jogador: {equipment.currentSession.playerName}
              </p>
            )}
          </div>
        )}
        <div className="flex gap-2">
          {equipment.isOccupied ? (
            <Button
              onClick={() => onEndSession(equipment.id)}
              variant="outline"
              className="flex-1"
            >
              <Pause className="w-4 h-4 mr-2" />
              Finalizar
            </Button>
          ) : (
            <Button
              onClick={() => onStartSession(equipment.id)}
              className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90"
            >
              <Play className="w-4 h-4 mr-2" />
              Iniciar
            </Button>
          )}
          <Button
            onClick={() => onDelete(equipment.id)}
            variant="destructive"
            size="icon"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
