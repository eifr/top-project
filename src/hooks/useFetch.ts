import { useState, useEffect } from "react";

// React hoot to use fetch api within a component with Generics
export function useFetch<T>(
  url: string,
  manipulator = (data: any) => data,
  defaultValue: T
) {
  const [data, setData] = useState<T>(defaultValue);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    setError(false);

    try {
      const response = await fetch(url);
      const json = await response.json();
      setData(manipulator(json));
      setLoading(false);
    } catch (error) {
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { data, loading, error };
}
