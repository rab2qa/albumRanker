import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class XmlService {

  ////////////////////////////
  //                        //
  //     PUBLIC METHODS     //
  //                        //
  ////////////////////////////

  constructor() { }

  public FromText(text): object {
    const parser = new DOMParser();
    return parser.parseFromString(text, "text/xml");
  }

  public ToJSON(xml): object {
    const plist = xml.getElementsByTagName("plist")[0].firstElementChild;
    return this.ParseDictionary(plist);
  }
  
  /////////////////////////////
  //                         //
  //     PRIVATE METHODS     //
  //                         //
  /////////////////////////////

  private ParseDictionary(node) {
    let response = {};
    let key = node.firstElementChild;
  
    while (key) {
      let value = key.nextElementSibling;
      if (value) {
        switch (value.nodeName) {
          case "dict":
            response[key.innerHTML] = this.ParseDictionary(value);
            break;
          case "array":
            response[key.innerHTML] = this.ParseArray(value);
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
  
  private ParseArray(node) {
    let response = [];
  
    node.childNodes.forEach(element => {
      switch (element.nodeName) {
        case "dict":
          response.push(this.ParseDictionary(element));
          break;
        case "array":
          response.push(this.ParseArray(element));
          break;
      }
    });
  }

} // End class XmlService
