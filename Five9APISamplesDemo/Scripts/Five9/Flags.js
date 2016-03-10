/*
 * Copyright (c) 2014 Five9, Inc. The content presented herein may not, under any
 * circumstances, be reproduced in whole or in any part or form without written
 * permission from Five9, Inc.
 *
 * This program is distributed in the hope that it will be useful, but without
 * any warranty. It is provided "as is" without warranty of any kind, either expressed
 * or implied, including, but not limited to, the implied warranties of merchantability
 * and fitness for a particular purpose. The entire risk as to the quality and performance
 * of the program is with you. Should the program prove defective, you assume the cost of
 * all necessary servicing, repair or correction.
 *
 * Base: Five9 CTI Web Services 8.2.25 WEBAGENT {20140708_0929}
 */

/**
 * Class for manipulating long string flags masks
 *
 * Q: How do you eat an elephant?
 * A: One byte at a time.
 */
var Flags = (function () {
    /**
     * Constructor
     * @param flags The base10 long flags value
     */
    var cls = function (flags) {
        if (isNaN(flags)) {
            throw new RangeError('Flags are NaN.');
        }

        // base10 flags value
        this.flags = flags;

        // 64-bit binary array initialized to zero
        this.bits = new Array(64);
        var i = this.bits.length;
        while (i-- > 0) {
            this.bits[i] = 0;
        }

        var place = 0;
        var BASE = 2;
        // walk flags digits, converting to binary
        i = flags.length;
        while (i-- > 0) {
            var digit = flags[i];
            var num = Number(digit + 'e' + place++);
            var bin = num.toString(BASE);

            // restrict addend to size of accumulator
            var binindex = Math.min(bin.length, this.bits.length);
            var bitindex = 0, carry = 0;
            // add with carry;
            while (binindex-- > 0 || bitindex < this.bits.length) {
                var sum = this.bits[bitindex];
                var add = parseInt(bin[binindex], BASE) || 0;
                sum += add + carry;
                this.bits[bitindex++] = sum % BASE;
                carry = (sum / BASE) >> 0;

                // finished adding bin and nothing more to carry
                if (binindex <= 0 && carry === 0) break;
            }
        }
    };

    cls.prototype = {
        /**
         * Returns the string representation of the
         * initial long flags string value.
         *
         * @returns {string}
         */
        getFlags: function () {
            return this.flags;
        },

        /**
         * Returns the string representation of the bits as
         * a 64 byte string. Note: the string is in left to right
         * order, so getBits()[0] returns the first bit.
         *
         * @returns {string}
         */
        getBits: function () {
            return this.bits.slice(0).join('');
        },

        /**
         * Returns true if value is a finite number
         *
         * @param value
         * @returns {boolean}
         */
        isNumeric: function (value) {
            return (typeof value === 'number') && isFinite(value);
        },

        /**
         * Returns true if bit is a numeric value in range
         *
         * @param bit
         * @returns {boolean}
         */
        isBitValid: function (bit) {
            if (!this.isNumeric(bit)) {
                throw new RangeError('Bit index is not numeric.');
            }
            if (bit < 0 || bit >= this.bits.length) {
                throw new RangeError('Bit index out of range.');
            }
            return true;
        },

        /**
         * Returns true if the specified bit is set.
         *
         * @param bit Zero based bit index (0 - 63)
         * @returns {boolean}
         */
        isSet: function (bit) {
            if (this.isBitValid(bit)) {
                return (this.bits[bit] === 1);
            }
        },

        /**
         * Returns true if the specified bit is clear.
         *
         * @param bit Zero based bit index (0 - 63)
         * @returns {boolean}
         */
        isClear: function (bit) {
            if (this.isBitValid(bit)) {
                return (this.bits[bit] === 0);
            }
        },

        /**
         * Returns the string representation of the bits as
         * a 64 byte string. Note: the string is in human readable
         * order, so toString()[63] returns the first bit.
         *
         * @returns {string}
         */
        toString: function () {
            return this.bits.slice(0).reverse().join('');
        }
    };

    return cls;
})();