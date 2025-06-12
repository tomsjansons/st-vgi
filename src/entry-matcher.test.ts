import { entryMatcher } from "./entry-matcher.ts";
import { expect, suite, test } from "vitest";

function eqMatcher(w1: string, w2: string) {
  if (w1 === w2) {
    return {
      match: "exact",
    } as const;
  }
  return {
    match: "none",
  } as const;
}

suite("Entry matcher", () => {
  test("Should match identical entries", () => {
    const result = entryMatcher(
      ["some", "value"],
      ["some", "value"],
      eqMatcher,
      () => false,
    );
    expect(result.match).toBe("exact");
  });

  test("Should match entries with word matching", () => {
    const result = entryMatcher(
      ["some", "vlaue"],
      ["some", "value"],
      (w1, w2) => {
        if (w1 === "vlaue" && w2 === "value") {
          return {
            match: "some",
            level: 1,
          };
        }
        if (w1 === w2) {
          return {
            match: "exact",
          };
        }
        return {
          match: "none",
        };
      },
      () => false,
    );
    expect(result).toEqual({
      match: "some",
      level: 1,
    });
  });

  test("Should match strip common and match words wrong order", () => {
    const result = entryMatcher(
      ["value", "some"],
      ["some", "common", "value"],
      eqMatcher,
      (w) => w === "common",
    );
    expect(result).toEqual({ match: "some", level: 2 });
  });

  test("Should match strip common and match one word missing", () => {
    const result = entryMatcher(
      ["value", "some", "missing"],
      ["some", "common", "value"],
      eqMatcher,
      (w) => w === "common",
    );
    expect(result).toEqual({ match: "some", level: 3 });
  });

  test("Should not match more words missing", () => {
    const result = entryMatcher(
      ["value", "some", "missing", "another"],
      ["some", "common", "value"],
      eqMatcher,
      (w) => w === "common",
    );
    expect(result).toEqual({ match: "none" });
  });

  test("Should not match more different words", () => {
    const result = entryMatcher(
      ["value", "some", "missing", "another"],
      ["value", "some", "missing", "different"],
      eqMatcher,
      (w) => w === "common",
    );
    expect(result).toEqual({ match: "none" });
  });
  test("Should not match more different words with common", () => {
    const result = entryMatcher(
      ["value", "some", "missing", "common", "another"],
      ["value", "some", "missing", "different"],
      eqMatcher,
      (w) => w === "common",
    );
    expect(result).toEqual({ match: "none" });
  });
});
