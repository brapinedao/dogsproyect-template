import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { Quasar } from 'quasar'

// Quasar CSS
import 'quasar/src/css/index.sass'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Quasar, {
  plugins: {},
  config: {
    brand: {
      primary: '#7C3AED',
      secondary: '#4F46E5',
      accent: '#A78BFA',
      dark: '#1B0F42',
      positive: '#22C55E',
      negative: '#EF4444',
      info: '#60A5FA',
      warning: '#F59E0B',
    },
  },
})

app.mount('#app')
