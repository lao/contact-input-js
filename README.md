# EmailsEditorjs

## Live demo
https://lao.github.io/EmailsEditor.js/

## How to use on project
```html
    <head>
        <!-- .... -->
        <link rel="stylesheet" type="text/css" media="screen" href="./bundle/css/bundle.css">
        <!-- ... -->
    </head>
    <body>
        <div id="emails-editor"></div>
        <script src="./bundle/js/EmailsEditor.min.js"></script>

        <script>
            const container = document.querySelector('#emails-editor');
            const editor = new emailsEditor({
                container: container, 
                onGetCount: (qtd) => {
                    alert(`There are ${qtd} email(s)`);
                },
                onChange: (prev, news) => {
                    console.log(prev);
                    console.log(news);
                }
            });
        </script>
    </body>
```

## Installation
```bash
    npm i           # install dependencies
    npm run build   # build project into: ./dist/bundle/
    npm run watch   # for small localserver and rollup with watch param
```

## Bundler
Rollup was the choice to bundle this small components for rollup promises a better bundle size, and it was a good opportunity to test it out

### Location
```bash
    cd ./dist/bundle
    # Folder ./dist/bundle/css  : CSS files (minified and normal)
    # Folder ./dist/bundle/js   : JS files (minified, normal and gziped)
```

## TODOS:
* remove all html strings
* improve documentation
* add random email