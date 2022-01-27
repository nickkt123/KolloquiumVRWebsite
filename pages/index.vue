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
                    @deleteKolloquium="deleteKolloquium(kolloquium.title)"
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
                    <n-link :to="'/abgabe/' + selectedKolloquium">
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
        }
    },
    methods: {
        async selectKolloquium(kolloquium) {
            this.selectedKolloquium = kolloquium.title
            this.selectedAbgabe = ''
            this.abgaben = []
            const data = await this.$axios.$post('/api/getAbgaben/', { kolloquium: kolloquium.title })
            this.abgaben = data.abgaben
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
            this.kolloquiums = [...this.kolloquiums, {title: '', inEdit: true, isNew: true}];
        },
        toggleEdit(kolloquium, {inEdit, title}) {
            let createNew = kolloquium.inEdit && kolloquium.isNew;
            let changeName = kolloquium.inEdit && !kolloquium.isNew;

            this.kolloquiums.forEach(kolloquium => {
                kolloquium.inEdit = false;
            });
            kolloquium.inEdit = inEdit;

            if(createNew){
                kolloquium.title = title
                kolloquium.isNew = false
                if (!title || title.trim().length == 0) {
                    this.deleteKolloquium(title)
                    return
                }
                this.$axios.post('api/createKolloquium', { title: title })
            }
            else if (changeName) {
                if (!title || title.trim().length == 0) {
                    return
                }
                kolloquium.title = title
                this.$axios.post('api/renameKolloquium', { oldTitle: kolloquium.title, newTitle: title})
            }
        },
        deleteKolloquium(kolloquiumToDelete) {
            this.kolloquiums = this.kolloquiums.filter(kolloquium => kolloquium.title != kolloquiumToDelete);
            this.selectedKolloquium = ""
            if(kolloquiumToDelete != ''){
                this.$axios.post('api/deleteKolloquium', { title: kolloquiumToDelete })
            }
        },
    },
    async asyncData ({ $axios }) {
        const dataKolloquiums = await $axios.$get('/api/getKolloquiums/')
        let kolloquiumList = []
        dataKolloquiums.kolloquiums.forEach(title => {
            kolloquiumList.push({
                title: title,
                inEdit: false
            })
        })
        const dataAbgaben = await $axios.$post('/api/getAbgaben/', { kolloquium: kolloquiumList[0].title })
        return { kolloquiums: kolloquiumList, abgaben: dataAbgaben.abgaben, selectedKolloquium: kolloquiumList[0].title }
    },
}
</script>
