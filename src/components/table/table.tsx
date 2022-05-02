import { useCallback, useState } from "react";
import "./table.css";

export type TableProps<T> = {
  data: T[];
  columns: Column<keyof T>[];
};

export type Data = {
  id: string;
};

export type Column<T> = {
  label: T;
  filterBy?: (data: string) => void;
};

// shows basic table with data
export const Table = <T extends Data>({ data, columns }: TableProps<T>) => {
  const [filters, setFilters] = useState<Record<keyof T, string>>(
    {} as Record<keyof T, string>
  );
  const handleFilterChange = useCallback(
    (key: keyof T, value: string) => {
      setFilters({ ...filters, [key]: value });
    },
    [filters, setFilters]
  );
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {columns.map(({ label, filterBy }) => (
              <th key={"" + label}>
                <>
                  {label}
                  {filterBy && (
                    <input
                      className="filter"
                      placeholder="filter"
                      value={filters?.[label]}
                      onChange={({ target }) => {
                        handleFilterChange(label, target.value);
                        filterBy(target.value);
                      }}
                    />
                  )}
                </>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {columns.map(({ label }) => (
                <td key={"" + label} className="cell" data-type={label}>
                  {"" + row[label]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
