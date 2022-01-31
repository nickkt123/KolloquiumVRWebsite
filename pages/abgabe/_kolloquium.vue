<template>
    <div class="relative flex flex-col items-center justify-top min-h-screen bg-gray-100 sm:items-top sm:pt-0">
        <box>
            <template slot="title">
                Abgabe für <span class="font-semibold">{{ this.$route.params.kolloquium }}</span> hochladen
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
                <form
                    accept-charset="UTF-8"
                    v-on:submit.prevent="onSubmit()"
                    method="POST"
                >
                    <div class="flex flex-row items-center mb-1">
                        Name:
                        <input class="ml-1 w-full rounded border p-1" v-model="name">
                    </div>
                    <div class="flex flex-row items-center mb-1">
                        Matrikelnummer:
                        <input class="ml-1 w-full rounded border p-1" v-model="matrikelnummer">
                    </div>
                    <div class="flex flex-row items-center mb-1">
                        Datei:
                        <input
                            type=file
                            ref="file"
                            accept=".zip"
                            @change="fileSelected"
                            class="ml-1 w-full rounded border p-1"
                        >
                    </div>
                    <button type="submit" class="border rounded mt-4 p-2 font-semibold text-white bg-green-500 hover:bg-green-600 focus:bg-green-700">
                        Hochladen
                    </button>
                </form>
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
            name: '',
            matrikelnummer: '',
            filename: '',
        }
    },
    methods: {
        fileSelected(e) {
            // this.$emit('input', e.target.files[0])
            this.file = this.$refs.file.files[0]
            this.filename = this.file.name
        },
        onSubmit() {
            let formData = new FormData()
            formData.append('file', this.file)
            formData.append('filename', this.filename)
            formData.append('kolloquium', this.$route.params.kolloquium)
            formData.append('name', this.name)
            formData.append('matrikelnummer', this.matrikelnummer)
            this.$axios.post(
                'api/submitAbgabe',
                formData,
                {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                }
            )
        }
    }
}
</script>
