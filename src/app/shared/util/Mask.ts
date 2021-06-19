export default class CutomizeMask {
    mask(): any {
        return {
            Currency: '000-000-000-000',
            Phone: '0000-000-0000',
            PostalCode: '00000-00000',
            EnglishOnly: '00000-00000',
            PersianOnly: '00000-00000',
            NumberOnly: '^[0-9]+$',

        }
    }
    format(): any {
        return {
            Currency: '###,###',
        }
    }
}