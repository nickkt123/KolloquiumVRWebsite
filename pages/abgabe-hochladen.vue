<template>
    <div class="relative flex flex-col items-center justify-top min-h-screen bg-gray-100 sm:items-top sm:pt-0">
        <box>
            <template slot="title">
                Abgabe Hochladen
            </template>
            <template slot="content">
                Auf dieser Seite kann man seine CAD/Datasmith-Datei hochladen.
            </template>
        </box>
        <box>
            <template slot="title">
                Details
            </template>
            <template slot="content">
                <div class="flex flex-row items-center mb-1">Name: <input class="ml-1 w-full rounded border p-1" v-model="name"></div>
                <div class="flex flex-row items-center mb-1">Matrikelnummer: <input class="ml-1 w-full rounded border p-1" v-model="matrikelnummer"></div>
                <div class="flex flex-row items-center mb-1">Datei: <input type=file class="ml-1 w-full rounded border p-1"></div>
                <button class="border rounded mt-4 p-2 font-semibold text-white bg-green-500 hover:bg-green-600 focus:bg-green-700">Hochladen</button>
            </template>
        </box>
    </div>
</template>

<script>
import Box from '~/components/Box'
import ListItem from '~/components/ListItem'

export default {
    components: {
        Box,
        ListItem
    },
    data() {
      return {
            kolloquium: "Test Kolloquium",
            abgabe: {
                name: "Nick Kleine-Tebbe",
                matrikelnummer: "355557",
            }
        }
    },
    methods: {

    }
}
</script>
