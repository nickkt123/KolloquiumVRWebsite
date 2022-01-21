<template>
    <div
        class="relative flex flex-col items-center justify-top min-h-screen bg-gray-100 sm:items-top sm:pt-0"
    >
        <box>
            <template slot="title">
                KolloquiumVR Control Panel
            </template>
            <template slot="content">
                Auf dieser Seite wird man Kolloquium-Ordner erstellen können, und Datasmith/CAD-Dateien hochlanden.
            </template>
        </box>
        <box>
            <template slot="title">
                Kolloquien
            </template>
            <template slot="content">
                <ListItem
                    v-for="kolloquium in kolloquiums"
                    :key="kolloquium"
                    @click.native="selectKolloquium(kolloquium)"
                    :selected="selectedKolloquium===kolloquium"
                    :shareAction="'link'"
                    :editAction="'edit me'"
                    :deleteAction="'delete_this'"
                >{{ kolloquium }}</ListItem>
                <ListItem
                    :saveAction="'saveMe'"
                    :deleteAction="'abort'">
                    <input class="w-full rounded border p-1" v-model="neuesKolloquium" placeholder="Neues Kolloquium...">
                </ListItem>
                <ListItem
                    @click.native="createNewKolloquium()"
                >+ Neues Kolloquium erstellen...</ListItem>
            </template>
        </box>
        <box>
            <template slot="title">
            Details
            </template>
            <template slot="content">
                <p class="text-xl"><span class="font-semibold">Titel:</span> {{ selectedKolloquium }}</p>
                <p class="font-semibold mt-4">Abgaben:</p>
                <ListItem
                    v-for="abgabe in abgaben"
                    :key="abgabe"
                    @click.native="selectAbgabe(abgabe)"
                    :deleteAction="'delete_this'"
                >{{ abgabe }}</ListItem>
                <button class="border rounded mt-4 p-2 font-semibold text-white bg-green-500 hover:bg-green-600 focus:bg-green-700">Aktivieren</button>
            </template>
        </box>
    </div>
</template>

<script>
import Box from '~/components/Box'
import List from '~/components/List'
import ListItem from '~/components/ListItem'

export default {
    components: {
        Box,
        List,
        ListItem
    },
    data() {
        return {
            selectedKolloquium: "",
            selectedAbgabe: "",
            kolloquiums: [
                "Hier ist eine Liste von Kolloquien.",
                "Man kann eines auswählen um zu sehen, welche Abgaben eingereicht wurden.",
                "Man kann ein Kolloquium erstellen oder löschen.",
            ],
            newKolloquium: "",
            abgaben: [
                "Hier ist eine Liste von Abgaben für das ausgewählte Kolloquium.",
                "Man kann einzelne Abgaben löschen.",
                "Wenn man auf Aktivieren klickt, werden die Abgaben vom Kolloquium in das VR-Programm geladen"
            ]
        }
    },
    methods: {
        selectKolloquium(kolloquium) {
            this.selectedKolloquium = kolloquium
            this.selectedAbgabe = ''
        },
        selectAbgabe(abgabe) {
            this.selectedAbgabe = abgabe
        },
        createNewKolloquium() {
            this.kolloquiums = [...this.kolloquiums, 'Neues Kolloquium']
        }
    }
}
</script>
