import "jqueryui";
export declare class Modal {
    private _id;
    constructor(config: IModalConfig);
    show(): void;
    hide(): void;
    toggle(): void;
    update(): void;
    destroy(): void;
    addEvent(event: EModalEvent, callback: any): void;
    removeEvent(event: EModalEvent, callback: any): void;
    getID(): string;
    private _getEvent;
    private _guard;
}
export declare enum EModalEvent {
    show = 0,
    shown = 1,
    hide = 2,
    hidden = 3
}
export declare enum EModalSize {
    large = 0,
    small = 1
}
export interface IModalConfig {
    id: string;
    addClass?: string;
    content?: {
        header?: string;
        body?: string;
        footer?: string;
    };
    options?: {
        backdrop?: boolean;
        keyboard?: boolean;
        focus?: boolean;
        show?: boolean;
        animate?: boolean;
        centerVertically?: boolean;
        size?: EModalSize;
        showCloseButton: boolean;
    };
}
//# sourceMappingURL=../tsc/@maps/actor_bs_modal.d.ts.map