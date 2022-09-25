import Vue from 'vue'
import VueRouter from 'vue-router'
import MainDraft from '../components/MainDraft.vue';
import DraftCanvas from "../components/DraftCanvas";
import EditPage from "../components/EditPage";
import EditPage3d from "../components/EditPage3d";
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
    {
        path:'/edit-page3d',
        name:'/edit-page3d',
        component:EditPage3d
    },
]

const router = new VueRouter({
    routes
})

export default router
