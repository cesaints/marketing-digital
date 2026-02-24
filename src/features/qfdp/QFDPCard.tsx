"use client";

import { useEffect, useState } from "react";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";
import type { QFDP } from "./types";

const STORAGE_KEY = "astrosign:qfdp:v1";

const EMPTY_QFDP: QFDP = {
  quadro: "",
  furadeira: "",
  decorado: "",
  publico: "",
  updatedAt: new Date(0).toISOString(),
};

function normalize(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function QFDPCard() {
  const { state: qfdp, setState: setQfdp, hydrated } = useLocalStorageState<QFDP>(
    {
      key: STORAGE_KEY,
      defaultValue: EMPTY_QFDP,
    }
  );

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<QFDP>(qfdp);

  useEffect(() => {
    if (!hydrated) return;
    if (!editing) setForm(qfdp);
  }, [hydrated, qfdp, editing]);

  function onEdit() {
    setForm(qfdp);
    setEditing(true);
  }

  function onCancel() {
    setForm(qfdp);
    setEditing(false);
  }

  function onSave() {
    const next: QFDP = {
      quadro: normalize(form.quadro),
      furadeira: normalize(form.furadeira),
      decorado: normalize(form.decorado),
      publico: normalize(form.publico),
      updatedAt: new Date().toISOString(),
    };

    const missing = Object.entries(next)
      .filter(([k]) => k !== "updatedAt")
      .filter(([, v]) => !String(v).length)
      .map(([k]) => k);

    if (missing.length) {
      alert(`Preencha os campos: ${missing.join(", ")}`);
      return;
    }

    setQfdp(next);
    setEditing(false);
  }

  return (
    <section className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-white">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">QFDP</h2>
          <p className="mt-1 text-xs text-white/65">
            Quadro (o que entrega) • Furadeira (como entrega) • Decorado
            (benefícios implícitos) • Público (para quem vender)
          </p>
        </div>

        {!editing ? (
          <button
            type="button"
            onClick={onEdit}
            className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-400"
          >
            Editar
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 hover:bg-white/10"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onSave}
              className="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-medium text-white hover:bg-emerald-400"
            >
              Salvar
            </button>
          </div>
        )}
      </div>

      {!editing ? (
        <div className="grid gap-3 md:grid-cols-2">
          <DisplayItem
            label="Quadro (o que o produto entrega)"
            value={qfdp.quadro}
          />
          <DisplayItem
            label="Furadeira (como o produto entrega)"
            value={qfdp.furadeira}
          />
          <DisplayItem
            label="Decorado (benefícios implícitos)"
            value={qfdp.decorado}
          />
          <DisplayItem label="Público (para quem vender)" value={qfdp.publico} />
          <div className="md:col-span-2 text-xs text-white/40">
            Atualizado em:{" "}
            {qfdp.updatedAt !== EMPTY_QFDP.updatedAt
              ? new Date(qfdp.updatedAt).toLocaleString()
              : "—"}
          </div>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          <EditField
            label="Quadro (o que o produto entrega)"
            value={form.quadro}
            onChange={(v) => setForm({ ...form, quadro: v })}
          />
          <EditField
            label="Furadeira (como o produto entrega)"
            value={form.furadeira}
            onChange={(v) => setForm({ ...form, furadeira: v })}
          />
          <EditField
            label="Decorado (benefícios implícitos)"
            value={form.decorado}
            onChange={(v) => setForm({ ...form, decorado: v })}
          />
          <EditField
            label="Público (para quem vender)"
            value={form.publico}
            onChange={(v) => setForm({ ...form, publico: v })}
          />
        </div>
      )}
    </section>
  );
}

function DisplayItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="text-xs font-medium uppercase tracking-wide text-white/50">
        {label}
      </div>
      <div className="mt-1 whitespace-pre-wrap text-sm text-white/90">
        {value || "—"}
      </div>
    </div>
  );
}

function EditField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <div className="mb-1 text-xs font-medium text-white/80">{label}</div>
      <textarea
        rows={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-white/15 bg-black/20 p-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/40"
        placeholder="Descreva aqui…"
      />
    </label>
  );
}
