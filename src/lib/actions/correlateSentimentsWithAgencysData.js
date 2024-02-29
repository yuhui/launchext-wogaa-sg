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
const { addMeta } = require('../controllers/wogaa');

/**
 * Correlate Sentiments with Agency Data.
 * This action implements the `addMeta()` method.
 *
 * @param {Object} settings The settings object.
 * @param {String} settings.agencyTxnId A unique identifier.
 */
module.exports = function ({ agencyTxnId } = {}) {
  if (!agencyTxnId) {
    logError('Missing required unique identifier, e.g. Session ID or Transaction ID.');
    return;
  }
  const metaValue = { agencyTxnId };

  try {
    addMeta(metaValue);
  } catch (e) {
    logError(e.message);
    return;
  }

  logInfo(`Correlating Sentiments with agency unique identifier "${agencyTxnId}".`);
};
