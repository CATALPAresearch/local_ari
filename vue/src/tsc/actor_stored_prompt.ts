//@ts-ignore
import * as $ from "jquery";
//@ts-ignore
import "jqueryui";
import { EActionType, EActionCategory } from "./rules";
/**
 *
 * @author Niels Seidel
 * @version 1.0-20200604
 * @description Use JavaScript to add dialogs for user notifications, or completely custom content.
 *
 */

export class StoredPrompt {
  private _id: string;
  //private config:IStoredPromptConfig;

  constructor(config: IStoredPromptConfig) {
    console.log("ARI::initStoredPrompt");
    this._id = config.id;
    this._guard(config);
    let openRequest = indexedDB.open("ari_prompts", 2);

    openRequest.onupgradeneeded = function () {
      let db = openRequest.result;
      if (!db.objectStoreNames.contains("prompts")) {
        db.createObjectStore("prompts", { keyPath: "id" });
      }
    };

    openRequest.onsuccess = function () {
      let db = openRequest.result;

      if (!db.objectStoreNames.contains("prompts")) {
        db.createObjectStore("prompts", { keyPath: "id" });
      }

      db.onversionchange = function () {
        db.close();
        console.error("Database is outdated, please reload the page.");
      };

      let transaction = db.transaction("prompts", "readwrite").objectStore("prompts");
      let request = transaction.put(config);
      request.onsuccess = function () {
        console.log("ARI::Prompt updated/added to indexedDB /prompt/ store", request.result);
      };
      request.onerror = function () {
        console.error("ARI::IndexedDB-add-Prompt-Error", request.error);
      };
    };
  }

  /** Manually readjust the modal’s position if the height of a modal changes while it is open (i.e. in case a scrollbar appears). */
  public update(): void {
    //$(`#${this._id}`).modal("handleUpdate");
  }

  /** Destroys an element’s modal. */
  public destroy(): void {
    $(`#${this._id}`).remove();
  }

  /** Get the ID of the Modal. */
  public getID(): string {
    return this._id;
  }

  private _guard(config: IStoredPromptConfig): void {
    let success:boolean = true;
    // TODO: complete the checks
    if (typeof config !== "object"){
      success = false;
    }
      
    if (typeof config.id !== "string" || config.id.length <= 0){
      success = false;
    }

    //if(typeof config.tags !== "undefined" && (typeof config.type !== "string" || config.type.length <= 0)) return false;

    if (
      typeof config.message !== "undefined" &&
      (typeof config.message !== "string" || config.message.length <= 0)
    ){
      success = false;
    }
    
    if (
      typeof config.title !== "undefined" &&
      (typeof config.title !== "string" || config.title.length <= 0)
    ){
      success = false;
    }
    
  
    // @ts-ignore
    if (success == false) {
      // @ts-ignore
      throw new Error(`[Modal-${this.config.id}] Incomplete or incorrect configuration.`);
    }
  }

}

export enum EHtmlPromptEvent {
  /** This event fires immediately when the show instance method is called. If caused by a click, the clicked element is available as the relatedTarget property of the event. */
  show,
  /** This event is fired when the modal has been made visible to the user (will wait for CSS transitions to complete). If caused by a click, the clicked element is available as the relatedTarget property of the event. */
  shown,
  /** This event is fired immediately when the hide instance method has been called. */
  hide,
  /** This event is fired when the modal has finished being hidden from the user (will wait for CSS transitions to complete) */
  hidden,
}

export enum EStoredPromptUrgency {
  low,
  normal,
  medium,
  hight,
}

export interface IStoredPromptConfig {
  id: string;
  section?: string;
  type: EActionType;
  category: EActionCategory;
  indicator?: string;
  title: string;
  message: string;
  valid: boolean;
  timecreated: number;
  urgency?: EStoredPromptUrgency;
  options?: {};
}
