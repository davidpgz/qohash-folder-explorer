import HomePage from '../components/HomePage';

export default [
    { path: '/', name: 'home', component: HomePage },
    { path: '/:folder', redirect: to => ({ name: 'search', params: { folder: to.params.folder, page: 1 }}) },
    { 
        path: '/:folder/:page',
        name: 'search',
        component: HomePage,
        props: (route) => ({ folder: route.params.folder, page: Number.parseInt(route.params.page, 10) || 1 })
    },
];