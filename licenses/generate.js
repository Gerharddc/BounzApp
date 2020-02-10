/**
 * Copyright (c) 2018-present, Bounz Media (Pty) Ltd
 * Created by Gerhard de Clercq
 */

const fs = require('fs');
const readLine = require('readline');
const https = require('https');
const repositoryUrl = require('get-repository-url');

const LICENSE_PATH = '/master/LICENSE';

function getLicense(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            const lineReader = readLine.createInterface({
                input: res
            });

            let output = '';
            let startedNewLine = true;

            lineReader.on('line', (line) => {
                if (line === '') {
                    output += '\n\n';
                    startedNewLine = true;
                } else {
                    if (startedNewLine) {
                        startedNewLine = false;
                    } else {
                        output += ' ';
                    }

                    output += line;
                }
            });

            lineReader.on('close', () => {
                resolve(output);
            });
        });
    });
}

async function getLicenses() {
    const licenses = [];
    const errs = [];

    const special = JSON.parse(fs.readFileSync('licenses/special.json'));

    const rawdata = fs.readFileSync('package.json');
    const pack = JSON.parse(rawdata);
    const deps = pack.dependencies;

    for (const property in deps) {
        if (deps.hasOwnProperty(property)) {
            try {
                console.log(property);
                let url = '';
                let license = '404: Not Found';

                if (special.hasOwnProperty(property)) {
                    if (special[property].hasOwnProperty('url')) {
                        url = special[property].url;
                    } else if (special[property].hasOwnProperty('license')) {
                        license = special[property].license;
                    }
                } else {
                    url = await repositoryUrl(property);

                    if (url) {
                        url += LICENSE_PATH;
                        url = url.replace('https://github.com', 'https://raw.githubusercontent.com');
                    }
                }

                if (url && url !== '') {
                    license = await getLicense(url);
                    if (license === '404: Not Found') {
                        license = await getLicense(url.replace('LICENSE', 'LICENSE.md'));
                    }
                    if (license === '404: Not Found') {
                        license = await getLicense(url.replace('LICENSE', 'LICENSE.txt'));
                    }
                }

                if (license === '404: Not Found') {
                    console.log('err');
                    errs.push(property);
                } else {
                    // Remove multiple spaces
                    license = license.replace(/ +(?= )/g,'');
                    // license = license.replace('\n\n ', '\n\n');

                    console.log('valid');
                    licenses.push({
                        title: property,
                        text: license,
                    });
                }
            } catch (e) {
                console.log(property, e);
            }
        }
    }

    fs.writeFileSync('assets/licenses.json', JSON.stringify({ list: licenses }, undefined, 2));
    console.log('errors', errs);
}

getLicenses();
