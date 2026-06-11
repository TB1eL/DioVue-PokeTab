<template>
    <div class="loader" role="status" :aria-label="label">
        <svg class="ball" viewBox="0 0 64 64" width="48" height="48">
            <circle cx="32" cy="32" r="28" fill="#f4f7fc"/>
            <path d="M4 32a28 28 0 0 1 56 0Z" fill="#ec4747"/>
            <rect x="4" y="28" width="56" height="8" fill="#0a0d18"/>
            <circle cx="32" cy="32" r="28" fill="none" stroke="#0a0d18" stroke-width="3"/>
            <circle cx="32" cy="32" r="10" fill="#0a0d18"/>
            <circle cx="32" cy="32" r="6" fill="#f4f7fc"/>
        </svg>

        <p v-if="label" class="label">{{ label }}</p>
    </div>
</template>

<script>
    export default {
        name: 'PokeballLoader',
        props: { label: { type: String, default: '' } }
    }
</script>

<style scoped>
    .loader {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.9rem;
        padding: 2.5rem 0;
    }

    .ball {
        animation: wobble 1.1s ease-in-out infinite;
        transform-origin: center;
        filter: drop-shadow(0 8px 16px rgba(236, 71, 71, 0.35));
    }

    .label { color: var(--muted); font-size: 0.82rem; }
        @keyframes wobble {
        0%, 100% { transform: rotate(-14deg); }
        50%      { transform: rotate(14deg); }
    }
    
    @media (prefers-reduced-motion: reduce) {
        .ball { animation: spin 1.4s linear infinite; }
    }
</style>