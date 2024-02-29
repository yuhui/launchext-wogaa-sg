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

const EXPECTED_FUNCTIONS = [
  'addMeta',
  'completeTransactionalService',
  'startTransactionalService',
];

let isValidWogaaCustom = false;

/**
 * Validate that the global WOGAA library is proper.
 *
 * @global wogaaCustom
 *
 * @returns {Boolean} `true` if the WOGAA library is proper.
 *
 * @throws {Error} wogaaCustom does not have any of the expected functions.
 */
module.exports = () => {
  if (isValidWogaaCustom) {
    return isValidWogaaCustom;
  }

  const _wogaaCustom = wogaaCustom || {};

  isValidWogaaCustom = EXPECTED_FUNCTIONS.every((func) => {
    return Object.hasOwn(_wogaaCustom, func) && typeof _wogaaCustom[func] === 'function';
  });

  if (!isValidWogaaCustom) {
    throw new Error('WOGAA is not available.');
  }

  isValidWogaaCustom = true;
  return isValidWogaaCustom;
};
