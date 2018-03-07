import '../../../api.ts';
import LinkEl = api.dom.LinkEl;
import ContentSummaryAndCompareStatus = api.content.ContentSummaryAndCompareStatus;

export class WidgetItemView extends api.dom.DivEl {

    public static debug: boolean = false;
    private uid: string = '';

    constructor(className?: string) {
        super('widget-item-view' + (className ? ' ' + className : ''));
    }

    public layout(): wemQ.Promise<any> {
        if (WidgetItemView.debug) {
            console.debug('WidgetItemView.layout: ', this);
        }
        return wemQ<any>(null);
    }

    public setContentAndUpdateView(item: ContentSummaryAndCompareStatus): wemQ.Promise<any> {
        return wemQ<any>(null);
    }

    private getFullWidgetUrl(url: string, uid: string, contentId: string) {
        return url + '?uid=' + uid + '&contentId=' + contentId;
    }

    public setUrl(url: string, contentId: string, keepId: boolean = false): wemQ.Promise<void> {
        const deferred = wemQ.defer<void>();
        const uid = (!keepId || !this.uid) ? Date.now().toString() : this.uid;
        const linkEl = new LinkEl(this.getFullWidgetUrl(url, uid, contentId)).setAsync();
        const el = this.getEl();
        const onLinkLoaded = (() => {

            const importedDocument: HTMLDocument = linkEl.getHTMLElement()['import'];

            if (!importedDocument) {
                deferred.resolve(null);
                return;
            }

            if (!!importedDocument.body) {
                el.getHTMLElement().insertAdjacentHTML('beforeend', importedDocument.body.innerHTML);
            } else {
                for (let i = 0; i < importedDocument.childNodes.length; i++) {
                    if (importedDocument.childNodes[i].nodeType === 1) {
                        el.appendChild(importedDocument.childNodes[i]);
                    }
                }
            }

            this.removeChild(linkEl);
            deferred.resolve(null);
        });

        this.uid = uid;
        this.removeChildren();

        linkEl.onLoaded(onLinkLoaded);
        this.appendChild(linkEl);

        window['HTMLImports'].loadImports(document.body);

        return deferred.promise;
    }

    private stripOffAssets(html: string): string {
        let result = this.stripOffScripts(html);
        // leave stylesheet links for FF & Safari due to bug in processing them
        result = (api.BrowserHelper.isFirefox() || api.BrowserHelper.isSafari()) ? result : this.stripOffLinks(result);
        return result;
    }

    private stripOffScripts(html: string): string {
        return html.replace(/(?:<script\b[^>]*>[\s\S]*?<\/script>)/gm, '');
    }

    private stripOffLinks(html: string): string {
        return html.replace(/(?:<link\b[^<>]*[\\/]?>)/gm, '');
    }
}
