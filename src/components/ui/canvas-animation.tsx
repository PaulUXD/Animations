'use client';
import { useEffect, useRef } from 'react';

// Animation classes and variables
class Oscillator {
  phase: number;
  offset: number;
  frequency: number;
  amplitude: number;
  value: number = 0;

  constructor(options: { phase?: number; offset?: number; frequency?: number; amplitude?: number } = {}) {
    this.phase = options.phase || 0;
    this.offset = options.offset || 0;
    this.frequency = options.frequency || 0.001;
    this.amplitude = options.amplitude || 1;
  }

  update() {
    this.phase += this.frequency;
    this.value = this.offset + Math.sin(this.phase) * this.amplitude;
    return this.value;
  }
}

class Node {
  x: number = 0;
  y: number = 0;
  vx: number = 0;
  vy: number = 0;
}

const CONFIG = {
  debug: true,
  friction: 0.5,
  trails: 80,
  size: 50,
  dampening: 0.025,
  tension: 0.99,
};

class Line {
  spring: number;
  friction: number;
  nodes: Node[];

  constructor(options: { spring?: number } = {}) {
    this.spring = (options.spring || 0.45) + 0.1 * Math.random() - 0.05;
    this.friction = CONFIG.friction + 0.01 * Math.random() - 0.005;
    this.nodes = [];
    
    for (let i = 0; i < CONFIG.size; i++) {
      const node = new Node();
      this.nodes.push(node);
    }
  }

  update(pos: { x: number; y: number }) {
    let spring = this.spring;
    let node = this.nodes[0];
    
    node.vx += (pos.x - node.x) * spring;
    node.vy += (pos.y - node.y) * spring;
    
    for (let i = 0, len = this.nodes.length; i < len; i++) {
      node = this.nodes[i];
      
      if (i > 0) {
        const prev = this.nodes[i - 1];
        node.vx += (prev.x - node.x) * spring;
        node.vy += (prev.y - node.y) * spring;
        node.vx += prev.vx * CONFIG.dampening;
        node.vy += prev.vy * CONFIG.dampening;
      }
      
      node.vx *= this.friction;
      node.vy *= this.friction;
      node.x += node.vx;
      node.y += node.vy;
      
      spring *= CONFIG.tension;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    let x = this.nodes[0].x;
    let y = this.nodes[0].y;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    for (let i = 1, len = this.nodes.length - 2; i < len; i++) {
      const a = this.nodes[i];
      const b = this.nodes[i + 1];
      x = (a.x + b.x) * 0.5;
      y = (a.y + b.y) * 0.5;
      
      ctx.quadraticCurveTo(a.x, a.y, x, y);
    }
    
    const a = this.nodes[this.nodes.length - 2];
    const b = this.nodes[this.nodes.length - 1];
    ctx.quadraticCurveTo(a.x, a.y, b.x, b.y);
    
    ctx.stroke();
    ctx.closePath();
  }
}

export function CanvasAnimation({ 
  trailCount = 80, 
  lineWidth = 10, 
  colorMode = 'rainbow',
  followDistance = 0.45,  // Lower value = closer to mouse
  tailLength = 50,        // Higher value = longer tail
  fadeSpeed = 0.025       // Lower value = slower fade
}: { 
  trailCount?: number; 
  lineWidth?: number; 
  colorMode?: string;
  followDistance?: number;
  tailLength?: number;
  fadeSpeed?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const runningRef = useRef(true);
  const frameRef = useRef(1);
  const linesRef = useRef<Line[]>([]);
  const oscillatorRef = useRef<Oscillator | null>(null);
  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    // Update CONFIG based on props
    CONFIG.trails = trailCount;
    CONFIG.size = tailLength;
    CONFIG.dampening = fadeSpeed;
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    contextRef.current = ctx;
    runningRef.current = true;
    frameRef.current = 1;

    oscillatorRef.current = new Oscillator({
      phase: Math.random() * 2 * Math.PI,
      amplitude: 85,
      frequency: 0.0015,
      offset: 285,
    });

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    const initLines = () => {
      linesRef.current = [];
      for (let i = 0; i < CONFIG.trails; i++) {
        linesRef.current.push(new Line({ spring: followDistance + (i / CONFIG.trails) * 0.025 }));
      }
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e) {
        posRef.current.x = e.touches[0].clientX;
        posRef.current.y = e.touches[0].clientY;
      } else {
        posRef.current.x = e.clientX;
        posRef.current.y = e.clientY;
      }
      e.preventDefault();
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        posRef.current.x = e.touches[0].clientX;
        posRef.current.y = e.touches[0].clientY;
      }
    };

    const render = () => {
      if (!contextRef.current || !runningRef.current || !oscillatorRef.current) return;
      
      const ctx = contextRef.current;
      
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.globalCompositeOperation = 'lighter';
      
      // Set color based on colorMode
      if (colorMode === 'rainbow') {
        ctx.strokeStyle = `hsla(${Math.round(oscillatorRef.current.update())},100%,50%,0.025)`;
      } else {
        // Convert hex to rgba with low opacity
        let color = colorMode;
        if (color.startsWith('#')) {
          const r = parseInt(color.slice(1, 3), 16);
          const g = parseInt(color.slice(3, 5), 16);
          const b = parseInt(color.slice(5, 7), 16);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, 0.025)`;
        } else {
          ctx.strokeStyle = colorMode;
        }
      }
      
      ctx.lineWidth = lineWidth;
      
      for (let i = 0; i < CONFIG.trails; i++) {
        const line = linesRef.current[i];
        line.update(posRef.current);
        line.draw(ctx);
      }
      
      frameRef.current++;
      window.requestAnimationFrame(render);
    };

    // Initialize
    resizeCanvas();
    initLines();
    
    // Set up event listeners
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleMouseMove);
    document.addEventListener('touchstart', handleTouchStart);
    
    // Start animation
    render();

    // Cleanup
    return () => {
      runningRef.current = false;
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, [trailCount, lineWidth, colorMode, followDistance, tailLength, fadeSpeed]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
} 