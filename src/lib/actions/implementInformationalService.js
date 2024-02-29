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
const loadWogaa = require('../helpers/loadWogaa');
const validateWogaaCustom = require('../helpers/validateWogaaCustom');

/**
 * Implement Informational Service snippet action.
 * This action tracks an Informational Service.
 */
module.exports = async function () {
  let isWogaaCustomLoaded = false;
  try {
    isWogaaCustomLoaded = validateWogaaCustom();
  } catch (e) {
    // ignore all errors
  }

  if (isWogaaCustomLoaded) {
    logInfo('WOGAA library has been loaded already.');
    return;
  }

  let scriptEnvironment;
  try {
    scriptEnvironment = await loadWogaa();
  } catch (e) {
    logError(e.message);
    return;
  }
  logInfo(`Implemented Informational Service successfully in ${scriptEnvironment}.`);
};
