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
        return parser.parseFromString(text, 'text/xml');
    }

    public parseXML(text: string) {
        const xml = this.fromText(text);
        const json = this.toJSON(xml);
        return json;
    }


    public toJSON(xml): object {
        const plist = xml.getElementsByTagName('plist')[0].firstElementChild;
        return this._parseDictionary(plist);
    }

    /*******************/
    /* PRIVATE METHODS */
    /*******************/

    private _parseArray(node) {
        let response = [];

        node.childNodes.forEach(element => {
            switch (element.nodeName) {
                case 'dict':
                    response.push(this._parseDictionary(element));
                    break;
                case 'array':
                    response.push(this._parseArray(element));
                    break;
            }
        });

        return response;
    }

    private _parseDictionary(node) {
        let response = {};
        let key = node.firstElementChild;

        while (key) {
            let value = key.nextElementSibling;
            if (value) {
                switch (value.nodeName) {
                    case 'dict':
                        response[key.innerHTML] = this._parseDictionary(value);
                        break;
                    case 'Playlists':
                        break;
                    case 'array':
                        response[key.innerHTML] = this._parseArray(value);
                        break;
                    case 'true':
                    case 'false':
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

} // End class XmlService