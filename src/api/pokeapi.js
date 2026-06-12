// Cliente da PokeAPI (https://pokeapi.co) — a maior base de dados pública de
// Pokémon, com a Pokédex Nacional completa (mais de 1000 Pokémon).
// Inclui cache em memória para evitar requisições repetidas.

const BASE = 'https://pokeapi.co/api/v2'
const MAX_DEX = 1025 // Pokédex Nacional (ignora formas alternativas com id 10000+)

const cache = new Map()

async function getJSON(url) {
  if (cache.has(url)) return cache.get(url)
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Falha ao buscar ${url} (${res.status})`)
  const data = await res.json()
  cache.set(url, data)
  return data
}

// Extrai o id numérico de uma URL da PokeAPI (.../pokemon/25/).
function idFromUrl(url) {
  const m = url.match(/\/(\d+)\/?$/)
  return m ? Number(m[1]) : null
}

