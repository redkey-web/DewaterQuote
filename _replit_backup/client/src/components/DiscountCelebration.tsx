import { useEffect, useState, useRef } from "react";

interface Coin {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  scale: number;
}

interface DiscountCelebrationProps {
  discount: number;
  triggerPosition: { x: number; y: number } | null;
  onComplete: () => void;
}

export function DiscountCelebration({ discount, triggerPosition, onComplete }: DiscountCelebrationProps) {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [showPercent, setShowPercent] = useState(false);
  const animationTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!triggerPosition) return;

    const newCoins: Coin[] = [];
    const coinCount = 15;

    for (let i = 0; i < coinCount; i++) {
      const angle = (Math.PI * 2 * i) / coinCount + (Math.random() - 0.5) * 0.8;
      const speed = 4 + Math.random() * 5;
      
      newCoins.push({
        id: i,
        x: triggerPosition.x,
        y: triggerPosition.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 20,
        scale: 0.6 + Math.random() * 0.6,
      });
    }

    setCoins(newCoins);
    setShowPercent(true);

    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }

    animationTimeoutRef.current = setTimeout(() => {
      setCoins([]);
      setShowPercent(false);
      onComplete();
    }, 1500);

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [triggerPosition, onComplete]);

  if (coins.length === 0 && !showPercent) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <style>{`
        @keyframes coin-burst {
          0% {
            opacity: 1;
          }
          70% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        @keyframes percent-float {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          15% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2);
          }
          85% {
            opacity: 1;
            transform: translate(-50%, calc(-50% - 135px)) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, calc(-50% - 135px)) scale(1.2);
          }
        }
      `}</style>
      
      {coins.map(c => {
        const endX = c.x + c.vx * 15;
        const endY = c.y + c.vy * 15 + 0.3 * 15 * 7.5;
        const endRotation = c.rotation + c.rotationSpeed * 15;
        
        return (
          <div
            key={c.id}
            className="absolute"
            style={{
              left: c.x,
              top: c.y,
              transform: `translate(-50%, -50%) rotate(${c.rotation}deg) scale(${c.scale})`,
              animation: 'coin-burst 1.5s ease-out forwards',
              '--end-x': `${endX - c.x}px`,
              '--end-y': `${endY - c.y}px`,
              '--end-rotation': `${endRotation}deg`,
            } as React.CSSProperties}
          >
            <style>{`
              @keyframes coin-move-${c.id} {
                to {
                  transform: translate(calc(-50% + var(--end-x)), calc(-50% + var(--end-y))) rotate(var(--end-rotation)) scale(${c.scale});
                }
              }
            `}</style>
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
                boxShadow: 'inset 0 2px 6px rgba(255,255,255,0.6), inset 0 -2px 6px rgba(0,0,0,0.3), 0 3px 8px rgba(0,0,0,0.4)',
                border: '3px solid #DAA520',
                color: '#8B4513',
                animation: `coin-move-${c.id} 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
              }}
            >
              $
            </div>
          </div>
        );
      })}
      
      {showPercent && triggerPosition && (
        <div
          className="absolute"
          style={{
            left: triggerPosition.x,
            top: triggerPosition.y,
            animation: 'percent-float 1.5s ease-out forwards',
          }}
        >
          <div 
            className="px-4 py-2 rounded-lg font-black text-4xl whitespace-nowrap"
            style={{
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
              color: '#8B4513',
              textShadow: '0 2px 0 rgba(255,255,255,0.5), 0 4px 8px rgba(0,0,0,0.5)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4), inset 0 2px 4px rgba(255,255,255,0.3)',
              border: '3px solid #DAA520',
            }}
          >
            {discount}%
          </div>
        </div>
      )}
    </div>
  );
}
