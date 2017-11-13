import '../../api.ts';
import {DependantItemsDialog, DependantItemsDialogConfig} from '../dialog/DependantItemsDialog';
import ProgressBarManager = api.ui.dialog.ProgressBarManager;
import TaskId = api.task.TaskId;
import TaskState = api.task.TaskState;

export interface DependantItemsWithProgressDialogConfig
    extends DependantItemsDialogConfig {
    processingClass: string;
    processingLabel: string;
    processHandler: () => void;
}

export class DependantItemsWithProgressDialog
    extends DependantItemsDialog {

    protected progressManager: ProgressBarManager;

    constructor(config: DependantItemsWithProgressDialogConfig) {
        super(config);
        this.progressManager = new ProgressBarManager({
            processingClass: config.processingClass,
            processingLabel: config.processingLabel,
            processHandler: config.processHandler,
            unlockControlsHandler: () => {
                this.unlockControls();
            },
            managingElement: this
        });
    }

    protected isProgressBarEnabled(): boolean {
        return this.hasClass(this.progressManager.getProcessingClass());
    }

    protected pollTask(taskId: TaskId, elapsed: number = 0) {
        this.progressManager.pollTask(taskId, elapsed);
    }

    protected onProgressComplete(listener: (taskState: TaskState) => void) {
        this.progressManager.onProgressComplete(listener);
    }

    protected unProgressComplete(listener: (taskState: TaskState) => void) {
        this.progressManager.unProgressComplete(listener);
    }

    show() {
        super.show(this.isProgressBarEnabled());
    }
}
