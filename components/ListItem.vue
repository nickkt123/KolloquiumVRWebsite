<template>
    <button
        class="w-full border rounded mb-1 p-1 bg-blue-50 active:bg-blue-300"
        :class="selected ? 'bg-blue-200' : 'hover:bg-blue-100'"
    >
        <div class="flex flex-row">
            <slot></slot>
        </div>
    </button>
</template>

<script>
export default {
    props: {
        selected: {
            type: Boolean,
            required: false,
            default: false,
        },
    }
}
</script>
