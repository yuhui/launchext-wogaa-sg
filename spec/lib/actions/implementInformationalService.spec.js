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

const proxyquire = require('proxyquire').noCallThru();

const mockTurbine = require('../../specHelpers/mockTurbine');

const TURBINE_ENVIRONMENTS = [
  'development',
  //'staging',
  //'production',
];

describe('implementInformationalService action delegate', function () {
  beforeEach(function () {
    this.error = new Error('die');

    this.loadWogaa = jasmine.createSpy().and.resolveTo('test');
    this.validateWogaaCustomWithErrors = jasmine.createSpy().and.throwError(this.error);
    this.turbine = mockTurbine();
  });

  describe('with valid "wogaaCustom"', function () {
    beforeEach(function () {
      this.validateWogaaCustom = jasmine.createSpy().and.returnValue(true);

      this.actionDelegate = proxyquire(
        '../../../src/lib/actions/implementInformationalService',
        {
          '../controllers/turbine': this.turbine,
          '../helpers/loadWogaa': this.loadWogaa,
          '../helpers/validateWogaaCustom': this.validateWogaaCustom,
        }
      );
    });

    it('logs an info', async function () {
      await this.actionDelegate();

      const { info: logInfo } = this.turbine.logger;
      expect(logInfo).toHaveBeenCalledWith('WOGAA library has been loaded already.');
    });
  });

  describe('with missing "wogaaCustom"', function () {
    TURBINE_ENVIRONMENTS.forEach((environment) => {
      describe(`in ${environment} environment`, function () {
        beforeEach(function () {
          this.scriptEnvironment = environment === 'production' ? 'production' : 'test';
        });

        describe('with broken loadWogaa()', function () {
          beforeEach(function () {
            this.loadWogaaWithErrors = jasmine.createSpy().and.rejectWith(this.error);

            this.actionDelegate = proxyquire(
              '../../../src/lib/actions/implementInformationalService',
              {
                '../controllers/turbine': this.turbine,
                '../helpers/loadWogaa': this.loadWogaaWithErrors,
                '../helpers/validateWogaaCustom': this.validateWogaaCustomWithErrors,
              }
            );
          });

          it('logs an error', async function () {
            await this.actionDelegate();

            expect(this.validateWogaaCustomWithErrors).toHaveBeenCalledTimes(1);
            expect(this.loadWogaaWithErrors).toHaveBeenCalledTimes(1);

            const { error: logError } = this.turbine.logger;
            expect(logError).toHaveBeenCalledWith(this.error.message);
          });
        });

        describe('with loadScript success', function () {
          beforeEach(function () {
            this.loadWogaa = jasmine.createSpy().and.resolveTo(this.scriptEnvironment);

            this.actionDelegate = proxyquire(
              '../../../src/lib/actions/implementInformationalService',
              {
                '../controllers/turbine': this.turbine,
                '../helpers/loadWogaa': this.loadWogaa,
                '../helpers/validateWogaaCustom': this.validateWogaaCustomWithErrors,
              }
            );
          });

          it('runs to completion', async function () {
            await this.actionDelegate();

            expect(this.validateWogaaCustomWithErrors).toHaveBeenCalledTimes(1);
            expect(this.loadWogaa).toHaveBeenCalledTimes(1);

            const { info: logInfo } = this.turbine.logger;
            expect(logInfo).toHaveBeenCalledWith(
              `Implemented Informational Service successfully in ${this.scriptEnvironment}.`
            );
          });
        });
      });
    });
  });
});
