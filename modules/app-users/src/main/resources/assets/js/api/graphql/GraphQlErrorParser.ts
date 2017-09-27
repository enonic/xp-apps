import i18n = api.util.i18n;

export type ErrorBody = {
    type: string;
    message: string;
    full: string;
};

export class GraphQlErrorParser {

    static getUserStoreReason(error: string = '', key: string): string {
        if (error.indexOf('Node already exist') === 0) {
            return i18n('notify.error.userstore.notexists', key);
        }
        return i18n('notify.error.userstore.notfound', key);
    }

    static parseError(error: string): ErrorBody {
        const result = error.match(/(?:\D+\.)(\D+):\s+(.+)/) || [];
        return {
            full: result[0] || error,
            type: result[1],
            message: result[2]
        }
    }
}
