import "jqueryui";
import { EActionType, EActionCategory } from "./rules";
export declare class StoredPrompt {
    private _id;
    constructor(config: IStoredPromptConfig);
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
export declare enum EStoredPromptUrgency {
    low = 0,
    normal = 1,
    medium = 2,
    hight = 3
}
export interface IStoredPromptConfig {
    id: string;
    type: EActionType;
    category: EActionCategory;
    indicator?: string;
    title: string;
    message: string;
    timecreated: number;
    urgency?: EStoredPromptUrgency;
    options?: {};
}
//# sourceMappingURL=../../../@maps/src/tsc/actor_stored_prompt.d.ts.map