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

export function artworkUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
}

export function spriteUrl(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
}

let indexCache = null

/** Índice completo da Pokédex Nacional: [{ id, name }]. */
export async function getIndex() {
  if (indexCache) return indexCache
  const data = await getJSON(`${BASE}/pokemon?limit=20000`)
  indexCache = data.results
    .map(p => ({ id: idFromUrl(p.url), name: p.name }))
    .filter(p => p.id && p.id <= MAX_DEX)
    .sort((a, b) => a.id - b.id)
  return indexCache
}

/** Detalhe normalizado de um Pokémon (stats, tipos, físico, habilidades). */
export async function getPokemon(idOrName) {
  const data = await getJSON(`${BASE}/pokemon/${idOrName}`)
  return {
    id: data.id,
    name: data.name,
    types: data.types.map(t => t.type.name),
    stats: data.stats.map(s => ({ name: s.stat.name, value: s.base_stat })),
    totalStats: data.stats.reduce((sum, s) => sum + s.base_stat, 0),
    height: data.height / 10, // metros
    weight: data.weight / 10, // kg
    abilities: data.abilities.map(a => ({
      name: a.ability.name,
      hidden: a.is_hidden
    })),
    baseExperience: data.base_experience,
    artwork: data.sprites?.other?.['official-artwork']?.front_default || artworkUrl(data.id),
    sprite: data.sprites?.front_default || spriteUrl(data.id)
  }
}

/** Informações da espécie: descrição, categoria, raridade, evolução. */
export async function getSpecies(idOrName) {
  const data = await getJSON(`${BASE}/pokemon-species/${idOrName}`)

  // Preferimos a entrada em inglês mais recente (a PokeAPI não tem pt-BR).
  const flavor = [...data.flavor_text_entries]
    .reverse()
    .find(e => e.language.name === 'en')
  const genus = data.genera.find(g => g.language.name === 'en')

  return {
    flavorText: flavor ? flavor.flavor_text.replace(/[\n\f\r]/g, ' ') : '',
    genus: genus ? genus.genus : '',
    isLegendary: data.is_legendary,
    isMythical: data.is_mythical,
    color: data.color?.name,
    habitat: data.habitat?.name || null,
    captureRate: data.capture_rate,
    baseHappiness: data.base_happiness,
    growthRate: data.growth_rate?.name,
    eggGroups: data.egg_groups.map(g => g.name),
    evolutionChainUrl: data.evolution_chain?.url
  }
}

/** Cadeia evolutiva linearizada: [{ id, name }]. */
export async function getEvolutionChain(url) {
  if (!url) return []
  const data = await getJSON(url)
  const chain = []
  let node = data.chain
  while (node) {
    chain.push({ name: node.species.name, id: idFromUrl(node.species.url) })
    node = node.evolves_to?.[0]
  }
  return chain
}

/** Lista de Pokémon de um tipo (para o filtro): [{ id, name }]. */
export async function getByType(type) {
  const data = await getJSON(`${BASE}/type/${type}`)
  return data.pokemon
    .map(p => ({ id: idFromUrl(p.pokemon.url), name: p.pokemon.name }))
    .filter(p => p.id && p.id <= MAX_DEX)
    .sort((a, b) => a.id - b.id)
}
