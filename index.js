var iterator = require('deep-for-each');
var iso6392Codes = require('iso-639-2');
var regexp = /^x-([a-zA-Z_-]+[a-zA-Z0-9_-]*)-i18n$/;

function validateLanguageCode(language) {
    if (typeof(language) === 'undefined') {
        throw new Error('Language code was not passed')
    }
    var wasFound = false
    var availableCodes = [];
    iso6392Codes.forEach(function(codeRecord){
        availableCodes.push(codeRecord.iso6392B);
        if (codeRecord.iso6392B == language) {
            wasFound = true;
        }
    });
    if (!wasFound) {
        throw new Error('Invalid language code `' + language + "` Available: `" + availableCodes.join(',') + '`')
    }
}


function translate(object, language) {
    if (typeof(object) !== 'object') {
        throw new Error('Passed swagger schema must be object. Not `' + typeof(object) + '`')
    }
    let translatedSpec = JSON.parse(JSON.stringify(object))
    validateLanguageCode(language)
    iterator(translatedSpec, function (value, key, subject, path) {
        if (typeof(key) === 'string') {
            var matches = regexp.exec(key);
            if (matches) {
                var fieldName = matches[1];
                if (typeof(subject[fieldName]) !== 'string') {
                    throw new Error('Field `' + fieldName + '` at `' + path + '` must be filled and being string')
                }
                if (typeof(value) !== 'object') {
                    throw new Error('Field `' + path + '` must be object')
                }
                if (typeof(value[language]) === 'undefined') {
                    throw new Error('Field `' + path + '` does not contain language translation `' + language + '`')
                }
                if (typeof(value[language]) !== 'string') {
                    throw new Error('Field at `' + path + '.' + language + '` must be string ')
                }
                subject[fieldName] = value[language]
                delete subject[key]
            }
        }
    });
    return translatedSpec
}

function getUsedLanguageCodes(object) {
    if (typeof(object) !== 'object') {
        throw new Error('Passed swagger schema must be object. Not `' + typeof(object) + '`')
    }
    var result = [];
    iterator(object, function (value, key, subject, path) {
        if (typeof(key) === 'string') {
            var matches = regexp.exec(key);
            if (matches) {
                if (typeof(value) !== 'object') {
                    throw new Error('Field `' + path + '` must be object')
                }
                result = result.concat(Object.keys(value))
                result = result.filter(function(value, index, self) {return self.indexOf(value) === index;})
            }
        }
    })
    result.forEach(function (languageCode) {
        validateLanguageCode(languageCode)
    })
    return result
}

function validate(object, throwError) {
    if (typeof(throwError) === 'undefined') {
        throwError = false
    }
    try {
        var languageCodes = getUsedLanguageCodes(object)
        languageCodes.forEach(function(languageCode) {
            translate(object, languageCode)
        })
    } catch (e) {
        if (throwError) {
            throw e
        }
        return false
    }
    return true
}

module.exports = {
    translate: translate,
    getUsedLanguageCodes: getUsedLanguageCodes,
    validate: validate
}
