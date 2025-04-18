// ThreeDBarChart.js
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';

const Bar = ({ x, height, color, label }) => {
  return (
    <group position={[x, height / 2, 0]}>
      <mesh>
        <boxGeometry args={[0.5, height, 0.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Html position={[0, height / 2 + 0.5, 0]}>
        <div style={{ fontSize: 12, color }}>{label}</div>
      </Html>
    </group>
  );
};

const TargetDot = ({ x, y, value }) => {
  return (
    <group position={[x, y, 0]}>
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color="blue" />
      </mesh>
      <Html position={[0, 0.5, 0]}>
        <div style={{ fontSize: 12, color: 'blue' }}>{value}</div>
      </Html>
    </group>
  );
};

const TargetLine = ({ points }) => {
  const positions = points.flatMap(p => [p[0], p[1], 0]);
  return (
    <line>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={new Float32Array(positions)}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="blue" linewidth={2} />
    </line>
  );
};

const ThreeDBarChart = () => {
  const data = [
    { label: 'Tool 1', rejected: 3, produced: 14, target: 20 },
    { label: 'Tool 2', rejected: 4, produced: 10, target: 18 },
    { label: 'Tool 4', rejected: 0, produced: 144, target: 150 },
    { label: 'Tool 5', rejected: 0, produced: 152, target: 160 },
  ];

  const barSpacing = 2;
  const barOffset = 0.6;
  const scale = 5;

  const chartWidth = data.length * barSpacing;

  const targetPoints = data.map((d, i) => [i * barSpacing + barOffset / 2, d.target / scale]);

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas camera={{ position: [chartWidth / 2, 20, 15], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[0, 10, 5]} />
        <OrbitControls enableZoom={false} />

        {data.map((d, i) => (
          <React.Fragment key={d.label}>
            <Bar
              x={i * barSpacing}
              height={d.rejected / scale}
              color="#ef4444"
              label={`R: ${d.rejected}`}
            />
            <Bar
              x={i * barSpacing + barOffset}
              height={d.produced / scale}
              color="#22c55e"
              label={`P: ${d.produced}`}
            />
            <TargetDot
              x={i * barSpacing + barOffset / 2}
              y={d.target / scale}
              value={d.target}
            />
            <Html position={[i * barSpacing + 0.3, -0.5, 0]}>
              <div style={{ fontSize: 12, color: '#000' }}>{d.label}</div>
            </Html>
          </React.Fragment>
        ))}

        <TargetLine points={targetPoints} />
      </Canvas>
    </div>
  );
};

export default ThreeDBarChart;
