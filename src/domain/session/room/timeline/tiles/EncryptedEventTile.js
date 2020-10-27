/*
Copyright 2020 The Matrix.org Foundation C.I.C.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import {MessageTile} from "./MessageTile.js";
import {UpdateAction} from "../UpdateAction.js";

export class EncryptedEventTile extends MessageTile {
    updateEntry(entry, params) {
        const parentResult = super.updateEntry(entry, params);
        // event got decrypted, recreate the tile and replace this one with it
        if (entry.eventType !== "m.room.encrypted") {
            // the "shape" parameter trigger tile recreation in TimelineList
            return UpdateAction.Replace("shape");
        } else {
            return parentResult;
        }
    }

    get shape() {
        return "message-status"
    }

    get text() {
        const decryptionError = this._entry.decryptionError;
        const code = decryptionError?.code;
        if (code === "MEGOLM_NO_SESSION") {
            return this.i18n`The sender hasn't sent us the key for this message yet.`;
        } else {
            return decryptionError?.message || this.i18n`"Could not decrypt message because of unknown reason."`;
        }
    }
}
