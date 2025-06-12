import { getPossibleSplits } from "./word-splitter.ts";
import { expect, suite, test } from "vitest";

suite("Word splitter", () => {
  test("Should split by non alphanumeric chars", () => {
    let words = getPossibleSplits("Some Company Ltd");
    expect(words).toContainEqual(["Some", "Company", "Ltd"]);

    words = getPossibleSplits("Some Company Ltd.");
    expect(words).toContainEqual(["Some", "Company", "Ltd"]);

    words = getPossibleSplits("Some Company. Ltd.");
    expect(words).toContainEqual(["Some", "Company", "Ltd"]);

    words = getPossibleSplits("Some-Company. Ltd.");
    expect(words).toContainEqual(["Some", "Company", "Ltd"]);

    words = getPossibleSplits("Some-Company. Ltd.");
    expect(words).toContainEqual(["Some", "Company", "Ltd"]);
  });

  test("Should split by capitalisation", () => {
    let words = getPossibleSplits("SomeCompany Ltd");
    expect(words).toContainEqual(["Some", "Company", "Ltd"]);

    words = getPossibleSplits("SomeCompanyMore Ltd");
    expect(words).toContainEqual(["Some", "Company", "More", "Ltd"]);

    words = getPossibleSplits("-Some-CompanyMore Ltd");
    expect(words).toContainEqual(["Some", "Company", "More", "Ltd"]);

    words = getPossibleSplits(" SomeCompanyMore  Ltd");
    expect(words).toContainEqual(["Some", "Company", "More", "Ltd"]);

    words = getPossibleSplits("SomeCompany MOREWords Ltd");
    expect(words).toContainEqual(["Some", "Company", "MOREWords", "Ltd"]);

    words = getPossibleSplits("SomeCompany MoreWORDS Ltd");
    expect(words).toContainEqual(["Some", "Company", "MoreWORDS", "Ltd"]);
  });

  test("Should not contain duplicates", () => {
    const words = getPossibleSplits("Some Company Ltd");
    expect(words).toEqual([["Some", "Company", "Ltd"]]);
  });
});
