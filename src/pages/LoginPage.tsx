import { useEffect, useRef } from 'react';
import './LoginPage.css';

const LoginPage = () => {
    const leftPupilRefs = useRef<(SVGCircleElement | null)[]>([]);
    const rightPupilRefs = useRef<(SVGCircleElement | null)[]>([]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            leftPupilRefs.current.forEach(pupil => {
                const char = pupil?.closest('.char') as HTMLElement | null;
                if (!char) return;
                const rect = char.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = mouseX - cx;
                const dy = mouseY - cy;
                const angle = Math.atan2(dy, dx);
                const radius = 6;
                const offsetX = Math.cos(angle) * radius;
                const offsetY = Math.sin(angle) * radius;
                pupil?.setAttribute('transform', `translate(${offsetX},${offsetY})`);
            });
            rightPupilRefs.current.forEach(pupil => {
                const char = pupil?.closest('.char') as HTMLElement | null;
                if (!char) return;
                const rect = char.getBoundingClientRect();
                const cx = rect.left + rect.width / 2;
                const cy = rect.top + rect.height / 2;
                const dx = mouseX - cx;
                const dy = mouseY - cy;
                const angle = Math.atan2(dy, dx);
                const radius = 6;
                const offsetX = Math.cos(angle) * radius;
                const offsetY = Math.sin(angle) * radius;
                pupil?.setAttribute('transform', `translate(${offsetX},${offsetY})`);
            });
        };
        document.addEventListener('mousemove', handleMouseMove);
        return () => document.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const characters = [
        { bodyColor: '#ffb400' }, // orange
        { bodyColor: '#7c4dff' }, // purple
        { bodyColor: '#4a90e2' }, // blue
        { bodyColor: '#f5a623' }, // yellow
        { bodyColor: '#ff6b6b' }, // red‑orange
    ];

    return (
        <div className="login-card">

            <form className="login-form">
                <input type="email" placeholder="Email" required />
                <input type="password" placeholder="Password" required />
                <button type="submit">Log In</button>
            </form>
            <div className="characters">
                {characters.map((c, i) => (
                    <svg
                        key={i}
                        className="char"
                        viewBox="0 0 100 100"
                        style={{ '--body-color': c.bodyColor } as React.CSSProperties}
                    >
                        <circle className="body" cx="50" cy="50" r="40" />
                        <circle className="eye" cx="35" cy="40" r="10" />
                        <circle className="eye" cx="65" cy="40" r="10" />
                        <circle
                            className="pupil left-pupil"
                            cx="35"
                            cy="40"
                            r="4"
                            ref={el => { leftPupilRefs.current[i] = el; }}
                        />
                        <circle
                            className="pupil right-pupil"
                            cx="65"
                            cy="40"
                            r="4"
                            ref={el => { rightPupilRefs.current[i] = el; }}
                        />
                        <path className="mouth" d="M30,65 Q50,80 70,65" />
                    </svg>
                ))}
            </div>
        </div>
    );
};

export default LoginPage;
