<template>
    <button
        class="w-full border rounded mb-1 p-1 bg-blue-50 hover:bg-blue-100 active:bg-blue-300"
        :class="selected ? 'bg-blue-200' : ''"
    >
        <div class="flex flex-row">
            <div class="w-full select-none text-left mr-1">
                <slot></slot>
            </div>
            <button v-if="shareAction" class="bg-blue-500 hover:bg-blue-700 text-white pb-1 text-center rounded-md select-none w-9 h-8">&#9993;</button>
            <button v-if="saveAction" class="bg-green-500 hover:bg-green-700 active:bg-green-900 text-white ml-1 pb-1 text-center rounded-md select-none w-9 h-8">✓</button>
            <button v-if="editAction" class="bg-yellow-500 hover:bg-yellow-700 active:bg-yellow-900 text-white ml-1 pb-1 text-center rounded-md select-none w-9 h-8">✎</button>
            <button v-if="deleteAction" class="bg-red-500 hover:bg-red-700 active:bg-red-900 text-white ml-1 pb-1 text-center rounded-md select-none w-9 h-8">╳</button>
        </div>
    </button>
</template>

<script>
export default {
    props: {
        selected: Boolean,
        shareAction: String,
        editAction: String,
        deleteAction: String,
        saveAction: String
    }
}
</script>