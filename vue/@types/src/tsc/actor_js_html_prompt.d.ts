import "jqueryui";
export declare class HtmlPrompt {
    private _id;
    private config;
    constructor(config: IHtmlPromptConfig);
    run(): boolean;
    show(): void;
    hide(): void;
    toggle(): void;
    update(): void;
    destroy(): void;
    getID(): string;
    private _guard;
}
export declare enum EHtmlPromptEvent {
    show = 0,
    shown = 1,
    hide = 2,
    hidden = 3
}
export declare enum EHtmlPromptUrgency {
    low = 0,
    normal = 1,
    medium = 2,
    hight = 3
}
export interface IHtmlPromptConfig {
    id: string;
    hook: string;
    indicatorhook?: string;
    content: {
        message: string;
        urgency?: EHtmlPromptUrgency;
        html?: string;
        style?: string;
    };
    options?: {};
}
//# sourceMappingURL=../../../@maps/src/tsc/actor_js_html_prompt.d.ts.map