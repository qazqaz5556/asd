import Vue from 'vue'
import VueRouter from 'vue-router'
import MainDraft from '../components/MainDraft.vue';
import DraftCanvas from "../components/DraftCanvas";
import EditPage from "../components/EditPage";
Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'MainDraft',
        component: MainDraft,
    },
    {
        path:'/draft-canvas',
        name:'/draftCanvas',
        component:DraftCanvas

    },
    {
        path:'/edit-page',
        name:'/edit-page',
        component:EditPage
    },
]

const router = new VueRouter({
    routes
})

export default router
