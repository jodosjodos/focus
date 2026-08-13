import ExpoModulesCore
import FamilyControls
import ManagedSettings
import Foundation

/// Bridges Apple's FamilyControls/ManagedSettings frameworks to JS for Focus's
/// Screen Blocker Block Mode. Every public function is safe to call even when
/// the Family Controls entitlement isn't present on the build (Simulator, or a
/// real device before Apple approves the entitlement) — calls fail with a typed
/// "unavailable" result instead of throwing an unhandled native crash into JS.
///
/// A `selectionToken` here is a base64-encoded, JSON-encoded `FamilyActivitySelection`.
/// Apple deliberately keeps `FamilyActivitySelection` opaque (no readable bundle
/// IDs/names), so this token is meaningless outside this module — it only ever
/// round-trips between `ExpoScreenShieldPickerView` and `applyShield`.
public class ExpoScreenShieldModule: Module {
  private let store = ManagedSettingsStore(named: .init("focus.screenShield"))

  public func definition() -> ModuleDefinition {
    Name("ExpoScreenShield")

    AsyncFunction("requestAuthorization") { () -> String in
      do {
        try await AuthorizationCenter.shared.requestAuthorization(for: .individual)
        return Self.statusString(AuthorizationCenter.shared.authorizationStatus)
      } catch {
        // A throw here almost always means the entitlement isn't present on
        // this build (no Apple Developer Program / unapproved capability) —
        // there is no distinct error case Apple exposes for that, so we infer
        // it from the status remaining .notDetermined after a failed request.
        if AuthorizationCenter.shared.authorizationStatus == .notDetermined {
          return ShieldStatus.unavailable.rawValue
        }
        return ShieldStatus.denied.rawValue
      }
    }

    AsyncFunction("getAuthorizationStatus") { () -> String in
      Self.statusString(AuthorizationCenter.shared.authorizationStatus)
    }

    AsyncFunction("applyShield") { (selectionToken: String) throws in
      let selection = try Self.decodeSelection(selectionToken)
      store.shield.applications = selection.applicationTokens.isEmpty ? nil : selection.applicationTokens
      store.shield.applicationCategories = selection.categoryTokens.isEmpty
        ? nil
        : ShieldSettings.ActivityCategoryPolicy.specific(selection.categoryTokens)
    }

    AsyncFunction("clearShield") { () in
      store.shield.applications = nil
      store.shield.applicationCategories = nil
    }

    AsyncFunction("isShieldActive") { () -> Bool in
      let hasApps = !(store.shield.applications ?? []).isEmpty
      if case .specific(let categories, _) = store.shield.applicationCategories, !categories.isEmpty {
        return true
      }
      return hasApps
    }
  }

  private enum ShieldStatus: String {
    case approved, denied, notDetermined, unavailable
  }

  private static func statusString(_ status: AuthorizationStatus) -> String {
    switch status {
    case .approved: return ShieldStatus.approved.rawValue
    case .denied: return ShieldStatus.denied.rawValue
    case .notDetermined: return ShieldStatus.notDetermined.rawValue
    @unknown default: return ShieldStatus.unavailable.rawValue
    }
  }

  private static func decodeSelection(_ token: String) throws -> FamilyActivitySelection {
    guard let data = Data(base64Encoded: token) else {
      throw ScreenShieldError.invalidToken
    }
    return try JSONDecoder().decode(FamilyActivitySelection.self, from: data)
  }
}

enum ScreenShieldError: Error, CustomStringConvertible {
  case invalidToken
  var description: String {
    switch self {
    case .invalidToken: return "Selection token could not be decoded."
    }
  }
}
