<template>
  <v-main>
    <v-container
      class="fill-height"
      fluid
    >
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          sm="8"
          md="4"
        >
          <v-card class="elevation-12">
            <v-toolbar
              color="primary"
              dark
              flat
            >
              <v-toolbar-title>Добавить систему</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form>
                <v-text-field
                  v-model="name"
                  required
                  label="Название"
                />
                <v-file-input
                  v-model="file"
                  accept="application/json"
                  label="Файл структуры"
                />
                <v-file-input
                  v-model="dataFile"
                  accept="application/json"
                  label="Файл данных"
                />
                <v-file-input
                  v-model="privateDataFile"
                  accept="application/json"
                  label="Файл с дополнительными данными"
                />
                <v-file-input
                  v-model="mediaFile"
                  accept="application/zip"
                  label="Zip архив с медиа файлами"
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <nuxt-link to="index">К списку игр</nuxt-link>
              <v-spacer />
              <v-btn
                :disabled="!isValid"
                color="primary"
                @click="save"
              >
                Добавить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script>
  export default {
    data: () => ({
      system: {
        name: '',
        file: null,
        dataFile: null,
        privateDataFile: null,
        mediaFile: null,
      },
    }),

    computed: {
      isValid() {
        if (this.name === '') return false
        if (!this.file || !this.file['name']) return false

        return this.dataFile && this.dataFile['name']
      },

      name: {
        get() {
          return this.system.name
        },
        set(value) {
          this.system.name = value
        },
      },

      file: {
        get() {
          return this.system.file
        },

        set(value) {
          this.system.file = value
        },
      },

      dataFile: {
        get() {
          return this.system.dataFile
        },

        set(value) {
          this.system.dataFile = value
        },
      },

      privateDataFile: {
        get() {
          return this.system.privateDataFile
        },

        set(value) {
          this.system.privateDataFile = value
        },
      },

      mediaFile: {
        get() {
          return this.system.mediaFile
        },

        set(value) {
          this.system.mediaFile = value
        },
      },
    },

    methods: {
      save() {
        if (this.isValid) {
          this.$store.dispatch('systems/create', { axios: this.$axios, params: { ...this.system } }).then(() => {
            this.$router.push('/')
          })
        }
      },
    },
  }
</script>
