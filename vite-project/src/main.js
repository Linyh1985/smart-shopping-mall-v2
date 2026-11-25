import { createApp } from 'vue'
import { Button, Card, Tabbar, TabbarItem, Cell, Search, Swipe, SwipeItem, Grid, GridItem, Icon, Tag, Empty, Field, Picker, Popup, NavBar, NoticeBar } from 'vant'
import router from './router'
import 'vant/lib/index.css'
import './style.css'
import App from './App.vue'

const app = createApp(App)
app.use(Button)
app.use(Card)
app.use(Tabbar)
app.use(TabbarItem)
app.use(Cell)
app.use(Search)
app.use(Swipe)
app.use(SwipeItem)
app.use(Grid)
app.use(GridItem)
app.use(Icon)
app.use(Tag)
app.use(Empty)
app.use(Field)
app.use(Picker)
app.use(Popup)
app.use(NavBar)
app.use(NoticeBar)
app.use(router)
app.mount('#app')
