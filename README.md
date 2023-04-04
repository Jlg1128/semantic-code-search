## Semantic-code-search
search code semantically for function search, logic multiplexing, can save develop time, support docker deploy.

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
    also you can **deploy the search server** by run
    ```sh
    docker compose build
    docker compose up
    ```
    then call http://localhost:3060/search?keyword=testServer&target=example, you can set **DEFAULT_TARGET** in docker-compose.yml that you don't have to pass **target**

### Command Line Parameters
**target**

when you run "npm run parse -- target=example", this program will read .example.env file and load environment variables

### Environment Variables
**OPENAI_API_KEY**

get from https://platform.openai.com/account/api-keys

**PARSER**

put your parser function file to src/parser and should export default parser function in the file

**EMBEDDING_MODEL**

embedding model name

**CHAT_COMPLETION_MODEL**

compeletion model name

**BATCH_GEN_COUNT**

call openai createEmbedding api input array max length, default = 12 

**REPOPATH**

the repo path to be parsed, absolute path

**EXCLUDE_DIRS**

ignore parse dirs and files, relative path, type to be string[]

**EXT**

parse file ext, type to be string[]

**RELATIVE_ROOT_URL**

searchResultItem.filePath will concat RELATIVE_ROOT_URL

### Search API CALL Parameters

**keyword**

query text

**target**

the env file, if set target 'example', will load .example.env

**n**

top n results

**lines**

max code lines in searchResult item

### Welcome to contribute😀
