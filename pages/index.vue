<template>
    <div class="relative flex flex-col items-center justify-top min-h-screen bg-gray-100 sm:items-top sm:pt-0">
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
                <KolloquiumItem
                    v-for="kolloquium in kolloquiums"
                    :key="kolloquium.title"
                    @click.native="selectKolloquium(kolloquium)"
                    :selected="selectedKolloquium===kolloquium.title"
                    :title="kolloquium.title"
                    @update:title="kolloquium.title=$event"
                    :inEdit="kolloquium.inEdit"
                    @update:inEdit="toggleEdit(kolloquium, $event)"
                    @deleteKolloquium="deleteKolloquium(kolloquium)"
                />
                <ListItem
                    @click.native="createNewKolloquium()"
                >+ Neues Kolloquium erstellen...
                </ListItem>
            </template>
        </box>
        <box>
            <template slot="title">
                <div class="flex flex-row justify-between">
                    <span>Details</span>
                </div>
            </template>
            <template slot="content">
                <p class="text-xl"><span class="font-semibold">Titel:</span> {{ selectedKolloquium }}</p>
                <p class="font-semibold mt-4 mb-1">Abgaben:</p>
                <AbgabeItem
                    v-for="abgabe in abgaben"
                    :key="abgabe"
                    @click.native="selectAbgabe(abgabe)"
                    :title="abgabe"
                />
                <div class="flex flex-row justify-between"> 
                    <button class="border rounded mt-4 p-2 font-semibold text-white bg-green-500 hover:bg-green-600 focus:bg-green-700">
                        Aktivieren
                    </button>
                    <n-link to="/abgabe-hochladen">
                        <button class="border rounded mt-4 p-2 font-semibold text-white bg-blue-500 hover:bg-blue-600 focus:bg-blue-700">
                            Link Teilen
                        </button>
                    </n-link>
                </div>
            </template>
        </box>
    </div>
</template>

<script>
import Box from '~/components/Box'
import ListItem from '~/components/ListItem'
import KolloquiumItem from '~/components/KolloquiumItem'
import AbgabeItem from '~/components/AbgabeItem'

export default {
    components: {
        Box,
        ListItem,
        KolloquiumItem,
        AbgabeItem
    },
    data() {
      return {
            selectedKolloquium: "",
            selectedAbgabe: "",
            abgaben: [
                "Hier ist eine Liste von Abgaben für das ausgewählte Kolloquium.",
                "Man kann einzelne Abgaben löschen.",
                "Wenn man auf Aktivieren klickt, werden die Abgaben vom Kolloquium in das VR-Programm geladen"
            ]
        }
    },
    methods: {
        selectKolloquium(kolloquium) {
            this.selectedKolloquium = kolloquium.title
            this.selectedAbgabe = ''
        },
        selectAbgabe(abgabe) {
            this.selectedAbgabe = abgabe
        },
        createNewKolloquium() {
            this.kolloquiums.forEach(kolloquium => {
                kolloquium.inEdit = false;
            });
            this.selectedKolloquium = "";
            this.kolloquiums = this.kolloquiums.filter(kolloquium => kolloquium.title.length > 0);
            this.kolloquiums = [...this.kolloquiums, {title: '', inEdit: true}];

        },
        toggleEdit(kolloquium, status) {
            this.kolloquiums.forEach(kolloquium => {
                kolloquium.inEdit = false;
            });
            kolloquium.inEdit = status;
        },
        deleteKolloquium(kolloquiumToDelete) {
            this.kolloquiums = this.kolloquiums.filter(kolloquium => kolloquium.title != kolloquiumToDelete.title);
        },
    },
    async asyncData ({ $http }) {
        const data = await $http.$get('/api/kolloquiums/getKolloquiums')
        let kolloquiumList = []
        data.kolloquiums.forEach(title => {
            kolloquiumList.push({
                title: title,
                inEdit: false
            })
        })
        return { kolloquiums: kolloquiumList }
    },
}
</script>
