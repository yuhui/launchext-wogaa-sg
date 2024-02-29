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

const {
  logger: {
    error: logError,
    info: logInfo,
  },
} = require('../controllers/turbine');
const { trackTransactionalService } = require('../controllers/wogaa');

/**
 * Implement Transactional Service snippet action.
 * This action tracks a Transactional Service.
 *
 * @param {Object} settings The settings object.
 * @param {String} settings.type Type of transactional service: "start" or "complete"
 * @param {String} settings.trackingId Tracking ID created at WOGAA.sg for the transaction.
 * @param {String} settings.uniqueTransactionId (optional) Unique transaction ID for the
 *    transaction.
 */
module.exports = function ({ type, trackingId, uniqueTransactionId = null } = {}) {
  const options = {};
  if (uniqueTransactionId) {
    options.uniqueTransactionId = uniqueTransactionId;
  }

  try {
    trackTransactionalService(type, trackingId, options);
  } catch (e) {
    logError(e.message);
    return;
  }

  const hasOptions = Object.keys(options).length > 0;
  const logBase = `Implemented "${type}" Transactional Service for trackingId "${trackingId}"`;
  const logOptions = hasOptions ? ` with unique transaction ID "${uniqueTransactionId}"` : '';
  logInfo(`${logBase}${logOptions}.`);
};
