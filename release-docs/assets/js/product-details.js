/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import { cachedFetch } from '../assets/js/utils.js'

const DETAILS_URL = "https://product-details.mozilla.org/1.0/thunderbird_versions.json"

export class ThunderbirdProductDetails {
    constructor() {
        this._raw_details = {}
        this._map = {
            nightly: "LATEST_THUNDERBIRD_NIGHTLY_VERSION",
            beta: "LATEST_THUNDERBIRD_DEVEL_VERSION",
            release: "LATEST_THUNDERBIRD_VERSION",
            esr: "THUNDERBIRD_ESR",
            esrnext: "THUNDERBIRD_ESR_NEXT"
        }
        this._versions = {
            nightly: undefined,
            beta: undefined,
            release: undefined,
            esr: undefined,
            esrnext: undefined
        }
        this._names = {
            nightly: "Daily",
            beta: "Beta",
            release: "Monthly",
            esr: "ESR",
            esrnext: "ESR Next"
        }
    }

    get channelNames() {
        return this._names
    }

    /**
     * Fetch product details from API server or the cache
     * @returns {Promise.<Object>} Decoded JSON - raw versions from API server.
     */
    async getDetails() {
        return cachedFetch(DETAILS_URL, 3600)
            .then((response) => response.json())
            .catch((error) => {
                console.error("Error:", error)
            })
    }

    /**
     * Current versions with channels transformed to more familiar names
     * @returns {Promise<{[p: string]: *}>}
     */
    async productVersions() {
        const raw_details = await this.getDetails()
        return Object.fromEntries(
            Object.entries(this._map)
                .map(([channel, details_channel]) => [channel, raw_details[details_channel]])
        )
    }
}
