const { withEntitlementsPlist } = require('@expo/config-plugins');

/**
 * Adds the Family Controls entitlement Block Mode's native module needs.
 *
 * This alone doesn't make Block Mode work — the entitlement also has to be
 * approved by Apple against a paid Developer Program account (development
 * entitlement: instant once enrolled; distribution entitlement, needed
 * before TestFlight/App Store: Apple's slower approval process). Until then
 * this entitlement is present in the build but inert — authorization calls
 * fail with a typed "unavailable" result (see ExpoScreenShieldModule.ts)
 * rather than crashing.
 *
 * No Info.plist usage-description key is added here — unlike camera/location,
 * FamilyControls doesn't have a confirmed NSUsageDescription-style key in
 * Apple's docs (entitlement + system consent dialog only). Verify against
 * current Apple docs once Xcode is available before adding one speculatively.
 */
module.exports = function withScreenTime(config) {
  return withEntitlementsPlist(config, (config) => {
    config.modResults['com.apple.developer.family-controls'] = true;
    return config;
  });
};
