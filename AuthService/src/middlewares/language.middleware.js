const Language = require('../modules/language/language.model');

exports.default = async (req, res, next) => {
    try {
        let _b = req.body;
        let LanguageId = _b.LanguageId;
        req.suf = 'en';
        if (_b.LanguageId) {
            let lang = await Language.findOne({ where: { id: _b.LanguageId } });
            if (lang.name.toString().toLowerCase() == 'arabic')
                req.suf = 'ar';
        }
        next();
    } catch (e) {
        console.error(e);
        next();
    }
};