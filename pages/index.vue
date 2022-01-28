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
                    :selected="selectedKolloquium===kolloquium.title"
                    :title="kolloquium.title"
                    :inEdit="kolloquium.inEdit"
                    @update:title="kolloquium.title=$event"
                    @update:inEdit="toggleEdit(kolloquium, $event)"
                    @selectKolloquium="selectKolloquium(kolloquium.title)"
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
                <div v-if="selectedKolloquium">
                    <p class="text-xl"><span class="font-semibold">Titel:</span> {{ selectedKolloquium }}</p>
                    <p class="font-semibold mt-4 mb-1">Abgaben:</p>
                    <div v-if="abgaben.length > 0">
                        <AbgabeItem
                            v-for="abgabe in abgaben"
                            :key="abgabe"
                            @click.native="selectAbgabe(abgabe)"
                            :title="abgabe"
                        />
                    </div>
                    <div v-else>
                        Keine Abgaben
                    </div>
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
                </div>
                <div v-else class="font-semibold">
                    Kein Kolloquium ausgewählt
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
        async selectKolloquium(kolloquiumTitle) {
            this.selectedKolloquium = kolloquiumTitle
            this.selectedAbgabe = ''
            this.abgaben = []
            const data = await this.$axios.$post('/api/getAbgaben/', { kolloquium: kolloquiumTitle })
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
        async toggleEdit(kolloquium, {inEdit, title}) {
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
                this.refreshKolloquiumList()
            }
            else if (changeName) {
                // TODO: Request confirmation before changing name so the link does not break
                // TODO: Or make sure the link stays the same if the folder is renamed?
                if (!title || title.trim().length == 0) {
                    return
                }
                this.$axios.post('api/renameKolloquium', { oldTitle: kolloquium.title, newTitle: title})
                this.refreshKolloquiumList()
            }
        },
        async deleteKolloquium(kolloquiumTitle) {
            this.selectedKolloquium = ''
            if(kolloquiumTitle != ''){
                this.$axios.post('api/deleteKolloquium', { title: kolloquiumTitle })
            }
            this.refreshKolloquiumList()
        },
        async refreshKolloquiumList() {
            this.abgaben = []
            this.kolloquiums = []
            this.selectedKolloquium = ''
            this.selectedAbgabe = ''
            const dataKolloquiums = await this.$axios.$get('/api/getKolloquiums/')
            dataKolloquiums.kolloquiums.forEach(title => {
            this.kolloquiums.push({
                title: title,
                inEdit: false
            })
        })

        }
    },
    async asyncData ({ $axios }) {
        let kolloquiumList = []
        let abgaben = []
        const dataKolloquiums = await $axios.$get('/api/getKolloquiums/')
        dataKolloquiums.kolloquiums.forEach(title => {
            kolloquiumList.push({
                title: title,
                inEdit: false
            })
        })
        if (kolloquiumList.length !== 0){
            const dataAbgaben = await $axios.$post('/api/getAbgaben/', { kolloquium: kolloquiumList[0].title })
            abgaben = dataAbgaben.abgaben
        }
        return { kolloquiums: kolloquiumList, abgaben: abgaben }
    },
}
</script>
