<template>
  <v-dialog :value="obj.open" persistent>
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        Добавить или изменить заклинание
      </v-card-title>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12">
            <v-text-field
              v-model="name"
              label="название"
              color="indigo"
            />

            <div>Описание</div>
            <wysiwyg v-model="description" />

            <v-checkbox
              v-model="long"
              label="Длительное"
              color="indigo"
            />

            <v-text-field
              v-model="castSpell"
              color="indigo"
              label="Кубик заклинания"
              hint="d4, d6 и тд; L - если меньшее, H - если большее"
              :error-messages="diceError"
              :error="diceError !== ''"
            />
          </v-col>
        </v-row>
      </v-container>

      <v-divider />

      <v-card-actions>
        <v-btn
          dark
          color="indigo"
          @click="close"
        >
          Закрыть
        </v-btn>

        <v-spacer />

        <v-btn
          :disabled="!isValid"
          color="indigo"
          @click="change"
        >
          <span :class="{ 'white--text': isValid }">Сохранить</span>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapState } from 'vuex'
  import { omitBy } from 'lodash'
  import { dicesRegx } from '~/lib/dicesRegx'

  export default {
    name: 'RoleSpellModal',

    model: {
      prop: 'obj',
      event: 'changeSpell',
    },

    props: {
      obj: { type: Object, required: true },
    },

    data() {
      return {
        diceError: ''
      }
    },

    computed: {
      ...mapState({
        game: state => state.gameConfig.info,
      }),


      isValid() {
        return (this.name && this.name !== '' && this.description && this.description !== '')
      },

      spell() {
        return this.obj.spell
      },

      name: {
        get() {
          return this.spell.name
        },

        set(value) {
          this.input('name', value)
        },
      },

      description: {
        get() {
          return this.spell.description
        },

        set(value) {
          this.input('description', value)
        },
      },

      long: {
        get() {
          return this.spell.long
        },

        set(value) {
          this.input('long', value)
        },
      },

      castSpell: {
        get() {
          return this.spell.castSpell || ''
        },

        set(value) {
          if (value.search(dicesRegx) < 0) {
            this.diceError = 'Не корректный формат'
          } else {
            this.diceError = ''
          }

          this.input('castSpell', value)
        },
      },
    },

    methods: {
      input(key, value) {
        this.$set(this.spell, key, value)
      },

      change() {
        if (this.isValid) {
          this.$emit('changeSpell', { open: false, spell: this.spell })
        }
      },

      close() {
        this.$emit('changeSpell', { open: false, isClose: true })
      },
    },
  }
</script>

<style scoped lang="scss">
.button {
  margin-bottom: 5px;
}
</style>
