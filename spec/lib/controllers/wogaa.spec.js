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

const mockWogaaCustom = require('../../specHelpers/mockWogaaCustom');

const { TRANSACTION_TYPES } = require('../../../src/lib/constants');

describe('wogaa controller delegate', function () {
  beforeEach(function () {
    this.error = new Error('die');

    this.validateWogaaCustom = jasmine.createSpy().and.returnValue(true);
  });

  it('returns the expected object', function () {
    global.wogaaCustom = mockWogaaCustom();

    this.controllerDelegate = proxyquire(
      '../../../src/lib/controllers/wogaa',
      {
        '../helpers/validateWogaaCustom': this.validateWogaaCustom,
      }
    );

    const result = this.controllerDelegate;

    expect(result).toBeDefined();

    const { addMeta, trackTransactionalService } = result;
    expect(addMeta).toBeInstanceOf(Function);
    expect(trackTransactionalService).toBeInstanceOf(Function);

    delete global.wogaaCustom;
  });

  describe('addMeta() function', function () {
    beforeEach(function () {
      this.data = {
        foo: 'bar',
      };

      this.functionName = 'addMeta';
    });

    describe('with invalid arguments', function () {
      beforeEach(function () {
        global.wogaaCustom = mockWogaaCustom();

        this.controllerDelegate = proxyquire(
          '../../../src/lib/controllers/wogaa',
          {
            '../helpers/validateWogaaCustom': this.validateWogaaCustom,
          }
        );
        this.functionDelegate = this.controllerDelegate[this.functionName];
      });

      afterEach(function () {
        delete global.wogaaCustom;
      });

      it('throws an error when "data" argument is not set', function () {
        expect(() => {
          this.functionDelegate();
        }).toThrowError(Error, 'No meta data provided.');
      });
    });

    describe('with valid arguments', function () {
      describe('with missing wogaaCustom object', function () {
        beforeEach(function () {
          delete global.wogaaCustom;
          this.validateWogaaCustomWithErrors = jasmine.createSpy().and.throwError('die');

          this.controllerDelegate = proxyquire(
            '../../../src/lib/controllers/wogaa',
            {
              '../helpers/validateWogaaCustom': this.validateWogaaCustomWithErrors,
            }
          );
          this.functionDelegate = this.controllerDelegate[this.functionName];
        });

        it('throws an error', function () {
          expect(() => {
            this.functionDelegate(this.metric);
          }).toThrow();
        });
      });

      describe('with broken wogaaCustom object', function () {
        beforeEach(function () {
          global.wogaaCustom = mockWogaaCustom('addMeta');
          this.validateWogaaCustomWithErrors = jasmine.createSpy().and.throwError('die');

          this.controllerDelegate = proxyquire(
            '../../../src/lib/controllers/wogaa',
            {
              '../helpers/validateWogaaCustom': this.validateWogaaCustomWithErrors,
            }
          );
          this.functionDelegate = this.controllerDelegate[this.functionName];
        });

        afterEach(function () {
          delete global.wogaaCustom;
        });

        it('throws an error', function () {
          expect(() => {
            this.functionDelegate(this.metric);
          }).toThrow();
        });
      });

      describe('with everything working properly', function () {
        beforeEach(function () {
          global.wogaaCustom = mockWogaaCustom();

          this.controllerDelegate = proxyquire(
            '../../../src/lib/controllers/wogaa',
            {
              '../helpers/validateWogaaCustom': this.validateWogaaCustom,
            }
          );
          this.functionDelegate = this.controllerDelegate[this.functionName];
        });

        afterEach(function () {
          delete global.wogaaCustom;
        });

        it('runs to completion', function () {
          this.functionDelegate(this.data);

          const { addMeta } = global.wogaaCustom;
          expect(addMeta).toHaveBeenCalledOnceWith(this.data);
        });
      });
    });
  });

  describe('trackTransactionalService() function', function () {
    beforeEach(function () {
      this.type = 'start';
      this.transactionId = 'abc-123';
      this.options = {
        uniqueTransactionId: 'xyz-789',
      };

      this.functionName = 'trackTransactionalService';
    });

    describe('with invalid arguments', function () {
      beforeEach(function () {
        global.wogaaCustom = mockWogaaCustom();

        this.controllerDelegate = proxyquire(
          '../../../src/lib/controllers/wogaa',
          {
            '../helpers/validateWogaaCustom': this.validateWogaaCustom,
          }
        );
        this.functionDelegate = this.controllerDelegate[this.functionName];
      });

      afterEach(function () {
        delete global.wogaaCustom;
      });

      it('throws an error when "type" argument is not set', function () {
        expect(() => {
          this.functionDelegate(null, this.trackingId, this.options);
        }).toThrowError(
          Error,
          'Missing required Transactional Service type: "start" or "complete".'
        );
      });

      it('throws an error when "type" argument is not valid', function () {
        const type = 'foo';

        expect(() => {
          this.functionDelegate(type, this.trackingId, this.options);
        }).toThrowError(Error, `Invalid Transactional Service type: ${type}.`);
      });

      it('throws an error when "trackingId" argument is not set', function () {
        expect(() => {
          this.functionDelegate(this.type, null, this.options);
        }).toThrowError(Error, 'Missing required Transactional Service trackingId.');
      });
    });

    describe('with valid arguments', function () {
      describe('with missing wogaaCustom object', function () {
        beforeEach(function () {
          delete global.wogaaCustom;
          this.validateWogaaCustomWithErrors = jasmine.createSpy().and.throwError('die');

          this.controllerDelegate = proxyquire(
            '../../../src/lib/controllers/wogaa',
            {
              '../helpers/validateWogaaCustom': this.validateWogaaCustomWithErrors,
            }
          );
          this.functionDelegate = this.controllerDelegate[this.functionName];
        });

        it('throws an error', function () {
          expect(() => {
            this.functionDelegate(this.type, this.trackingId, this.options);
          }).toThrow();
        });
      });

      for (const type in TRANSACTION_TYPES) {
        describe('with broken wogaaCustom object', function () {
          beforeEach(function () {
            global.wogaaCustom = mockWogaaCustom(`${type}TransactionalService`);
            this.validateWogaaCustomWithErrors = jasmine.createSpy().and.throwError('die');
  
            this.controllerDelegate = proxyquire(
              '../../../src/lib/controllers/wogaa',
              {
                '../helpers/validateWogaaCustom': this.validateWogaaCustomWithErrors,
              }
            );
            this.functionDelegate = this.controllerDelegate[this.functionName];
          });
  
          afterEach(function () {
            delete global.wogaaCustom;
          });
  
          it('throws an error', function () {
            expect(() => {
              this.functionDelegate(type, this.trackingId, this.options);
            }).toThrow();
          });
        });

        describe('with everything working properly', function () {
          beforeEach(function () {
            global.wogaaCustom = mockWogaaCustom();

            this.controllerDelegate = proxyquire(
              '../../../src/lib/controllers/wogaa',
              {
                '../helpers/validateWogaaCustom': this.validateWogaaCustom,
              }
            );
            this.functionDelegate = this.controllerDelegate[this.functionName];
          });

          afterEach(function () {
            delete global.wogaaCustom;
          });

          it('runs to completion', function () {
            this.functionDelegate(type, this.trackingId, this.options);

            const transactonalFunction = global.wogaaCustom[`${type}TransactionService`];
            expect(transactonalFunction).toHaveBeenCalledOnceWith(this.trackingId, this.options);
          });

          it('runs to completion without "options"', function () {
            this.functionDelegate(type, this.trackingId);

            const transactonalFunction = global.wogaaCustom[`${type}TransactionService`];
            expect(transactonalFunction).toHaveBeenCalledOnceWith(this.trackingId, {});
          });
        });
      }
    });
  });
});
