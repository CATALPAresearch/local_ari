export declare class StyleHandler {
    static processList(list: Array<IStyle & IAnimation>): Promise<void>;
    static style(data: IStyle): Promise<void>;
    static animate(data: IAnimation): Promise<void>;
}
interface IStyle {
    documentReady: boolean;
    selector: string;
    property: string;
    value: string | number;
    duration?: number;
}
interface IAnimation {
    documentReady: boolean;
    selector: string;
    params: object;
    duration: number;
}
export {};
//# sourceMappingURL=../../../@maps/src/tsc/actor_style.d.ts.map