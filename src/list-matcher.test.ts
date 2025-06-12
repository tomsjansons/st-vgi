import { listMatcher } from "./list-matcher.ts";
import { expect, suite, test } from "vitest";

function eeqMatcher(e1: string[], e2: string[]) {
  if (e1[0] === e2[0]) {
    return {
      match: "exact",
    } as const;
  }
  return {
    match: "none",
  } as const;
}

function weqMatcher(w1: string, w2: string) {
  if (w1 === w2) {
    return {
      match: "exact",
    } as const;
  }
  return {
    match: "none",
  } as const;
}

suite("Deduper", () => {
  test("should dedupe", () => {
    const result = listMatcher(
      [
        ["some", "entry"],
        ["another", "entry"],
        ["some", "other"],
        ["third", "entry"],
      ],
      eeqMatcher,
      () => false,
      weqMatcher,
    );
    console.log(result);
    expect(result).toEqual([
      [
        ["some", "entry"],
        ["some", "other"],
      ],
      [["another", "entry"]],
      [["third", "entry"]],
    ]);
  });
});
