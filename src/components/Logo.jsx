function Logo({ size = 40, showName = true, stacked = false }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: stacked ? "column" : "row",
        alignItems: "center",
        gap: stacked ? "10px" : "12px",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Aurum logo"
      >
        <defs>
          <linearGradient id="aurumGold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d4b46a" />
            <stop offset="100%" stopColor="#8a6c2f" />
          </linearGradient>
        </defs>
        <circle cx="32" cy="32" r="30" fill="url(#aurumGold)" />
        <circle
          cx="32"
          cy="32"
          r="25"
          fill="none"
          stroke="#faf8f4"
          strokeWidth="1.2"
          opacity="0.7"
        />
        <text
          x="32"
          y="43"
          textAnchor="middle"
          fontFamily="'Playfair Display', Georgia, serif"
          fontSize="32"
          fontWeight="700"
          fill="#faf8f4"
        >
          A
        </text>
      </svg>

      {showName && (
        <div style={{ textAlign: stacked ? "center" : "left", lineHeight: 1.1 }}>
          <div
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: stacked ? "30px" : "22px",
              fontWeight: 700,
              letterSpacing: "2px",
              color: "#1f2430",
            }}
          >
            AURUM
          </div>
          {stacked && (
            <div
              style={{
                fontSize: "11px",
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: "#9a7b3c",
                marginTop: "6px",
              }}
            >
              Smart money, beautifully kept
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Logo;