<template>
  <div class="base">
    <div class="black">
      <span class="title">опыт</span>
    </div>
    <ul>
      <li v-html="characterExp.desperateCheck" />
      <li>
        <span><i>{{ characterExp.problem }} </i></span>
        <input v-if="!characterExp.problemType" v-model="problemType" class="input" @change="saveSheet" />
        <span v-else><i>{{ characterExp.problemType }}</i></span>
      </li>
      <li><i>{{ characterExp.origin }}</i></li>
      <li><i>{{ characterExp.problems }}</i></li>
    </ul>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'CharacterExp',
    props: {
      sheet: { type: Object, required: true },
    },

    computed: {
      ...mapState({
        tables: state => state.game.info.template.tables,
      }),

      characterExp: {
        get() {
          const characterExp = this.tables.characterExp
          const all = characterExp.all
          const character = characterExp[this.sheet.params.info.role] || {}
          return { ...all, ...character }
        },
      },

      problemType: {
        get() {
          return this.sheet.params.problemType
        },

        set(value) {
          this.$store.commit('game/updateSheetParams',
                             {
                               id: this.sheet.id,
                               path: `problemType`,
                               value,
                             })
        },
      },
    },

    methods: {
      saveSheet() {
        this.$cable.perform({
          channel: 'GameChannel',
          action: 'change',
          data: { ...this.sheet, type: 'sheet' },
        })
      },
    },
  }
</script>

<style scoped lang="scss">
  @import '~assets/css/colors';

  $border: 1px solid $black;

  .base {
    margin-top: 10px;
  }

  .title {
    width: max-content;
    padding: 3px;
  }

  .black {
    background-color: $black;
    color: $white;
  }

  .input {
    width: 500px;
    border-bottom: $border;
  }
</style>
