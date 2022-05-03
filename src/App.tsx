import { Suspense, useEffect, useMemo, useState } from "react";
import "./app.css";
import { useFetch } from "./hooks/useFetch";
import { API_URL } from "./constants";
import { Coords, MeteorData } from "./types";
import { Table } from "./components/table/table";
import { SearchInput } from "./components/search-input/search-input";
import { Card } from "./components/card/card";
import { MarkersMap } from "./components/map/map";
import { useToastNotification } from "./components/notification/notification";
import { notFountNotification } from "./content";

const manipulator = (data: any): MeteorData[] =>
  data.map((item: any): MeteorData => {
    return {
      ...item,
      year: new Date(item.year).getFullYear(),
      reclat: Number(item.reclat),
      reclong: Number(item.reclong),
      mass: Number(item.mass ?? -1),
    };
  });

function App() {
  const { data } = useFetch<MeteorData[]>(API_URL, manipulator, []);
  const [search, setSearch] = useState("");
  const [mass, setMass] = useState(0);
  const { Notification, open } = useToastNotification();
  const filtered = useMemo(
    () =>
      data?.filter((item) => {
        if (!item?.year?.toString().includes(search)) {
          return false;
        }
        if (item.mass >= 0 && item.mass < mass) {
          return false;
        }
        return true;
      }),
    [data, search, mass]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!filtered?.length) {
        const a = data?.find((item) => item.mass >= mass)?.year;
        a && setSearch(`${a}`);
        open(notFountNotification, 2_000);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [search, mass, filtered, data]);

  const coords =
    filtered
      ?.slice(0, 500)
      .reduce<(Coords & { id: string })[]>((acc, { reclat, reclong, id }) => {
        if (reclat && reclong) {
          acc.push({
            id,
            lat: reclat,
            lng: reclong,
          });
        }
        return acc;
      }, []) || [];

  return (
    <Suspense fallback={"loading"}>
      <div className="app">
        <MarkersMap markers={coords} />

        <Card
          style={{
            height: "40vh",
            position: "absolute",
            top: "35px",
            left: "35px",
          }}
        >
          <SearchInput
            onChange={setSearch}
            value={search}
            results={filtered}
            placeholder={"Search by year"}
          />

          <Table
            data={filtered}
            columns={[
              { label: "id" },
              { label: "name" },
              { label: "year" },
              {
                label: "mass",
                filterBy: (filter) => {
                  setMass(Number(filter));
                },
              },
            ]}
          />
        </Card>
      </div>

      <Notification />
    </Suspense>
  );
}

export default App;
