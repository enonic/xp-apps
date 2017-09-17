import '../../js/api.ts';
import PageView = api.liveedit.PageView;
import PageViewBuilder = api.liveedit.PageViewBuilder;
import ComponentViewDragStartedEvent = api.liveedit.ComponentViewDragStartedEvent;
import ComponentViewDragStoppedEvent = api.liveedit.ComponentViewDragStoppedEvent;
import ComponentResetEvent = api.liveedit.ComponentResetEvent;
import ItemViewIdProducer = api.liveedit.ItemViewIdProducer;
import Shader = api.liveedit.Shader;
import Highlighter = api.liveedit.Highlighter;
import SelectedHighlighter = api.liveedit.SelectedHighlighter;
import Cursor = api.liveedit.Cursor;
import DragAndDrop = api.liveedit.DragAndDrop;
import Exception = api.Exception;
import ComponentLoadedEvent = api.liveedit.ComponentLoadedEvent;
import SkipLiveEditReloadConfirmationEvent = api.liveedit.SkipLiveEditReloadConfirmationEvent;
import InitializeLiveEditEvent = api.liveedit.InitializeLiveEditEvent;
import LiveEditPageInitializationErrorEvent = api.liveedit.LiveEditPageInitializationErrorEvent;
import LiveEditPageViewReadyEvent = api.liveedit.LiveEditPageViewReadyEvent;

declare const CONFIG;

export class LiveEditPage {

    private pageView: PageView;

    private skipNextReloadConfirmation: boolean = false;

    private initializeListener: (event: InitializeLiveEditEvent) => void;

    private skipConfirmationListener: (event: SkipLiveEditReloadConfirmationEvent) => void;

    private beforeUnloadListener: (event: Event) => void;

    private unloadListener: (event: Event) => void;

    private componentLoadedListener: (event: ComponentLoadedEvent) => void;

    private componentResetListener: (event: ComponentResetEvent) => void;

    private dragStartedListener: () => void;

    private dragStoppedListener: () => void;

    private static debug: boolean = false;

    constructor() {
        this.skipConfirmationListener = (event: SkipLiveEditReloadConfirmationEvent) => {
            this.skipNextReloadConfirmation = event.isSkip();
        };

        SkipLiveEditReloadConfirmationEvent.on(this.skipConfirmationListener);

        this.initializeListener = this.init.bind(this);

        InitializeLiveEditEvent.on(this.initializeListener);
    }

    private init(event: InitializeLiveEditEvent) {
        let startTime = Date.now();
        if (LiveEditPage.debug) {
            console.debug('LiveEditPage: starting live edit initialization');
        }

        api.util.i18nInit(CONFIG.messages);

        let liveEditModel = event.getLiveEditModel();

        let body = api.dom.Body.get().loadExistingChildren();
        try {
            this.pageView = new PageViewBuilder()
                .setItemViewProducer(new ItemViewIdProducer())
                .setLiveEditModel(liveEditModel)
                .setElement(body).build();
        } catch (error) {
            if (LiveEditPage.debug) {
                console.error('LiveEditPage: error initializing live edit in ' + (Date.now() - startTime) + 'ms');
            }
            if (api.ObjectHelper.iFrameSafeInstanceOf(error, Exception)) {
                new LiveEditPageInitializationErrorEvent('The Live edit page could not be initialized. ' +
                                                         error.getMessage()).fire();
            } else {
                new LiveEditPageInitializationErrorEvent('The Live edit page could not be initialized. ' +
                                                         error).fire();
            }
            return;
        }

        DragAndDrop.init(this.pageView);

        api.ui.Tooltip.allowMultipleInstances(false);

        this.registerGlobalListeners();

        if (LiveEditPage.debug) {
            console.debug('LiveEditPage: done live edit initializing in ' + (Date.now() - startTime) + 'ms');
        }
        new LiveEditPageViewReadyEvent(this.pageView).fire();
    }

    public destroy(win: Window = window): void {
        if (LiveEditPage.debug) {
            console.debug('LiveEditPage.destroy', win);
        }

        SkipLiveEditReloadConfirmationEvent.un(this.skipConfirmationListener, win);

        InitializeLiveEditEvent.un(this.initializeListener, win);

        this.unregisterGlobalListeners();
    }

    private registerGlobalListeners(): void {

        this.beforeUnloadListener = (event) => {
            if (!this.skipNextReloadConfirmation) {
                const message = 'This will close this wizard!';
                const e = event || window.event || {returnValue: ''};
                e['returnValue'] = message;
                return message;
            }
        };

        api.dom.WindowDOM.get().onBeforeUnload(this.beforeUnloadListener);

        this.unloadListener = () => {

            if (!this.skipNextReloadConfirmation) {
                new api.liveedit.PageUnloadedEvent(this.pageView).fire();
                // do remove to trigger model unbinding
            } else {
                this.skipNextReloadConfirmation = false;
            }
            this.pageView.remove();
        };

        api.dom.WindowDOM.get().onUnload(this.unloadListener);

        this.componentLoadedListener = (event: ComponentLoadedEvent) => {

            if (api.liveedit.layout.LayoutItemType.get().equals(event.getNewComponentView().getType())) {
                DragAndDrop.get().createSortableLayout(event.getNewComponentView());
            } else {
                DragAndDrop.get().refreshSortable();
            }
        };

        api.liveedit.ComponentLoadedEvent.on(this.componentLoadedListener);

        this.componentResetListener = (event: ComponentResetEvent) => {
            DragAndDrop.get().refreshSortable();
        };

        ComponentResetEvent.on(this.componentResetListener);

        this.dragStartedListener = () => {
            Highlighter.get().hide();
            SelectedHighlighter.get().hide();
            Shader.get().hide();
            Cursor.get().hide();

            // dragging anything should exit the text edit mode
            //this.exitTextEditModeIfNeeded();
        };

        ComponentViewDragStartedEvent.on(this.dragStartedListener);

        this.dragStoppedListener = () => {
            Cursor.get().reset();

            if (this.pageView.isLocked()) {
                Highlighter.get().hide();
                Shader.get().shade(this.pageView);
            }
        };

        ComponentViewDragStoppedEvent.on(this.dragStoppedListener);

    }

    private unregisterGlobalListeners(): void {

        api.dom.WindowDOM.get().unBeforeUnload(this.beforeUnloadListener);

        api.dom.WindowDOM.get().unUnload(this.unloadListener);

        api.liveedit.ComponentLoadedEvent.un(this.componentLoadedListener);

        ComponentResetEvent.un(this.componentResetListener);

        ComponentViewDragStartedEvent.un(this.dragStartedListener);

        ComponentViewDragStoppedEvent.un(this.dragStoppedListener);

    }

}
