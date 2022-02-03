
import { Model } from '@vuex-orm/core'

export default class Test extends Model {
    // This is the name used as module name of the Vuex Store.
    static get entity() {
        return 'test'
    }

    // List of all fields (schema) of the post model. `this.attr` is used
    // for the generic field type. The argument is the default value.
    static fields() {
        return {
            id: this.attr(null),
            name: this.attr(''),
            task: this.attr(''),
            score: this.attr('')
        }
    }
}