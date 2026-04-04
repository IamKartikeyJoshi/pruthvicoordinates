// Three-word tracking code generator
const words = [
  'river', 'mountain', 'eagle', 'forest', 'ocean', 'thunder', 'crystal', 'falcon',
  'meadow', 'canyon', 'sunrise', 'harbor', 'summit', 'valley', 'breeze', 'compass',
  'anchor', 'beacon', 'cedar', 'delta', 'ember', 'frost', 'grove', 'horizon',
  'ivory', 'jasper', 'kestrel', 'lotus', 'maple', 'north', 'opal', 'pearl',
  'quartz', 'ridge', 'silver', 'tundra', 'unity', 'vertex', 'willow', 'zenith',
  'amber', 'birch', 'coral', 'dune', 'echo', 'flame', 'glacier', 'hawk',
  'indigo', 'jade', 'kelp', 'lark', 'moss', 'nova', 'orbit', 'pine',
  'reef', 'sage', 'trail', 'swift', 'stone', 'spark', 'terra', 'thorn',
  'tiger', 'tulip', 'wave', 'wind', 'wolf', 'cloud', 'crane', 'drift',
  'fern', 'gale', 'haze', 'isle', 'mist', 'nest', 'oak', 'plum',
  'rain', 'raven', 'robin', 'seal', 'shore', 'snow', 'star', 'stem',
  'tide', 'vale', 'vine', 'wren', 'arch', 'bark', 'bloom', 'bolt',
];

export function generateTrackingCode(): string {
  const pick = () => words[Math.floor(Math.random() * words.length)];
  return `${pick()}-${pick()}-${pick()}`;
}

export function formatTrackingCode(code: string): string {
  return code.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' · ');
}
