'use client'

import { useState } from 'react'
import { Search, Mail, Trash2 } from 'lucide-react'
import { statusLabels, type ReviewRequest } from './data'

interface RequestsTableProps {
  requests: ReviewRequest[]
  onDeleteRequest: (id: string) => void
  onBulkDelete: (ids: string[]) => void
}

export function RequestsTable({ requests, onDeleteRequest, onBulkDelete }: RequestsTableProps) {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedIds, setSelectedIds] = useState<string[]>([])

  const filteredRequests = requests.filter((req) => {
    const matchesSearch = req.name.toLowerCase().includes(search.toLowerCase()) || req.email.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Selecteer of deselecteer alle gefilterde rijen tegelijk
  function handleSelectAll(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.checked) {
      setSelectedIds(filteredRequests.map((r) => r.id))
    } else {
      setSelectedIds([])
    }
  }

  // Selecteer of deselecteer een individuele rij
  function handleToggleSelect(id: string) {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  function handleBulkDeleteClick() {
    if (selectedIds.length === 0) return
    if (confirm(`Weet je zeker dat je ${selectedIds.length} geselecteerde verzoek(en) wilt verwijderen?`)) {
      onBulkDelete(selectedIds)
      setSelectedIds([])
    }
  }

  const isAllSelected = filteredRequests.length > 0 && filteredRequests.every((r) => selectedIds.includes(r.id))

  return (
    <div className="rounded-2xl border border-zinc-800 bg-card/60 backdrop-blur-xl p-6 flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-semibold text-base text-white">Verzonden Review Verzoeken</h3>
          <p className="text-xs text-zinc-400">Overzicht van alle verzoeken en de status van klantfeedback.</p>
        </div>

        {/* Filters en Bulk Actie */}
        <div className="flex flex-wrap items-center gap-2">
          {selectedIds.length > 0 && (
            <button
              onClick={handleBulkDeleteClick}
              className="h-9 px-3 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-medium transition-all flex items-center gap-1.5 animate-fadeIn"
            >
              <Trash2 className="size-3.5" />
              <span>Verwijder geselecteerd ({selectedIds.length})</span>
            </button>
          )}

          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Zoek klant..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-40 sm:w-48 pl-9 pr-3 rounded-lg border border-zinc-800 bg-zinc-900 text-xs text-white placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-xs text-zinc-300 focus:border-indigo-500 focus:outline-none"
          >
            <option value="all">Alle statussen</option>
            <option value="google">Naar Google</option>
            <option value="private">Privé Feedback</option>
            <option value="pending">In Afwachting</option>
          </select>
        </div>
      </div>

      {/* Tabel of lege melding */}
      <div className="overflow-x-auto flex-1">
        {filteredRequests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-950/40">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-3">
              <Mail className="size-5" />
            </div>
            <h4 className="text-sm font-medium text-white">Nog geen reviewverzoeken</h4>
            <p className="text-xs text-zinc-400 max-w-xs mt-1 mb-4">
              Je hebt nog geen verzoeken verstuurd. Klik op &quot;Nieuw verzoek&quot; om je eerste klant uit te nodigen.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 text-zinc-400 uppercase tracking-wider font-semibold">
              <tr>
                <th className="pb-3 px-3 w-10">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                    className="rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-950 size-3.5 cursor-pointer"
                  />
                </th>
                <th className="pb-3 px-3">Klant</th>
                <th className="pb-3 px-3">Kanaal</th>
                <th className="pb-3 px-3">Verzonden</th>
                <th className="pb-3 px-3">Score</th>
                <th className="pb-3 px-3 text-right">Status / Actie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
              {filteredRequests.map((req) => {
                const isSelected = selectedIds.includes(req.id)
                return (
                  <tr key={req.id} className={`transition-colors group ${isSelected ? 'bg-indigo-950/20' : 'hover:bg-zinc-900/40'}`}>
                    <td className="py-3.5 px-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(req.id)}
                        className="rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-zinc-950 size-3.5 cursor-pointer"
                      />
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-medium text-white">{req.name}</div>
                      <div className="text-[11px] text-zinc-500">{req.email}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300">
                        {req.channel}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-zinc-400">
                      {new Date(req.sentAt).toLocaleDateString('nl-NL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3.5 px-3 font-medium">
                      {req.rating ? <span className="text-amber-400">{'★'.repeat(req.rating)}</span> : <span className="text-zinc-600">-</span>}
                    </td>
                    <td className="py-3.5 px-3 text-right flex items-center justify-end gap-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium ${
                          req.status === 'google'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : req.status === 'private'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {statusLabels[req.status]}
                      </span>

                      <button
                        onClick={() => onDeleteRequest(req.id)}
                        className="p-1.5 rounded-lg bg-zinc-900 hover:bg-rose-500/20 text-zinc-400 hover:text-rose-400 border border-zinc-800 hover:border-rose-500/30 transition-all opacity-80 group-hover:opacity-100"
                        title="Verwijder verzoek"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}