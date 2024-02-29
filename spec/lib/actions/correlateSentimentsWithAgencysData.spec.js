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
const mockWogaa = require('../../specHelpers/mockWogaa');

describe('correlateSentimentsWithAgencysData action delegate', function () {
  beforeEach(function () {
    this.settings = {
      agencyTxnId: 'bar',
    };

    this.turbine = mockTurbine();
    this.wogaa = mockWogaa();
  });

  describe('with invalid "settings" argument', function () {
    beforeEach(function () {
      this.actionDelegate = proxyquire(
        '../../../src/lib/actions/correlateSentimentsWithAgencysData',
        {
          '../controllers/turbine': this.turbine,
          '../controllers/wogaa': this.wogaa,
        }
      );
    });

    it('logs an error when "agencyTxnId" is missing', function () {
      delete this.settings.agencyTxnId;

      this.actionDelegate(this.settings);

      const { error: logError } = this.turbine.logger;
      expect(logError).toHaveBeenCalledWith(
        'Missing required unique identifier, e.g. Session ID or Transaction ID.'
      );
    });
  });

  describe('with valid "settings" argument', function () {
    describe('with broken "wogaa"', function () {
      beforeEach(function () {
        this.wogaaWithErrors = mockWogaa(true);

        this.actionDelegate = proxyquire(
          '../../../src/lib/actions/correlateSentimentsWithAgencysData',
          {
            '../controllers/turbine': this.turbine,
            '../controllers/wogaa': this.wogaaWithErrors,
          }
        );
      });

      it('logs an error', function () {
        this.actionDelegate(this.settings);

        const { error: logError } = this.turbine.logger;
        expect(logError).toHaveBeenCalled();
      });
    });

    describe('with everything working properly', function () {
      beforeEach(function () {
        this.actionDelegate = proxyquire(
          '../../../src/lib/actions/correlateSentimentsWithAgencysData',
          {
            '../controllers/turbine': this.turbine,
            '../controllers/wogaa': this.wogaa,
          }
        );
      });

      it('logs an info', function () {
        this.actionDelegate(this.settings);

        const { agencyTxnId } = this.settings;
        const metaValue = { agencyTxnId };
        const { addMeta } = this.wogaa;
        expect(addMeta).toHaveBeenCalledOnceWith(metaValue);

        const { info: logInfo } = this.turbine.logger;
        expect(logInfo).toHaveBeenCalledWith(
          `Correlating Sentiments with agency unique identifier "${agencyTxnId}".`
        );
      });
    });
  });
});
