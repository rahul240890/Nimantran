// @vitest-environment node
import { createHmac } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  keyMode,
  maskSecret,
  paymentSignatureValid,
  razorpayStatus,
  webhookSignatureValid,
} from "./razorpay";

vi.mock("server-only", () => ({}));

afterEach(() => vi.unstubAllEnvs());

describe("Razorpay keys", () => {
  it("tell test from live by the key id", () => {
    expect(keyMode("rzp_test_Abc123")).toBe("test");
    expect(keyMode("rzp_live_Abc123")).toBe("live");
    expect(keyMode("sk_live_123")).toBeNull();
    expect(keyMode("")).toBeNull();
  });

  it("never show a secret, only its last four characters", () => {
    vi.stubEnv("RAZORPAY_KEY_ID", "rzp_test_Abc123");
    vi.stubEnv("RAZORPAY_KEY_SECRET", "supersecretvalue9876");
    vi.stubEnv("RAZORPAY_WEBHOOK_SECRET", "");
    const status = razorpayStatus();
    expect(status).toMatchObject({ mode: "test", keySecret: "••••9876", webhookSecret: null });
    expect(status.ready).toBe(true);
    expect(JSON.stringify(status)).not.toContain("supersecret");
    expect(maskSecret("abc")).toBe("••••");
  });
});

describe("signatures", () => {
  const secret = "s3cret";
  const sign = (payload: string) => createHmac("sha256", secret).update(payload).digest("hex");

  it("accept the checkout's proof for its own order and payment only", () => {
    const signature = sign("order_1|pay_1");
    expect(paymentSignatureValid(secret, "order_1", "pay_1", signature)).toBe(true);
    expect(paymentSignatureValid(secret, "order_2", "pay_1", signature)).toBe(false);
    expect(paymentSignatureValid("other", "order_1", "pay_1", signature)).toBe(false);
    expect(paymentSignatureValid(secret, "order_1", "pay_1", "short")).toBe(false);
  });

  it("accept a webhook only with its exact body", () => {
    const body = '{"event":"payment.captured"}';
    expect(webhookSignatureValid(secret, body, sign(body))).toBe(true);
    expect(webhookSignatureValid(secret, `${body} `, sign(body))).toBe(false);
  });
});
