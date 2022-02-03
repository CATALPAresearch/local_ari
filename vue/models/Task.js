import { Model } from '@vuex-orm/core'
import Test from './Test'

export default class Task extends Model {
    // name of the module
    static get entity() {
        return 'tasks'
    }

    // `this.belongsTo` is for belongs to relationship. The first argument is
    // the Model class, and second is the field name for the foreign key.
    static fields() {
        return {
            id: this.attr(null),
            test_id: this.attr(null),
            title: this.attr(''),
            description: this.attr(''),
            instruction: this.attr(''),
            score: this.attr(''),
            //solution: this.attr(''),
            test: this.belongsTo(Test, 'test_id')
        }
    }
}