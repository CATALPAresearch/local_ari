import { EMoodleContext, EOperators, ERuleActor, IRule, IRuleCondition } from '@/tsc/rules';
declare const _default: import("vue").DefineComponent<Readonly<{}>, {}, {
    rulesLoaded: boolean;
    existingRules: IRule[];
    newRules: IRule[];
    contextFilter: string;
    executions: any[];
    chosenTimeRangeFilter: any;
}, {
    operators(): typeof EOperators;
    contexts(): typeof EMoodleContext;
    actors(): typeof ERuleActor;
    allRules(): IRule[];
    ruleInFilter(): IRule[];
    conditionsKeys(): string[];
    timeRangeFilterExecutions(): {
        name: string;
        value: any;
    }[];
}, {
    fetchAllRuleExecutions(): void;
    getExecutionCount(id: number): number;
    getConditionValue: (condition: IRuleCondition) => string | number;
    convertTimestampToDate: (timestamp: number) => string;
    fetchRules(): void;
    newRule(): void;
    saveRule(id: number): void;
    editRule(id: number): void;
    deleteRule(id: number): void;
}, import("vue/types/v3-component-options").ComponentOptionsMixin, import("vue/types/v3-component-options").ComponentOptionsMixin, {}, string, Readonly<import("vue").ExtractPropTypes<Readonly<{}>>>, {}>;
export default _default;
//# sourceMappingURL=../../../../@maps/src/components/Main/Main.d.ts.map