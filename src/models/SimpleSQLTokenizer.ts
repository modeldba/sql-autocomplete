import { TokenSource, Token, CharStream, TokenFactory, CommonToken } from "antlr4ts-sql";

/**
 * A very simple tokenizer for splitting a string into tokens based on 
 * whitespace. Handles SQL quote characters (i.e. '). Also splits ; and . as separate tokens
 * 
 * THIS SHOULD NOT BE USED FOR MOST ANTLR4 TASKS.
 * 
 * It is designed to be used to find the correct token index at
 * any string location, regardless of the validity of the SQL string.
 * See SQLAutocomplete.getTokenIndexAt for usage.
 */
export class SimpleSQLTokenizer implements TokenSource {

  value: string;
  _currentIndex: number;
  _insideQuote: boolean;

  specialCharacters: string[] = [';', '.', '(', ')'];
  whitespaceCharacters: string[] = [' ', '\f', '\n', '\r', '\t', '\v', '\u00A0', '\u2028', '\u2029'];

  constructor(value: string, tokenizeWhitespace: boolean) {
    this.value = value;
    this._currentIndex = 0;
    this._insideQuote = false;
    if (tokenizeWhitespace) {
      this.specialCharacters.push(...this.whitespaceCharacters);
    }
  }

  nextToken(): Token {
    let start = null;
    let stop = null;
    const notWhitespaceRegex = /[^\s]/;
    while (this._currentIndex < this.value.length) {
      const currentChar = this.value[this._currentIndex];
      if (currentChar === "'" && this.value[this._currentIndex - 1] !== '\\') {
        this._insideQuote = !this._insideQuote;
      }
      if ((notWhitespaceRegex.test(currentChar) && !this.specialCharacters.includes(currentChar)) || this._insideQuote) {
        if (start === null) {
          start = this._currentIndex;
        }
        if (this._currentIndex === this.value.length - 1) {
          stop = this._currentIndex;
        }
      } else if (start !== null) {
        stop = this._currentIndex - 1;
        if (this.specialCharacters.includes(currentChar)) {
          // The next block will iterate past the current special character
          // Need to back up so that on the next call to nextToken, the special character will be identified again
          this._currentIndex--;
        }
      }
      if (start !== null && stop !== null) {
        this._currentIndex++;
        return new CommonToken(Token.DEFAULT_CHANNEL, this.value.substring(start, stop + 1), {}, null, start, stop);
      }
      if (this.specialCharacters.includes(currentChar) && !this._insideQuote) {
        this._currentIndex++;
        return new CommonToken(Token.DEFAULT_CHANNEL, currentChar, {}, null, this._currentIndex - 1, this._currentIndex - 1);
      }
      this._currentIndex++;
    }
    return new CommonToken(Token.EOF);
  }

  line: number;
  charPositionInLine: number;
  inputStream: CharStream;
  sourceName: string;
  tokenFactory: TokenFactory;
  
}