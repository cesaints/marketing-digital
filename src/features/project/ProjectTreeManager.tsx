"use client";

import * as React from "react";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import { uid } from "@/lib/id";
import type { ProjectNode } from "./types";
import { buildTree, collectDescendants, type TreeNode } from "./tree";

const STORAGE_KEY = "astrosign:projectTree:v1";
const DEFAULT_NODES: ProjectNode[] = [];

function normalize(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function getPath(nodes: ProjectNode[], id: string): string {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const parts: string[] = [];
  let cur = byId.get(id);
  const guard = new Set<string>();
  while (cur && !guard.has(cur.id)) {
    guard.add(cur.id);
    parts.unshift(cur.name);
    cur = cur.parentId ? byId.get(cur.parentId) : undefined;
  }
  return parts.join(" / ");
}

function getChildrenCount(nodes: ProjectNode[], id: string): number {
  return nodes.filter((n) => n.parentId === id).length;
}

function flattenTree(roots: TreeNode[]): TreeNode[] {
  const out: TreeNode[] = [];
  const stack = [...roots].reverse();
  while (stack.length) {
    const n = stack.pop()!;
    out.push(n);
    for (let i = n.children.length - 1; i >= 0; i--) stack.push(n.children[i]);
  }
  return out;
}

// ─── Modal de confirmação ────────────────────────────────────────────────────

type ModalConfig = {
  title: string;
  description: string;
  detail?: string;
  confirmLabel: string;
  confirmStyle: "danger" | "warning";
  onConfirm: () => void;
};

function ConfirmModal({
  config,
  onClose,
}: {
  config: ModalConfig;
  onClose: () => void;
}) {
  // Fecha ao clicar fora
  const overlayRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === overlayRef.current) onClose();
  }

  const confirmBg =
    config.confirmStyle === "danger"
      ? "bg-rose-600 hover:bg-rose-500"
      : "bg-amber-500 hover:bg-amber-400";

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0f1120] shadow-2xl overflow-hidden animate-in">
        {/* Header colorido */}
        <div
          className={[
            "px-6 py-4 flex items-center gap-3",
            config.confirmStyle === "danger"
              ? "bg-rose-600/20 border-b border-rose-600/20"
              : "bg-amber-500/20 border-b border-amber-500/20",
          ].join(" ")}
        >
          <div
            className={[
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              config.confirmStyle === "danger"
                ? "bg-rose-600/30"
                : "bg-amber-500/30",
            ].join(" ")}
          >
            {config.confirmStyle === "danger" ? (
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-rose-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 6h18" />
                <path d="M8 6V4h8v2" />
                <path d="M19 6l-1 14H6L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-amber-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              </svg>
            )}
          </div>

          <div>
            <h3 className="text-base font-semibold text-white">
              {config.title}
            </h3>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-sm leading-relaxed text-white/80">
            {config.description}
          </p>

          {config.detail && (
            <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70">
              {config.detail}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-white/10 bg-white/[0.02] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 transition"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={() => {
              config.onConfirm();
              onClose();
            }}
            className={[
              "rounded-xl px-4 py-2 text-sm font-semibold text-white transition",
              confirmBg,
            ].join(" ")}
          >
            {config.confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Manager principal ───────────────────────────────────────────────────────

export function ProjectTreeManager() {
  const { state: nodes, setState: setNodes } = useLocalStorageState<
    ProjectNode[]
  >({ key: STORAGE_KEY, defaultValue: DEFAULT_NODES });

  const tree = React.useMemo(() => buildTree(nodes), [nodes]);
  const allTreeNodes = React.useMemo(() => flattenTree(tree), [tree]);

  const [newRootName, setNewRootName] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});

  // Modal
  const [modal, setModal] = React.useState<ModalConfig | null>(null);

  const selected = React.useMemo(
    () => (selectedId ? (nodes.find((n) => n.id === selectedId) ?? null) : null),
    [nodes, selectedId]
  );

  // Limpa seleção se o nó foi deletado
  React.useEffect(() => {
    if (selectedId && !nodes.some((n) => n.id === selectedId)) {
      setSelectedId(null);
    }
  }, [nodes, selectedId]);

  // ── Funções CRUD ──────────────────────────────────────────────────────────

  function addRoot() {
    const name = normalize(newRootName);
    if (!name) return;
    const now = new Date().toISOString();
    const n: ProjectNode = {
      id: uid("node"),
      name,
      parentId: null,
      createdAt: now,
      updatedAt: now,
    };
    setNodes([...nodes, n]);
    setNewRootName("");
    setSelectedId(n.id);
    setExpanded((prev) => ({ ...prev, [n.id]: true }));
  }

  function addChild(parentId: string, childName: string) {
    const name = normalize(childName);
    if (!name) return;
    const now = new Date().toISOString();
    const n: ProjectNode = {
      id: uid("node"),
      name,
      parentId,
      createdAt: now,
      updatedAt: now,
    };
    setNodes([...nodes, n]);
    setSelectedId(n.id);
    setExpanded((prev) => ({ ...prev, [parentId]: true }));
  }

  function renameNode(id: string, nextName: string) {
    const name = normalize(nextName);
    if (!name) return;
    const now = new Date().toISOString();
    setNodes(nodes.map((n) => (n.id === id ? { ...n, name, updatedAt: now } : n)));
  }

  function removeCascade(id: string) {
    const toDelete = collectDescendants(nodes, id);
    setNodes(nodes.filter((n) => !toDelete.has(n.id)));
    setExpanded((prev) => {
      const next = { ...prev };
      toDelete.forEach((d) => delete next[d]);
      return next;
    });
    if (selectedId && toDelete.has(selectedId)) setSelectedId(null);
  }

  function clearAll() {
    setNodes([]);
    setExpanded({});
    setSelectedId(null);
  }

  // ── Modais de confirmação ─────────────────────────────────────────────────

  function askDelete(id: string) {
    const node = nodes.find((n) => n.id === id);
    if (!node) return;
    const desc = collectDescendants(nodes, id);
    const childCount = desc.size - 1; // -1 (o próprio)
    setModal({
      title: "Excluir item",
      description: `Tem certeza que deseja excluir "${node.name}"? Esta ação não pode ser desfeita.`,
      detail:
        childCount > 0
          ? `⚠️ Este item possui ${childCount} subitem(s) vinculado(s) que também serão excluídos.`
          : undefined,
      confirmLabel: "Sim, excluir",
      confirmStyle: "danger",
      onConfirm: () => removeCascade(id),
    });
  }

  function askClearAll() {
    if (nodes.length === 0) return;
    setModal({
      title: "Limpar toda a estrutura",
      description:
        "Você está prestes a excluir TODOS os grupos e subgrupos cadastrados. Esta ação é irreversível.",
      detail: `${nodes.length} item(s) serão removidos permanentemente.`,
      confirmLabel: "Limpar tudo",
      confirmStyle: "danger",
      onConfirm: clearAll,
    });
  }

  // ── Expand / Collapse ─────────────────────────────────────────────────────

  function expandAll() {
    const next: Record<string, boolean> = {};
    allTreeNodes.forEach((n) => {
      if (n.children.length) next[n.id] = true;
    });
    setExpanded(next);
  }

  function collapseAll() {
    setExpanded({});
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      {modal && (
        <ConfirmModal config={modal} onClose={() => setModal(null)} />
      )}

      <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-white">
        {/* Header */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Controle de Gestão do Projeto
            </h2>
            <p className="mt-1 text-xs text-white/60">
              Árvore hierárquica com seleção e painel de edição.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={expandAll}
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 hover:bg-white/10 transition"
            >
              Expandir tudo
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 hover:bg-white/10 transition"
            >
              Recolher tudo
            </button>
            <button
              type="button"
              onClick={askClearAll}
              disabled={nodes.length === 0}
              className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-300 hover:bg-rose-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Limpar tudo
            </button>
          </div>
        </div>

        {/* Input novo grupo raiz */}
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end">
          <label className="flex-1">
            <div className="mb-1 text-xs font-medium text-white/75">
              Novo grupo (raiz)
            </div>
            <input
              value={newRootName}
              onChange={(e) => setNewRootName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addRoot()}
              className="w-full rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-violet-400/60 transition"
              placeholder="Ex.: TikTok"
            />
          </label>
          <button
            type="button"
            onClick={addRoot}
            disabled={!newRootName.trim()}
            className="rounded-xl bg-violet-600 px-4 py-2 text-xs font-semibold text-white hover:bg-violet-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Adicionar grupo
          </button>
        </div>

        {/* Grid: árvore + painel */}
        <div className="grid gap-4 lg:grid-cols-5">
          {/* Árvore */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-3">
              {tree.length === 0 ? (
                <div className="rounded-xl border border-dashed border-white/15 p-6 text-center text-sm text-white/50">
                  Nenhum grupo criado ainda.
                  <br />
                  <span className="text-xs text-white/35">
                    Comece com "TikTok", "Meta Ads", "Google Ads"…
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  {tree.map((rootNode) => (
                    <div
                      key={rootNode.id}
                      className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-2"
                    >
                      <TreeItem
                        node={rootNode}
                        level={0}
                        expanded={expanded}
                        onToggle={(id) =>
                          setExpanded((prev) => ({
                            ...prev,
                            [id]: !prev[id],
                          }))
                        }
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                        onDelete={askDelete}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <p className="mt-2 text-xs text-white/40">
              Clique no nome para selecionar. Use o painel ao lado para
              editar, adicionar ou excluir.
            </p>
          </div>

          {/* Painel de detalhes */}
          <div className="lg:col-span-2">
            <div className="sticky top-4 rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="mb-3 text-sm font-semibold text-white">
                Detalhes
              </div>

              {!selected ? (
                <div className="rounded-xl border border-dashed border-white/15 p-5 text-center text-sm text-white/50">
                  Selecione um item
                  <br />
                  <span className="text-xs text-white/35">
                    na árvore para editar
                  </span>
                </div>
              ) : (
                <DetailsPanel
                  node={selected}
                  nodes={nodes}
                  onRename={renameNode}
                  onAddChild={addChild}
                  onDelete={askDelete}
                />
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ─── TreeItem ────────────────────────────────────────────────────────────────

function TreeItem({
  node,
  level,
  expanded,
  onToggle,
  selectedId,
  onSelect,
  onDelete,
}: {
  node: TreeNode;
  level: number;
  expanded: Record<string, boolean>;
  onToggle: (id: string) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const isExpanded = !!expanded[node.id];
  const hasChildren = node.children.length > 0;
  const isSelected = selectedId === node.id;

  return (
    <div>
      <div
        className={[
          "flex items-center justify-between gap-2 rounded-xl border px-3 py-2 transition cursor-pointer",
          isSelected
            ? "border-violet-400/50 bg-violet-500/15"
            : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]",
        ].join(" ")}
        style={{ marginLeft: level * 16 }}
        onClick={() => onSelect(node.id)}
      >
        {/* Chevron + nome */}
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (hasChildren) onToggle(node.id);
            }}
            className={[
              "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[11px] transition",
              hasChildren
                ? "border border-white/15 bg-black/20 text-white/70 hover:bg-black/40"
                : "text-white/20 cursor-default",
            ].join(" ")}
          >
            {hasChildren ? (isExpanded ? "▾" : "▸") : "·"}
          </button>

          <div className="min-w-0">
            <div
              className={[
                "truncate text-sm font-medium",
                isSelected ? "text-violet-200" : "text-white",
              ].join(" ")}
            >
              {node.name}
            </div>
            <div className="text-[10px] text-white/40">
              {node.parentId ? "Subgrupo" : "Grupo"}
              {hasChildren ? ` · ${node.children.length} filho(s)` : ""}
            </div>
          </div>
        </div>

        {/* Botão deletar rápido */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(node.id);
          }}
          className="shrink-0 rounded-lg border border-rose-500/20 bg-rose-500/10 p-1.5 text-rose-400 opacity-0 group-hover:opacity-100 hover:bg-rose-500/20 transition hover:opacity-100"
          title="Excluir"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
          </svg>
        </button>
      </div>

      {/* Filhos */}
      {hasChildren && isExpanded && (
        <div className="mt-1 space-y-1">
          {node.children.map((child) => (
            <TreeItem
              key={child.id}
              node={child}
              level={level + 1}
              expanded={expanded}
              onToggle={onToggle}
              selectedId={selectedId}
              onSelect={onSelect}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── DetailsPanel ────────────────────────────────────────────────────────────

function DetailsPanel({
  node,
  nodes,
  onRename,
  onAddChild,
  onDelete,
}: {
  node: ProjectNode;
  nodes: ProjectNode[];
  onRename: (id: string, nextName: string) => void;
  onAddChild: (parentId: string, childName: string) => void;
  onDelete: (id: string) => void;
}) {
  const [nameDraft, setNameDraft] = React.useState(node.name);
  const [childName, setChildName] = React.useState("");

  // Sincroniza quando muda o nó selecionado
  React.useEffect(() => {
    setNameDraft(node.name);
    setChildName("");
  }, [node.id, node.name]);

  const path = React.useMemo(
    () => getPath(nodes, node.id),
    [nodes, node.id]
  );
  const childrenCount = React.useMemo(
    () => getChildrenCount(nodes, node.id),
    [nodes, node.id]
  );

  function handleRename() {
    const name = normalize(nameDraft);
    if (!name || name === node.name) return;
    onRename(node.id, name);
  }

  function handleAddChild() {
    const name = normalize(childName);
    if (!name) return;
    onAddChild(node.id, name);
    setChildName("");
  }

  return (
    <div className="space-y-4">
      {/* Info */}
      <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
        <div className="text-[10px] font-semibold uppercase tracking-widest text-white/45">
          Caminho
        </div>
        <div className="mt-1 text-sm font-medium text-white/90">{path}</div>
        <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-white/45">
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
            {node.parentId ? "Subgrupo" : "Grupo raiz"}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">
            {childrenCount} filho(s) direto(s)
          </span>
        </div>
      </div>

      {/* Renomear */}
      <div>
        <div className="mb-1.5 text-xs font-medium text-white/75">
          Renomear
        </div>
        <div className="flex gap-2">
          <input
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            className="flex-1 rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-emerald-400/60 transition"
          />
          <button
            type="button"
            onClick={handleRename}
            disabled={!nameDraft.trim() || nameDraft.trim() === node.name}
            className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Salvar
          </button>
        </div>
      </div>

      {/* Adicionar subgrupo */}
      <div>
        <div className="mb-1.5 text-xs font-medium text-white/75">
          Adicionar subgrupo
        </div>
        <div className="flex gap-2">
          <input
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddChild()}
            className="flex-1 rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-violet-400/60 transition"
            placeholder="Ex.: Anúncios"
          />
          <button
            type="button"
            onClick={handleAddChild}
            disabled={!childName.trim()}
            className="rounded-xl bg-violet-600 px-3 py-2 text-xs font-semibold text-white hover:bg-violet-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Adicionar
          </button>
        </div>
      </div>

      {/* Divisor */}
      <div className="border-t border-white/10" />

      {/* Deletar */}
      <div>
        <button
          type="button"
          onClick={() => onDelete(node.id)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-rose-500 transition"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M3 6h18" />
            <path d="M8 6V4h8v2" />
            <path d="M19 6l-1 14H6L5 6" />
          </svg>
          Excluir (em cascata)
        </button>
        <p className="mt-1.5 text-center text-[11px] text-white/40">
          Remove este item e todos os descendentes.
        </p>
      </div>
    </div>
  );
}
