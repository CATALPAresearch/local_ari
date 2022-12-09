import { EMoodleContext, EOperators, ERuleActor, IRule, IRuleCondition } from '@/tsc/rules';
declare const _default: import("vue").DefineComponent<Readonly<{}>, {}, {
    rulesLoaded: boolean;
    existingRules: IRule[];
    newRules: IRule[];
    contextFilter: string;
}, {
    operators(): typeof EOperators;
    contexts(): typeof EMoodleContext;
    actors(): typeof ERuleActor;
    allRules(): IRule[];
    ruleInFilter(): IRule[];
    conditionsKeys(): string[];
}, {
    getConditionValue: (condition: IRuleCondition) => string | number;
    convertTimestampToDate: (timestamp: number) => string;
    fetchRules(): void;
    newRule(): void;
    saveRule(index: number): void;
    editRule(index: number): void;
    deleteRule(index: number): void;
}, import("vue/types/v3-component-options").ComponentOptionsMixin, import("vue/types/v3-component-options").ComponentOptionsMixin, {}, string, Readonly<import("vue").ExtractPropTypes<Readonly<{}>>>, {}>;
export default _default;
//# sourceMappingURL=../../../../@maps/src/components/Main/Main.d.ts.map