import '../../api.ts';
import {UserStoreWizardPanelParams} from './UserStoreWizardPanelParams';
import {GetUserStoreByKeyRequest} from '../../api/graphql/userStore/GetUserStoreByKeyRequest';
import UserStore = api.security.UserStore;

export class UserStoreWizardDataLoader {

    userStore: UserStore;

    defaultUserStore: UserStore;

    loadData(params: UserStoreWizardPanelParams): wemQ.Promise<UserStoreWizardDataLoader> {
        if (!params.persistedItem && !params.userStoreKey) {
            return this.loadDataForNew();
        } else {
            return this.loadDataForEdit(params);
        }
    }

    private loadDataForNew(): wemQ.Promise<UserStoreWizardDataLoader> {

        return this.loadDefaultUserStore().then((defaultUserStore: UserStore) => {

            this.defaultUserStore = defaultUserStore;

            return this;
        });
    }

    loadDataForEdit(params: UserStoreWizardPanelParams): wemQ.Promise<UserStoreWizardDataLoader> {

        return this.loadDataForNew().then((loader) => {

            return this.loadUserStoreToEdit(params).then((loadedUserStoreToEdit: UserStore) => {

                this.userStore = loadedUserStoreToEdit;

                return this;
            });
        });
    }

    private loadUserStoreToEdit(params: UserStoreWizardPanelParams): wemQ.Promise<UserStore> {
        if (!params.persistedItem && !!params.userStoreKey) {
            return new GetUserStoreByKeyRequest(params.userStoreKey).sendAndParse();
        } else {
            return wemQ(params.persistedItem);
        }
    }

    private loadDefaultUserStore(): wemQ.Promise<UserStore> {
        return new api.security.GetDefaultUserStoreRequest().sendAndParse();
    }

}
