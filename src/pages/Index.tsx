import { useState, useEffect } from 'react';
import { Users, ArrowRight, ArrowLeft, Monitor, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/StatCard';
import { EquipmentCard } from '@/components/EquipmentCard';
import { AddEquipmentDialog } from '@/components/AddEquipmentDialog';
import { StartSessionDialog } from '@/components/StartSessionDialog';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Equipment, EquipmentType, Session } from '@/types/equipment';
import { toast } from 'sonner';

const Index = () => {
  const [peopleInside, setPeopleInside] = useLocalStorage('peopleInside', 0);
  const [totalEntries, setTotalEntries] = useLocalStorage('totalEntries', 0);
  const [equipment, setEquipment] = useLocalStorage<Equipment[]>('equipment', []);
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);

  // Timer para atualizar as sessões ativas
  useEffect(() => {
    const interval = setInterval(() => {
      setEquipment((prev) =>
        prev.map((eq) => {
          if (eq.currentSession && eq.currentSession.timeRemaining > 0) {
            const newTimeRemaining = eq.currentSession.timeRemaining - 1;
            
            // Notificação quando faltam 2 minutos
            if (newTimeRemaining === 120) {
              toast.warning(`${eq.name} - Faltam 2 minutos!`, {
                description: eq.currentSession.playerName 
                  ? `Jogador: ${eq.currentSession.playerName}`
                  : undefined,
              });
            }
            
            // Notificação quando o tempo acaba
            if (newTimeRemaining === 0) {
              toast.error(`${eq.name} - Tempo Esgotado!`, {
                description: eq.currentSession.playerName 
                  ? `Jogador: ${eq.currentSession.playerName}`
                  : undefined,
                duration: 10000,
              });
              
              // Toca um som (se o navegador permitir)
              const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBzKM0vPTgjMGHm7A7+OZUA8PTabn77BfHAU6lNTx0IMoBiiB0PLcizsIGWO56ueXTQsMUKfj8LZjHAY4kdfyzHksBSR3x/DdkEAKFF606OuoVRQKRp/g8r5sIQcyjNLz04IzBh5uwO/jmVAPD02m5++wXxwFOpTU8dCDKAYogdDy3Is7CBljterpplwPDA==');
              audio.play().catch(() => {
                // Ignorar erro se o navegador bloquear o som
              });
            }

            return {
              ...eq,
              currentSession: {
                ...eq.currentSession,
                timeRemaining: newTimeRemaining,
              },
            };
          }
          return eq;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [setEquipment]);

  const handleEntry = () => {
    setPeopleInside((prev) => prev + 1);
    setTotalEntries((prev) => prev + 1);
    toast.success('Entrada registrada!');
  };

  const handleExit = () => {
    if (peopleInside > 0) {
      setPeopleInside((prev) => prev - 1);
      toast.success('Saída registrada!');
    } else {
      toast.error('Não há pessoas para sair!');
    }
  };

  const handleAddEquipment = (name: string, type: EquipmentType) => {
    const newEquipment: Equipment = {
      id: Date.now().toString(),
      name,
      type,
      isOccupied: false,
    };
    setEquipment((prev) => [...prev, newEquipment]);
    toast.success(`${type === 'pc' ? 'PC' : 'Console'} adicionado com sucesso!`);
  };

  const handleStartSession = (equipmentId: string) => {
    setSelectedEquipmentId(equipmentId);
    setSessionDialogOpen(true);
  };

  const handleConfirmStartSession = (duration: number, playerName?: string) => {
    if (!selectedEquipmentId) return;

    const session: Session = {
      id: Date.now().toString(),
      equipmentId: selectedEquipmentId,
      startTime: new Date(),
      duration,
      timeRemaining: duration * 60,
      playerName,
    };

    setEquipment((prev) =>
      prev.map((eq) =>
        eq.id === selectedEquipmentId
          ? { ...eq, isOccupied: true, currentSession: session }
          : eq
      )
    );

    const eq = equipment.find((e) => e.id === selectedEquipmentId);
    toast.success(`Sessão iniciada em ${eq?.name}!`, {
      description: playerName ? `Jogador: ${playerName}` : undefined,
    });
  };

  const handleEndSession = (equipmentId: string) => {
    setEquipment((prev) =>
      prev.map((eq) =>
        eq.id === equipmentId
          ? { ...eq, isOccupied: false, currentSession: undefined }
          : eq
      )
    );
    const eq = equipment.find((e) => e.id === equipmentId);
    toast.info(`Sessão finalizada em ${eq?.name}`);
  };

  const handleDeleteEquipment = (equipmentId: string) => {
    setEquipment((prev) => prev.filter((eq) => eq.id !== equipmentId));
    toast.success('Equipamento removido');
  };

  const selectedEquipment = equipment.find((eq) => eq.id === selectedEquipmentId);
  const occupiedCount = equipment.filter((eq) => eq.isOccupied).length;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Gaming Lab Monitor
          </h1>
          <p className="text-muted-foreground">
            Sistema de monitoramento e controle do estande de games
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Pessoas no Estande"
            value={peopleInside}
            icon={Users}
            variant="primary"
          />
          <StatCard
            title="Total de Entradas"
            value={totalEntries}
            icon={ArrowRight}
            variant="success"
          />
          <StatCard
            title="Equipamentos em Uso"
            value={occupiedCount}
            icon={Monitor}
            variant="warning"
          />
          <StatCard
            title="Total de Equipamentos"
            value={equipment.length}
            icon={Gamepad2}
            variant="secondary"
          />
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 justify-center">
          <Button
            onClick={handleEntry}
            size="lg"
            className="bg-gradient-to-r from-success to-accent hover:opacity-90"
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            Registrar Entrada
          </Button>
          <Button
            onClick={handleExit}
            size="lg"
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive/10"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Registrar Saída
          </Button>
        </div>

        {/* Equipment Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Equipamentos</h2>
            <AddEquipmentDialog onAdd={handleAddEquipment} />
          </div>

          {equipment.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
              <Gamepad2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">
                Nenhum equipamento cadastrado. Adicione PCs e consoles para começar!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {equipment.map((eq) => (
                <EquipmentCard
                  key={eq.id}
                  equipment={eq}
                  onStartSession={handleStartSession}
                  onEndSession={handleEndSession}
                  onDelete={handleDeleteEquipment}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <StartSessionDialog
        open={sessionDialogOpen}
        onOpenChange={setSessionDialogOpen}
        onStart={handleConfirmStartSession}
        equipmentName={selectedEquipment?.name || ''}
      />
    </div>
  );
};

export default Index;
