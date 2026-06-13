// Original cartoon characters (inspired by Mat the rat, Pat the mouse & Dan the man).
export const Mat = ({ size = 70 }) => (
  <svg
    width={size}
    height={size * 1.3}
    viewBox="0 0 120 156"
    aria-label="Mat the rat"
  >
    <path
      d="M80 118 C112 122 116 96 102 90"
      fill="none"
      stroke="#eda03c"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <ellipse cx="30" cy="34" rx="19" ry="22" fill="#f3b964" />
    <ellipse cx="90" cy="34" rx="19" ry="22" fill="#f3b964" />
    <ellipse cx="31" cy="35" rx="10" ry="13" fill="#f8d3a4" />
    <ellipse cx="89" cy="35" rx="10" ry="13" fill="#f8d3a4" />
    <ellipse cx="60" cy="56" rx="25" ry="22" fill="#f3b964" />
    {/* plaid cap */}
    <path d="M36 40 A24 21 0 0 1 84 40 Z" fill="#4a7fc1" />
    <g stroke="#d6402f" strokeWidth="2.6" opacity="0.9">
      <line x1="50" y1="23" x2="50" y2="40" />
      <line x1="60" y1="20" x2="60" y2="40" />
      <line x1="70" y1="23" x2="70" y2="40" />
      <line x1="39" y1="30" x2="81" y2="30" />
      <line x1="38" y1="36" x2="82" y2="36" />
    </g>
    <ellipse cx="60" cy="41" rx="28" ry="4.5" fill="#d6402f" />
    {/* eyes */}
    <circle cx="51" cy="52" r="6" fill="#fff" stroke="#333" strokeWidth="1" />
    <circle cx="69" cy="52" r="6" fill="#fff" stroke="#333" strokeWidth="1" />
    <circle cx="51" cy="53" r="2.5" fill="#222" />
    <circle cx="69" cy="53" r="2.5" fill="#222" />
    {/* long nose */}
    <path d="M60 56 C55 62 54 70 60 76 C66 70 65 62 60 56" fill="#eda03c" />
    <circle cx="60" cy="74" r="2.4" fill="#a86a2a" />
    {/* whiskers */}
    <g stroke="#3a3a3a" strokeWidth="1.3">
      <line x1="36" y1="60" x2="50" y2="62" />
      <line x1="36" y1="66" x2="50" y2="66" />
      <line x1="84" y1="60" x2="70" y2="62" />
      <line x1="84" y1="66" x2="70" y2="66" />
    </g>
    {/* red tee */}
    <path d="M42 76 L78 76 L81 110 L39 110 Z" fill="#e6492f" />
    <ellipse cx="41" cy="81" rx="7" ry="6" fill="#e6492f" />
    <ellipse cx="79" cy="81" rx="7" ry="6" fill="#e6492f" />
    <path
      d="M38 86 C36 94 36 102 39 110"
      stroke="#f3b964"
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M82 86 C84 94 84 102 81 110"
      stroke="#f3b964"
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
    />
    {/* navy pants */}
    <rect x="45" y="110" width="12" height="26" rx="3" fill="#2e3f6e" />
    <rect x="63" y="110" width="12" height="26" rx="3" fill="#2e3f6e" />
    {/* white shoes */}
    <ellipse
      cx="51"
      cy="139"
      rx="11"
      ry="5.5"
      fill="#fff"
      stroke="#b9c2cc"
      strokeWidth="1.5"
    />
    <ellipse
      cx="69"
      cy="139"
      rx="11"
      ry="5.5"
      fill="#fff"
      stroke="#b9c2cc"
      strokeWidth="1.5"
    />
  </svg>
);

export const Pat = ({ size = 70 }) => (
  <svg
    width={size}
    height={size * 1.3}
    viewBox="0 0 120 156"
    aria-label="Pat the mouse"
  >
    <path
      d="M76 118 C108 122 112 94 100 86"
      fill="none"
      stroke="#8e99a4"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <g transform="translate(99 84) rotate(-20)" fill="#f0871f">
      <path d="M0 0 L-10 -6 L-10 6 Z" />
      <path d="M0 0 L10 -6 L10 6 Z" />
      <circle r="2.6" fill="#c96a10" />
    </g>
    <ellipse cx="34" cy="30" rx="20" ry="24" fill="#aab3bd" />
    <ellipse cx="86" cy="30" rx="20" ry="24" fill="#aab3bd" />
    <ellipse cx="35" cy="31" rx="11" ry="15" fill="#eec3cd" />
    <ellipse cx="85" cy="31" rx="11" ry="15" fill="#eec3cd" />
    <ellipse cx="60" cy="52" rx="23" ry="21" fill="#bcc5cd" />
    {/* pink bow */}
    <g transform="translate(60 25)" fill="#ef4d8d">
      <path d="M0 0 L-13 -7 L-13 7 Z" />
      <path d="M0 0 L13 -7 L13 7 Z" />
      <circle r="3.4" fill="#c92a6b" />
    </g>
    {/* lidded eyes + lashes */}
    <circle cx="51" cy="49" r="4.6" fill="#fff" />
    <circle cx="69" cy="49" r="4.6" fill="#fff" />
    <circle cx="51.5" cy="50" r="2.2" fill="#222" />
    <circle cx="68.5" cy="50" r="2.2" fill="#222" />
    <path
      d="M45 47 Q51 41 57 47"
      stroke="#8e99a4"
      strokeWidth="1.6"
      fill="none"
    />
    <path
      d="M63 47 Q69 41 75 47"
      stroke="#8e99a4"
      strokeWidth="1.6"
      fill="none"
    />
    <g stroke="#222" strokeWidth="1.2">
      <line x1="46" y1="45" x2="43" y2="42" />
      <line x1="74" y1="45" x2="77" y2="42" />
    </g>
    {/* nose, whiskers */}
    <ellipse cx="60" cy="62" rx="3.4" ry="2.6" fill="#6b4d4d" />
    <g stroke="#8e99a4" strokeWidth="1.3">
      <line x1="38" y1="58" x2="51" y2="60" />
      <line x1="38" y1="64" x2="51" y2="63" />
      <line x1="82" y1="58" x2="69" y2="60" />
      <line x1="82" y1="64" x2="69" y2="63" />
    </g>
    {/* yellow dress with pink dots */}
    <path
      d="M48 72 L72 72 L82 114 L38 114 Z"
      fill="#ffd23f"
      stroke="#eab308"
      strokeWidth="1.5"
    />
    <ellipse cx="46" cy="76" rx="6" ry="5" fill="#ffd23f" />
    <ellipse cx="74" cy="76" rx="6" ry="5" fill="#ffd23f" />
    <g fill="#ef4d8d" opacity="0.85">
      <circle cx="53" cy="86" r="2" />
      <circle cx="65" cy="82" r="2" />
      <circle cx="58" cy="98" r="2" />
      <circle cx="70" cy="100" r="2" />
      <circle cx="48" cy="105" r="2" />
      <circle cx="62" cy="110" r="2" />
    </g>
    <path
      d="M43 80 C36 90 33 98 34 106"
      stroke="#bcc5cd"
      strokeWidth="4.5"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M77 80 C84 90 87 98 86 106"
      stroke="#bcc5cd"
      strokeWidth="4.5"
      fill="none"
      strokeLinecap="round"
    />
    {/* legs + orange heels */}
    <line
      x1="52"
      y1="114"
      x2="52"
      y2="138"
      stroke="#bcc5cd"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <line
      x1="68"
      y1="114"
      x2="68"
      y2="138"
      stroke="#bcc5cd"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path d="M45 138 L57 138 L59 146 L43 146 Z" fill="#f0871f" />
    <path d="M61 138 L73 138 L75 146 L59 146 Z" fill="#f0871f" />
  </svg>
);

export const Dan = ({ size = 70 }) => (
  <svg
    width={size}
    height={size * 1.3}
    viewBox="0 0 120 156"
    aria-label="Dan the man"
  >
    {/* head */}
    <ellipse cx="60" cy="40" rx="18" ry="19" fill="#f2c79b" />
    {/* blonde hair */}
    <path
      d="M42 36 Q42 16 60 15 Q78 16 78 36 Q69 25 60 26 Q51 25 42 36"
      fill="#e9c33c"
    />
    {/* face */}
    <circle cx="53" cy="41" r="2.4" fill="#222" />
    <circle cx="67" cy="41" r="2.4" fill="#222" />
    <path
      d="M52 49 Q60 56 68 49"
      stroke="#a05a2c"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    {/* neck */}
    <rect x="56" y="57" width="8" height="8" fill="#f2c79b" />
    {/* teal shirt */}
    <path d="M40 64 L80 64 L83 104 L37 104 Z" fill="#2e7d8c" />
    <path
      d="M53 64 L60 71 L67 64"
      fill="none"
      stroke="#205b66"
      strokeWidth="2"
    />
    <ellipse cx="38" cy="71" rx="7" ry="8" fill="#2e7d8c" />
    <ellipse cx="82" cy="71" rx="7" ry="8" fill="#2e7d8c" />
    <path
      d="M36 79 C33 88 33 95 35 102"
      stroke="#f2c79b"
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
    />
    <path
      d="M84 79 C87 88 87 95 85 102"
      stroke="#f2c79b"
      strokeWidth="5"
      fill="none"
      strokeLinecap="round"
    />
    {/* khaki pants */}
    <rect x="43" y="104" width="15" height="32" rx="4" fill="#c8a951" />
    <rect x="62" y="104" width="15" height="32" rx="4" fill="#c8a951" />
    {/* gray shoes */}
    <ellipse
      cx="50"
      cy="139"
      rx="11"
      ry="5.5"
      fill="#cfc8bd"
      stroke="#9a948a"
      strokeWidth="1.5"
    />
    <ellipse
      cx="71"
      cy="139"
      rx="11"
      ry="5.5"
      fill="#cfc8bd"
      stroke="#9a948a"
      strokeWidth="1.5"
    />
  </svg>
);
