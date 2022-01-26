<template>
    <ListItem
        :selected="selected"
    >
        <div class="flex flex-row w-full">
            <div v-if="!inEdit" class="w-full select-none text-left mr-1">
                {{ title }}
            </div>
            <input v-if="inEdit" class="w-full rounded border p-1" v-model="title" placeholder="Neues Kolloquium..." />
            <client-only>
                <button
                    v-if="inEdit"
                    @click="save()"
                    class="text-center text-white rounded-md select-none w-9 h-8 ml-1 bg-green-500 hover:bg-green-700 active:bg-green-900"
                >
                    ✓
                </button>
                <button
                    v-if="!inEdit"
                    @click="edit()"
                    class="text-center text-white rounded-md select-none w-9 h-8 ml-1 bg-yellow-500 hover:bg-yellow-700 active:bg-yellow-900"
                >
                    ✎
                </button>            
                <button
                    class="text-center text-white rounded-md select-none w-9 h-8 ml-1 bg-red-500 hover:bg-red-700 active:bg-red-900"
                    @click="deleteMe()"
                >
                    ╳
                </button>
            </client-only>
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
            this.$emit("update:inEdit", false);
            this.$emit("update:title", this.title);
        },
        edit() {
            this.$emit("update:inEdit", true);
        },
        deleteMe() {
            this.$emit("deleteKolloquium")
        }
    }
}
</script>
