// src/components/ParticlesBackground.jsx
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";

const ParticlesBackground = () => {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        background: {
          color: "#f4f4f4"
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: { enable: true, mode: "push" },
            onHover: { enable: true, mode: "repulse" },
            resize: true
          },
          modes: {
            push: { quantity: 4 },
            repulse: { distance: 100, duration: 0.4 }
          }
        },
        particles: {
          color: { value: "#ff6b81" },
          links: { enable: false },
          collisions: { enable: true },
          move: { enable: true, speed: 1, outModes: "bounce" },
          number: { value: 20 },
          opacity: { value: 0.8 },
          shape: {
            type: "image",
            image: [
              {
                src: "https://cdn-icons-png.flaticon.com/512/1170/1170678.png", // shopping bag
                width: 32,
                height: 32,
              },
              {
                src: "https://cdn-icons-png.flaticon.com/512/107/107831.png", // cart
                width: 32,
                height: 32,
              },
              {
                src: "https://cdn-icons-png.flaticon.com/512/2541/2541988.png", // heart
                width: 32,
                height: 32,
              },
            ]
          },
          size: { value: 20 },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticlesBackground;
