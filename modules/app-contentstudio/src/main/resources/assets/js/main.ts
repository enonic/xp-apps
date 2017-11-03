import i18n = api.util.i18n;
import ContentTypeName = api.schema.content.ContentTypeName;
import ContentIconUrlResolver = api.content.util.ContentIconUrlResolver;
import Content = api.content.Content;
import ImgEl = api.dom.ImgEl;
import LostConnectionDetector = api.system.LostConnectionDetector;
import GetContentByIdRequest = api.content.resource.GetContentByIdRequest;
import GetContentTypeByNameRequest = api.schema.content.GetContentTypeByNameRequest;

declare const CONFIG;
// init should go before imports to correctly translate their static fields etc.
api.util.i18nInit(CONFIG.messages);

const body = api.dom.Body.get();

import './api.ts';
import {Router} from './app/Router';
import {ContentAppPanel} from './app/ContentAppPanel';
import {ContentDeletePromptEvent} from './app/browse/ContentDeletePromptEvent';
import {ContentPublishPromptEvent} from './app/browse/ContentPublishPromptEvent';
import {ContentUnpublishPromptEvent} from './app/browse/ContentUnpublishPromptEvent';
import {ContentDeleteDialog} from './app/remove/ContentDeleteDialog';
import {ContentPublishDialog} from './app/publish/ContentPublishDialog';
import {ContentUnpublishDialog} from './app/publish/ContentUnpublishDialog';
import {NewContentDialog} from './app/create/NewContentDialog';
import {ShowNewContentDialogEvent} from './app/browse/ShowNewContentDialogEvent';
import {SortContentDialog} from './app/browse/SortContentDialog';
import {MoveContentDialog} from './app/browse/MoveContentDialog';
import {EditPermissionsDialog} from './app/wizard/EditPermissionsDialog';
import {ContentWizardPanelParams} from './app/wizard/ContentWizardPanelParams';
import {ContentWizardPanel} from './app/wizard/ContentWizardPanel';
import {ContentEventsListener} from './app/ContentEventsListener';
import {ContentEventsProcessor} from './app/ContentEventsProcessor';
import {IssueListDialog} from './app/issue/view/IssueListDialog';
import {IssueServerEventsHandler} from './app/issue/event/IssueServerEventsHandler';
import {CreateIssuePromptEvent} from './app/browse/CreateIssuePromptEvent';
import {IssueDialogsManager} from './app/issue/IssueDialogsManager';
import {ShowIssuesDialogEvent} from './app/browse/ShowIssuesDialogEvent';

function getApplication(): api.app.Application {
    let application = new api.app.Application('content-studio', i18n('app.name'), i18n('app.abbr'), CONFIG.appIconUrl);
    application.setPath(api.rest.Path.fromString(Router.getPath()));
    application.setWindow(window);

    return application;
}

function startLostConnectionDetector(): LostConnectionDetector {
    let messageId;
    let lostConnectionDetector = new LostConnectionDetector();
    lostConnectionDetector.setAuthenticated(true);
    lostConnectionDetector.onConnectionLost(() => {
        api.notify.NotifyManager.get().hide(messageId);
        messageId = api.notify.showError(i18n('notify.connection.loss'), false);
    });
    lostConnectionDetector.onSessionExpired(() => {
        api.notify.NotifyManager.get().hide(messageId);
        window.location.href = api.util.UriHelper.getToolUri('');
    });
    lostConnectionDetector.onConnectionRestored(() => {
        api.notify.NotifyManager.get().hide(messageId);
    });

    lostConnectionDetector.startPolling();
    return lostConnectionDetector;
}

function initToolTip() {
    const ID = api.StyleHelper.getCls('tooltip', api.StyleHelper.COMMON_PREFIX);
    const CLS_ON = 'tooltip_ON';
    const FOLLOW = true;
    const DATA = '_tooltip';
    const OFFSET_X = 0;
    const OFFSET_Y = 20;

    let pageX = 0;
    let pageY = 0;

    const showAt = function (e: any) {
        const top = pageY + OFFSET_Y;
        let left = pageX + OFFSET_X;

        const tooltipText = api.util.StringHelper.escapeHtml(wemjq(e.currentTarget || e.target).data(DATA));
        if (!tooltipText) { //if no text then probably hovering over children of original element that has title attr
            return;
        }

        const tooltipWidth = tooltipText.length * 7.5;
        const windowWidth = wemjq(window).width();
        if (left + tooltipWidth >= windowWidth) {
            left = windowWidth - tooltipWidth;
        }
        wemjq('#' + ID).html(tooltipText).css({
            position: 'absolute', top, left
        }).show();
    };
    wemjq(document).on('mouseenter', '*[title]:not([title=""]):not([disabled]):visible', function (e: any) {
        wemjq(e.target).data(DATA, wemjq(e.target).attr('title'));
        wemjq(e.target).removeAttr('title').addClass(CLS_ON);
        wemjq(`<div id='${ID}' />`).appendTo('body');
        if (e.pageX) {
            pageX = e.pageX;
        }
        if (e.pageY) {
            pageY = e.pageY;
        }
        showAt(e);
    });
    wemjq(document).on('mouseleave click', '.' + CLS_ON, function (e: any) {
        if (wemjq(e.target).data(DATA)) {
            wemjq(e.target).attr('title', wemjq(e.target).data(DATA));
        }
        wemjq(e.target).removeClass(CLS_ON);
        wemjq('#' + ID).remove();
    });
    if (FOLLOW) { wemjq(document).on('mousemove', '.' + CLS_ON, showAt); }
}

function updateTabTitle(title: string) {
    wemjq('title').html(`${title} / ${i18n('app.name')}`);
}

function shouldUpdateFavicon(contentTypeName: ContentTypeName): boolean {
    // Chrome currently doesn't support SVG favicons which are served for not image contents
    return contentTypeName.isImage() || navigator.userAgent.search('Chrome') === -1;
}

let faviconCache: { [url: string]: Element } = {};

let iconUrlResolver = new ContentIconUrlResolver();

let dataPreloaded: boolean;

function clearFavicon() {
    // save current favicon hrefs
    wemjq('link[rel*=icon][sizes]').each((index, link) => {
        let href = link.getAttribute('href');
        faviconCache[href] = link;
        link.setAttribute('href', ImgEl.PLACEHOLDER);
    });
}

function updateFavicon(content: Content, urlResolver: ContentIconUrlResolver) {
    let resolver = urlResolver.setContent(content).setCrop(false);
    let shouldUpdate = shouldUpdateFavicon(content.getType());
    for (let href in faviconCache) {
        if (faviconCache.hasOwnProperty(href)) {
            let link = faviconCache[href];
            if (shouldUpdate) {
                let sizes = link.getAttribute('sizes').split('x');
                if (sizes.length > 0) {
                    try {
                        resolver.setSize(parseInt(sizes[0], 10));
                    } catch (e) { /* empty */ }
                }
                link.setAttribute('href', resolver.resolve());
            } else {
                link.setAttribute('href', href);
            }
            delete faviconCache[href];
        }
    }
}

function preLoadApplication() {
    let application: api.app.Application = getApplication();
    let wizardParams = ContentWizardPanelParams.fromApp(application);
    if (wizardParams) {
        clearFavicon();

        if (!body.isRendered() && !body.isRendering()) {
            dataPreloaded = true;
            // body is not rendered if the tab is in background
            if (wizardParams.contentId) {
                new GetContentByIdRequest(wizardParams.contentId).sendAndParse().then((content) => {
                    updateFavicon(content, iconUrlResolver);
                    updateTabTitle(content.getDisplayName());

                });
            } else {
                new GetContentTypeByNameRequest(wizardParams.contentTypeName).sendAndParse().then((contentType) => {
                    updateTabTitle(api.content.ContentUnnamed.prettifyUnnamed(contentType.getDisplayName()));
                });
            }
        }
    }
}

function startApplication() {

    let application: api.app.Application = getApplication();

    let serverEventsListener = new api.app.ServerEventsListener([application]);
    serverEventsListener.start();

    let connectionDetector = startLostConnectionDetector();

    let wizardParams = ContentWizardPanelParams.fromApp(application);
    if (wizardParams) {
        startContentWizard(wizardParams, connectionDetector);
    } else {
        startContentApplication(application);
    }

    initToolTip();

    api.util.AppHelper.preventDragRedirect();

    let contentDeleteDialog = new ContentDeleteDialog();
    ContentDeletePromptEvent.on((event) => {
        contentDeleteDialog
            .setContentToDelete(event.getModels())
            .setYesCallback(event.getYesCallback())
            .setNoCallback(event.getNoCallback())
            .open();
    });

    let contentPublishDialog = new ContentPublishDialog();
    ContentPublishPromptEvent.on((event) => {
        contentPublishDialog
            .setContentToPublish(event.getModels())
            .setIncludeChildItems(event.isIncludeChildItems())
            .open();
    });

    let contentUnpublishDialog = new ContentUnpublishDialog();
    ContentUnpublishPromptEvent.on((event) => {
        contentUnpublishDialog
            .setContentToUnpublish(event.getModels())
            .open();
    });

    CreateIssuePromptEvent.on((event) => IssueDialogsManager.get().openCreateDialog(event.getModels()));

    ShowIssuesDialogEvent.on((event) => IssueDialogsManager.get().openListDialog());

    // tslint:disable-next-line:no-unused-new
    new EditPermissionsDialog();

    application.setLoaded(true);

    api.content.event.ContentServerEventsHandler.getInstance().start();
    IssueServerEventsHandler.getInstance().start();
}

function startContentWizard(wizardParams: ContentWizardPanelParams, connectionDetector: LostConnectionDetector) {
    const wizard = new ContentWizardPanel(wizardParams);
    const discardMessage = i18n('notify.content.discard');
    const firefox = navigator.userAgent.indexOf('Firefox') != -1;

    wizard.onDataLoaded(content => {
        let contentType = (<ContentWizardPanel>wizard).getContentType();
        if (!wizardParams.contentId || !dataPreloaded) {
            // update favicon for new wizard after content has been created or in case data hasn't been preloaded
            updateFavicon(content, iconUrlResolver);
        }
        if (!dataPreloaded) {
            updateTabTitle(content.getDisplayName() || api.content.ContentUnnamed.prettifyUnnamed(contentType.getDisplayName()));
        }
    });
    wizard.onWizardHeaderCreated(() => {
        // header will be ready after rendering is complete
        wizard.getWizardHeader().onPropertyChanged((event: api.PropertyChangedEvent) => {
            if (event.getPropertyName() === 'displayName') {
                let contentType = (<ContentWizardPanel>wizard).getContentType();
                let name = <string>event.getNewValue() || api.content.ContentUnnamed.prettifyUnnamed(contentType.getDisplayName());

                updateTabTitle(name);
            }
        });
        if (!firefox) {
            api.notify.showWarning(discardMessage, true);
        }
    });

    let discardNotificationId;

    api.dom.WindowDOM.get().onBeforeUnload(event => {
        if (wizard.isContentDeleted() || !connectionDetector.isConnected() || !connectionDetector.isAuthenticated()) {
            return;
        }
        if (wizard.isNew()) {
            api.notify.hideNotification(discardNotificationId);
            discardNotificationId = api.notify.showWarning(discardMessage, true, true);
            const e: any = event || window.event || {returnValue: ''};
            e['returnValue'] = discardMessage;
            return discardMessage;
        } else if (wizard.hasUnsavedChanges()) {
            const message = i18n('dialog.wizard.unsavedChanges');
            const e: any = event || window.event || {returnValue: ''};
            e['returnValue'] = message;
            return message;
        }
    });

    api.dom.WindowDOM.get().onUnload(event => {
        if (wizard.isNew()) {
            const request = new api.content.resource.DeleteContentRequest().addContentPath(wizard.getPersistedItem().getPath());
            if (firefox) {
                request.setAsync(false);
            }
            request.sendAndParse();
        }
        const e: any = event || window.event || {returnValue: ''};
        e['returnValue'] = true;
        return true;
    });

    wizard.onClosed(event => window.close());

    api.content.event.EditContentEvent.on(ContentEventsProcessor.handleEdit);

    api.dom.Body.get().addClass('wizard-page').appendChild(wizard);
}

function startContentApplication(application: api.app.Application) {
    let appBar = new api.app.bar.AppBar(application);
    let appPanel = new ContentAppPanel(application.getPath());

    let clientEventsListener = new ContentEventsListener();
    clientEventsListener.start();

    body.appendChild(appBar);
    body.appendChild(appPanel);

    let newContentDialog = new NewContentDialog();
    ShowNewContentDialogEvent.on((event) => {

        let parentContent: api.content.ContentSummary = event.getParentContent()
            ? event.getParentContent().getContentSummary() : null;

        if (parentContent != null) {
            new api.content.resource.GetContentByIdRequest(parentContent.getContentId()).sendAndParse().then(
                (newParentContent: api.content.Content) => {

                    // TODO: remove pyramid of doom
                    if (parentContent.hasParent() && parentContent.getType().isTemplateFolder()) {
                        new api.content.resource.GetContentByPathRequest(parentContent.getPath().getParentPath()).sendAndParse().then(
                            (grandParent: api.content.Content) => {

                                newContentDialog.setParentContent(newParentContent);
                                newContentDialog.open();
                            }).catch((reason: any) => {
                            api.DefaultErrorHandler.handle(reason);
                        }).done();
                    } else {
                        newContentDialog.setParentContent(newParentContent);
                        newContentDialog.open();
                    }
                }).catch((reason: any) => {
                api.DefaultErrorHandler.handle(reason);
            }).done();
        } else {
            newContentDialog.setParentContent(null);
            newContentDialog.open();
        }
    });

    IssueListDialog.get();
    // tslint:disable-next-line:no-unused-new
    new SortContentDialog();
    // tslint:disable-next-line:no-unused-new
    new MoveContentDialog();
}

preLoadApplication();

let renderListener = () => {
    startApplication();
    body.unRendered(renderListener);
};
if (body.isRendered()) {
    renderListener();
} else {
    body.onRendered(renderListener);
}
