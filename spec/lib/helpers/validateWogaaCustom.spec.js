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

const mockWogaaCustom = require('../../specHelpers/mockWogaaCustom');

const EXPECTED_FUNCTIONS = [
  'addMeta',
  'completeTransactionalService',
  'startTransactionalService',
];

describe('validateWogaaCustom helper delegate', function () {
  describe('with missing "wogaaCustom" global object', function () {
    beforeEach(function () {
      global.wogaaCustom = undefined;
      this.helperDelegate = require('../../../src/lib/helpers/validateWogaaCustom');
    });

    afterEach(function () {
      delete global.wogaaCustom;
    });

    it('throws an error', function () {
      expect(() => {
        this.helperDelegate();
      }).toThrowError(Error, 'WOGAA is not available.');
    });
  });

  describe('with invalid "wogaaCustom" global object', function () {
    describe('with none of the expected functions', function () {
      beforeEach(function () {
        global.wogaaCustom = mockWogaaCustom('all');

        this.helperDelegate = require('../../../src/lib/helpers/validateWogaaCustom');
      });

      afterEach(function () {
        delete global.wogaaCustom;
      });

      it('throws an error', function () {
        expect(() => {
          this.helperDelegate();
        }).toThrowError(Error, 'WOGAA is not available.');
      });
    });

    describe('with any missing expected function', function () {
      EXPECTED_FUNCTIONS.forEach((func) => {
        beforeEach(function () {
          global.wogaaCustom = mockWogaaCustom(func);

          this.helperDelegate = require('../../../src/lib/helpers/validateWogaaCustom');
        });

        afterEach(function () {
          delete global.wogaaCustom;
        });

        it(`throws an error when "${func}" is missing`, function () {
          expect(() => {
            this.helperDelegate();
          }).toThrowError(Error, 'WOGAA is not available.');
        });
      });
    });
  });

  describe('with valid "wogaaCustom" global object', function () {
    beforeEach(function () {
      global.wogaaCustom = mockWogaaCustom();

      this.helperDelegate = require('../../../src/lib/helpers/validateWogaaCustom');
    });

    it('returns true', function () {
      const result = this.helperDelegate();

      expect(result).toBeTrue();
    });
  });
});
