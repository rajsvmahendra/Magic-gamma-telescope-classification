# MAGIC GAMMA EXPLORER — Frontend Interface

## Planned Technology Stack
- **Framework:** React 18 + Vite
- **3D Scientific Visuals:** Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
- **Animations & Storytelling:** GSAP (GreenSock Animation Platform)
- **Icons:** Lucide React

## Structure Preview (To Be Built in Later Phases)
```
frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── index.css
    ├── components/
    │   ├── canvas/          # 3D PMT Camera Plane & Shower Ellipse
    │   ├── observatory/     # Telescope specs & cosmic ray physics
    │   ├── laboratory/      # Feature analysis & metrics
    │   └── predictor/       # Interactive real-time prediction sliders
    └── services/
        └── api.js           # REST API communication with FastAPI backend
```
