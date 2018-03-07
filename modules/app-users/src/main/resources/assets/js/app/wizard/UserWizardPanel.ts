import '../../api.ts';
import {PrincipalWizardPanel} from './PrincipalWizardPanel';
import {UserEmailWizardStepForm} from './UserEmailWizardStepForm';
import {UserPasswordWizardStepForm} from './UserPasswordWizardStepForm';
import {MembershipsType, MembershipsWizardStepForm} from './MembershipsWizardStepForm';
import {PrincipalWizardPanelParams} from './PrincipalWizardPanelParams';
import {CreateUserRequest} from '../../api/graphql/principal/user/CreateUserRequest';
import {UpdateUserRequest} from '../../api/graphql/principal/user/UpdateUserRequest';
import UserBuilder = api.security.UserBuilder;
import Principal = api.security.Principal;
import PrincipalKey = api.security.PrincipalKey;
import ConfirmationDialog = api.ui.dialog.ConfirmationDialog;
import WizardStep = api.app.wizard.WizardStep;
import ArrayHelper = api.util.ArrayHelper;
import i18n = api.util.i18n;

export class UserWizardPanel extends PrincipalWizardPanel {

    private userEmailWizardStepForm: UserEmailWizardStepForm;
    private userPasswordWizardStepForm: UserPasswordWizardStepForm;
    private membershipsWizardStepForm: MembershipsWizardStepForm;

    constructor(params: PrincipalWizardPanelParams) {

        super(params);

        this.addClass('user-wizard-panel');
    }

    saveChanges(): wemQ.Promise<Principal> {
        if (!this.isRendered() ||
            (this.userEmailWizardStepForm.isValid() && this.userPasswordWizardStepForm.isValid())) {

            return super.saveChanges();
        } else {
            return wemQ.fcall(() => {
                // throw errors, if present
                this.showErrors();
                return null;
            });
        }
    }

    createSteps(principal?: Principal): WizardStep[] {
        let steps: WizardStep[] = [];

        this.userEmailWizardStepForm = new UserEmailWizardStepForm(this.getParams().userStore.getKey(), this.isSystemUserItem());
        this.userPasswordWizardStepForm = new UserPasswordWizardStepForm();
        this.membershipsWizardStepForm = new MembershipsWizardStepForm(MembershipsType.ALL);

        if (!this.isSystemUserItem()) {
            steps.push(new WizardStep(i18n('field.user'), this.userEmailWizardStepForm));
        }
        steps.push(new WizardStep(i18n('field.authentication'), this.userPasswordWizardStepForm));
        steps.push(new WizardStep(i18n('field.rolesAndGroups'), this.membershipsWizardStepForm));

        return steps;
    }

    doLayout(persistedPrincipal: Principal): wemQ.Promise<void> {

        return super.doLayout(persistedPrincipal).then(() => {

            if (this.isRendered()) {

                let viewedPrincipal = this.assembleViewedItem();
                if (!this.isPersistedEqualsViewed()) {

                    console.warn(`Received Principal from server differs from what's viewed:`);
                    console.warn(' viewedPrincipal: ', viewedPrincipal);
                    console.warn(' persistedPrincipal: ', persistedPrincipal);

                    new ConfirmationDialog()
                        .setQuestion(i18n('dialog.principal.update'))
                        .setYesCallback(() => this.doLayoutPersistedItem(persistedPrincipal.clone()))
                        .setNoCallback(() => { /* empty */ })
                        .show();
                }

                return wemQ<void>(null);
            } else {
                return this.doLayoutPersistedItem(persistedPrincipal ? persistedPrincipal.clone() : null);
            }

        });
    }

    protected doLayoutPersistedItem(principal: Principal): wemQ.Promise<void> {

        return super.doLayoutPersistedItem(principal).then(() => {
            if (principal) {

                this.decorateDeletedAction(principal.getKey());
                this.userEmailWizardStepForm.layout(principal);
                this.userPasswordWizardStepForm.layout(principal);
                this.membershipsWizardStepForm.layout(principal);
            }
        });
    }

    persistNewItem(): wemQ.Promise<Principal> {
        return this.produceCreateUserRequest().sendAndParse().then((principal: Principal) => {

            this.decorateDeletedAction(principal.getKey());

            new api.security.UserItemCreatedEvent(principal, this.getUserStore(), this.isParentOfSameType()).fire();

            api.notify.showFeedback(i18n('notify.create.user'));
            this.notifyPrincipalNamed(principal);

            this.membershipsWizardStepForm.layout(principal);
            this.userEmailWizardStepForm.layout(principal);
            this.userPasswordWizardStepForm.layout(principal);

            return principal;
        });
    }

    produceCreateUserRequest(): CreateUserRequest {
        const wizardHeader = this.getWizardHeader();
        wizardHeader.normalizeNames();
        const login = wizardHeader.getName();
        const key = PrincipalKey.ofUser(this.getUserStore().getKey(), login);
        const name = wizardHeader.getDisplayName();
        const email = this.userEmailWizardStepForm.getEmail();
        const password = this.userPasswordWizardStepForm.getPassword();
        const memberships = this.membershipsWizardStepForm.getMemberships().map(el => el.getKey());
        return new CreateUserRequest()
            .setKey(key)
            .setDisplayName(name)
            .setEmail(email)
            .setLogin(login)
            .setPassword(password)
            .setMemberships(memberships);
    }

    updatePersistedItem(): wemQ.Promise<Principal> {
        return super.updatePersistedItem().then((principal: Principal) => {
            //remove after users event handling is configured and layout is updated on receiving upd from server
            this.membershipsWizardStepForm.layout(principal);
            this.userEmailWizardStepForm.layout(principal);
            this.userPasswordWizardStepForm.layout(principal);
            return principal;
        });
    }

    produceUpdateRequest(viewedPrincipal: Principal): UpdateUserRequest {
        const user = viewedPrincipal.asUser();
        const key = user.getKey();
        const displayName = user.getDisplayName();
        const email = user.getEmail();
        const login = user.getLogin();

        const oldMemberships = this.getPersistedItem().asUser().getMemberships().map(value => value.getKey());
        const newMemberships = user.getMemberships().map(value => value.getKey());
        const addMemberships = ArrayHelper.difference(newMemberships, oldMemberships, (a, b) => (a.toString() === b.toString()));
        const removeMemberships = ArrayHelper.difference(oldMemberships, newMemberships, (a, b) => (a.toString() === b.toString()));

        return new UpdateUserRequest()
            .setKey(key)
            .setDisplayName(displayName)
            .setEmail(email)
            .setLogin(login)
            .addMemberships(addMemberships)
            .removeMemberships(removeMemberships);
    }

    assembleViewedItem(): Principal {
        const wizardHeader = this.getWizardHeader();
        wizardHeader.normalizeNames();
        return <Principal>new UserBuilder(this.getPersistedItem() ? this.getPersistedItem().asUser() : null)
            .setEmail(this.userEmailWizardStepForm.getEmail())
            .setLogin(wizardHeader.getName())
            .setMemberships(this.membershipsWizardStepForm.getMemberships())
            .setDisplayName(wizardHeader.getDisplayName())
            .build();
    }

    private showErrors() {
        if (!this.userEmailWizardStepForm.isValid()) {
            this.showEmailErrors();
        }

        if (!(this.getPersistedItem() || this.userPasswordWizardStepForm.isValid())) {
            this.showPasswordErrors();
        }
    }

    private showEmailErrors() {
        let formEmail = this.userEmailWizardStepForm.getEmail();
        if (api.util.StringHelper.isEmpty(formEmail)) {
            throw i18n('notify.empty.email');
        } else if (!this.userEmailWizardStepForm.isValid()) {
            throw `${i18n('field.email.invalid')}.`;
        }

    }

    private showPasswordErrors() {
        let password = this.userPasswordWizardStepForm.getPassword();
        if (api.util.StringHelper.isEmpty(password)) {
            throw i18n('notify.empty.password');
        } else if (!this.userPasswordWizardStepForm.isValid()) {
            throw `${i18n('field.password.invalid')}.`;
        }
    }

    isPersistedEqualsViewed(): boolean {
        let persistedPrincipal = this.getPersistedItem().asUser();
        let viewedPrincipal = this.assembleViewedItem().asUser();
        // Group/User order can be different for viewed and persisted principal
        viewedPrincipal.getMemberships().sort((a, b) => {
            return a.getKey().toString().localeCompare(b.getKey().toString());
        });
        persistedPrincipal.getMemberships().sort((a, b) => {
            return a.getKey().toString().localeCompare(b.getKey().toString());
        });

        // #hack - The newly added members will have different modifiedData
        let viewedMembershipsKeys = viewedPrincipal.getMemberships().map((el) => {
            return el.getKey();
        });
        let persistedMembershipsKeys = persistedPrincipal.getMemberships().map((el) => {
            return el.getKey();
        });

        if (api.ObjectHelper.arrayEquals(viewedMembershipsKeys, persistedMembershipsKeys)) {
            viewedPrincipal.setMemberships(persistedPrincipal.getMemberships());
        }

        return viewedPrincipal.equals(persistedPrincipal);
    }

    isNewChanged(): boolean {
        const wizardHeader = this.getWizardHeader();
        const email = this.userEmailWizardStepForm.getEmail();
        const password = this.userPasswordWizardStepForm.getPassword();
        const memberships = this.membershipsWizardStepForm.getMemberships();

        return wizardHeader.getName() !== '' ||
               wizardHeader.getDisplayName() !== '' ||
               (!!email && email !== '') ||
               (!!password && password !== '') ||
               (!!memberships && memberships.length !== 0);
    }

    private decorateDeletedAction(principalKey: PrincipalKey) {
        this.wizardActions.getDeleteAction().setEnabled(!principalKey.isSystem());
    }
}
