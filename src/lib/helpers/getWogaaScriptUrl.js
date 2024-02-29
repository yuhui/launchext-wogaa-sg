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
  WOGAA_SCRIPT_ENVIRONMENTS,
  WOGAA_SCRIPT_URLS,
} = require('../constants');

/**
 * Get the script URL for the WOGAA environment.
 *
 * @param {String} environment=test The WOGAA environment. "test" or "production".
 *
 * @returns {String} WOGAA script URL of the selected environment ("test", "production").
 *
 * @throws {Error} environment is not "test" or "production".
 */
module.exports = function (environment = 'test') {
  if (!WOGAA_SCRIPT_ENVIRONMENTS.has(environment)) {
    throw new Error(`Unexpected environment: "${environment}".`);
  }

  const scriptUrl = WOGAA_SCRIPT_URLS.get(environment);
  return scriptUrl;
};
