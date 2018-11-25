//////////////////////////
//                      //
//     DEPENDENCIES     //
//                      //
//////////////////////////

/*************/
/* FRAMEWORK */
/*************/

import { Injectable } from '@angular/core';

/////////////////////
//                 //
//     SERVICE     //
//                 //
/////////////////////

@Injectable({
    providedIn: 'root'
})
export class XmlService {

    /***************/
    /* CONSTRUCTOR */
    /***************/

    public constructor() { }

    /******************/
    /* PUBLIC METHODS */
    /******************/

    public fromText(text): object {
        const parser = new DOMParser();
        return parser.parseFromString(text, "text/xml");
    }

    public toJSON(xml): object {
        const plist = xml.getElementsByTagName("plist")[0].firstElementChild;
        return this.parseDictionary(plist);
    }

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    private parseDictionary(node) {
        let response = {};
        let key = node.firstElementChild;

        while (key) {
            let value = key.nextElementSibling;
            if (value) {
                switch (value.nodeName) {
                    case "dict":
                        response[key.innerHTML] = this.parseDictionary(value);
                        break;
                    case "array":
                        response[key.innerHTML] = this.parseArray(value);
                        break;
                    case "true":
                    case "false":
                        response[key.innerHTML] = value.nodeName;
                        break;
                    default:
                        response[key.innerHTML] = value.innerHTML;
                }
                key = value.nextElementSibling;
            }
        }

        return response;
    }

    private parseArray(node) {
        let response = [];

        node.childNodes.forEach(element => {
            switch (element.nodeName) {
                case "dict":
                    response.push(this.parseDictionary(element));
                    break;
                case "array":
                    response.push(this.parseArray(element));
                    break;
            }
        });
    }

} // End class XmlService
