<template>
  <div class="spell-block">
    <div class="title-spell">
      <div :class="[{ enable }, 'box']" @click="changeSpell(!enable)" />
      <span class="spell-name">{{ name }}</span>
      <span v-if="long" class="spell-long">Длительное</span>
      <v-spacer v-else />
      <v-btn
        color="red darken-4"
        icon
        small
        dark
        class="delete-button"
        @click="removeSpell"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </div>

    <details>
      <summary class="pointer">
        Подробнее
      </summary>
      <div class="actions">
        <v-btn
          class="button-add"
          raised
          color="black"
          small
          dark
          @click="showDescription"
        >
          Показать описание
        </v-btn>
      </div>

      <span class="spell-description" v-html="description" />
      <div v-if="enable" class="cast-spell">
        <v-text-field
          v-model="castSpell"
          color="indigo"
          label="Кубик заклинания"
          hint="d4, d6 и тд; L - если меньшее, H - если большее"
          :error-messages="diceError"
          :error="diceError !== ''"
        />
        <v-btn
          class="cast-button"
          color="black"
          @click="sendCast"
          dark
        >
          <span>Получить результат</span>
        </v-btn>
      </div>
    </details>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { dicesRegx } from '@/lib/dicesRegx'

  export default {
    name: 'Spell',

    props: {
      spell: { type: Object, required: true },
      index: { type: Number, required: true },
      path: { type: String, required: true },
      sheet: { type: Object, required: true },
    },

    data() {
      return {
        privateType: {},
        modalOpen: false,
        privateAltType: null,
        diceError: ''
      }
    },

    computed: {
      ...mapState({
        tables: state => state.game.info.template.tables,
      }),

      params() {
        return this.sheet.params
      },

      long() {
        return this.spell.long
      },

      enable() {
        return this.spell.enable
      },

      name() {
        return this.spell.name
      },

      description() {
        return this.spell.description
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
      removeSpell() {
        this.$store.commit('game/updateSheetParams',
          {
            id: this.sheet.id,
            path: this.path,
            value: this.index,
            remove: true,
          })

        this.saveSheet()
      },

      changeSpell(value) {
        this.input('enable', value)
      },


      input(key, value) {
        this.$store.commit('game/updateSheetParams',
          {
            id: this.sheet.id,
            path: `${this.path}[${this.index}].${key}`,
            value,
          })

        this.saveSheet()
      },

      saveSheet() {
        this.$cable.perform({
          channel: 'GameChannel',
          action: 'change',
          data: { ...this.sheet, type: 'sheet' },
        })
      },

      showDescription() {
        this.$cable.perform({
          channel: 'GameChannel',
          action: 'add',
          data: {
            type: 'message',
            body: {
              sheet: this.sheet.toChat,
              name: this.name,
              description: this.description,
              showDescription: true,
            },
          },
        })
      },

      sendCast() {
        if (this.castSpell === '') return

        this.$cable.perform({
          channel: 'GameChannel',
          action: 'add',
          data: {
            type: 'message',
            body: {
              sheet: this.sheet.toChat,
              name: `${this.name}`,
              dices_string: this.castSpell,
              isDamage: true,
            },
          },
        })
      }
    },
  }
</script>

<style scoped lang="scss">
  @import '~assets/css/colors';

  .move-block {
    margin-bottom: 5px;
  }

  .title-spell {
    display: grid;
    grid-template-columns: repeat(2, max-content) 1fr max-content;
    background-color: $black;
    color: $white;
    line-height: 35px;
    margin-left: -5px;
  }

  .box {
    cursor: pointer;
    width: 20px;
    height: 20px;
    margin-left: 5px;
    margin-top: 7px;
    border: 2px solid $white;
  }

  .enable {
    background-color: $white;
    border: 2px solid $black;
  }

  .spell-name {
    margin-left: 5px;
    font-weight: 600;
  }

  .spell-long {
    margin-left: 5px;
    font-style: italic;
  }

  .delete-button {
    margin-top: 4px;
  }

  .cast-button {
    margin-top: 16px;
  }

  .actions {
    display: grid;
    grid-template-columns: max-content;
    grid-row-gap: 10px;
    margin-top: 15px;
    margin-bottom: 5px;
  }

  .cast-spell {
    display: grid;
    grid-template-columns: 200px max-content;
    grid-column-gap: 5px;
  }
</style>