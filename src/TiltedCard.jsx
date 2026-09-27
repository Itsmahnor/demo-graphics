import React from 'react';

/**
 * TiltedCard
 * Reusable "floating tilted card" component — the same visual pattern used
 * across remotion.dev's homepage showcase (chat bubble, video editor,
 * phone mockup). Give it your own content and it handles the tilt,
 * shadow, hover lift, and optional idle float animation.
 *
 * Usage:
 *   <TiltedCard rotate={-6}>
 *     <img src="/gi-product.png" alt="Rokai Gi" />
 *   </TiltedCard>
 */

let stylesInjected = false;

function injectStylesOnce() {
  if (stylesInjected || typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.textContent = `
    @keyframes tilted-card-float {
      0%   { transform: translateY(0px); }
      50%  { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
  `;
  document.head.appendChild(style);
  stylesInjected = true;
}

export const TiltedCard = ({
  children,
  rotate = -6,
  hoverRotate = -3,
  width = 340,
  shadowColor = 'rgba(0,0,0,0.18)',
  floating = true,
  floatDuration = 4,
  background = '#ffffff',
  borderRadius = 16,
  style = {},
  className = '',
}) => {
  React.useEffect(() => {
    injectStylesOnce();
  }, []);

  const [hovered, setHovered] = React.useState(false);

  return (
    <div
      className={className}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width,
        background,
        borderRadius,
        boxShadow: `0 30px 60px -10px ${shadowColor}`,
        transform: `rotate(${hovered ? hoverRotate : rotate}deg) scale(${hovered ? 1.03 : 1})`,
        transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.35s ease',
        animation: floating ? `tilted-card-float ${floatDuration}s ease-in-out infinite` : 'none',
        overflow: 'hidden',
        cursor: 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default TiltedCard;

/* ------------------------------------------------------------------ */
/* USAGE EXAMPLES — matching the 3 remotion.dev card styles, with your
   own Rokai content instead. Delete these once you've wired your own. */
/* ------------------------------------------------------------------ */

export const ExampleShowcaseRow = () => {
  return (
    <div style={{ display: 'flex', gap: 60, padding: 80, background: '#f5f5f5', flexWrap: 'wrap' }}>
      {/* Style 1: product image, tilted, like the "map" card */}
      <div>
        <TiltedCard rotate={-8} hoverRotate={-4}>
          <img
            src="/gi-product.png"
            alt="Rokai BJJ Gi"
            style={{ width: '100%', display: 'block' }}
          />
        </TiltedCard>
        <h3 style={{ marginTop: 24 }}>Premium fabric</h3>
        <p style={{ color: '#666' }}>Engineered for competition-grade durability.</p>
      </div>

      {/* Style 2: dark "editor" style card, like the timeline card */}
      <div>
        <TiltedCard rotate={4} hoverRotate={2} background="#111" width={380}>
          <div style={{ padding: 20, color: '#fff' }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff3b30', display: 'inline-block' }} />
            </div>
            <div style={{ height: 6, background: '#ff3b30', width: '70%', borderRadius: 4, marginBottom: 6 }} />
            <div style={{ height: 6, background: '#333', width: '90%', borderRadius: 4 }} />
          </div>
        </TiltedCard>
        <h3 style={{ marginTop: 24 }}>Custom fit builder</h3>
        <p style={{ color: '#666' }}>Adjust sizing live, see it update instantly.</p>
      </div>

      {/* Style 3: phone-shaped card, like the TikTok template card */}
      <div>
        <TiltedCard rotate={-5} hoverRotate={-2} width={220} borderRadius={28} floatDuration={5}>
          <img
            src="/gi-detail-shot.png"
            alt="Rokai detail"
            style={{ width: '100%', display: 'block', aspectRatio: '9/16', objectFit: 'cover' }}
          />
        </TiltedCard>
        <h3 style={{ marginTop: 24 }}>Every stitch, verified</h3>
        <p style={{ color: '#666' }}>Quality-checked before it ships.</p>
      </div>
    </div>
  );
};
