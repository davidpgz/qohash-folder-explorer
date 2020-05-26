#!/usr/bin/env node

const yargs = require('yargs');
const axios = require('axios');
const Table = require('cli-table');

const options = yargs
    .usage('Usage: -p <path>')
    .option('p', { alias: 'path', describe: 'The folder path content to display', type: 'string', demandOption: true })
    .argv;

axios.get(`http://localhost:3000/?path=${options.path}`)
    .then(response => {
        console.log(`Total folder size: ${response.data.totalSize}`);
        console.log(`Total entries: ${response.data.entries.length}`);

        const table = new Table({
            head: ['Type', 'Size', 'Modified', 'Name' ],
            // To deactivate table borders.
            chars: { 'top': '' , 'top-mid': '' , 'top-left': '' , 'top-right': ''
                , 'bottom': '' , 'bottom-mid': '' , 'bottom-left': '' , 'bottom-right': ''
                , 'left': '' , 'left-mid': '' , 'mid': '' , 'mid-mid': ''
                , 'right': '' , 'right-mid': '' , 'middle': ' ' },
        });
        response.data.entries.forEach(entry => {
            table.push([
                entry.isDirectory ? 'D' : 'F',
                entry.size != null ? entry.size : '',
                entry.lastModifiedDate != null ? entry.lastModifiedDate : '',
                entry.name]);
        });
        console.log(table.toString());
    })
    .catch(error => console.log(error.data));