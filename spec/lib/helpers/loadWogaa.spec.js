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

const { WOGAA_SCRIPT_URLS } = require('../../../src/lib/constants');
const mockTurbine = require('../../specHelpers/mockTurbine');

const TURBINE_ENVIRONMENTS = ['development', 'staging', 'production'];

describe('loadWogaa helper delegate', function () {
  beforeEach(function () {
    this.error = new Error('die');
    this.wogaaScriptUrl = 'http://www.foo.com/bar';

    this.loadScript = jasmine.createSpy().and.resolveTo(true);
    this.validateWogaaCustom = jasmine.createSpy().and.returnValue(true);
    this.getWogaaScriptUrl = jasmine.createSpy().and.returnValue(this.wogaaScriptUrl);

    this.turbine = mockTurbine();
    this.environment = this.turbine.environment;
    this.scriptEnvironment = this.environment === 'production' ? this.environment : 'test';
  });

  describe('with broken getWogaaScriptUrl()', function () {
    beforeEach(function () {
      this.getWogaaScriptUrlWithError = jasmine.createSpy().and.throwError(this.error),

      this.helperDelegate = proxyquire(
        '../../../src/lib/helpers/loadWogaa',
        {
          '@adobe/reactor-load-script': this.loadScript,
          './getWogaaScriptUrl': this.getWogaaScriptUrlWithError,
          './validateWogaaCustom': this.validateWogaaCustom,
          '../controllers/turbine': this.turbine,
        }
      );
    });

    it('throws an error', async function () {
      await expectAsync(
        this.helperDelegate()
      ).toBeRejectedWith(this.error);
    });
  });

  describe('with broken loadScript', function () {
    beforeEach(function () {
      this.loadScriptWithError = jasmine.createSpy().and.rejectWith('die'),

      this.helperDelegate = proxyquire(
        '../../../src/lib/helpers/loadWogaa',
        {
          '@adobe/reactor-load-script': this.loadScriptWithError,
          './getWogaaScriptUrl': this.getWogaaScriptUrl,
          './validateWogaaCustom': this.validateWogaaCustom,
          '../controllers/turbine': this.turbine,
        }
      );
    });

    it('throws an error', async function () {
      await expectAsync(
        this.helperDelegate()
      ).toBeRejectedWithError(
        Error,
        // eslint-disable-next-line max-len
        `Failed to load WOGAA from "${this.wogaaScriptUrl}" in "${this.scriptEnvironment}" environment.`
      );
    });
  });

  describe('with broken validateWogaaCustom()', function () {
    beforeEach(function () {
      this.validateWogaaCustomWithError = jasmine.createSpy().and.throwError(this.error),

      this.helperDelegate = proxyquire(
        '../../../src/lib/helpers/loadWogaa',
        {
          '@adobe/reactor-load-script': this.loadScript,
          './getWogaaScriptUrl': this.getWogaaScriptUrl,
          './validateWogaaCustom': this.validateWogaaCustomWithError,
          '../controllers/turbine': this.turbine,
        }
      );
    });

    it('throws an error', async function () {
      await expectAsync(
        this.helperDelegate()
      ).toBeRejectedWith(this.error);
    });
  });

  describe('with everything working properly', function () {
    TURBINE_ENVIRONMENTS.forEach((environment) => {
      beforeEach(function () {
        this.turbine = mockTurbine(environment);
        this.wogaaEnvironment = environment === 'production' ? environment : 'test';
        this.wogaaScriptUrl = WOGAA_SCRIPT_URLS.get(this.wogaaEnvironment);
        this.getWogaaScriptUrl = jasmine.createSpy().and.returnValue(this.wogaaScriptUrl);

        this.helperDelegate = proxyquire(
          '../../../src/lib/helpers/loadWogaa',
          {
            '@adobe/reactor-load-script': this.loadScript,
            './getWogaaScriptUrl': this.getWogaaScriptUrl,
            './validateWogaaCustom': this.validateWogaaCustom,
            '../controllers/turbine': this.turbine,
          }
        );
      });
  
      it('returns the WOGAA script environment', async function () {
        const result = await this.helperDelegate();
  
        expect(this.getWogaaScriptUrl).toHaveBeenCalledTimes(1);
  
        expect(this.loadScript).toHaveBeenCalledOnceWith(this.wogaaScriptUrl);
  
        expect(result).toEqual(this.wogaaEnvironment);
      });
    });
  });
});
