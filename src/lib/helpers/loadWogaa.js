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

const loadScript = require('@adobe/reactor-load-script');

const getWogaaScriptUrl = require('./getWogaaScriptUrl');
const validateWogaaCustom = require('./validateWogaaCustom');
const { environment } = require('../controllers/turbine');

/**
 * Load the WOGAA script asynchronously.
 *
 * @async
 *
 * @returns {String} environment that was used to load the WOGAA script. "test" or "production".
 *
 * @throws {Error} something went wrong when loading WOGAA.
 * @throws {Error} error from getWogaaScriptUrl().
 * @throws {Error} error from validateWogaaCustom().
 */
module.exports = async () => {
  const scriptEnvironment = environment === 'production' ? environment : 'test';
  const scriptUrl = getWogaaScriptUrl(scriptEnvironment);

  try {
    await loadScript(scriptUrl);
  } catch (e) {
    throw new Error(
      `Failed to load WOGAA from "${scriptUrl}" in "${scriptEnvironment}" environment.`
    );
  }

  validateWogaaCustom();

  return scriptEnvironment;
};
