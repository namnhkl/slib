export class Permission {
  private PERMISSION_VALUE = {
    VIEW: 1,
    ADD: 2,
    UPDATE: 3,
    DELETE: 4,
    FULL_CONTROL: 5,
  };

  permissionObj: {
    viewable?: boolean,
    addable?: boolean,
    updatable?: boolean,
    deletable?: boolean,
    fullControl?: boolean,
  } = {};

  get permissionValueList() {
    return this.PERMISSION_VALUE;
  }

  public isViewable(value: number): boolean {
    return value === this.PERMISSION_VALUE.VIEW;
  }

  private isAddable(value: number): boolean {
    return value === this.PERMISSION_VALUE.ADD;
  }

  private isUpdatable(value: number): boolean {
    return value === this.PERMISSION_VALUE.UPDATE;
  }

  private isDeletable(value: number): boolean {
    return value === this.PERMISSION_VALUE.DELETE;
  }

  private hasFullControl(value: number): boolean {
    return value === this.PERMISSION_VALUE.FULL_CONTROL;
  }

  public checkPermission(value: number) {
    this.permissionObj = {
      viewable: this.isViewable(value),
      fullControl: this.hasFullControl(value),
    };
  }
}
