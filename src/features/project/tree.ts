import type { ProjectNode } from "./types";

export type TreeNode = ProjectNode & {
  children: TreeNode[];
};

export function buildTree(nodes: ProjectNode[]): TreeNode[] {
  const byId = new Map<string, TreeNode>();
  nodes.forEach((n) => byId.set(n.id, { ...n, children: [] }));

  const roots: TreeNode[] = [];

  for (const n of nodes) {
    const current = byId.get(n.id)!;
    if (!n.parentId) {
      roots.push(current);
    } else {
      const parent = byId.get(n.parentId);
      if (parent) parent.children.push(current);
      else roots.push(current);
    }
  }

  const sortRec = (arr: TreeNode[]) => {
    arr.sort((a, b) => a.name.localeCompare(b.name));
    arr.forEach((c) => sortRec(c.children));
  };
  sortRec(roots);

  return roots;
}

export function collectDescendants(nodes: ProjectNode[], rootId: string): Set<string> {
  const childrenByParent = new Map<string, string[]>();

  for (const n of nodes) {
    if (!n.parentId) continue;
    const arr = childrenByParent.get(n.parentId) ?? [];
    arr.push(n.id);
    childrenByParent.set(n.parentId, arr);
  }

  const toDelete = new Set<string>();
  const stack = [rootId];

  while (stack.length) {
    const id = stack.pop()!;
    if (toDelete.has(id)) continue;
    toDelete.add(id);
    const children = childrenByParent.get(id) ?? [];
    children.forEach((c) => stack.push(c));
  }

  return toDelete;
}
