import { useEffect, useRef, useState } from 'react';
import './directions.css';

const directions = [
  { id: 'powder', number: '01', name: 'Powder & slate', note: 'Cool powder blue. Deep grey-blue. Warm ivory.', colours: ['#dfe5ec', '#3a3a4a', '#f4f5f2'], description: 'Airy, precise and quietly unexpected. The cooler frame lets the warmth of your Roxelle interior lead.' },
  { id: 'burgundy', number: '02', name: 'Muted oxblood', note: 'Soft burgundy. Smoked crimson. Porcelain.', colours: ['#785054', '#e9dcda', '#f8f4ef'], description: 'Warmer and more intimate. A softened crimson undertone gives the editorial typography a richer presence.' },
];

function Mockup({ direction }) {
  const frame = useRef(null);
  const [scale, setScale] = useState(0.45);
  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / 1280));
    observer.observe(frame.current);
    return () => observer.disconnect();
  }, []);
  return <article className="direction-card">
    <div className="direction-heading"><span>{direction.number}</span><h2>{direction.name}</h2><div className="direction-swatches" aria-label={direction.note}>{direction.colours.map(colour => <span key={colour} style={{ background: colour }} title={colour} />)}</div></div>
    <p className="direction-note">{direction.note}</p>
    <a className="direction-frame" ref={frame} style={{ height: 1090 * scale }} href={`/?palette=${direction.id}`} aria-label={`Open ${direction.name} full-size mockup`}>
      <iframe title={`${direction.name} homepage mockup`} src={`/?palette=${direction.id}`} tabIndex={-1} style={{ transform: `scale(${scale})` }} />
    </a>
    <p className="direction-description">{direction.description}</p>
    <a className="direction-open" href={`/?palette=${direction.id}`}>Explore this direction <span aria-hidden="true">↗</span></a>
  </article>;
}

export default function Directions() {
  useEffect(() => { document.title = 'Velaire — Two colour directions'; document.documentElement.lang = 'en'; }, []);
  return <main className="directions">
    <header><p className="directions-eyebrow">VELAIRE / DESIGN STUDY</p><h1>A different shade<br />of <em>Velaire.</em></h1><p>Your living-room photograph. Two restrained palettes.<br />The same complete site, ready to explore.</p></header>
    <div className="directions-grid">{directions.map(direction => <Mockup key={direction.id} direction={direction} />)}</div>
    <footer>Private design preview · Choose a direction to explore all six pages · EN / 简体 / 繁體</footer>
  </main>;
}
