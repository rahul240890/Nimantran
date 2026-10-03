import { describe, expect, it } from "vitest";
import { directionsUrl, mapEmbedUrl, mapsPin } from "./guide";

describe("the venue's map pin", () => {
  it("takes Google Maps links and reads the exact spot when the link has one", () => {
    expect(mapsPin("https://maps.app.goo.gl/AbC123")).toEqual({
      url: "https://maps.app.goo.gl/AbC123",
      coords: null,
    });
    expect(
      mapsPin("https://www.google.com/maps/place/Umaid+Bhawan/@26.2807,73.0475,17z")?.coords,
    ).toBe("26.2807,73.0475");
    expect(mapsPin("https://maps.google.com/?q=26.28,73.04")?.coords).toBe("26.28,73.04");
  });

  it("refuses anything that isn't a Google Maps link", () => {
    expect(mapsPin("")).toBeNull();
    expect(mapsPin("Umaid Bhawan, Jodhpur")).toBeNull();
    expect(mapsPin("http://maps.app.goo.gl/AbC123")).toBeNull();
    expect(mapsPin("https://evil.example/maps")).toBeNull();
    expect(mapsPin("https://www.google.com/search?q=venue")).toBeNull();
    expect(mapsPin("javascript:alert(1)")).toBeNull();
  });
});

describe("directions and the map", () => {
  it("go to the exact spot when the pin has one, else to the address", () => {
    const pin = "https://www.google.com/maps/place/x/@26.2807,73.0475,17z";
    expect(directionsUrl("Umaid Bhawan", "", pin)).toBe(
      "https://www.google.com/maps/dir/?api=1&destination=26.2807%2C73.0475",
    );
    expect(directionsUrl("Umaid Bhawan", "Jodhpur", "")).toBe(
      "https://www.google.com/maps/dir/?api=1&destination=Umaid%20Bhawan%2C%20Jodhpur",
    );
    expect(mapEmbedUrl("Umaid Bhawan", "", pin)).toContain("q=26.2807%2C73.0475");
  });

  it("open a short pin link itself, since it hides the spot", () => {
    expect(directionsUrl("Hall", "", "https://maps.app.goo.gl/AbC123")).toBe(
      "https://maps.app.goo.gl/AbC123",
    );
    // The map can still show the venue by name
    expect(mapEmbedUrl("Hall", "", "https://maps.app.goo.gl/AbC123")).toContain("q=Hall");
  });

  it("are left out when there is nowhere to go", () => {
    expect(directionsUrl(" ", "", "")).toBeNull();
    expect(mapEmbedUrl("", "", "not a link")).toBeNull();
  });
});
