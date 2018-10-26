Swagger i18n extension
----------------------

Compiles swagger file into specified language:

```
npm install swagger-i18n-extension
```

To use this extension you need to specify vendor attribute `x-*-i18n` with translations object.
Example:

```
openapi: 3.0.0
info:
  version: 0.0.2
  title: Swagger example in default language
  x-title-i18n:
    eng: Title on english
  description: This text will be translated in english
  x-description-i18n:
    eng: Description on english 
```

This swagger yaml will be translated into:
```
openapi: 3.0.0
info:
  version: 0.0.2
  title: Title on english
  description: Description on english
```

## Cli tool

```
$ swagger-i18n-extension
Usage: swagger-i18n-extension <command> [options]

Commands:
  swagger-i18n-extension lang-list <path>         Print list of all languages described within swagger file
  swagger-i18n-extension lang-list-all            Print list of all supported languages
  swagger-i18n-extension translate <path> <lang>  Translates swagger file into specified language
  swagger-i18n-extension translate-all <path>     Translates swagger file into all declared languages
  swagger-i18n-extension validate <path>          Validates swagger i18n-extension.

Options:
  --version   Show version number                                      [boolean]
  -h, --help  Show help                                                [boolean]

Not enough non-option arguments: got 0, need at least 1

```

## Library documentation

List of exported functions:
### translate
Translates swagger object into specified language.

| Argument | Type   | Description                                 |
|----------|--------|---------------------------------------------|
| object   | object | Swagger raw object after parse yaml or json |
| language | string | Language ISO6392B code                      |

**Return value**:
Translated swagger `object`

### getUsedLanguageCodes
Returns list of used ISO6392B language codes

| Argument | Type   | Description                                 |
|----------|--------|---------------------------------------------|
| object   | object | Swagger raw object after parse yaml or json |

**Return value**:
`[]string` with used ISO6392B language code

### validate
| Argument   | Type   | Description                                 |
|------------|--------|---------------------------------------------|
| object     | object | Swagger raw object after parse yaml or json |
| throwError | bool   | Throw error if true. Else - return value    |

 **Return value**:
 `True` if object is valid.
 `False` if object is invalid.
