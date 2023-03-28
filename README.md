## Semantic-code-search
search code semantically for function search, logic multiplexing, can save develop time.

### Usage
1. install dependencies
    ```
    pnpm install
    ```
2. set **OPENAI_API_KEY** in .example.env
3. parse your code by run npm run parse, this command will generate repo code embeddings to data/{repoName}-{parserName}.csv
    ```
    npm run parse:example
    ```
4. search code
    ```
    npm run search:example
    ```
### Command Line Parameters
**parseTarget**

when you run "npm run parse -- parseTarget=example", this program will read .example.env file and load environment variables

### Environment Variables
**OPENAI_API_KEY**

get from https://platform.openai.com/account/api-keys

**PARSER**

put your parser function file to src/parser and should export default parser function in the file

**REPOPATH**

the repo path to be parsed, absolute path

**EXCLUDE_DIRS**

ignore parse dirs, type to be string[]

**EXT**

parse file ext, type to be string[]

**MINIFY_CODE**

set to true can minify your code, can save some tokens

### Welcome to contribute😀
