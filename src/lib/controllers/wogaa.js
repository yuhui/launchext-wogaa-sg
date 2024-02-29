/**
 * Copyright 2024 Yuhui. All rights reserved.
 *
 * Licensed under the GNU General Public License, Version 3.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.gnu.org/licenses/gpl-3.0.html
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const { TRANSACTION_TYPES } = require('../constants');
const validateWogaaCustom = require('../helpers/validateWogaaCustom');

module.exports = {
  /**
   * Add meta data, e.g. to correlate sentiments.
   *
   * @param {String} data={} Meta data to add.
   *
   * @global wogaaCustom
   *
   * @throws {Error} options does not have any keys.
   */
  addMeta: function (data = {}) {
    const numDataKeys = Object.keys(data).length;
    if (numDataKeys === 0) {
      throw new Error('No meta data provided.');
    }

    validateWogaaCustom();

    const { addMeta } = wogaaCustom;

    addMeta(data);
  },

  /**
   * Track a Transactional Service.
   *
   * @param {String} type Type of transactional service: "start" or "complete"
   * @param {String} trackingId Tracking ID created at WOGAA.sg for the transaction.
   * @param {String} options={} Additional options to track with the transactional service.
   *
   * @global wogaaCustom
   *
   * @throws {Error} type is not set.
   * @throws {Error} type is not a valid type.
   * @throws {Error} trackingId is not set.
   */
  trackTransactionalService: function (type, trackingId, options = {}) {
    if (!type) {
      throw new Error('Missing required Transactional Service type: "start" or "complete".');
    }
    if (!TRANSACTION_TYPES.has(type)) {
      throw new Error(`Invalid Transactional Service type: ${type}.`);
    }

    if (!trackingId) {
      throw new Error('Missing required Transactional Service trackingId.');
    }

    validateWogaaCustom();

    const { completeTransactionalService, startTransactionalService } = wogaaCustom;

    switch (type) {
      case 'start':
        startTransactionalService(trackingId, options);
        break;
      case 'complete':
        completeTransactionalService(trackingId, options);
        break;
    }
  },
};
