import { useEffect, useState } from "react";
import { usersApi } from "../services/api";
import type { UserData } from "../types";

export function useUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    usersApi
      .list()
      .then((result) => {
        if (active) setUsers(result);
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setError(
          cause instanceof Error ? cause.message : "Unable to load users.",
        );
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function addUser(user: UserData) {
    setError("");
    try {
      const saved = await usersApi.add(user);
      setUsers((current) => [...current, saved]);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to add user.");
      throw cause;
    }
  }

  async function updateUser(user: UserData) {
    setError("");
    try {
      const saved = await usersApi.update(user);
      setUsers((current) =>
        current.map((item) => (item.id === saved.id ? saved : item)),
      );
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to update user.",
      );
      throw cause;
    }
  }

  async function removeUser(id: string) {
    setError("");
    try {
      await usersApi.remove(id);
      setUsers((current) => current.filter((user) => user.id !== id));
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to remove user.",
      );
      throw cause;
    }
  }

  return { users, loading, error, addUser, updateUser, removeUser };
}
