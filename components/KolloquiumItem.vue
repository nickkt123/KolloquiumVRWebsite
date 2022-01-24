<template>
    <ListItem
        :selected="selected"
    >
        <div class="flex flex-row w-full">
            <div v-if="!inEdit" class="w-full select-none text-left mr-1">
                {{ title }}
            </div>
            <input v-if="inEdit" class="w-full rounded border p-1" v-model="title" placeholder="Neues Kolloquium...">
            <button
                v-if="!inEdit"
                class="text-center text-white rounded-md select-none w-9 h-8 ml-1 bg-blue-500 hover:bg-blue-700 active:bg-blue-900 pb-1">&#9993;</button>
            <button
                v-if="inEdit"
                @click.native="save()"
                class="text-center text-white rounded-md select-none w-9 h-8 ml-1 bg-green-500 hover:bg-green-700 active:bg-green-900">✓</button>
            <button
                v-if="!inEdit"
                class="text-center text-white rounded-md select-none w-9 h-8 ml-1 bg-yellow-500 hover:bg-yellow-700 active:bg-yellow-900">✎</button>
            <button
                class="text-center text-white rounded-md select-none w-9 h-8 ml-1 bg-red-500 hover:bg-red-700 active:bg-red-900">╳</button>
        </div>
    </ListItem>
</template>

<script>
import ListItem from '~/components/ListItem'

export default {
    components: {
        ListItem
    },
    props: {
        title: {
            type: String,
            required: true,
        },
        selected: {
            type: Boolean,
            required: false,
            default: false,
        },
        inEdit: {
            type: Boolean,
            required: false,
            default: false
        },
    },
    methods: {
        save() {
            console.log("save me!")
        }
    }
}
</script>
