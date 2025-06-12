import { expect, suite, test } from "vitest";
import { getPossibleSplits } from "./word-splitter.ts";

suite("Word splitter", () => {
  test("Should split by space, dash, underscore", () => {
    let words = getPossibleSplits("Some Company Ltd");
    expect(words).toEqual({
      orig: "Some Company Ltd",
      splits: [["Some", "Company", "Ltd"]],
    });

    words = getPossibleSplits("Some Company Ltd.");
    expect(words).toEqual({
      orig: "Some Company Ltd.",
      splits: [["Some", "Company", "Ltd"]],
    });

    words = getPossibleSplits("Some Company. Ltd.");
    expect(words).toEqual({
      orig: "Some Company. Ltd.",
      splits: [["Some", "Company", "Ltd"]],
    });
  });

  test("Should split by capitalisation", () => {
    let words = getPossibleSplits("SomeCompany Ltd");
    expect(words).toEqual({
      orig: "SomeCompany Ltd",
      splits: [
        ["SomeCompany", "Ltd"],
        ["Some", "Company", "Ltd"],
      ],
    });

    words = getPossibleSplits("SomeCompanyMore Ltd");
    expect(words).toEqual({
      orig: "SomeCompanyMore Ltd",
      splits: [
        ["SomeCompanyMore", "Ltd"],
        ["Some", "Company", "More", "Ltd"],
      ],
    });

    words = getPossibleSplits(" SomeCompanyMore  Ltd");
    expect(words).toEqual({
      orig: " SomeCompanyMore  Ltd",
      splits: [
        ["SomeCompanyMore", "Ltd"],
        ["Some", "Company", "More", "Ltd"],
      ],
    });

    words = getPossibleSplits("SomeCompany MOREWords Ltd");
    expect(words).toEqual({
      orig: "SomeCompany MOREWords Ltd",
      splits: [
        ["SomeCompany", "MOREWords", "Ltd"],
        ["Some", "Company", "MOREWords", "Ltd"],
      ],
    });

    words = getPossibleSplits("SomeCompany MoreWORDS Ltd");
    expect(words).toEqual({
      orig: "SomeCompany MoreWORDS Ltd",
      splits: [
        ["SomeCompany", "MoreWORDS", "Ltd"],
        ["Some", "Company", "MoreWORDS", "Ltd"],
      ],
    });
  });

  test("Should not contain duplicates", () => {
    const words = getPossibleSplits("Some Company Ltd");
    expect(words).toEqual({
      orig: "Some Company Ltd",
      splits: [["Some", "Company", "Ltd"]],
    });
  });

  test("Should not split single letters out as words", () => {
    const words = getPossibleSplits("V.A.C.U.U.M.");
    expect(words).toEqual({
      orig: "V.A.C.U.U.M.",
      splits: [["VACUUM"]],
    });
  });
});
