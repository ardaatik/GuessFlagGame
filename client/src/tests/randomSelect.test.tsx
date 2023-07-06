import randomSelect from "../utils/randomSelect";
import { Country } from "../context/GlobalProvider";

declare global {
  interface Math {
    random: () => number;
  }
}
describe("randomSelect", () => {
  test("should return the expected result and answer", () => {
    // Mock data
    const countries: Country[] = [
      { name: "Country 1", code: "C1" },
      { name: "Country 2", code: "C2" },
      { name: "Country 3", code: "C3" },
      { name: "Country 4", code: "C4" },
    ];

    // Mock Math.random() to always return 0.5
    const originalMathRandom = Math.random;
    const mockMathRandom = vi
      .fn()
      .mockReturnValueOnce(0.3)
      .mockReturnValueOnce(0.7)
      .mockReturnValueOnce(0.9)
      .mockReturnValueOnce(0.1);

    global.Math.random = mockMathRandom;
    // Call the randomSelect function
    console.log(Math.random());

    const { result, answer } = randomSelect(countries, 4, "room");

    // Restore Math.random()
    Math.random = originalMathRandom;

    // Assertion

    expect(result.length).toBe(4);

    expect(result).toEqual([
      { name: "Country 3", code: "C3" },
      { name: "Country 2", code: "C2" },
      { name: "Country 4", code: "C4" },
      { name: "Country 1", code: "C1" },
    ]);
    expect(answer).toEqual({ name: "Country 3", code: "C3" });
  });
});
