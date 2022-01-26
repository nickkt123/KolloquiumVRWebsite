<template>
    <ListItem
        :selected="selected"
    >
        <div class="flex flex-row w-full">
            <div class="w-full select-none text-left mr-1">
                {{ title }}
            </div>
            <div
                class="text-center text-white rounded-md select-none w-9 h-8 ml-1 bg-red-500 hover:bg-red-700 active:bg-red-900">╳</div>
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
    },
    methods: {
    }
}
</script>
