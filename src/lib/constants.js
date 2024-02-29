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

const TRANSACTION_TYPES = new Set(['complete', 'start']);
const WOGAA_SCRIPT_URLS = new Map([
  ['test', 'https://assets.dcube.cloud/scripts/wogaa.js'],
  ['production', 'https://assets.wogaa.sg/scripts/wogaa.js'],
]);
const WOGAA_SCRIPT_ENVIRONMENTS = new Set(WOGAA_SCRIPT_URLS.keys());

module.exports = {
  TRANSACTION_TYPES,
  WOGAA_SCRIPT_URLS,
  WOGAA_SCRIPT_ENVIRONMENTS,
};
