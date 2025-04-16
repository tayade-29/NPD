import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';

const Bar = ({ position, height, color }) => (
  <mesh position={[...position]}>
    <boxGeometry args={[0.5, height, 0.5]} />
    <meshStandardMaterial color={color} />
  </mesh>
);

const ToolLabel = ({ text, position }) => (
  <Text
    position={position}
    fontSize={0.2}
    color="black"
    anchorX="center"
    anchorY="middle"
  >
    {text}
  </Text>
);

const TargetLine = ({ y }) => (
  <mesh position={[0, y, 0]}>
    <boxGeometry args={[5, 0.02, 0.02]} />
    <meshStandardMaterial color="lightblue" />
  </mesh>
);

const ThreeDProductionChart = () => {
  const data = [
    { label: 'T0', produced: 14, rejected: 3, target: 200 },
    { label: 'T1', produced: 10, rejected: 4, target: 200 },
    { label: 'T2', produced: 82, rejected: 0, target: 200 },
    { label: 'T3', produced: 144, rejected: 0, target: 200 },
    { label: 'T4', produced: 152, rejected: 0, target: 200 },
  ];

  return (
    <Canvas camera={{ position: [5, 5, 10], fov: 50 }}>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />

      {data.map((d, i) => {
        const x = i * 1.5;
        const producedHeight = d.produced / 10;
        const rejectedHeight = d.rejected / 10;

        return (
          <group key={i}>
            <Bar
              position={[x, producedHeight / 2, 0]}
              height={producedHeight}
              color="green"
            />
            <Bar
              position={[x, producedHeight + rejectedHeight / 2, 0]}
              height={rejectedHeight}
              color="red"
            />
            <ToolLabel text={d.label} position={[x, -0.5, 0]} />
          </group>
        );
      })}

      {/* Target line at y = 200 / 10 */}
      <TargetLine y={200 / 10} />
    </Canvas>
  );
};

export default ThreeDProductionChart;
