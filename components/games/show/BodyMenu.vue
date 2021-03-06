<template>
  <div class="menuGrid">
    <v-navigation-drawer
      ref="drawer"
      permanent
      right
      :width="navigation.width"
    >
      <template v-slot:prepend>
        <v-list-item>
          <v-list-item-icon>
            <v-icon>{{ currentItem.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ currentItem.label }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>

      <v-divider />

      <keep-alive>
        <tab-chat v-if="currentItem.type === 'chat'" />
        <tab-sheets v-else-if="currentItem.type === 'sheets'" />
        <tab-notes v-else-if="currentItem.type === 'notes'" />
        <tab-images v-else-if="currentItem.type === 'images'" />
        <tab-settings v-else-if="currentItem.type === 'settings'" />
        <bid-tab-clock v-else-if="currentItem.type === 'bid-clock'" />
        <eou-tab-counters v-else-if="currentItem.type === 'eou-clock'" />
        <eou-tab-planets v-else-if="currentItem.type === 'eou-planet'" />
        <eou-tab-items v-else-if="currentItem.type === 'eou-items'" />
        <dw-tab-items v-else-if="currentItem.type === 'dw-items'" />
        <dw-tab-clock v-else-if="currentItem.type === 'dw-clock'" />
        <span v-else>В разработке</span>
      </keep-alive>
    </v-navigation-drawer>
    <v-navigation-drawer
      dark
      color="indigo"
      permanent
      right
    >
      <v-list>
        <v-list-item
          v-for="(item, index) in items"
          :key="item.label"
          :disabled="currentIndex === index"
          @click="currentIndex = index"
        >
          <v-list-item-action>
            <v-tooltip left>
              <template v-slot:activator="{ on }">
                <v-badge
                  :content="content(item.mark)"
                  :value="content(item.mark)"
                  color="red"
                  overlap
                >
                  <v-icon v-on="on"> {{ item.icon }}</v-icon>
                </v-badge>
              </template>
              <span>{{ item.label }}</span>
            </v-tooltip>
          </v-list-item-action>

          <v-list-item-content>
            <v-list-item-title>{{ item.label }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import TabChat from './TabChat'
import TabSheets from './sheets/TabSheets'
import TabSettings from './TabSettings'
import TabNotes from './notes/TabNotes'
import TabImages from './images/TabImages'

export default {
  name: 'BodyMenu',

  components: {
    TabImages,
    TabNotes,
    TabSettings,
    TabSheets,
    TabChat,
    EouTabItems: () => import('../../templates/pbta/EdgeOfUniverse/menus/EouTabItems'),
    EouTabPlanets: () => import('../../templates/pbta/EdgeOfUniverse/menus/EouTabPlanets'),
    EouTabCounters: () => import('../../templates/pbta/EdgeOfUniverse/menus/EouTabCounters'),
    BidTabClock: () => import('../../templates/BladeInTheDarck/menus/BidTabClock'),
    DwTabItems: () => import('../../templates/pbta/DungeonWorld/menus/DwTabItems'),
    DwTabClock: () => import('../../templates/pbta/DungeonWorld/menus/DwTabClocks'),
  },

  data() {
    return {
      privateCurrentIndex: 0,
      navigation: {
        width: 356,
        borderSize: 3,
      },
    }
  },

  computed: {
    ...mapState({
      menus: state => state.game.info.menus,
      marks: state => state.game.marks,
      currentItem: state => state.game.currentItem,
      master: state => state.game.info.master,
      user: state => state.auth.user,
    }),

    items: {
      get() {
        const beforeSystem = [
          { label: 'Чат', icon: 'mdi-chat', type: 'chat', mark: 'chat' },
          { label: 'Персонажи', icon: 'mdi-account', type: 'sheets', mark: 'sheet' },
        ]
        let afterSystem = []

        if (this.user.id === this.master.id) {
          afterSystem = [
            { label: 'Изображения', icon: 'mdi-image-multiple', type: 'images', mark: null },
            { label: 'Настройки страници', icon: 'mdi-cog', type: 'settings', mark: null },
          ]
        }

        const system = this.menus.map(menu => ({
          label: menu.params.name,
          icon: menu.params.icon,
          type: menu.params.type,
          mark: menu.params.mark || null,
        }))

        return beforeSystem.concat(system).concat(afterSystem)
      },
    },

    currentIndex: {
      get() {
        return this.privateCurrentIndex
      },

      set(index) {
        this.privateCurrentIndex = index
        this.$store.commit('game/addCurrentItem', this.items[index])
      },
    },
  },

  created() {
    this.$store.commit('game/addCurrentItem', this.items[0])
    this.items.forEach(item => {
      if (item.mark) this.$store.commit('game/addMarker', item.mark)
    })
  },

  mounted() {
    this.setBorderWidth()
    this.setEvents()
  },

  methods: {
    content(mark) {
      if (!mark) return 0

      return this.marks[mark] || 0
    },

    setBorderWidth() {
      const drawer = this.$refs.drawer.$el.querySelector('.v-navigation-drawer__border')
      drawer.style.width = `${this.navigation.borderSize}px`
      drawer.style.cursor = 'ew-resize'
    },

    setEvents() {
      const minSize = this.navigation.borderSize
      const el = this.$refs.drawer.$el
      const drawerBorder = el.querySelector('.v-navigation-drawer__border')
      const vm = this
      const direction = el.classList.contains('v-navigation-drawer--right') ? 'right' : 'left'

      function resize(e) {
        document.body.style.cursor = 'ew-resize'
        const scroll = direction === 'right' ? document.body.scrollWidth - e.clientX : e.clientX
        el.style.width = `${scroll}px`
      }

      drawerBorder.addEventListener(
        'mousedown',
        function (e) {
          if (e.offsetX < minSize) {
            el.style.transition = 'initial'
            document.addEventListener('mousemove', resize, false)
          }
        },
        false,
      )

      document.addEventListener(
        'mouseup',
        function () {
          el.style.transition = ''
          vm.navigation.width = el.style.width
          document.body.style.cursor = ''
          document.removeEventListener('mousemove', resize, false)
        },
        false,
      )
    },
  },
}
</script>

<style scoped lang="scss">
.menuGrid {
  display: grid;
  grid-template-columns: auto 50px;
}
</style>
