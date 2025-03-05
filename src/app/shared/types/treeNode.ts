import { NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';

export interface TreeNodeNestedMenu extends NzTreeNodeOptions {
  title: string;
  disabled?: boolean;
  children?: TreeNodeNestedMenu[];
  key: string,
  checked?: boolean,
  isLeaf?: boolean,
  isIndeterminate?: boolean;

}
export interface ActiveNode extends NzTreeNodeOptions {
  id: string;
  name: string;
  code: string;
  isChecked: boolean;
  categoryCode: string;
  permissionValue: number,
  children?: ActiveNode[];
}

export type TNzExtendedTreeNode<T = any> = Omit<NzTreeNode, 'origin'> & {
  origin: NzTreeNodeOptions & T
};

export type ActiveNodeInLeftMenu = TNzExtendedTreeNode<ActiveNode>;
