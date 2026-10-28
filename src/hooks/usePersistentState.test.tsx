import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { usePersistentState } from "./usePersistentState";

function PersistedCounter() {
  const [count, setCount] = usePersistentState("test.counter", 0);
  return (
    <button onClick={() => setCount((current) => current + 1)}>
      Count: {count}
    </button>
  );
}

describe("usePersistentState", () => {
  beforeEach(() => window.localStorage.clear());

  it("writes updates and restores them after remount", () => {
    const firstRender = render(<PersistedCounter />);
    fireEvent.click(screen.getByRole("button", { name: "Count: 0" }));

    expect(
      screen.getByRole("button", { name: "Count: 1" }),
    ).toBeInTheDocument();
    firstRender.unmount();

    render(<PersistedCounter />);
    expect(
      screen.getByRole("button", { name: "Count: 1" }),
    ).toBeInTheDocument();
  });
});
