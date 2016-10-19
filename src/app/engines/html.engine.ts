import * as fs from 'fs-extra';
import * as path from 'path';
import * as Handlebars from 'handlebars';
//import * as helpers from 'handlebars-helpers';

export class HtmlEngine {
    constructor() {
        //TODO use this instead : https://github.com/assemble/handlebars-helpers
        Handlebars.registerHelper( "compare", function(a, operator, b, options) {
          if (arguments.length < 4) {
            throw new Error('handlebars Helper {{compare}} expects 4 arguments');
          }

          var result;
          switch (operator) {
            case '==':
              result = a == b;
              break;
            case '===':
              result = a === b;
              break;
            case '!=':
              result = a != b;
              break;
            case '!==':
              result = a !== b;
              break;
            case '<':
              result = a < b;
              break;
            case '>':
              result = a > b;
              break;
            case '<=':
              result = a <= b;
              break;
            case '>=':
              result = a >= b;
              break;
            case 'typeof':
              result = typeof a === b;
              break;
            default: {
              throw new Error('helper {{compare}}: invalid operator: `' + operator + '`');
            }
          }

          if (result === false) {
            return options.inverse(this);
          }
          return options.fn(this);
        });
    }
    init() {
        fs.readFile(path.resolve(__dirname + '/../src/templates/menu.hbs'), 'utf8', (err, data) => {
            if (err) throw err;
            Handlebars.registerPartial('menu', data);
        });
    }
    render(mainData:any, page:any) {
        var o = mainData;
        Object.assign(o, page);
        console.log(o);
        return new Promise(function(resolve, reject) {
           fs.readFile(path.resolve(__dirname + '/../src/templates/page.hbs'), 'utf8', (err, data) => {
               if (err) {
                   reject('Error during index ' + page.name + ' generation');
               } else {
                   let template:any = Handlebars.compile(data),
                       result = template(o);
                   resolve(result);
               }
           });
        });
    }
};