'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useAtlas } from '../context/AtlasContext';
import { destinations, Destination } from '../data/destinations';

interface Point3D {
  x: number;
  y: number;
  z: number;
}

export const InteractiveGlobe: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { setActiveId, activeId } = useAtlas();
  const [hoveredDest, setHoveredDest] = useState<Destination | null>(null);

  // Rotation angles (radians)
  const rotationRef = useRef({ yaw: 0.8, pitch: 0.3 });
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const mousePosRef = useRef({ x: 0, y: 0 });

  // Map coordinates to 3D unit sphere
  const get3DCoords = (lat: number, lng: number): Point3D => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);

    return {
      x: Math.sin(phi) * Math.sin(theta),
      y: Math.cos(phi), // Y is up
      z: Math.sin(phi) * Math.cos(theta),
    };
  };

  // Rotate point in 3D (yaw around Y axis, pitch around X axis)
  const rotatePoint = (p: Point3D, yaw: number, pitch: number): Point3D => {
    // Rotate around Y-axis (yaw)
    const cosY = Math.cos(yaw);
    const sinY = Math.sin(yaw);
    let x1 = p.x * cosY - p.z * sinY;
    let z1 = p.x * sinY + p.z * cosY;
    let y1 = p.y;

    // Rotate around X-axis (pitch)
    const cosX = Math.cos(pitch);
    const sinX = Math.sin(pitch);
    let y2 = y1 * cosX - z1 * sinX;
    let z2 = y1 * sinX + z1 * cosX;
    let x2 = x1;

    return { x: x2, y: y2, z: z2 };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = canvas.width;
    let height = canvas.height;
    let radius = Math.min(width, height) * 0.42;

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const size = Math.min(parent.clientWidth, 480);
        canvas.width = size;
        canvas.height = size;
        width = size;
        height = size;
        radius = size * 0.42;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Render loop
    const render = () => {
      // Auto-rotation when not dragging
      if (!isDraggingRef.current) {
        rotationRef.current.yaw += 0.002;
      }

      ctx.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;
      const { yaw, pitch } = rotationRef.current;

      // Draw outer atmosphere glow
      const glowGrad = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 1.15);
      glowGrad.addColorStop(0, 'rgba(244, 114, 182, 0.0)'); // fading from pink accent
      glowGrad.addColorStop(0.5, 'rgba(244, 114, 182, 0.05)');
      glowGrad.addColorStop(0.85, 'rgba(244, 114, 182, 0.12)');
      glowGrad.addColorStop(1, 'rgba(244, 114, 182, 0.0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // Draw Globe sphere background (dark 3D gradient)
      const bgGrad = ctx.createRadialGradient(cx - radius * 0.2, cy - radius * 0.2, radius * 0.1, cx, cy, radius);
      bgGrad.addColorStop(0, '#10101b');
      bgGrad.addColorStop(0.6, '#08080f');
      bgGrad.addColorStop(1, '#020205');
      ctx.fillStyle = bgGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      // Draw Globe boundary ring
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw latitude grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const step = 15;
      for (let lat = -75; lat <= 75; lat += step) {
        ctx.beginPath();
        for (let lng = -180; lng <= 180; lng += 5) {
          const pt = get3DCoords(lat, lng);
          const rot = rotatePoint(pt, yaw, pitch);
          if (rot.z > 0) {
            const screenX = cx + rot.x * radius;
            const screenY = cy - rot.y * radius; // invert Y
            if (lng === -180) {
              ctx.moveTo(screenX, screenY);
            } else {
              ctx.lineTo(screenX, screenY);
            }
          }
        }
        ctx.stroke();
      }

      // Draw longitude grid lines
      for (let lng = -180; lng < 180; lng += step) {
        ctx.beginPath();
        for (let lat = -90; lat <= 90; lat += 5) {
          const pt = get3DCoords(lat, lng);
          const rot = rotatePoint(pt, yaw, pitch);
          if (rot.z > 0) {
            const screenX = cx + rot.x * radius;
            const screenY = cy - rot.y * radius;
            if (lat === -90) {
              ctx.moveTo(screenX, screenY);
            } else {
              ctx.lineTo(screenX, screenY);
            }
          }
        }
        ctx.stroke();
      }

      // Draw and check pins
      let foundHover: Destination | null = null;
      const mouseX = mousePosRef.current.x;
      const mouseY = mousePosRef.current.y;

      destinations.forEach((dest) => {
        const pt = get3DCoords(dest.coordinates.lat, dest.coordinates.lng);
        const rot = rotatePoint(pt, yaw, pitch);

        // Only render pins on the front hemisphere
        if (rot.z > 0) {
          const px = cx + rot.x * radius;
          const py = cy - rot.y * radius;

          // Check if mouse is hovering this pin
          const dist = Math.hypot(mouseX - px, mouseY - py);
          const isHovered = dist < 12;

          if (isHovered) {
            foundHover = dest;
          }

          // Pin pulse glow
          if (isHovered || activeId === dest.id) {
            ctx.fillStyle = 'rgba(244, 114, 182, 0.25)';
            ctx.beginPath();
            ctx.arc(px, py, 14 + Math.sin(Date.now() / 150) * 3, 0, Math.PI * 2);
            ctx.fill();
          }

          // Main pin node
          ctx.fillStyle = isHovered || activeId === dest.id ? '#ff8a9e' : 'rgba(255, 255, 255, 0.85)';
          ctx.beginPath();
          ctx.arc(px, py, isHovered ? 6 : 4, 0, Math.PI * 2);
          ctx.fill();

          // Connect pin with a thin radial height line (visual elevation)
          ctx.strokeStyle = isHovered || activeId === dest.id ? 'rgba(244, 114, 182, 0.8)' : 'rgba(255, 255, 255, 0.4)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(px, py - 10);
          ctx.stroke();

          // Flag dot at top of line
          ctx.fillStyle = isHovered || activeId === dest.id ? '#ff8a9e' : 'white';
          ctx.beginPath();
          ctx.arc(px, py - 10, 2, 0, Math.PI * 2);
          ctx.fill();

          // Label indicator for coordinates
          if (isHovered) {
            ctx.fillStyle = 'white';
            ctx.font = '10px var(--font-geist-mono)';
            ctx.fillText(`${dest.coordinates.lat.toFixed(1)}°N, ${Math.abs(dest.coordinates.lng).toFixed(1)}°${dest.coordinates.lng < 0 ? 'W' : 'E'}`, px + 12, py - 6);
          }
        }
      });

      setHoveredDest(foundHover);
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [activeId]);

  // Mouse drag handlers to rotate the globe
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }

    if (!isDraggingRef.current) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - dragStartRef.current.y;

    rotationRef.current.yaw += deltaX * 0.007;
    // limit pitch to prevent gimbal flip
    rotationRef.current.pitch = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, rotationRef.current.pitch + deltaY * 0.007));

    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const handleCanvasClick = () => {
    if (hoveredDest) {
      setActiveId(hoveredDest.id);
    }
  };

  return (
    <div className="relative flex flex-col items-center select-none">
      <div className="relative flex items-center justify-center p-2 rounded-full border border-white/5 bg-radial from-white/[0.02] to-transparent shadow-[inset_0_0_40px_rgba(255,255,255,0.01)]">
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onClick={handleCanvasClick}
          className={`cursor-grab active:cursor-grabbing transition-all duration-300 ${
            hoveredDest ? 'border-pink-500/20 shadow-[0_0_20px_rgba(244,114,182,0.1)]' : ''
          }`}
          data-cursor={hoveredDest ? 'explore' : undefined}
          width={400}
          height={400}
        />

        {/* Hover Label overlay */}
        {hoveredDest && (
          <div className="absolute bottom-6 bg-zinc-950/90 border border-white/10 rounded-full px-4 py-1 text-center backdrop-blur-md shadow-2xl animate-fade-in pointer-events-none">
            <span className="text-[10px] uppercase tracking-widest text-pink-400 font-bold block">
              {hoveredDest.place}
            </span>
            <span className="text-sm font-display font-semibold tracking-wider text-white">
              {hoveredDest.title} {hoveredDest.title2}
            </span>
          </div>
        )}
      </div>
      <div className="text-center mt-3 text-[11px] text-zinc-500 font-medium tracking-wide">
        Döndürmek için sürükleyin · Keşfetmek için pinlere tıklayın
      </div>
    </div>
  );
};
export default InteractiveGlobe;
