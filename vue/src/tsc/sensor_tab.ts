/**
 *
 * @author Marc Burchart
 * @version 1.0-20200827
 * @description Get the uniqid of the Tab.
 *
 */

import { SessionStorage } from "./core_storage";
import { uniqid } from "./core_helper";


export function getTabID():string{
    let old = SessionStorage.get("uniqid");
    if(old !== null && typeof old === "string" && old.length > 0) return old;
    let newID = uniqid();
    SessionStorage.set("uniqid", newID, true);
    return newID;
}