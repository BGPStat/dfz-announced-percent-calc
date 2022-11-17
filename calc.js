// MIT LICENSE
// 
// Copyright (c) 2022 Arctictel Ltd & Unlimited is Limited Joint-Venture
// 
// Permission is hereby granted, free of charge, to any person obtaining
// a copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to
// permit persons to whom the Software is furnished to do so, subject to
// the following conditions:
// 
// The above copyright notice and this permission notice shall be
// included in all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
// EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
// NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
// LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
// OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
// WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

// INSTRUCTIONS
//
// Supply this software with two files named `table4.txt` and `table6.txt`.
// These files should include the full BGP routing table for IPv4 & IPv6
// respectively.
//
// E.g. `birdc s r table master4 | rg -j 16 'AS' | rg -j 16 'unicast' | rg -j 16 '/' | cut -d ' ' -f1 > table4.txt`
//
// MAKE SURE to feed `clean` tables. I.e. no empty lines, no comments,
// nothing else than pure routes in CIDR form:
//
// ```
// 1.0.0.0/24
// 1.0.0.1/24
// 1.0.0.2/24
// ```

const fs = require('fs');

// helper funcs
const readTable = (f) => [...new Set(fs.readFileSync(__dirname + '/' + f).toString().split('\n'))]; // set removes dupes
const calcTable = (t, b) => t.map(route => Math.pow(2, (b - parseInt(route.split('/')[1])))).reduce((a, v) => (a + v))

// constants
const IPV4_MAX_32S = Math.pow(2, 32);
const IPV6_MAX_128S = Math.pow(2, 128);

// read tables
const table4 = readTable('table4.txt');
const table6 = readTable('table6.txt');

// calculate tables
const sum4 = calcTable(table4, 32);
const sum6 = calcTable(table6, 128);

// send output
console.log('% of IPv4 space in DFZ: ' + ((sum4 / IPV4_MAX_32S) * 100) + '%');
console.log('% of IPv6 space in DFZ: ' + ((sum6 / IPV6_MAX_128S) * 100) + '%');