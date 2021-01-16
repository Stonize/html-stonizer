import { Injectable } from '@nestjs/common';
import { AlgorandService } from './algorand.service';
import { RequestDto } from './request.dto';

const algosdk = require('algosdk');
const axios = require('axios');
const cheerio = require('cheerio');

// https://hackernoon.com/a-guide-to-web-scraping-with-javascript-and-nodejs-i21l3te1

@Injectable()
export class AppService {

  constructor(readonly algorand: AlgorandService) { }

  normalize(x) {
    x = x.replace(/\n/g, ' ');
    x = x.replace(/\s\s+/g, ' ');
    return x
  }

  normalizeAndExtract(content, start, stop) {

    content = this.normalize(content)
    start = this.normalize(start)
    stop = this.normalize(stop)

    let iStart = content.indexOf(start)
    let iStop = content.indexOf(stop)

    if (iStart < 0 || iStop < 0 || iStart >= iStop) {
      return null;
    }

    return content.substring(iStart, iStop + stop.length)

  }

  async verify(request: RequestDto): Promise<any> {

    const response = await axios.get(request.url)
    const html = response.data;
    const $ = cheerio.load(html);
    let content = $('body').text();

    const tokens = $('input').map((i, x) => { return { 
      'name': $(x).attr('name'), 
      'value': $(x).attr('value'),
      'start': $(x).attr('start'),
      'stop': $(x).attr('stop'),
    }}).toArray().filter(x => "tokenization" === x.name && x.start && x.stop)
    if (!tokens) {
      return {
        status: 500,
        url: request.url,
        message: "No info found"
      };
    }
    if (tokens.length == 0) {
      return {
        status: 500,
        url: request.url,
        message: "No info found"
      };
    }

    // TODO we must extend to hold informations about other tokens in page
    const token = tokens[0]

    let sub = this.normalizeAndExtract(content, token.start, token.stop)
    if (!sub) {
      return {
        status: 501,
        url: request.url,
        message: "Token not match any fragment"
      };
    }

    let note = await this.algorand.getTransactionNoteByScrapingAlgoexplorer(token.value);

    if (!note || !note.content) {
      return {
        status: 502,
        url: request.url,
        message: "Malformed token found"
      };
    }

    if (note.content === sub) {
      return {
        status: 200,
        url: request.url,
        ...note
      };
    }  

    return {
      status: 400,
      url: request.url,
      message: "Token not match: content altered"
    };

  }

  async tokenize(request: RequestDto): Promise<any> {

    const response = await axios.get(request.url)
    const html = response.data;
    const $ = cheerio.load(html);
    let start = request.start
    let stop = request.stop
    let content = $('body').text();

    let sub = this.normalizeAndExtract(content, start, stop)
    if (!sub) {
      return {
        error: "Text fragment not found"
      }
    }

    const stonize = await this.algorand.getStonizeAccount();

    const transaction = await this.algorand.notarize(stonize, {
      url: request.url,
      content: sub
    });

    return {
      ...transaction,
      url: request.url,
      content: sub
    }

  }

}
