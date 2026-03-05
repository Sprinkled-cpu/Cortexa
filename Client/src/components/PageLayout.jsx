import LightPillar from "./LightPillar";

export default function PageLayout({ children }) {
    return (
        <div className="relative min-h-screen bg-gray-950">
            <div className="fixed inset-0 z-0 pointer-events-none">
                <LightPillar
                    topColor="#7c3aed"
                    bottomColor="#6366f1"
                    intensity={0.6}
                    rotationSpeed={0.2}
                    glowAmount={0.004}
                    pillarWidth={2.5}
                    pillarHeight={0.3}
                    noiseIntensity={0.3}
                    quality="medium"
                />
            </div>
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
}
