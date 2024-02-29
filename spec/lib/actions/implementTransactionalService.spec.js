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

describe('implementTransactionalService action delegate', function () {
  beforeEach(function () {
    this.settings = {
      type: 'start',
      trackingId: 'abc-123',
      uniqueTransactionId: 'xyz-789',
    };

    this.turbine = mockTurbine();
    this.wogaa = mockWogaa();
  });

  describe('with valid "settings" argument', function () {
    describe('with broken "wogaa"', function () {
      beforeEach(function () {
        this.wogaaWithErrors = mockWogaa(true);

        this.actionDelegate = proxyquire(
          '../../../src/lib/actions/implementTransactionalService',
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

    describe('with valid "wogaa"', function () {
      beforeEach(function () {
        const { uniqueTransactionId } = this.settings;
        this.options = { uniqueTransactionId };

        this.actionDelegate = proxyquire(
          '../../../src/lib/actions/implementTransactionalService',
          {
            '../controllers/turbine': this.turbine,
            '../controllers/wogaa': this.wogaa,
          }
        );
      });

      it('tracks the Transactional Service without options', function () {
        delete this.settings.uniqueTransactionId;

        this.actionDelegate(this.settings);

        const { type, trackingId } = this.settings;
        const { trackTransactionalService } = this.wogaa;
        expect(trackTransactionalService).toHaveBeenCalledOnceWith(type, trackingId, {});

        const { info: logInfo } = this.turbine.logger;
        expect(logInfo).toHaveBeenCalledOnceWith(
          `Implemented "${type}" Transactional Service for trackingId "${trackingId}".`
        );
      });

      it('tracks the Transactional Service with null options', function () {
        this.settings.uniqueTransactionId = null;

        this.actionDelegate(this.settings);

        const { type, trackingId } = this.settings;
        const { trackTransactionalService } = this.wogaa;
        expect(trackTransactionalService).toHaveBeenCalledOnceWith(type, trackingId, {});

        const { info: logInfo } = this.turbine.logger;
        expect(logInfo).toHaveBeenCalledOnceWith(
          `Implemented "${type}" Transactional Service for trackingId "${trackingId}".`
        );
      });

      it('tracks the Transactional Service with options', function () {
        this.actionDelegate(this.settings);

        const { type, trackingId } = this.settings;
        const { uniqueTransactionId } = this.options;
        const { trackTransactionalService } = this.wogaa;
        expect(trackTransactionalService).toHaveBeenCalledOnceWith(type, trackingId, this.options);

        const { info: logInfo } = this.turbine.logger;
        expect(logInfo).toHaveBeenCalledOnceWith(
          // eslint-disable-next-line max-len
          `Implemented "${type}" Transactional Service for trackingId "${trackingId}" with unique transaction ID "${uniqueTransactionId}".`
        );
      });
    });
  });
});
