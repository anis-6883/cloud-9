import { create } from "zustand";

interface TableState {
  page: number;
  limit: number;
  search: string;
  searchInput: string;
  filters: Record<string, unknown>;
  localState: Record<string, unknown>;
  refresh: number;
}

interface TableStore {
  tables: Record<string, TableState>;
  searchTimers: Record<string, NodeJS.Timeout>;
  setPage: (id: string, page: number) => void;
  setLimit: (id: string, limit: number) => void;
  setSearch: (id: string, search: string) => void;
  setSearchInput: (id: string, searchInput: string) => void;
  setFilter: (id: string, key: string, value: unknown) => void;
  setLocalState: (id: string, key: string, value: unknown) => void;
  handleRefresh: (id: string) => void;
}

const defaultState: TableState = {
  page: 1,
  limit: 10,
  search: "",
  searchInput: "",
  filters: {},
  localState: {},
  refresh: 0,
} as const;

export const useTableStore = create<TableStore>((set, get) => ({
  tables: {},
  searchTimers: {},

  setPage: (id, page) =>
    set((state) => ({
      tables: {
        ...state.tables,
        [id]: {
          ...(state.tables[id] || defaultState),
          page,
        },
      },
    })),

  setLimit: (id, limit) =>
    set((state) => ({
      tables: {
        ...state.tables,
        [id]: {
          ...(state.tables[id] || defaultState),
          limit,
        },
      },
    })),

  setSearchInput: (id, searchInput) => {
    const state = get();

    // Clear existing timer
    if (state.searchTimers[id]) {
      clearTimeout(state.searchTimers[id]);
    }

    // Update search input immediately
    set((state) => ({
      tables: {
        ...state.tables,
        [id]: {
          ...(state.tables[id] || defaultState),
          searchInput,
        },
      },
    }));

    // Set debounced search update
    const timer = setTimeout(() => {
      set((state) => ({
        tables: {
          ...state.tables,
          [id]: {
            ...(state.tables[id] || defaultState),
            search: searchInput,
            page: 1,
          },
        },
        searchTimers: {
          ...state.searchTimers,
          [id]: undefined as any,
        },
      }));
    }, 500);

    set((state) => ({
      searchTimers: {
        ...state.searchTimers,
        [id]: timer,
      },
    }));
  },

  setSearch: (id, search) =>
    set((state) => ({
      tables: {
        ...state.tables,
        [id]: {
          ...(state.tables[id] || defaultState),
          search,
          searchInput: search,
          page: 1,
        },
      },
    })),

  setFilter: (id, key, value) =>
    set((state) => ({
      tables: {
        ...state.tables,
        [id]: {
          ...(state.tables[id] || defaultState),
          filters: {
            ...(state.tables[id]?.filters || {}),
            [key]: value,
          },
          page: 1,
        },
      },
    })),

  setLocalState: (id, key, value) =>
    set((state) => ({
      tables: {
        ...state.tables,
        [id]: {
          ...(state.tables[id] || defaultState),
          localState: {
            ...(state.tables[id]?.localState || {}),
            [key]: value,
          },
        },
      },
    })),

  handleRefresh: (id) =>
    set((state) => {
      const current = state.tables[id]?.refresh ?? 0;

      return {
        tables: {
          ...state.tables,
          [id]: {
            ...(state.tables[id] || defaultState),
            refresh: current + 1,
          },
        },
      };
    }),
}));

export const useTableState = (tableId: string) => {
  const table = useTableStore((s) => s.tables[tableId] ?? defaultState);

  const setPage = useTableStore((s) => s.setPage);
  const setLimit = useTableStore((s) => s.setLimit);
  const setSearch = useTableStore((s) => s.setSearch);
  const setSearchInput = useTableStore((s) => s.setSearchInput);
  const setFilter = useTableStore((s) => s.setFilter);
  const setLocalState = useTableStore((s) => s.setLocalState);
  const handleRefresh = useTableStore((s) => s.handleRefresh);

  return {
    ...table,

    setPage: (value: number) => setPage(tableId, value),
    setLimit: (value: number) => setLimit(tableId, value),
    setSearch: (value: string) => setSearch(tableId, value),
    setSearchInput: (value: string) => setSearchInput(tableId, value),
    setFilter: (key: string, value: unknown) => setFilter(tableId, key, value),
    setLocalState: (key: string, value: unknown) => setLocalState(tableId, key, value),
    handleRefresh: () => handleRefresh(tableId),
  };
};
