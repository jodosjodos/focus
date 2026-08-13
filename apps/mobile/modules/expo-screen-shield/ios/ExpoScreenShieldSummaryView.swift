import ExpoModulesCore
import SwiftUI
import FamilyControls
import ManagedSettingsUI

/// Display-only strip of the real Apple-provided icons for a selection token.
/// This is the one place our own UI can show *real* app icons for a Block
/// Mode selection — `FamilyActivitySelection` never exposes bundle IDs/names
/// to our JS layer, but Apple's `Label(ApplicationToken)` SwiftUI initializer
/// is allowed to render the icon/name natively without leaking that data out.
public class ExpoScreenShieldSummaryView: ExpoView {
  private var hostingController: UIHostingController<SummaryRoot>?
  private let model = SummaryModel()

  public required init(appContext: AppContext? = nil) {
    super.init(appContext: appContext)
    let hosting = UIHostingController(rootView: SummaryRoot(model: model))
    hosting.view.backgroundColor = .clear
    hostingController = hosting
    addSubview(hosting.view)
  }

  public override func layoutSubviews() {
    super.layoutSubviews()
    hostingController?.view.frame = bounds
  }

  func updateToken(_ token: String?) {
    guard let token, let data = Data(base64Encoded: token),
      let selection = try? JSONDecoder().decode(FamilyActivitySelection.self, from: data)
    else {
      model.selection = nil
      return
    }
    model.selection = selection
  }
}

private class SummaryModel: ObservableObject {
  @Published var selection: FamilyActivitySelection?
}

private struct SummaryRoot: View {
  @ObservedObject var model: SummaryModel

  var body: some View {
    HStack(spacing: 6) {
      if let selection = model.selection {
        ForEach(Array(selection.applicationTokens.prefix(8)), id: \.self) { token in
          Label(token)
            .labelStyle(.iconOnly)
            .frame(width: 28, height: 28)
        }
      }
    }
  }
}

/// Own module purely so this View resolves unambiguously on the JS side via
/// `requireNativeViewManager('ExpoScreenShieldSummary')` — see the matching
/// comment on `ExpoScreenShieldPickerModule`.
public class ExpoScreenShieldSummaryModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoScreenShieldSummary")
    View(ExpoScreenShieldSummaryView.self) {
      Prop("token") { (view: ExpoScreenShieldSummaryView, token: String?) in
        view.updateToken(token)
      }
    }
  }
}
