import Vue from 'vue'
import ActionCableVue from 'actioncable-vue'

Vue.use(ActionCableVue, {
  debug: true,
  debugLevel: 'all',
  connectionUrl: process.env.wsUrl,
  connectImmediately: true
});

