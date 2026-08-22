import { describe, expect, it } from "vitest";
import { ErrorCodes } from "../src/common/errors/errorCodes.js";

describe("ErrorCodes", () => {
  it("defines the standard error codes", () => {
    expect(ErrorCodes.UNAUTHORIZED).toBe("UNAUTHORIZED");
    expect(ErrorCodes.NOT_FOUND).toBe("NOT_FOUND");
    expect(ErrorCodes.INTERNAL_SERVER_ERROR).toBe("INTERNAL_SERVER_ERROR");
  });
});