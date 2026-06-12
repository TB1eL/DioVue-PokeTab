// Cores oficiais por tipo (usadas em badges, gradientes e auras).
export const TYPE_COLORS = {
  normal: '#9099a1', fire: '#ff6242', water: '#4d90d5', electric: '#f3d23b',
  grass: '#63bb5b', ice: '#74cec0', fighting: '#ce4069', poison: '#ab6ac8',
  ground: '#d97746', flying: '#8aa9e0', psychic: '#f97176', bug: '#90c12c',
  rock: '#c7b78b', ghost: '#5269ac', dragon: '#0a6dc4', dark: '#5a5366',
  steel: '#5a8ea1', fairy: '#ec8fe6'
}

// Rótulos em português para os tipos.
export const TYPE_LABELS_PT = {
  normal: 'Normal', fire: 'Fogo', water: 'Água', electric: 'Elétrico',
  grass: 'Planta', ice: 'Gelo', fighting: 'Lutador', poison: 'Veneno',
  ground: 'Terra', flying: 'Voador', psychic: 'Psíquico', bug: 'Inseto',
  rock: 'Pedra', ghost: 'Fantasma', dragon: 'Dragão', dark: 'Sombrio',
  steel: 'Aço', fairy: 'Fada'
}

// Emojis dos tipos mais usados na navegação.
export const TYPE_EMOJI = {
  fire: '🔥', water: '💧', grass: '🌿', electric: '⚡', psychic: '🔮',
  ice: '❄️', dragon: '🐉', dark: '🌙', fairy: '✨', ghost: '👻'
}

// Rótulos em português para os atributos de status.
export const STAT_LABELS = {
  hp: 'HP', attack: 'Ataque', defense: 'Defesa',
  'special-attack': 'Atq. Esp.', 'special-defense': 'Def. Esp.', speed: 'Velocidade'
}

// Faixas de ID de cada geração, usadas no filtro.
export const GENERATIONS = [
  { id: 1, label: 'Gen I', range: [1, 151] },
  { id: 2, label: 'Gen II', range: [152, 251] },
  { id: 3, label: 'Gen III', range: [252, 386] },
  { id: 4, label: 'Gen IV', range: [387, 493] },
  { id: 5, label: 'Gen V', range: [494, 649] },
  { id: 6, label: 'Gen VI', range: [650, 721] },
  { id: 7, label: 'Gen VII', range: [722, 809] },
  { id: 8, label: 'Gen VIII', range: [810, 905] },
  { id: 9, label: 'Gen IX', range: [906, 1025] }
]

export function typeColor(type) {
  return TYPE_COLORS[type?.toLowerCase()] || '#777'
}

export function typeLabel(type) {
  return TYPE_LABELS_PT[type?.toLowerCase()] || type
}

export function statLabel(stat) {
  return STAT_LABELS[stat] || stat
}

