
import React, { useEffect, useState } from 'react';

interface ConfettiProps {
  isActive: boolean;
}

const ConfettiEffect: React.FC<ConfettiProps> = ({ isActive }) => {
  const [particles, setParticles] = useState<JSX.Element[]>([]);
  
  useEffect(() => {
    if (isActive) {
      // Create confetti particles
      const newParticles = [];
      const colors = ['#e5d8c5', '#a89f91', '#f5f5dc', '#3a3a3a', '#cfcfc0'];
      
      for (let i = 0; i < 50; i++) {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const initialTop = -20 - Math.random() * 80;
        const size = 5 + Math.random() * 10;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        newParticles.push(
          <div
            key={i}
            className="confetti"
            style={{
              left: `${left}%`,
              top: `${initialTop}px`,
              backgroundColor: color,
              width: `${size}px`,
              height: `${size}px`,
              animation: `confetti 1s ease-out forwards ${delay}s`,
            }}
          />
        );
      }
      
      setParticles(newParticles);
      
      // Clear confetti after animation is done
      const timer = setTimeout(() => {
        setParticles([]);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isActive]);
  
  if (!isActive || particles.length === 0) return null;
  
  return <div className="confetti-container">{particles}</div>;
};

export default ConfettiEffect;
