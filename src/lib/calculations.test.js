import { describe, expect, it } from "vitest";
import { analyseListing, calculatePosition } from "./calculations";

describe("position calculations", () => {
  it("matches the supplied ROI borrowing example", () => {
    const r = calculatePosition({ jurisdiction:"roi", income:55000, savings:28000, firstTime:"yes", target:400000 });
    expect(r.borrowingHigh).toBe(220000);
    expect(r.gap).toBeGreaterThan(0);
    expect(r.financeGap).toBe(152000);
  });
  it("matches the supplied NI borrowing example", () => {
    const r = calculatePosition({ jurisdiction:"ni", income:42000, savings:12000, firstTime:"yes", target:180000 });
    expect(r.borrowingLow).toBe(168000);
    expect(r.borrowingHigh).toBe(189000);
    expect(r.fiveDeposit).toBe(9000);
    expect(r.tenDeposit).toBe(18000);
  });
  it("includes regular rent, savings and pension payments as repayment evidence", () => {
    const r = calculatePosition({
      jurisdiction:"roi", income:55000, savings:28000, firstTime:"yes",
      monthlySavings:500, monthlyRent:1200, monthlyPension:250,
    });
    expect(r.demonstratedMonthly).toBe(1950);
    expect(r.repaymentSupportedLoan).toBeGreaterThan(300000);
  });
});

describe("listing analysis", () => {
  it("flags risky listing language", () => {
    const r = analyseListing({site:"daft",price:250000,location:"Cork",description:"Vacant and in need of modernisation",work:"some"});
    expect(r.flags).toHaveLength(2);
    expect(r.level).toBe("high");
  });
});
