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

const { WOGAA_SCRIPT_URLS } = require('../../../src/lib/constants');

describe('getWogaaScriptUrl helper delegate', function () {
  beforeEach(function () {
    this.helperDelegate = require('../../../src/lib/helpers/getWogaaScriptUrl');
  });

  describe('with invalid arguments', function () {
    it('throws an error when "environment" is invalid', function () {
      const environment = 'foo';

      expect(() => {
        this.helperDelegate(environment);
      }).toThrowError(Error, `Unexpected environment: "${environment}".`);
    });
  });

  for (const environment in WOGAA_SCRIPT_URLS.keys()) {
    describe('with valid arguments', function () {
      it(`returns a URL for environment "${environment}"`, function () {
        const result = this.helperDelegate(environment);

        const expectedUrl = WOGAA_SCRIPT_URLS.get(environment);
        expect(result).toEqual(expectedUrl);
      });
    });
  }
});
