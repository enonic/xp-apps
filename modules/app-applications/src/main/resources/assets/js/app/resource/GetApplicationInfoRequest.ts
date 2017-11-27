import '../../api.ts';

import ApplicationResourceRequest = api.application.ApplicationResourceRequest;
import {ApplicationInfoJson} from './ApplicationInfoJson';
import {ApplicationInfo} from './ApplicationInfo';

export class GetApplicationInfoRequest
    extends ApplicationResourceRequest<ApplicationInfoJson, ApplicationInfo> {

    constructor() {
        super();
        super.setMethod('GET');
    }

    getRequestPath(): api.rest.Path {
        return api.rest.Path.fromParent(super.getResourcePath(), 'info');
    }

    fromJson(json: ApplicationInfoJson): ApplicationInfo {
        return ApplicationInfo.fromJson(json);
    }

    sendAndParse(): wemQ.Promise<ApplicationInfo> {

        return this.send().then((response: api.rest.JsonResponse<ApplicationInfoJson>) => {
            return this.fromJson(response.getResult());
        });
    }
}
