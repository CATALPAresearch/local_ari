import { ETargetContext, EOperators, ERuleActor, IRule, EActionType, EActionCategory, EActionAugmentation, ETiming } from '@/tsc/rules';
import 'vue-multiselect/dist/vue-multiselect.min.css';
declare const _default: import("vue").DefineComponent<{}, unknown, {
    selected: null;
    rulesLoaded: boolean;
    contextFilter: string;
    executions: any[];
    chosenTimeRangeFilter: any;
    show: boolean;
}, {
    operators(): typeof EOperators;
    action_target_context(): typeof ETargetContext;
    action_actors(): typeof ERuleActor;
    action_type(): typeof EActionType;
    action_category(): typeof EActionCategory;
    action_augmentation(): EActionAugmentation[];
    action_timing(): typeof ETiming;
    ruleInFilter(): IRule[];
    advancedActionOptions(id: number): Boolean;
    conditionsKeys(): string[];
    timeRangeFilterExecutions(): {
        name: string;
        value: any;
    }[];
    getAllCourses: import("vuex").ActionMethod;
}, {}, import("vue/types/v3-component-options").ComponentOptionsMixin, import("vue/types/v3-component-options").ComponentOptionsMixin, {}, string, Readonly<import("vue").ExtractPropTypes<{}>>, {}>;
export default _default;
//# sourceMappingURL=../../../../@maps/src/components/AdaptationBoard/AdaptationBoard.d.ts.map