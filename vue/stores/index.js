//import TestModule from './modules/test';
import { createStore } from 'vuex';
import VuexORM, { Database } from '@vuex-orm/core';
import Test from '../models/Test';
import Task from '../models/Task';

const database = new VuexORM.Database();
database.register(Test);
database.register(Task);

export const initStore = (ariContext) => createStore({
    modules: {
        //TestModule
    },
    state: {
        ariContext,
    },
    getters: {  
        //[GET.LONGPAGE_CONTEXT]: ({ safranContext }) => safranContext,
    },
    plugins: [VuexORM.install(database)]
});