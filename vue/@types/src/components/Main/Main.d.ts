import { IRule, EOperators } from '@/tsc/rules';
declare const _default: import("vue").DefineComponent<Readonly<{}>, {}, {
    rulesLoaded: boolean;
    allRules: IRule[];
    newRules: IRule[];
    operators: typeof EOperators;
}, {}, {
    fetchRules(): void;
    newRule(): void;
    saveRule(index: number): void;
    editRule(index: number): void;
    deleteRule(index: number): void;
}, import("vue/types/v3-component-options").ComponentOptionsMixin, import("vue/types/v3-component-options").ComponentOptionsMixin, {}, string, Readonly<import("vue").ExtractPropTypes<Readonly<{}>>>, {}>;
export default _default;
//# sourceMappingURL=../../../../@maps/src/components/Main/Main.d.ts.map